#!/usr/bin/env python3
"""Aula — servidor local (archivos estáticos + sync).

Uso:
  python3 server.py
  python3 server.py --port 8080 --pin 1234

Variables:
  AULA_PIN   PIN opcional (cabecera X-Aula-Pin o ?pin=)
  AULA_PORT  puerto (por defecto 8080)
"""
from __future__ import annotations

import argparse
import json
import os
import queue
import socket
import sys
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
STATE_FILE = DATA / "state.json"
LOCK = threading.Lock()
LISTENERS: list[queue.Queue] = []
PIN = os.environ.get("AULA_PIN", "").strip()


def lan_ips() -> list[str]:
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ips.append(s.getsockname()[0])
        s.close()
    except OSError:
        pass
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ip = info[4][0]
            if ip not in ips and not ip.startswith("127."):
                ips.append(ip)
    except OSError:
        pass
    return ips


def load_state() -> dict:
    if not STATE_FILE.exists():
        return {}
    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def save_state(payload: dict) -> dict:
    DATA.mkdir(parents=True, exist_ok=True)
    payload.setdefault("meta", {})
    payload["meta"]["updatedAt"] = int(time.time() * 1000)
    tmp = STATE_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    tmp.replace(STATE_FILE)
    bdir = DATA / "backups"
    bdir.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%Y%m%d-%H%M%S")
    (bdir / f"state-{stamp}.json").write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    olds = sorted(bdir.glob("state-*.json"))
    for f in olds[:-12]:
        try:
            f.unlink()
        except OSError:
            pass
    notify()
    return payload


def notify() -> None:
    dead = []
    for q in LISTENERS:
        try:
            q.put_nowait("update")
        except Exception:
            dead.append(q)
    for q in dead:
        if q in LISTENERS:
            LISTENERS.remove(q)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _json(self, code: int, obj) -> None:
        raw = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def _check_pin(self) -> bool:
        if not PIN:
            return True
        parsed = urlparse(self.path)
        qs = parse_qs(parsed.query)
        got = (
            self.headers.get("X-Aula-Pin")
            or (qs.get("pin") or [""])[0]
            or ""
        )
        if got != PIN:
            self._json(401, {"ok": False, "error": "PIN incorrecto"})
            return False
        return True

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/api/health":
            maint = (DATA / "maintenance").exists()
            self._json(200, {"ok": True, "app": "aula", "pin": bool(PIN), "maintenance": maint})
            return
        if path == "/api/backups":
            if not self._check_pin():
                return
            DATA.mkdir(parents=True, exist_ok=True)
            bdir = DATA / "backups"
            bdir.mkdir(exist_ok=True)
            files = sorted(bdir.glob("state-*.json"), reverse=True)[:20]
            self._json(200, {"ok": True, "files": [f.name for f in files]})
            return
        if path == "/api/info":
            port = self.server.server_address[1]
            urls = [f"http://127.0.0.1:{port}"] + [f"http://{ip}:{port}" for ip in lan_ips()]
            self._json(200, {"ok": True, "urls": urls, "pin": bool(PIN), "hasState": STATE_FILE.exists()})
            return
        if path == "/api/state":
            if not self._check_pin():
                return
            with LOCK:
                data = load_state()
            self._json(200, {"ok": True, "empty": not data, "state": data})
            return
        if path == "/api/events":
            if not self._check_pin():
                return
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream; charset=utf-8")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.end_headers()
            q: queue.Queue = queue.Queue()
            LISTENERS.append(q)
            try:
                self.wfile.write(b"data: hello\n\n")
                self.wfile.flush()
                while True:
                    try:
                        q.get(timeout=20)
                        self.wfile.write(b"data: update\n\n")
                        self.wfile.flush()
                    except queue.Empty:
                        self.wfile.write(b": ping\n\n")
                        self.wfile.flush()
            except (BrokenPipeError, ConnectionResetError, OSError):
                pass
            finally:
                if q in LISTENERS:
                    LISTENERS.remove(q)
            return
        super().do_GET()

    def do_PUT(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path != "/api/state":
            self.send_error(404)
            return
        if not self._check_pin():
            return
        length = int(self.headers.get("Content-Length") or 0)
        if length > 8_000_000:
            self._json(413, {"ok": False, "error": "Demasiado grande"})
            return
        raw = self.rfile.read(length)
        try:
            payload = json.loads(raw.decode("utf-8"))
            if not isinstance(payload, dict):
                raise ValueError("objeto")
        except (json.JSONDecodeError, ValueError):
            self._json(400, {"ok": False, "error": "JSON no válido"})
            return
        with LOCK:
            saved = save_state(payload)
        self._json(200, {"ok": True, "updatedAt": saved.get("meta", {}).get("updatedAt")})

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Aula-Pin")
        self.send_header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
        self.end_headers()


def main() -> None:
    global PIN
    p = argparse.ArgumentParser(description="Servidor Aula")
    p.add_argument("--port", type=int, default=int(os.environ.get("AULA_PORT", "8080")))
    p.add_argument("--pin", default=PIN, help="PIN opcional para la API")
    p.add_argument("--host", default="0.0.0.0")
    args = p.parse_args()
    PIN = (args.pin or "").strip()
    DATA.mkdir(parents=True, exist_ok=True)

    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    urls = [f"http://127.0.0.1:{args.port}"] + [f"http://{ip}:{args.port}" for ip in lan_ips()]
    print("Aula listo")
    for u in urls:
        print("  ", u)
    if PIN:
        print("  PIN activo")
    print("En el móvil, abre la URL de la red local (misma WiFi).")
    print("Ctrl+C para parar.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nAdiós")
        httpd.server_close()


if __name__ == "__main__":
    main()
