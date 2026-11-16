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
		 meanScreenWidth: "991"
	 });

	/* hamburgers menu option  */
    $('.hamburger').on('click', function() {
        $(this).toggleClass('is-active');
        $(this).next().toggleClass('nav-menu-show')
    });

	/*----------------------------
	Publications: year-grouped list (Makeability Lab style).
	- Filter buttons count their papers and hide the rest (empty years hide too).
	- The year menu on the left highlights the year you are reading.
	- "Cite" opens the paper's BibTeX (stored in a hidden <pre class="pub-bibtex">) with a copy button.
	------------------------------ */
	(function () {
		var $area = $('.pub-area');
		if (!$area.length) return;
		var $pubs = $area.find('.pub'), $years = $area.find('.pub-year'), $nav = $area.find('.pub-years a');

		function hasTag($el, f) { return f === '*' || (' ' + $el.attr('data-tags') + ' ').indexOf(' ' + f + ' ') > -1; }

		$area.find('.pub-filter').each(function () {
			var f = $(this).attr('data-filter');
			var n = $pubs.filter(function () { return hasTag($(this), f); }).length;
			$(this).find('.pub-filter-count').text('(' + n + ')');
		});

		function updateActiveYear() {
			var line = $(window).scrollTop() + 160, current = null, $visible = $years.not('.is-empty');
			$visible.each(function () { if ($(this).offset().top <= line) current = $(this).attr('data-year'); });
			if (current === null) current = $visible.first().attr('data-year');
			$nav.removeClass('active').filter('[data-year="' + current + '"]').addClass('active');
		}

		$area.on('click', '.pub-filter', function () {
			var f = $(this).attr('data-filter');
			$area.find('.pub-filter').removeClass('active').attr('aria-pressed', 'false');
			$(this).addClass('active').attr('aria-pressed', 'true');
			$pubs.each(function () { $(this).toggleClass('is-hidden', !hasTag($(this), f)); });
			$years.each(function () {
				var empty = !$(this).find('.pub').not('.is-hidden').length;
				$(this).toggleClass('is-empty', empty);
				$nav.filter('[data-year="' + $(this).attr('data-year') + '"]').toggleClass('is-empty', empty);
			});
			updateActiveYear();
		});

		var ticking = false;
		$(window).on('scroll resize', function () {
			if (ticking) return;
			ticking = true;
			(window.requestAnimationFrame || setTimeout)(function () { ticking = false; updateActiveYear(); });
		});
		updateActiveYear();
	})();

	/*----------------------------
	Cite popover (Makeability Lab style): a small box next to the Cite button with a
	Text / BibTeX switch, Download and Copy. The BibTeX lives in each row's hidden
	<pre class="pub-bibtex">; the text citation is built from it.
	------------------------------ */
	(function () {
		var $pop = null, $btn = null;

		function initials(first) {
			return $.trim(first).split(/\s+/).map(function (w) {
				return w.split('-').map(function (x) { return x.charAt(0).toUpperCase() + '.'; }).join('-');
			}).join(' ');
		}
		function bibFields(bib) {
			var f = {};
			bib.replace(/^\s*(\w+)\s*=\s*\{(.*)\},?\s*$/gm, function (m, k, v) { f[k.toLowerCase()] = v; return m; });
			return f;
		}
		function citation($pub) {
			var bib = $pub.find('.pub-bibtex').text(), f = bibFields(bib);
			var authors = (f.author || '').split(/\s+and\s+/).map(function (a) {
				var parts = a.split(',').map($.trim);
				if (parts.length === 3) return parts[0] + ' ' + parts[1] + ', ' + initials(parts[2]);
				if (parts.length === 2) return parts[0] + ', ' + initials(parts[1]);
				return $.trim(a);
			}).filter(Boolean).join(', ');
			var title = f.title || $.trim($pub.find('.pub-title').text());
			var link = f.doi ? 'https://doi.org/' + f.doi : $pub.find('.pub-title a').attr('href');
			return { bib: bib, authors: authors, year: f.year || '', title: title, end: /[?!.]$/.test(title) ? '' : '.',
				venue: $.trim($pub.find('.pub-venue em').first().text()), link: link || '' };
		}
		function esc(s) { return $('<div>').text(s).html(); }

		function close(focusBack) {
			if (!$pop) return;
			$pop.remove(); $pop = null;
			if ($btn) { $btn.attr('aria-expanded', 'false'); if (focusBack) $btn.focus(); }
			$btn = null;
			$(document).off('.citepop'); $(window).off('.citepop');
		}

		function place() {
			if (!$pop || !$btn) return;
			var b = $btn.offset(), bw = $btn.outerWidth(), bh = $btn.outerHeight();
			var pw = $pop.outerWidth(), ph = $pop.outerHeight(), ww = $(window).width(), st = $(window).scrollTop();
			var top, left, side;
			if (b.left + bw + 12 + pw <= ww - 10) {
				side = 'right'; left = b.left + bw + 12;
				top = Math.max(st + 80, b.top + bh / 2 - ph / 2);
			} else {
				side = 'bottom'; top = b.top + bh + 10;
				left = Math.min(Math.max(10, b.left + bw / 2 - pw / 2), ww - pw - 10);
			}
			$pop.removeClass('cite-pop-right cite-pop-bottom').addClass('cite-pop-' + side).css({ top: top, left: left });
			var $arrow = $pop.find('.cite-pop-arrow');
			if (side === 'right') $arrow.css({ top: Math.min(ph - 18, Math.max(12, b.top + bh / 2 - top - 7)), left: '' });
			else $arrow.css({ left: Math.min(pw - 18, Math.max(12, b.left + bw / 2 - left - 7)), top: '' });
		}

		$(document).on('click', '.pub-cite', function (e) {
			e.stopPropagation();
			var $b = $(this);
			if ($btn && $btn[0] === this) { close(false); return; }
			close(false);
			var $pub = $b.closest('.pub'), c = citation($pub);
			var slug = ($pub.attr('id') || $pub.find('.pub-thumb img').attr('src') || 'citation').replace(/^pub-/, '').replace(/^.*\/|\.jpg$/g, '');
			var text = c.authors + ' (' + c.year + '). ' + c.title + c.end + ' ' + c.venue + '.' + (c.link ? ' ' + c.link : '');
			$pop = $('<div class="cite-pop" role="dialog" aria-label="Citation">' +
				'<div class="cite-pop-head">Citation</div>' +
				'<div class="cite-pop-body">' +
				'<div class="cite-tabs" role="tablist"><button type="button" role="tab" class="active" aria-selected="true" data-tab="text">Text</button>' +
				'<button type="button" role="tab" aria-selected="false" data-tab="bibtex">BibTeX</button></div>' +
				'<div class="cite-box cite-text">' + esc(c.authors) + ' (' + esc(c.year) + '). ' + esc(c.title + c.end) + ' <em>' + esc(c.venue) + '</em>.' +
				(c.link ? ' <a href="' + esc(c.link) + '" target="_blank" rel="noopener">' + esc(c.link) + '</a>' : '') + '</div>' +
				'<pre class="cite-box cite-bib" hidden></pre>' +
				'<div class="cite-actions"><button type="button" class="cite-act cite-dl"><i class="ion-ios-download-outline" aria-hidden="true"></i> Download</button>' +
				'<button type="button" class="cite-act cite-copy"><i class="ion-ios-copy-outline" aria-hidden="true"></i> Copy</button></div>' +
				'</div><span class="cite-pop-arrow" aria-hidden="true"></span></div>');
			$pop.find('.cite-bib').text(c.bib);
			$pop.data({ text: text, bib: c.bib, slug: slug });
			$('body').append($pop);
			$btn = $b.attr('aria-expanded', 'true');
			place();
			$pop.find('.cite-tabs .active').focus();
			$(document).on('click.citepop', function (ev) { if ($pop && !$(ev.target).closest('.cite-pop').length) close(false); })
				.on('keydown.citepop', function (ev) { if (ev.key === 'Escape' || ev.keyCode === 27) close(true); });
			$(window).on('resize.citepop', place);
		});

		$(document).on('click', '.cite-tabs button', function () {
			var tab = $(this).data('tab');
			$(this).addClass('active').attr('aria-selected', 'true').siblings().removeClass('active').attr('aria-selected', 'false');
			$pop.find('.cite-text').prop('hidden', tab !== 'text');
			$pop.find('.cite-bib').prop('hidden', tab !== 'bibtex');
			place();
		});

		function current() { var bib = !$pop.find('.cite-bib').prop('hidden'); return { bib: bib, value: bib ? $pop.data('bib') : $pop.data('text') }; }

		$(document).on('click', '.cite-copy', function () {
			var $b = $(this), cur = current();
			function done() {
				$b.html('<i class="ion-checkmark" aria-hidden="true"></i> Copied');
				setTimeout(function () { $b.html('<i class="ion-ios-copy-outline" aria-hidden="true"></i> Copy'); }, 1600);
			}
			if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(cur.value).then(done); return; }
			var $t = $('<textarea readonly>').val(cur.value).css({ position: 'fixed', left: '-9999px' }).appendTo('body');
			$t[0].select();
			try { document.execCommand('copy'); done(); } catch (e) {}
			$t.remove();
		});

		$(document).on('click', '.cite-dl', function () {
			var cur = current();
			var blob = new Blob([cur.value + '\n'], { type: cur.bib ? 'application/x-bibtex' : 'text/plain' });
			var a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = $pop.data('slug') + (cur.bib ? '.bib' : '.txt');
			document.body.appendChild(a); a.click(); a.remove();
			setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
		});
	})();

	/* magnificPopup img view */
	$('.popup-link').magnificPopup({
		type: 'image',
		gallery: {
		  enabled: true
		}
	});

	/* Gallery albums. Clicking a card opens the album: a panel with every photo as a small
	   thumbnail and its caption (built from the hidden .gallery-album list). Clicking a thumbnail
	   opens that photo large with its description; closing the photo returns to the album panel.
	   data-autoplay on the section (milliseconds) steps the large view through to the last photo
	   unless the visitor presses a key, clicks, or touches; it is off when the OS asks for reduced
	   motion. */
	(function () {
		var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
			BLOOM_MS = 340;
		function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
		$('.gallery-item').each(function () {
			var $card = $(this),
				album = $.trim($card.find('.gallery-title').text()),
				meta = $card.find('.gallery-meta').html() || '',
				blurb = $card.find('.gallery-caption p').html() || '',
				items = $card.find('.gallery-album a').map(function () {
					var href = this.getAttribute('href');
					return { src: href, thumb: this.getAttribute('data-thumb') || href, caption: $(this).html(), alt: this.getAttribute('data-alt') || album };
				}).get(),
				n = items.length, $panel, leaving = false;
			if (!n) { return; }
			$card.find('.gallery-count-num').text(n);

			/* Build the album panel once */
			$panel = $('<div class="gallery-panel mfp-hide" role="dialog" aria-label="' + esc(album) + ' album"></div>');
			$panel.append('<div class="gallery-panel-head"><span class="gallery-meta">' + meta + '</span><h3>' + esc(album) + '</h3><p>' + blurb + '</p><span class="gallery-panel-hint">' + n + (n === 1 ? ' photo' : ' photos') + ' &middot; click one to view it</span></div>');
			var $grid = $('<div class="gallery-grid"></div>');
			$.each(items, function (i, it) {
				$grid.append('<button type="button" class="gallery-thumb" data-index="' + i + '" style="animation-delay:' + (i * 60) + 'ms">' +
					'<span class="gallery-thumb-img"><img src="' + esc(it.thumb) + '" alt="' + esc(it.alt) + '" loading="lazy"></span>' +
					'<span class="gallery-thumb-cap">' + it.caption + '</span></button>');
			});
			$panel.append($grid);
			$('body').append($panel);

			function openAlbum(focusIndex) {
				leaving = false;
				$.magnificPopup.open({
					items: { src: $panel, type: 'inline' },
					mainClass: 'mfp-bloom mfp-album-pop',
					removalDelay: BLOOM_MS,
					closeBtnInside: true,
					callbacks: {
						open: function () {
							if (typeof focusIndex === 'number') { $panel.find('.gallery-thumb[data-index="' + focusIndex + '"]').focus(); }
						},
						close: function () { if (!leaving) { $card.focus(); } }
					}
				});
			}

			function openPhoto(index) {
				var delay = reduceMotion ? 0 : (parseInt($card.closest('[data-autoplay]').attr('data-autoplay'), 10) || 0),
					timer = null;
				function stop() { if (timer) { clearInterval(timer); timer = null; } $(document).off('.galleryauto'); }
				$.magnificPopup.open({
					items: items,
					type: 'image',
					gallery: { enabled: n > 1, preload: [0, 2], tCounter: '%curr% of %total%' },
					mainClass: 'mfp-bloom mfp-gallery-pop mfp-img-mobile',
					removalDelay: BLOOM_MS,
					closeOnContentClick: false,
					image: {
						titleSrc: function (item) { return '<strong>' + esc(album) + '</strong>' + item.data.caption; },
						verticalFit: true
					},
					callbacks: {
						open: function () {
							var mfp = this;
							if (delay && n > 1) {
								timer = setInterval(function () { if (mfp.index >= n - 1) { stop(); } else { mfp.next(); } }, delay);
								setTimeout(function () { $(document).on('keydown.galleryauto mousedown.galleryauto touchstart.galleryauto', stop); }, 0);
							}
						},
						imageLoadComplete: function () {
							this.content.find('img.mfp-img').attr('alt', this.currItem.data.alt);
							var fig = this.content.hasClass('mfp-figure') ? this.content[0] : this.content.find('.mfp-figure')[0];
							var a = document.createElement('a'); a.href = this.currItem.src; /* absolute URL: the stylesheet would otherwise resolve it relative to css/ */
							if (fig && fig.style.setProperty) { fig.style.setProperty('--gallery-bg', 'url("' + a.href + '")'); }
						},
						close: function () {
							var last = this.index;
							stop();
							/* back to the album panel, like stepping out of a submenu */
							setTimeout(function () { openAlbum(last); }, BLOOM_MS);
						}
					}
				}, index);
			}

			$panel.on('click', '.gallery-thumb', function () {
				var i = parseInt(this.getAttribute('data-index'), 10);
				leaving = true;
				$.magnificPopup.close();
				setTimeout(function () { openPhoto(i); }, BLOOM_MS);
			});
			$card.on('click', function () { openAlbum(); }).on('keydown', function (e) {
				if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) { e.preventDefault(); openAlbum(); }
			});
			$card.data('openAlbum', openAlbum);
		});

		/* Deep links: a link to #gallery-<album> (for example the "Photos" pills in Recent News, or the
		   page URL) scrolls to that album card and opens it. */
		function openAlbumByHash(hash, delay) {
			var open = hash && /^#gallery-/.test(hash) && $(hash).data('openAlbum');
			if (open) { setTimeout(open, delay); }
			return !!open;
		}
		$(document).on('click', 'a[href^="#gallery-"]', function () { openAlbumByHash(this.getAttribute('href'), 700); });
		$(window).on('hashchange', function () { openAlbumByHash(location.hash, 300); });
		openAlbumByHash(location.hash, 900);
	})();

	/*----------------------------
	Recent News.
	- index.html keeps the news as one <p> with a <br> between items (easy to edit); here each item
	  becomes its own block.
	- The newest item (the first one) gets a pulsing NEW badge. It moves by itself when a new item is
	  added at the top.
	- Only as many items as fit beside the About us text are shown, so both columns end on the same
	  line; the rest open with "More news".
	------------------------------ */
	(function () {
		var $h2 = $('h2').filter(function () { return $.trim($(this).text()) === 'Recent News'; }).first();
		var $p = $h2.next('p');
		if (!$p.length) return;
		var items = $p.html().split(/<br\s*\/?>/i).map($.trim).filter(Boolean);
		var $list = $('<div class="news-list"></div>').html(items.map(function (h) { return '<p class="news-item">' + h + '</p>'; }).join(''));
		$p.replaceWith($list);
		$list.find('.news-item').first().find('strong').first().after('<span class="news-new" title="Latest news">NEW</span>');

		var $items = $list.find('.news-item');
		var $more = $('<button type="button" class="news-more" aria-expanded="false"></button>').insertAfter($list);
		var $about = $h2.closest('.row').children().first();
		var expanded = false;

		function fit() {
			$items.removeClass('is-collapsed is-clamped').css('-webkit-line-clamp', '');
			if (expanded) { $more.text('Show less').attr('aria-expanded', 'true').show(); return; }
			var full = $items.length, clampLines = 0;
			if ($(window).width() < 768) {
				full = Math.min(4, $items.length);             /* columns are stacked on phones: keep it short */
			} else {
				var $last = $about.find('p').last();
				if ($last.length) {
					var target = $last.offset().top + $last.outerHeight() - $more.outerHeight(true);
					full = 0;
					$items.each(function () { if ($(this).offset().top + $(this).outerHeight() <= target + 2) full++; else return false; });
					full = Math.max(full, 2);
					/* fill the rest of the space with the start of the next item, cut off with "..." */
					var $next = $items.eq(full);
					if ($next.length) {
						var lh = parseFloat($next.css('line-height')) || 20;
						clampLines = Math.floor((target - $next.offset().top + 2) / lh);
						if (clampLines < 2) clampLines = 0;
					}
				}
			}
			$items.each(function (i) {
				if (i === full && clampLines) $(this).addClass('is-clamped').css('-webkit-line-clamp', String(clampLines));
				else $(this).toggleClass('is-collapsed', i >= full);
			});
			var more = $items.length - full;
			$more.text('More news (' + more + ')').attr('aria-expanded', 'false').toggle(more > 0);
		}
		$more.on('click', function () { expanded = !expanded; fit(); if (!expanded) $('html, body').animate({ scrollTop: $h2.offset().top - 90 }, 300); });
		var t = null;
		$(window).on('resize', function () { clearTimeout(t); t = setTimeout(fit, 120); });
		$(window).on('load', fit);
		if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
		fit();
	})();

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

	if (!$hero.length) return; // pages without the hero (person.html)

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
