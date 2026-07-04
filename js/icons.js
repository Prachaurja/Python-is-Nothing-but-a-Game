/* =========================================================================
   ICONS — tiny hand-rolled stroke-icon set. No external deps, no emoji.
   Icon(name, {size, class}) -> inline SVG markup string.
   ========================================================================= */
(function () {
  const PATHS = {
    play:        'M6 4.5l13 7.5-13 7.5z',
    stop:        'M6 6h12v12H6z',
    reset:       'M3 12a9 9 0 1 1 3 6.7 M3 12v5.5 M3 12h5.5',
    sun:         'M12 4V2 M12 22v-2 M4.93 4.93 3.5 3.5 M20.5 20.5l-1.43-1.43 M4 12H2 M22 12h-2 M4.93 19.07 3.5 20.5 M20.5 3.5l-1.43 1.43 M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',
    moon:        'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z',
    menu:        'M3 6h18 M3 12h18 M3 18h18',
    close:       'M6 6l12 12 M18 6L6 18',
    check:       'M20 6 9 17l-5-5',
    chevronDown: 'M6 9l6 6 6-6',
    chevronRight:'M9 6l6 6-6 6',
    arrowRight:  'M5 12h14 M13 6l6 6-6 6',
    arrowUp:     'M12 19V5 M5 12l7-7 7 7',
    arrowDown:   'M12 5v14 M19 12l-7 7-7-7',
    refresh:     'M21 2v6h-6 M3 22v-6h6 M3.5 9a9 9 0 0 1 15-3.7L21 8 M20.5 15a9 9 0 0 1-15 3.7L3 16',
    shuffle:     'M16 3h5v5 M4 20 20.5 3.5 M21 16v5h-5 M15 15l6 6 M4 4l5 5',
    plus:        'M12 5v14 M5 12h14',
    trash:       'M3 6h18 M8 6V4h8v2 M6 6l1 15h10l1-15',
    pencil:      'M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
    download:    'M12 3v13 M7 12l5 5 5-5 M4 21h16',
    upload:      'M12 21V8 M7 13l5-5 5 5 M4 3h16',
    code:        'M8 4 2 12l6 8 M16 4l6 8-6 8',
    grid:        'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
    layers:      'M12 3 2 9l10 6 10-6z M2 15l10 6 10-6 M2 12l10 6 10-6',
    target:      'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0 M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    info:        'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M12 16v-5 M12 8h.01',
    alert:       'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z M12 9v4 M12 17h.01',
    bulb:        'M9 18h6 M10 22h4 M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 2z',
    terminal:    'M4 4h16v16H4z M8 9l3 3-3 3 M13 15h4',
    folder:      'M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z',
    file:        'M6 2h9l5 5v15H6z M15 2v5h5',
    graph:       'M4 20V10 M10 20V4 M16 20v-7 M22 20H2',
    tree:        'M12 3v4 M12 13v8 M6 7h12 M4 11h6v6H4z M14 11h6v6h-6z',
    external:    'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14 21 3',
    settings:    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z',
    lock:        'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4',
    server:      'M3 4h18v6H3z M3 14h18v6H3z M7 7h.01 M7 17h.01',
    book:        'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
    flag:        'M4 22V2 M4 4h14l-3 4 3 4H4',
    trophy:      'M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0z M7 4H3v2a4 4 0 0 0 4 4 M17 4h4v2a4 4 0 0 1-4 4',
    zap:         'M13 2 3 14h8l-1 8 10-12h-8z',
    circleDot:   'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
  };

  function Icon(name, opts = {}) {
    const size = opts.size || 18;
    const cls = opts.class ? ` class="${opts.class}"` : '';
    const stroke = opts.fill ? 'none' : (opts.stroke || 'currentColor');
    const fill = opts.fill || 'none';
    const d = PATHS[name] || PATHS.circleDot;
    const segs = d.split(/\s+(?=M)/).map(seg => `<path d="${seg}"/>`).join('');
    return `<svg${cls} width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="${opts.weight || 2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${segs}</svg>`;
  }

  window.Icon = Icon;
})();
