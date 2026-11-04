#!/usr/bin/env python3
"""Zoon Labss — SEO build step for this static site. Run from anywhere:

    python3 tools/build_seo.py

Reads js/site-config.js and then:
  1. writes sitemap.xml  (public, indexable pages + published articles only)
  2. writes robots.txt
  3. fills/clears the Search Console verification meta tag inside the
     <!-- zl:gsc:start --><!-- zl:gsc:end --> markers of each page
  4. if siteOrigin is set, rewrites the old domain in canonical / og / twitter / JSON-LD URLs

It is safe to run repeatedly. A static site does NOT update its sitemap by itself: run this
script after you add or remove an article. Python 3 standard library only.
"""
import glob
import os
import re
import sys
import json
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {"templates", "tools", "assets", "css", "js", ".git", "node_modules"}
ORIGIN_RE = re.compile(r"^https://[a-z0-9]([a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}(:\d+)?$", re.I)
TOKEN_RE = re.compile(r"^[A-Za-z0-9_-]{20,100}$")
GSC_RE = re.compile(r"<!-- zl:gsc:start -->.*?<!-- zl:gsc:end -->", re.S)
warnings = []


def read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return f.read()


def write(path, text):
    with open(os.path.join(ROOT, path), "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def load_config():
    src = read("js/site-config.js")
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    src = "\n".join(l for l in src.splitlines() if not l.strip().startswith("//"))
    def get(key):
        m = re.search(r"\b" + key + r'\s*:\s*"([^"]*)"', src)
        return (m.group(1).strip() if m else "")
    return get("siteOrigin"), get("searchConsoleToken"), get("ga4MeasurementId")


def html_files():
    out = []
    for p in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True):
        out.append(os.path.relpath(p, ROOT).replace(os.sep, "/"))
    return sorted(out)


def is_noindex(text):
    return bool(re.search(r'<meta[^>]+name=["\']robots["\'][^>]*noindex', text, re.I))


def public_pages():
    pages = []
    for rel in html_files():
        top = rel.split("/")[0]
        if top in SKIP_DIRS or rel == "404.html":
            continue
        if "/" in rel and not re.match(r"^[^/]+/articles/[^/]+\.html$", rel):
            continue
        if is_noindex(read(rel)):
            continue
        pages.append(rel)
    pages.sort(key=lambda r: (r != "index.html", "/" in r, r))
    return pages


def lastmods():
    m = {}
    for jf in glob.glob(os.path.join(ROOT, "*.json")):
        try:
            data = json.load(open(jf, encoding="utf-8"))
        except Exception as e:
            warnings.append("Could not read %s: %s" % (os.path.basename(jf), e))
            continue
        if not isinstance(data, list):
            continue
        for it in data:
            if isinstance(it, dict) and isinstance(it.get("article"), str):
                d = it.get("updatedAt") or it.get("publishedAt")
                if isinstance(d, str) and re.match(r"^\d{4}-\d{2}-\d{2}$", d):
                    m[it["article"]] = d
                if not os.path.exists(os.path.join(ROOT, it["article"])):
                    warnings.append("%s lists %s but that file does not exist" % (os.path.basename(jf), it["article"]))
    return m


def url_path(rel):
    return "/" if rel == "index.html" else "/" + rel


def main():
    origin, token, ga = load_config()
    if origin.endswith("/"):
        origin = origin.rstrip("/")
        warnings.append("siteOrigin had a trailing slash; it was ignored.")
    origin_ok = bool(origin) and bool(ORIGIN_RE.match(origin))
    if origin and not origin_ok:
        warnings.append('siteOrigin "%s" is not a valid https origin (e.g. https://www.yourdomain.com); treated as NOT set.' % origin)
    token_ok = bool(token) and bool(TOKEN_RE.match(token))
    if token and not token_ok:
        warnings.append("searchConsoleToken does not look like a real verification token; no meta tag was written.")
    if ga and not re.match(r"^G-[A-Z0-9]{6,14}$", ga):
        warnings.append("ga4MeasurementId is not in the G-XXXXXXXXXX format; analytics.js will ignore it.")

    pages = public_pages()
    mods = lastmods()
    all_html = html_files()

    # the origin currently written in the pages (taken from the home page canonical link)
    m = re.search(r'rel="canonical"\s+href="(https?://[^/"]+)', read("index.html"))
    old_origin = m.group(1) if m else None

    # 1) origin rewrite + 3) Search Console marker, per file
    for rel in all_html:
        text = read(rel)
        new = text
        if origin_ok and old_origin and old_origin != origin:
            new = new.replace(old_origin, origin)
        if rel in pages or rel.startswith("templates/"):
            tag = '<meta name="google-site-verification" content="%s">' % token if token_ok else ""
        else:
            tag = ""
        new = GSC_RE.sub(lambda _m: "<!-- zl:gsc:start -->%s<!-- zl:gsc:end -->" % tag, new)
        if new != text:
            write(rel, new)

    # canonical sanity check (path must match the real file)
    for rel in pages:
        m = re.search(r'rel="canonical"\s+href="https?://[^/"]+([^"]*)"', read(rel))
        if not m:
            warnings.append("%s has no canonical link" % rel)
        elif m.group(1) != url_path(rel):
            warnings.append("%s canonical path is %s but the file lives at %s" % (rel, m.group(1), url_path(rel)))

    # 2) sitemap.xml
    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    if origin_ok:
        lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
        for rel in pages:
            lines.append("  <url>")
            lines.append("    <loc>%s</loc>" % escape(origin + url_path(rel)))
            if rel in mods:
                lines.append("    <lastmod>%s</lastmod>" % mods[rel])
            lines.append("  </url>")
        lines.append("</urlset>")
    else:
        lines.append("<!-- Prepared, intentionally empty: siteOrigin in js/site-config.js is not set yet.")
        lines.append("     Sitemap URLs must be absolute, so none are listed until you set your real domain")
        lines.append("     and run: python3 tools/build_seo.py -->")
        lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
        lines.append("</urlset>")
    write("sitemap.xml", "\n".join(lines) + "\n")

    # validate sitemap
    tree = ET.parse(os.path.join(ROOT, "sitemap.xml"))
    locs = [e.text for e in tree.getroot().iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    assert len(locs) == len(set(locs)), "duplicate URLs in sitemap"
    assert len(locs) <= 50000, "too many URLs"

    # 3) robots.txt
    r = ["User-agent: *", "Allow: /", "Disallow: /templates/", "Disallow: /tools/", ""]
    if origin_ok:
        r.append("Sitemap: %s/sitemap.xml" % origin)
    else:
        r.append("# Sitemap line is added by tools/build_seo.py once siteOrigin is set in js/site-config.js")
    write("robots.txt", "\n".join(r) + "\n")

    # report
    print("Origin:            %s" % (origin if origin_ok else "(not set)"))
    print("GA4 ID:            %s" % (ga if re.match(r"^G-[A-Z0-9]{6,14}$", ga) else "(not set - analytics disabled)"))
    print("Search Console:    %s" % ("meta tag written" if token_ok else "(no token - no meta tag)"))
    print("Public pages (%d):" % len(pages))
    for rel in pages:
        print("  " + url_path(rel))
    print("Sitemap URLs written: %d" % len(locs))
    if origin_ok:
        print("Submit this in Search Console: %s/sitemap.xml" % origin)
    for w in warnings:
        print("WARNING: " + w)
    return 0


if __name__ == "__main__":
    sys.exit(main())
