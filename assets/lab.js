(function () {
  const CATS = ["基础概念", "安全与风险", "系统与应用", "可见与引用"];
  const LEADS = {
    "基础概念": "模型怎么挑下一个词、一次能看多少、聊长了又怎么把对话交下去。",
    "安全与风险": "别人写进网页、邮件或文件里的话，怎样被 AI 当成命令。",
    "系统与应用": "智能体、检索、配音，以及文字怎样变成视频。",
    "可见与引用": "网页怎样被 AI 搜索读懂并引用，生成的内容又怎样标明自己的身份。"
  };

  const covers = {
    bars: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><rect x="28" y="70" width="36" height="28" rx="6" fill="#7ee7f5"/><rect x="76" y="48" width="36" height="50" rx="6" fill="#b7b4ff"/><rect x="124" y="28" width="36" height="70" rx="6" fill="#7ee7f5" opacity=".7"/><rect x="172" y="56" width="36" height="42" rx="6" fill="#7ee7f5" opacity=".45"/></svg>',
    window: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><rect x="36" y="22" width="248" height="76" rx="10" fill="none" stroke="#7ee7f5" stroke-width="3"/><rect x="48" y="36" width="150" height="10" rx="4" fill="#b7b4ff"/><rect x="48" y="54" width="110" height="8" rx="4" fill="#9aa3b5"/><rect x="48" y="70" width="80" height="8" rx="4" fill="#9aa3b5" opacity=".5"/></svg>',
    stack: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><rect x="70" y="28" width="180" height="16" rx="6" fill="#7ee7f5" opacity=".35"/><rect x="58" y="50" width="204" height="16" rx="6" fill="#b7b4ff" opacity=".55"/><rect x="46" y="72" width="228" height="18" rx="6" fill="#7ee7f5"/></svg>',
    shield: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><path d="M160 18l62 22v28c0 28-22 44-62 54-40-10-62-26-62-54V40z" fill="none" stroke="#7ee7f5" stroke-width="3"/><path d="M142 62l12 12 26-28" fill="none" stroke="#b7b4ff" stroke-width="3"/></svg>',
    loop: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><circle cx="90" cy="60" r="18" fill="none" stroke="#7ee7f5" stroke-width="3"/><circle cx="160" cy="60" r="18" fill="none" stroke="#b7b4ff" stroke-width="3"/><circle cx="230" cy="60" r="18" fill="none" stroke="#7ee7f5" stroke-width="3"/><path d="M108 60h34M178 60h34" stroke="#9aa3b5" stroke-width="2"/></svg>',
    book: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><path d="M160 28c-24-10-58-10-86 0v64c28-10 62-10 86 0 24-10 58-10 86 0V28c-28-10-62-10-86 0z" fill="none" stroke="#7ee7f5" stroke-width="3"/><path d="M160 28v64" stroke="#b7b4ff" stroke-width="2"/></svg>',
    wave: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><path d="M20 70c20-24 30-24 50 0s30 24 50 0 30-24 50 0 30 24 50 0 30-24 50 0" fill="none" stroke="#7ee7f5" stroke-width="3"/><path d="M20 86c20-16 30-16 50 0s30 16 50 0 30-16 50 0 30 16 50 0 30-16 50 0" fill="none" stroke="#b7b4ff" stroke-width="2" opacity=".7"/></svg>',
    film: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><rect x="40" y="28" width="70" height="64" rx="8" fill="none" stroke="#7ee7f5" stroke-width="3"/><rect x="125" y="28" width="70" height="64" rx="8" fill="#7ee7f5" opacity=".2" stroke="#b7b4ff" stroke-width="3"/><rect x="210" y="28" width="70" height="64" rx="8" fill="none" stroke="#7ee7f5" stroke-width="3"/></svg>',
    clock: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><circle cx="160" cy="60" r="34" fill="none" stroke="#7ee7f5" stroke-width="3"/><path d="M160 60V38M160 60l16 10" stroke="#b7b4ff" stroke-width="3" stroke-linecap="round"/></svg>',
    quote: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><text x="48" y="86" fill="#7ee7f5" font-size="72" font-family="Georgia, serif">“</text><rect x="120" y="46" width="140" height="8" rx="4" fill="#b7b4ff"/><rect x="120" y="64" width="90" height="8" rx="4" fill="#9aa3b5"/></svg>',
    tag: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><path d="M48 40h120l28 20-28 20H48z" fill="none" stroke="#7ee7f5" stroke-width="3"/><circle cx="78" cy="60" r="5" fill="#b7b4ff"/></svg>',
    check: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><rect x="70" y="28" width="180" height="64" rx="12" fill="none" stroke="#7ee7f5" stroke-width="3"/><path d="M118 60l18 16 40-36" fill="none" stroke="#b7b4ff" stroke-width="3"/></svg>',
    plug: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><rect x="128" y="24" width="18" height="28" rx="4" fill="#7ee7f5"/><rect x="174" y="24" width="18" height="28" rx="4" fill="#b7b4ff"/><rect x="112" y="48" width="96" height="40" rx="12" fill="none" stroke="#7ee7f5" stroke-width="3"/></svg>',
    default: '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="120" fill="#181d28"/><circle cx="160" cy="60" r="22" fill="none" stroke="#7ee7f5" stroke-width="3"/></svg>'
  };

  const $ = (id) => document.getElementById(id);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function coverNode(key) {
    const box = el("div", "cover");
    box.innerHTML = covers[key] || covers.default;
    return box;
  }

  function experimentCard(work, featured, newestDate, cta) {
    const link = document.createElement("a");
    link.className = featured ? "tile tile-feature" : "tile";
    link.href = work.url;
    link.append(coverNode(work.cover));
    const meta = el("div", "meta");
    meta.append(el("span", "pill", work.category));
    meta.append(el("span", null, work.date));
    if (featured && work.date === newestDate) meta.append(el("span", "pill pill-new", "最新"));
    link.append(meta);
    link.append(el("h3", null, work.title));
    link.append(el("p", null, work.description));
    link.append(el("span", "go", cta));
    return link;
  }

  function renderLearn(works) {
    const learn = LabIA.learnWorks(works);
    const featured = LabIA.pickFeatured(works);
    const featuredRoot = $("learn-featured");
    featuredRoot.replaceChildren();
    if (featured) featuredRoot.append(experimentCard(featured, true, featured.date, "打开实验 →"));

    const root = $("learn-root");
    root.replaceChildren();
    CATS.forEach((cat) => {
      const items = learn
        .filter((work) => work.category === cat)
        .slice()
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
      if (!items.length) return;
      const block = el("section", "cat");
      block.append(el("h3", null, cat));
      block.append(el("p", "cat-lead", LEADS[cat] || ""));
      const grid = el("div", "grid");
      items.forEach((work) => grid.append(experimentCard(work, false, "", "打开实验 →")));
      block.append(grid);
      root.append(block);
    });
  }

  function renderPlay(works) {
    const root = $("play-root");
    root.replaceChildren();
    LabIA.playWorks(works)
      .slice()
      .sort(LabIA.compareNewest)
      .forEach((work) => root.append(experimentCard(work, false, "", "打开 →")));
  }

  function renderPlugins(projects) {
    const root = $("plugins-root");
    root.replaceChildren();
    projects.forEach((item) => {
      const card = el("article", "project");
      card.append(coverNode(item.cover));
      if (item.label) card.append(el("p", "pill", item.label));
      card.append(el("h3", null, item.title));
      card.append(el("p", null, item.description));
      if (LabIA.pluginOffersDownload(item)) {
        const a = document.createElement("a");
        a.className = "ext";
        a.href = item.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.append(document.createTextNode("打开独立仓库 ↗"));
        const host = el("span", null, item.url.replace(/^https:\/\//, ""));
        a.append(host);
        card.append(a);
      }
      if (item.contact) card.append(el("p", "contact-line", item.contact));
      root.append(card);
    });
  }

  function showLoadError() {
    ["plugins-root", "learn-featured", "learn-root", "play-root"].forEach((id) => {
      const node = $(id);
      if (node) node.append(el("p", "status", "作品表没有载入。请用网站方式打开本页。"));
    });
  }

  const toggle = $("nav-toggle");
  const links = $("site-nav");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  fetch("data/catalog.json")
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    })
    .then((data) => {
      const works = (data.works || []).filter((item) => item.type === "experiment");
      renderPlugins(data.projects || []);
      renderLearn(works);
      renderPlay(works);
    })
    .catch(showLoadError);
})();
