# Interactive Computing Lab — Website Maintainer Guide

This is the source of the Interactive Computing Lab website (Stevens Institute of Technology, Dr. Jonggi Hong).
It is a **single static web page**: plain HTML, CSS, and JavaScript. There is nothing to install, compile, or build.
If you can edit a text file and upload it to GitHub, you can maintain this site.

**Live site:** https://interactivecomputinglab.github.io/
**Repository:** https://github.com/InteractiveComputingLab/interactivecomputinglab.github.io (the site files are at the top level of the repository)

The repository name is special: GitHub publishes a repository called `<organization>.github.io` at that address automatically, from the `main` branch. Do not rename it.

A mirror of the same files is kept at https://github.com/meazizul/ICLAB (live at https://azizulhaque.me/ICLAB/).

---

## 1. How the site is organised

```
(repository root)
├── index.html          ← THE ENTIRE SITE. 95% of edits happen in this one file.
├── people/<id>/        One profile page per team member, e.g. people/azizul-haque/ (made by tools/build-profiles.py).
├── person.html         Template for those profile pages. Edit this, not the copies in people/.
├── tools/build-profiles.py   Makes people/<id>/index.html for everyone on the team page (see 3.10).
├── js/lab-data.js      Profile extras: bios, projects, and talks (see 3.10).
├── js/person.js        Builds the profile pages from index.html + js/lab-data.js. No need to edit.
├── style.css           Template stylesheet. Do not edit. Override in css/custom.css instead.
├── css/custom.css      Our style overrides (hero, publication list, gallery, news, footer).
├── js/main.js          Menu, publication filters/year menu/Cite popup, gallery, and the hero animations.
├── css/, fonts/, js/   Template libraries (Bootstrap 3, Ionicons, Magnific Popup). Leave as they are.
├── img/team/           One portrait per person, 600×820 px JPG, named firstname-lastname.jpg
├── img/papers/         First-page thumbnail per paper, 240×310 px JPG, named <firstauthor><year><word>.jpg
├── img/projects/       Project card images for the profile pages, 640×400 px JPG
├── img/class/          Course card images, 1500×460 px
├── img/gallery/        One folder per album: cover.jpg (900×562), photos 01.jpg, 02.jpg, … and thumbnails 01-thumb.jpg, …
├── img/logo/           Lab logo: icl-mark.png (icon), icl-logo-dark.png, icl-logo-white.png
├── img/favicon.png     Browser tab icon (plus favicon-32.png, apple-touch-icon.png, og-image.png for link previews)
└── .nojekyll           Tells GitHub Pages to publish the files exactly as they are. Keep it.
```

The page has these sections, in order. Each starts with an HTML comment you can search for in `index.html`:

| Section | Search for | What is in it |
|---|---|---|
| Hero | `<!-- basic-slider start -->` | Lab name, tagline, animated background, optional video |
| About us + Recent News | `<!-- about-us area start -->` | Lab description (left) and dated news items (right) |
| Our Team + Alumni | `<!-- team area start -->` | Photo cards, four per row |
| Publications | `<!-- basic-portfolio-area start -->` | Filter buttons, year menu, and one row per paper grouped by year |
| Classes | `<a name="classes">` | Courses taught by Dr. Hong |
| Videos | `<!-- videos area start -->` | Embedded YouTube talks |
| Gallery | `<!-- gallery area start -->` | Photo albums (conference trips, lab events) that open as a slideshow |
| Lab Openings | `<!-- apply area start -->` | Recruiting text and contact details |
| Footer | `<!-- footer start -->` | Copyright line and the "Built with love by" maintainer credit |

---

## 2. Two ways to make a change

### Option A — edit in the browser (no software needed)

1. Open the repository on GitHub.
2. Click the file you want to change (usually `index.html`), then click the **pencil icon** (Edit).
3. Make your change. Use Ctrl+F / Cmd+F to find the section.
4. Click **Commit changes**, write a one-line note such as "Add ASSETS 2027 paper", and commit to `main`.
5. Wait one to two minutes. Reload the live site. If you still see the old version, hard-refresh (Cmd+Shift+R or Ctrl+F5).

To add an image in the browser: open the right folder (for example `img/team`), click **Add file → Upload files**, drop the image in, and commit.

### Option B — edit on your computer (recommended for bigger changes)

```bash
git clone https://github.com/InteractiveComputingLab/interactivecomputinglab.github.io.git
cd interactivecomputinglab.github.io
python3 -m http.server 8080        # preview at http://localhost:8080
# ... edit index.html and images, refresh the browser to check ...
git add -A
git commit -m "Describe your change"
git push
```

The live site updates automatically one to two minutes after `git push`.

---

## 3. Recipes for common updates

Every recipe is "copy an existing block, then change the words". Never delete the surrounding `<div>` tags.

### 3.1 Post a news item

Find `<h2>Recent News</h2>`. The items are lines inside one `<p>`. Add the newest at the top:

```html
<strong>Oct 2026:</strong> Our paper <em>Paper Title</em> is accepted to <strong>CHI 2027</strong>!<br>
```

Keep the list to the current and previous year (for example 2026 and 2025); delete older lines from the bottom.

You do not need to worry about length: the page shows only as many items as fit beside the About us text, so both columns end on the same line, and the rest open with a **More news** link. On phones it shows the newest four.

The pulsing **NEW** badge is added automatically to whichever line is first, so it moves on its own when you add a line at the top. To link a news item to a photo album, add a Photos pill at the end of the line, pointing at the album's `id` from the Gallery section:

```html
<a class="news-photos" href="#gallery-assets2026"><i class="ion-images"></i> Photos</a>
```

Clicking it scrolls to the Gallery and opens that album. Link paper titles in the news to their DOI (`<a href="https://doi.org/..." target="_blank" rel="noopener"><em>Title</em></a>`) so readers can reach the paper in one click.

### 3.2 Add or change a team member

1. Save a portrait photo as `img/team/firstname-lastname.jpg`. Crop it to a **portrait ratio of about 3:4** (600 × 820 px). Square or landscape photos will look wrong next to the others.
2. Find `<h2>Our Team</h2>`. Members are in rows of four (`<div class="row">` ... four `col-sm-6 col-md-3` columns). Copy one member block and edit it:

```html
<div class="col-sm-6 col-md-3">
    <div class="team-item" data-person="firstname-lastname">
        <div class="team-item-image">
            <img src="img/team/firstname-lastname.jpg" alt="Headshot of Full Name">
            <a class="team-profile-link" href="people/firstname-lastname/" aria-label="View Full Name&rsquo;s profile"></a>
            <div class="team-item-detail">
                <h5 class="team-item-title">Full Name</h5>
                <span class="team-profile-cta">View profile <i class="ion-arrow-right-c" aria-hidden="true"></i></span>
                <div class="team-social-icon">
                    <a href="https://personal-site.example" aria-label="Full Name website"><i class="ion-link"></i></a>
                    <a href="mailto:name@stevens.edu" aria-label="Full Name email"><i class="ion-email"></i></a>
                    <a href="https://www.linkedin.com/in/..." aria-label="Full Name linkedin"><i class="ion-social-linkedin"></i></a>
                </div>
            </div>
        </div>
        <h4 class="team-item-name"><a href="people/firstname-lastname/">Full Name</a></h4>
        <span class="team-item-role">Ph.D. Student, Computer Science</span>
    </div>
</div>
```

Use the photo's file name (without `.jpg`) as the id in all three places: `data-person`, and the two `people/.../` links. Then create the person's profile page (see 3.10): run `python3 tools/build-profiles.py`, or on GitHub copy any `people/<someone>/index.html` to `people/<new-id>/index.html` and change the id in `data-person="..."` and the name in `<title>`.

Delete any social `<a>` link lines you do not need. Available icons: `ion-link` (website), `ion-email`, `ion-social-linkedin`, `ion-social-github`, `ion-social-twitter`, `ion-university` (Google Scholar).

If a row already has four people, start a new `<div class="row">` ... `</div>` after it.

**No photo yet?** Use the grey placeholder: copy `img/team/dawei-xu.jpg` (a silhouette) to the new file name. Replace it when a photo arrives.

**Someone graduates:** cut their whole `col-sm-6 col-md-3` block, paste it into the rows under `<h2>Alumni</h2>`, and change the role to something like `M.S. Computer Science, 2026`.

### 3.3 Add a publication

The list works like the [Makeability Lab publications page](https://makeabilitylab.cs.washington.edu/publications/): papers are grouped by year, newest first, and each row shows the paper's first page, title, authors, venue, and PDF / DOI / Cite buttons.

1. **Thumbnail = the paper's first page.** Open the PDF, take page 1 as an image, and save it as a 240 × 310 px JPG in `img/papers/`, named like `smith2027glasses.jpg` (first author's last name, year, one word). On a Mac with Python and PyMuPDF installed:

   ```bash
   python3 -c "import fitz,sys; fitz.open(sys.argv[1])[0].get_pixmap(dpi=110).save('page1.png')" paper.pdf
   ```

   then resize `page1.png` to 240 px wide in Preview (Tools → Adjust Size) and export it as JPG. A screenshot of page 1 works too.

2. Find the year section, for example `<!-- ===== 2027 ===== -->`, and paste a new row **at the top** of it (newest first):

```html
<article class="pub" id="pub-smith2027glasses" data-tags="access paper">
    <a class="pub-thumb" href="https://dl.acm.org/doi/pdf/10.1145/XXXXXXX" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">
        <img src="img/papers/smith2027glasses.jpg" alt="" width="240" height="310" loading="lazy">
    </a>
    <div class="pub-body">
        <h4 class="pub-title"><a href="https://dl.acm.org/doi/pdf/10.1145/XXXXXXX" target="_blank" rel="noopener">Full Paper Title</a></h4>
        <p class="pub-authors">First Author, Second Author, Jonggi Hong</p>
        <p class="pub-venue"><em>Proceedings of CHI 2027</em></p>
        <p class="pub-links">
            <a class="pub-btn" href="https://dl.acm.org/doi/pdf/10.1145/XXXXXXX" target="_blank" rel="noopener"><i class="ion-document-text" aria-hidden="true"></i> PDF</a>
            <a class="pub-btn" href="https://doi.org/10.1145/XXXXXXX" target="_blank" rel="noopener"><i class="ion-link" aria-hidden="true"></i> DOI</a>
            <button type="button" class="pub-btn pub-cite"><i class="ion-quote" aria-hidden="true"></i> Cite</button>
        </p>
        <pre class="pub-bibtex" hidden>@inproceedings{smith2027glasses,
  title = {Full Paper Title},
  author = {Smith, First and Author, Second and Hong, Jonggi},
  booktitle = {Proceedings of the 2027 CHI Conference on Human Factors in Computing Systems},
  year = {2027},
  publisher = {Association for Computing Machinery},
  doi = {10.1145/XXXXXXX}
}</pre>
    </div>
</article>
```

   - **PDF link:** for ACM papers use `https://dl.acm.org/doi/pdf/<DOI>` (the ACM Digital Library is open access). For other publishers, link the open-access PDF or Dr. Hong's copy on `jonggi.github.io/papers/`. The thumbnail, the title, and the PDF button all use this link.
   - **BibTeX:** get it from the paper's ACM page (Export Citation → BibTeX), or run `curl -LH "Accept: application/x-bibtex" https://doi.org/<DOI>` and tidy it up. Keep the `<pre ...>` and `</pre>` on the same lines as the first and last BibTeX lines. If the BibTeX contains `&`, `<` or `>`, write them as `&amp;`, `&lt;`, `&gt;`.
   - **id:** `pub-` plus the thumbnail name, for example `id="pub-smith2027glasses"`. Projects on the profile pages refer to papers by this id.
   - **Venue line:** `Proceedings of CHI 2027`, `Poster Proceedings of ASSETS 2027`, `Extended Abstracts of CHI 2027`, or the journal name. No acceptance rates.

3. Set the **filter tags** in `data-tags`, separated by spaces. Pick every one that applies:
   - `access` – accessibility work
   - `wearable` – wearables, smart glasses, haptics
   - `humanai` – human-AI interaction, conversational agents, tools
   - `paper` (full paper or journal article) **or** `poster` (poster, demo, extended abstract, experience report, workshop paper)

   The numbers on the filter buttons are counted automatically. There is nothing to update.

4. **First paper of a new year?** Add a year section above the newest one, and a link for it at the top of the year menu (`<nav class="pub-years">`):

```html
<!-- ===== 2027 ===== -->
<section class="pub-year" data-year="2027">
    <a name="pubs-2027"></a>
    <h3 class="pub-year-title">2027</h3>
    ...rows...
</section>
```

```html
<a href="#pubs-2027" data-year="2027">2027</a>
```

**Not published yet (no DOI)?** Leave out the DOI button and link the PDF only once the publisher has released it.

### 3.4 Mark an award

Inside the row's `<a class="pub-thumb" ...>`, right after the `<img ...>` line, add the corner ribbon:

```html
<span class="pub-ribbon">Award</span>
```

and add the award after the venue:

```html
<p class="pub-venue"><em>Proceedings of CHI 2027</em> <span class="pub-award"><i class="ion-trophy" aria-hidden="true"></i> Best Paper Honorable Mention</span></p>
```

Then update the sentence under the Publications heading that says how many articles have been honored.

### 3.5 Add a class

Find `<h2>Classes Taught by Dr. Hong</h2>`. Copy one `<div class="col-sm-6 col-md-6 blog-item">` block, change the semester, title, description, and link. Make a matching card image (1500 × 460 px) in `img/class/`, or reuse an existing one.

### 3.6 Add a video

Find `<!-- videos area start -->`. Copy the `blog-item` block and change the YouTube ID in the `data-src` URL (`https://www.youtube.com/embed/VIDEO_ID`), the author, title, description, and link. Keep the author line as `By <a ...>Full Name</a>, Venue`: the name there is how the video shows up on that person's profile page. Two videos fit per row; the single existing block is centred with `col-sm-offset-2`, so remove the two `offset` classes when you add a second one.

### 3.7 Add a photo album to the Gallery

1. Make a folder `img/gallery/<album-name>/` (lowercase, hyphens). Put the photos in it as `01.jpg`, `02.jpg`, … (longest side about 1600 px, under 500 KB each). For each photo also save a small **600 × 400 px** thumbnail as `01-thumb.jpg`, `02-thumb.jpg`, … and a cover image `cover.jpg` cropped to **900 × 562 px** (16:10). If you skip a thumbnail, the full photo is used in its place (it still works, it just loads slower).
2. Find `<!-- gallery area start -->`. Copy one `<div class="col-sm-6 col-md-4">` block and paste it where you want the album to appear (newest first). Edit:
   - the `id="gallery-<album-name>"` on the `gallery-item` div (this is what news Photos links point at),
   - the `cover.jpg` path and its `alt` text,
   - `gallery-meta` (month and place), `gallery-title` (event name), and the short paragraph (these also appear at the top of the album panel),
   - the hidden `<ul class="gallery-album">`: one `<li><a href="img/gallery/<album-name>/01.jpg" data-thumb="img/gallery/<album-name>/01-thumb.jpg" data-alt="...">Caption</a></li>` per photo. The caption shows under the thumbnail in the album panel and under the large photo; write the event, the authors, and what is pictured.
3. The photo count badge on the cover fills in by itself. Three albums fit per row; a fourth starts a new row automatically.
4. Phone photos in HEIC format must be converted to JPG first (on a Mac: `sips -s format jpeg IMG_1234.HEIC --out 01.jpg`). Saving through Preview or Photos also strips location data from the file, which is what you want on a public site.

How it behaves: clicking a card blooms open the **album panel**, which shows every photo as a thumbnail with its caption. Clicking a thumbnail opens that **photo large** with its description; arrows and the keyboard move between photos, and the large view steps forward on its own every 3.5 seconds until the last photo (any key or click stops it). Closing the large photo returns to the album panel; closing the panel returns to the page. Change the autoplay speed with the `data-autoplay` attribute (milliseconds) on the gallery `<div>`, or set it to `0` to turn it off.

### 3.8 Edit the About text, Lab Openings, or contact details

These are ordinary paragraphs. Find the heading (`<h2>About us</h2>` or `<h2>Lab Openings</h2>`) and edit the text inside the `<p>` tags. Office, phone, and email are in the last paragraph of Lab Openings. The copyright year at the very bottom is plain text in the footer (`<!-- footer start -->`); update it each January.

### 3.9 Change the hero (top of page)

The hero element is `<div id="home-area" ...>`. Its attributes control everything:

| Attribute | Meaning |
|---|---|
| `data-video` | YouTube video ID shown between the animations. Set to `""` for animations only. |
| `data-video-start` / `data-video-stop` | Seconds into the video to loop between. |
| `data-video-seconds` | How long the video shows each cycle (default 5). |
| `data-animation-seconds` | How long each animation shows (default 10). |

The rotation is: network animation → video → wave animation → video → repeat. Both animations react to the mouse. The video only appears once YouTube has actually started playing, so a slow connection just shows the animations.

The title and tagline are the `<h1>` and `<p class="lead">` right below.

### 3.10 Profile pages (people, projects, talks)

Every team member and alumnus has a profile page in the style of the Makeability Lab member pages: photo, role, links, a short bio, their recent news, a row of contribution counts (papers, first-author papers, awards, projects, talks, videos), and sections for **Projects, Papers, Videos, and Talks**. Clicking a photo or name in Our Team opens it. Every person has their own address, for example **https://interactivecomputinglab.github.io/people/azizul-haque/**, which is good to put on a CV or LinkedIn.

Most of it fills in **by itself** from `index.html`:

| On the profile | Comes from |
|---|---|
| Name, role, photo, links | The person's card in Our Team / Alumni |
| Papers (and the first-author and award counts) | The Publications list, wherever the person's name is in the author line |
| Videos | The Videos section, wherever the name is in the `By ...` line |
| Recent news | The Recent News lines that mention the name |

So adding a paper, a video, or a news line on `index.html` updates every profile automatically. Three things live in `js/lab-data.js` instead:

- **Bio.** Under `people`, add an entry keyed by the person's id. Without one, the page writes a short line from the role and their papers.

  ```js
  'jiayin-huang': { bio: 'Jiayin Huang is a Ph.D. student ...' },
  ```

  If a name is written differently in papers (a middle name, an old spelling), add it to `aliases`, for example `aliases: ['Nicholas Michael Russo']`.

- **Projects.** Each project lists its paper ids (`pub-...` without `pub-`). Everyone who authored one of those papers gets the project on their profile. Copy an entry and change the title, years, one-line summary, papers, link, and a 640 × 400 px image in `img/projects/`.

- **Talks.** Newest first. `people` lists who presented, `type` is `Talk` or `Poster`, and `links` can have `paper`, `slides`, `video`, and `photos` (for example `index.html#gallery-dis2026`).

**New team member? Make their page.** Each address is a small folder, `people/<id>/index.html`, copied from `person.html`. After adding someone to Our Team (3.2), run:

```bash
python3 tools/build-profiles.py
```

It writes a page for everyone on the team page, with their name in the browser tab and in link previews. Re-run it whenever you change `person.html`. You do **not** need to re-run it for new papers, news, bios, projects or talks; those appear by themselves. No Python? Copy any `people/<someone>/` folder on GitHub and change the id in `data-person="..."` and the name in `<title>`.

Preview profile pages through the local server in Option B (`python3 -m http.server`). Opened as a plain file, the page cannot read `index.html` and shows "Profile unavailable". Old links of the form `person.html?id=<id>` still work; they forward to `people/<id>/`.

---

## 4. Image guidelines

| Use | Size | Format | Folder |
|---|---|---|---|
| Team portrait | 600 × 820 px (3:4 portrait) | JPG, under 200 KB | `img/team/` |
| Paper thumbnail (first page) | 240 × 310 px (portrait) | JPG, under 40 KB | `img/papers/` |
| Project card | 640 × 400 px | JPG, under 40 KB | `img/projects/` |
| Class card | 1500 × 460 px | JPG | `img/class/` |
| Gallery cover | 900 × 562 px (16:10) | JPG, under 150 KB | `img/gallery/<album>/cover.jpg` |
| Gallery photo | longest side 1600 px | JPG, under 500 KB | `img/gallery/<album>/01.jpg` … |
| Gallery thumbnail | 600 × 400 px (3:2) | JPG, under 80 KB | `img/gallery/<album>/01-thumb.jpg` … |

Free tools for cropping and resizing: Preview on macOS (Tools → Adjust Size), Photos on Windows, or https://squoosh.app in the browser. Use only lowercase letters, numbers, and hyphens in file names.

---

## 5. Before you publish: a 60-second checklist

- [ ] Open the page locally (`python3 -m http.server 8080`) or check the live site after the commit.
- [ ] Every new image shows up (a broken image icon means the file name or folder does not match).
- [ ] Click each new link.
- [ ] Publication filter counts match the number of cards.
- [ ] Nothing is duplicated or half-deleted: the page should have no stray text at the bottom.
- [ ] On a phone (or a narrow browser window) the menu collapses into a ☰ button and everything stacks.

---

## 6. Troubleshooting

**I changed something but the live site looks the same.** GitHub Pages takes one to two minutes to publish. Then hard-refresh: Cmd+Shift+R on Mac, Ctrl+F5 on Windows. If you edited `css/custom.css` or `js/main.js`, also bump the version number in `index.html` where they are loaded (`custom.css?v=6` → `?v=7`) so browsers fetch the new file.

**The page is completely blank or unstyled.** Usually a broken `<div>` in `index.html`. Check the last edit: every opening tag needs its closing tag. GitHub's file view will show a diff of exactly what changed; revert it if needed (History → the commit → "Revert").

**A paper does not show up under a filter.** Its `data-tags` is missing that tag, or has a typo. Tags are separated by spaces.

**A year is missing from the year menu, or clicking it does nothing.** The year needs both a `<nav class="pub-years">` link with `href="#pubs-2027"` and a section with `<a name="pubs-2027"></a>`; the two numbers must match.

**A profile says "Profile unavailable".** It was opened as a file. Use `python3 -m http.server` (Option B), or check it on the live site.

**A team member's photo opens a "404 File not found" page.** Their `people/<id>/` folder does not exist yet. Run `python3 tools/build-profiles.py` (or copy a folder, see 3.10), and check the id matches the photo file name.

**A paper is missing from someone's profile.** Their name in the paper's author line is spelled differently from their team card. Add that spelling to `aliases` in `js/lab-data.js`.

**The Cite popup shows strange characters.** The BibTeX inside `<pre class="pub-bibtex">` contains a raw `&`, `<` or `>`. Write them as `&amp;`, `&lt;`, `&gt;`.

**The hero video does not play.** It only plays over HTTPS on the live site, not from a file opened by double-clicking. It also never plays on phones (browsers block autoplay), which is expected; the animations show instead.

**GitHub says the site is not publishing.** Repository Settings → Pages must show Source: *Deploy from a branch*, Branch: `main`, Folder: `/ (root)`. The `.nojekyll` file must be present at the top level. The old address https://interactivecomputinglab.github.io/lab_website/ redirects here and can be left alone.

---

## 7. Handing the site to the next maintainer

1. Ask Dr. Hong to add the new person as a collaborator on the repository (Settings → Collaborators).
2. Point them to this README.
3. Walk them through one real change together, for example adding a news item, and watch it go live.

That is the whole process. Everything else is copy, paste, and edit.

---

## 8. Credits

Designed and built by Azizul Haque, September 2026. The footer credit ("Built with love by Azizul Haque") links to [azizulhaque.me](https://azizulhaque.me/). A future maintainer who rebuilds the site can change it to their own name and link.
