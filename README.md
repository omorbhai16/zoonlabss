# Zoon Labss — Static Website

Plain HTML5, CSS3, vanilla JavaScript and JSON. No build step, no database, no dependencies. Domain: https://zoonlabss.com

## Preview locally (required)
JSON is loaded with `fetch()`, which does **not** work from `file://`. From the `website/` folder run:
```
python3 -m http.server 8000
```
Open http://localhost:8000/

## Folder map
- `*.html` + `*.json` at the root: home, categories (product_gadget, ai_tools, app_software, games), About, Contact.
- `<category>/articles/`: one standalone HTML file per article. `<category>/<category>_photo/<item_folder>/`: that article's images (one folder per item, see "Image organization").
- `templates/article_template.html`: starter file for new articles. `css/`, `js/`, `assets/`: shared files.

## Image organization
Every item (product, AI tool, app/software, game) gets **its own image folder** inside its category's photo folder. Each category keeps its own root, so images never mix between categories:

```
product_gadget/product_gadget_photo/<item_folder>/
ai_tools/ai_tools_photo/<item_folder>/
app_software/app_software_photo/<item_folder>/
games/games_photo/<item_folder>/        e.g. games/games_photo/baper_rasta/
```
Current examples: `product_gadget/product_gadget_photo/product_gadget_article/product-gadget-article.webp`, `ai_tools/ai_tools_photo/ai_tools_article/ai-tools-article.webp`, `app_software/app_software_photo/app_software_article/app-software-article.webp`.

**New item:** create the folder before adding images. Folder name = the article's HTML file name without `.html`, lowercase, letters, numbers and `_` only (article `games/articles/baper_rasta.html` → `games/games_photo/baper_rasta/`). Put every image for that item there: thumbnail, screenshots, gameplay, creator/source images.

**File names:** lowercase, descriptive, hyphens or underscores, no spaces (e.g. `baper-rasta-protest-scene.webp`). Use the thumbnail name in the JSON `image` field. Never reuse a name inside the same folder; never overwrite another item's file.

**Referencing images** (example: article `games/articles/baper_rasta.html`, image `games/games_photo/baper_rasta/protest.webp`):

| Where | Form |
| --- | --- |
| `<img src>` in an article (two folders deep) | `../../games/games_photo/baper_rasta/protest.webp` |
| `<img src>` in a template (one folder deep) | `../CATEGORY/CATEGORY_photo/ITEM_NAME/your-image.webp` |
| `<img src>` in a root page | `games/games_photo/baper_rasta/protest.webp` |
| JSON `image` field | `games/games_photo/baper_rasta/protest.webp` |
| `og:image`, `twitter:image`, JSON-LD `image` | `https://zoonlabss.com/games/games_photo/baper_rasta/protest.webp` |

**Avoid broken links:** `js/script.js` accepts only `<category>/<category>_photo/<item_folder>/<file>` for the JSON `image` field (exactly one folder level, extensions webp, avif, png, jpg, jpeg); other paths are skipped and the card shows a placeholder. After adding content, run the local server, open the card and the article, and confirm every image loads and the console is clean. Search the project for the old file name when renaming or moving an image.

## Add a new article
1. **Copy the template:** copy `templates/article_template.html` to `<category>/articles/my_article.html` (categories: `product_gadget`, `ai_tools`, `app_software`, `games`). File names: letters, numbers, `_` or `-` only.
2. **Fix paths in the copy:** the template sits one folder shallower, so in the copy replace every `../` with `../../` (CSS, JS, images, header and footer links). Also change `data-category` in the Related block and the category breadcrumb. In the header menu, put `aria-current="true"` on the link of the article's own category (remove it from any other link) so the blue marker shows where the reader is.
3. **Write the content:** edit `<title>`, meta description, canonical URL (`https://zoonlabss.com/<category>/articles/my_article.html`), Open Graph/Twitter tags, the single `<h1>`, `<h2>`/`<h3>` headings, paragraphs and links. Show author and date only if accurate. Remove the optional blocks you do not need.
4. **Add images:** create the item folder `<category>/<category>_photo/<item_folder>/` (see "Image organization") and put all of that item's images there (WebP preferred). Set the real `width`/`height`. Do not lazy-load the top image. Always write useful `alt` text.
5. **Set the image path:** in the article use `../../<category>/<category>_photo/<item_folder>/file.webp`; in JSON use the site-root form `<category>/<category>_photo/<item_folder>/file.webp`; in meta tags and JSON-LD use the full `https://zoonlabss.com/<category>/<category>_photo/<item_folder>/file.webp` URL.
6. **Add the JSON record** to the matching file (e.g. `ai_tools.json`) — creating a record does not create the HTML file, and the HTML file does not create the record:
```json
{
  "id": "my-article", "title": "My Article", "slug": "my-article",
  "description": "Accurate one or two sentence summary.",
  "image": "ai_tools/ai_tools_photo/my_article/my-article.webp", "imageAlt": "What the image shows",
  "article": "ai_tools/articles/my_article.html", "category": "AI & Tools",
  "author": "Your name", "publishedAt": "2026-10-28", "updatedAt": "2026-10-28",
  "featured": false, "tags": ["Review"]
}
```
Required: `id, title, slug, description, article, category, publishedAt` (YYYY-MM-DD). Optional: `image, imageAlt, author, updatedAt, featured, tags, sponsored (true shows a "Sponsored" badge), sample (true shows a "Sample" badge)`. `id`/`slug` must be unique, lowercase, hyphens only. Invalid records are skipped and reported in the browser console.
7. **Test:** run the local server; confirm the card appears on the category page and home page, the link opens the right article, images load, and the console has no errors.
8. **Publish:** run `python3 tools/build_seo.py` from the `website/` folder. It rebuilds `sitemap.xml` from every indexable page and article (pages with `noindex`, `404.html`, `templates/` and `tools/` are left out) and refreshes `robots.txt`. A static site never updates its sitemap by itself, so run this after each new article. Then upload the files. No ranking or indexing is guaranteed.

## Google Analytics, Search Console, domain (one file)
Edit only `js/site-config.js`:
- `siteOrigin`: your real domain after you buy it, e.g. `https://www.yourdomain.com` (https, no trailing slash).
- `ga4MeasurementId`: the GA4 `G-...` ID. While blank, nothing from Google Analytics loads. When set, `js/analytics.js` loads gtag once per page and sends one page_view (Consent Mode: analytics storage is granted only after "Accept all" in the cookie notice).
- `searchConsoleToken`: the `content` value of Search Console's **HTML tag** verification (URL-prefix property). If you own the domain, a Domain property verified by DNS TXT record is usually better; it needs no file change and does not use this setting.

After any change run `python3 tools/build_seo.py`. It writes the verification meta tag into the `zl:gsc` markers (only for a real-looking token), writes `sitemap.xml` and `robots.txt` (with the `Sitemap:` line), and replaces the old domain in canonical/Open Graph/JSON-LD URLs. With `siteOrigin` blank, `sitemap.xml` is deliberately empty because sitemap URLs must be absolute. Submit `<siteOrigin>/sitemap.xml` in Search Console after launch.

## Translate Language
`js/translate.js` adds a floating **Translate Language** button (bottom-left) with a searchable language list. It drives Google's free Website Translator: no API key, account, payment or backend. Google's script is preloaded after the page loads so switching is immediate. The choice is kept in the `googtrans` cookie and `localStorage`; "English (Original)" restores the page. Code samples are marked `translate="no"`. If you use a Content-Security-Policy, allow `translate.google.com`, `translate.googleapis.com`, `www.gstatic.com` and `www.googletagmanager.com`.

## Starter card in each JSON file
Each of `product_gadget.json`, `ai_tools.json`, `app_software.json` and `games.json` contains exactly one card record, with a matching page in `<category>/articles/<category>_article.html` and an image in `<category>/<category>_photo/<item_folder>/`. Edit these to publish your first article in each category, or delete the record, page and image when you no longer need them.

Field guide (JSON has no comments, so it is explained here):

| Field | Required | What to put |
| --- | --- | --- |
| `id` | yes | Unique, lowercase, hyphens only |
| `title` | yes | Card and article title |
| `slug` | yes | Unique, lowercase, hyphens only |
| `description` | yes | Short summary shown on the card |
| `image` | no | `<category>/<category>_photo/<item_folder>/<file>.webp` |
| `imageAlt` | no | Describes the image |
| `article` | yes | `<category>/articles/<file>.html` |
| `category` | yes | Product & Gadget, AI & Tools, Apps & Software or Games |
| `author` | no | Only if accurate |
| `publishedAt` / `updatedAt` | yes / no | `YYYY-MM-DD` |
| `featured` | no | `true` shows it in Featured on the homepage |
| `tags` | no | List of short words |
| `sponsored` | no | `true` shows a Sponsored badge |

To add more cards, copy the whole `{ ... }` block, add a comma between blocks, and change every value.
The four starter article pages contain `<meta name="robots" content="noindex, follow">` and are not in `sitemap.xml`. When you turn one into a real article, delete that meta line and run `python3 tools/build_seo.py` (it then adds the page to the sitemap).

## Sponsored content and affiliate links
Set `"sponsored": true` in the JSON record and uncomment the `.disclosure` block in the article (edit the wording). Follow the disclosure rules in your country. Nothing here adds ads or tracking by default. If you later add analytics, cookies, ads or other third-party services, you may need a privacy policy and consent notice depending on your implementation and applicable laws.

## Security notes
JSON text is inserted with `textContent` only (no `innerHTML`, `eval`, or inline handlers); article and image paths are validated against expected local folders. Static HTML cannot set HTTP security headers or rate limits — configure those on your host (e.g. `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a Content-Security-Policy such as `default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self'`). Test any CSP before deploying, since a strict policy can break pages if you add external resources. There is no contact form; the site uses a `mailto:` link.

## Still to edit
Review the hero text, category intros, About Us text, and footer description. The logo (`assets/logo.png`), favicon (`favicon.ico`, `assets/icons/`) and social image (`assets/og-default.png`) are generated from your Zoon Labss logo; replace them together if the logo changes.

The site starts with no articles: category pages show a friendly "No articles published yet" message until you add JSON records. In your article copy, also update the JSON-LD block (title, description, dates, author, image) so it matches the visible page.