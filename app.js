// Página estática: sem rede, sem cookies, sem armazenamento. Tudo montado com textContent (nada de innerHTML).
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

  var cards = IDEIAS.map(function (i) {
    var c = el('article', 'card');
    var corpo = el('div', 'corpo');
    if (i.img) { var im = el('img'); im.src = i.img; im.alt = ''; im.loading = 'lazy'; im.width = 88; im.height = 88; corpo.appendChild(im); }
    corpo.appendChild(el('span', 'num', 'Ideia ' + String(i.n).padStart(2, '0')));
    corpo.appendChild(el('h2', null, i.titulo));
    if (i.sub) corpo.appendChild(el('p', 'sub', i.sub));
    var ul = el('ul', 'mat');
    (i.links || []).forEach(function (l) {
      var li = el('li'); li.appendChild(link(l[2], 'btn', l[0] + ' ' + l[1])); ul.appendChild(li);
    });
    if (!i.links || !i.links.length) ul.appendChild(el('li', 'breve', 'Links em breve'));
    corpo.appendChild(ul);
    if (i.video) corpo.appendChild(link(i.video, 'video', '▶ Ver o vídeo'));
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
