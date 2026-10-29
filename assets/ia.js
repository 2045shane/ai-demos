(function (root) {
  function compareNewest(a, b) {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.url !== b.url) return a.url < b.url ? 1 : -1;
    return 0;
  }

  function isPlay(work) {
    return Boolean(work && work.section === "play");
  }

  function learnWorks(works) {
    return (works || []).filter((item) => item.type === "experiment" && !isPlay(item));
  }

  function playWorks(works) {
    return (works || []).filter((item) => item.type === "experiment" && isPlay(item));
  }

  function pickFeatured(works) {
    const sorted = learnWorks(works).slice().sort(compareNewest);
    return sorted.length ? sorted[0] : null;
  }

  function pluginOffersDownload(item) {
    return Boolean(item && item.url);
  }

  root.LabIA = {
    compareNewest,
    isPlay,
    learnWorks,
    playWorks,
    pickFeatured,
    pluginOffersDownload
  };
})(globalThis);
