# Android 代理客户端目录 — 复刻练习（独立工程）

复刻对象：https://huarun.win/platform/android 这一页。
性质：复刻练习、非原站。本站不提供节点、不托管安装包、不登录、不收集数据。

## 做了什么

纯静态站，无框架（不用 Next / Nuxt / Astro），不用任何外部 CDN 字体/框架，全部本地文件：

| 文件 | 作用 |
|---|---|
| `index.html` | 结构：深色渐变 hero 区（标题、副标题、66 款/快照日期统计、搜索框、深浅切换按钮）、筛选/排序控件、卡片容器 |
| `style.css` | 现代干净样式：浅色为主、深色主题切换（默认浅色，偏好存 localStorage）、手机单列、桌面多列卡片网格、卡片悬停上浮 |
| `app.js` | 拉取 `apps.json`，在浏览器本地做搜索/筛选/排序，并把状态同步到 URL 查询串；渲染卡片图标（有图标用 `icons/*.webp`，无图标用首字母占位，图片加载失败时自动换占位） |
| `apps.json` | 66 款应用的快照数据（名称、内核、代码状态、费用、Star、7 日新增、30 日比例、商店评分、原站详情链接、图标相对路径 `icon`） |
| `icons/` | 57 个本地图标文件（WebP，原站 `/app-icons/` 的公开图标文件，见下） |

功能：

- 顶部搜索框（按名称 / slug / 内核 / 描述匹配）
- 按代码状态筛选：全部 / 开源 / 未公开 / 未核实（“开源”含“源码公开（许可受限）”；“源码不完整”归入未核实组，见下）
- 按内核筛选：sing-box / Mihomo / Xray / Shadowsocks / 自研 / Sudoku / WARP / Geph5 / Outline / exclave-core / 未核实（多内核条目按包含匹配，例如选 sing-box 会命中 Interstellar）
- 排序：默认顺序 / Star 总数 ↓ / 7 日新增 ↓ / 30 日比例 ↓ / 名称 A–Z（无 Star 的条目排最后）
- 每张卡片：图标（或首字母占位）、名称、内核徽章、代码状态、费用、Star 总数、7 日新增、30 日比例；有商店评分的条目（Incy、Clash Plus、Stash for Android）另显评分数
- 每张卡片一个“官方入口”链接，指向原站详情页（该页内含 GitHub / 商店官方下载链接）；本站不托管任何安装包
- URL 同步：`?q=`、`?source=`、`?kernel=`、`?sort=`，刷新后筛选状态还在；“清空筛选”一键复位

## 数据来源与快照日期

- 来源：原站列表页 `https://huarun.win/platform/android`（2026-11-23 用浏览器文本抓取读到），加 15 个详情页核对内核 / 代码状态 / 费用（v2rayNG、FlClash、Clash Meta for Android、sing-box、Hiddify、Karing、Shadowsocks Android、Surfboard、NekoBox for Android、Outline、Exclave、Interstellar、Aether、Geph、Stash for Android）。
- 快照日期：**2026-11-23**。Star 总数与 7 日新增取列表页快照；30 日只有比例（例如 +2.9%），无绝对数，所以 `stars30d` 一律为 null，页面只显示比例。
- 描述用自己的话简写，未搬原站大段文案。
- 核验不到的一律写“未核实”，绝不编数：66 款中内核未核实 49 款、无 Star 数据 5 款（InsightBox、MConnect、Incy、Clash Plus、Stash for Android，其中后 3 款只有商店评分数）。
- 三个在列表页文本抓取中缺名的条目，已通过详情页链接逐一核实：2505 Star 的是 Aether、506 Star 的是 Geph、评分数 29 的是 Stash for Android。
- 列表页与详情页的 Star 有 1–9 的快照时差（例如 v2rayNG 列表 66,367 / 详情 66,376），以列表页为准；AsteriskMeta 的 Star 在初稿中曾误写为 314，已按列表页更正为 295。

## 图标同步（2026-11-23）

- 方法：逐个打开 66 个详情页（`https://huarun.win/apps/<slug>`），只抄页面末尾 Images 脚注里 `[Image 0]`（应用图标）的真实地址，形如 `https://huarun.win/app-icons/<slug>-20260916-v1.webp` 或 `https://huarun.win/app-icons/<slug>.webp`；下载到本地 `icons/<slug>.webp`，在 `apps.json` 里给每款加 `icon` 字段（相对路径）。只同步图标，未搬原站截图。
- 同步成功 **57 款**：全部下载成功且经 `file` 命令核验为有效 WebP（512×512 居多），共约 900KB，逐个文件大小均 >0。成功清单：v2rayng、clash-meta-for-android、bettbox、hiddify、shadowsocks-android、surfboard、insightbox、clash-mi、mconnect、flyclash-android、outline、box-for-android、flclashx、netproxy、nekobox-by-starifly、clash-plus、yumebox、singcast、throne-for-android、geph、lxbox、nexus、mikubox-for-android、stash-for-android、anyportal、xray-gui、kunbox、mikuray、clashfest、clash-mix、asteriskbox、keqdroid、meow-android、slclash、clash-of-rust、monadbox、akashaproxy、aerobox-for-android、ssrvpn、stelliberty-android、sudodroid、nextbox-for-android、flrone，另加第二批 14 款（2026-11-23 限流缓解后补查）：aether、exclave、box-for-root、surfing、husi、box4magisk、asteriskng、ownbox、asteriskmeta、interstellar、throne-for-android-own716-fork、angela-mihomo、sakurabox、nekobox-for-android。
- 确认无图标 **9 款**（详情页确实没有 Images 脚注，`icon` 为 null，卡片显示首字母占位）：flclash、sing-box、karing、happ-proxy、onexray、zedsecure、vproxy、fluxora、incy（incy 于 2026-11-23 补查确认无图标）。
- **未核实 0 款**：66 款图标状态已全部核实完毕（57 款有图标、9 款确认无图标）。绝无按 slug 拼凑的地址。

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

### 第二轮验证（视觉重构 + 图标同步后，2026-11-23）

1. `node --check app.js`：JS 语法通过。
2. `python3 -m http.server 8322` + `curl`：`index.html` 200（4079 字节）、`apps.json` 200（24160 字节，解析后 66 条、其中 43 条带 `icon`）、`style.css` 200（6573 字节）、`app.js` 200（7041 字节）、`icons/v2rayng.webp` 200（2130B，image/webp）、`icons/flclashx.webp` 200（7338B，image/webp）、带查询串 `?q=flclash&source=open&kernel=Mihomo&sort=stars` 的页面 200；服务已随验证结束停止，未部署、未发布。
3. `file icons/*.webp`：43 个文件全部为有效 WebP（RIFF/WebP，VP8），大小均 >0，共约 708KB。
4. Node + DOM 桩真实跑 `app.js`（fetch 读本地 `apps.json`，非手写逻辑复算）：
   - 默认状态：渲染 66 张卡片，计数“共 66 款 / 全部 66 款 · 快照 2026-11-23”；`<img class="icon">` 43 个，首字母占位 `<span class="icon-fallback">` 23 个；全部 43 个 `src` 在磁盘上存在且均为 WebP；`apps.json` 里 43 条 `icon` 全部存在。
   - `?q=flclash&source=open&kernel=Mihomo&sort=stars`：只剩 1 张（FlClash）
   - `?sort=stars`：前 3 名依次为 v2rayNG、FlClash、Clash Meta for Android
   - `?kernel=sing-box`：命中 5 款（sing-box、Hiddify、Karing、Interstellar、NekoBox for Android）
   - `?q=zzzznomatch`：0 张，空状态正常
   - 深浅切换按钮与图标渲染逻辑均在 `app.js` 中（`getElementById('theme')`、`iconHtml`）；卡片 HTML 抽查：v2rayNG 卡片带 `icons/v2rayng.webp` 且 onerror 回退有效，FlClash 卡片为首字母占位 `F`。

### 第三轮验证（图标补齐后，2026-11-23）

1. `python3 -c json.load`：`apps.json` 解析通过，66 条，其中 57 条带 `icon`，9 条为 null；57 个图标文件全部在磁盘上存在且均为 WebP、大小均 >0。
2. `node --check app.js`：JS 语法通过。
3. `python3 -m http.server 8323` + `curl`：`index.html` 200、`apps.json` 200、新补图标 `icons/nekobox-for-android.webp` 与 `icons/aether.webp` 均 200；服务已随验证结束停止。

## 已知缺口

- 内核 / 代码状态 / 费用只核实了 15 个详情页 + 列表页精选 3 款，其余 49 款内核标“未核实”；想补全需逐个打开 66 个详情页核对。
- 卡片的“官方入口”指向原站详情页，未直接写死 GitHub 仓库地址：浏览器文本抓取未返回仓库完整路径，直接拼写仓库地址属于编造。如需直链 GitHub，需逐个从详情页取仓库链接再填入 `apps.json` 的 `detail` 字段（或新增 `github` 字段）。
- Star / 版本数据是 2026-11-23 的静态快照，无每日自动更新定时任务；要做自动更新需另加 GitHub API 快照脚本。
- 图标 57/66：9 款确认无图标（见“图标同步”一节），其余 57 款均已同步；未搬原站截图。
- 30 日新增只有比例，无绝对数；5 款无 Star 数据的条目按 Star 排序时排在最后。
