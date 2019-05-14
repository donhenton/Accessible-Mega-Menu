window.megaMenus = [];
document.addEventListener("DOMContentLoaded", () => {

  let defs = {};
  let demoMenu = document.querySelector('.nav-demo > ul');
  window.megaMenus.push(new MegaMenu(demoMenu, defs))

});