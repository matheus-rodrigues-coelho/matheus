/* ======= BASE ======= */
body { 
  font-family: Arial, sans-serif;
  background: #0f0f0f;
  padding: 20px;
  text-align: center;            /* centraliza conteúdos gerais */
}

header {
  background-color: #2a2c39; 
  color: #BDC3C7; 
  font-family: Arial, sans-serif; 
  text-align: center; 
  height: 100px; 
  margin: 0; 
  border: none; 
  width: 100%; 
  display: flex; 
  align-items: center; 
  justify-content: center;
 }

/* ======= LAYOUT: MENU (ESQ) + VÍDEO (DIR) ======= */
.layout{
  display: flex;
  align-items: flex-start;
  gap: 16px;                     /* espaço entre menu e player */
}

/* coluna esquerda (menu) */
.sidebar{
  flex: 0 0 300px;               /* largura do menu lateral */
  max-width: 360px;
  position: sticky;              /* opcional: gruda ao rolar */
  top: 8px;
  text-align: left;              /* rótulos/menus alinhados à esquerda */
  margin-left: 20px;        /* espaço na lateral esquerda */
}

/* versão compacta */
.sidebar.compacto #tema{
  height: 36px;
  border-radius: 8px;
  font-weight: 600;
  padding: 0 40px 0 12px;
}


/* coluna direita (player) */
.player{
  flex: 1 1 auto;
  min-width: 0;                  /* evita overflow do iframe */
}

/* ======= PLAYER / CARD ======= */
.video-box { 
  background: #a62121;
  padding: 10px;
  border-radius: 6px;
  max-width: 560px;
  margin: 0 auto;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.video-frame{
  width: 100%;
  aspect-ratio: 16 / 9;
  display: block;
  border: 0;
  border-radius: 4px;
}

.info {
  margin-top: 8px;
}
.info h3 {
  font-size: 16px;
  margin: 4px 0;
  color: #6981a0;
}
.info p {
  font-size: 13px;
  color: #e0dfdf;
}
html, body { 
  margin: 0; 
  padding: 0; 
} 
* { 
  margin: 0; 
  padding: 0; 
  box-sizing: 
  border-box; 
}

/* ======= MENU LATERAL (VERTICAL) ======= */
/* Use <nav class="nav-vertical"><ul>...</ul></nav> */
.nav-vertical ul{
  list-style: none;
  display: flex;
  flex-direction: column;        /* empilha verticalmente */
  gap: 8px;                      /* espaço entre itens */
  margin: 0;
  padding: 0;
}

.nav-vertical ul li a{
  display: block;
  text-decoration: none;
  padding: 10px 14px;
  background: #222634;           /* flat, dark */
  color: #f0f0f0;
  font-weight: bold;
  border: 1px solid #2f3545;     /* borda discreta */
  border-radius: 8px;
  transition: background .2s ease, border-color .2s ease, color .2s ease, transform .1s ease;
}

.nav-vertical ul li a:hover{
  background: #2a3245;
  color: #fff;
  border-color: #3f9cff;
  transform: translateY(-1px);
}

.nav-vertical ul li a:focus-visible{
  outline: 2px solid #3f9cff;
  outline-offset: 2px;
}

/* ======= MENU DE TEMAS (GERADO VIA JS) ======= */
/* O UL #menu-temas está dentro de .nav-vertical e herda o estilo.
   As regras abaixo só ajustam caso queira comportamento diferente.  */
#menu-temas{
  /* herda layout vertical de .nav-vertical; personalize se quiser */
}

/* ======= RESPONSIVO ======= */
@media (max-width: 960px){
  .layout{
    flex-direction: column;      /* empilha no mobile */
  }
  .sidebar{
    position: static;            /* desliga sticky no mobile */
    max-width: none;
    flex: 1 1 auto;
  }
  .video-box{
    max-width: 100%;
  }
}

