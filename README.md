# Interactive Computing Lab — Website

Official website of the Interactive Computing Lab (ICL) at Stevens Institute of Technology, directed by Dr. Jonggi Hong.

Single-page static site (HTML + CSS + jQuery). No build step. Push to GitHub and enable GitHub Pages.

## Files

```
index.html          The whole site (About, News, Team, Publications, Classes, Openings)
style.css           Template stylesheet (do not edit; override in css/custom.css)
css/custom.css      ICL-specific overrides (hero layers, author line, card heights)
css/, fonts/, js/   Template assets: Bootstrap 3, Ionicons, et-line icons, Isotope, meanmenu
js/main.js          Sticky header, mobile menu, publication filters, smooth scroll, two hero animations + video rotation
img/team/           Headshots, one per person, portrait 600×820 JPG (same 0.73 ratio as the reference site). Placeholder silhouettes for missing photos.
img/portfolio/      One square thumbnail per publication, named project-<id>.jpg
img/class/          Course card images
```

## Editing content

Everything is in `index.html`. Search for the section comment and copy an existing block.

| To… | Do |
|---|---|
| Post news | Add a line at the top of the **Recent News** column: `<strong>Mon YYYY:</strong> text<br>` |
| Add a team member | Copy a `team-item` block inside the **Our Team** rows (4 per row). Drop a portrait photo (600×820) in `img/team/` |
| Move someone to alumni | Move their block to the **Alumni** rows and update the role text |
| Add a publication | Copy a `portfolio-item` block at the top of `#portfolio-grid`. Set the classes (`access`, `wearable`, `humanai`, `paper` or `poster`) and add a 600×600 thumbnail in `img/portfolio/`. Update the counts in the filter buttons. |
| Mark an award | Add `<div class="ribbon ribbon-holder">AWARD</div>` inside `portfolio-thumb`, and `<award>(Best Paper Award)</award>` in `paper-menu` |
| Add a class | Copy a `blog-item` block in the **Classes** section |
| Change the hero video | Edit `data-video` on `#home-area` (YouTube ID); `data-video-start` / `data-video-stop` set the seconds window. Empty `data-video` to show the animation only |
| Change the hero timing | `data-animation-seconds` and `data-video-seconds` on `#home-area`. Rotation is network animation → video → wave animation → video. Video slots are skipped until YouTube reports it is playing |
| After editing CSS/JS | Bump the `?v=` number on `css/custom.css` and `js/main.js` in `index.html` so browsers fetch the new file |
| Add a video | Copy the `blog-item` block in the **Videos** section and change the YouTube embed URL |

## Local preview

```
cd iclab-website
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploying to GitHub Pages

Push the folder contents to the repository root (or `docs/`), then in **Settings → Pages** pick that branch and folder. Links are relative, so the site works at `https://<org>.github.io/<repo>/`.
