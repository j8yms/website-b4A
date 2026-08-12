(function () {
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbxu6UuYGuvO0h1t6TkJ67Ls8FyGRZryWK29j2BAtWGs6oE418os8Wti5BjLDWyOf5bK/exec";

  function injectStyles() {
    var s = document.createElement("style");
    s.textContent = [
      "#live-queue-bar{display:block;background:#111;color:#f6e2b3;border-bottom:1px solid #D4AF37;text-align:center;padding:10px 20px;font-family:'Roboto',Arial,sans-serif;font-size:14px;font-weight:500;}",
      "#live-queue-bar strong{color:#D4AF37;}",
      "#live-queue-bar .b4a-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#5cb85c;margin-right:7px;vertical-align:middle;}",
      ".barber-status{display:inline-block;margin-left:6px;padding:2px 10px;border-radius:10px;font-size:11px;font-weight:600;letter-spacing:.3px;vertical-align:middle;text-transform:uppercase;color:#fff;}",
      ".barber-status.b4a-available{background:#00b050;}",
      ".barber-status.b4a-busy{background:#c0392b;}",
      ".barber-status.b4a-hidden{display:none;}"
    ].join("\n");
    document.head.appendChild(s);
  }

  function normalize(name) {
    return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function jsonp(done) {
    var s = document.createElement("script");
    var name = "_b4aStatus" + Date.now();
    var timer;
    window[name] = function (data) {
      clearTimeout(timer);
      delete window[name];
      if (s.parentNode) s.parentNode.removeChild(s);
      done(data);
    };
    s.onerror = function () {
      clearTimeout(timer);
      delete window[name];
      if (s.parentNode) s.parentNode.removeChild(s);
      done(null);
    };
    var sep = ENDPOINT.indexOf("?") === -1 ? "?" : "&";
    s.src = ENDPOINT + sep + "status=1&callback=" + encodeURIComponent(name) + "&v=" + Date.now();
    document.head.appendChild(s);
    timer = setTimeout(function () {
      delete window[name];
      if (s.parentNode) s.parentNode.removeChild(s);
      done(null);
    }, 12000);
  }

  function renderBarbers(barbers) {
    var badges = document.querySelectorAll(".barber-status[data-barber]");
    if (!badges.length) return;
    var map = {};
    (barbers || []).forEach(function (b) { map[normalize(b.name)] = b; });
    for (var i = 0; i < badges.length; i++) {
      var badge = badges[i];
      var info = map[normalize(badge.getAttribute("data-barber"))];
      if (!info) {
        badge.className = "barber-status b4a-hidden";
        continue;
      }
      badge.className = "barber-status " + (info.free ? "b4a-available" : "b4a-busy");
      badge.textContent = info.free ? "Free" : "Busy";
    }
  }

  function renderQueue(queue, el) {
    if (!el) return;
    var line = (queue && queue.line) || 0;
    var wait = (queue && queue.waitMinutes) || 0;
    if (line <= 0) {
      el.innerHTML = '<span class="b4a-dot"></span>No clients waiting &mdash; walk in welcome!';
      return;
    }
    el.innerHTML = '<span class="b4a-dot"></span>Live queue: <strong>' + line + (line === 1 ? " person" : " people") + "</strong> in line &middot; about " + wait + " min wait";
  }

  function load() {
    var queueEl = document.getElementById("live-queue-bar");
    var hasBadges = document.querySelectorAll(".barber-status[data-barber]").length > 0;
    if (!queueEl && !hasBadges) return;
    jsonp(function (data) {
      if (!data || data.error) {
        if (queueEl && queueEl.parentNode) queueEl.parentNode.removeChild(queueEl);
        return;
      }
      renderBarbers(data.barbers);
      renderQueue(data.queue, queueEl);
    });
  }

  injectStyles();
  load();
  setInterval(load, 60 * 1000);
})();
