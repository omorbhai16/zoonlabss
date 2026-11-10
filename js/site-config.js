/* Zoon Labss — central site settings. This is the ONLY file you edit to connect Google services.
   Loaded on every page (and by the article template), so articles never need tracking code pasted in.
   All three values are PUBLIC by nature (they are visible in page source). Never put a secret/private
   API key here; a service that needs one must run on a backend with a server-side environment variable.

   1) siteOrigin           Your real domain once you own it, written like  https://www.yourdomain.com
                           (https, no trailing slash). Used by tools/build_seo.py for canonical URLs,
                           sitemap.xml and robots.txt. Leave "" until you have a domain.
   2) ga4MeasurementId     Google Analytics 4 Measurement ID (looks like G- followed by letters/numbers),
                           from GA4 > Admin > Data streams > your web stream. Leave "" to disable
                           analytics; nothing from Google is loaded while it is blank or invalid.
   3) searchConsoleToken   The content="..." value of the HTML-tag verification meta tag from Google Search
                           Console (only the long code, not the whole tag). Leave "" until you have it.
                           After editing, run:  python3 tools/build_seo.py
*/
window.ZL_CONFIG = {
  siteOrigin: "https://zoonlabss.com",
  ga4MeasurementId: "G-SK2SNBM73P",
  searchConsoleToken: "",
};
