# Shane的AI奇怪研究（GitHub Pages 网页包）

这是 Shane 的公开 AI 作品橱窗：互动小实验、独立工具外链和插件简介。打包日期是 2026-10-26，全部是纯静态 HTML，不需要构建，GitHub Pages 免费托管就能用。

- 你已经有的仓库：<https://github.com/2045shane/ai-demos>（公开仓库，Pages 已开启）
- 网站地址：<https://2045shane.github.io/ai-demos/>
- 这个包默认按上面的地址写好了 `sitemap.xml`、`robots.txt` 和首页 canonical。换仓库名时见下文「换地址」。

## 文件清单

| 文件 | 说明 |
|---|---|
| `index.html` | 首页：深色个人 AI 实验室。顺序是 Hero、插件、教学、好玩、关于、联系我。内容来自 `data/catalog.json` |
| `docs/FEATURE-MAP.md` | 导航、区块、catalog 字段和渲染路径 |
| `data/catalog.json` | 作品数据：`title`、`description`、`date`、`category`、`url`、`type`、`cover`；实验可加 `section`（`learn` 或 `play`，缺省是 `learn`） |
| `tests/ia-check.mjs` | `npm test`：锁住导航文案、区块顺序、learn/play 划分和旧页可访问 |
| `assets/lab.css`、`assets/lab.js` | 首页样式和渲染（只给首页用） |
| `job-countdown/` | 职业倒计时试水页 |
| `2026-10-19-llm-temperature.html` | AI 是怎么“说话”的？温度小实验 |
| `2026-10-20-prompt-injection.html` | AI 也会被“骗”？提示注入小实验 |
| `2026-10-21-ai-agent.html` | AI 智能体是个啥？想→做→看 小实验 |
| `2026-10-22-context-window.html` | 上下文窗口是什么？ |
| `2026-10-23-retrieval-augmented-generation.html` | RAG 检索增强生成是什么？ |
| `2026-10-24-generative-engine-optimization.html` | GEO 生成式引擎优化 |
| `2026-10-25-ai-video-dubbing.html` | AI 视频翻译配音是怎么做的？ |
| `2026-10-26-context-compaction.html` | 对话压缩（Compaction）是什么？ |
| `2026-10-27-ai-content-labeling.html` | AI 内容标识是什么？ |
| `2026-10-28-text-to-video.html` | 文字怎么变成视频？两条路一次看懂 |
| `temperature.html`、`agent.html`、`Prompt Injection Mini-Experiment.html` | 仓库里原有的旧网址，现在是跳转页，会自动跳到新文件名，旧链接不会失效 |
| `sitemap.xml` | 站点地图，给 Google / Bing 用 |
| `robots.txt` | 允许抓取，并指向站点地图 |
| `.nojekyll` | 让 GitHub Pages 直接发布原文件，不走 Jekyll 主题 |
| `13ee8bfde5e7821dfb1ff9dfb3065ae3.txt` | IndexNow 公钥文件。文件名和里面那一行都是密钥，必须放在网站根目录公开访问 |
| `.github/workflows/indexnow.yml` | 推送到 `main` 时，把变更的 HTML（含首页）提交给 IndexNow |

### 命名规则

- 从 10/22 起统一用 `YYYY-MM-DD-英文短横线.html`。
- 10/19–10/21 三页原来叫中文名（`温度小实验.html`、`提示注入小实验.html`、`智能体小实验.html`）。这个包里改成了英文名，原文件还留在 `xhs-daily` 里，没有改动。
- 这三页原来缺「定义句 + 作者：AI替我说 + 日期」，包里的版本只在说明文字上方补了这一小块，再补了 description 和 author 两个 meta，玩法和正文都没动。

## 发布步骤（免费）

**方法 A：用现有的 ai-demos 仓库（推荐）**

1. 打开 <https://github.com/2045shane/ai-demos>，点 **Add file → Upload files**。
2. 把这个文件夹里的**全部文件**拖进去（包括 `.nojekyll`；Mac 上按 `⌘ + Shift + .` 可以显示隐藏文件），提交到 `main`。
3. 现在的 `README.md` 会被这份替换掉。旧的三个文件名会变成跳转页。
4. 去 **Settings → Pages**，确认 Source 是 `Deploy from a branch`、分支是 `main`、目录是 `/ (root)`。
5. 等 1–2 分钟，打开 <https://2045shane.github.io/ai-demos/> 检查首页和每一页。

**方法 B：新建一个仓库**

1. 在 GitHub 点 **New repository**，起名（比如 `ai-tiwoshuo`），选 **Public**，然后创建。
2. 按方法 A 的第 1–4 步上传文件并开启 Pages。
3. 网址会变成 `https://2045shane.github.io/<仓库名>/`，记得先做下面的「换地址」。

### 换地址

`sitemap.xml`、`robots.txt` 和 `index.html` 里写的是 `https://2045shane.github.io/ai-demos/`。换仓库名时在终端里运行这一行（把 `新仓库名` 换掉）：

```bash
sed -i '' 's#2045shane.github.io/ai-demos/#2045shane.github.io/新仓库名/#g' sitemap.xml robots.txt index.html *.html
```

## 以后再加作品

实验页、好玩页面和插件外链都写在 `data/catalog.json`。首页顺序是 Hero → 插件 → 教学 → 好玩 → 关于 → 联系我。字段和渲染路径见 `docs/FEATURE-MAP.md`。

1. 站内实验：按 `YYYY-MM-DD-英文短横线.html` 放进仓库根目录。好玩页面可以像 `job-countdown/` 这样放一个目录。
2. 在 `data/catalog.json` 的 `works` 里加一条，填这些字段：
   - `title`：卡片标题
   - `description`：一句说明
   - `date`：真实发布日，`YYYY-MM-DD`
   - `category`：只能是 `基础概念`、`安全与风险`、`系统与应用`、`可见与引用` 之一
   - `url`：相对路径，例如 `2026-10-19-llm-temperature.html` 或 `job-countdown/`
   - `type`：`experiment`
   - `section`：`learn`（教学，可省略）或 `play`（好玩）。职业倒计时是 `play`，地址仍是 `job-countdown/`
   - `cover`：可选，对应首页里已有的轻量封面名（如 `bars`、`clock`）；不认识就用默认图形
3. 插件写在 `projects`：同样带 `title`、`description`、`url`、`type`（`project`）。公开仓库用完整 `https://github.com/...`，页面会新标签打开。现有地址不要改：GEO 检查器、YouTube 公开评论导出、网页表格导出、长页存档。还没公开、没有下载地址的（现在是「AI研究」），把 `url` 留空，并写上真实的 `contact`，不要编造邮箱。
4. 小红书互动课：只有已经有站内页或真实外链时才加进 `works`。没有就不要造一条空卡。
5. 在 `sitemap.xml` 加一行 `<url>`，`loc` 用 `https://2045shane.github.io/ai-demos/` 加上相对路径，`lastmod` 用发布日。首页改了的话，也把首页那条 `lastmod` 改成当天。
6. `robots.txt` 已经指向这份 sitemap，一般不用改。首页 `<link rel="canonical">` 仍是 `https://2045shane.github.io/ai-demos/`。推到 `main` 后，IndexNow 工作流会把这次改过的 HTML（含首页）提交给 Bing 等，不用另配密钥。
7. 改完跑 `npm test`。它检查导航文案、区块顺序，以及旧实验页还在。

教学顶部最多 1 张大卡：从 `section` 不是 `play` 的实验里，按日期从新到旧取第一条；同一天按 `url` 倒序。这张卡仍留在自己的分类里。没有单独的 Latest 整段。

## 之后可选：Google Search Console（免费）

1. 打开 <https://search.google.com/search-console>，选「网址前缀」，填 `https://2045shane.github.io/ai-demos/`。
2. 验证方式选「HTML 标记」，复制 `<meta name="google-site-verification" …>`。
3. 在 `index.html` 里找到注释掉的那一行，换成这个 meta 标签，提交后回到 GSC 点「验证」。
4. 验证通过后，在「站点地图」里提交 `sitemap.xml`。

注意：项目网站（`用户名.github.io/仓库名/`）在 GSC 里只能用「网址前缀」这种方式，不能用「网域」。

## IndexNow（免费，Bing 等；已接入）

密钥文件在仓库根目录：`13ee8bfde5e7821dfb1ff9dfb3065ae3.txt`。里面只有一行 `13ee8bfde5e7821dfb1ff9dfb3065ae3`。IndexNow 用这个公开文件证明站点所有权，所以不要放进 GitHub Secrets。

部署后应能打开：<https://2045shane.github.io/ai-demos/13ee8bfde5e7821dfb1ff9dfb3065ae3.txt>

`.github/workflows/indexnow.yml` 在推送到 `main` 时自动运行，也可以在 Actions 里手动运行（`workflow_dispatch`）：

- 收集本次新增或修改的 HTML，并带上首页 `https://2045shane.github.io/ai-demos/`
- 把这些完整网址 POST 到 `https://api.indexnow.org/indexnow`。JSON 里 `host` 是 `2045shane.github.io`，`key` 是上面的密钥，`keyLocation` 是密钥文件的完整网址
- 返回 200 或 202 表示接受。如果不是 2xx，工作流只记录日志并正常结束，不会影响 GitHub Pages 发布

第一次合并后，Pages 可能还没把密钥文件发布出去，当次提交会被拒绝。等上面的密钥网址能打开后，到 Actions 里重新运行 **IndexNow** 即可。这里不使用 Google Indexing API。

手动补交某一页（密钥是公开的）：

```bash
curl -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json; charset=utf-8" -d '{
  "host": "2045shane.github.io",
  "key": "13ee8bfde5e7821dfb1ff9dfb3065ae3",
  "keyLocation": "https://2045shane.github.io/ai-demos/13ee8bfde5e7821dfb1ff9dfb3065ae3.txt",
  "urlList": ["https://2045shane.github.io/ai-demos/2026-10-26-context-compaction.html"]
}'
```

作者：Shane
