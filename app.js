'use strict';

// 纯静态复刻：数据来自 apps.json（构建期快照），筛选/搜索/排序全部在浏览器本地完成，
// 状态同步到 URL 查询串 ?q= &source= &kernel= &sort=，刷新后状态还在。
var grid = document.getElementById('grid');
var countEl = document.getElementById('count');
var emptyEl = document.getElementById('empty');
var qEl = document.getElementById('q');
var sourceEl = document.getElementById('source');
var kernelEl = document.getElementById('kernel');
var sortEl = document.getElementById('sort');
var resetBtn = document.getElementById('reset');
var apps = [];
var total = 0;

function fmt(n) {
  if (n === null || n === undefined) return '未核实';
  return n.toLocaleString('en-US');
}
function fmtSigned(n) {
  if (n === null || n === undefined) return '未核实';
  return (n > 0 ? '+' : '') + n.toLocaleString('en-US');
}
function fmtPct(n) {
  if (n === null || n === undefined) return '未核实';
  return '+' + n.toFixed(1) + '%';
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function sourceGroup(a) {
  if (a.source === '开源' || a.source === '源码公开（许可受限）') return 'open';
  if (a.source === '未公开') return 'closed';
  return 'unknown';
}
function readState() {
  var p = new URLSearchParams(window.location.search);
  return {
    q: p.get('q') || '',
    source: p.get('source') || 'all',
    kernel: p.get('kernel') || 'all',
    sort: p.get('sort') || 'default'
  };
}
function writeState() {
  var p = new URLSearchParams();
  if (qEl.value) p.set('q', qEl.value);
  if (sourceEl.value !== 'all') p.set('source', sourceEl.value);
  if (kernelEl.value !== 'all') p.set('kernel', kernelEl.value);
  if (sortEl.value !== 'default') p.set('sort', sortEl.value);
  var qs = p.toString();
  history.replaceState(null, '', qs ? '?' + qs : window.location.pathname);
}
function applyFilters() {
  var q = qEl.value.trim().toLowerCase();
  var list = apps.filter(function (a) {
    if (sourceEl.value !== 'all' && sourceGroup(a) !== sourceEl.value) return false;
    if (kernelEl.value !== 'all') {
      if (kernelEl.value === '未核实') {
        if (a.kernel !== '未核实') return false;
      } else if (a.kernel.toLowerCase().indexOf(kernelEl.value.toLowerCase()) === -1) {
        return false;
      }
    }
    if (q) {
      var hay = (a.name + ' ' + a.slug + ' ' + a.kernel + ' ' + a.desc).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });
  var sort = sortEl.value;
  var withIndex = list.map(function (a, i) { return { a: a, i: i }; });
  if (sort === 'stars') {
    withIndex.sort(function (x, y) { return (y.a.stars === null ? -1 : y.a.stars) - (x.a.stars === null ? -1 : x.a.stars); });
  } else if (sort === 'stars7d') {
    withIndex.sort(function (x, y) { return (y.a.stars7d === null ? -1 : y.a.stars7d) - (x.a.stars7d === null ? -1 : x.a.stars7d); });
  } else if (sort === 'stars30d_pct') {
    withIndex.sort(function (x, y) { return (y.a.stars30d_pct === null ? -1 : y.a.stars30d_pct) - (x.a.stars30d_pct === null ? -1 : x.a.stars30d_pct); });
  } else if (sort === 'name') {
    withIndex.sort(function (x, y) { return x.a.name.localeCompare(y.a.name); });
  }
  list = withIndex.map(function (w) { return w.a; });
  render(list);
  writeState();
}
function iconHtml(a) {
  if (a.icon) {
    return '<img class="icon" src="' + esc(a.icon) + '" alt="" loading="lazy" data-letter="' + esc(a.name.charAt(0)) + '" onerror="this.outerHTML=\'<span class=icon-fallback>\'+this.dataset.letter+\'</span>\'">';
  }
  return '<span class="icon-fallback" aria-hidden="true">' + esc(a.name.charAt(0)) + '</span>';
}
function sourceChipClass(a) {
  if (sourceGroup(a) === 'open') return 'open';
  if (sourceGroup(a) === 'closed') return 'closed';
  if (a.source === '源码不完整') return 'limited';
  return '';
}
function render(list) {
  countEl.innerHTML = '共 <b>' + list.length + '</b> 款 / 全部 ' + total + ' 款 · 快照 2026-11-23';
  emptyEl.hidden = list.length !== 0;
  grid.innerHTML = list.map(function (a) {
    var rating = a.rating !== null
      ? '<div class="rating">商店评分数 <b>' + fmt(a.rating) + '</b>' + (a.rating7d !== null ? '（7日 ' + fmtSigned(a.rating7d) + '）' : '') + '</div>'
      : '';
    return '<article class="card">' +
      '<div class="card-head">' + iconHtml(a) +
      '<h2>' + esc(a.name) + '<small>' + esc(a.slug) + '</small></h2></div>' +
      '<p class="desc">' + esc(a.desc) + '</p>' +
      '<div class="chips"><span class="chip kernel">' + esc(a.kernel) + '</span>' +
      '<span class="chip ' + sourceChipClass(a) + '">' + esc(a.source) + '</span>' +
      '<span class="chip">费用：' + esc(a.fee) + '</span></div>' +
      '<div class="stats">' +
      '<div><b>' + fmt(a.stars) + '</b><span>Star 总数</span></div>' +
      '<div><b class="' + (a.stars7d > 0 ? 'up' : '') + '">' + fmtSigned(a.stars7d) + '</b><span>7 日新增</span></div>' +
      '<div><b class="' + (a.stars30d_pct > 0 ? 'up' : '') + '">' + fmtPct(a.stars30d_pct) + '</b><span>30 日比例</span></div>' +
      rating +
      '</div>' +
      '<a class="link" href="' + esc(a.detail) + '" target="_blank" rel="noopener">官方入口 ↗</a>' +
      '</article>';
  }).join('');
}

// 深浅主题切换（默认浅色，偏好存本地）
var themeBtn = document.getElementById('theme');
function syncThemeBtn() {
  var dark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeBtn.textContent = dark ? '☀️ 浅色' : '🌙 深色';
}
if (themeBtn) {
  syncThemeBtn();
  themeBtn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('hr-theme', next); } catch (e) {}
    syncThemeBtn();
  });
}

[qEl, sourceEl, kernelEl, sortEl].forEach(function (el) {
  el.addEventListener('input', applyFilters);
  el.addEventListener('change', applyFilters);
});
resetBtn.addEventListener('click', function () {
  qEl.value = '';
  sourceEl.value = 'all';
  kernelEl.value = 'all';
  sortEl.value = 'default';
  applyFilters();
});

fetch('apps.json')
  .then(function (r) { if (!r.ok) throw new Error('apps.json HTTP ' + r.status); return r.json(); })
  .then(function (data) {
    apps = data.apps || [];
    total = apps.length;
    var s = readState();
    qEl.value = s.q;
    if (sourceEl.querySelector('option[value="' + s.source + '"]')) sourceEl.value = s.source;
    if (kernelEl.querySelector('option[value="' + s.kernel + '"]')) kernelEl.value = s.kernel;
    if (sortEl.querySelector('option[value="' + s.sort + '"]')) sortEl.value = s.sort;
    applyFilters();
  })
  .catch(function (err) {
    countEl.textContent = '数据加载失败：' + err.message + '（请用 http 服务打开，不要直接双击 file://）';
  });
