/* KUMEL — comportamiento del sitio.
   Todo lo que hay que completar está en CONFIG. */
(() => {
  "use strict";

  const CONFIG = {
    // Solo dígitos, con código de país. Ej: "5492962123456"
    whatsapp: "",
    // Opcional. Si lo completás, aparece en el pie de página.
    email: "",
    instagram: "kumelpintura",
    // Fotos de obras. Subilas a assets/obras/ y agregalas así:
    // { src: "assets/obras/obra-1.jpg", alt: "Frente pintado", titulo: "Frente de local", lugar: "Puerto San Julián" }
    obras: []
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const waUrl = (text) =>
    CONFIG.whatsapp
      ? "https://wa.me/" + CONFIG.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "")
      : null;

  /* ---------- Enlaces configurables ---------- */
  $$("[data-wa]").forEach((a) => {
    const url = waUrl(a.dataset.wa || "Hola, quiero pedir un presupuesto de pintura.");
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.href = "#cotizar";
    }
  });

  $$("[data-ig]").forEach((a) => {
    a.href = "https://www.instagram.com/" + CONFIG.instagram + "/";
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-ig-text]").forEach((el) => { el.textContent = "@" + CONFIG.instagram; });

  $$("[data-email]").forEach((a) => {
    if (CONFIG.email) {
      a.href = "mailto:" + CONFIG.email;
      a.textContent = CONFIG.email;
      a.hidden = false;
    }
  });

  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Hero: pared que se pinta ---------- */
  const hero = $("#inicio");
  const coat = $(".wall__coat");
  const base = $(".wall__base");
  const chips = $$(".chip");
  const colorName = $("#color-nombre");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = null;
  let busy = false;

  function applyInstant(chip) {
    base.style.background = chip.dataset.color;
    hero.dataset.tone = chip.dataset.tone;
    current = chip;
  }

  function paint(chip) {
    if (busy || chip === current) return;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    colorName.textContent = chip.dataset.name;

    if (reduceMotion) { applyInstant(chip); return; }

    busy = true;
    coat.style.background = chip.dataset.color;
    coat.classList.remove("is-painting");
    void coat.offsetWidth; // reinicia la transición
    coat.classList.add("is-painting");
    window.setTimeout(() => { hero.dataset.tone = chip.dataset.tone; }, 350);

    const finish = () => {
      base.style.background = chip.dataset.color;
      coat.classList.remove("is-painting");
      current = chip;
      busy = false;
    };
    coat.addEventListener("transitionend", finish, { once: true });
    window.setTimeout(() => { if (busy) finish(); }, 1200); // por si no se dispara transitionend
  }

  chips.forEach((chip) => chip.addEventListener("click", () => paint(chip)));

  const firstChip = chips.find((c) => c.getAttribute("aria-pressed") === "true") || chips[0];
  if (firstChip) {
    // Al cargar, la pared sin pintar recibe el primer color.
    if (reduceMotion) {
      applyInstant(firstChip);
    } else {
      window.setTimeout(() => paint(firstChip), 450);
    }
  }

  /* ---------- Obras ---------- */
  const galeria = $("#obras-lista");
  if (galeria) {
    if (CONFIG.obras.length) {
      CONFIG.obras.forEach((o) => {
        const fig = document.createElement("figure");
        const img = document.createElement("img");
        img.src = o.src;
        img.alt = o.alt || o.titulo || "Obra de KUMEL";
        img.loading = "lazy";
        fig.appendChild(img);
        if (o.titulo || o.lugar) {
          const cap = document.createElement("figcaption");
          if (o.titulo) {
            const strong = document.createElement("strong");
            strong.textContent = o.titulo;
            cap.appendChild(strong);
          }
          if (o.lugar) cap.appendChild(document.createTextNode(o.lugar));
          fig.appendChild(cap);
        }
        galeria.appendChild(fig);
      });
    } else {
      galeria.innerHTML =
        '<div class="gallery__empty">' +
        "<p>Mirá las obras más recientes, con fotos de antes y después, en nuestro Instagram.</p>" +
        '<a class="btn btn--tinta" data-ig data-ig-text href="#"></a>' +
        "</div>";
      $$("[data-ig]", galeria).forEach((a) => {
        a.href = "https://www.instagram.com/" + CONFIG.instagram + "/";
        a.target = "_blank";
        a.rel = "noopener";
      });
      $$("[data-ig-text]", galeria).forEach((el) => { el.textContent = "Ver @" + CONFIG.instagram; });
    }
  }

  /* ---------- Cotizador por pasos ---------- */
  const form = $("#cotizador");
  if (!form) return;

  const steps = $$(".step", form);
  const progress = $("#progreso");
  const btnBack = $("#btn-atras");
  const btnNext = $("#btn-siguiente");
  const btnSend = $("#btn-enviar");
  const errorBox = $("#cotizador-error");
  const result = $("#cotizador-resultado");
  let idx = 0;

  function show(n) {
    idx = n;
    steps.forEach((s, k) => { s.hidden = k !== n; });
    progress.textContent = "Paso " + (n + 1) + " de " + steps.length;
    btnBack.hidden = n === 0;
    btnNext.hidden = n === steps.length - 1;
    btnSend.hidden = n !== steps.length - 1;
    errorBox.textContent = "";
  }

  function validStep(n) {
    const required = $$("[required]", steps[n]);
    for (const el of required) {
      if (!el.checkValidity()) {
        errorBox.textContent =
          el.type === "radio" ? "Elegí una opción para continuar." : "Completá este dato para continuar.";
        el.focus({ preventScroll: false });
        return false;
      }
    }
    errorBox.textContent = "";
    return true;
  }

  btnNext.addEventListener("click", () => { if (validStep(idx)) show(idx + 1); });
  btnBack.addEventListener("click", () => show(idx - 1));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validStep(idx)) return;

    const d = new FormData(form);
    const val = (k) => String(d.get(k) || "").trim();
    const lines = [
      "Hola, quiero pedir un presupuesto de pintura.",
      "Soy: " + val("cliente"),
      "Trabajo: " + val("trabajo"),
    ];
    if (val("superficie")) lines.push("Superficie aproximada: " + val("superficie") + " m²");
    if (val("detalle")) lines.push("Detalle: " + val("detalle"));
    lines.push("Nombre: " + val("nombre"));
    lines.push("Teléfono: " + val("telefono"));
    if (val("localidad")) lines.push("Localidad: " + val("localidad"));
    const message = lines.join("\n");

    result.hidden = false;
    result.textContent = "";
    const url = waUrl(message);

    if (url) {
      window.open(url, "_blank", "noopener");
      const p = document.createElement("p");
      p.textContent = "Se abrió WhatsApp con tu consulta lista para enviar. ";
      const a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = "Si no se abrió, tocá acá.";
      p.appendChild(a);
      result.appendChild(p);
    } else {
      // Sin WhatsApp configurado: se ofrece copiar el mensaje y enviarlo por Instagram.
      const p = document.createElement("p");
      p.textContent = "Copiá este mensaje y enviánoslo por Instagram:";
      const ta = document.createElement("textarea");
      ta.rows = 7; ta.readOnly = true; ta.value = message;
      const copy = document.createElement("button");
      copy.type = "button"; copy.className = "btn btn--tinta"; copy.textContent = "Copiar mensaje";
      copy.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(message); copy.textContent = "Copiado"; }
        catch { ta.select(); }
      });
      const ig = document.createElement("p");
      const link = document.createElement("a");
      link.href = "https://www.instagram.com/" + CONFIG.instagram + "/";
      link.target = "_blank"; link.rel = "noopener";
      link.textContent = "Abrir @" + CONFIG.instagram;
      ig.appendChild(link);
      result.append(p, ta, copy, ig);
    }
    result.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  });

  show(0);
})();
