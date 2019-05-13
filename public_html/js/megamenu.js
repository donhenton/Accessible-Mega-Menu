(() => {
 
  const   stdDefaults = {
    uuidPrefix: "megamenu", // unique ID's are required to indicate aria-owns, aria-controls and aria-labelledby
    menuClass: "accessible-megamenu", // default css class used to define the megamenu styling
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
  constructor(defs) {
    
    this.defaults = {...stdDefaults, ...defs};
    
    
  }
}


})();
