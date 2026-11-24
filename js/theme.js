// Палитры оформления: кнопка в углу, выбор запоминается в браузере посетителя.
// Подключать в <head> без defer: атрибут ставится до отрисовки, чтобы не мигали старые цвета.
(() => {
  const PALS = [
    { id: 'classic', name: 'Классика', p: '#1B3A8C', a: '#E8B23A', b: '#F1F4FB' },
    { id: 'coral', name: 'Шоколад и коралл', p: '#3B2621', a: '#E07A57', b: '#EFE7DC' },
    { id: 'bordo', name: 'Бордо и золото', p: '#5A1A28', a: '#E2B142', b: '#F1E9E1' },
    { id: 'sage', name: 'Шалфей и терракота', p: '#233F35', a: '#EA9A78', b: '#E9ECE4' },
    { id: 'mocha', name: 'Мокко и карамель', p: '#4A382E', a: '#D9A066', b: '#F0E5D6' },
    { id: 'terra', name: 'Терракота и мёд', p: '#B04E2C', a: '#F4C150', b: '#FBE8DA' },
    { id: 'cinnamon', name: 'Корица и персик', p: '#9A5528', a: '#FFB386', b: '#F9E9DA' },
    { id: 'berry', name: 'Малина и абрикос', p: '#A8384F', a: '#FFB665', b: '#FBE7E7' },
    { id: 'olive', name: 'Оливка и шафран', p: '#5E6824', a: '#F5B53A', b: '#EEF0DA' },
    { id: 'brick', name: 'Кирпич и горчица', p: '#A2442B', a: '#EDBE3A', b: 'color-mix(in srgb,#A2442B 11%,#FFF9F4)' },
    { id: 'plum', name: 'Слива и персик', p: '#7D3C64', a: '#FFB38A', b: 'color-mix(in srgb,#7D3C64 11%,#FFF9F4)' },
    { id: 'vanilla', name: 'Карамель и ваниль', p: '#8C5A22', a: '#F5D480', b: 'color-mix(in srgb,#8C5A22 11%,#FFF9F4)' },
    { id: 'coffee', name: 'Кофе с молоком', p: '#6F4E37', a: '#EBC197', b: 'color-mix(in srgb,#6F4E37 11%,#FFF9F4)' },
    { id: 'cherry', name: 'Вишня и сливки', p: '#B23A3A', a: '#F7C873', b: 'color-mix(in srgb,#B23A3A 11%,#FFF9F4)' },
    { id: 'copper', name: 'Медь и шампань', p: '#9C4F2A', a: '#EED29B', b: 'color-mix(in srgb,#9C4F2A 11%,#FFF9F4)' },
    { id: 'garnet', name: 'Гранат и мандарин', p: '#A3324A', a: '#FFA45C', b: 'color-mix(in srgb,#A3324A 11%,#FFF9F4)' },
    { id: 'cocoa', name: 'Какао и роза', p: '#6B3F3A', a: '#F2A9A0', b: 'color-mix(in srgb,#6B3F3A 11%,#FFF9F4)' },
  ];
  const KEY = 'pal';
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  const apply = id => {
    const pal = PALS.find(x => x.id === id) || PALS[0];
    if (pal.id === 'classic') root.removeAttribute('data-pal'); else root.setAttribute('data-pal', pal.id);
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.content = pal.p;
    return pal.id;
  };
  let cur = apply(saved);

  document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.createElement('div');
    wrap.className = 'palx';
    wrap.innerHTML =
      '<button type="button" class="palx-btn" aria-expanded="false" aria-controls="palx-list" aria-label="Цвета сайта">' +
      '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 0 0 0 18c1.1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/></svg></button>' +
      '<div class="palx-list" id="palx-list" role="group" aria-label="Палитра" hidden>' +
      PALS.map(x => `<button type="button" data-pal-id="${x.id}" aria-pressed="${x.id === cur}"><i style="--sp:${x.p};--sa:${x.a};--sb:${x.b}"></i>${x.name}</button>`).join('') +
      '</div>';
    document.body.appendChild(wrap);
    const btn = wrap.querySelector('.palx-btn'), list = wrap.querySelector('.palx-list');
    const setOpen = open => { list.hidden = !open; btn.setAttribute('aria-expanded', open); };
    btn.addEventListener('click', () => setOpen(list.hidden));
    list.addEventListener('click', e => {
      const b = e.target.closest('[data-pal-id]');
      if (!b) return;
      cur = apply(b.dataset.palId);
      try { localStorage.setItem(KEY, cur); } catch (err) {}
      list.querySelectorAll('[data-pal-id]').forEach(x => x.setAttribute('aria-pressed', x.dataset.palId === cur));
    });
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !list.hidden) { setOpen(false); btn.focus(); } });
  });
})();
