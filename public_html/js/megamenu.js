


const   stdDefaults = {
  uuidPrefix: "megamenu", // unique ID's are required to indicate aria-owns, aria-controls and aria-labelledby
  menuClass: "accessible-megamenu", // default css class used to define the megamenu styling, on the ul of the menu
  topNavItemClass: "accessible-megamenu-top-nav-item", // default css class for a top-level navigation item in the megamenu
  panelClass: "accessible-megamenu-panel", // default css class for a megamenu panel
  panelGroupClass: "accessible-megamenu-panel-group", // default css class for a group of items within a megamenu panel
  hoverClass: "hover", // default css class for the hover state
  focusClass: "focus", // default css class for the focus state
  openClass: "open", // default css class for the open state,
  toggleButtonClass: "accessible-megamenu-toggle", // default css class responsive toggle button
  openDelay: 0, // default open delay when opening menu via mouseover
  closeDelay: 250, // default open delay when opening menu via mouseover
  openOnMouseover: false // default setting for whether menu should open on mouseover
};
const   Keyboard = {
  BACKSPACE: 8,
  COMMA: 188,
  DELETE: 46,
  DOWN: 40,
  END: 35,
  ENTER: 13,
  ESCAPE: 27,
  HOME: 36,
  LEFT: 37,
  PAGE_DOWN: 34,
  PAGE_UP: 33,
  PERIOD: 190,
  RIGHT: 39,
  SPACE: 32,
  TAB: 9,
  UP: 38,
  keyMap: {
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    59: ";",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    96: "0",
    97: "1",
    98: "2",
    99: "3",
    100: "4",
    101: "5",
    102: "6",
    103: "7",
    104: "8",
    105: "9",
    190: "."
  }
};




class MegaMenu {
  constructor(menu, defs) {

    this.defaults = {...stdDefaults, ...defs};
    this.menu = menu;
    this.selectedMenuId;
    if (!Array.from(menu.classList).includes(this.defaults.menuClass)) {

      throw new Error("must submit the ul with the css class of defaults.menuClass")
    }
    let me = this;
    this.subPanels = [];
    Array.from(this.menu.querySelectorAll("." + this.defaults.topNavItemClass))
          .forEach(topNav => {
            me.subPanels.push(new MegaSubPanel(topNav, me))
          })


  }
  updateMenuPanels(newSelectedId) {
    this.subPanels.forEach(p => {
      if (p.uuid === newSelectedId) {
        p.displayMenu(true);

      } else {
        p.displayMenu(false);
      }
    })
    this.selectedMenuId = newSelectedId;
  }
}

class MegaSubPanel {
  constructor(topNav, menuParent) {
    this.topNav = topNav;
    this.menuParent = menuParent;
    this.panelLink = topNav.querySelector('a');
    this.panel = topNav.querySelector("." + menuParent.defaults.panelClass);
    this.panelLink.addEventListener('focus', this.linkFocus.bind(this));
    this.panelLink.addEventListener('blur', this.linkBlur.bind(this));
    this.panelLink.addEventListener('click', this.linkClick.bind(this));
    this.uuid = this.uuidv4();
    this.isSelected = false;
    let linkBlock = this.panelLink.getBoundingClientRect();
    console.log(linkBlock)
    this.panel.style.left = (linkBlock.left + linkBlock.width/2)+"px";
    this.panel.style.top = (linkBlock.top + linkBlock.height*.8)+"px";

  }
  displayMenu(show) {
    let status = 'none';
    if (show) {
      status = 'block'
    }
    this.panel.style.display = status;
  }
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  linkBlur(ev) {
    //check to see if you are losing focus and are the last member of the list
    if (this.menuParent.subPanels[this.menuParent.subPanels.length-1].uuid 
          === this.uuid) {
      this.displayMenu(false)
    }

  }
  linkFocus(ev) {
   // console.log("focus " + this.uuid);
    this.isSelected = true;
    this.menuParent.updateMenuPanels(this.uuid);
    // this.panel.style.display = 'block'


  }
  linkClick(ev) {

    ev.preventDefault();
    ev.stopPropagation();
    console.log("click " + this.uuid);

  }
}


