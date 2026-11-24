// Página estática: sem cookies, sem armazenamento. Tudo montado com textContent (nada de innerHTML).
// O vídeo só carrega do YouTube (modo sem cookies) quando a pessoa toca no ▶.
(function () {
  'use strict';
  var IDEIAS = Array.isArray(window.IDEIAS) ? window.IDEIAS : [];
  var lista = document.getElementById('lista');
  var vazio = document.getElementById('vazio');
  var q = document.getElementById('q');

  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function seguro(u) { return /^https:\/\/(meli\.la|www\.mercadolivre\.com\.br|youtube\.com)\//.test(u); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function link(href, cls, txt) {
    var a = el('a', cls, txt);
    if (!seguro(href)) return el('span', cls + ' off', txt);
    a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer nofollow sponsored';
    return a;
  }

  function idVideo(u) { var m = /^https:\/\/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})$/.exec(u || ''); return m ? m[1] : null; }
  var tocando = null;
  function player(id, img, titulo) {
    var box = el('div', 'player');
    var b = el('button', 'capa'); b.type = 'button'; b.setAttribute('aria-label', 'Assistir: ' + titulo);
    if (img) { var im = el('img'); im.src = img; im.alt = ''; im.loading = 'lazy'; b.appendChild(im); }
    b.appendChild(el('span', 'play', '▶'));
    box.appendChild(b);
    b.addEventListener('click', function () {
      if (tocando && tocando !== box) tocando._fechar();
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&playsinline=1&rel=0&modestbranding=1';
      f.title = titulo; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      box.replaceChild(f, b); tocando = box;
      box._fechar = function () { if (f.parentNode) box.replaceChild(b, f); if (tocando === box) tocando = null; };
    });
    return box;
  }

  var cards = IDEIAS.map(function (i) {
    var c = el('article', 'card');
    var corpo = el('div', 'corpo');
    var vid = idVideo(i.video);
    if (i.img && !vid) { var im = el('img'); im.src = i.img; im.alt = ''; im.loading = 'lazy'; im.width = 88; im.height = 88; corpo.appendChild(im); }
    corpo.appendChild(el('span', 'num', 'Ideia ' + String(i.n).padStart(2, '0')));
    corpo.appendChild(el('h2', null, i.titulo));
    if (i.sub) corpo.appendChild(el('p', 'sub', i.sub));
    if (vid) corpo.appendChild(player(vid, i.img, i.titulo));
    var ul = el('ul', 'mat');
    (i.links || []).forEach(function (l) {
      var li = el('li'); li.appendChild(link(l[2], 'btn', l[0] + ' ' + l[1])); ul.appendChild(li);
    });
    if (!i.links || !i.links.length) ul.appendChild(el('li', 'breve', 'Links em breve'));
    corpo.appendChild(ul);
    if (i.video) corpo.appendChild(link(i.video, 'video', vid ? 'Abrir no YouTube' : '▶ Ver o vídeo'));
    c.appendChild(corpo);
    c._busca = norm([i.titulo, i.sub, (i.tags || []).join(' '), (i.links || []).map(function (l) { return l[1]; }).join(' '), 'ideia ' + i.n].join(' '));
    lista.appendChild(c);
    return c;
  });

  function filtrar() {
    var termos = norm(q.value).trim().split(/\s+/).filter(Boolean), n = 0;
    cards.forEach(function (c) {
      var ok = termos.every(function (t) { return c._busca.indexOf(t) !== -1; });
      c.hidden = !ok; if (ok) n++;
    });
    vazio.hidden = n > 0;
  }
  q.addEventListener('input', filtrar);
  filtrar();
})();
