/* =========================================================
   curso.js — Consola aislada + Teoría + Quiz por curso + XP
   ========================================================= */
;(() => {
  const LS_MIS_CURSOS   = "misCursos";
  const LS_CURSO_ACTIVO = "cursoActivo";
  const LS_CODE_PREFIX  = "codigoCurso_";

  const cursosCatalogo = [
    { id: 1, titulo: "CSS Moderno" },
    { id: 2, titulo: "JavaScript Básico" },
    { id: 3, titulo: "Git & GitHub" },
  ];

  const ejemplosPorCurso = {
    1: `/* 🎨 CSS Moderno */
:root{ --c1:#67e8f9; --c2:#93c5fd; }
.demo{
  width:200px;height:120px;display:flex;align-items:center;justify-content:center;
  background: linear-gradient(90deg, var(--c1), var(--c2));
  color:#0b1220;font-weight:900;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.25);
}`,
    2: `// ⚡ JS Básico
function saludar(nombre){ return "Hola " + nombre + "!"; }
console.log(saludar("Mundo"));
console.log("2 + 3 =", 2+3);`,
    3: `# 🐙 Git & GitHub
git init
git add .
git commit -m "Primer commit"
git branch -M main
git remote add origin https://github.com/usuario/repo.git
git push -u origin main`,
  };

  const respuestas = {
    1: { q1: "background", q2: "flex",        q3: "grid" },
    2: { q1: "function",   q2: "let",         q3: "console.log" },
    3: { q1: "init",       q2: "commit",      q3: "push" }
  };

  const getLevel = (xp=0) => (xp >= 200 ? 3 : xp >= 100 ? 2 : 1);
  const levelProgressPct = (xp=0) => Math.min(100, xp % 100);

  // ---- Estado base
  let misCursos = JSON.parse(localStorage.getItem(LS_MIS_CURSOS) || "[]");
  const idActivo = Number(localStorage.getItem(LS_CURSO_ACTIVO) || "0") || (misCursos[0]?.id ?? 1);
  if (!localStorage.getItem(LS_CURSO_ACTIVO)) localStorage.setItem(LS_CURSO_ACTIVO, String(idActivo));

  let cursoData = misCursos.find(m => m.id === idActivo);
  if (!cursoData) {
    cursoData = { id: idActivo, xp: 0 };
    misCursos.push(cursoData);
    localStorage.setItem(LS_MIS_CURSOS, JSON.stringify(misCursos));
  }
  const cursoInfo = cursosCatalogo.find(c => c.id === idActivo) || { titulo: "Curso" };

  // ---- Refs
  const $titulo     = document.getElementById("titulo-curso");
  const $pillCurso  = document.getElementById("pill-curso");
  const $pillNivel  = document.getElementById("pill-nivel");
  const $helper     = document.getElementById("helper-xp");
  const $pb         = document.getElementById("pb");
  const $code       = document.getElementById("code-area");
  const $iframe     = document.getElementById("console-frame");
  const $quizForm   = document.getElementById("quiz-form");
  const $quizFeedback = document.getElementById("quiz-feedback");

  if ($iframe && !$iframe.hasAttribute("sandbox")) {
    $iframe.setAttribute("sandbox", "allow-scripts");
  }

  // ---- Header
  function refreshHeader() {
    const xp = cursoData.xp || 0;
    const lvl = getLevel(xp);
    const pct = levelProgressPct(xp);
    if ($titulo)    $titulo.textContent    = cursoInfo.titulo;
    if ($pillCurso) $pillCurso.textContent = cursoInfo.titulo;
    if ($pillNivel) $pillNivel.textContent = `Lv ${lvl}`;
    if ($helper)    $helper.textContent    = `XP: ${xp} • Progreso: ${pct}%`;
    if ($pb)        $pb.style.width        = `${pct}%`;
  }
  refreshHeader();

  // ---- Mostrar solo teoría y quiz del curso activo
  function showOnlyForActive(){
    // Teoría
    document.querySelectorAll('#teoria-block [data-course]').forEach(el=>{
      el.style.display = Number(el.dataset.course) === idActivo ? 'block' : 'none';
    });

    // Quiz: mostrar solo el bloque del curso y deshabilitar los otros
    document.querySelectorAll('#quiz-form > [data-course]').forEach(el=>{
      const active = Number(el.dataset.course) === idActivo;
      el.style.display = active ? 'block' : 'none';
      el.querySelectorAll('input,select,textarea,button').forEach(inp=>{
        // No deshabilitamos los botones del footer, solo inputs del bloque
        if (inp.type !== 'submit' && inp.id !== 'reset-quiz') {
          inp.disabled = !active;
        }
      });
      // Además, si no es activo, desmarcamos sus radios
      if (!active) el.querySelectorAll('input[type="radio"]').forEach(r => (r.checked = false));
    });
  }
  showOnlyForActive();

  // ---- Editor con persistencia por curso
  function keyCodeFor(id){ return `${LS_CODE_PREFIX}${id}`; }
  function loadEditorContent(){
    const saved = localStorage.getItem(keyCodeFor(idActivo));
    $code.value = saved || (ejemplosPorCurso[idActivo] || "// Escribe tu código aquí…");
  }
  function saveEditorContentDebounced(){
    clearTimeout(saveEditorContentDebounced._t);
    saveEditorContentDebounced._t = setTimeout(()=>{
      localStorage.setItem(keyCodeFor(idActivo), $code.value);
    }, 250);
  }
  if ($code){
    loadEditorContent();
    $code.addEventListener("input", saveEditorContentDebounced);
  }

  // ---- Consola aislada en iframe
  function baseHTMLforIframe() {
    return `
      <!doctype html><html><head>
        <meta charset="utf-8"/>
        <style>
          html,body{margin:0;padding:0;background:#0a0f16;color:#e5e7eb;font-family:ui-monospace,Menlo,Consolas,monospace}
          .wrap{padding:12px}
          .demo{margin-top:8px}
          pre{white-space:pre-wrap;word-break:break-word;padding:10px;border-radius:8px;background:#0f1622;border:1px solid rgba(255,255,255,.08)}
          .ok{color:#a7f3d0}
          .err{color:#fca5a5}
          .title{font-weight:900;margin:0 0 8px 0;opacity:.8}
          .box-center{display:flex;align-items:center;justify-content:center;height:120px}
        </style>
      </head><body><div class="wrap" id="__root"></div></body></html>
    `;
  }
  function writeInIframe(fn){
    if (!$iframe) return;
    const doc = $iframe.contentDocument || $iframe.contentWindow.document;
    doc.open(); doc.write(baseHTMLforIframe()); doc.close();
    fn(doc);
  }
  function runCSS(code){
    writeInIframe(doc=>{
      const style = doc.createElement("style");
      style.textContent = code;
      doc.head.appendChild(style);

      const root = doc.getElementById("__root");
      const title = doc.createElement("p");
      title.className = "title";
      title.textContent = "Vista previa CSS:";
      root.appendChild(title);

      const demo = doc.createElement("div");
      demo.innerHTML = `
        <div class="demo">
          <div class="box-center">
            <div class="demo">CSS aplicado ✅</div>
          </div>
        </div>`;
      root.appendChild(demo);
    });
  }
  function runJS(code){
    writeInIframe(doc=>{
      const root = doc.getElementById("__root");
      const pre  = doc.createElement("pre");
      pre.id = "result"; pre.className = "ok";
      pre.textContent = "Salida de console.log()\n";
      root.appendChild(pre);

      const s = doc.createElement("script");
      s.textContent = `
        (function(){
          const start = performance.now();
          const out = [];
          const oldLog = console.log;
          console.log = function(){ out.push(Array.from(arguments).join(" ")); oldLog.apply(console, arguments); };
          try {
            ${code}
            out.push("\\n✔ Código ejecutado en " + (performance.now()-start).toFixed(1) + " ms");
            document.getElementById("result").textContent = out.join("\\n");
          } catch(e) {
            const el = document.getElementById("result");
            el.className = "err";
            el.textContent = "❌ Error: " + e.message;
          }
        })();
      `;
      doc.body.appendChild(s);
    });
  }
  function runGit(code){
    writeInIframe(doc=>{
      const root = doc.getElementById("__root");
      const title = doc.createElement("p");
      title.className = "title";
      title.textContent = "Simulación de terminal (Git):";
      const pre = doc.createElement("pre");
      pre.textContent = code;
      root.appendChild(title);
      root.appendChild(pre);
    });
  }
  function runCode(){
    const code = ($code?.value || "").trim();
    if (!code) return toast("Escribe algo de código primero.", false);
    if (idActivo === 1)      runCSS(code);
    else if (idActivo === 2) runJS(code);
    else if (idActivo === 3) runGit(code);
    toast("Código ejecutado en la consola virtual ✅");
  }
  function clearConsole(){
    if (!$iframe) return;
    const doc = $iframe.contentDocument || $iframe.contentWindow.document;
    doc.open(); doc.write(baseHTMLforIframe()); doc.close();
  }

  // ---- Quiz solo del curso activo
  function getVisibleQuizBlock(){
    return document.querySelector(`#quiz-form > [data-course="${idActivo}"]`);
  }
  function handleQuizSubmit(e){
    e.preventDefault();
    const cont = getVisibleQuizBlock();
    if (!cont) { setFeedback("No se encontró el quiz del curso.", false); return; }

    const getVal = n => cont.querySelector(`input[name="${n}"]:checked`)?.value || "";
    const ans = { q1: getVal("q1"), q2: getVal("q2"), q3: getVal("q3") };

    if (!ans.q1 || !ans.q2 || !ans.q3) {
      setFeedback("Responde todas las preguntas antes de enviar.", false);
      return;
    }

    let aciertos = 0;
    const correct = respuestas[idActivo] || {};
    Object.keys(correct).forEach(k => { if (ans[k] === correct[k]) aciertos++; });

    const xpGanada = aciertos * 40;
    addXP(xpGanada);
    setFeedback(`Has acertado ${aciertos}/3. +${xpGanada} XP ${aciertos===3?"💥":""}`, aciertos>=2);
  }
  function resetQuiz(){
    const cont = getVisibleQuizBlock();
    if (!cont) return;
    cont.querySelectorAll('input[type="radio"]').forEach(i => (i.checked = false));
    setFeedback("", true);
  }
  function setFeedback(text, ok){
    if (!$quizFeedback) return;
    $quizFeedback.textContent = text;
    $quizFeedback.className = "feedback " + (ok ? "ok" : "bad");
  }

  // ---- XP / Toast
  function addXP(amount){
    if (!amount || amount <= 0) return;
    cursoData.xp = Math.min(240, (cursoData.xp || 0) + amount);
    misCursos = misCursos.map(m => (m.id === cursoData.id ? cursoData : m));
    localStorage.setItem(LS_MIS_CURSOS, JSON.stringify(misCursos));
    refreshHeader();
    toast(`XP +${amount}. Nivel actual: ${getLevel(cursoData.xp)}.`);
  }
  function toast(text, positive = true){
    const t = document.createElement("div");
    t.textContent = text;
    Object.assign(t.style, {
      position:"fixed", right:"16px", bottom:"16px", zIndex:"1000",
      padding:"10px 14px", borderRadius:"12px", fontWeight:"800",
      color:"#0b1220", boxShadow:"0 8px 20px rgba(0,0,0,.35)"
    });
    t.style.background = positive
      ? "linear-gradient(90deg, var(--brand-2), var(--accent))"
      : "linear-gradient(90deg, #fda4af, #fecaca)";
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 2200);
  }

  // ---- API demo (compat)
  window.ejemploCurso = function ejemploCurso(){
    const msg = [
      "ejemploCurso()",
      "=================",
      "Este es un ejemplo rápido.",
      "Suma de 2 + 3 =", 2+3,
      "Etiqueta semántica sugerida: <main>"
    ].join("\n");
    console.log(msg);
    return msg;
  };

  // ---- Eventos
  document.getElementById("run-code")?.addEventListener("click", runCode);
  document.getElementById("clear-console")?.addEventListener("click", clearConsole);
  $quizForm?.addEventListener("submit", handleQuizSubmit);
  document.getElementById("reset-quiz")?.addEventListener("click", resetQuiz);

  // Cargar iframe vacío
  clearConsole();
})();
