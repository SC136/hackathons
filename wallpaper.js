// Canvas scenes from SC136/portfolios (c6633b9), adapted for the logbook.
(function () {
    var cv = document.getElementById('wall'), x = cv.getContext('2d');
    var sky = document.getElementById('sky'), dock = document.getElementById('dock');
    var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var still = motion.matches;
    var CELL = 12, DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    var RAMP = ".:;~tsS%X8@";
    var S = { cols: 0, rows: 0, px: -99, py: -99 };
    var chr, fgi, bgi;

    function hash(a, b) { var v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); }
    function put(cx, cy, c, fg, bg) {
        cx |= 0; cy |= 0;
        if (cx < 0 || cy < 0 || cx >= S.cols || cy >= S.rows) return;
        var i = cy * S.cols + cx;
        chr[i] = c ? c.charCodeAt(0) : 32; fgi[i] = fg; bgi[i] = bg || 0;
    }
    function ramp(v, cx, cy) {
        var k = v * (RAMP.length - 1) + (hash(cx, cy) - 0.5) * 2.2;
        return RAMP.charAt(k < 0 ? 0 : k > RAMP.length - 1 ? RAMP.length - 1 : k | 0);
    }
    // loose dashes drifting sideways, used by the water scenes
    function drift(t, fg, speed, density) {
        for (var r = 0; r < S.rows; r++) {
            var off = Math.floor(t * speed * (0.5 + hash(r, 7)) + hash(r, 3) * 400);
            for (var c = 0; c < S.cols; c++) {
                var h = hash(c + off, r);
                if (h < density) put(c, r, h < density * 0.3 ? '=' : '-', fg);
            }
        }
    }
    // a swimmer seen from above: p runs tail(0) to head(1), av is distance from the spine
    function swim(e, t, shape, paint) {
        var L = e.len, ca = Math.cos(e.a), sa = Math.sin(e.a), R = Math.ceil(L * 0.64);
        for (var cy = Math.floor(e.y - R); cy <= e.y + R; cy++) for (var cx = Math.floor(e.x - R); cx <= e.x + R; cx++) {
            var dx = cx + 0.5 - e.x, dy = cy + 0.5 - e.y;
            var u = (dx * ca + dy * sa) / L;
            if (u < -0.5 || u > 0.5) continue;
            var p = u + 0.5, q = 1 - p;
            var v = (-dx * sa + dy * ca) / L - 0.085 * q * q * Math.sin(7 * q - t * e.beat + e.ph);
            var tone = shape(p, Math.abs(v));
            if (tone > 0) paint(cx, cy, p, v, tone, e);
        }
    }
    function wander(e, t, dt) {
        e.a += Math.sin(t * e.wf + e.ph) * 0.28 * dt;
        var dx = e.x - S.px, dy = e.y - S.py, d2 = dx * dx + dy * dy;
        if (d2 < 200) {      // shy of the cursor
            var away = Math.atan2(dy, dx), da = Math.atan2(Math.sin(away - e.a), Math.cos(away - e.a));
            e.a += da * 1.6 * dt;
        }
        e.x += Math.cos(e.a) * e.sp * dt; e.y += Math.sin(e.a) * e.sp * dt;
        var m = e.len * 0.7;
        if (e.x < -m) e.x = S.cols + m; else if (e.x > S.cols + m) e.x = -m;
        if (e.y < -m) e.y = S.rows + m; else if (e.y > S.rows + m) e.y = -m;
    }
    function school(n, lenMin, lenMax, sp) {
        var a = [];
        for (var i = 0; i < n; i++) a.push({
            x: Math.random() * S.cols, y: Math.random() * S.rows, a: Math.random() * 6.28,
            len: lenMin + Math.random() * (lenMax - lenMin), sp: sp * (0.7 + Math.random() * 0.6),
            beat: 2.4 + Math.random() * 1.6, ph: Math.random() * 6.28, wf: 0.25 + Math.random() * 0.4, seed: Math.random() * 50
        });
        return a;
    }
    var ripples = [];
    function ripple(cx, cy) { if (ripples.length < 14) ripples.push({ x: cx, y: cy, b: now() }); }
    function drawRipples(t, fg) {
        for (var i = ripples.length - 1; i >= 0; i--) {
            var r = ripples[i], age = t - r.b, rad = age * 5.5;
            if (age > 2.6) { ripples.splice(i, 1); continue; }
            var n = Math.max(8, rad * 5 | 0);
            for (var k = 0; k < n; k++) {
                if (hash(k, i + 1) < age / 2.6) continue;
                var an = k / n * 6.2832, cx = r.x + Math.cos(an) * rad, cy = r.y + Math.sin(an) * rad;
                var c = Math.abs(Math.cos(an)) > 0.8 ? '|' : Math.abs(Math.sin(an)) > 0.8 ? '-' : (Math.cos(an) * Math.sin(an) > 0 ? '\\' : '/');
                put(cx, cy, c, fg);
            }
        }
    }

    /* ================= scenes ================= */
    var SCENES = [
    {
        key: 'koi', name: 'Koi pond', swatch: 'linear-gradient(135deg,#2c5a4b 55%,#e8643c 55%)', theme: '#2c5a4b',
        sky: 'radial-gradient(120% 90% at 30% 20%, #3a6e5c, #2c5a4b 55%, #234a3e)',
        vars: { ink: '#eef5ee', dim: 'rgba(238,245,238,.68)', panel: 'rgba(18,46,37,.5)', 'panel-2': 'rgba(255,255,255,.08)', line: 'rgba(255,255,255,.17)', veil: 'rgba(40,84,70,.3)', shadow: 'rgba(0,0,0,.3)' },
        //       1 dash      2 white    3 pale     4 orange   5 red      6 black    7 pad      8 pad dk   9 pad ink  10 pink    11 ripple   12 fin ink
        pal: [0, '#5f8f7e', '#f4f1e6', '#dfe5d8', '#f08a3c', '#d9482f', '#1e2a26', '#6fa66a', '#4f8a55', '#2f5c3a', '#f2b8c6', '#a9cdbf', '#cfe0d6'],
        init: function () {
            this.fish = school(Math.max(3, Math.round(S.cols * S.rows / 2600)), 17, 25, 3.2);
            var pads = this.pads = [], spots = [[0.93, 0.1, 7], [0.97, 0.52, 5], [0.9, 0.9, 9], [0.05, 0.86, 6], [0.03, 0.3, 4], [0.84, 0.99, 6]];
            spots.forEach(function (s, i) { pads.push({ x: s[0] * S.cols, y: s[1] * S.rows, r: s[2], notch: i * 1.9, lotus: i === 0 || i === 3 }); });
        },
        shape: function (p, av) {
            if (p < 0.24) { if (p < 0.05 && av < 0.018) return 0; return av < 0.014 + (0.24 - p) * 0.58 ? 0.3 : 0; }
            var w = 0.135 * Math.pow(Math.sin(Math.PI * Math.pow((p - 0.2) / 0.8, 0.8)), 0.6);
            if (av < w) return 0.5 + 0.5 * (1 - av / w);
            if (p > 0.6 && p < 0.75 && av < w + 0.075 * (0.75 - p) / 0.15) return 0.3;
            return 0;
        },
        paint: function (cx, cy, p, v, tone, e) {
            if (tone < 0.5) { put(cx, cy, hash(cx, cy) < 0.5 ? 't' : ':', 12, hash(cx + 9, cy) < 0.45 ? 3 : 0); return; }
            var k = Math.sin(p * 11 + e.seed) * Math.cos(v * 30 + e.seed * 1.7), h = hash(cx * 3 + e.seed | 0, cy);
            var bg = h < 0.05 ? 6 : k > 0.62 ? 5 : k > 0.18 ? 4 : 2;
            put(cx, cy, ramp(tone, cx, cy), bg === 6 ? 2 : 6, bg);
        },
        draw: function (t, dt) {
            drift(t, 1, 0.5, 0.012);
            if (!still && Math.random() < dt * 0.35) ripple(Math.random() * S.cols, Math.random() * S.rows);
            drawRipples(t, 11);
            var self = this;
            this.fish.forEach(function (e) { wander(e, t, dt); swim(e, t, self.shape, self.paint); });
            this.pads.forEach(function (pd, n) {
                var R = pd.r + Math.sin(t * 0.5 + n) * 0.25, bx = Math.sin(t * 0.3 + n * 2) * 0.6;
                for (var cy = Math.floor(pd.y - R); cy <= pd.y + R; cy++) for (var cx = Math.floor(pd.x - R + bx); cx <= pd.x + R + bx; cx++) {
                    var dx = cx + 0.5 - pd.x - bx, dy = cy + 0.5 - pd.y, d = Math.sqrt(dx * dx + dy * dy);
                    if (d > R) continue;
                    var an = Math.atan2(dy, dx) - pd.notch;
                    if (Math.abs(Math.atan2(Math.sin(an), Math.cos(an))) < 0.28 * (d / R) + 0.02) continue;
                    if (d > R - 1) { put(cx, cy, 't', 7); continue; }
                    put(cx, cy, 'tSx%X'.charAt(hash(cx, cy) * 5 | 0), 9, hash(cx + 1, cy + 5) < 0.3 ? 8 : 7);
                }
                if (pd.lotus) for (var k = 0; k < 9; k++) {
                    var lx = pd.x + bx + (k % 3 - 1) * 1 - 1, ly = pd.y + ((k / 3 | 0) - 1) - 1;
                    if (k !== 0 && k !== 8) put(lx, ly, k === 4 ? '@' : '%', 5, k === 4 ? 2 : 10);
                }
            });
        }
    },
    {
        key: 'sharks', name: 'Sharks', swatch: 'linear-gradient(135deg,#f6f5f1 55%,#55585c 55%)', theme: '#fafaf7',
        sky: 'linear-gradient(#fafaf7,#fafaf7)', grid: 'rgba(0,0,0,.035)',
        vars: { ink: '#1b1c1e', dim: 'rgba(27,28,30,.62)', panel: 'rgba(255,255,255,.62)', 'panel-2': 'rgba(0,0,0,.045)', line: 'rgba(0,0,0,.1)', veil: 'rgba(250,250,247,.34)', shadow: 'rgba(40,44,52,.22)' },
        //       1 dash     2 edge     3 light    4 mid      5 dark     6 darkest  7 ink      8 paper
        pal: [0, '#b9bbb9', '#8d9093', '#d4d6d6', '#a9adb0', '#6f7478', '#3c4044', '#17181a', '#f4f4f1'],
        init: function () { this.fish = school(Math.max(3, Math.round(S.cols * S.rows / 2300)), 26, 40, 4.2); },
        shape: function (p, av) {
            if (p < 0.17) return av < 0.012 + (0.17 - p) * (p < 0.06 ? 0.9 : 0.12) ? 0.34 : 0;
            var w = 0.098 * Math.pow(Math.sin(Math.PI * Math.pow((p - 0.1) / 0.9, 0.72)), 0.75);
            if (av < w) return 0.42 + 0.58 * (1 - av / w);
            if (p > 0.47 && p < 0.72 && av < w + 0.17 * (0.72 - p) / 0.25 && av < w + (p - 0.45) * 2.2) return 0.36;
            return 0;
        },
        paint: function (cx, cy, p, v, tone, e) {
            var h = hash(cx, cy), g = tone + (h - 0.5) * 0.22;
            if (g < 0.36) { put(cx, cy, h < 0.5 ? "'" : '.', 2); return; }
            var bg = g > 0.88 ? 6 : g > 0.68 ? 5 : g > 0.5 ? 4 : 3;
            put(cx, cy, ramp(tone, cx, cy), bg >= 5 ? 8 : 7, bg);
        },
        draw: function (t, dt) {
            drift(t, 1, 0.8, 0.01);
            var self = this;
            this.fish.forEach(function (e) { wander(e, t, dt); swim(e, t, self.shape, self.paint); });
            // remoras: a pair of small marks trailing each shark
            this.fish.forEach(function (e) {
                for (var k = 0; k < 3; k++) put(e.x - Math.cos(e.a) * (e.len * 0.62 + k * 1.4) + Math.sin(t * 2 + k) * 0.6, e.y - Math.sin(e.a) * (e.len * 0.62 + k * 1.4), 'o', 2);
            });
        }
    },
    {
        key: 'clouds', name: 'Cloud drift', swatch: 'linear-gradient(135deg,#5b9fe8 55%,#ffffff 55%)', theme: '#6aa9ea',
        sky: 'linear-gradient(180deg,#4f95e2 0%,#86bcf0 55%,#d6e9f9 100%)',
        vars: { ink: '#0f2440', dim: 'rgba(15,36,64,.68)', panel: 'rgba(255,255,255,.52)', 'panel-2': 'rgba(255,255,255,.4)', line: 'rgba(255,255,255,.7)', veil: 'rgba(140,190,240,.22)', shadow: 'rgba(20,50,100,.3)' },
        //       1 white    2 soft     3 shade    4 ink       5 wisp
        pal: [0, '#ffffff', '#eef5fc', '#cfe0f2', '#7f9fc4', '#e3effa'],
        init: function () {
            this.clouds = [];
            var n = Math.max(5, Math.round(S.cols / 16));
            for (var i = 0; i < n; i++) {
                var puffs = [], w = 10 + Math.random() * 18, k = 4 + (Math.random() * 4 | 0);
                for (var j = 0; j < k; j++) puffs.push([(j / (k - 1) - 0.5) * w, -Math.random() * 2.5, 2.5 + Math.random() * 3 + (1 - Math.abs(j / (k - 1) - 0.5) * 2) * 2.5]);
                this.clouds.push({ x: Math.random() * (S.cols + 60) - 30, y: S.rows * (0.08 + 0.84 * hash(i, 4)), w: w, puffs: puffs, sp: 0.6 + Math.random() * 1.3 });
            }
            this.clouds.sort(function (a, b) { return a.sp - b.sp; });
        },
        draw: function (t, dt) {
            for (var r = 0; r < S.rows; r++) {
                var off = Math.floor(t * 2.2 + hash(r, 1) * 300);
                for (var c = 0; c < S.cols; c++) if (hash(c + off, r) < 0.006) put(c, r, '~', 5);
            }
            this.clouds.forEach(function (cl) {
                cl.x += cl.sp * dt;
                if (cl.x - cl.w > S.cols + 8) cl.x = -cl.w - 8;
                for (var cy = Math.floor(cl.y - 9); cy <= cl.y + 1; cy++) for (var cx = Math.floor(cl.x - cl.w); cx <= cl.x + cl.w; cx++) {
                    var best = 0;
                    for (var k = 0; k < cl.puffs.length; k++) {
                        var pf = cl.puffs[k], dx = cx + 0.5 - cl.x - pf[0], dy = (cy + 0.5 - cl.y - pf[1]) * 1.25, v = 1 - Math.sqrt(dx * dx + dy * dy) / pf[2];
                        if (v > best) best = v;
                    }
                    if (best <= 0) continue;
                    var under = (cl.y + 1 - cy) < 2, h = hash(cx - Math.floor(cl.x), cy);
                    if (best < 0.22) { put(cx, cy, h < 0.5 ? '.' : ':', 1); continue; }
                    put(cx, cy, under ? '=' : ' .:oO'.charAt(h * 5 | 0), 4, under ? 3 : best > 0.55 ? 1 : 2);
                }
            });
        }
    },
    {
        key: 'rain', name: 'Night rain', swatch: 'linear-gradient(135deg,#0e1122 55%,#f1dc8a 55%)', theme: '#0e1122',
        sky: 'linear-gradient(180deg,#0b0d1c 0%,#131834 70%,#1b2144 100%)',
        vars: { ink: '#e9ebf7', dim: 'rgba(233,235,247,.64)', panel: 'rgba(20,24,48,.56)', 'panel-2': 'rgba(255,255,255,.07)', line: 'rgba(255,255,255,.13)', veil: 'rgba(13,16,34,.3)', shadow: 'rgba(0,0,0,.5)' },
        //       1 rain     2 rain dim 3 tower    4 tower lt 5 window   6 moon     7 moon dk  8 splash   9 window off
        pal: [0, '#9fb0e6', '#56628f', '#1c2244', '#262d58', '#f3d77a', '#f1ecd2', '#cfc9a8', '#c6d0f5', '#3a4275'],
        init: function () {
            this.drops = [];
            var n = Math.round(S.cols * 0.9);
            for (var i = 0; i < n; i++) this.drops.push({ x: Math.random() * (S.cols + 20), y: Math.random() * S.rows, sp: 26 + Math.random() * 22, len: 2 + (Math.random() * 3 | 0), far: Math.random() < 0.45 });
            this.towers = []; this.splash = [];
            for (var c = 0; c < S.cols; ) {
                var w = 4 + (hash(c, 2) * 6 | 0), h = 4 + (hash(c, 9) * Math.min(16, S.rows * 0.22) | 0);
                this.towers.push({ x: c, w: w, h: h }); c += w + (hash(c, 5) < 0.3 ? 1 : 0);
            }
        },
        draw: function (t, dt) {
            var mx = S.cols * 0.86, my = S.rows * 0.16, mr = Math.min(8, S.cols * 0.08);
            for (var cy = Math.floor(my - mr); cy <= my + mr; cy++) for (var cx = Math.floor(mx - mr); cx <= mx + mr; cx++) {
                var dx = cx + 0.5 - mx, dy = cy + 0.5 - my, d = Math.sqrt(dx * dx + dy * dy);
                if (d > mr) continue;
                var cr = hash(cx, cy) < 0.16;
                put(cx, cy, d > mr - 1 ? ':' : cr ? 'o' : '.', 7, d > mr - 1 ? 0 : cr ? 7 : 6);
            }
            this.towers.forEach(function (tw) {
                for (var r = 0; r < tw.h; r++) for (var c = 0; c < tw.w; c++) {
                    var cx = tw.x + c, cy = S.rows - 1 - r, win = c > 0 && c < tw.w - 1 && r % 2 === 1 && r < tw.h - 1;
                    var lit = win && hash(cx, cy + Math.floor(t * 0.05 + hash(cx, r) * 9)) < 0.3;
                    put(cx, cy, win ? '▪' : ' ', lit ? 5 : 9, (tw.x & 1) ? 4 : 3);
                }
            });
            var self = this;
            this.drops.forEach(function (d) {
                d.y += d.sp * (d.far ? 0.55 : 1) * dt; d.x -= d.sp * 0.22 * dt;
                if (d.y > S.rows - 2 - hash(d.x | 0, 3) * 4) {
                    if (!d.far && self.splash.length < 40) self.splash.push({ x: d.x, y: d.y, b: t });
                    d.y = -4 - Math.random() * 10; d.x = Math.random() * (S.cols + 20);
                }
                for (var k = 0; k < d.len; k++) put(d.x + k * 0.5, d.y - k, k === 0 ? '/' : "'", d.far ? 2 : 1);
            });
            for (var i = this.splash.length - 1; i >= 0; i--) {
                var s = this.splash[i], a = t - s.b;
                if (a > 0.35) { this.splash.splice(i, 1); continue; }
                var w = a > 0.18 ? 2 : 1;
                put(s.x - w, s.y, '.', 8); put(s.x + w, s.y, '.', 8); if (a < 0.18) put(s.x, s.y - 1, "'", 8);
            }
            drawRipples(t, 8);
        }
    }];

    /* ================= engine ================= */
    var scene, t0 = performance.now(), last = 0, paused = false, raf = 0;
    function now() { return (performance.now() - t0) / 1000; }
    function resize() {
        var W = window.innerWidth, H = window.innerHeight;
        cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
        S.cols = Math.ceil(W / CELL); S.rows = Math.ceil(H / CELL);
        var n = S.cols * S.rows;
        chr = new Uint16Array(n); fgi = new Uint8Array(n); bgi = new Uint8Array(n);
        ripples.length = 0;
        if (scene) scene.init();
    }
    function render() {
        var n = S.cols * S.rows, pal = scene.pal, i, p;
        x.setTransform(DPR, 0, 0, DPR, 0, 0);
        x.clearRect(0, 0, S.cols * CELL, S.rows * CELL);
        for (p = 1; p < pal.length; p++) {
            x.fillStyle = pal[p];
            for (i = 0; i < n; i++) if (bgi[i] === p) x.fillRect((i % S.cols) * CELL, (i / S.cols | 0) * CELL, CELL - 1, CELL - 1);
        }
        x.font = "500 10px 'JetBrains Mono', Consolas, monospace";
        x.textAlign = 'center'; x.textBaseline = 'middle';
        for (p = 1; p < pal.length; p++) {
            x.fillStyle = pal[p];
            for (i = 0; i < n; i++) if (fgi[i] === p && chr[i] > 32) x.fillText(String.fromCharCode(chr[i]), (i % S.cols) * CELL + CELL / 2 - 0.5, (i / S.cols | 0) * CELL + CELL / 2);
        }
    }
    function step(dt) {
        chr.fill(0); fgi.fill(0); bgi.fill(0);
        scene.draw(now(), dt);
        render();
    }
    function loop() {
        raf = 0;
        var t = now(), dt = Math.min(0.05, t - last); last = t;
        step(dt);
        if (!paused && !still) raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf) { last = now(); raf = requestAnimationFrame(loop); } }

    function apply(sc) {
        scene = sc;
        document.documentElement.dataset.wallpaper = sc.key;
        var st = document.documentElement.style;
        st.setProperty('--sky', sc.theme);
        for (var k in sc.vars) st.setProperty('--' + k, sc.vars[k]);
        // paper scenes get a faint cell grid instead of a gradient
        sky.style.background = sc.grid
            ? 'linear-gradient(' + sc.grid + ' 1px, transparent 1px) 0 0 / ' + CELL + 'px ' + CELL + 'px, linear-gradient(90deg, ' + sc.grid + ' 1px, transparent 1px) 0 0 / ' + CELL + 'px ' + CELL + 'px, ' + sc.theme
            : sc.sky;
        document.querySelector('meta[name="theme-color"]').setAttribute('content', sc.theme);
        [].forEach.call(dock.querySelectorAll('[data-scene]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-scene') === sc.key)); });
        ripples.length = 0;
        sc.init();
        try { localStorage.setItem('hackathons-wallpaper', sc.key); } catch (e) {}
        if (still || paused) step(0.016); else kick();
    }
    var swapTimer = 0;
    function pick(key, instant) {
        var sc = SCENES.filter(function (s) { return s.key === key; })[0] || SCENES[0];
        clearTimeout(swapTimer);
        document.body.classList.remove('swapping');
        if (sc === scene) return;
        if (instant || still) { apply(sc); return; }
        document.body.classList.add('swapping');
        swapTimer = setTimeout(function () { apply(sc); document.body.classList.remove('swapping'); }, 300);
    }
    function next() { pick(SCENES[(SCENES.indexOf(scene) + 1) % SCENES.length].key); }

    // dock: one button per wallpaper, plus pause
    SCENES.forEach(function (sc) {
        var b = document.createElement('button');
        b.type = 'button'; b.setAttribute('data-scene', sc.key); b.setAttribute('aria-pressed', 'false'); b.title = sc.name; b.setAttribute('aria-label', sc.name);
        b.innerHTML = '<span class="sw" style="background:' + sc.swatch + '"></span><span class="lbl">' + sc.name + '</span>';
        b.addEventListener('click', function () { pick(sc.key); });
        dock.appendChild(b);
    });
    var sep = document.createElement('span'); sep.className = 'sep'; dock.appendChild(sep);
    var pz = document.createElement('button');
    pz.type = 'button'; pz.className = 'ico'; pz.setAttribute('aria-label', 'Pause wallpaper');
    var ICON = { pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>', play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z"/></svg>' };
    pz.innerHTML = ICON.pause;
    pz.addEventListener('click', function () {
        paused = !paused;
        pz.innerHTML = paused ? ICON.play : ICON.pause;
        pz.setAttribute('aria-label', paused ? 'Play wallpaper' : 'Pause wallpaper');
        if (paused) { cancelAnimationFrame(raf); raf = 0; } else kick();
    });
    dock.appendChild(pz);
    pz.hidden = sep.hidden = still;
    motion.addEventListener('change', function () {
        still = motion.matches;
        pz.hidden = sep.hidden = still;
        if (still) {
            cancelAnimationFrame(raf);
            raf = 0;
            step(0);
        } else if (!paused) kick();
    });

    window.addEventListener('keydown', function (e) {
        if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || e.target.isContentEditable || /^(input|select|textarea)$/i.test(e.target.tagName) || document.querySelector('dialog[open]')) return;
        if (e.key === 't' || e.key === 'T') next();
    });
    var lastRip = 0;
    window.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse' || still || paused) return;
        S.px = e.clientX / CELL; S.py = e.clientY / CELL;
        var t = now();
        if (scene && scene.key === 'koi' && t - lastRip > 0.45) { lastRip = t; ripple(S.px, S.py); }
    }, { passive: true });
    window.addEventListener('pointerdown', function (e) { if (!still && !paused && scene && (scene.key === 'koi' || scene.key === 'rain')) ripple(e.clientX / CELL, e.clientY / CELL); }, { passive: true });
    document.addEventListener('pointerleave', function () { S.px = S.py = -99; });
    var rz;
    window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { resize(); if (still || paused) step(0.016); }, 150); });

    resize();
    var saved; try { saved = localStorage.getItem('hackathons-wallpaper'); } catch (e) {}
    pick(saved || 'koi', true);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (still || paused) step(0.016); });
})();
