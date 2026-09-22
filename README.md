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
├── style.css           Template stylesheet. Do not edit. Override in css/custom.css instead.
├── css/custom.css      Our small set of style overrides (hero, publication cards).
├── js/main.js          Menu, publication filters, and the two hero animations.
├── css/, fonts/, js/   Template libraries (Bootstrap 3, Ionicons, Isotope). Leave as they are.
├── img/team/           One portrait per person, 600×820 px JPG, named firstname-lastname.jpg
├── img/portfolio/      One square thumbnail per paper, 600×600 px JPG, named project-<id>.jpg
├── img/class/          Course card images, 1500×460 px
├── img/favicon.png     Browser tab icon
└── .nojekyll           Tells GitHub Pages to publish the files exactly as they are. Keep it.
```

The page has these sections, in order. Each starts with an HTML comment you can search for in `index.html`:

| Section | Search for | What is in it |
|---|---|---|
| Hero | `<!-- basic-slider start -->` | Lab name, tagline, animated background, optional video |
| About us + Recent News | `<!-- about-us area start -->` | Lab description (left) and dated news items (right) |
| Our Team + Alumni | `<!-- team area start -->` | Photo cards, four per row |
| Publications | `<!-- basic-portfolio-area start -->` | Filter buttons and one card per paper |
| Classes | `<a name="classes">` | Courses taught by Dr. Hong |
| Videos | `<!-- videos area start -->` | Embedded YouTube talks |
| Lab Openings | `<!-- apply area start -->` | Recruiting text and contact details |

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

Keep the list to roughly the last two years; delete old lines from the bottom.

### 3.2 Add or change a team member

1. Save a portrait photo as `img/team/firstname-lastname.jpg`. Crop it to a **portrait ratio of about 3:4** (600 × 820 px). Square or landscape photos will look wrong next to the others.
2. Find `<h2>Our Team</h2>`. Members are in rows of four (`<div class="row">` ... four `col-sm-6 col-md-3` columns). Copy one member block and edit it:

```html
<div class="col-sm-6 col-md-3">
    <div class="team-item">
        <div class="team-item-image">
            <img src="img/team/firstname-lastname.jpg" alt="Headshot of Full Name">
            <div class="team-item-detail">
                <h5 class="team-item-title">Full Name</h5>
                <div class="team-social-icon">
                    <a href="https://personal-site.example" aria-label="Full Name website"><i class="ion-link"></i></a>
                    <a href="mailto:name@stevens.edu" aria-label="Full Name email"><i class="ion-email"></i></a>
                    <a href="https://www.linkedin.com/in/..." aria-label="Full Name linkedin"><i class="ion-social-linkedin"></i></a>
                </div>
            </div>
        </div>
        <h4 class="team-item-name">Full Name</h4>
        <span class="team-item-role">Ph.D. Student, Computer Science</span>
    </div>
</div>
```

Delete any `<a>` link lines you do not need. Available icons: `ion-link` (website), `ion-email`, `ion-social-linkedin`, `ion-social-github`, `ion-social-twitter`, `ion-university` (Google Scholar).

If a row already has four people, start a new `<div class="row">` ... `</div>` after it.

**No photo yet?** Use the grey placeholder: copy `img/team/dawei-xu.jpg` (a silhouette) to the new file name. Replace it when a photo arrives.

**Someone graduates:** cut their whole `col-sm-6 col-md-3` block, paste it into the rows under `<h2>Alumni</h2>`, and change the role to something like `M.S. Computer Science, 2026`.

### 3.3 Add a publication

1. Make a **square thumbnail** (600 × 600 px JPG) and save it as `img/portfolio/project-<short-id>.jpg`. A teaser figure from the paper, a photo from the study, or a simple illustration all work. Keep the style consistent with the existing ones.
2. Find `<div id="portfolio-grid"`. The first card after it is the newest paper. Copy one card and paste it **above** the first one:

```html
<div class="portfolio-item access paper">
    <div class="portfolio-wrapper">
        <div class="portfolio-thumb">
            <img src="img/portfolio/project-<short-id>.jpg" alt="Thumbnail for Short Name" />
            <div class="view-icon">
                <a href="https://doi.org/10.1145/XXXXXXX" target="_blank" rel="noopener"><span class="icon-attachment"></span></a>
            </div>
        </div>
        <div class="portfolio-caption caption-border text-center">
            <h4><a href="https://doi.org/10.1145/XXXXXXX" target="_blank" rel="noopener">Short Name</a></h4>
            <div class="work-tag">
                <a href="https://doi.org/10.1145/XXXXXXX" target="_blank" rel="noopener">Full Paper Title</a>
                <span class="pub-authors">First Author, Second Author, Jonggi Hong</span>
            </div>
            <div class="paper-menu">
                CHI 2027: <a href="https://doi.org/10.1145/XXXXXXX" target="_blank" rel="noopener">PAPER</a>
            </div>
        </div>
    </div>
</div>
```

3. Set the **filter classes** on the first line. Pick every tag that applies:
   - `access` – accessibility work
   - `wearable` – wearables, smart glasses, haptics
   - `humanai` – human-AI interaction, conversational agents, tools
   - `paper` (full paper or journal article) **or** `poster` (poster, demo, extended abstract, workshop paper)

4. Update the counts in the filter buttons just above the grid, for example `All (28)` → `All (29)`. The buttons are labelled `data-filter=".access"` and so on.

5. Optional extra links in `paper-menu`, separated by ` | `: `<a href="...">VIDEO</a>`, `<a href="...">CODE</a>`, `<a href="...">PDF</a>`.

**Not published yet (no DOI)?** Use the conference program page, or the lab news item, as the link. Do not upload paper PDFs before the publisher releases them.

### 3.4 Mark an award

Inside the card's `portfolio-thumb`, right after the `<img ...>` line, add:

```html
<div class="ribbon ribbon-holder">AWARD</div>
```

and in `paper-menu` write the award after the venue:

```html
CHI 2027 <award>(Best Paper Honorable Mention)</award>: <a href="...">PAPER</a>
```

Then update the sentence under the Publications heading that says how many articles have been honored.

### 3.5 Add a class

Find `<h2>Classes Taught by Dr. Hong</h2>`. Copy one `<div class="col-sm-6 col-md-6 blog-item">` block, change the semester, title, description, and link. Make a matching card image (1500 × 460 px) in `img/class/`, or reuse an existing one.

### 3.6 Add a video

Find `<!-- videos area start -->`. Copy the `blog-item` block and change the YouTube ID in the `data-src` URL (`https://www.youtube.com/embed/VIDEO_ID`), the author, title, description, and link. Two videos fit per row; the single existing block is centred with `col-sm-offset-2`, so remove the two `offset` classes when you add a second one.

### 3.7 Edit the About text, Lab Openings, or contact details

These are ordinary paragraphs. Find the heading (`<h2>About us</h2>` or `<h2>Lab Openings</h2>`) and edit the text inside the `<p>` tags. Office, phone, and email are in the last paragraph of Lab Openings.

### 3.8 Change the hero (top of page)

The hero element is `<div id="home-area" ...>`. Its attributes control everything:

| Attribute | Meaning |
|---|---|
| `data-video` | YouTube video ID shown between the animations. Set to `""` for animations only. |
| `data-video-start` / `data-video-stop` | Seconds into the video to loop between. |
| `data-video-seconds` | How long the video shows each cycle (default 5). |
| `data-animation-seconds` | How long each animation shows (default 10). |

The rotation is: network animation → video → wave animation → video → repeat. Both animations react to the mouse. The video only appears once YouTube has actually started playing, so a slow connection just shows the animations.

The title and tagline are the `<h1>` and `<p class="lead">` right below.

---

## 4. Image guidelines

| Use | Size | Format | Folder |
|---|---|---|---|
| Team portrait | 600 × 820 px (3:4 portrait) | JPG, under 200 KB | `img/team/` |
| Paper thumbnail | 600 × 600 px (square) | JPG, under 200 KB | `img/portfolio/` |
| Class card | 1500 × 460 px | JPG | `img/class/` |

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

**A publication card is much taller than the others.** The title is very long. Use a shorter display name in the `<h4>`; the full title stays in `work-tag`.

**The filter buttons stop working.** A card is missing its `portfolio-item` class or `#portfolio-grid` got an extra tag inside it.

**The hero video does not play.** It only plays over HTTPS on the live site, not from a file opened by double-clicking. It also never plays on phones (browsers block autoplay), which is expected; the animations show instead.

**GitHub says the site is not publishing.** Repository Settings → Pages must show Source: *Deploy from a branch*, Branch: `main`, Folder: `/ (root)`. The `.nojekyll` file must be present at the top level. The old address https://interactivecomputinglab.github.io/lab_website/ redirects here and can be left alone.

---

## 7. Handing the site to the next maintainer

1. Ask Dr. Hong to add the new person as a collaborator on the repository (Settings → Collaborators).
2. Point them to this README.
3. Walk them through one real change together, for example adding a news item, and watch it go live.

That is the whole process. Everything else is copy, paste, and edit.
