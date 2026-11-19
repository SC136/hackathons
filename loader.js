// Fullscreen ASCII loader: a wave of the wallpaper's character ramp. app.js calls hideLoader().
(function () {
  var el = document.getElementById("loader"), art = document.getElementById("loader-art");
  var RAMP = " .:;~tsS%X8@", COLS = 44, ROWS = 7, raf = 0;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function frame(t) {
    var s = "";
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var v = Math.sin(c * 0.28 + t * 2.2) + Math.sin(r * 0.9 - t * 1.6 + c * 0.12);
        var k = Math.round((v + 2) / 4 * (RAMP.length - 1));
        s += RAMP.charAt(k);
      }
      s += "\n";
    }
    art.textContent = s;
    if (!still) raf = requestAnimationFrame(function (n) { frame(n / 1000); });
  }
  frame(0);
  window.hideLoader = function () {
    cancelAnimationFrame(raf);
    el.classList.add("done");
    document.body.classList.remove("loading");
    setTimeout(function () { el.remove(); }, 700);
  };
})();
