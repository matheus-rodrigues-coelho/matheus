// app.js
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

const state = {
  data: null,
  currentTrack: null,
  search: "",
  filters: { level: "", type: "" },
  progress: JSON.parse(localStorage.getItem("rlacademy.progress") || "{}")
};

// Carrega o content.json (raiz) e, se falhar, tenta /data/content.json
async function loadData() {
  try {
    let res = await fetch("content.json", { cache: "no-store" });
    if (!res.ok) {
      // fallback se o arquivo estiver na pasta /data
      res = await fetch("data/content.json", { cache: "no-store" });
    }
    if (!res.ok) throw new Error(`Falha HTTP ${res.status}`);
    state.data = await res.json();

    // validações simples
    if (!state.data.items || !Array.isArray(state.data.items)) {
      throw new Error("JSON sem 'items' ou formato inválido.");
    }
    if (!state.data.tracks || !Array.isArray(state.data.tracks)) {
      console.warn("Aviso: 'tracks' ausente. A barra lateral ficará vazia.");
      state.data.tracks = [];
    }

    renderTracks();
    const initial = getVisibleItems();
    renderItems(initial, "Destaques");
  } catch (err) {
    console.error("Erro carregando content.json:", err);
    showFatalError(
      "Erro ao carregar content.json",
      "Verifique se o arquivo existe (na raiz ou em /data) e se o JSON é válido."
    );
  }
}

function showFatalError(title, msg) {
  const wrap = $("#cards");
  $("#sectionTitle").textContent = "Erro";
  wrap.innerHTML = `
    <article class="card" style="padding:16px">
      <h3 style="margin:0 0 8px 0">${title}</h3>
      <p style="color:#9fb0d9">${msg}</p>
    </article>
  `;
}

function renderTracks() {
  const ul = $("#tracksList");
  if (!ul) return;
  ul.innerHTML = "";
  state.data.tracks.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t.title;
    li.addEventListener("click", () => {
      $$("#tracksList li").forEach(x => x.classList.remove("active"));
      li.classList.add("active");
      state.currentTrack = t.id;
      const items = (t.items || [])
        .map(id => state.data.items.find(i => i.id === id))
        .filter(Boolean);
      renderItems(items, t.title);
    });
    ul.appendChild(li);
  });
}

function getVisibleItems() {
  const s = state.search.toLowerCase();
  return state.data.items.filter(i => {
    const bySearch =
      !s || [i.title, ...(i.tags || [])].join(" ").toLowerCase().includes(s);
    const byLevel = !state.filters.level || i.level === state.filters.level;
    const byType = !state.filters.type || i.type === state.filters.type;
    return bySearch && byLevel && byType;
  });
}

function renderItems(items, title) {
  $("#sectionTitle").textContent = title || "Resultados";
  const wrap = $("#cards");
  wrap.innerHTML = "";

  if (!items || items.length === 0) {
    wrap.innerHTML = `
      <article class="card" style="padding:16px">
        <h3 style="margin:0 0 8px 0">Nada por aqui…</h3>
        <p style="color:#9fb0d9">Tente limpar os filtros, digitar outra busca ou abrir uma trilha na esquerda.</p>
      </article>
    `;
    return;
  }

  items.forEach(item => {
    const el = document.createElement("article");
    el.className = "card";
    const badgeType = item.type ? item.type[0].toUpperCase() + item.type.slice(1) : "Item";
    const thumb = item.thumb || "https://placehold.co/800x450/png?text=RL+Academy";
    const meta =
      item.type === "curso"
        ? `${(item.lessons || []).length} aulas`
        : item.type === "playlist"
        ? `${(item.list || []).length} vídeos`
        : "Aula única";

    el.innerHTML = `
      <div class="thumb">
        <img src="${thumb}" alt="" style="width:100%;height:100%;object-fit:cover">
      </div>
      <div class="info">
        <h3>${item.title || "Sem título"}</h3>
        <div class="badges">
          <span class="badge">${badgeType}</span>
          <span class="badge">${item.level || "—"}</span>
          <span class="badge">${meta}</span>
        </div>
        <div class="badges">
          ${(item.tags || [])
            .map(t => `<span class="badge">#${t}</span>`)
            .join("")}
        </div>
        <button data-id="${item.id}">Abrir</button>
      </div>
    `;
    el.querySelector("button").addEventListener("click", () => openItem(item.id));
    wrap.appendChild(el);
  });
}

function openItem(id) {
  const item = state.data.items.find(i => i.id === id);
  if (!item) return;
  let lesson = null;

  if (item.type === "aula") {
    lesson = {
      id: item.id,
      title: item.title,
      youtubeId: item.youtubeId,
      itemId: item.id
    };
  } else if (item.type === "curso") {
    const first = (item.lessons || [])[0];
    if (!first) return;
    lesson = { ...first, itemId: item.id };
  } else if (item.type === "playlist") {
    const first = (item.list || [])[0];
    if (!first) return;
    lesson = { ...first, itemId: item.id };
  }

  playLesson(lesson, item);
}

function playLesson(lesson, item) {
  $("#playerTitle").textContent = `${item.title} — ${lesson.title}`;
  const url = `https://www.youtube.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1`;
  $("#playerFrame").src = url;
  $("#playerModal").classList.remove("hidden");

  const key = `${lesson.itemId}:${lesson.id}`;
  updateLessonStatus(key);
  $("#markDone").onclick = () => {
    state.progress[key] = true;
    localStorage.setItem("rlacademy.progress", JSON.stringify(state.progress));
    updateLessonStatus(key);
  };

  $("#closeModal").onclick = () => {
    $("#playerFrame").src = "";
    $("#playerModal").classList.add("hidden");
  };
}

function updateLessonStatus(key) {
  $("#lessonStatus").textContent = state.progress[key]
    ? "Concluída ✅"
    : "Não concluída";
}

// Busca e filtros
$("#searchInput").addEventListener("input", e => {
  state.search = e.target.value;
  state.currentTrack = null;
  renderItems(getVisibleItems(), state.search ? "Resultados" : "Destaques");
});

$("#skillFilter").addEventListener("change", e => {
  state.filters.level = e.target.value;
  renderItems(getVisibleItems(), "Filtrados");
});

$("#typeFilter").addEventListener("change", e => {
  state.filters.type = e.target.value;
  renderItems(getVisibleItems(), "Filtrados");
});

$("#viewProgress").addEventListener("click", () => {
  const doneKeys = Object.keys(state.progress).filter(k => state.progress[k]);
  const ids = new Set(doneKeys.map(k => k.split(":")[0]));
  const items = [...ids]
    .map(id => state.data.items.find(i => i.id === id))
    .filter(Boolean);
  renderItems(items, "Concluídos recentemente");
});

loadData();
