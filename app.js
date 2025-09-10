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

async function loadData(){
  const res = await fetch("data/content.json");
  state.data = await res.json();
  renderTracks();
  renderItems(getVisibleItems(), "Destaques");
}

function renderTracks(){
  const ul = $("#tracksList"); ul.innerHTML = "";
  state.data.tracks.forEach(t=>{
    const li = document.createElement("li");
    li.textContent = t.title;
    li.addEventListener("click", ()=>{
      $$("#tracksList li").forEach(x=>x.classList.remove("active"));
      li.classList.add("active");
      state.currentTrack = t.id;
      const items = t.items.map(id => state.data.items.find(i=>i.id===id)).filter(Boolean);
      renderItems(items, t.title);
    });
    ul.appendChild(li);
  });
}

function getVisibleItems(){
  const s = state.search.toLowerCase();
  return state.data.items.filter(i=>{
    const bySearch = !s || [i.title, ...(i.tags||[])].join(" ").toLowerCase().includes(s);
    const byLevel  = !state.filters.level || i.level === state.filters.level;
    const byType   = !state.filters.type  || i.type  === state.filters.type;
    return bySearch && byLevel && byType;
  });
}

function renderItems(items, title){
  $("#sectionTitle").textContent = title || "Resultados";
  const wrap = $("#cards"); wrap.innerHTML = "";
  items.forEach(item=>{
    const el = document.createElement("article");
    el.className = "card";
    const badgeType = item.type[0].toUpperCase()+item.type.slice(1);
    const thumb = item.thumb || "https://placehold.co/800x450/png";
    const meta = item.type==="curso" ? `${item.lessons.length} aulas` :
                 item.type==="playlist" ? `${item.list.length} vídeos` : "Aula única";

    el.innerHTML = `
      <div class="thumb"><img src="${thumb}" alt="" style="width:100%;height:100%;object-fit:cover"></div>
      <div class="info">
        <h3>${item.title}</h3>
        <div class="badges">
          <span class="badge">${badgeType}</span>
          <span class="badge">${item.level}</span>
          <span class="badge">${meta}</span>
        </div>
        <div class="badges">${(item.tags||[]).map(t=>`<span class="badge">#${t}</span>`).join("")}</div>
        <button data-id="${item.id}">Abrir</button>
      </div>
    `;
    el.querySelector("button").addEventListener("click", ()=>openItem(item.id));
    wrap.appendChild(el);
  });
}

function openItem(id){
  const item = state.data.items.find(i=>i.id===id);
  if(!item) return;
  let lesson = null;

  if(item.type==="aula"){
    lesson = { id: item.id, title: item.title, youtubeId: item.youtubeId, itemId: item.id };
  } else if(item.type==="curso"){
    // abre primeira aula
    lesson = { ...item.lessons[0], itemId: item.id };
  } else if(item.type==="playlist"){
    lesson = { ...item.list[0], itemId: item.id };
  }

  playLesson(lesson, item);
}

function playLesson(lesson, item){
  $("#playerTitle").textContent = `${item.title} — ${lesson.title}`;
  const url = `https://www.youtube.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1`;
  $("#playerFrame").src = url;
  $("#playerModal").classList.remove("hidden");

  // status + ação
  const key = `${lesson.itemId}:${lesson.id}`;
  updateLessonStatus(key);
  $("#markDone").onclick = ()=>{
    state.progress[key] = true;
    localStorage.setItem("rlacademy.progress", JSON.stringify(state.progress));
    updateLessonStatus(key);
  };

  // se for curso/playlist, joga próximas aulas em sequência ao fechar/reabrir
  $("#closeModal").onclick = ()=> {
    $("#playerFrame").src = "";
    $("#playerModal").classList.add("hidden");
  };
}

function updateLessonStatus(key){
  $("#lessonStatus").textContent = state.progress[key] ? "Concluída ✅" : "Não concluída";
}

// Busca e filtros
$("#searchInput").addEventListener("input", (e)=>{
  state.search = e.target.value;
  state.currentTrack = null;
  renderItems(getVisibleItems(), state.search ? "Resultados" : "Destaques");
});

$("#skillFilter").addEventListener("change", e=>{
  state.filters.level = e.target.value;
  renderItems(getVisibleItems(), "Filtrados");
});

$("#typeFilter").addEventListener("change", e=>{
  state.filters.type = e.target.value;
  renderItems(getVisibleItems(), "Filtrados");
});

$("#viewProgress").addEventListener("click", ()=>{
  const doneKeys = Object.keys(state.progress).filter(k=>state.progress[k]);
  const ids = new Set(doneKeys.map(k=>k.split(":")[0]));
  const items = [...ids].map(id=> state.data.items.find(i=>i.id===id)).filter(Boolean);
  renderItems(items, "Concluídos recentemente");
});

loadData();
