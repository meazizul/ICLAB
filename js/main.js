(function ($) {
"use strict";

	/* Preloader */
	var win = $(window);
	win.on('load',function() {
		$('.page-loader').delay(350).fadeOut('slow');
	});

	/* menu last class added */
	$('ul.basic-menu>li').slice(-2).addClass('menu-p-right');

	/* TOP Menu Stick  */
	win.on('scroll',function() {
	if ($(this).scrollTop() > 1){
		$('#sticky-header').addClass("sticky");
	  }
	  else{
		$('#sticky-header').removeClass("sticky");
	  }
	});

	/* meanmenu */
	 $('#mobile-nav').meanmenu({
		 meanMenuContainer: '.basic-mobile-menu',
		 meanScreenWidth: "767"
	 });

	/* hamburgers menu option  */
    $('.hamburger').on('click', function() {
        $(this).toggleClass('is-active');
        $(this).next().toggleClass('nav-menu-show')
    });

	/* imagesLoaded active */
	$('#portfolio-grid,.blog-masonry').imagesLoaded( function() {

		/* Filter menu */
		$('.filter-menu').on( 'click', 'button', function() {
		  var filterValue = $(this).attr('data-filter');
		  $grid.isotope({ filter: filterValue });
		});

		/* filter menu active class  */
		$('.filter-menu button').on('click', function(event) {
			$(this).siblings('.active').removeClass('active');
			$(this).addClass('active');
			event.preventDefault();
		});

		/* Filter active */
		var $grid = $('#portfolio-grid').isotope({
		  itemSelector: '.portfolio-item',
		  percentPosition: true,
		  masonry: {
			columnWidth: '.portfolio-item',
		  }
		});

		$('.blog-masonry').isotope({
		  itemSelector: '.blog-item',
		  percentPosition: true,
		  masonry: {
			columnWidth: '.blog-item',
		  }
		});

	});

	/* magnificPopup img view */
	$('.popup-link').magnificPopup({
		type: 'image',
		gallery: {
		  enabled: true
		}
	});

	/* magnificPopup video view */
	$('.popup-video').magnificPopup({
		type: 'iframe'
	});

	/* scroll to top */
	if ($.scrollUp) {
		$.scrollUp({
			scrollName: 'scrollUp',
			topDistance: '300',
			topSpeed: 300,
			animation: 'fade',
			animationInSpeed: 1000,
			animationOutSpeed: 1000,
			scrollText: '<i class="ion-chevron-up"></i>',
		});
	}

	/* smooth scroll for in-page nav links */
	$('a[href^="#"]').on('click', function (e) {
		var target = $(this).attr('href');
		if (target.length < 2) return;
		var el = $('a[name="' + target.slice(1) + '"], ' + target).first();
		if (!el.length) return;
		e.preventDefault();
		$('html, body').animate({ scrollTop: el.offset().top }, 600);
		if ($('.mean-nav').is(':visible')) { $('.meanmenu-reveal').trigger('click'); }
	});

	/*----------------------------
	hero: interactive network animation is the permanent base layer.
	If data-video is set, the YouTube background plays underneath and the animation
	fades out for data-video-seconds once YouTube reports it is actually playing.
	------------------------------ */
	var $hero = $('#home-area');
	var vid = $hero.data('video');
	var hasVideo = !!(vid && $.fn.YTPlayer);
	var videoReady = false;
	if (hasVideo) {
		$hero.on('YTPStart YTPPlay', function () { videoReady = true; });
		$hero.on('YTPEnd', function () { videoReady = false; });
		$hero.addClass('youtube-bg').YTPlayer({
			videoURL: vid,
			containment: '#home-area',
			autoPlay: true,
			loop: true,
			mute: true,
			startAt: parseInt($hero.data('video-start'), 10) || 0,
			stopAt: parseInt($hero.data('video-stop'), 10) || 0,
			showControls: false,
			showYTLogo: false
		});
	}

	function makeNetwork(canvas) {
		var ctx = canvas.getContext('2d'), running = false, raf = null, nodes = [], ripples = [], sparks = [];
		var W = 0, H = 0, dpr = 1, t0 = 0, last = 0, hue = 340;
		var mouse = { x: -9999, y: -9999, vx: 0, vy: 0, lx: -9999, ly: -9999, active: false };
		var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		function resize() {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			W = canvas.clientWidth; H = canvas.clientHeight;
			canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			var n = Math.round(Math.min(150, Math.max(55, (W * H) / 10000)));
			nodes = [];
			for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: 1.2 + Math.random() * 1.8, accent: Math.random() < 0.12, ph: Math.random() * 6.28, heat: 0 });
		}
		function hsla(h, s, l, a) { return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')'; }
		function frame(now) {
			if (!running) return;
			var dt = Math.max(0, Math.min(40, now - last)) / 16.67; last = now; var t = (now - t0) / 1000;
			hue = (hue + 0.25 * dt) % 360;
			// background: charcoal gradient + drifting crimson glow
			var g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0d0e13'); g.addColorStop(1, '#1b1e28');
			ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
			var gx = W * (0.5 + 0.35 * Math.cos(t * 0.11)), gy = H * (0.5 + 0.3 * Math.sin(t * 0.13));
			var rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(W, H) * 0.55);
			rg.addColorStop(0, 'rgba(179,12,56,0.28)'); rg.addColorStop(1, 'rgba(179,12,56,0)');
			ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
			// colorful glow that follows the pointer
			if (mouse.active) {
				var mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 260);
				mg.addColorStop(0, hsla(hue, 90, 60, 0.35)); mg.addColorStop(0.5, hsla((hue + 60) % 360, 90, 55, 0.12)); mg.addColorStop(1, hsla((hue + 120) % 360, 90, 50, 0));
				ctx.fillStyle = mg; ctx.fillRect(0, 0, W, H);
			}
			// move nodes: gentle drift, pulled toward the pointer, pushed by pointer speed
			var i, j, p;
			for (i = 0; i < nodes.length; i++) {
				p = nodes[i];
				var dx = mouse.x - p.x, dy = mouse.y - p.y, d2 = dx * dx + dy * dy;
				if (mouse.active && d2 < 52900) {
					var d = Math.sqrt(d2) || 1, f = (1 - d / 230);
					p.vx += (dx / d) * f * 0.06 * dt + mouse.vx * f * 0.05; p.vy += (dy / d) * f * 0.06 * dt + mouse.vy * f * 0.05;
					p.heat = Math.min(1, p.heat + f * 0.12 * dt);
				}
				p.heat *= 0.97;
				var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy); if (sp > 2.2) { p.vx *= 2.2 / sp; p.vy *= 2.2 / sp; }
				p.vx *= 0.992; p.vy *= 0.992;
				p.x += p.vx * dt * 1.2; p.y += p.vy * dt * 1.2;
				if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20; if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
			}
			// links (heated links near the pointer take on color)
			var maxD = 140;
			for (i = 0; i < nodes.length; i++) for (j = i + 1; j < nodes.length; j++) {
				var a = nodes[i], b = nodes[j], ddx = a.x - b.x, ddy = a.y - b.y, dd = Math.sqrt(ddx * ddx + ddy * ddy);
				if (dd < maxD) {
					var al = (1 - dd / maxD) * 0.32, heat = Math.max(a.heat, b.heat);
					if (heat > 0.05) ctx.strokeStyle = hsla((hue + (a.x + b.x) * 0.15) % 360, 90, 65, al + heat * 0.5);
					else ctx.strokeStyle = (a.accent || b.accent) ? 'rgba(229,64,95,' + al + ')' : 'rgba(255,255,255,' + al + ')';
					ctx.lineWidth = 1 + heat; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
				}
			}
			// nodes
			for (i = 0; i < nodes.length; i++) {
				p = nodes[i]; var pulse = 0.75 + 0.25 * Math.sin(t * 1.6 + p.ph);
				if (p.heat > 0.05) {
					var h2 = (hue + p.x * 0.2) % 360;
					ctx.fillStyle = hsla(h2, 95, 60, 0.35 * p.heat); ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (3 + 5 * p.heat), 0, 6.283); ctx.fill();
					ctx.fillStyle = hsla(h2, 95, 75, 0.6 + 0.4 * p.heat); ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + p.heat), 0, 6.283); ctx.fill();
					continue;
				}
				if (p.accent) { ctx.fillStyle = 'rgba(229,64,95,' + (0.35 * pulse) + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.283); ctx.fill(); }
				ctx.fillStyle = p.accent ? 'rgba(255,120,145,' + pulse + ')' : 'rgba(255,255,255,' + (0.55 * pulse + 0.2) + ')';
				ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
			}
			// sparks left behind by pointer movement
			for (i = sparks.length - 1; i >= 0; i--) {
				var sk = sparks[i]; sk.life -= 0.02 * dt; if (sk.life <= 0) { sparks.splice(i, 1); continue; }
				sk.x += sk.vx * dt; sk.y += sk.vy * dt; sk.vy += 0.01 * dt;
				ctx.fillStyle = hsla(sk.h, 95, 65, sk.life); ctx.beginPath(); ctx.arc(sk.x, sk.y, sk.r * sk.life, 0, 6.283); ctx.fill();
			}
			// ripples: ambient every ~2.4s from a random node, plus one on every click / tap
			if (!ripples.length || now - ripples[ripples.length - 1].born > 2400) { var src = nodes[Math.floor(Math.random() * nodes.length)]; if (src) ripples.push({ x: src.x, y: src.y, born: now, h: null }); }
			for (i = ripples.length - 1; i >= 0; i--) {
				var rp = ripples[i], age = (now - rp.born) / 2600; if (age > 1) { ripples.splice(i, 1); continue; }
				ctx.strokeStyle = rp.h === null ? 'rgba(229,64,95,' + (0.45 * (1 - age)) + ')' : hsla(rp.h, 95, 65, 0.7 * (1 - age));
				ctx.lineWidth = rp.h === null ? 1.5 : 2.5; ctx.beginPath(); ctx.arc(rp.x, rp.y, 10 + age * (rp.h === null ? 240 : 420), 0, 6.283); ctx.stroke();
			}
			mouse.vx *= 0.8; mouse.vy *= 0.8;
			if (!reduced) raf = requestAnimationFrame(frame); else running = false;
		}
		function point(e) { var r = canvas.getBoundingClientRect(); var src = e.touches ? e.touches[0] : e; return { x: src.clientX - r.left, y: src.clientY - r.top }; }
		function onMove(e) {
			var q = point(e); if (mouse.active) { mouse.vx = (q.x - mouse.x) * 0.15; mouse.vy = (q.y - mouse.y) * 0.15; }
			mouse.x = q.x; mouse.y = q.y; mouse.active = true;
			var speed = Math.abs(mouse.vx) + Math.abs(mouse.vy);
			for (var k = 0; k < Math.min(4, 1 + speed); k++) sparks.push({ x: q.x, y: q.y, vx: (Math.random() - 0.5) * 1.6, vy: (Math.random() - 0.5) * 1.6, r: 1 + Math.random() * 2, life: 1, h: (hue + Math.random() * 80) % 360 });
			if (sparks.length > 220) sparks.splice(0, sparks.length - 220);
		}
		function onLeave() { mouse.active = false; mouse.x = mouse.y = -9999; }
		function onTap(e) { var q = point(e); ripples.push({ x: q.x, y: q.y, born: performance.now(), h: hue }); }
		return {
			start: function () { if (running) return; running = true; resize(); t0 = last = performance.now(); raf = requestAnimationFrame(frame); },
			stop: function () { running = false; if (raf) cancelAnimationFrame(raf); },
			bind: function () {
				window.addEventListener('resize', function () { if (running) resize(); });
				$hero.on('mousemove', onMove).on('mouseleave', onLeave).on('click', onTap);
				$hero.on('touchmove', function (e) { onMove(e.originalEvent); }).on('touchend', onLeave).on('touchstart', function (e) { onTap(e.originalEvent); });
			}
		};
	}

	/* second animation: flowing wave lines (sound / haptic motif), also mouse-reactive */
	function makeWaves(canvas) {
		var ctx = canvas.getContext('2d'), running = false, raf = null, W = 0, H = 0, dpr = 1, t0 = 0, last = 0, hue = 340;
		var riders = [], ripples = [], sparks = [], N = 7;
		var mouse = { x: -9999, y: -9999, active: false };
		var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		function hsla(h, s, l, a) { return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')'; }
		function resize() {
			dpr = Math.min(window.devicePixelRatio || 1, 2); W = canvas.clientWidth; H = canvas.clientHeight;
			canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			riders = []; for (var i = 0; i < 26; i++) riders.push({ line: i % N, x: Math.random() * W, v: 0.4 + Math.random() * 0.9, r: 1.5 + Math.random() * 2 });
		}
		function waveY(k, x, t) {
			var base = H * (0.28 + 0.5 * k / (N - 1));
			var y = base + 26 * Math.sin(x * 0.0035 + t * 0.6 + k * 0.9) + 14 * Math.sin(x * 0.009 - t * 0.45 + k * 1.7) + 8 * Math.sin(x * 0.02 + t * 1.1 + k);
			if (mouse.active) { var dx = x - mouse.x; var g = Math.exp(-(dx * dx) / (2 * 110 * 110)); y += (mouse.y - base) * 0.45 * g; }
			return y;
		}
		function frame(now) {
			if (!running) return;
			var dt = Math.max(0, Math.min(40, now - last)) / 16.67; last = now; var t = (now - t0) / 1000; hue = (hue + 0.25 * dt) % 360;
			var g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0d0e13'); g.addColorStop(1, '#1b1e28');
			ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
			var gx = W * (0.5 + 0.35 * Math.sin(t * 0.09)), gy = H * 0.55;
			var rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(W, H) * 0.5);
			rg.addColorStop(0, 'rgba(179,12,56,0.26)'); rg.addColorStop(1, 'rgba(179,12,56,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
			if (mouse.active) {
				var mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 240);
				mg.addColorStop(0, hsla(hue, 90, 60, 0.30)); mg.addColorStop(1, hsla((hue + 90) % 360, 90, 50, 0)); ctx.fillStyle = mg; ctx.fillRect(0, 0, W, H);
			}
			var k, x;
			for (k = 0; k < N; k++) {
				var h = (hue + k * 22) % 360, near = 0;
				ctx.beginPath();
				for (x = -10; x <= W + 10; x += 6) { var y = waveY(k, x, t); if (x === -10) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
				if (mouse.active) { var dyk = Math.abs(waveY(k, mouse.x, t) - mouse.y); near = Math.max(0, 1 - dyk / 120); }
				ctx.strokeStyle = hsla(h, 85, 62, 0.28 + 0.55 * near); ctx.lineWidth = 1.2 + 1.8 * near; ctx.stroke();
				// soft fill under the lower lines for depth
				if (k >= N - 3) { ctx.lineTo(W + 10, H + 10); ctx.lineTo(-10, H + 10); ctx.closePath(); ctx.fillStyle = hsla(h, 80, 45, 0.05); ctx.fill(); }
			}
			for (var i = 0; i < riders.length; i++) {
				var rd = riders[i]; rd.x += rd.v * dt * 1.5; if (rd.x > W + 20) rd.x = -20;
				var ry = waveY(rd.line, rd.x, t), hh = (hue + rd.line * 22) % 360;
				ctx.fillStyle = hsla(hh, 90, 70, 0.35); ctx.beginPath(); ctx.arc(rd.x, ry, rd.r * 3, 0, 6.283); ctx.fill();
				ctx.fillStyle = hsla(hh, 90, 85, 0.95); ctx.beginPath(); ctx.arc(rd.x, ry, rd.r, 0, 6.283); ctx.fill();
			}
			for (i = sparks.length - 1; i >= 0; i--) {
				var sk = sparks[i]; sk.life -= 0.02 * dt; if (sk.life <= 0) { sparks.splice(i, 1); continue; }
				sk.x += sk.vx * dt; sk.y += sk.vy * dt; ctx.fillStyle = hsla(sk.h, 95, 65, sk.life); ctx.beginPath(); ctx.arc(sk.x, sk.y, sk.r * sk.life, 0, 6.283); ctx.fill();
			}
			for (i = ripples.length - 1; i >= 0; i--) {
				var rp = ripples[i], age = (now - rp.born) / 2600; if (age > 1) { ripples.splice(i, 1); continue; }
				ctx.strokeStyle = hsla(rp.h, 95, 65, 0.7 * (1 - age)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(rp.x, rp.y, 10 + age * 420, 0, 6.283); ctx.stroke();
			}
			if (!reduced) raf = requestAnimationFrame(frame); else running = false;
		}
		function point(e) { var r = canvas.getBoundingClientRect(); var src = e.touches ? e.touches[0] : e; return { x: src.clientX - r.left, y: src.clientY - r.top }; }
		function onMove(e) { var q = point(e); mouse.x = q.x; mouse.y = q.y; mouse.active = true; for (var k = 0; k < 2; k++) sparks.push({ x: q.x, y: q.y, vx: (Math.random() - 0.5) * 1.6, vy: (Math.random() - 0.5) * 1.6, r: 1 + Math.random() * 2, life: 1, h: (hue + Math.random() * 80) % 360 }); if (sparks.length > 200) sparks.splice(0, sparks.length - 200); }
		function onLeave() { mouse.active = false; mouse.x = mouse.y = -9999; }
		function onTap(e) { var q = point(e); ripples.push({ x: q.x, y: q.y, born: performance.now(), h: hue }); }
		return {
			start: function () { if (running) return; running = true; resize(); t0 = last = performance.now(); raf = requestAnimationFrame(frame); },
			stop: function () { running = false; if (raf) cancelAnimationFrame(raf); },
			bind: function () {
				window.addEventListener('resize', function () { if (running) resize(); });
				$hero.on('mousemove', onMove).on('mouseleave', onLeave).on('click', onTap);
				$hero.on('touchmove', function (e) { onMove(e.originalEvent); }).on('touchend', onLeave).on('touchstart', function (e) { onTap(e.originalEvent); });
			}
		};
	}

	/* layers + rotation: network (A) -> video -> waves (B) -> video -> ... ; video slots are skipped until YouTube is playing */
	var $wrap = $('<div class="hero-slides"></div>');
	function layer(cls) { var c = document.createElement('canvas'); c.className = 'hero-slide hero-canvas ' + cls; c.setAttribute('aria-hidden', 'true'); $wrap.append(c); return c; }
	var cA = layer('is-active'), cB = layer('');
	$hero.prepend($wrap);
	var anims = [makeNetwork(cA), makeWaves(cB)]; anims[0].bind(); anims[1].bind(); anims[0].start();
	var animSecs = parseInt($hero.data('animation-seconds'), 10) || 10;
	var videoSecs = parseInt($hero.data('video-seconds'), 10) || 5;
	var order = hasVideo ? ['A', 'V', 'B', 'V'] : ['A', 'B'];
	var step = 0;
	function activate(which) {
		anims[0].stop(); anims[1].stop(); $(cA).removeClass('is-active'); $(cB).removeClass('is-active');
		if (which === 'A') { $(cA).addClass('is-active'); anims[0].start(); }
		if (which === 'B') { $(cB).addClass('is-active'); anims[1].start(); }
	}
	function cycle() {
		step = (step + 1) % order.length;
		var slot = order[step];
		if (slot === 'V' && !videoReady) { step = (step + 1) % order.length; slot = order[step]; }
		activate(slot);
		setTimeout(cycle, (slot === 'V' ? videoSecs : animSecs) * 1000);
	}
	setTimeout(cycle, animSecs * 1000);

})(jQuery);
