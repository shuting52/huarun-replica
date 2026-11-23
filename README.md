# Android 代理客户端目录 — 复刻练习（独立工程）

复刻对象：https://huarun.win/platform/android 这一页。
性质：复刻练习、非原站。本站不提供节点、不托管安装包、不登录、不收集数据。

## 做了什么

纯静态站，无框架（不用 Next / Nuxt / Astro），共 4 个文件：

| 文件 | 作用 |
|---|---|
| `index.html` | 页面结构：页头声明、搜索框、筛选/排序控件、卡片容器 |
| `style.css` | 干净浅色样式，手机单列、桌面多列网格 |
| `app.js` | 拉取 `apps.json`，在浏览器本地做搜索/筛选/排序，并把状态同步到 URL 查询串 |
| `apps.json` | 66 款应用的快照数据（名称、内核、代码状态、费用、Star、7 日新增、30 日比例、商店评分、原站详情链接） |

功能：

- 顶部搜索框（按名称 / slug / 内核 / 描述匹配）
- 按代码状态筛选：全部 / 开源 / 未公开 / 未核实（“开源”含“源码公开（许可受限）”；“源码不完整”归入未核实组，见下）
- 按内核筛选：sing-box / Mihomo / Xray / Shadowsocks / 自研 / Sudoku / WARP / Geph5 / Outline / exclave-core / 未核实（多内核条目按包含匹配，例如选 sing-box 会命中 Interstellar）
- 排序：默认顺序 / Star 总数 ↓ / 7 日新增 ↓ / 30 日比例 ↓ / 名称 A–Z（无 Star 的条目排最后）
- 每张卡片：名称、内核、代码状态、费用、Star 总数、7 日新增、30 日比例；有商店评分的条目（Incy、Clash Plus、Stash for Android）另显评分数
- 每张卡片一个“官方入口”链接，指向原站详情页（该页内含 GitHub / 商店官方下载链接）；本站不托管任何安装包
- URL 同步：`?q=`、`?source=`、`?kernel=`、`?sort=`，刷新后筛选状态还在；“清空筛选”一键复位

## 数据来源与快照日期

- 来源：原站列表页 `https://huarun.win/platform/android`（2026-11-23 用浏览器文本抓取读到），加 15 个详情页核对内核 / 代码状态 / 费用（v2rayNG、FlClash、Clash Meta for Android、sing-box、Hiddify、Karing、Shadowsocks Android、Surfboard、NekoBox for Android、Outline、Exclave、Interstellar、Aether、Geph、Stash for Android）。
- 快照日期：**2026-11-23**。Star 总数与 7 日新增取列表页快照；30 日只有比例（例如 +2.9%），无绝对数，所以 `stars30d` 一律为 null，页面只显示比例。
- 描述用自己的话简写，未搬原站大段文案。
- 核验不到的一律写“未核实”，绝不编数：66 款中内核未核实 49 款、无 Star 数据 5 款（InsightBox、MConnect、Incy、Clash Plus、Stash for Android，其中后 3 款只有商店评分数）。
- 三个在列表页文本抓取中缺名的条目，已通过详情页链接逐一核实：2505 Star 的是 Aether、506 Star 的是 Geph、评分数 29 的是 Stash for Android。
- 列表页与详情页的 Star 有 1–9 的快照时差（例如 v2rayNG 列表 66,367 / 详情 66,376），以列表页为准；AsteriskMeta 的 Star 在初稿中曾误写为 314，已按列表页更正为 295。

## 本地验证（方法与结果，2026-11-23）

1. `python3 -c json.load`：`apps.json` 解析通过，66 条，id 无重复；抽查 v2rayNG 66367、FlClash 64783、Aether 2505、Geph 506、NekoBox for Android 23622、AsteriskMeta 295、Clash Mix 258 全部与列表页一致。
2. `node --check app.js`：JS 语法通过。
3. `python3 -m http.server 8321` + `curl`：`index.html` 200（3200 字节）、`apps.json` 200（20536 字节，解析后 66 条）、`style.css` 200、`app.js` 200、带查询串 `?q=flclash&source=open&kernel=Mihomo&sort=stars` 的页面 200；服务已随验证结束停止，未部署、未发布。
4. Node + DOM 桩真实跑 `app.js`（fetch 读本地 `apps.json`，非手写逻辑复算）：
   - 默认状态：渲染 66 张卡片，计数“共 66 款 / 全部 66 款”
   - `?q=flclash&source=open&kernel=Mihomo&sort=stars`：只剩 1 张（FlClash），URL 同步为同一查询串
   - `?sort=stars`：前 3 名依次为 v2rayNG、FlClash、Clash Meta for Android
   - `?kernel=sing-box`：命中 5 款（含多内核的 Interstellar）

未做真浏览器渲染验证（本任务无浏览器操作权限），页面在真机上的最终呈现建议部署后用手机浏览器点开核对一次。

## 已知缺口

- 内核 / 代码状态 / 费用只核实了 15 个详情页 + 列表页精选 3 款，其余 49 款内核标“未核实”；想补全需逐个打开 66 个详情页核对。
- 卡片的“官方入口”指向原站详情页，未直接写死 GitHub 仓库地址：浏览器文本抓取未返回仓库完整路径，直接拼写仓库地址属于编造。如需直链 GitHub，需逐个从详情页取仓库链接再填入 `apps.json` 的 `detail` 字段（或新增 `github` 字段）。
- Star / 版本数据是 2026-11-23 的静态快照，无每日自动更新定时任务；要做自动更新需另加 GitHub API 快照脚本。
- 无图标、无截图（原站图标为自托管 WebP，未搬用）。
- 30 日新增只有比例，无绝对数；5 款无 Star 数据的条目按 Star 排序时排在最后。
