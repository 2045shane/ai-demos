# 首页 Feature Map

Cut：`AI-DEMOS-CUT-2026-10-30-news`  
上一版：`AI-DEMOS-CUT-2026-10-29-v6-home-ia`（Hero、插件、教学、好玩、关于、联系我已合并；本 cut 只插入新闻）  
站点：<https://2045shane.github.io/ai-demos/>  
数据：`data/catalog.json`（作品与插件）、`data/news.json`（新闻外链）  
页面：`index.html`  
分区逻辑：`assets/ia.js`（`LabIA`）  
渲染：`assets/lab.js`  
样式：`assets/lab.css`（沿用 v3 深色 token，本 cut 不换肤）

U0 已关（Shane → 黑执事，按默认）。v6 规则继续有效，本 cut 不改这些结论：

1. 没有独立 Latest 整段。教学区顶部最多 1 张 Featured，从 `section !== "play"` 的教学实验里按日期从新到旧取 1 条；同一天再按 `url` 倒序。
2. 小红书互动课：只有仓库里已经有站内页，或 catalog 里已经有真实外链时，才放进教学。本仓库两者都没有，不造卡。
3. 导航左侧保持 `SHANE / AI LAB`。右侧为「插件 · 教学 · 好玩 · 新闻 · 关于 · 联系我」。
4. 未公开「AI研究」留在插件区：`url` 为空，只显示联系我，不提供下载。
5. 新闻名单里不要加 Hugging Face，除非 Shane 另开口。

## 导航

| 位置 | 文案 | 去向 |
| --- | --- | --- |
| 左 | SHANE / AI LAB | `./` |
| 右 1 | 插件 | `#plugins` |
| 右 2 | 教学 | `#learn` |
| 右 3 | 好玩 | `#play` |
| 右 4 | 新闻 | `#news` |
| 右 5 | 关于 | `#about` |
| 右 6 | 联系我 | `#contact` |

跳过链接指向 `#plugins`。窄屏仍用「菜单」展开这六项。新闻不另开 `news.html`：每天从导航点进首页 `#news`，和插件、教学、好玩同一套锚点。

## 区块顺序

桌面首屏要能看到插件区开头，Hero 不独占视口。Hero 文案保持 v3，不改：

- 标题：Shane的AI奇怪研究
- 副标：Independent AI Lab
- 定位句：把复杂的 AI 概念，变成可以亲手体验的小实验。
- 署名：作者：Shane

| 顺序 | 区块 | id | 数据 |
| --- | --- | --- | --- |
| 1 | Hero | `#top` | 静态文案 |
| 2 | 插件 | `#plugins` | `projects[]`，catalog 顺序 |
| 3 | 教学 | `#learn` | `works[]` 里教学实验；顶部 1 张 Featured；下面按四分类 |
| 4 | 好玩 | `#play` | `works[]` 里 `section: "play"` |
| 5 | 新闻 | `#news` | `data/news.json` 的 `sites[]`，固定 15 条，顺序不改 |
| 6 | 关于 | `#about` | 静态能力向短文 |
| 7 | 联系我 | `#contact` | 小红书「珊哥爱读书」+ `https://github.com/2045shane`；无邮箱 |

页面上不再有 `#latest`、`#explore`、`#projects`。新闻插在好玩和关于之间，不另造 Latest。

## catalog 字段

`works[]`（`type: "experiment"`）：

| 字段 | 作用 |
| --- | --- |
| `title` `description` `date` `category` `url` `cover` | 与原来相同。`category` 仍是 `基础概念`、`安全与风险`、`系统与应用`、`可见与引用` |
| `section` | `"learn"` 或 `"play"`。缺省当作 `"learn"` |
| `url` | 站内相对路径。职业倒计时保持 `job-countdown/` |

当前唯一的好玩条目：`你的职业还剩几年？AI 替代倒计时`，`section: "play"`。它不进入教学主列表，也不参与 Featured。

`projects[]`（`type: "project"`）整表进插件，不看 `section`：

| 标题 | 链接 |
| --- | --- |
| GEO 检查器 | `https://github.com/2045shane/geo-checker` |
| YouTube 公开评论导出 | `https://github.com/2045shane/social-comments-export` |
| 网页表格导出 | `https://github.com/2045shane/web-table-export` |
| 长页存档 | `https://github.com/2045shane/longpage-archive` |
| AI研究 | `url` 为空；`contact` 为小红书私信「珊哥爱读书」 |

已有 GitHub 地址不改。公开卡新标签打开。`url` 为空的卡不渲染外链，也不提供下载。

## 新闻字段

`data/news.json` 的 `sites[]`。`LabIA.newsItems` 按文件顺序返回标题、地址、中文说明都齐全的条目。缺字段的条目不渲染。

| 字段 | 作用 |
| --- | --- |
| `title` | 站点名，卡片标题 |
| `url` | 外链，必须是下面这 15 条，不要改主机名或路径 |
| `description` | 一句中文说明 |

| 顺序 | 标题 | url | 说明 |
| --- | --- | --- | --- |
| 1 | Reddit | `https://www.reddit.com` | 社区讨论与趋势信号。 |
| 2 | Hacker News | `https://news.ycombinator.com` | 极客与创业技术头条。 |
| 3 | Product Hunt | `https://www.producthunt.com` | 新产品发布与发现。 |
| 4 | GitHub Trending | `https://github.com/trending` | 开源仓库热度榜。 |
| 5 | Indie Hackers | `https://www.indiehackers.com` | 独立开发者故事与变现。 |
| 6 | Substack | `https://substack.com` | 长文 newsletter 信息源。 |
| 7 | LinkedIn | `https://www.linkedin.com` | 职业圈动态与行业讨论。 |
| 8 | Threads | `https://www.threads.com` | 轻量公开短帖流。 |
| 9 | Telegram | `https://telegram.org` | 频道/群组信息聚合入口。 |
| 10 | arXiv | `https://arxiv.org` | 预印本论文。 |
| 11 | Google Scholar | `https://scholar.google.com` | 学术检索。 |
| 12 | Lobsters | `https://lobste.rs` | 技术社区精选链接。 |
| 13 | DEV Community | `https://dev.to` | 开发者文章与教程。 |
| 14 | Stack Overflow | `https://stackoverflow.com` | 编程问答。 |
| 15 | Medium | `https://medium.com` | 泛主题长文。 |

整张卡片是外链：`target="_blank"`，`rel="noopener noreferrer"`。无登录、无付费墙、无密钥。

## 渲染路径

1. `index.html` 写出导航、Hero 和七个区块。插件、教学、好玩、新闻的列表容器先空着。
2. 先加载 `assets/ia.js`，再加载 `assets/lab.js`。
3. `lab.js` `fetch("data/catalog.json")`，另一次 `fetch("data/news.json")`。
4. `LabIA.learnWorks` / `LabIA.playWorks` / `LabIA.pickFeatured` 划分作品。`LabIA.pluginOffersDownload` 决定插件卡有没有外链。`LabIA.newsItems` 读新闻名单。
5. 教学：`#learn-featured` 放 0 或 1 张大卡（角标「最新」）；`#learn-root` 按四分类出其余教学卡，分类内日期从旧到新。Featured 那一条仍留在自己的分类里，方便从分类点进原页。
6. 好玩：`#play-root`，日期从新到旧。职业倒计时是当前第一张，地址仍是 `job-countdown/`。
7. 插件：`#plugins-root`，按 `projects[]` 数组顺序。
8. 新闻：`#news-root`，按 `sites[]` 顺序出卡片，样式沿用 `.tile` 和 `.grid`。
9. catalog 载入失败时，插件、教学、好玩三个容器都显示「作品表没有载入。请用网站方式打开本页。」新闻文件载入失败时，只在 `#news-root` 显示「新闻列表没有载入。请用网站方式打开本页。」

教学卡文案是「打开实验 →」。好玩卡文案是「打开 →」。插件公开卡文案仍是「打开独立仓库 ↗」。新闻卡文案是「打开 ↗」。

旧实验文件和三张跳转页（`temperature.html`、`agent.html`、`Prompt Injection Mini-Experiment.html`）留在仓库里，不改路径。

## 硬规则

`npm test` 跑 `tests/ia-check.mjs`。`.github/workflows/ia-check.yml` 在 pull request 和推送到 `main` 时跑同一条命令。

检查锁住：导航六项文案和锚点（新闻在好玩与关于之间）、区块 id 顺序、Hero 四句、没有独立 Latest、Featured 不抽好玩、职业倒计时的 `section` 与 URL、五张插件卡和四条 GitHub 地址、「AI研究」无下载、联系我在关于之后且无邮箱、无主题切换、教学页和旧跳转页返回 200、新闻正好 15 条且 URL 与中文说明与上表一致、新闻卡新标签打开并带 `noopener`、新闻名单不含 Hugging Face。
