(() => {
  "use strict";
  const A = () => window.Aula;
  const esc = (s) => A().esc(s);

  const PORTS = [
    ["20", "TCP", "FTP datos"], ["21", "TCP", "FTP control"], ["22", "TCP", "SSH / SFTP"],
    ["23", "TCP", "Telnet (inseguro)"], ["25", "TCP", "SMTP"], ["53", "UDP/TCP", "DNS"],
    ["67", "UDP", "DHCP servidor"], ["68", "UDP", "DHCP cliente"], ["69", "UDP", "TFTP"],
    ["80", "TCP", "HTTP"], ["88", "TCP", "Kerberos"], ["110", "TCP", "POP3"],
    ["123", "UDP", "NTP"], ["135", "TCP", "RPC (AD)"], ["137", "UDP", "NetBIOS nombre"],
    ["138", "UDP", "NetBIOS datagrama"], ["139", "TCP", "NetBIOS sesión"],
    ["143", "TCP", "IMAP"], ["161", "UDP", "SNMP"], ["162", "UDP", "SNMP trap"],
    ["389", "TCP", "LDAP"], ["443", "TCP", "HTTPS"], ["445", "TCP", "SMB / CIFS"],
    ["465", "TCP", "SMTPS"], ["514", "UDP", "Syslog"], ["587", "TCP", "SMTP envío"],
    ["636", "TCP", "LDAPS"], ["993", "TCP", "IMAPS"], ["995", "TCP", "POP3S"],
    ["1433", "TCP", "SQL Server"], ["1521", "TCP", "Oracle"], ["3306", "TCP", "MySQL"],
    ["3389", "TCP", "RDP"], ["5060", "UDP", "SIP"], ["5432", "TCP", "PostgreSQL"],
    ["5900", "TCP", "VNC"], ["8080", "TCP", "HTTP alt / proxy"], ["8443", "TCP", "HTTPS alt"],
    ["9100", "TCP", "Impresora JetDirect"], ["27017", "TCP", "MongoDB"],
  ];

  const LINUX = [
    ["ip a", "Interfaces e IPs"], ["ip r", "Tabla de rutas"], ["ss -tulpn", "Puertos en escucha"],
    ["ping -c 4 HOST", "Eco ICMP"], ["traceroute HOST", "Camino hasta el host"],
    ["nslookup / dig", "Consulta DNS"], ["chmod 755 archivo", "Permisos octales"],
    ["chown user:grupo f", "Dueño y grupo"], ["systemctl status SERV", "Estado de un servicio"],
    ["journalctl -u SERV -f", "Logs en vivo"], ["df -h", "Espacio en discos"],
    ["du -sh *", "Tamaño de carpetas"], ["lsblk", "Discos y particiones"],
    ["tar -czvf b.tgz dir", "Copia comprimida"], ["rsync -aP orig/ dest/", "Copia incremental"],
    ["scp f user@host:", "Copiar por SSH"], ["sudo -i", "Root interactivo"],
    ["apt update && apt upgrade", "Actualizar Debian/Ubuntu"], ["passwd", "Cambiar contraseña"],
    ["nmcli d", "Dispositivos NetworkManager"], ["ufw status", "Cortafuegos UFW"],
    ["iptables -L -n", "Reglas iptables"], ["hostnamectl", "Nombre y SO"],
  ];
  const CISCO = [
    ["enable", "Modo privilegiado"], ["conf t", "Configuración global"],
    ["show ip int br", "Interfaces e IPs"], ["show run", "Configuración actual"],
    ["show vlan br", "VLANs"], ["show ip route", "Tabla de enrutamiento"],
    ["show mac address-table", "Tabla MAC"], ["int g0/0", "Entrar en interfaz"],
    ["ip address A.B.C.D MASCARA", "IP de interfaz"], ["no shut", "Activar interfaz"],
    ["switchport mode access", "Puerto acceso"], ["switchport access vlan N", "VLAN de acceso"],
    ["encap dot1q N", "Subinterfaz trunk"], ["line vty 0 4", "Acceso remoto"],
    ["login local", "Auth local en VTY"], ["copy run start", "Guardar en NVRAM"],
    ["wr", "Atajo de guardar"], ["ping / traceroute", "Pruebas de red"],
    ["show spanning-tree", "STP"], ["show cdp nei", "Vecinos CDP"],
  ];
  const PSH = [
    ["Get-NetIPConfiguration", "IP, gateway, DNS"], ["Get-NetAdapter", "Tarjetas de red"],
    ["ipconfig /all", "Config IP clásica"], ["Test-NetConnection HOST -Port 443", "Puerto abierto"],
    ["Get-ADUser -Filter *", "Usuarios de dominio"], ["New-ADUser", "Alta de usuario AD"],
    ["Get-ADGroupMember 'Grupo'", "Miembros de un grupo"], ["gpupdate /force", "Aplicar GPO"],
    ["Get-Service", "Servicios Windows"], ["Restart-Service NOMBRE", "Reiniciar servicio"],
    ["Get-EventLog -LogName System -Newest 20", "Eventos"], ["Get-LocalUser", "Usuarios locales"],
    ["net user /domain", "Usuarios del dominio"], ["icacls ruta", "Permisos NTFS"],
    ["Get-SmbShare", "Recursos compartidos"], ["hostname", "Nombre del equipo"],
    ["Get-DnsClientServerAddress", "DNS del cliente"], ["Restart-Computer", "Reiniciar equipo"],
  ];

  const HTTP = [
    ["200", "OK"], ["201", "Created"], ["204", "No Content"], ["301", "Moved Permanently"],
    ["302", "Found"], ["304", "Not Modified"], ["400", "Bad Request"], ["401", "Unauthorized"],
    ["403", "Forbidden"], ["404", "Not Found"], ["405", "Method Not Allowed"],
    ["408", "Timeout"], ["429", "Too Many Requests"], ["500", "Internal Server Error"],
    ["502", "Bad Gateway"], ["503", "Service Unavailable"], ["504", "Gateway Timeout"],
  ];
  const DNSRR = [
    ["A", "IPv4 de un host"], ["AAAA", "IPv6 de un host"], ["CNAME", "Alias de otro nombre"],
    ["MX", "Servidor de correo + prioridad"], ["NS", "Servidor de nombres de la zona"],
    ["PTR", "Inverso (IP → nombre)"], ["SOA", "Inicio de autoridad de zona"],
    ["TXT", "Texto (SPF, DKIM…)"], ["SRV", "Servicio (puerto + host)"],
    ["CAA", "Quién puede emitir certificados"],
  ];
  const OSI = [
    ["7 Aplicación", "HTTP, DNS, SMTP, FTP, SSH"],
    ["6 Presentación", "Cifrado, JPEG, ASCII, TLS (a veces)"],
    ["5 Sesión", "RPC, NetBIOS, sockets de sesión"],
    ["4 Transporte", "TCP, UDP — puertos"],
    ["3 Red", "IP, ICMP, OSPF, routers"],
    ["2 Enlace", "Ethernet, switches, MAC, VLAN"],
    ["1 Física", "Cables, RJ45, fibra, bits"],
  ];
  const ACRO = [
    ["DHCP", "Dynamic Host Configuration Protocol — reparte IP, máscara, GW y DNS"],
    ["DNS", "Domain Name System — nombres ↔ IP"],
    ["NAT", "Network Address Translation — traduce direcciones"],
    ["PAT", "NAT sobrecarga / many-to-one con puertos"],
    ["VLAN", "Virtual LAN — broadcast domain lógico (802.1Q)"],
    ["SSID", "Nombre de la red Wi‑Fi"],
    ["WPA2/WPA3", "Cifrado Wi‑Fi (AES). WEP está obsoleto"],
    ["ACL", "Access Control List — filtra tráfico o NTFS"],
    ["GPO", "Group Policy Object — políticas de AD"],
    ["OU", "Organizational Unit — carpeta lógica en AD"],
    ["SID", "Security Identifier — ID de usuario/grupo Windows"],
    ["NTFS", "Sistema de archivos de Windows con ACL"],
    ["SMB", "Compartir archivos Windows (puerto 445)"],
    ["RDP", "Remote Desktop Protocol (3389)"],
    ["SSH", "Secure Shell (22)"],
    ["VPN", "Red privada virtual (túnel cifrado)"],
    ["DMZ", "Zona desmilitarizada — servidores públicos"],
    ["IDS/IPS", "Detección / prevención de intrusiones"],
    ["2FA", "Segundo factor de autenticación"],
    ["RAID", "Varios discos: rendimiento y/o redundancia"],
    ["CIDR", "IP/prefijo, p.ej. 192.168.1.0/24"],
    ["TTL", "Time To Live — saltos IP o caché DNS"],
    ["MTU", "Unidad máxima de transmisión (1500 Ethernet)"],
    ["STP", "Spanning Tree — evita bucles en L2"],
    ["OSPF", "Enrutamiento de estado de enlace"],
    ["APIPA", "169.254.0.0/16 si no hay DHCP"],
    ["CGNAT", "100.64.0.0/10 — NAT de operador"],
    ["FQDN", "Nombre de dominio completo"],
    ["PKI", "Infraestructura de clave pública / certificados"],
    ["LDAP", "Directorio (AD usa 389 / 636)"],
  ];
  const ICO = {
    net: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 12h6"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`,
    ports: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>`,
    key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="14" r="4"/><path d="M12 14h8v-3M16 14v3"/></svg>`,
    down: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v10M8 11l4 4 4-4"/><path d="M5 19h14"/></svg>`,
    disk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="8" height="16" rx="2"/><rect x="13" y="4" width="8" height="16" rx="2"/></svg>`,
    file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h8l5 5v13H7V3z"/><path d="M15 3v5h5"/></svg>`,
    layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 12l9 5 9-5M3 16l9 5 9-5"/></svg>`,
    hash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 9h14M5 15h14M9 5v14M15 5v14"/></svg>`,
    wifi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12a9 9 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/></svg>`,
    calc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h2M12 12h2M16 12h1M8 16h2M12 16h2"/></svg>`,
    chip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
    list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"/></svg>`,
    bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 3 6 13h6l-1 8 8-12h-6l1-6Z"/></svg>`,
    box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8l9-4 9 4v8l-9 4-9-4V8Z"/><path d="M12 12v8M3 8l9 4 9-4"/></svg>`,
    alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>`,
  };

  function ipToInt(a, b, c, d) { return ((a << 24) >>> 0) + (b << 16) + (c << 8) + d; }
  function intToIp(n) {
    n = n >>> 0;
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  }
  function parseIp(raw) {
    const m = String(raw || "").trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (!m) return null;
    const oct = [+m[1], +m[2], +m[3], +m[4]];
    if (oct.some((n) => n > 255)) return null;
    return oct;
  }
  function calcSubnet(raw) {
    const m = String(raw || "").trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?:\/(\d{1,2}))?$/);
    if (!m) return null;
    const oct = [+m[1], +m[2], +m[3], +m[4]];
    if (oct.some((n) => n > 255)) return null;
    const p = m[5] != null ? +m[5] : 24;
    if (p < 0 || p > 32) return null;
    const ip = ipToInt(oct[0], oct[1], oct[2], oct[3]);
    const mask = p === 0 ? 0 : ((0xFFFFFFFF << (32 - p)) >>> 0);
    const net = (ip & mask) >>> 0;
    const bc = (net | ((~mask) >>> 0)) >>> 0;
    const size = 2 ** (32 - p);
    const usable = p >= 31 ? (p === 32 ? 1 : 2) : size - 2;
    const first = p >= 31 ? net : (net + 1) >>> 0;
    const last = p >= 31 ? bc : (bc - 1) >>> 0;
    const wild = (~mask) >>> 0;
    return {
      ip: intToIp(ip), prefix: p, mask: intToIp(mask), wildcard: intToIp(wild),
      network: intToIp(net), broadcast: intToIp(bc), first: intToIp(first), last: intToIp(last),
      hosts: usable, total: size, clase: oct[0] < 128 ? "A" : oct[0] < 192 ? "B" : oct[0] < 224 ? "C" : "otro",
    };
  }
  function chmodFromBits() {
    const bit = (id) => (document.getElementById(id) && document.getElementById(id).checked ? 1 : 0);
    const u = bit("cm-ur") * 4 + bit("cm-uw") * 2 + bit("cm-ux");
    const g = bit("cm-gr") * 4 + bit("cm-gw") * 2 + bit("cm-gx");
    const o = bit("cm-or") * 4 + bit("cm-ow") * 2 + bit("cm-ox");
    const sym = (n) => `${n & 4 ? "r" : "-"}${n & 2 ? "w" : "-"}${n & 1 ? "x" : "-"}`;
    return { oct: `${u}${g}${o}`, symbolic: `-${sym(u)}${sym(g)}${sym(o)}` };
  }
  function applyOctal(oct) {
    let limpio = String(oct || "").replace(/\D/g, "");
    if (!limpio) return;
    // "4" es --r----- en chmod simbólico → se rellena por la izquierda, no por la derecha
    if (limpio.length > 3) limpio = limpio.slice(-3);   // se ignoran setuid/sticky, avisando fuera
    const s = limpio.padStart(3, "0");
    const ids = [["cm-ur", "cm-uw", "cm-ux"], ["cm-gr", "cm-gw", "cm-gx"], ["cm-or", "cm-ow", "cm-ox"]];
    [...s].forEach((ch, i) => {
      const n = +ch;
      const [r, w, x] = ids[i];
      const set = (id, on) => { const el = document.getElementById(id); if (el) el.checked = on; };
      set(r, !!(n & 4)); set(w, !!(n & 2)); set(x, !!(n & 1));
    });
  }
  // Entero aleatorio sin sesgo (descarta la cola que no cabe en el rango)
  function randInt(max) {
    const limite = Math.floor(0xffffffff / max) * max;
    const c = window.crypto || null;
    if (!c || typeof c.getRandomValues !== "function") return Math.floor(Math.random() * max);
    const buf = new Uint32Array(1);
    let v;
    do { c.getRandomValues(buf); v = buf[0]; } while (v >= limite);
    return v % max;
  }
  function genPass(len, opts) {
    const sets = [];
    if (opts.lower) sets.push("abcdefghijkmnopqrstuvwxyz");
    if (opts.upper) sets.push("ABCDEFGHJKLMNPQRSTUVWXYZ");
    if (opts.num) sets.push("23456789");
    if (opts.sym) sets.push("!@#$%&*-_+?");
    if (!sets.length) sets.push("abcdefghijkmnopqrstuvwxyz");
    const all = sets.join("");
    len = Math.max(4, Math.min(128, Number(len) || 16));
    const out = [];
    // Uno de cada conjunto marcado, para que cumpla las reglas de AD y de los sitios web
    sets.forEach((s) => out.push(s[randInt(s.length)]));
    while (out.length < len) out.push(all[randInt(all.length)]);
    // Mezcla (Fisher-Yates) para que los obligatorios no queden al principio
    for (let i = out.length - 1; i > 0; i--) { const j = randInt(i + 1); [out[i], out[j]] = [out[j], out[i]]; }
    return out.slice(0, len).join("");
  }
  function fmtTime(sec) {
    if (!isFinite(sec) || sec < 0) return "—";
    if (sec < 60) return sec.toFixed(1) + " s";
    if (sec < 3600) return (sec / 60).toFixed(1) + " min";
    const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
    return h + " h " + m + " min";
  }
  // Cada resultado se puede tocar para copiarlo (el toast «Copiado» es el feedback).
  function kv(rows) {
    return rows.map(([k, v]) => `<button type="button" class="kv" data-action="copy-text" data-text="${esc(v)}" aria-label="Copiar ${esc(k)}: ${esc(v)}"><span>${esc(k)}</span><b>${esc(v)}</b></button>`).join("");
  }
  // Tira de 32 bits: los de red en un color y los de host en otro (el «préstamo de bits» a la vista).
  function bitsViz(prefix) {
    const p = Math.max(0, Math.min(32, prefix | 0));
    let cells = "";
    for (let i = 0; i < 32; i++) cells += `<i class="${i < p ? "bit-n" : "bit-h"}"></i>`;
    return `<div class="bits-viz" role="img" aria-label="${p} bits de red y ${32 - p} de host">${cells}</div>
      <div class="bits-leyenda"><span><i class="bit-n"></i> Red (${p})</span><span><i class="bit-h"></i> Host (${32 - p})</span></div>`;
  }
  function st() { return A().state; }

  const CATS = [
    ["Red", "blue", [
      ["subnet", "blue", "net", "Subnetting IPv4", "CIDR, broadcast y hosts"],
      ["vlsm", "sky", "calc", "Hosts → CIDR", "Prefijo mínimo para N equipos"],
      ["ipbin", "sky", "hash", "IP ↔ binario", "Octetos en bits"],
      ["ranges", "green", "globe", "Clases y rangos", "Privadas, APIPA, CGNAT…"],
      ["wild", "green", "net", "Wildcard ACL", "Máscara inversa Cisco"],
      ["ipv6", "teal", "globe", "IPv6", "Comprimir / expandir"],
      ["vlan", "teal", "layers", "VLAN 802.1Q", "ID, rango y tag"],
      ["t568", "amber", "bolt", "T568A / T568B", "Pinout RJ45"],
      ["cable", "orange", "bolt", "Directo vs cruzado", "Cuándo cada cable"],
      ["wifi", "violet", "wifi", "Canales Wi‑Fi", "2,4 GHz y 5 GHz"],
      ["dns", "violet", "globe", "Registros DNS", "A, AAAA, MX, PTR…"],
      ["osi", "violet", "layers", "Modelo OSI", "7 capas y ejemplos"],
      ["nat", "rose", "net", "NAT / PAT", "Tipos y puertos"],
      ["macbit", "rose", "chip", "Dirección MAC", "Local/global, unicast"],
      ["dhcp", "sky", "calc", "Ámbito DHCP", "Leases de un rango"],
    ]],
    ["Sistemas", "slate", [
      ["chmod", "violet", "lock", "Permisos CHMOD", "Octal y simbólico"],
      ["ntfs", "violet", "lock", "NTFS vs compartir", "Permisos Windows"],
      ["raid", "rose", "disk", "Calculadora RAID", "Capacidad 0/1/5/6/10"],
      ["units", "rose", "disk", "GB vs GiB", "Base 10 vs Base 2"],
      ["backup", "sky", "down", "Tiempo de copia", "GB a Mbps"],
      ["fw", "red", "lock", "Cortafuegos", "iptables, UFW, firewalld"],
      ["remote", "orange", "globe", "Acceso remoto", "SSH, RDP, VNC"],
      ["systemd", "grey", "chip", "systemd", "Comandos de servicio"],
      ["poe", "lime", "bolt", "PoE", "802.3af / at / bt"],
      ["pass", "amber", "key", "Generador Pass", "AD y root"],
      ["beeps", "amber", "chip", "Beeps BIOS", "AMI / Award / Phoenix"],
    ]],
    ["Consulta", "green", [
      ["ports", "green", "ports", "Puertos SMR", "TCP / UDP y protocolos"],
      ["http", "blue", "globe", "Códigos HTTP", "200, 404, 502…"],
      ["acro", "teal", "list", "Acrónimos SMR", "DHCP, VLAN, GPO…"],
      ["sheet", "green", "file", "Chuleta de comandos", "Linux, Cisco, PowerShell"],
      ["ascii", "grey", "list", "Tabla ASCII", "32–126"],
    ]],
    ["Utilidades", "violet", [
      ["conv", "lime", "calc", "Bin / Dec / Hex", "Conversor de bases"],
      ["hash", "grey", "hash", "Hash SHA-256", "Huella local"],
      ["b64", "grey", "file", "Base64", "Codificar / decodificar"],
      ["json", "sky", "file", "JSON", "Indentar o compactar"],
      ["regex", "violet", "hash", "Regex", "Probar una expresión"],
      ["uuid", "violet", "chip", "UUID", "Identificador aleatorio"],
      ["cron", "amber", "calc", "Cron", "Min hora día mes sem"],
      ["faltas", "red", "alert", "Calculadora de Faltas", "Límite y pérdida de continua"],
    ]],
  ];

  /* Buscador del taller: filtra por nombre, explicación o sección. Antes había que bajar por una
     lista de 30 tarjetas a ojo; ahora se escribe «chmod» o «subnet» y queda a la vista. */
  function filtrar(q) {
    const t = String(q || "").trim().toLowerCase();
    if (!t) return CATS;
    return CATS.map(([cat, color, cards]) => [cat, color, cards.filter(([id, c, ico, titulo, sub]) =>
      (titulo + " " + sub + " " + cat + " " + id).toLowerCase().includes(t))])
      .filter(([, , cards]) => cards.length);
  }

  function gridHTML() {
    const q = (st()._toolsQ || "").trim();
    const cats = filtrar(q);
    const total = cats.reduce((n, [, , cards]) => n + cards.length, 0);
    if (!total) return `<div class="empty"><b>Nada con «${esc(q)}»</b>
      <p>Prueba con «subnet», «chmod», «puerto» o «cable».</p></div>`;
    return cats.map(([cat, color, cards]) => `
      <div class="tools-sec" style="--c:var(--acc-${color === "slate" ? "grey" : color}, var(--ink))">${esc(cat)}</div>
      <div class="tools-grid">${cards.map(([id, c, ico, t, s]) => `<button class="tool-card${id === "sheet" ? " tool-wide" : ""}" data-action="tool-open" data-id="${id}">
        <div class="tool-ico" style="--c:var(--acc-${color === "slate" ? "grey" : color}, var(--ink))">${ICO[ico] || ICO.net}</div>
        <b>${esc(t)}</b><small>${esc(s)}</small>
      </button>`).join("")}</div>
    `).join("");
  }

  function home() {
    // La cabecera de la vista ya pone «Herramientas»: aquí no se repite el título.
    return `
      <div class="tools-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input id="tools-q" type="search" autocomplete="off" placeholder="Buscar: subnet, chmod, puertos…" value="${esc(st()._toolsQ || "")}" aria-label="Buscar herramienta">
        ${(st()._toolsQ || "") ? `<button type="button" class="tools-q-x" data-action="tools-clear-q" aria-label="Borrar la búsqueda">×</button>` : ""}
      </div>
      <div id="tools-body">${gridHTML()}</div>
      <p class="hint tools-foot">Todo corre en el móvil. Nada se envía a internet.</p>
    `;
  }

  function wrap(title, body) {
    return `<button type="button" class="tool-back" data-action="tool-back" aria-label="Volver a herramientas">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M15 6 9 12l6 6"/></svg>
        <span>Herramientas</span>
      </button>
      <h2 class="tool-title">${esc(title)}</h2>${body}`;
  }
  function cardBox(inner) { return `<div class="card">${inner}</div>`; }
  function liveBtn(action, label) {
    return `<button class="btn btn-primary btn-block" data-action="${action}">${label}</button>`;
  }

  const BEEPS = {
    AMI: [["1 corto", "Todo bien (POST ok)"], ["2 cortos", "Error de paridad"], ["3 cortos", "Fallo de memoria (primeros 64K)"], ["4 cortos", "Temporizador del sistema"], ["5 cortos", "Error de proceso"], ["6 cortos", "Teclado (puerta A20)"], ["7 cortos", "Excepción del procesador"], ["8 cortos", "Memoria de vídeo"], ["9 cortos", "Checksum de la ROM"], ["1 largo, 2 cortos", "Vídeo (mono/CGA)"], ["1 largo, 3 cortos", "Vídeo (EGA)"], ["1 largo, 8 cortos", "Test de pantalla fallido"]],
    Award: [["1 corto", "POST ok"], ["2 cortos", "Error de CMOS / paridad"], ["1 largo, 1 corto", "Placa base"], ["1 largo, 2 cortos", "Tarjeta de vídeo"], ["1 largo, 3 cortos", "Teclado"], ["1 largo, 9 cortos", "Checksum de la ROM"], ["Pitidos continuos", "Memoria o vídeo"], ["Pitidos rápidos", "Sobrecalentamiento / fuente"]],
    Phoenix: [["1-1-1", "Fallo de placa"], ["1-1-2", "Placa base"], ["1-1-3", "CMOS"], ["1-1-4", "BIOS ROM"], ["1-2-1", "Temporizador"], ["1-3-1", "RAM (refresco)"], ["2-2-3", "Puerto serie"], ["3-1-1", "Placa (canal DMA)"], ["3-2-4", "Teclado"], ["3-3-4", "Vídeo"], ["4-3-1", "Memoria (dirección)"]],
  };
  function panel() {
    const id = st()._tool;
    if (id === "subnet") return wrap("Subnetting IPv4", cardBox(`
      <div class="field"><label>IP / CIDR</label>
        <input id="sn-ip" value="192.168.1.10/24" placeholder="192.168.1.10/24"></div>
      ${liveBtn("tool-subnet", "Calcular")}
      <div id="sn-out" class="tool-out"></div>`));
    if (id === "vlsm") return wrap("Hosts → CIDR", cardBox(`
      <div class="field"><label>Equipos que necesitas</label>
        <input id="vl-n" type="number" min="1" value="50"></div>
      ${liveBtn("tool-vlsm", "Calcular")}
      <div id="vl-out" class="tool-out"></div>
      <p class="hint">Suma 2 (red + broadcast). Elige el prefijo más pequeño que cubre.</p>`));
    if (id === "ipbin") return wrap("IP ↔ binario", cardBox(`
      <div class="field"><label>IPv4</label><input id="ib-ip" value="192.168.1.10"></div>
      ${liveBtn("tool-ipbin", "Convertir")}
      <div id="ib-out" class="tool-out"></div>`));
    if (id === "ranges") return wrap("Clases y rangos", `
      <div class="field"><label>Comprobar IP</label><input id="rg-ip" placeholder="10.0.0.5"></div>
      ${liveBtn("tool-ranges", "Clasificar")}
      <div id="rg-out" class="tool-out"></div>
      <div class="info-list" style="margin-top:10px">
        ${[
          ["Clase A", "1.0.0.0 – 126.255.255.255  /8"],
          ["Clase B", "128.0.0.0 – 191.255.255.255  /16"],
          ["Clase C", "192.0.0.0 – 223.255.255.255  /24"],
          ["Privada A", "10.0.0.0/8"],
          ["Privada B", "172.16.0.0/12"],
          ["Privada C", "192.168.0.0/16"],
          ["Loopback", "127.0.0.0/8"],
          ["APIPA", "169.254.0.0/16"],
          ["CGNAT", "100.64.0.0/10"],
          ["Multicast", "224.0.0.0/4"],
        ].map(([k, v]) => `<div class="info-row"><b>${k}</b><span>${v}</span></div>`).join("")}
      </div>`);
    if (id === "wild") return wrap("Wildcard ACL", cardBox(`
      <div class="field"><label>Prefijo o máscara</label>
        <input id="wd-in" value="24" placeholder="24, /24 o 255.255.255.0"></div>
      ${liveBtn("tool-wild", "Calcular")}
      <div id="wd-out" class="tool-out"></div>`));
    if (id === "ipv6") return wrap("IPv6", cardBox(`
      <div class="field"><label>Dirección</label>
        <input id="v6-in" value="2001:db8:85a3::8a2e:370:7334"></div>
      ${liveBtn("tool-ipv6", "Normalizar")}
      <div id="v6-out" class="tool-out"></div>`));
    if (id === "vlan") return wrap("VLAN 802.1Q", `
      ${cardBox(`<p class="hint" style="margin-top:0">Tag de 12 bits. El frame Ethernet gana 4 bytes (TPID 0x8100).</p>
        <div class="info-list">
          <div class="info-row"><b>Rango usable</b><span>1 – 4094</span></div>
          <div class="info-row"><b>Reservadas</b><span>0 y 4095</span></div>
          <div class="info-row"><b>Nativa (Cisco)</b><span>VLAN 1 por defecto</span></div>
          <div class="info-row"><b>Access</b><span>1 VLAN, sin tag al PC</span></div>
          <div class="info-row"><b>Trunk</b><span>Varias VLAN, con tag</span></div>
        </div>`)}`);
    if (id === "t568") {
      const A = [["1", "#dcfce7", "Blanco/Verde"], ["2", "green", "Verde"], ["3", "#fef9c3", "Blanco/Naranja"], ["4", "blue", "Azul"], ["5", "#dbeafe", "Blanco/Azul"], ["6", "orange", "Naranja"], ["7", "#e9d5ff", "Blanco/Marrón"], ["8", "#92400e", "Marrón"]];
      const B = [["1", "#fef9c3", "Blanco/Naranja"], ["2", "orange", "Naranja"], ["3", "#dcfce7", "Blanco/Verde"], ["4", "blue", "Azul"], ["5", "#dbeafe", "Blanco/Azul"], ["6", "green", "Verde"], ["7", "#e9d5ff", "Blanco/Marrón"], ["8", "#92400e", "Marrón"]];
      const conector = (rows) => `<svg class="rj45" viewBox="0 0 96 44" role="img" aria-label="Conector RJ45, pines 1 a 8 de izquierda a derecha">
        <rect x="2" y="2" width="92" height="30" rx="6" fill="none" stroke="var(--line-2)" stroke-width="1.5"/>
        ${rows.map(([, c], i) => `<rect x="${7 + i * 10.5}" y="6" width="8" height="18" rx="2" fill="${c}"></rect>`).join("")}
        ${rows.map(([n], i) => `<text x="${11 + i * 10.5}" y="40" text-anchor="middle" font-size="7" fill="var(--muted)">${n}</text>`).join("")}
      </svg>`;
      const col = (rows, title) => `<div class="card"><h3 style="text-transform:none;font-size:15px;color:var(--ink)">${title}</h3>
        ${conector(rows)}
        <div class="pinout">${rows.map(([n, c, l]) => `<div><b>${n}</b><i class="pin-dot" style="background:${c}"></i>${l}</div>`).join("")}</div></div>`;
      return wrap("T568A / T568B", col(A, "T568A") + col(B, "T568B") + `<p class="hint">En Europa suele usarse T568B en los dos extremos (cable directo).</p>`);
    }
    if (id === "cable") return wrap("Directo vs cruzado", `
      ${cardBox(`<div class="info-list">
        <div class="info-row"><b>Directo</b><span>Mismo estándar en ambos (A-A o B-B)</span></div>
        <div class="info-row"><b>Cruzado</b><span>T568A en un lado, T568B en el otro</span></div>
        <div class="info-row"><b>PC ↔ switch</b><span>Directo</span></div>
        <div class="info-row"><b>Router ↔ switch</b><span>Directo</span></div>
        <div class="info-row"><b>PC ↔ PC (viejos)</b><span>Cruzado (hoy auto-MDIX)</span></div>
        <div class="info-row"><b>Router ↔ router</b><span>Cruzado si no hay auto-MDIX</span></div>
      </div>`)}`);
    if (id === "wifi") return wrap("Canales Wi‑Fi", `
      ${cardBox(`<p class="hint" style="margin-top:0">2,4 GHz: 14 canales (Europa 1–13). No solapan: 1, 6, 11.</p>
        <div class="info-list">
          <div class="info-row"><b>Canal 1</b><span>2412 MHz</span></div>
          <div class="info-row"><b>Canal 6</b><span>2437 MHz</span></div>
          <div class="info-row"><b>Canal 11</b><span>2462 MHz</span></div>
          <div class="info-row"><b>Canal 13</b><span>2472 MHz (EU)</span></div>
          <div class="info-row"><b>5 GHz</b><span>36–64, 100–140, 149–165</span></div>
          <div class="info-row"><b>Ancho</b><span>20 / 40 / 80 / 160 MHz</span></div>
        </div>`)}`);
    if (id === "dns") return wrap("Registros DNS", `<p class="hint" style="margin-top:0">Toca un registro para copiarlo.</p>
      <div class="info-list">${DNSRR.map(([k, v]) => `<button type="button" class="info-row" data-action="copy-text" aria-label="Copiar ${esc(k)}" data-text="${k}"><b>${k}</b><span>${esc(v)}</span></button>`).join("")}</div>`);
    if (id === "osi") return wrap("Modelo OSI", `<div class="info-list">${OSI.map(([k, v]) => `<div class="info-row"><b>${k}</b><span>${esc(v)}</span></div>`).join("")}
      <p class="hint">TCP/IP agrupa 5–7 en «Aplicación» y 1–2 a veces en «Acceso a red».</p>`);
    if (id === "nat") return wrap("NAT / PAT", `
      ${cardBox(`<div class="info-list">
        <div class="info-row"><b>Estático</b><span>1 pública ↔ 1 privada</span></div>
        <div class="info-row"><b>Dinámico</b><span>Pool de públicas</span></div>
        <div class="info-row"><b>PAT / overload</b><span>Muchas privadas → 1 pública + puerto</span></div>
        <div class="info-row"><b>Port forwarding</b><span>Público:puerto → interno:puerto</span></div>
        <div class="info-row"><b>CGNAT</b><span>100.64.0.0/10 (operador)</span></div>
      </div>`)}`);
    if (id === "macbit") return wrap("Dirección MAC", cardBox(`
      <div class="field"><label>MAC</label><input id="mac-in" placeholder="00:1A:2B:3C:4D:5E"></div>
      ${liveBtn("tool-mac", "Analizar")}
      <div id="mac-out" class="tool-out"></div>
      <p class="hint">Bit I/G (primero): 0 unicast, 1 multicast. Bit U/L: 0 global (IEEE), 1 local.</p>`));
    if (id === "dhcp") return wrap("Ámbito DHCP", cardBox(`
      <div class="field"><label>Red CIDR</label><input id="dh-cidr" value="192.168.10.0/24"></div>
      ${liveBtn("tool-dhcp", "Leases")}
      <div id="dh-out" class="tool-out"></div>`));
    if (id === "chmod") return wrap("Permisos CHMOD", cardBox(`
      <div class="chmod-grid">
        ${[["u", "Usuario"], ["g", "Grupo"], ["o", "Otros"]].map(([k, lab]) => `
          <div class="chmod-col">
            <div class="k">${lab}</div>
            <div class="chmod-bits">
              <label class="chmod-bit${k === "u" || k === "g" || k === "o" ? " is-on" : ""}"><input type="checkbox" id="cm-${k}r" data-action="tool-chmod"${k === "u" || k === "g" || k === "o" ? " checked" : ""}><span>r</span></label>
              <label class="chmod-bit${k === "u" ? " is-on" : ""}"><input type="checkbox" id="cm-${k}w" data-action="tool-chmod"${k === "u" ? " checked" : ""}><span>w</span></label>
              <label class="chmod-bit${k === "u" || k === "g" || k === "o" ? " is-on" : ""}"><input type="checkbox" id="cm-${k}x" data-action="tool-chmod"${k === "u" || k === "g" || k === "o" ? " checked" : ""}><span>x</span></label>
            </div>
          </div>`).join("")}
      </div>
      <div class="field" style="margin-top:12px"><label>Octal</label>
        <input id="cm-oct" value="755" maxlength="3"></div>
      ${liveBtn("tool-chmod-oct", "Aplicar octal")}
      <div id="cm-out" class="tool-out"></div>`));
    if (id === "ntfs") return wrap("NTFS vs compartir", `
      ${cardBox(`<div class="info-list">
        <div class="info-row"><b>NTFS</b><span>En el disco, ACL por usuario/grupo</span></div>
        <div class="info-row"><b>Compartir (SMB)</b><span>Quién entra por red</span></div>
        <div class="info-row"><b>Efectivo</b><span>El más restrictivo de los dos</span></div>
        <div class="info-row"><b>Herencia</b><span>Las carpetas hijas copian ACL</span></div>
        <div class="info-row"><b>icacls</b><span>Ver/cambiar NTFS en cmd</span></div>
      </div>`)}`);
    if (id === "raid") return wrap("Calculadora RAID", cardBox(`
      <div class="form-row">
        <div class="field"><label>Discos</label><input id="rd-n" type="number" min="1" value="4"></div>
        <div class="field"><label>Tamaño cada uno (GB)</label><input id="rd-gb" type="number" value="1000"></div>
      </div>
      <div class="field"><label>Nivel</label>
        <select id="rd-lv"><option>0</option><option>1</option><option selected>5</option><option>6</option><option>10</option></select></div>
      ${liveBtn("tool-raid", "Calcular")}
      <div id="rd-out" class="tool-out"></div>`));
    if (id === "units") return wrap("GB vs GiB", cardBox(`
      <div class="field"><label>Cantidad</label><input id="un-n" type="number" step="0.01" value="1"></div>
      <div class="field"><label>De</label>
        <select id="un-from">
          <option value="GB">GB (10³, disco / marketing)</option>
          <option value="GiB">GiB (2¹⁰, RAM / SO)</option>
          <option value="MB">MB</option><option value="MiB">MiB</option>
          <option value="TB">TB</option><option value="TiB">TiB</option>
        </select></div>
      ${liveBtn("tool-units", "Convertir")}
      <div id="un-out" class="tool-out"></div>`));
    if (id === "backup") return wrap("Tiempo de copia", cardBox(`
      <div class="form-row">
        <div class="field"><label>Tamaño (GB)</label><input id="bk-gb" type="number" step="0.1" value="100"></div>
        <div class="field"><label>Velocidad (Mbps)</label><input id="bk-mbps" type="number" step="1" value="100"></div>
      </div>
      ${liveBtn("tool-backup", "Calcular")}
      <div id="bk-out" class="tool-out"></div>
      <p class="hint">1 byte = 8 bits. En LAN GbE (~940 Mbps reales) 100 GB ronda 15 min.</p>`));
    if (id === "fw") return wrap("Cortafuegos", `
      ${cardBox(`<div class="info-list">
        <div class="info-row"><b>iptables</b><span>Linux clásico (netfilter)</span></div>
        <div class="info-row"><b>nftables</b><span>Sustituto moderno de iptables</span></div>
        <div class="info-row"><b>firewalld</b><span>Zonas (RHEL / Fedora)</span></div>
        <div class="info-row"><b>UFW</b><span>Frente simple (Ubuntu)</span></div>
        <div class="info-row"><b>Windows</b><span>Firewall de Windows / wf.msc</span></div>
        <div class="info-row"><b>Política</b><span>Default deny + permitir lo justo</span></div>
      </div>`)}`);
    if (id === "remote") return wrap("Acceso remoto", `
      ${cardBox(`<div class="info-list">
        <div class="info-row"><b>SSH</b><span>22 TCP — Linux / red</span></div>
        <div class="info-row"><b>RDP</b><span>3389 TCP — escritorio Windows</span></div>
        <div class="info-row"><b>VNC</b><span>5900 TCP — escritorio gráfico</span></div>
        <div class="info-row"><b>WinRM</b><span>5985 / 5986 — PowerShell remota</span></div>
        <div class="info-row"><b>Telnet</b><span>23 — inseguro, no usar</span></div>
      </div>`)}`);
    if (id === "systemd") return wrap("systemd", `<p class="hint" style="margin-top:0">Toca un comando para copiarlo.</p>
      <div class="cmd-list">${[
      ["systemctl status SERV", "Estado"],
      ["systemctl start SERV", "Arrancar"],
      ["systemctl stop SERV", "Parar"],
      ["systemctl restart SERV", "Reiniciar"],
      ["systemctl enable SERV", "Al arranque"],
      ["systemctl disable SERV", "Quitar del arranque"],
      ["journalctl -u SERV -f", "Logs en vivo"],
      ["systemctl daemon-reload", "Recargar unidades"],
    ].map(([c, d]) => `<button type="button" class="cmd-row" data-action="copy-text" aria-label="Copiar ${esc(c)}" data-text="${esc(c)}"><code>${esc(c)}</code><span>${esc(d)}</span></button>`).join("")}</div>`);
    if (id === "poe") return wrap("PoE", `
      ${cardBox(`<div class="info-list">
        <div class="info-row"><b>802.3af (PoE)</b><span>~15,4 W (12,95 en el PD)</span></div>
        <div class="info-row"><b>802.3at (PoE+)</b><span>~30 W</span></div>
        <div class="info-row"><b>802.3bt (PoE++)</b><span>60–90 W</span></div>
        <div class="info-row"><b>Uso</b><span>AP, cámaras, teléfonos IP</span></div>
      </div>`)}`);
    if (id === "pass") return wrap("Generador de contraseñas", cardBox(`
      <div class="field"><label>Longitud</label>
        <input type="range" id="pw-len" min="8" max="32" value="16">
        <div id="pw-len-lbl" class="hint" style="text-align:center">16 caracteres</div></div>
      <label class="switch"><span class="switch-t">minúsculas</span><input type="checkbox" role="switch" id="pw-l" checked></label>
      <label class="switch"><span class="switch-t">MAYÚSCULAS</span><input type="checkbox" role="switch" id="pw-u" checked></label>
      <label class="switch"><span class="switch-t">números</span><input type="checkbox" role="switch" id="pw-n" checked></label>
      <label class="switch"><span class="switch-t">símbolos</span><input type="checkbox" role="switch" id="pw-s"></label>
      ${liveBtn("tool-pass", "Generar")}
      <div id="pw-out" class="tool-pass"></div>`));
    if (id === "ports") return wrap("Puertos SMR", `
      <input class="note-search" id="pt-q" placeholder="Buscar puerto o servicio…">
      <p class="hint" style="margin-top:8px">Toca un puerto para copiarlo.</p>
      <div id="pt-list" class="port-list">${portRows("")}</div>`);
    if (id === "http") return wrap("Códigos HTTP", `
      <input class="note-search" id="ht-q" placeholder="Buscar código…">
      <p class="hint" style="margin-top:8px">Toca un código para copiarlo.</p>
      <div id="ht-list" class="info-list">${httpRows("")}</div>`);
    if (id === "acro") return wrap("Acrónimos SMR", `
      <input class="note-search" id="ac-q" placeholder="Buscar DHCP, VLAN…">
      <p class="hint" style="margin-top:8px">Toca un acrónimo para copiarlo.</p>
      <div id="ac-list" class="info-list">${acroRows("")}</div>`);
    if (id === "sheet") {
      const tab = st()._sheetTab || "linux";
      return wrap("Chuleta de comandos", `
        <div class="hub-seg" role="tablist" aria-label="Sistema de la chuleta">
          <button role="tab" aria-selected="${tab === "linux"}" data-action="sheet-tab" data-id="linux" class="${tab === "linux" ? "is-on" : ""}">Linux</button>
          <button role="tab" aria-selected="${tab === "cisco"}" data-action="sheet-tab" data-id="cisco" class="${tab === "cisco" ? "is-on" : ""}">Cisco</button>
          <button role="tab" aria-selected="${tab === "psh"}" data-action="sheet-tab" data-id="psh" class="${tab === "psh" ? "is-on" : ""}">PowerShell</button>
        </div>
        <input class="note-search" id="sh-q" placeholder="Buscar por comando o descripción («crear vlan»)…" value="${esc(st()._sheetQ || "")}">
        <p class="hint">Toca un comando para copiarlo.</p>
        <div class="cmd-list" id="sh-list">${sheetRows(tab, st()._sheetQ || "")}</div>
      `);
    }
    if (id === "beeps") {
      const v = st()._beepTab || "AMI";
      const rows = BEEPS[v] || BEEPS.AMI;
      return wrap("Pitidos de la BIOS", `
        <div class="hub-seg" role="tablist" aria-label="Fabricante de la BIOS">
          ${["AMI", "Award", "Phoenix"].map((k) => `<button role="tab" aria-selected="${v === k}" data-action="beep-tab" data-id="${k}" class="${v === k ? "is-on" : ""}">${k}</button>`).join("")}
        </div>
        <p class="hint">Cuenta los pitidos al arrancar y míralos aquí.</p>
        <div class="info-list">${rows.map(([k, d]) => `<div class="info-row"><b>${esc(k)}</b><span>${esc(d)}</span></div>`).join("")}</div>
      `);
    }
    if (id === "ascii") {
      let rows = "";
      for (let i = 32; i <= 126; i++) {
        rows += `<button type="button" class="info-row" data-action="copy-text" aria-label="Copiar ${i}" data-text="${i}"><b>${i}</b><span>${esc(String.fromCharCode(i))} · 0x${i.toString(16)}</span></button>`;
      }
      return wrap("Tabla ASCII", `<p class="hint" style="margin-top:0">Toca un carácter para copiar su código.</p>
      <div class="info-list">${rows}</div>`);
    }
    if (id === "conv") return wrap("Bin / Dec / Hex", cardBox(`
      <div class="field"><label>Número</label><input id="cv-n" value="255"></div>
      <div class="field"><label>Base de entrada</label>
        <select id="cv-from"><option value="10">Decimal</option><option value="2">Binario</option><option value="8">Octal</option><option value="16">Hex</option></select></div>
      ${liveBtn("tool-conv", "Convertir")}
      <div id="cv-out" class="tool-out"></div>`));
    if (id === "hash") return wrap("Hash SHA-256", cardBox(`
      <div class="field"><label>Texto</label><textarea id="hs-in" rows="3">Aula SMR</textarea></div>
      ${liveBtn("tool-hash", "Calcular")}
      <div id="hs-out" class="tool-out"></div>`));
    if (id === "b64") return wrap("Base64", cardBox(`
      <div class="field"><label>Texto</label><textarea id="b64-in" rows="3"></textarea></div>
      <div class="hero-actions">
        <button class="btn btn-primary" data-action="tool-b64-enc">Codificar</button>
        <button class="btn" data-action="tool-b64-dec">Decodificar</button>
      </div>
      <div id="b64-out" class="tool-out"></div>`));
    if (id === "json") return wrap("JSON", cardBox(`
      <div class="field"><label>JSON</label><textarea id="js-in" rows="6">{"modulo":"SMR","ok":true}</textarea></div>
      <div class="hero-actions">
        <button class="btn btn-primary" data-action="tool-json-pretty">Indentar</button>
        <button class="btn" data-action="tool-json-min">Compactar</button>
      </div>
      <div id="js-out" class="tool-out"></div>`));
    if (id === "regex") return wrap("Regex", cardBox(`
      <div class="field"><label>Expresión</label><input id="rx-e" value="^\\d{1,3}(\\.\\d{1,3}){3}$"></div>
      <div class="field"><label>Texto</label><input id="rx-t" value="192.168.1.10"></div>
      <div class="field"><label for="rx-f">Banderas</label><input id="rx-f" placeholder="g i m" value="g" /></div>
      ${liveBtn("tool-regex", "Probar")}
      <div id="rx-out" class="tool-out"></div>`));
    if (id === "uuid") return wrap("UUID", cardBox(`
      ${liveBtn("tool-uuid", "Generar")}
      <div id="uu-out" class="tool-pass"></div>`));
    if (id === "cron") return wrap("Cron", cardBox(`
      <p class="hint" style="margin-top:0">min hora día-mes mes día-semana</p>
      <div class="info-list">
        <div class="info-row"><b>* * * * *</b><span>cada minuto</span></div>
        <div class="info-row"><b>0 8 * * 1-5</b><span>8:00 L–V</span></div>
        <div class="info-row"><b>0 0 1 * *</b><span>el día 1 a medianoche</span></div>
        <div class="info-row"><b>*/15 * * * *</b><span>cada 15 min</span></div>
        <div class="info-row"><b>0 2 * * 0</b><span>domingos 02:00</span></div>
      </div>`));
    if (id === "faltas") return wrap("Calculadora de Faltas", faltasBody());
    return home();
  }

  function copyFallback(t, done) {
    try {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    } catch {}
    if (done) done();
  }
  function copyText(t) {
    if (!t) return;
    const done = () => A().toast("Copiado");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(done).catch(() => copyFallback(t, done));
    } else copyFallback(t, done);
  }
  function portRows(q) {
    q = (q || "").toLowerCase();
    const list = PORTS.filter((p) => !q || p.join(" ").toLowerCase().includes(q));
    return list.map((p) => `<button type="button" class="cmd-row" data-action="copy-text" aria-label="Copiar ${p[0]}" data-text="${p[0]}"><code>${p[0]} ${p[1]}</code><span>${esc(p[2])}</span></button>`).join("") || `<div class="empty">Nada.</div>`;
  }
  function httpRows(q) {
    q = (q || "").toLowerCase();
    return HTTP.filter((p) => !q || p.join(" ").toLowerCase().includes(q))
      .map((p) => `<button type="button" class="info-row" data-action="copy-text" aria-label="Copiar ${p[0]}" data-text="${p[0]}"><b>${p[0]}</b><span>${esc(p[1])}</span></button>`).join("") || `<div class="empty">Nada.</div>`;
  }
  function acroRows(q) {
    q = (q || "").toLowerCase();
    return ACRO.filter((p) => !q || (p[0] + p[1]).toLowerCase().includes(q))
      .map((p) => `<button type="button" class="info-row" data-action="copy-text" aria-label="Copiar ${p[0]}" data-text="${p[0]}"><b>${p[0]}</b><span>${esc(p[1])}</span></button>`).join("") || `<div class="empty">Nada.</div>`;
  }
  function sheetRows(tab, q) {
    q = (q || "").toLowerCase();
    const src = tab === "cisco" ? CISCO : tab === "psh" ? PSH : LINUX;
    const filas = q ? src.filter(([c, d]) => (c + " " + d).toLowerCase().includes(q)) : src;
    return filas.map(([c, d]) => `<button type="button" class="cmd-row" data-action="copy-text" aria-label="Copiar ${esc(c)}" data-text="${esc(c)}"><code>${esc(c)}</code><span>${esc(d)}</span></button>`).join("") || `<div class="empty">Nada.</div>`;
  }
  function ipClass(oct) {
    const a = oct[0];
    if (a === 127) return "Loopback";
    if (a === 10) return "Privada clase A (RFC1918)";
    if (a === 169 && oct[1] === 254) return "APIPA / link-local";
    if (a === 100 && oct[1] >= 64 && oct[1] <= 127) return "CGNAT (RFC6598)";
    if (a === 172 && oct[1] >= 16 && oct[1] <= 31) return "Privada clase B (RFC1918)";
    if (a === 192 && oct[1] === 168) return "Privada clase C (RFC1918)";
    if (a >= 224 && a <= 239) return "Multicast (clase D)";
    if (a >= 240) return "Experimental (clase E)";
    if (a < 128) return "Clase A pública";
    if (a < 192) return "Clase B pública";
    if (a < 224) return "Clase C pública";
    return "Otro";
  }
  function expandV6(dir) {
    let s = String(dir || "").trim();
    if (!s || s.includes(":::")) return null;
    // IPv4 embebida al final (::ffff:192.168.1.1)
    let v4 = "";
    const m4 = s.match(/^(.*?):((?:\d{1,3}\.){3}\d{1,3})$/);
    if (m4) {
      const oct = m4[2].split(".").map(Number);
      if (oct.some((o) => !Number.isFinite(o) || o < 0 || o > 255)) return null;
      v4 = ((oct[0] << 8) | oct[1]).toString(16) + ":" + ((oct[2] << 8) | oct[3]).toString(16);
      s = m4[1] + ":" + v4;
    }
    if ((s.match(/::/g) || []).length > 1) return null;
    let head = [], tail = [];
    if (s.includes("::")) {
      const [a, b] = s.split("::");
      head = a ? a.split(":") : [];
      tail = b ? b.split(":") : [];
    } else {
      head = s.split(":");
      if (head.length !== 8) return null;
    }
    const grupos = [...head, ...Array(Math.max(0, 8 - head.length - tail.length)).fill("0"), ...tail];
    if (grupos.length !== 8) return null;
    const out = [];
    for (const g of grupos) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;    // gg es inválido y aquí se ve
      out.push(g.toLowerCase().padStart(4, "0"));
    }
    return out;
  }
  function compressV6(full) {
    const parts = full.split(":");
    let best = [0, -1], cur = [0, -1];
    parts.forEach((p, i) => {
      if (p === "0000") {
        if (cur[1] < 0) cur = [1, i];
        else cur[0]++;
        if (cur[0] > best[0]) best = cur.slice();
      } else cur = [0, -1];
    });
    let out = parts.map((p) => p.replace(/^0+(?=\w)/, "") || "0");
    if (best[0] > 1) {
      out.splice(best[1], best[0], "");
      if (best[1] === 0) out.unshift("");
      if (best[1] + best[0] === 8) out.push("");
      return out.join(":").replace(/:{3,}/, "::");
    }
    return out.join(":");
  }


  /* ================================================================
     CALCULADORA DE FALTAS — Evaluación continua FP/Bachillerato
     ================================================================ */
  /* El cuerpo de la calculadora, sin el «wrap» de Herramientas: lo pinta tanto el
     panel de Herramientas como su propia vista (la hoja «Más» tiene un apartado
     directo). Mismo HTML, mismas cifras, mismo estado guardado. */
  function faltasBody() {
    const saved = faltasState();
    const horas = saved.horas || 132;
    const duracion = saved.duracion || 1.5;
    const limite = saved.limite || 20;
    const faltas = saved.faltas || 0;
    const modo = saved.modo || "clases";
    const chip = (label, field, val, active) => `<button type="button" class="chip ${active ? "is-on" : ""}" data-action="faltas-chip" data-field="${field}" data-val="${val}">${label}</button>`;
    const chipRow = (field, vals, current) => vals.map((v) => chip(typeof v === "number" && v % 1 ? v + "" : v + "", field, v, Math.abs(current - v) < 0.01)).join("");
    return `
      <div class="card" id="faltas-card">
        <p class="hint" style="margin-top:0">Horas totales del módulo</p>
        <div class="chips-row">${chipRow("horas", [33, 66, 99, 132, 165, 200], horas)}</div>
        <div class="field" style="margin-top:6px"><label>Horas exactas</label><input id="ft-horas" type="number" min="1" max="999" value="${horas}" /></div>

        <p class="hint">Duración de cada clase</p>
        <div class="chips-row">${chipRow("duracion", [1, 1.5, 2, 3], duracion)}</div>
        <div class="field" style="margin-top:6px"><label>Horas / clase</label><input id="ft-duracion" type="number" min="0.5" max="8" step="0.5" value="${duracion}" /></div>

        <p class="hint">Límite de faltas (% del total)</p>
        <div class="chips-row">${chipRow("limite", [15, 20, 25, 30], limite)}</div>
        <div class="field" style="margin-top:6px"><label>Porcentaje límite</label><input id="ft-limite" type="number" min="1" max="100" value="${limite}" /></div>

        <p class="hint">Faltas acumuladas</p>
        <div class="faltas-modo seg" role="group" aria-label="Modo de conteo">
          <button type="button" class="${modo === "clases" ? "is-on" : ""}" data-action="faltas-modo" data-modo="clases">Clases</button>
          <button type="button" class="${modo === "horas" ? "is-on" : ""}" data-action="faltas-modo" data-modo="horas">Horas</button>
        </div>
        <div class="faltas-counter">
          <button type="button" class="faltas-btn" data-action="faltas-minus" aria-label="Restar falta">−</button>
          <div class="faltas-num" id="ft-faltas">${faltas}</div>
          <button type="button" class="faltas-btn" data-action="faltas-plus" aria-label="Sumar falta">+</button>
        </div>
        <p class="hint" style="text-align:center" id="ft-modo-lbl">${modo === "clases" ? "clases faltadas" : "horas faltadas"}</p>
      </div>
      <div id="ft-resultado"></div>
      <details class="card" style="margin-top:10px"><summary style="cursor:pointer;font-weight:600;font-size:14px">Ver desglose del cálculo</summary>
        <div id="ft-desglose" style="margin-top:10px"></div>
      </details>
    `;
  }
  function faltasState() {
    try { return JSON.parse(localStorage.getItem("aula_smr_faltas_calc") || "{}"); } catch { return {}; }
  }
  function faltasSave(s) {
    try { localStorage.setItem("aula_smr_faltas_calc", JSON.stringify(s)); } catch {}
  }
  function faltasCalc() {
    const s = faltasState();
    const horas = Number(s.horas) || 132;
    const duracion = Number(s.duracion) || 1.5;
    const limite = Number(s.limite) || 20;
    const faltasInput = Number(s.faltas) || 0;
    const modo = s.modo || "clases";

    // Redondeo a un decimal: sin él, 132 h al 20 % salía en pantalla como «26.400000000000002 h»
    const horasMaximas = Math.round(horas * (limite / 100) * 10) / 10;
    const clasesMaximas = Math.floor(horasMaximas / duracion);

    let horasFaltadas = 0, clasesFaltadas = 0;
    if (modo === "clases") {
      clasesFaltadas = faltasInput;
      horasFaltadas = clasesFaltadas * duracion;
    } else {
      horasFaltadas = faltasInput;
      clasesFaltadas = Math.floor(horasFaltadas / duracion);
    }

    const clasesRestantes = Math.max(0, clasesMaximas - clasesFaltadas);
    const horasRestantes = Math.max(0, horasMaximas - horasFaltadas);
    const porcentajeConsumido = horasMaximas > 0 ? (horasFaltadas / horasMaximas) * 100 : 0;

    let estado, badge, color, msg;
    if (porcentajeConsumido < 70) {
      estado = "ZONA SEGURA"; badge = "🟢 ZONA SEGURA"; color = "var(--green)";
      msg = "Estás dentro del margen permitido.";
    } else if (porcentajeConsumido < 90) {
      estado = "PRECAUCIÓN"; badge = "⚠️ PRECAUCIÓN"; color = "var(--amber)";
      msg = "Has consumido más del 70% de tus faltas disponibles.";
    } else if (porcentajeConsumido < 100) {
      estado = "ALERTA CRÍTICA"; badge = "🚨 ALERTA CRÍTICA"; color = "var(--acc-orange)";
      msg = "Una falta más y perderás el derecho a la evaluación continua.";
    } else {
      estado = "PERDIDA"; badge = "⛔ EVALUACIÓN CONTINUA PERDIDA"; color = "var(--red)";
      const exceso = Math.round((horasFaltadas - horasMaximas) * 10) / 10;
      const excesoC = Math.max(0, clasesFaltadas - clasesMaximas);
      msg = `¡Has perdido la evaluación continua! Te has pasado en ${excesoC} clase(s) (${exceso} h). Habla con tu tutor o jefatura de estudios para justificar faltas o solicitar convocatoria extraordinaria.`;
    }

    return { horas, duracion, limite, faltasInput, modo, horasMaximas, clasesMaximas,
      horasFaltadas, clasesFaltadas, clasesRestantes, horasRestantes,
      porcentajeConsumido, estado, badge, color, msg };
  }
  function faltasRender() {
    const r = faltasCalc();
    const el = document.getElementById("ft-resultado");
    if (!el) return;
    const pct = Math.min(100, Math.round(r.porcentajeConsumido * 10) / 10);
    const restanteTxt = r.modo === "clases"
      ? `<span style="font-size:36px;font-weight:900;letter-spacing:-.04em;color:${r.color}">${r.clasesRestantes}</span><br><span style="font-size:14px;color:var(--muted)">clases restantes</span>`
      : `<span style="font-size:36px;font-weight:900;letter-spacing:-.04em;color:${r.color}">${r.horasRestantes.toFixed(1)}</span><br><span style="font-size:14px;color:var(--muted)">horas restantes</span>`;

    el.innerHTML = `<div class="card" style="border-color:${r.color};border-width:2px;margin-top:10px">
      <div style="text-align:center;margin-bottom:10px">
        <span class="badge" style="background:${r.color};color:#fff;font-size:13px;padding:4px 12px;border-radius:999px">${r.badge}</span>
      </div>
      <div style="text-align:center;margin:12px 0">${restanteTxt}</div>
      <div style="background:var(--surface-2);border-radius:999px;height:10px;overflow:hidden;margin:10px 0 4px">
        <div style="height:100%;width:${pct}%;background:${r.color};border-radius:999px;transition:width .3s ease"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted)">
        <span>${r.horasFaltadas.toFixed(1)} h faltadas</span>
        <span style="font-weight:700;color:${r.color}">${pct}%</span>
        <span>Límite: ${r.horasMaximas} h (${r.clasesMaximas} clases)</span>
      </div>
      <p style="text-align:center;margin:12px 0 0;font-size:14px;color:var(--ink-2)">${r.msg}</p>
    </div>`;

    const dg = document.getElementById("ft-desglose");
    if (dg) {
      dg.innerHTML = `<div class="info-list">
        <div class="info-row"><b>Total del módulo</b><span>${r.horas} h</span></div>
        <div class="info-row"><b>Duración / clase</b><span>${r.duracion} h</span></div>
        <div class="info-row"><b>Total de clases</b><span>${Math.floor(r.horas / r.duracion)}</span></div>
        <div class="info-row"><b>Límite</b><span>${r.limite}% = ${r.horasMaximas} h</span></div>
        <div class="info-row"><b>Clases máx. faltables</b><span>${r.clasesMaximas}</span></div>
        <div class="info-row"><b>Faltas actuales</b><span>${r.faltasInput} ${r.modo === "clases" ? "clases" : "horas"} = ${r.horasFaltadas.toFixed(1)} h</span></div>
        <div class="info-row"><b>Consumo</b><span style="color:${r.color};font-weight:700">${pct}%</span></div>
        <div class="info-row"><b>Justificables (FP)</b><span>Las faltas justificadas no cuentan para perder la continua (normativa general). Consulta tu centro.</span></div>
      </div>`;
    }
  }

  function click(action, btn) {
    if (!A()) return;

    // Calculadora de Faltas
    if (action === "faltas-chip") {
      const field = btn.dataset.field, val = Number(btn.dataset.val);
      const s = faltasState(); s[field] = val; faltasSave(s);
      // Update input
      const inp = document.getElementById("ft-" + field);
      if (inp) inp.value = val;
      // Update chips
      btn.parentElement.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-on", Number(c.dataset.val) === val));
      faltasRender();
    }
    if (action === "faltas-modo") {
      const s = faltasState(); s.modo = btn.dataset.modo; faltasSave(s);
      btn.parentElement.querySelectorAll("button").forEach((b) => b.classList.toggle("is-on", b.dataset.modo === s.modo));
      const lbl = document.getElementById("ft-modo-lbl");
      if (lbl) lbl.textContent = s.modo === "clases" ? "clases faltadas" : "horas faltadas";
      faltasRender();
    }
    if (action === "faltas-plus" || action === "faltas-minus") {
      const s = faltasState();
      const cur = Number(s.faltas) || 0;
      const next = action === "faltas-plus" ? cur + 1 : Math.max(0, cur - 1);
      s.faltas = next; faltasSave(s);
      const num = document.getElementById("ft-faltas");
      if (num) num.textContent = next;
      faltasRender();
    }

    if (action === "tool-open") {
      st()._tool = btn.dataset.id;
      A().go("tools");
      if (btn.dataset.id === "faltas") setTimeout(faltasRender, 50);
      if (btn.dataset.id === "chmod") setTimeout(() => click("tool-chmod", btn), 0);
    }
    if (action === "tool-back") { st()._tool = null; A().go("tools"); }
    if (action === "tools-clear-q") { st()._toolsQ = ""; A().render(); }
    if (action === "tool-subnet") {
      const r = calcSubnet((document.getElementById("sn-ip") || {}).value);
      const el = document.getElementById("sn-out");
      if (!el) return;
      if (!r) { el.innerHTML = `<p class="hint">Formato: 192.168.1.10/24</p>`; return; }
      el.innerHTML = kv([
        ["Red", r.network + "/" + r.prefix], ["Máscara", r.mask], ["Wildcard", r.wildcard],
        ["Broadcast", r.broadcast], ["Primero", r.first], ["Último", r.last],
        ["Hosts útiles", String(r.hosts)], ["Direcciones", String(r.total)], ["Clase", r.clase],
      ]) + bitsViz(r.prefix);
    }
    if (action === "tool-vlsm") {
      const n = parseInt((document.getElementById("vl-n") || {}).value, 10) || 0;
      const el = document.getElementById("vl-out");
      if (!el) return;
      const need = n + 2;
      let p = 32;
      while (p > 0 && 2 ** (32 - p) < need) p--;
      const hosts = p >= 31 ? (p === 32 ? 1 : 2) : 2 ** (32 - p) - 2;
      el.innerHTML = kv([["Prefijo", "/" + p], ["Máscara", intToIp(p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0)], ["Hosts útiles", String(hosts)], ["Direcciones", String(2 ** (32 - p))]]);
    }
    if (action === "tool-ipbin") {
      const oct = parseIp((document.getElementById("ib-ip") || {}).value);
      const el = document.getElementById("ib-out");
      if (!el) return;
      if (!oct) { el.innerHTML = `<p class="hint">IPv4: a.b.c.d</p>`; return; }
      el.innerHTML = kv(oct.map((n, i) => ["Octeto " + (i + 1), n.toString(2).padStart(8, "0") + "  (" + n + ")"]));
    }
    if (action === "tool-ranges") {
      const oct = parseIp((document.getElementById("rg-ip") || {}).value);
      const el = document.getElementById("rg-out");
      if (!el) return;
      if (!oct) { el.innerHTML = `<p class="hint">Escribe una IPv4</p>`; return; }
      el.innerHTML = kv([["Tipo", ipClass(oct)]]);
    }
    if (action === "tool-wild") {
      const raw = String((document.getElementById("wd-in") || {}).value || "").trim();
      const el = document.getElementById("wd-out");
      if (!el) return;
      let p = parseInt(raw.replace(/^\//, ""), 10);   // «/26» y «26» valen igual
      if (raw.includes(".")) {
        const oct = parseIp(raw);
        if (!oct) { el.innerHTML = `<p class="hint">Máscara o /prefijo</p>`; return; }
        const bits = oct.reduce((a, n) => a + n.toString(2).replace(/0/g, "").length, 0);
        const calculada = intToIp(bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0);
        // 255.255.0.255 tiene 24 unos pero NO es una máscara: los unos van seguidos
        if (calculada !== oct.join(".")) {
          el.innerHTML = `<p class="hint">Esa no es una máscara válida: los unos tienen que ir seguidos (por ejemplo 255.255.255.0).</p>`;
          return;
        }
        p = bits;
      }
      if (!(p >= 0 && p <= 32)) { el.innerHTML = `<p class="hint">0–32</p>`; return; }
      const mask = p === 0 ? 0 : ((0xFFFFFFFF << (32 - p)) >>> 0);
      el.innerHTML = kv([["Prefijo", "/" + p], ["Máscara", intToIp(mask)], ["Wildcard", intToIp((~mask) >>> 0)]]);
    }
    if (action === "tool-ipv6") {
      const raw = (document.getElementById("v6-in") || {}).value || "";
      const el = document.getElementById("v6-out");
      if (!el) return;
      const grupos = expandV6(raw);
      if (!grupos) { el.innerHTML = `<p class="hint">IPv6 no válida: revisa los grupos (1-4 dígitos hex) y que solo haya un «::».</p>`; return; }
      const full = grupos.join(":");
      el.innerHTML = kv([["Expandida", full], ["Comprimida", compressV6(full)], ["Grupos", String(grupos.length)]]);
    }
    if (action === "tool-mac") {
      const raw = String((document.getElementById("mac-in") || {}).value || "").trim();
      const hex = raw.replace(/[^0-9a-fA-F]/g, "");
      const el = document.getElementById("mac-out");
      if (!el) return;
      if (hex.length !== 12) { el.innerHTML = `<p class="hint">12 hex (00:1A:2B:3C:4D:5E)</p>`; return; }
      const first = parseInt(hex.slice(0, 2), 16);
      el.innerHTML = kv([
        ["Canónica", hex.match(/.{2}/g).join(":").toUpperCase()],
        ["I/G", first & 1 ? "Multicast / broadcast" : "Unicast"],
        ["U/L", first & 2 ? "Administrada localmente" : "Global (OUI IEEE)"],
        ["OUI", hex.slice(0, 6).match(/.{2}/g).join(":").toUpperCase()],
      ]);
    }
    if (action === "tool-dhcp") {
      const r = calcSubnet((document.getElementById("dh-cidr") || {}).value);
      const el = document.getElementById("dh-out");
      if (!el) return;
      if (!r) { el.innerHTML = `<p class="hint">CIDR de la red</p>`; return; }
      el.innerHTML = kv([["Red", r.network + "/" + r.prefix], ["Leases posibles", String(r.hosts)], ["Rango", r.first + " – " + r.last], ["Broadcast", r.broadcast]]);
    }
    if (action === "tool-chmod") {
      ["ur","uw","ux","gr","gw","gx","or","ow","ox"].forEach((id) => {
        const el = document.getElementById("cm-" + id);
        if (el && el.parentElement) el.parentElement.classList.toggle("is-on", !!el.checked);
      });
      const r = chmodFromBits();
      const el = document.getElementById("cm-out");
      const oct = document.getElementById("cm-oct");
      if (oct) oct.value = r.oct;
      if (el) el.innerHTML = kv([["Octal", r.oct], ["Simbólico", r.symbolic]]);
    }
    if (action === "tool-chmod-oct") {
      applyOctal((document.getElementById("cm-oct") || {}).value);
      click("tool-chmod", btn);
    }
    if (action === "tool-pass") {
      const len = +(document.getElementById("pw-len") || {}).value || 16;
      const pw = genPass(len, {
        lower: !!(document.getElementById("pw-l") || {}).checked,
        upper: !!(document.getElementById("pw-u") || {}).checked,
        num: !!(document.getElementById("pw-n") || {}).checked,
        sym: !!(document.getElementById("pw-s") || {}).checked,
      });
      const el = document.getElementById("pw-out");
      if (el) el.textContent = pw;
      copyText(pw);
    }
    if (action === "tool-backup") {
      const gb = parseFloat((document.getElementById("bk-gb") || {}).value) || 0;
      const mbps = parseFloat((document.getElementById("bk-mbps") || {}).value) || 0;
      // Se trabaja en base 10 (lo que anuncian los fabricantes) y se dice en la nota
      const bits = gb * 1e9 * 8;
      const sec = mbps > 0 ? bits / (mbps * 1e6) : 0;
      const el = document.getElementById("bk-out");
      if (el) el.innerHTML = kv([
        ["Tiempo estimado", mbps > 0 ? fmtTime(sec) : "—"],
        ["Cálculo", `${gb} GB × 8 = ${(bits / 1e9).toFixed(2)} Gbit a ${mbps} Mbit/s`],
        ["Ojo", "Los GB son de 1000 MB (base 10). A velocidad real, súmale un 20-30 %."],
      ]);
    }
    if (action === "tool-units") {
      const n = parseFloat((document.getElementById("un-n") || {}).value) || 0;
      const from = (document.getElementById("un-from") || {}).value || "GB";
      const bytes = { GB: 1e9, GiB: 2 ** 30, MB: 1e6, MiB: 2 ** 20, TB: 1e12, TiB: 2 ** 40 }[from] * n;
      const el = document.getElementById("un-out");
      if (el) el.innerHTML = ["GB", "GiB", "MB", "MiB", "TB", "TiB"].map((u) => {
        const d = { GB: 1e9, GiB: 2 ** 30, MB: 1e6, MiB: 2 ** 20, TB: 1e12, TiB: 2 ** 40 }[u];
        const v = bytes / d;
        const txt = !v ? "0" : Math.abs(v) >= 1 ? Number(v.toPrecision(6)).toLocaleString("es-ES", { maximumFractionDigits: 4 }) : v.toExponential(3);
        const base = u === "GB" || u === "MB" || u === "TB" ? "base 10" : "base 2";
        return `<div class="kv"><span>${u} <small style="opacity:.6">(${base})</small></span><b>${txt}</b></div>`;
      }).join("");
    }
    if (action === "tool-raid") {
      const n = parseInt((document.getElementById("rd-n") || {}).value, 10) || 0;
      const gb = parseFloat((document.getElementById("rd-gb") || {}).value) || 0;
      const lv = (document.getElementById("rd-lv") || {}).value || "5";
      const el = document.getElementById("rd-out");
      if (!el) return;
      if (n < 1 || gb <= 0) {
        el.innerHTML = kv([["Capacidad usable", "—"], ["Notas", "Pon cuántos discos y de qué tamaño son"]]);
        return;
      }
      let cap = 0, note = "";
      if (lv === "0") { cap = n * gb; note = n === 1 ? "Un solo disco: sin redundancia" : "Sin redundancia"; }
      else if (lv === "1") { cap = Math.floor(n / 2) * gb; note = n < 2 ? "Mínimo 2 discos (espejo)" : "Espejo"; }
      else if (lv === "5") { cap = n >= 3 ? (n - 1) * gb : 0; note = n < 3 ? "Mínimo 3 discos" : "1 disco de paridad"; }
      else if (lv === "6") { cap = n >= 4 ? (n - 2) * gb : 0; note = n < 4 ? "Mínimo 4 discos" : "2 de paridad"; }
      else if (lv === "10") {
        const pares = Math.floor(n / 2);
        cap = pares * gb;
        if (n < 4) note = "Mínimo 4 discos (pares)";
        else if (n % 2) note = `Con ${n} discos el último se queda sin pareja: se usan ${pares * 2} (${pares} espejos)`;
        else note = `${pares} espejos + stripe`;
      }
      el.innerHTML = kv([["Capacidad usable", cap + " GB"], ["Notas", note]]);
    }
    if (action === "tool-conv") {
      const raw = String((document.getElementById("cv-n") || {}).value || "").trim();
      const from = parseInt((document.getElementById("cv-from") || {}).value, 10) || 10;
      const el = document.getElementById("cv-out");
      if (!el) return;
      const limpio = raw.replace(/\s/g, "");
      const digitos = { 2: /^-?[01]+$/, 8: /^-?[0-7]+$/, 10: /^-?\d+$/, 16: /^-?[0-9a-f]+$/i }[from];
      // Sin esto, «19» en octal daba 1 en lugar de avisar de que el 9 no existe en base 8
      if (!digitos || !digitos.test(limpio)) { el.innerHTML = `<p class="hint">Número no válido en base ${from}</p>`; return; }
      const n = parseInt(limpio, from);
      if (!Number.isFinite(n)) { el.innerHTML = `<p class="hint">Número no válido</p>`; return; }
      el.innerHTML = kv([["Decimal", String(n)], ["Binario", n.toString(2)], ["Hex", n.toString(16).toUpperCase()]]);
    }
    if (action === "tool-hash") {
      const texto = (document.getElementById("hs-in") || {}).value || "";
      const el = document.getElementById("hs-out");
      if (!el) return;
      const data = new TextEncoder().encode(texto);
      const cripto = window.crypto || null;
      if (!cripto || !cripto.subtle || typeof cripto.subtle.digest !== "function") {
        // http://IP:8080 no es contexto seguro: crypto.subtle no existe ahí
        el.innerHTML = `<p class="hint">El hash SHA-256 necesita https o localhost: el navegador lo bloquea en <b>http://</b>. Abre la app instalada o desde localhost.</p>`;
        return;
      }
      cripto.subtle.digest("SHA-256", data).then((buf) => {
        const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
        el.innerHTML = kv([["SHA-256", hex], ["Bytes", String(data.length)]]);
      }).catch((err) => { el.innerHTML = `<p class="hint">No se pudo calcular: ${esc(String(err && err.message || err))}</p>`; });
    }
    if (action === "tool-b64-enc" || action === "tool-b64-dec") {
      const t = (document.getElementById("b64-in") || {}).value || "";
      const el = document.getElementById("b64-out");
      if (!el) return;
      try {
        const out = action === "tool-b64-enc"
          ? btoa(unescape(encodeURIComponent(t)))
          : decodeURIComponent(escape(atob(t)));
        el.innerHTML = `<div class="tool-pass">${esc(out)}</div>`;
      } catch { el.innerHTML = `<p class="hint">No se pudo convertir</p>`; }
    }
    if (action === "tool-json-pretty" || action === "tool-json-min") {
      const t = (document.getElementById("js-in") || {}).value || "";
      const el = document.getElementById("js-out");
      if (!el) return;
      try {
        const obj = JSON.parse(t);
        const out = action === "tool-json-pretty" ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
        el.innerHTML = `<pre class="tool-pass" style="text-align:left;white-space:pre-wrap">${esc(out)}</pre>`;
      } catch { el.innerHTML = `<p class="hint">JSON no válido</p>`; }
    }
    if (action === "tool-regex") {
      const expr = (document.getElementById("rx-e") || {}).value || "";
      const texto = (document.getElementById("rx-t") || {}).value || "";
      const flags = (document.getElementById("rx-f") || {}).value || "";
      const el = document.getElementById("rx-out");
      if (!el) return;
      // Fuera banderas peligrosas y expresiones que pueden congelar la pestaña
      const limpias = String(flags).replace(/[^gimsuy]/g, "");
      const anidados = /(\([^)]*[+*][^)]*\)[+*]|\([^)]*\{[0-9]+,\}[^)]*\)[+*])/.test(expr);
      if (expr.length > 200) { el.innerHTML = `<p class="hint">Expresión demasiado larga (máx. 200 caracteres)</p>`; return; }
      if (anidados) { el.innerHTML = `<p class="hint">Esa expresión tiene cuantificadores anidados y puede bloquear el navegador. Prueba a simplificarla.</p>`; return; }
      let re = null;
      try { re = new RegExp(expr, limpias.includes("g") ? limpias : limpias + "g"); }
      catch (e) { el.innerHTML = `<p class="hint">Expresión no válida: ${esc(String(e.message || e))}</p>`; return; }
      const coincidencias = [];
      let m = null, vueltas = 0;
      const inicio = Date.now();
      while ((m = re.exec(texto)) !== null && vueltas < 500) {
        coincidencias.push(m[0] === "" ? "(vacío en " + m.index + ")" : m[0]);
        if (m.index === re.lastIndex) re.lastIndex += 1;
        vueltas++;
        if (Date.now() - inicio > 300) break;    // corta si se atasca (catastrophic backtracking)
      }
      el.innerHTML = kv([
        ["¿Coincide?", coincidencias.length ? "Sí" : "No"],
        ["Nº de coincidencias", String(coincidencias.length)],
        ["Primeras", coincidencias.slice(0, 8).join(" · ") || "—"],
      ]);
    }
    if (action === "tool-uuid") {
      const el = document.getElementById("uu-out");
      const c = window.crypto || {};
      const id = (typeof c.randomUUID === "function" && c.randomUUID()) || (Math.random().toString(16).slice(2) + Date.now());
      if (el) el.textContent = id;
      copyText(id);
    }
    if (action === "sheet-tab") { st()._sheetTab = btn.dataset.id; A().render(); }
    if (action === "beep-tab") { st()._beepTab = btn.dataset.id; A().render(); }
    if (action === "copy-text") copyText(btn.dataset.text || "");
  }

  let toolsSearchTimer;
  document.addEventListener("input", (e) => {
    const SEARCH = { "pt-q": ["pt-list", portRows], "ht-q": ["ht-list", httpRows], "ac-q": ["ac-list", acroRows] };
    if (SEARCH[e.target.id]) {
      const [listId, fn] = SEARCH[e.target.id];
      const v = e.target.value;
      // Debounce: filtrar cientos de filas por cada tecla se nota en móviles modestos.
      clearTimeout(toolsSearchTimer);
      toolsSearchTimer = setTimeout(() => { const l = document.getElementById(listId); if (l) l.innerHTML = fn(v); }, 160);
    }
    if (e.target.id === "sh-q") {
      st()._sheetQ = e.target.value;
      const v = e.target.value, tab = st()._sheetTab || "linux";
      clearTimeout(toolsSearchTimer);
      toolsSearchTimer = setTimeout(() => { const l = document.getElementById("sh-list"); if (l) l.innerHTML = sheetRows(tab, v); }, 160);
    }
    if (e.target.id === "tools-q") {
      st()._toolsQ = e.target.value;
      const body = document.getElementById("tools-body");
      if (body) body.innerHTML = gridHTML();
      return;
    }

    if (e.target.id === "pw-len") {
      const l = document.getElementById("pw-len-lbl");
      if (l) l.textContent = e.target.value + " caracteres";
    }
    if (e.target.id === "sn-ip") {
      const r = calcSubnet(e.target.value);
      const el = document.getElementById("sn-out");
      if (!el) return;
      if (!r) { el.innerHTML = ""; return; }
      el.innerHTML = kv([
        ["Red", r.network + "/" + r.prefix], ["Máscara", r.mask], ["Wildcard", r.wildcard],
        ["Broadcast", r.broadcast], ["Primero", r.first], ["Último", r.last],
        ["Hosts útiles", String(r.hosts)], ["Direcciones", String(r.total)], ["Clase", r.clase],
      ]) + bitsViz(r.prefix);
    }
    // Recálculo en vivo: las calculadoras numéricas responden al teclear, igual que Subnetting
    // (antes era la única y el resto obligaba a pulsar el botón). Reutilizamos el manejador del
    // botón, que ya sabe leer su campo y pintar su salida; si el campo queda vacío, se limpia.
    const LIVE = {
      "vl-n": ["tool-vlsm", "vl-out"], "ib-ip": ["tool-ipbin", "ib-out"], "rg-ip": ["tool-ranges", "rg-out"],
      "wd-in": ["tool-wild", "wd-out"], "v6-in": ["tool-ipv6", "v6-out"], "mac-in": ["tool-mac", "mac-out"],
      "dh-cidr": ["tool-dhcp", "dh-out"], "cm-oct": ["tool-chmod-oct", "cm-out"],
      "rd-n": ["tool-raid", "rd-out"], "rd-gb": ["tool-raid", "rd-out"], "rd-lv": ["tool-raid", "rd-out"],
      "un-n": ["tool-units", "un-out"], "un-from": ["tool-units", "un-out"],
      "bk-gb": ["tool-backup", "bk-out"], "bk-mbps": ["tool-backup", "bk-out"],
      "cv-n": ["tool-conv", "cv-out"], "cv-from": ["tool-conv", "cv-out"], "hs-in": ["tool-hash", "hs-out"],
    };
    // Faltas: inputs numéricos recalculan al instante
    if (["ft-horas", "ft-duracion", "ft-limite"].includes(e.target.id)) {
      const field = { "ft-horas": "horas", "ft-duracion": "duracion", "ft-limite": "limite" }[e.target.id];
      const s = faltasState(); s[field] = Number(e.target.value) || 0; faltasSave(s);
      // Sync chips
      const row = e.target.closest(".card");
      if (row) {
        const chips = row.querySelectorAll(`.chip[data-action="faltas-chip"][data-field="${field}"]`);
        chips.forEach((c) => c.classList.toggle("is-on", Math.abs(Number(c.dataset.val) - (Number(e.target.value) || 0)) < 0.01));
      }
      faltasRender();
      return;
    }
    const live = LIVE[e.target.id];
    if (live) {
      const out = document.getElementById(live[1]);
      if (String(e.target.value == null ? "" : e.target.value).trim() === "") { if (out) out.innerHTML = ""; return; }
      click(live[0], e.target);
    }
    if (e.target.id && e.target.id.startsWith("cm-") && e.target.type === "checkbox") click("tool-chmod", e.target);
  });

  window.AulaTools = {
    view() { return st()._tool ? panel() : home(); },
    // La calculadora de faltas tiene además apartado propio en la hoja «Más»:
    // misma calculadora y mismas cifras, sin pasar por Herramientas.
    faltasView: faltasBody,
    faltasRender,
    click,
    // Funciones puras de cálculo, expuestas para poder probarlas sin tocar la UI
    calc: { calcSubnet, parseIp, intToIp, expandV6, compressV6, faltasCalc },
    // Catálogo plano para el buscador global (Ctrl/Cmd + K)
    catalog() {
      const out = [];
      (CATS || []).forEach(([cat, _color, cards]) => {
        (cards || []).forEach(([id, color, ico, title, sub]) => out.push({ id, title, sub, cat }));
      });
      return out;
    },
  };
  const bootHash = (location.hash || "").replace("#", "");
  if (bootHash && window.Aula && typeof window.Aula.render === "function") {
    try { window.Aula.render(); } catch {}
  }
})();
