/* =====================================================================
   Zoon Labss: NAVBAR (এই একটি ফাইল থেকেই পুরো ওয়েবসাইটের Navbar চলে)
   ---------------------------------------------------------------------
   Navbar-এ কিছু বদলাতে চাইলে শুধু নিচের HTML অংশটুকু (backtick ` ` এর ভেতরে) এডিট করুন।
   সেভ করে আপলোড করলেই সব পেজে (হোম, আর্টিকেল, আর্কাইভ, 404 সহ) বদলে যাবে।

   নিয়ম:
   - লিংকের শুরুতে {{root}} লিখুন (যেমন {{root}}about_us.html)। এটি নিজে নিজে সঠিক ফোল্ডার পথ বসিয়ে নেয়।
   - নতুন মেনু আইটেম যোগ করতে একটি <li><a href="{{root}}নাম.html">লেখা</a></li> কপি করে বসান।
   - বর্তমান পেজের মেনু হাইলাইট (aria-current) নিজে নিজে হয়, হাতে লিখতে হবে না।
   ===================================================================== */
(function () {
  var s = document.currentScript;
  if (!s) return;
  var root = s.src.replace(/components\/[^\/]*$/, "");

  var html = `
<header class="site-header">
<div class="wrap header-row">
  <a class="brand" href="{{root}}index.html" aria-label="Zoon Labss home">
    <img class="brand-logo" src="{{root}}assets/logo.png" width="720" height="436" alt="Zoon Labss">
  </a>
  <button class="menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav class="nav" id="site-nav" aria-label="Main navigation">
    <ul class="nav-list">
      <li>
        <a href="{{root}}index.html">Home</a>
      </li>
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
      <li>
        <a href="{{root}}about_us.html">About Us</a>
      </li>
      <li>
        <a href="{{root}}contact_us.html">Contact Us</a>
      </li>
    </ul>
  </nav>
</div>
</header>
`;

  s.insertAdjacentHTML("beforebegin", html.replace(/\{\{root\}\}/g, root));

  /* বর্তমান পেজ চিহ্নিত করা: মূল পেজে aria-current="page", আর্টিকেলে তার ক্যাটাগরিতে aria-current="true" */
  var rel = location.href.split(/[?#]/)[0];
  rel = rel.indexOf(root) === 0 ? rel.slice(root.length) : "";
  if (rel === "" || /\/$/.test(rel)) rel += "index.html";
  var parts = rel.split("/");
  var target = rel, mode = "page";
  if (parts.length > 2 && parts[1] === "articles") {
    target = parts[0] + ".html";
    mode = "true";
  }
  var links = document.querySelectorAll("#site-nav a");
  for (var i = 0; i < links.length; i++) {
    var h = links[i].getAttribute("href") || "";
    if (h.slice(root.length) === target) links[i].setAttribute("aria-current", mode);
  }
})();
