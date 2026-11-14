/* Case study panel: intercepts Behance case-study links and shows the project's
   images stitched together in a slide-up sheet instead of leaving the site. */
(function () {
  var CDN = "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/";

  var CASES = {
    "235649137": {
      title: "BentoLabs",
      url: "https://www.behance.net/gallery/235649137/BentoLabs-Case-Study",
      images: [
        "ee7645235649137.68dbb8244912b.png", "9d3a83235649137.68dbb82448b45.png",
        "d474c8235649137.68dbb8244742e.png", "fb4255235649137.68dbb824461d8.png",
        "b3933f235649137.68dbb82443695.png", "51d4d5235649137.68dbb824446ff.png",
        "19ee7f235649137.68dbb82443097.png", "acef45235649137.68dbb824429d6.png",
        "75d32c235649137.68dbb82445868.png", "f170f9235649137.68dbb8244855b.png",
        "c26843235649137.68dbb82446e70.png", "40c19d235649137.68dbb824441db.png",
        "c747d8235649137.68dbb82443c7a.png", "638c48235649137.68dbb824467f1.png",
        "3ab7eb235649137.68dbb82447d67.png", "6459f6235649137.68dbb82444eb2.png"
      ]
    },
    "216578455": {
      title: "Perpetuals.Fun",
      sub: "Derivatives trading made simple: crowdfunded liquidity pools and liquidation-free perpetual markets.",
      url: "https://www.behance.net/gallery/216578455/PerpetualsFun-Case-Study",
      images: [
        "9c25ba216578455.6782ee7f212f1.png", "dad1bc216578455.678241a85781e.png",
        "bbc3c8216578455.678241a857dbb.png", "f36954216578455.678241a853771.png",
        "652b21216578455.678241a854e1e.png", "fec507216578455.678241a853117.png",
        "2ace45216578455.678241a85539b.png", "22343a216578455.678241a853fff.png",
        "8ad401216578455.678241a858c69.png", "3d995b216578455.678241a854876.png",
        "1b911f216578455.678241a8563ae.png", "9d1c37216578455.678241a857093.png",
        "3d8c8a216578455.678241a855b86.png", "60824b216578455.682d908d39f7d.png"
      ]
    },
    "200307305": {
      title: "Connecting People",
      url: "https://www.behance.net/gallery/200307305/Connecting-People-Funded-Startup-Design",
      images: [
        "718ab8200307305.666041dac6ff4.png", "ba50aa200307305.666041dac3a04.png",
        "07bc3e200307305.666041dac761c.png", "97e3bc200307305.666041dac3ff7.png",
        "912605200307305.666041dac66c1.png", "b849f1200307305.666041dac54fa.png",
        "4c41db200307305.666041dac462e.png", "fa10f4200307305.666041dac4eeb.png",
        "fceaf3200307305.666041dac5aef.png", "7cc4a5200307305.666041dac60b1.png"
      ]
    }
  };

  var root, scroller, titleEl, subEl, stackEl, linkEl, closeBtn, lastFocus, isOpen = false;

  function build() {
    root = document.createElement("div");
    root.className = "cs-root";
    root.setAttribute("data-lenis-prevent", "");
    root.setAttribute("aria-hidden", "true");
    root.innerHTML =
      '<div class="cs-backdrop" data-cs-close></div>' +
      '<div class="cs-sheet" role="dialog" aria-modal="true" aria-labelledby="cs-title">' +
        '<div class="cs-scroll">' +
          '<div class="cs-bar"><span class="cs-label">Case study</span>' +
            '<button class="cs-close" type="button" aria-label="Close case study" data-cs-close>' +
              '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>' +
            '</button></div>' +
          '<header class="cs-head"><h2 class="cs-title" id="cs-title"></h2><p class="cs-sub"></p></header>' +
          '<div class="cs-images"><div class="cs-stack"></div></div>' +
          '<div class="cs-foot"><a class="cs-behance" target="_blank" rel="noopener">View on Behance ↗</a></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    scroller = root.querySelector(".cs-scroll");
    titleEl = root.querySelector(".cs-title");
    subEl = root.querySelector(".cs-sub");
    stackEl = root.querySelector(".cs-stack");
    linkEl = root.querySelector(".cs-behance");
    closeBtn = root.querySelector(".cs-close");

    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-cs-close]")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") close();
      if (e.key === "Tab") { // keep focus inside the panel
        var f = [closeBtn, linkEl];
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  function open(id) {
    var c = CASES[id];
    if (!c) return false;
    if (!root) build();
    titleEl.textContent = c.title;
    subEl.textContent = c.sub || "";
    subEl.style.display = c.sub ? "" : "none";
    linkEl.href = c.url;
    stackEl.innerHTML = "";
    c.images.forEach(function (file, i) {
      var img = new Image();
      img.alt = c.title + " case study, part " + (i + 1);
      img.decoding = "async";
      img.loading = i < 2 ? "eager" : "lazy";
      img.className = "is-loading";
      img.onload = function () { img.className = ""; };
      img.onerror = function () { // fall back to the non-webp rendition once
        if (img.src.indexOf("/1400_webp/") > -1) img.src = img.src.replace("/1400_webp/", "/1400/");
      };
      img.src = CDN + file;
      stackEl.appendChild(img);
    });
    scroller.scrollTop = 0;
    lastFocus = document.activeElement;
    document.documentElement.classList.add("cs-lock");
    root.setAttribute("aria-hidden", "false");
    // next frame so the slide-up transition runs
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { root.classList.add("is-open"); closeBtn.focus({ preventScroll: true }); });
    });
    isOpen = true;
    return true;
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("cs-lock");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  // Capture phase so we run before Framer's own link handling.
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href*="behance.net/gallery/"]');
    if (!a) return;
    var m = a.getAttribute("href").match(/behance\.net\/gallery\/(\d+)/);
    if (m && CASES[m[1]] && open(m[1])) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
})();
