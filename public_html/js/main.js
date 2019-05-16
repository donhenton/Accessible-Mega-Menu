window.megaMenus = [];
document.addEventListener("DOMContentLoaded", () => {

  let defs = {openOnMouseover:true ,allowMainLinkNav:true};
  let demoMenu = document.querySelector('.nav-demo > ul');
  let menu = new MegaMenu(demoMenu, defs);
  window.megaMenus.push(menu);
  

});