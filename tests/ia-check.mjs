import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
let checks = 0;

function check(ok, message) {
  checks += 1;
  if (!ok) errors.push(message);
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function loadLabIA() {
  const context = { globalThis: null };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(read("assets/ia.js"), context, { filename: "assets/ia.js" });
  return context.LabIA;
}

function sectionIds(html) {
  return [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, "http://127.0.0.1");
      let rel = decodeURIComponent(url.pathname);
      if (rel.endsWith("/")) rel += "index.html";
      const file = path.join(root, rel);
      if (!file.startsWith(root)) {
        res.writeHead(403);
        res.end("no");
        return;
      }
      fs.readFile(file, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("missing");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function fetchStatus(port, urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      { hostname: "127.0.0.1", port, path: urlPath },
      (res) => {
        res.resume();
        resolve(res.statusCode);
      }
    );
    req.on("error", reject);
  });
}

const html = read("index.html");
const css = read("assets/lab.css");
const lab = read("assets/lab.js");
const catalog = JSON.parse(read("data/catalog.json"));
const LabIA = loadLabIA();

const navLabels = ["插件", "教学", "好玩", "关于", "联系我"];
const navHrefs = ["#plugins", "#learn", "#play", "#about", "#contact"];
const navBlock = html.slice(html.indexOf('id="site-nav"'), html.indexOf("</ul>"));
const nav = [...navBlock.matchAll(/<a href="(#[^"]+)">([^<]+)<\/a>/g)];
check(nav.map((item) => item[2]).join("|") === navLabels.join("|"), "nav labels must be 插件 · 教学 · 好玩 · 关于 · 联系我");
check(nav.map((item) => item[1]).join("|") === navHrefs.join("|"), "nav hrefs must match section ids in order");
check(nav.length === 5, "nav has exactly five links");
check(html.includes("<span>SHANE</span><span class=\"slash\">/</span><span>AI LAB</span>"), "brand stays SHANE / AI LAB");
check(html.includes('href="#plugins">跳到插件'), "skip link targets plugins");

const ids = sectionIds(html);
check(ids.join("|") === "plugins|learn|play|about|contact", "section order is plugins, learn, play, about, contact");
check(html.indexOf('class="hero') !== -1 && html.indexOf('class="hero') < html.indexOf('id="plugins"'), "hero stays before plugins");
check(!/id="(latest|explore|projects)"/.test(html), "no standalone Latest, Explore, or Projects section");
const headings = [...html.matchAll(/<h2\b[^>]*>([^<]+)<\/h2>/g)].map((match) => match[1]);
check(headings.join("|") === navLabels.join("|"), "section headings match the nav");

const hero = [
  "<h1>Shane的AI奇怪研究</h1>",
  '<p class="subtitle">Independent AI Lab</p>',
  "<p class=\"hero-line\">把复杂的 AI 概念，变成可以亲手体验的小实验。</p>",
  "<p class=\"by\">作者：Shane</p>"
];
hero.forEach((line) => check(html.includes(line), "hero copy locked: " + line));

check(html.indexOf('src="assets/ia.js"') !== -1 && html.indexOf('src="assets/ia.js"') < html.indexOf('src="assets/lab.js"'), "ia.js loads before lab.js");
["learnWorks", "playWorks", "pickFeatured", "pluginOffersDownload", "compareNewest"].forEach((name) => {
  check(lab.includes("LabIA." + name), "lab.js uses LabIA." + name);
});
check(!/latest-root|explore-root|projects-root|#latest|#explore/.test(lab + html), "renderer has no legacy latest/explore/projects roots");

check(css.includes("--bg: #07080d"), "dark background token stays");
check(!/data-theme|theme-toggle|prefers-color-scheme/.test(html + css + lab), "no theme toggle");
check(!/mailto:|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(html + lab + JSON.stringify(catalog)), "no email address");
check(!html.includes("邮箱"), "contact copy has no email label");
check(html.includes("小红书私信「珊哥爱读书」"), "contact keeps Xiaohongshu");
check(html.includes("https://github.com/2045shane"), "contact keeps GitHub");
check(ids.at(-1) === "contact" && ids.at(-2) === "about", "contact sits after about");

const pluginUrls = {
  "GEO 检查器": "https://github.com/2045shane/geo-checker",
  "YouTube 公开评论导出": "https://github.com/2045shane/social-comments-export",
  "网页表格导出": "https://github.com/2045shane/web-table-export",
  "长页存档": "https://github.com/2045shane/longpage-archive"
};
const titles = catalog.projects.map((item) => item.title);
let last = -1;
Object.keys(pluginUrls).concat("AI研究").forEach((title) => {
  const index = titles.indexOf(title);
  check(index > last, "plugin missing or out of order: " + title);
  last = index;
});
Object.entries(pluginUrls).forEach(([title, url]) => {
  const item = catalog.projects.find((entry) => entry.title === title);
  check(item && item.url === url && item.external === true, title + " keeps GitHub url " + url);
  check(LabIA.pluginOffersDownload(item) === true, title + " is a public link");
});
const research = catalog.projects.find((item) => item.title === "AI研究");
check(research && research.url === "" && !LabIA.pluginOffersDownload(research), "AI研究 has no download");
check(research && String(research.contact).includes("珊哥爱读书"), "AI研究 keeps the contact line");

const countdown = catalog.works.find((item) => item.url === "job-countdown/");
check(countdown && countdown.section === "play", "job-countdown section is play");
check(countdown && countdown.url === "job-countdown/", "job-countdown url unchanged");
check(!LabIA.learnWorks(catalog.works).some((item) => item.url === "job-countdown/"), "job-countdown stays out of learn");
check(LabIA.playWorks(catalog.works).some((item) => item.url === "job-countdown/"), "job-countdown is in play");
const featured = LabIA.pickFeatured(catalog.works);
check(featured && featured.url === "2026-10-28-text-to-video.html", "featured card is the newest learn work");
check(featured && featured.url !== "job-countdown/", "featured card is not the play work");

const fixture = [
  { type: "experiment", title: "old", date: "2026-01-01", url: "a.html", section: "learn" },
  { type: "experiment", title: "newer-play", date: "2026-12-01", url: "z/", section: "play" },
  { type: "experiment", title: "mid-b", date: "2026-06-01", url: "b.html" },
  { type: "experiment", title: "mid-c", date: "2026-06-01", url: "c.html" }
];
check(LabIA.pickFeatured(fixture).title === "mid-c", "same-day featured uses url desc and skips play");
check(LabIA.learnWorks(fixture).length === 3, "missing section defaults to learn");
check(LabIA.playWorks(fixture).length === 1, "only section play goes to play");
check(LabIA.pickFeatured([]) === null, "no learn works means no featured card");

catalog.works.concat(catalog.projects).forEach((item) => {
  if (!/小红书/.test(item.title || "") || !/课/.test(item.title || "")) return;
  const real = typeof item.url === "string" && (item.url.startsWith("https://") || item.url.startsWith("http://") || fs.existsSync(path.join(root, item.url)));
  check(real, "小红书课 needs a real in-site page or external url");
});
check(!catalog.works.some((item) => item.title === "小红书互动课"), "do not invent a 小红书互动课 card");

const spot = [
  "/2026-10-19-llm-temperature.html",
  "/2026-10-20-prompt-injection.html",
  "/2026-10-22-context-window.html",
  "/2026-10-24-generative-engine-optimization.html",
  "/2026-10-28-text-to-video.html",
  "/job-countdown/",
  "/temperature.html",
  "/agent.html",
  "/Prompt%20Injection%20Mini-Experiment.html"
];
LabIA.learnWorks(catalog.works).forEach((item) => {
  const urlPath = item.url.endsWith("/") ? "/" + item.url : "/" + item.url;
  if (!spot.includes(urlPath)) spot.push(urlPath);
});

const redirects = {
  "temperature.html": "2026-10-19-llm-temperature.html",
  "agent.html": "2026-10-21-ai-agent.html",
  "Prompt Injection Mini-Experiment.html": "2026-10-20-prompt-injection.html"
};
Object.entries(redirects).forEach(([file, target]) => {
  check(read(file).includes(target), file + " still redirects to " + target);
});

const server = await startServer();
try {
  const port = server.address().port;
  for (const urlPath of spot) {
    const status = await fetchStatus(port, urlPath);
    check(status === 200, urlPath + " must be 200, got " + status);
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}

if (errors.length) {
  console.error(errors.map((message) => "FAIL " + message).join("\n"));
  process.exit(1);
}
console.log("PASS ia-check " + checks + " checks");
