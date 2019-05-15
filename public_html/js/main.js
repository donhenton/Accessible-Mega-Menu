window.megaMenus = [];
document.addEventListener("DOMContentLoaded", () => {

  let defs = {openOnMouseover:false,allowMainLinkNav:false};
  let demoMenu = document.querySelector('.nav-demo > ul');
  window.megaMenus.push(new MegaMenu(demoMenu, defs))

});