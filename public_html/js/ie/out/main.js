"use strict";

window.megaMenus = [];
document.addEventListener("DOMContentLoaded", function () {

  var defs = { openOnMouseover: true, allowMainLinkNav: true };
  var demoMenu = document.querySelector('.nav-demo > ul');
  var menu = new MegaMenu(demoMenu, defs);
  window.megaMenus.push(menu);
});