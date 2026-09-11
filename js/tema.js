/* Tema antes del primer pintado, para que no haya fogonazo blanco.
   Vive en su propio fichero (no en línea) para que la CSP pueda prohibir el JavaScript
   incrustado con script-src 'self', sin hashes que mantener a mano. */
    /* Aplica el tema guardado antes del primer pintado para que no haya fogonazo. */
    (function () {
      try {
        var raw = localStorage.getItem("aula.smr.v4");
        if (!raw) return;
        var st = (JSON.parse(raw) || {}).settings || {};
        var html = document.documentElement;
        if (st.skin) html.setAttribute("data-skin", st.skin);
        var theme = st.uiTheme;
        if (theme !== "light" && theme !== "dark") {
          theme = ["minimal","azul","lima","coral","pergamino","gameboy","isla","kawaii","cafe","win95","azulgrana"].indexOf(st.skin) >= 0 ? "light" : "dark";
        }
        if (st.autoTheme) {
          var h = new Date().getHours();
          if ((h < 8 || h >= 21) && ["minimal","azul","lima","coral","pergamino","gameboy","isla","kawaii","cafe","win95","azulgrana"].indexOf(st.skin) >= 0) {
            theme = "dark";
          }
        }
        html.setAttribute("data-theme", theme);
        html.classList.toggle("dark", theme === "dark");
        html.classList.toggle("light", theme === "light");
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.content = theme === "dark" ? "#000000" : "#f9fafb";
      } catch (e) {}
    })();
