(function () {
  const IMPACTS = ["替代", "缩编", "AI 辅助", "相对受保护"];
  const $ = (id) => document.getElementById(id);

  let jobs = [];
  let baseline = null;
  let selected = null;
  let timer = 0;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatYears(n) {
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
  }

  function parseBaseline(text) {
    const parts = String(text).split("-").map(Number);
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
    return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
  }

  function targetDate(years) {
    const whole = Math.floor(years + 1e-9);
    const half = years - whole >= 0.5 - 1e-9;
    const d = new Date(baseline.getTime());
    d.setFullYear(d.getFullYear() + whole);
    if (half) d.setMonth(d.getMonth() + 6);
    return d;
  }

  function remaining(now, target) {
    if (now.getTime() >= target.getTime()) {
      return { past: true, years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    let years = target.getFullYear() - now.getFullYear();
    let months = target.getMonth() - now.getMonth();
    let days = target.getDate() - now.getDate();
    let hours = target.getHours() - now.getHours();
    let minutes = target.getMinutes() - now.getMinutes();
    let seconds = target.getSeconds() - now.getSeconds();
    if (seconds < 0) { seconds += 60; minutes -= 1; }
    if (minutes < 0) { minutes += 60; hours -= 1; }
    if (hours < 0) { hours += 24; days -= 1; }
    if (days < 0) {
      const prev = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prev.getDate();
      months -= 1;
    }
    if (months < 0) { months += 12; years -= 1; }
    return { past: false, years, months, days, hours, minutes, seconds };
  }

  function paint() {
    if (!selected || !baseline) return;
    const left = remaining(new Date(), targetDate(selected.years_until));
    const clock = pad(left.hours) + ":" + pad(left.minutes) + ":" + pad(left.seconds);
    $("y").textContent = String(left.years);
    $("m").textContent = String(left.months);
    $("d").textContent = String(left.days);
    $("clock").textContent = left.past ? "00:00:00" : clock;
    $("card-y").textContent = String(left.years);
    $("card-m").textContent = String(left.months);
    $("card-d").textContent = String(left.days);
    $("card-clock").textContent = left.past ? "00:00:00" : clock;
    $("live").firstChild.textContent = left.past ? "估计的时间点已经过了。还剩 " : "还剩 ";
  }

  function choose(job) {
    selected = job;
    $("result").hidden = false;
    $("impact").textContent = job.impact;
    $("impact").dataset.impact = job.impact;
    $("job-name").textContent = job.name;
    $("reason").textContent = job.reason;
    $("estimate").textContent = "这份估计写的是约 " + formatYears(job.years_until) + " 年，从 " + baseline.getFullYear() + "-" + pad(baseline.getMonth() + 1) + "-" + pad(baseline.getDate()) + " 起算。下面是此刻还剩的时间。";
    $("card-name").textContent = job.name;
    $("card-impact").textContent = job.impact;
    document.querySelectorAll(".job").forEach((btn) => {
      btn.setAttribute("aria-selected", btn.dataset.id === job.id ? "true" : "false");
    });
    paint();
    clearInterval(timer);
    timer = setInterval(paint, 1000);
    $("result").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function render(list) {
    const box = $("jobs");
    box.replaceChildren();
    list.forEach((job) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "job";
      btn.dataset.id = job.id;
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", selected && selected.id === job.id ? "true" : "false");
      btn.append(document.createTextNode(job.name));
      const small = document.createElement("small");
      small.textContent = job.impact;
      btn.append(small);
      btn.addEventListener("click", () => choose(job));
      li.append(btn);
      box.append(li);
    });
    $("shown").textContent = "共 " + jobs.length + " 个职业，当前显示 " + list.length + " 个";
    $("empty").hidden = list.length !== 0;
  }

  function applyFilter() {
    const q = $("q").value.trim().toLowerCase();
    const list = q ? jobs.filter((job) => job.name.toLowerCase().includes(q)) : jobs;
    render(list);
  }

  fetch("jobs.json")
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    })
    .then((data) => {
      baseline = parseBaseline(data.baseline);
      jobs = Array.isArray(data.jobs) ? data.jobs : [];
      if (!baseline || jobs.length === 0) throw new Error("bad json");
      jobs.forEach((job) => {
        if (!IMPACTS.includes(job.impact)) throw new Error("bad impact");
      });
      $("q").addEventListener("input", applyFilter);
      render(jobs);
    })
    .catch(() => {
      $("shown").textContent = "职业表没有载入。请用网站方式打开本页，例如本地的 http 服务。";
    });
})();
