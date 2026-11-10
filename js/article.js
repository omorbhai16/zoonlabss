/* Article page script. Menu/footer year come from script.js (load that first).
   Fills the "Related articles" block from the category JSON using safe DOM methods. */
(function () {
  "use strict";
  var ZL = window.ZL,
    box = document.getElementById("related-grid");
  if (!ZL || !box) return;
  var key = box.dataset.category;
  if (!ZL.CATS[key]) return;
  var here = location.pathname;
  ZL.loadCategory(key)
    .then(function (items) {
      var rel = items
        .filter(function (i) {
          return here.slice(-i.article.length) !== i.article;
        })
        .slice(0, 2);
      if (!rel.length) {
        box.closest("section").hidden = true;
        return;
      }
      ZL.renderList(box, rel, "", 0);
    })
    .catch(function (e) {
      console.warn(e);
      box.closest("section").hidden = true;
    });
})();
