
const   stdDefaults = {
  menuClass: "accessible-megamenu", // default css class used to define the megamenu styling, on the ul of the menu
  topNavItemClass: "accessible-megamenu-top-nav-item", // default css class for a top-level navigation item in the megamenu
  panelClass: "accessible-megamenu-panel", // default css class for a megamenu panel
  panelGroupClass: "accessible-megamenu-panel-group", // default css class for a group of items within a megamenu panel
  hoverClass: "hover", // default css class for the hover state
  focusClass: "focus", // default css class for the focus state
  openClass: "open", // default css class for the open state,
  allowMainLinkNav: false, // if true top nav click will navigate to location, false will only open dropdown
  contentStart: "#skip-to-content", //css selector that represents the start of content, ie where to go when the menu exits by tab
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
    this.selectedMenuIdx;//used only for keyboard navigation
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
    if (this.skipLink) {

      this.skipLink.addEventListener('focus', this.skipFocus.bind(this));
      this.skipLink.addEventListener('click', this.skipClick.bind(this));
      this.skipLink.addEventListener('keydown', this.skipKeyDown.bind(this));
      this.skipTargetSelector = this.skipLink.getAttribute('data-skip-target-selector');
    }

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
    if (this.selectedMenuIdx) {
      this.resetPanels();
    }
  }
  menuMouseOver(ev) {
    if (this.selectedMenuIdx) {
      this.resetPanels();
    }

  }
  bodyClick(ev) {
    // console.log("body click")
    this.resetPanels();
    this.inMenu = false;
    this.selectedMenuIdx = null;
    this.isClick = true;

  }
  bodyKeyDown(ev) {
    //  console.log("keydown body")
    this.isClick = false;
  }
  resetPanels() {
    this.inMenu = false;
    this.selectedMenuIdx = null;
    this.subPanels.forEach(p => {

      p.displayMenu(false);

    })

  }
  menuKeyDown(ev) {

    // if (ev.keyCode === Keyboard.ESCAPE) {
    //   this.resetPanels();
    //ev.stopPropagation();
    // }

    switch (ev.keyCode) {

      case Keyboard.ESCAPE:
        this.resetPanels();
        ev.stopPropagation();
        break;

      case Keyboard.RIGHT:
        this.advanceMenu(1);
        break;

      case Keyboard.LEFT:
        this.advanceMenu(-1);
        break;


    }




  }
  advanceMenu(amt) {
    let newIdx = (this.selectedMenuIdx + amt) % this.subPanels.length;
    //  console.log(`newIdx ${newIdx}`)
    if (newIdx < 0) {
      newIdx = this.subPanels.length - 1;
    }
    if (!newIdx !== this.selectedMenuIdx) {
      this.selectedMenuIdx = newIdx;
      this.updateMenuPanels(this.subPanels[newIdx].panelUUID);

    }

  }
  updateMenuPanels(newSelectedId) {
    this.subPanels.forEach((p, idx) => {
      //  console.log(`idx ${idx} `)
      if (p.panelUUID === newSelectedId) {
        this.selectedMenuIdx = idx;
        p.displayMenu(true);

      } else {
        p.displayMenu(false);
      }
    })
    if (!this.selectedMenuIdx && newSelectedId) {
      this.inMenu = true;

    }


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
    this.endTab;
    this.isLast = false;

    //panel id, role=region aria-expanded aria-hidden aria-labelledby --> back to link

  }
  setAsLast(b) {
    let me = this;
    this.isLast = b;
    this.endTab = document.createElement('div');
    this.endTab.setAttribute('tabindex', 0);
    this.endTab.classList.add('end-marker');
    this.panel.insertAdjacentElement('beforeEnd', this.endTab);
    ;
    this.endTab.addEventListener('focus', (ev) => {
      me.menuParent.resetPanels();
      let start = document.querySelector(me.menuParent.defaults.contentStart);
      if (start) {
        start.focus();
      }

    });
  }
  panelKeyDown(ev) {
    // console.log(`panel Out ${ev.keyCode}`)
    // console.log(ev)
    let me = this;
    if (ev.keyCode === Keyboard.ESCAPE) {
      me.menuParent.resetPanels();
      return;
    }

  }
  displayMenu(show) {
    // let status = 'none';
    if (show) {
      status = 'block';
      this.panel.setAttribute('aria-hidden', 'false');
      this.panel.setAttribute('aria-expanded', 'true');
      this.panelLink.setAttribute('aria-expanded', 'true');
      this.panelLink.focus();
      this.panelLink.classList.add(this.menuParent.defaults.focusClass);
      this.panel.classList.add(this.menuParent.defaults.openClass);
    } else {
      this.panel.setAttribute('aria-hidden', 'true');
      this.panel.setAttribute('aria-expanded', 'false');
      this.panelLink.setAttribute('aria-expanded', 'false');
      this.panelLink.classList.remove(this.menuParent.defaults.focusClass);
      this.panel.classList.remove(this.menuParent.defaults.openClass);
    }

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
    if (this.menuParent.defaults.allowMainLinkNav) {

      window.setTimeout(() => {
        // console.log("focus " + this.panelUUID);
        if (me.menuParent.isClick === true) {
          return;
        }
        me.isSelected = true;
        me.menuParent.updateMenuPanels(this.panelUUID);
      }, 50)

    }
    me.isSelected = true;
    me.menuParent.updateMenuPanels(this.panelUUID);


  }
  linkClick(ev) {
    //  console.log("click " + this.panelUUID);
    if (!this.menuParent.defaults.allowMainLinkNav) {
      ev.preventDefault();
      ev.stopPropagation();

    }




  }
}


