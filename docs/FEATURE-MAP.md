# 首页 Feature Map

Cut：`AI-DEMOS-CUT-2026-10-29-v6-home-ia`  
站点：<https://2045shane.github.io/ai-demos/>  
数据：`data/catalog.json`  
页面：`index.html`  
分区逻辑：`assets/ia.js`（`LabIA`）  
渲染：`assets/lab.js`  
样式：`assets/lab.css`（沿用 v3 深色 token，本 cut 不换肤）

U0 已关（Shane → 黑执事，按默认）：

1. 没有独立 Latest 整段。教学区顶部最多 1 张 Featured，从 `section !== "play"` 的教学实验里按日期从新到旧取 1 条；同一天再按 `url` 倒序。
2. 小红书互动课：只有仓库里已经有站内页，或 catalog 里已经有真实外链时，才放进教学。本仓库两者都没有，不造卡。
3. 导航左侧保持 `SHANE / AI LAB`。右侧为「插件 · 教学 · 好玩 · 关于 · 联系我」。
4. 未公开「AI研究」留在插件区：`url` 为空，只显示联系我，不提供下载。

## 导航

| 位置 | 文案 | 去向 |
| --- | --- | --- |
| 左 | SHANE / AI LAB | `./` |
| 右 1 | 插件 | `#plugins` |
| 右 2 | 教学 | `#learn` |
| 右 3 | 好玩 | `#play` |
| 右 4 | 关于 | `#about` |
| 右 5 | 联系我 | `#contact` |

跳过链接指向 `#plugins`。窄屏仍用「菜单」展开这五项。

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
| 5 | 关于 | `#about` | 静态能力向短文 |
| 6 | 联系我 | `#contact` | 小红书「珊哥爱读书」+ `https://github.com/2045shane`；无邮箱 |

页面上不再有 `#latest`、`#explore`、`#projects`。

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

## 渲染路径

1. `index.html` 写出导航、Hero 和六个区块的空容器。
2. 先加载 `assets/ia.js`，再加载 `assets/lab.js`。
3. `lab.js` `fetch("data/catalog.json")`。
4. `LabIA.learnWorks` / `LabIA.playWorks` / `LabIA.pickFeatured` 划分作品。`LabIA.pluginOffersDownload` 决定插件卡有没有外链。
5. 教学：`#learn-featured` 放 0 或 1 张大卡（角标「最新」）；`#learn-root` 按四分类出其余教学卡，分类内日期从旧到新。Featured 那一条仍留在自己的分类里，方便从分类点进原页。
6. 好玩：`#play-root`，日期从新到旧。职业倒计时是当前第一张，地址仍是 `job-countdown/`。
7. 插件：`#plugins-root`，按 `projects[]` 数组顺序。
8. 载入失败时，三个容器都显示「作品表没有载入。请用网站方式打开本页。」

教学卡文案是「打开实验 →」。好玩卡文案是「打开 →」。插件公开卡文案仍是「打开独立仓库 ↗」。

旧实验文件和三张跳转页（`temperature.html`、`agent.html`、`Prompt Injection Mini-Experiment.html`）留在仓库里，不改路径。

## 硬规则

`npm test` 跑 `tests/ia-check.mjs`。`.github/workflows/ia-check.yml` 在 pull request 和推送到 `main` 时跑同一条命令。

检查锁住：导航五项文案和锚点、区块 id 顺序、Hero 四句、没有独立 Latest、Featured 不抽好玩、职业倒计时的 `section` 与 URL、五张插件卡和四条 GitHub 地址、「AI研究」无下载、联系我在关于之后且无邮箱、无主题切换、教学页和旧跳转页返回 200。
