/* Designally — custom runtime replacing the Framer React bundle.
   Handles: scroll reveals (letter stagger, icon pop-ins, generic fades),
   Lottie injection, video autoplay, infinite tickers. */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(0.44, 0, 0.56, 1)";
  var EASE_POP = "cubic-bezier(0.34, 1.56, 0.64, 1)";

  var LOTTIE_BASE = "assets/framerusercontent.com/assets/";
  var LOTTIE_MAP = {
    "framer-fk9jnq-container": "79zUTFsTDlKLO7v8KwuTqAbT0.lottie",
    "framer-4qrzgj-container": "KXGaPzWsvHjrU7Y0YwtbNA2c1jg.lottie",
    "framer-5kkw1k-container": "rxrLyN5he5z9Bwu5zZ99fMhyZL8.lottie",
    "framer-10dwau-container": "79zUTFsTDlKLO7v8KwuTqAbT0.lottie",
    "framer-1ly2uwe-container": "KXGaPzWsvHjrU7Y0YwtbNA2c1jg.lottie",
    "framer-16c7qva-container": "rxrLyN5he5z9Bwu5zZ99fMhyZL8.lottie"
  };

  function makePlayer(src) {
    var el = document.createElement("dotlottie-player");
    el.setAttribute("src", src);
    el.setAttribute("autoplay", "true");
    el.setAttribute("loop", "true");
    el.setAttribute("background", "rgba(252, 252, 252, 0)");
    el.setAttribute("speed", "1");
    el.style.cssText = "width:100%;height:100%;display:block";
    return el;
  }

  function injectLotties() {
    Object.keys(LOTTIE_MAP).forEach(function (cls) {
      document.querySelectorAll("." + cls).forEach(function (host) {
        if (host.querySelector("dotlottie-player")) return;
        host.textContent = "";
        host.appendChild(makePlayer(LOTTIE_BASE + LOTTIE_MAP[cls]));
      });
    });
    document.querySelectorAll("[data-lottie-src]").forEach(function (host) {
      if (host.querySelector("dotlottie-player")) return;
      host.appendChild(makePlayer(host.getAttribute("data-lottie-src")));
    });
  }

  /* ---------- scroll reveals ---------- */

  function isLetterSpan(el) {
    return (
      el.tagName === "SPAN" &&
      el.style.opacity === "0.001" &&
      el.style.filter.indexOf("blur") !== -1
    );
  }

  function revealNow(el, opts) {
    var d = (opts && opts.duration) || 0.6;
    var delay = (opts && opts.delay) || 0;
    var ease = (opts && opts.ease) || EASE;
    if (REDUCED) { d = 0; delay = 0; }
    el.style.transition =
      "opacity " + d + "s " + ease + " " + delay + "s, " +
      "transform " + d + "s " + ease + " " + delay + "s, " +
      "filter " + d + "s " + ease + " " + delay + "s";
    el.style.opacity = "1";
    el.style.transform = "none";
    el.style.filter = "none";
  }

  function setupReveals() {
    var letterGroups = new Map(); // group container -> [letter spans]
    var singles = [];

    document.querySelectorAll('[style*="opacity:0"]').forEach(function (el) {
      var op = el.style.opacity;
      if (op !== "0" && op !== "0.001") return;
      if (el.hasAttribute("data-framer-appear-id")) return; // Framer's own animator handles these
      if (isLetterSpan(el)) {
        var group = el.closest("h1, h2, h3, p") || el.parentElement;
        if (!letterGroups.has(group)) letterGroups.set(group, []);
        letterGroups.get(group).push(el);
      } else {
        singles.push(el);
      }
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var t = entry.target;
          io.unobserve(t);
          if (letterGroups.has(t)) {
            letterGroups.get(t).forEach(function (span, i) {
              revealNow(span, { duration: 0.45, delay: i * 0.02 });
            });
          } else {
            var st = t.getAttribute("style") || "";
            var isPop = st.indexOf("scale(0.5)") !== -1;
            revealNow(t, isPop
              ? { duration: 0.6, delay: 0.2, ease: EASE_POP }
              : { duration: 0.8, delay: 0.1 });
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    letterGroups.forEach(function (_spans, group) { io.observe(group); });
    singles.forEach(function (el) { io.observe(el); });
  }

  /* ---------- videos ---------- */

  function setupVideos() {
    var vids = document.querySelectorAll("video[muted], video");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            v.muted = true;
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            v.pause();
          }
        });
      },
      { rootMargin: "100px 0px 100px 0px" }
    );
    vids.forEach(function (v) {
      if (v.getAttribute("preload") === "none") v.setAttribute("preload", "metadata");
      io.observe(v);
    });
  }

  /* ---------- tickers ---------- */

  function setupTickers() {
    var uls = Array.prototype.slice.call(document.querySelectorAll("ul"));
    uls.forEach(function (ul) {
      if (!ul.children.length) return;
      var isLogos = ul.querySelectorAll("li").length === 0
        ? false
        : ul.closest('[data-framer-name="Testimonials"]') !== null ||
          (ul.querySelectorAll("img").length >= 4);
      var speed = isLogos ? 30 : 100;      // px per second
      var dir = isLogos ? 1 : -1;          // 1 = rightward, -1 = leftward

      var parent = ul.parentElement;
      parent.style.overflow = "hidden";
      ul.style.willChange = "transform";
      ul.style.opacity = "1";

      var originals = Array.prototype.slice.call(ul.children);
      var gap = parseFloat(getComputedStyle(ul).columnGap || getComputedStyle(ul).gap) || 0;

      function contentWidth() {
        var w = 0;
        originals.forEach(function (li) { w += li.getBoundingClientRect().width; });
        return w + gap * originals.length;
      }

      function build() {
        var oneCopy = contentWidth();
        if (oneCopy <= 0) return false;
        var need = Math.max(2, Math.ceil(((parent.clientWidth || innerWidth) * 2) / oneCopy) + 1);
        for (var c = 1; c < need; c++) {
          originals.forEach(function (li) {
            ul.appendChild(li.cloneNode(true));
          });
        }
        var offset = dir === 1 ? -oneCopy : 0;
        var running = true;
        var last = null;

        function frame(ts) {
          if (last !== null && running) {
            var dt = (ts - last) / 1000;
            offset += dir * speed * dt;
            if (dir === -1 && offset <= -oneCopy) offset += oneCopy;
            if (dir === 1 && offset >= 0) offset -= oneCopy;
            ul.style.transform = "translateX(" + offset + "px)";
          }
          last = ts;
          requestAnimationFrame(frame);
        }
        if (!REDUCED) requestAnimationFrame(frame);

        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { running = e.isIntersecting; });
        }).observe(parent);
        return true;
      }

      // images inside may not be measured yet
      if (!build()) {
        window.addEventListener("load", build, { once: true });
      }
    });
  }

  /* ---------- boot ---------- */

  function boot() {
    injectLotties();
    setupReveals();
    setupVideos();
    setupTickers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // dotlottie-player module may register after boot; nothing needed — custom
  // elements upgrade in place automatically.
})();
