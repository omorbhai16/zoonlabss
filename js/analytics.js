/* Zoon Labss — Google Analytics 4 loader. Reads the Measurement ID from js/site-config.js.
   - Does nothing (loads nothing from Google) when the ID is blank or not in the G-XXXXXXXX format.
   - Multi-page site: each page load sends exactly one page_view (gtag "config" default). No manual
     page_view is sent, and a guard stops a second load of this script from adding a duplicate.
   - Consent Mode: analytics storage starts "denied" and becomes "granted" only after the visitor
     chooses "Accept all" in the cookie notice (or already did on an earlier visit). */
(function () {
  "use strict";
  var cfg = window.ZL_CONFIG || {};
  var id = typeof cfg.ga4MeasurementId === "string" ? cfg.ga4MeasurementId.trim() : "";
  if (!/^G-[A-Z0-9]{6,14}$/.test(id)) return;
  if (window.__zlGa4Loaded) return;
  window.__zlGa4Loaded = id;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  var consent = window.ZLConsent && window.ZLConsent.get();
  gtag("consent", "default", {
    analytics_storage: consent === "all" ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  gtag("js", new Date());
  gtag("config", id); // sends the single automatic page_view for this page load

  document.addEventListener("zl:cookie-consent", function (e) {
    gtag("consent", "update", {
      analytics_storage: e.detail === "all" ? "granted" : "denied",
    });
  });

  var src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  if (!document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]')) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }
})();
