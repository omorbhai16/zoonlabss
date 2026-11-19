/* =====================================================================
   Zoon Labss: FOOTER (এই একটি ফাইল থেকেই পুরো ওয়েবসাইটের Footer চলে)
   ---------------------------------------------------------------------
   Footer-এ কিছু বদলাতে চাইলে শুধু নিচের HTML অংশটুকু (backtick ` ` এর ভেতরে) এডিট করুন।
   সেভ করে আপলোড করলেই সব পেজে বদলে যাবে।

   নিয়ম:
   - ভেতরের লিংকের শুরুতে {{root}} লিখুন (যেমন {{root}}faq.html)। বাইরের লিংকে (https://...) এটি লাগবে না।
   - Contact আইকনগুলো <div class="foot-contact"> এর ভেতরে, যা স্ক্রিনের মাঝখানে দেখায়।
   ===================================================================== */
(function () {
  var s = document.currentScript;
  if (!s) return;
  var root = s.src.replace(/components\/[^\/]*$/, "");

  var html = `
<footer class="site-footer">
<div class="wrap">
  <div class="foot-grid">
    <div>
      <a href="{{root}}index.html" aria-label="Zoon Labss home">
        <img class="foot-logo" src="{{root}}assets/logo.png" width="720" height="436" alt="Zoon Labss" loading="lazy">
      </a>
      <p>A technology content platform covering products, AI tools, apps, software, and games.</p>
    </div>
    <div>
      <h2>Categories</h2>
      <ul>
        <li>
          <a href="{{root}}product_gadget.html">Product &amp; Gadget</a>
        </li>
        <li>
          <a href="{{root}}ai_tools.html">AI &amp; Tools</a>
        </li>
        <li>
          <a href="{{root}}app_software.html">Apps &amp; Software</a>
        </li>
        <li>
          <a href="{{root}}games.html">Games</a>
        </li>
        <li>
          <a href="{{root}}blog.html">Blog</a>
        </li>
      </ul>
    </div>
    <div>
      <h2>Company</h2>
      <ul>
        <li>
          <a href="{{root}}about_us.html">About Us</a>
        </li>
        <li>
          <a href="{{root}}contact_us.html">Contact Us</a>
        </li>
        <li>
          <a href="{{root}}advertise_with_us.html">Advertise With Us</a>
        </li>
        <li>
          <a href="{{root}}media_kit.html">Media Kit</a>
        </li>
        <li>
          <a href="{{root}}faq.html">FAQ</a>
        </li>
        <li>
          <a href="{{root}}site_map.html">Site Map</a>
        </li>
      </ul>
    </div>
    <div>
      <h2>Policies</h2>
      <ul>
        <li>
          <a href="{{root}}privacy_policy.html">Privacy Policy</a>
        </li>
        <li>
          <a href="{{root}}cookie_policy.html">Cookie Policy</a>
        </li>
        <li>
          <a href="{{root}}terms_and_conditions.html">Terms and Conditions</a>
        </li>
        <li>
          <a href="{{root}}disclaimer.html">Disclaimer</a>
        </li>
        <li>
          <a href="{{root}}editorial_policy.html">Editorial Policy</a>
        </li>
        <li>
          <a href="{{root}}corrections_policy.html">Corrections Policy</a>
        </li>
        <li>
          <a href="{{root}}accessibility.html">Accessibility</a>
        </li>
        <li>
          <a href="{{root}}feedback.html">Report an Issue or Request a Topic</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="foot-contact">
    <h2>Contact</h2>
    <div class="social">
        <a href="mailto:contactwithzoonlabss@gmail.com" aria-label="Email Zoon Labss at contactwithzoonlabss@gmail.com">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.5 2.2v.3L12 13l7.5-5.5v-.3l-.7-.7L12 11 5.2 6.5z"/></svg>
        </a>
        <a href="https://t.me/zoonlabss" target="_blank" rel="noopener noreferrer" aria-label="Zoon Labss on Telegram (opens in a new tab)">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21.9 4.3 2.6 11.7c-1.3.5-1.3 1.3-.2 1.6l4.9 1.5 1.9 5.8c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.2-15.1c.3-1.3-.5-1.9-1.6-1.4z"/></svg>
        </a>
        <a href="https://youtube.com/@zoonlabss?si=pr5MuLVcIYLgznW1" target="_blank" rel="noopener noreferrer" aria-label="Zoon Labss on YouTube (opens in a new tab)">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2C.5 9.1.5 12 .5 12s0 2.9.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8zM9.8 15.1V8.9l5.4 3.1z"/></svg>
        </a>
        <a href="https://www.facebook.com/zoonlabss" target="_blank" rel="noopener noreferrer" aria-label="Zoon Labss on Facebook (opens in a new tab)">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>
        </a>
        <a href="https://www.linkedin.com/company/zoonlabss/" target="_blank" rel="noopener noreferrer" aria-label="Zoon Labss on LinkedIn (opens in a new tab)">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <a href="https://x.com/zoonlabss" target="_blank" rel="noopener noreferrer" aria-label="Zoon Labss on X (opens in a new tab)">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
        </a>
      </div>
  </div>
  <p class="copy">&copy; <span id="year">2026</span> Zoon Labss. All rights reserved.</p>
</div>
</footer>
`;

  s.insertAdjacentHTML("beforebegin", html.replace(/\{\{root\}\}/g, root));
})();
