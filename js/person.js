/* =====================================================================================
   Profile page (people/<id>/), in the style of the Makeability Lab member pages.

   Reads index.html so there is a single place to edit:
     team card (name, role, photo, links) . publications . videos . recent news
   and js/lab-data.js for the bio, projects and talks.
   ===================================================================================== */
(function ($) {
	'use strict';

	var DATA = window.ICL_DATA || {};
	DATA.people = DATA.people || {}; DATA.projects = DATA.projects || []; DATA.talks = DATA.talks || [];
	var $root = $('#person');
	/* people/<id>/index.html carries the id on <html data-person="...">; person.html?id=<id> still works too */
	var params = (function () { try { return new URLSearchParams(location.search); } catch (e) { return null; } })();
	var id = (document.documentElement.getAttribute('data-person') || (params && params.get('id')) || '').toLowerCase().replace(/[^a-z0-9-]/g, '');

	function esc(s) { return $('<div>').text(s == null ? '' : String(s)).html(); }
	function norm(s) { return String(s || '').toLowerCase().replace(/\bdr\.?\s+/g, '').replace(/[.,'’]/g, '').replace(/\s+/g, ' ').trim(); }
	function firstLast(n) { var t = norm(n).split(' '); return t.length > 1 ? t[0] + ' ' + t[t.length - 1] : t[0]; }

	function message(html) { $root.html('<div class="container"><div class="person-message">' + html + '</div></div>'); }

	if (!id) { message('<h1>Lab members</h1><p>Pick someone from <a href="team/">Our Team</a> to see their profile.</p>'); return; }

	if (!window.fetch || !window.DOMParser) { message('<p>This browser cannot load profiles. See <a href="team/">Our Team</a>.</p>'); return; }

	fetch('index.html', { cache: 'no-cache' }).then(function (r) {
		if (!r.ok) throw new Error('HTTP ' + r.status);
		return r.text();
	}).then(function (html) {
		render(new DOMParser().parseFromString(html, 'text/html'));
	}).catch(function () {
		message('<h1>Profile unavailable</h1><p>The profile could not be loaded. If you opened this file directly from your computer, ' +
			'preview the site through a local web server instead (see the README), or go back to <a href="team/">Our Team</a>.</p>');
	});

	function render(doc) {
		/* ---------- person (team card) ---------- */
		var card = doc.querySelector('.team-item[data-person="' + id + '"]');
		if (!card) { message('<h1>Person not found</h1><p>We could not find that lab member. Go back to <a href="team/">Our Team</a>.</p>'); return; }

		var alumniH2 = Array.prototype.filter.call(doc.querySelectorAll('h2'), function (h) { return $.trim(h.textContent) === 'Alumni'; })[0];
		var extra = DATA.people[id] || {};
		var p = {
			id: id,
			name: $.trim($(card).find('.team-item-name').text()),
			role: $.trim($(card).find('.team-item-role').text()),
			photo: $(card).find('.team-item-image > img').attr('src'),
			alumni: !!(alumniH2 && (alumniH2.compareDocumentPosition(card) & 4)),
			bio: extra.bio || '',
			links: []
		};
		p.plain = p.name.replace(/^Dr\.?\s+/, '');
		p.first = p.plain.split(' ')[0];
		var variants = [p.plain].concat(extra.aliases || []);
		var keys = variants.map(norm), fl = variants.map(firstLast);

		function isPerson(author) {
			var n = norm(author);
			return keys.indexOf(n) > -1 || fl.indexOf(firstLast(author)) > -1;
		}
		function mentions(text) {
			return variants.some(function (v) { return text.indexOf(v) > -1; });
		}

		var LINK_TYPES = [
			['ion-email', 'Email', 'ion-email'], ['ion-university', 'Google Scholar', 'ion-university'],
			['ion-social-linkedin', 'LinkedIn', 'ion-social-linkedin'], ['ion-social-github', 'GitHub', 'ion-social-github'],
			['ion-social-twitter', 'Twitter', 'ion-social-twitter'], ['ion-ios-world-outline', 'Stevens profile', 'ion-ios-world-outline'],
			['icon-orcid', 'ORCID', 'icon-orcid'], ['ion-link', 'Website', 'ion-link']
		];
		$(card).find('.team-social-icon a').each(function () {
			var icon = $(this).find('i').attr('class') || '', href = $(this).attr('href');
			var t = LINK_TYPES.filter(function (x) { return icon.indexOf(x[0]) > -1; })[0] || ['', 'Link', 'ion-link'];
			p.links.push({ href: href, label: t[1], icon: t[2] });
		});

		/* ---------- papers (publications list) ---------- */
		var papers = [];
		Array.prototype.forEach.call(doc.querySelectorAll('.pub'), function (el) {
			var authors = $(el).find('.pub-authors').text().split(',').map($.trim);
			var pos = -1;
			authors.forEach(function (a, i) { if (pos < 0 && isPerson(a)) pos = i; });
			if (pos < 0) return;
			papers.push({ el: el, id: (el.id || '').replace(/^pub-/, ''), first: pos === 0, award: !!el.querySelector('.pub-award'),
				tags: (el.getAttribute('data-tags') || '').split(/\s+/) });
		});
		var paperIds = papers.map(function (x) { return x.id; });

		/* ---------- projects (lab-data.js; membership from the project's papers) ---------- */
		var projects = DATA.projects.filter(function (pr) {
			return (pr.people || []).indexOf(id) > -1 || (pr.papers || []).some(function (pid) { return paperIds.indexOf(pid) > -1; });
		});

		/* ---------- videos (Videos section: "By <name>" line) ---------- */
		var videos = [];
		Array.prototype.forEach.call(doc.querySelectorAll('.post'), function (post) {
			var frame = post.querySelector('iframe[data-src*="youtube.com/embed/"], iframe[src*="youtube.com/embed/"]');
			if (!frame) return;
			var meta = $.trim($(post).find('.post-meta').text());
			if (!mentions(meta)) return;
			var m = (frame.getAttribute('data-src') || frame.getAttribute('src')).match(/embed\/([\w-]{6,})/);
			if (!m) return;
			var $t = $(post).find('.post-title a');
			videos.push({ yt: m[1], title: $.trim($t.text()), link: $t.attr('href'), meta: meta.replace(/^By\s+/, '') });
		});

		/* ---------- talks (lab-data.js) ---------- */
		var talks = DATA.talks.filter(function (t) { return (t.people || []).indexOf(id) > -1; });

		/* ---------- recent news (Recent News list) ---------- */
		var news = [];
		var newsH2 = Array.prototype.filter.call(doc.querySelectorAll('h2'), function (h) { return $.trim(h.textContent) === 'Recent News'; })[0];
		if (newsH2) {
			var $p = $(newsH2).next('p');
			$p.html().split(/<br\s*\/?>/i).forEach(function (chunk) {
				var $c = $('<div>').html(chunk);
				$c.find('.news-photos').remove();
				var text = $.trim($c.text());
				if (!text || !mentions(text)) return;
				var date = $.trim($c.find('strong').first().text()).replace(/:$/, '');
				$c.find('strong').first().remove();
				news.push({ date: date, html: $.trim($c.html()) });
			});
		}

		/* ---------- render ---------- */
		document.title = p.plain + ' | Interactive Computing Lab';
		var areas = [];
		var tagNames = { access: 'accessibility', wearable: 'wearables', humanai: 'human-AI interaction' };
		['access', 'wearable', 'humanai'].forEach(function (t) { if (papers.some(function (x) { return x.tags.indexOf(t) > -1; })) areas.push(tagNames[t]); });
		var firstCount = papers.filter(function (x) { return x.first; }).length;
		var awardCount = papers.filter(function (x) { return x.award; }).length;

		var bio = p.bio;
		if (!bio) {
			bio = p.plain + (p.alumni ? ' is a former member of the Interactive Computing Lab (' : ' is a member of the Interactive Computing Lab (') + p.role + ').';
			if (papers.length) {
				var plural = papers.length > 1 ? 's' : '';
				bio += (firstCount === papers.length ? ' First author of ' : ' Co-author of ') + papers.length + ' lab publication' + plural +
					(firstCount && firstCount < papers.length ? ' (' + firstCount + ' as first author)' : '') +
					(areas.length ? ' on ' + areas.join(', ').replace(/, ([^,]*)$/, ' and $1') : '') + '.';
			}
		}

		var h = [];
		h.push('<div class="container"><div class="person-head">');
		h.push('<div class="person-photo"><img src="' + esc(p.photo) + '" alt="' + esc(p.plain) + '" width="220" height="220"></div>');
		h.push('<div class="person-main">');
		h.push('<h1 class="person-name">' + esc(p.name) + '</h1>');
		h.push('<p class="person-role">' + esc(p.role) + '</p>');
		h.push('<p class="person-affil">' + (p.alumni ? 'Alumni, ' : '') + 'Interactive Computing Lab &middot; Stevens Institute of Technology</p>');
		if (p.links.length) {
			h.push('<p class="person-links">' + p.links.map(function (l) {
				return '<a href="' + esc(l.href) + '"' + (/^mailto:/.test(l.href) ? '' : ' target="_blank" rel="noopener"') + '><i class="' + l.icon + '" aria-hidden="true"></i> ' + esc(l.label) + '</a>';
			}).join('') + '</p>');
		}
		h.push('<div class="person-bio"><p>' + esc(bio) + '</p></div>');
		h.push('<button type="button" class="person-bio-more" hidden>Show more</button>');
		h.push('</div>');
		if (news.length) {
			h.push('<aside class="person-news"><h3>Recent ' + esc(p.first) + ' News</h3><ul>');
			news.slice(0, 3).forEach(function (n) {
				h.push('<li><p class="person-news-text">' + n.html + '</p><span class="person-news-date">' + esc(n.date) + '</span></li>');
			});
			h.push('</ul></aside>');
		}
		h.push('</div>');

		var stats = [
			[papers.length, papers.length === 1 ? 'Paper' : 'Papers'], [firstCount, 'First-author'], [awardCount, awardCount === 1 ? 'Award' : 'Awards'],
			[projects.length, projects.length === 1 ? 'Project' : 'Projects'], [talks.length, talks.length === 1 ? 'Talk' : 'Talks'], [videos.length, videos.length === 1 ? 'Video' : 'Videos']
		];
		if (stats.some(function (s) { return s[0] > 0; })) {
			h.push('<ul class="person-stats" aria-label="Contributions to the lab">' + stats.map(function (s) {
				return '<li' + (s[0] ? '' : ' class="is-zero"') + '><strong>' + s[0] + '</strong><span>' + s[1] + '</span></li>';
			}).join('') + '</ul>');
		}
		h.push('</div>');

		var sections = [
			{ key: 'projects', label: 'Projects', n: projects.length },
			{ key: 'papers', label: 'Papers', n: papers.length },
			{ key: 'videos', label: 'Videos', n: videos.length },
			{ key: 'talks', label: 'Talks', n: talks.length }
		].filter(function (s) { return s.n > 0; });

		if (sections.length) {
			h.push('<nav class="person-tabs" aria-label="Sections on this page"><div class="container"><span class="person-tabs-name">' + esc(p.plain) + '</span><div class="person-tabs-links">');
			sections.forEach(function (s) { h.push('<a href="people/' + id + '/#person-' + s.key + '" data-key="' + s.key + '">' + s.label + ' <span>(' + s.n + ')</span></a>'); });
			h.push('</div></div></nav>');
		}

		h.push('<div class="container person-body">');
		if (!sections.length) h.push('<p class="person-empty">Projects, papers and talks will appear here as they are published.</p>');

		if (projects.length) {
			h.push(sectionHead('projects', 'Projects', projects.length));
			h.push('<div class="person-grid person-grid-4">');
			projects.forEach(function (pr) {
				var n = (pr.papers || []).length;
				h.push('<a class="person-card project-card" href="' + esc(pr.link || '#') + '" target="_blank" rel="noopener" title="' + esc(pr.summary || '') + '">' +
					'<span class="person-card-img"><img src="' + esc(pr.image) + '" alt="" loading="lazy" width="640" height="400"></span>' +
					'<span class="person-card-title">' + esc(pr.title) + '</span>' +
					'<span class="person-card-meta">' + esc(pr.years) + (n ? ' &middot; ' + n + ' paper' + (n > 1 ? 's' : '') : '') + '</span></a>');
			});
			h.push('</div>' + moreButtons('projects', projects.length, 8) + '</section>');
		}

		if (papers.length) {
			h.push(sectionHead('papers', 'Papers', papers.length));
			h.push('<div class="person-papers pub-list"></div>' + moreButtons('papers', papers.length, 6) + '</section>');
		}

		if (videos.length) {
			h.push(sectionHead('videos', 'Videos', videos.length));
			h.push('<div class="person-grid person-grid-3">');
			videos.forEach(function (v) {
				h.push('<div class="person-card video-card"><a class="person-card-img video-thumb" href="https://www.youtube.com/watch?v=' + esc(v.yt) + '" aria-label="Play video: ' + esc(v.title) + '">' +
					'<img src="https://i.ytimg.com/vi/' + esc(v.yt) + '/hq720.jpg" alt="" loading="lazy" width="1280" height="720" onerror="this.onerror=null;this.src=\'https://i.ytimg.com/vi/' + esc(v.yt) + '/mqdefault.jpg\'"><span class="video-play"><i class="ion-play" aria-hidden="true"></i></span></a>' +
					'<span class="person-card-title">' + esc(v.title) + '</span><span class="person-card-meta">' + esc(v.meta) + '</span>' +
					'<span class="person-card-links"><a class="pub-btn" href="https://www.youtube.com/watch?v=' + esc(v.yt) + '" target="_blank" rel="noopener"><i class="ion-social-youtube" aria-hidden="true"></i> YouTube</a>' +
					(v.link ? '<a class="pub-btn" href="' + esc(v.link) + '" target="_blank" rel="noopener"><i class="ion-document-text" aria-hidden="true"></i> Paper</a>' : '') + '</span></div>');
			});
			h.push('</div></section>');
		}

		if (talks.length) {
			h.push(sectionHead('talks', 'Talks', talks.length));
			h.push('<div class="person-grid person-grid-4">');
			talks.forEach(function (t) {
				var L = t.links || {}, btns = [];
				if (L.paper) btns.push('<a class="pub-btn" href="' + esc(L.paper) + '" target="_blank" rel="noopener"><i class="ion-document-text" aria-hidden="true"></i> Paper</a>');
				if (L.slides) btns.push('<a class="pub-btn" href="' + esc(L.slides) + '" target="_blank" rel="noopener"><i class="ion-easel" aria-hidden="true"></i> Slides</a>');
				if (L.video) btns.push('<a class="pub-btn" href="' + esc(L.video) + '" target="_blank" rel="noopener"><i class="ion-social-youtube" aria-hidden="true"></i> Video</a>');
				if (L.photos) btns.push('<a class="pub-btn" href="' + esc(L.photos) + '"><i class="ion-images" aria-hidden="true"></i> Photos</a>');
				var presenters = (t.people || []).map(function (pid) { return pid === id ? p.plain : pid.split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' '); });
				h.push('<div class="person-card talk-card"><span class="person-card-img">' +
					(t.image ? '<img src="' + esc(t.image) + '" alt="" loading="lazy">' : '') + '<span class="talk-type">' + esc(t.type || 'Talk') + '</span></span>' +
					'<span class="person-card-title">' + esc(t.title) + '</span>' +
					'<span class="person-card-meta">' + esc([t.date, t.event].filter(Boolean).join(' | ')) + '</span>' +
					(t.location ? '<span class="person-card-meta">' + esc(t.location) + '</span>' : '') +
					'<span class="person-card-meta">' + esc(presenters.join(', ')) + '</span>' +
					(btns.length ? '<span class="person-card-links">' + btns.join('') + '</span>' : '') + '</div>');
			});
			h.push('</div>' + moreButtons('talks', talks.length, 8) + '</section>');
		}
		h.push('</div>');

		$root.html(h.join(''));

		/* papers: clone the exact rows from the Publications list (same look, same Cite popover) */
		var $list = $root.find('.person-papers');
		papers.forEach(function (x) { $list.append(document.importNode(x.el, true)); });
		$list.find('.pub').removeAttr('id');

		setupMore();
		setupBio();
		setupTabs();
		$root.find('.video-thumb').magnificPopup({ type: 'iframe' });
	}

	function sectionHead(key, label, n) {
		return '<section id="person-' + key + '" class="person-section" data-key="' + key + '"><h2 class="person-section-title">' + label + ' <span>(' + n + ')</span></h2>';
	}

	function moreButtons(key, total, first) {
		if (total <= first) return '';
		return '<div class="person-load" data-key="' + key + '" data-step="' + first + '">' +
			'<button type="button" class="person-load-more"></button><button type="button" class="person-load-all">Load all ' + total + ' ' + key + '</button></div>';
	}

	/* "Load N more" / "Load all" like the Makeability pages */
	function setupMore() {
		$root.find('.person-load').each(function () {
			var $box = $(this), key = $box.data('key'), step = parseInt($box.data('step'), 10);
			var $sec = $root.find('#person-' + key);
			var $items = $sec.find(key === 'papers' ? '.pub' : '.person-card');
			var shown = step;
			function update() {
				$items.each(function (i) { $(this).toggleClass('is-collapsed', i >= shown); });
				var left = $items.length - shown;
				if (left <= 0) { $box.remove(); return; }
				$box.find('.person-load-more').text('Load ' + Math.min(step, left) + ' more ' + key);
			}
			$box.on('click', '.person-load-more', function () { shown += step; update(); });
			$box.on('click', '.person-load-all', function () { shown = $items.length; update(); });
			update();
		});
	}

	function setupBio() {
		var $bio = $root.find('.person-bio'), $btn = $root.find('.person-bio-more');
		$bio.addClass('is-clamped');
		if ($bio[0] && $bio[0].scrollHeight > $bio[0].clientHeight + 4) {
			$btn.prop('hidden', false).on('click', function () {
				var open = $bio.toggleClass('is-clamped').hasClass('is-clamped');
				$btn.text(open ? 'Show more' : 'Show less');
			});
		} else {
			$bio.removeClass('is-clamped');
		}
	}

	/* sticky section tabs: smooth scroll + highlight the section in view */
	function setupTabs() {
		var $tabs = $root.find('.person-tabs a');
		if (!$tabs.length) return;
		var offset = function () { return ($('#sticky-header').outerHeight() || 70) + $root.find('.person-tabs').outerHeight() + 10; };
		$tabs.on('click', function (e) {
			var $t = $('#person-' + $(this).data('key'));
			if (!$t.length) return;
			e.preventDefault();
			$('html, body').animate({ scrollTop: $t.offset().top - offset() + 2 }, 500);
		});
		var $secs = $root.find('.person-section');
		function update() {
			var line = $(window).scrollTop() + offset() + 20, cur = null;
			$secs.each(function () { if ($(this).offset().top <= line) cur = $(this).data('key'); });
			$tabs.removeClass('active');
			if (cur) $tabs.filter('[data-key="' + cur + '"]').addClass('active');
		}
		$(window).on('scroll resize', update);
		update();
	}
})(jQuery);
