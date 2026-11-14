/* Case study panel: intercepts the case study cards and opens the project in-page
   (top info bar + CTA, big title, year/services/summary, then the Behance images stitched together). */
(function () {
  var CDN = "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/";
  var CTA_URL = "https://t.me/ShantanuJha97";

  var CASES = {
    "235649137": {
      title: "BentoLabs", card: "Bento", year: "2025", role: "Lead Product Designer",
      services: ["Product Design", "Interaction Design", "UI/UX", "Web Design", "Illustration"],
      summary: "As Lead Product Designer, I helped revolutionise DeFi with stable, low-risk yields, contributing to a $500K raise that lets users generate safer returns.",
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
      title: "Perpetuals.Fun", card: "Perpetuals.Fun", year: "2025", role: "Lead Designer",
      services: ["Product Design", "Interaction Design", "UI/UX", "Branding"],
      summary: "Raised a $250K seed. As Lead Designer, I designed a platform that lets anyone, anywhere create derivatives without collateral or liquidation risk, powered by crowdfunded liquidity pools.",
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
      title: "Superfy", card: "Superfy", year: "2024", role: "Product Designer",
      services: ["Product Design", "Interaction Design", "Mobile App", "UI/UX"],
      summary: "Raised $6.7M in total funding. As Product Designer, I redesigned this social Q&A app, directly contributing to growth to ~85,000 DAU.",
      url: "https://www.behance.net/gallery/200307305/Connecting-People-Funded-Startup-Design",
      images: [
        "718ab8200307305.666041dac6ff4.png", "ba50aa200307305.666041dac3a04.png",
        "07bc3e200307305.666041dac761c.png", "97e3bc200307305.666041dac3ff7.png",
        "912605200307305.666041dac66c1.png", "b849f1200307305.666041dac54fa.png",
        "4c41db200307305.666041dac462e.png", "fa10f4200307305.666041dac4eeb.png",
        "fceaf3200307305.666041dac5aef.png", "7cc4a5200307305.666041dac60b1.png"
      ]
    },
    "191703151": {
      title: "Mercle", card: "Mercle", year: "2024", role: "Lead Product Designer",
      services: ["Product Design", "Interaction Design", "UI/UX", "Web3"],
      summary: "I led the design for Mercle, an identity and reputation data network for Web3 applications built around questing. Mercle raised a $750K seed round.",
      url: "https://www.behance.net/gallery/191703151/Case-Study-A-Web3-Membership-Ecosystem",
      images: [
        "ab9380191703151.6683b7c899136.png", "8fb0cb191703151.6683b7c8d980c.png",
        "691cdf191703151.6683b7c91edfb.png", "fa881b191703151.6683b7c955b83.png",
        "b48ba3191703151.6683b7c98d9f5.png", "d20d57191703151.6683b7c9d3648.png",
        "c79f8c191703151.6683b7c9eb2b5.png", "980d55191703151.6683b7ca13e8b.png",
        "635a2f191703151.6683b7ca592bb.png", "505ce0191703151.6683b7ca90e00.png",
        "8158c4191703151.6683b7cab7f8a.png", "a960ea191703151.6683b7ce603ee.png",
        "424e36191703151.6683b7cf87362.png", "ffee5a191703151.6683b7cfa9cc2.png",
        "26dbfd191703151.6683b7cfbdd50.png", "070caf191703151.6683b7cfd96e4.png"
      ]
    }
  };
  var BY_CARD = {};
  Object.keys(CASES).forEach(function (id) { BY_CARD[CASES[id].card] = id; });

  var root, scroller, el = {}, lastFocus, isOpen = false, clearTimer;

  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function build() {
    root = h("div", "cs-root");
    root.setAttribute("data-lenis-prevent", "");
    root.setAttribute("aria-hidden", "true");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "cs-title");
    root.innerHTML =
      '<button class="cs-close" type="button" aria-label="Close case study">' +
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>' +
      '</button>' +
      '<div class="cs-scroll">' +
        '<div class="cs-top cs-rise cs-d1">' +
          '<div class="cs-info">' +
            '<div><b>Case study</b><span data-k="name"></span></div>' +
            '<div><b>Role</b><span data-k="role"></span></div>' +
          '</div>' +
          '<div class="cs-actions"><a class="cs-cta" target="_blank" rel="noopener">' +
            '<span class="cs-ico" aria-hidden="true"><svg class="r" viewBox="0 0 256 256"><path d="M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19Zm-61.14,36L78.15,126.35l-49.6-9.73ZM88,200V152.52l24.79,21.74Zm87.53,8L92.85,135.5l119-85.29Z"/></svg><svg class="f" viewBox="0 0 256 256"><path d="M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19ZM175.53,208,92.85,135.5l119-85.29Z"/></svg></span>' +
            'Let’s chat</a></div>' +
        '</div>' +
        '<section class="cs-card">' +
          '<h2 class="cs-title cs-rise cs-d2" id="cs-title"></h2>' +
          '<div class="cs-meta cs-rise cs-d3">' +
            '<div><span class="cs-lbl">Year</span><div class="cs-year" data-k="year"></div></div>' +
            '<div><span class="cs-lbl">Services</span><div class="cs-chips" data-k="services"></div></div>' +
            '<div><span class="cs-lbl">Summary</span><p class="cs-sum" data-k="summary"></p></div>' +
          '</div>' +
          '<div class="cs-rise cs-d4"><div class="cs-stack"></div>' +
          '<div class="cs-foot"><a class="cs-behance" target="_blank" rel="noopener">View on Behance ↗</a></div></div>' +
        '</section>' +
      '</div>';
    document.body.appendChild(root);
    scroller = root.querySelector(".cs-scroll");
    el.close = root.querySelector(".cs-close");
    el.cta = root.querySelector(".cs-cta");
    el.title = root.querySelector(".cs-title");
    el.stack = root.querySelector(".cs-stack");
    el.behance = root.querySelector(".cs-behance");
    ["name", "role", "year", "services", "summary"].forEach(function (k) { el[k] = root.querySelector('[data-k="' + k + '"]'); });
    el.cta.href = CTA_URL;

    el.close.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") close();
      if (e.key === "Tab") { // keep focus inside the panel
        var f = [el.close, el.cta, el.behance];
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && (i === f.length - 1 || i === -1)) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  // shrink the big title until it fits on one line
  function fitTitle() {
    var t = el.title;
    t.style.fontSize = "";
    var avail = t.clientWidth, need = t.scrollWidth;
    if (need > avail && avail > 0) {
      var size = parseFloat(getComputedStyle(t).fontSize);
      t.style.fontSize = Math.floor(size * avail / need * 0.98) + "px";
    }
  }
  window.addEventListener("resize", function () { if (isOpen) fitTitle(); });

  function open(id) {
    var c = CASES[id];
    if (!c) return false;
    if (!root) build();
    el.title.textContent = c.title;
    fitTitle();
    el.name.textContent = c.title;
    el.role.textContent = c.role;
    el.year.textContent = c.year;
    el.summary.textContent = c.summary;
    el.services.innerHTML = "";
    c.services.forEach(function (s) { el.services.appendChild(h("span", null, s)); });
    el.behance.href = c.url;
    clearTimeout(clearTimer);
    el.stack.innerHTML = "";
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
      el.stack.appendChild(img);
    });
    scroller.scrollTop = 0;
    lastFocus = document.activeElement;
    document.documentElement.classList.add("cs-lock");
    root.setAttribute("aria-hidden", "false");
    root.getBoundingClientRect(); // commit start state so the reveal animates
    requestAnimationFrame(function () {
      root.classList.add("is-open");
      el.close.focus({ preventScroll: true });
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
    // drop the big case study images once the panel has faded out, so they don't sit in memory
    clearTimeout(clearTimer);
    clearTimer = setTimeout(function () { if (!isOpen) el.stack.innerHTML = ""; }, 500);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  // Which case does a click belong to? Behance link first, otherwise (e.g. Mercle's card,
  // whose link has no href) the project title inside the clicked card.
  function caseFor(target) {
    if (!target.closest) return null;
    var a = target.closest("a");
    var href = a ? a.getAttribute("href") || "" : "";
    var m = href.match(/behance\.net\/gallery\/(\d+)/);
    if (m) return CASES[m[1]] ? m[1] : null;
    if (href && href !== "#") return null; // a real link elsewhere: leave it alone
    // No usable link: find the project card around the click (a block holding exactly
    // one known project title plus a "View Case Study" button).
    var n = target;
    for (var i = 0; i < 16 && n && n !== document.body; i++, n = n.parentElement) {
      var hits = [];
      n.querySelectorAll("p,h1,h2,h3,h4,h5,h6").forEach(function (t) {
        var id = BY_CARD[t.textContent.trim()];
        if (id && hits.indexOf(id) < 0) hits.push(id);
      });
      if (hits.length > 1) return null;
      if (hits.length === 1 && /View Case Study/.test(n.textContent)) return hits[0];
    }
    return null;
  }

  // Cards with no link of their own (Mercle) still look clickable.
  function markCards() {
    document.querySelectorAll("p,h1,h2,h3,h4,h5,h6").forEach(function (t) {
      if (t.textContent.trim() !== "Mercle") return;
      var n = t;
      for (var i = 0; i < 16 && n && n !== document.body; i++, n = n.parentElement) {
        if (/View Case Study/.test(n.textContent)) { n.style.cursor = "pointer"; break; }
      }
    });
  }
  if (document.readyState === "complete") setTimeout(markCards, 1500);
  else window.addEventListener("load", function () { setTimeout(markCards, 1500); });

  // Capture phase so we run before Framer's own link handling.
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (root && root.contains(e.target)) return;
    var id = caseFor(e.target);
    if (id && open(id)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
})();
