window.megaMenus = [];
document.addEventListener("DOMContentLoaded", () => {

  let defs = {openOnMouseover:true,allowMainLinkNav:true};
  let demoMenu = document.querySelector('.nav-demo > ul');
  window.megaMenus.push(new MegaMenu(demoMenu, defs))

});