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
function render(list) {
  countEl.textContent = '共 ' + list.length + ' 款 / 全部 ' + total + ' 款 · 快照 2026-11-23';
  emptyEl.hidden = list.length !== 0;
  grid.innerHTML = list.map(function (a) {
    var rating = a.rating !== null
      ? '<div><b>' + fmt(a.rating) + '</b><span>商店评分数' + (a.rating7d !== null ? '（7日 ' + fmtSigned(a.rating7d) + '）' : '') + '</span></div>'
      : '';
    return '<article class="card">' +
      '<h2>' + esc(a.name) + ' <small>' + esc(a.slug) + '</small></h2>' +
      '<p class="desc">' + esc(a.desc) + '</p>' +
      '<div class="chips"><span class="chip">内核：' + esc(a.kernel) + '</span>' +
      '<span class="chip ' + (sourceGroup(a) === 'open' ? 'open' : sourceGroup(a) === 'closed' ? 'closed' : '') + '">' + esc(a.source) + '</span>' +
      '<span class="chip">费用：' + esc(a.fee) + '</span></div>' +
      '<div class="stats">' +
      '<div><b>' + fmt(a.stars) + '</b><span>Star 总数</span></div>' +
      '<div><b>' + fmtSigned(a.stars7d) + '</b><span>7 日新增</span></div>' +
      '<div><b>' + fmtPct(a.stars30d_pct) + '</b><span>30 日比例</span></div>' +
      rating +
      '</div>' +
      '<a class="link" href="' + esc(a.detail) + '" target="_blank" rel="noopener">官方入口 ↗（原站详情页，内含 GitHub / 商店下载链接）</a>' +
      '</article>';
  }).join('');
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
