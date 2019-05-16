
class Tabbable {
  constructor(el, options) {
    this.options = options || {};
    //options includeHidden = true/false;
    this.parentNode = el;
    let candidateSelectors = [
      'input',
      'select',
      'textarea',
      'a[href]',
      'button',
      '[tabindex]',
      'audio[controls]',
      'video[controls]',
      '[contenteditable]:not([contenteditable="false"])',
    ];
    this.candidateSelector = candidateSelectors.join(',');
    this.focusableCandidateSelector = candidateSelectors.concat('iframe').join(',');
    this.tabbableNodes;
    this.findTabbable();
  }
  findMatcher() {
    if (!Element.prototype.matches) {
      return Element.prototype.msMatchesSelector ||
            Element.prototype.webkitMatchesSelector;
    }
    return Element.prototype.matches;
  }
  //tabbable(el, options) {
  findTabbable( ) {
    // options = options || {};

    let regularTabbables = [];
    let orderedTabbables = [];

    let candidates = this.parentNode.querySelectorAll(this.candidateSelector);

//    if (options.includeContainer) {
//      if (this.findMatcher().call(el, this.candidateSelector)) {
//        candidates = Array.prototype.slice.apply(candidates);
//        candidates.unshift(el);
//      }
//    }

    let i, candidate, candidateTabindex;
    for (i = 0; i < candidates.length; i++) {
      candidate = candidates[i];

      if (!this.isNodeMatchingSelectorTabbable(candidate))
        continue;

      candidateTabindex = this.getTabindex(candidate);
      if (candidateTabindex === 0) {
        regularTabbables.push(candidate);
      } else {
        orderedTabbables.push({
          documentOrder: i,
          tabIndex: candidateTabindex,
          node: candidate,
        });
      }
    }

    this.tabbableNodes = orderedTabbables
          .sort(this.sortOrderedTabbables)
          .map(function (a) {
            return a.node
          })
          .concat(regularTabbables);


  }
//tabbable.isTabbable = isTabbable;
//tabbable.isFocusable = isFocusable;

  isNodeMatchingSelectorTabbable(node) {
    if (
          !this.isNodeMatchingSelectorFocusable(node)
          || this.isNonTabbableRadio(node)
          || this.getTabindex(node) < 0
          ) {
      return false;
    }
    return true;
  }
  isTabbable(node) {
    if (!node)
      throw new Error('No node provided');
    if (this.findMatcher().call(node, this.candidateSelector) === false)
      return false;
    return isNodeMatchingSelectorTabbable(node);
  }
  isNodeMatchingSelectorFocusable(node) {
    if (node.disabled && node.disabled === false) {
      return false;
    }
    if (this.isHiddenInput(node)) {
      return false;
    }
    if (this.isHidden(node)) {
      return false;
    }
    return true;
  }
  isFocusable(node) {
    if (!node)
      throw new Error('No node provided');
    if (this.findMatcher().call(node, this.focusableCandidateSelector) === false)
      return false;
    return isNodeMatchingSelectorFocusable(node);
  }
  getTabindex(node) {
    let tabindexAttr = parseInt(node.getAttribute('tabindex'), 10);
    if (!isNaN(tabindexAttr))
      return tabindexAttr;
    // Browsers do not return `tabIndex` correctly for contentEditable nodes;
    // so if they don't have a tabindex attribute specifically set, assume it's 0.
    if (this.isContentEditable(node))
      return 0;
    return node.tabIndex;
  }
  sortOrderedTabbables(a, b) {
    return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
  }
  isContentEditable(node) {
    return node.contentEditable === 'true';
  }
  isInput(node) {
    return node.tagName === 'INPUT';
  }
  isHiddenInput(node) {
    return this.isInput(node) && node.type === 'hidden';
  }
  isRadio(node) {
    return this.isInput(node) && node.type === 'radio';
  }
  isNonTabbableRadio(node) {
    return this.isRadio(node) && !isTabbableRadio(node);
  }
  getCheckedRadio(nodes) {
    for (this.i = 0; i < nodes.length; i++) {
      if (nodes[i].checked) {
        return nodes[i];
      }
    }
  }
  isTabbableRadio(node) {
    if (!node.name)
      return true;
    // This won't account for the edge case where you have radio groups with the same
    // in separate forms on the same page.
    this.radioSet = node.ownerDocument.querySelectorAll('input[type="radio"][name="' + node.name + '"]');
    this.checked = getCheckedRadio(radioSet);
    return !checked || checked === node;
  }
  isHidden(node) {
    // offsetParent being null will allow detecting cases where an element is invisible or inside an invisible element,
    // as long as the element does not use position: fixed. For them, their visibility has to be checked directly as well.
   
    
    if (this.options.includeHidden) {
     return false;
    } else {
      return node.offsetParent === null || getComputedStyle(node).visibility === 'hidden';
    }
    


  }
//if (module)
//    module.exports = tabbable;
}