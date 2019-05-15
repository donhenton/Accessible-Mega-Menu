
const   stdDefaults = {
  uuidPrefix: "megamenu", // unique ID's are required to indicate aria-owns, aria-controls and aria-labelledby
  menuClass: "accessible-megamenu", // default css class used to define the megamenu styling, on the ul of the menu
  topNavItemClass: "accessible-megamenu-top-nav-item", // default css class for a top-level navigation item in the megamenu
  panelClass: "accessible-megamenu-panel", // default css class for a megamenu panel
  panelGroupClass: "accessible-megamenu-panel-group", // default css class for a group of items within a megamenu panel
  hoverClass: "hover", // default css class for the hover state
  focusClass: "focus", // default css class for the focus state
  openClass: "open", // default css class for the open state,
  allowMainLinkNav: false, // if true top nav click will navigate to location, false will only open dropdown
 // openDelay: 0, // default open delay when opening menu via mouseover
 // closeDelay: 250, // default open delay when opening menu via mouseover
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
    this.menu.addEventListener('keydown', this.menuKeyDown.bind(this));
    document.body.addEventListener('click', this.bodyClick.bind(this));
    document.body.addEventListener('keydown', this.bodyKeyDown.bind(this));
    if (this.defaults.openOnMouseover) {
      this.menu.classList.add(this.defaults.hoverClass);
      this.menu.addEventListener('mouseover', this.menuMouseOver.bind(this));
    }
    this.selectedMenuId;//used only for keyboard navigation
    this.lastMenuId;
    this.inMenu = false;
    this.isClick = false;
    if (!Array.from(menu.classList).includes(this.defaults.menuClass)) {

      throw new Error("must submit the ul with the css class of defaults.menuClass")
    }
    let me = this;
    this.subPanels = [];
    Array.from(this.menu.querySelectorAll("." + this.defaults.topNavItemClass))
          .forEach(topNav => {
            me.subPanels.push(new MegaSubPanel(topNav, me))
          });
    this.lastMenuId = this.subPanels[this.subPanels.length - 1].uuid;
    this.subPanels[this.subPanels.length - 1].setAsLast(true);
    this.skipLink = document.querySelector('#skipLink');
    this.skipLink.addEventListener('focus', this.skipFocus.bind(this));
    this.skipLink.addEventListener('click', this.skipClick.bind(this));
    this.skipLink.addEventListener('keydown', this.skipKeyDown.bind(this));
    this.skipTargetSelector = this.skipLink.getAttribute('data-skip-target-selector');
    

  }
  
  skipKeyDown(ev) {
     let tgt = document.querySelector(this.skipTargetSelector);
     if (ev.keyCode === Keyboard.SPACE || 
           ev.keyCode === Keyboard.ENTER) {
       tgt.focus();
     }
    
  }
  
  
  skipClick(ev) {
    let tgt = document.querySelector(this.skipTargetSelector);
    tgt.focus();
    
  }
  
  
  skipFocus(ev) {
    if (this.selectedMenuId) {
       this.resetPanels();
     }
  }
  
  
  menuMouseOver(ev) {
     if (this.selectedMenuId) {
       this.resetPanels();
     }
    
  }
  
  bodyClick(ev) {
   // console.log("body click")
    this.resetPanels();
    this.inMenu = false;
    this.selectedMenuId = null;
    this.isClick = true;

  }
  bodyKeyDown(ev) {
  //  console.log("keydown body")
    this.isClick = false;
  }
  resetPanels() {
    this.inMenu = false;
    this.selectedMenuId = null;
    this.subPanels.forEach(p => {

      p.displayMenu(false);

    })

  }
  menuKeyDown(ev) {
    if (ev.keyCode === Keyboard.ESCAPE) {
      this.resetPanels();
      ev.stopPropagation();
    }
  }
  updateMenuPanels(newSelectedId) {
    this.subPanels.forEach(p => {
      if (p.panelUUID === newSelectedId) {
        p.displayMenu(true);

      } else {
        p.displayMenu(false);
      }
    })
    if (!this.selectedMenuId && newSelectedId) {
      this.inMenu = true;
    //  console.log("entering the menu");
    }
    this.selectedMenuId = newSelectedId;

  }
}

class MegaSubPanel {
  constructor(topNav, menuParent) {
    this.openOnMouseover = menuParent.defaults.openOnMouseover;
    this.topNav = topNav;
    this.menuParent = menuParent;
    if (menuParent.defaults.openOnMouseover) {
      this.topNav.classList.add(menuParent.defaults.hoverClass);
    }
    this.panelLink = topNav.querySelector('a');
    this.panel = topNav.querySelector("." + menuParent.defaults.panelClass);
    this.panelLink.addEventListener('focus', this.linkFocus.bind(this));
    this.panelLink.addEventListener('blur', this.linkBlur.bind(this));
    this.panelLink.addEventListener('click', this.linkClick.bind(this));
    this.panelLink.addEventListener('keydown', this.linkKeyDown.bind(this));
    
    this.panelUUID = this.uuidv4();
    this.linkUUID = this.uuidv4();
    this.isSelected = false;
    let linkBlock = this.panelLink.getBoundingClientRect();
    this.panel.style.left = (linkBlock.left + linkBlock.width / 2) + "px";
    this.panel.style.top = (linkBlock.top + linkBlock.height * .8) + "px";
    //link has id, role=button, aria-controls --> panel UUID, aria-expanded tab-index

    this.panelLink.setAttribute('role', 'button');
    this.panelLink.setAttribute('id', this.linkUUID);
    this.panelLink.setAttribute('aria-controls', this.panelUUID);
    this.panelLink.setAttribute('aria-owns', this.panelUUID);
    this.panelLink.setAttribute('aria-expanded', 'false');
    this.panelLink.setAttribute('tab-index', '0');

    this.panel.setAttribute('role', 'region');
    this.panel.setAttribute('id', this.panelUUID);
    this.panel.setAttribute('aria-hidden', 'true');
    this.panel.setAttribute('aria-expanded', 'false');
    this.panel.setAttribute('aria-labelledby', this.linkUUID);
    this.panel.setAttribute('tab-index', '0');
    // this.panel.addEventListener('focusout', this.panelOut.bind(this));
    this.panel.addEventListener('keydown', this.panelKeyDown.bind(this));
    this.tabCollection = new Tabbable(this.panel, {includeHidden: true});
    this.isLast = false;

    //panel id, role=region aria-expanded aria-hidden aria-labelledby --> back to link

  }
  setAsLast(b) {
    this.isLast = b;
  }
  panelKeyDown(ev) {
   // console.log(`panel Out ${ev.keyCode}`)
    // console.log(ev)
    let me = this;
    if (ev.keyCode === Keyboard.ESCAPE) {
      me.menuParent.resetPanels();
      return;
    }


    if (this.isLast === true) {
      this.tabCollection.tabbableNodes.forEach((tNode, idx) => {
        let isTheSame = tNode.isEqualNode(ev.srcElement);
        //  console.log(`${idx} ${isTheSame} src ${ev.srcElement} tabNode ${tNode} `)
        //you are on the last menu
        //and just tabbed off the last tabbable item onto the main page
        //assuming you are moving off with the tab key
        //skip below if the key press is SHIFT TAB

        if (idx === me.tabCollection.tabbableNodes.length - 1 &&
              isTheSame === true && ev.keyCode === Keyboard.TAB
              && ev.shiftKey === false) {
          me.menuParent.resetPanels();
        }

      })
    }
    // console.log(`panel focus out isLast ${this.isLast} src ${ ev.srcElement}`);
    // console.log(ev)
  }
  displayMenu(show) {
   // let status = 'none';
    if (show) {
      status = 'block';
      this.panel.setAttribute('aria-hidden', 'false');
      this.panel.setAttribute('aria-expanded', 'true');
      this.panelLink.setAttribute('aria-expanded', 'true');
      this.panelLink.classList.add(this.menuParent.defaults.focusClass);
      this.panel.classList.add(this.menuParent.defaults.openClass);
    } else {
      this.panel.setAttribute('aria-hidden', 'true');
      this.panel.setAttribute('aria-expanded', 'false');
      this.panelLink.setAttribute('aria-expanded', 'false');
      this.panelLink.classList.remove(this.menuParent.defaults.focusClass);
      this.panel.classList.remove(this.menuParent.defaults.openClass);
    }
    //if (!this.menuParent.defaults.openOnMouseover) {
    ///   this.panel.style.display = status;
   /// }
   

  }
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  linkBlur(ev) {
    // console.log("link blur")
    this.isSelected = false;
   
  }
  linkMouseOver(ev) {
   // console.log('link hover')
    this.menuParent.updateMenuPanels(this.panelUUID);
  }
  
  linkKeyDown(ev) {
    //console.log(`link keydown ${ev.keyCode}`)
  }
  linkFocus(ev) {

    let me = this;
    window.setTimeout(() => {
     // console.log("focus " + this.panelUUID);
      if (me.menuParent.isClick === true
            && this.menuParent.defaults.allowMainLinkNav) {
        return;
      }
      me.isSelected = true;
      me.menuParent.updateMenuPanels(this.panelUUID);
    }, 50)

  }
  linkClick(ev) {
  //  console.log("click " + this.panelUUID);
    if (!this.menuParent.defaults.allowMainLinkNav) {
      ev.preventDefault();
      ev.stopPropagation();

    }




  }
}


