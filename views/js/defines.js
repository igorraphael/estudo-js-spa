'use strict';

var _KEY_CODE_TAB_   = 9,
    _KEY_CODE_ESC_   = 27;
    
////////////////////////////////////////////////////////////////////////////////
// ELEMENT CLASS ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function addClassName(elem, className) {
    var classes = elem.className.split(' ');
    var classesToAdd = className.split(' ');
    
    var added = false;
    for (var i=0; i<classesToAdd.length; i++) {
        if (classes.indexOf(classesToAdd[i]) === -1) {
            classes.push(classesToAdd[i]);
            added = true;
        }
    }
    
    if (added) {
        elem.className = classes.join(' ');
    }
};
function removeClassName(elem, className) {
    var classes = elem.className.split(' ');
    var classesToRemove = className.split(' ');
    
    var removed = false;
    for (var i=0; i<classesToRemove.length; i++) {
        var index = classes.indexOf(classesToRemove[i]);
        if (index !== -1) {
            classes.splice(index, 1);
            removed = true;
        }
    }
    
    if (removed) {
        elem.className = classes.join(' ');
    }
};
function hasClassName(elem, className) {
    return (elem.className.indexOf(className) >= 0);
}

////////////////////////////////////////////////////////////////////////////////
// WINDOW //////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function selectedWindow(context) {
    var elements = document.getElementsByClassName('window');
    for (var i = 0; i < elements.length; i++) {
        removeClassName(elements[i], 'selected-window');
    }
    addClassName(context, 'selected-window');
}
function centerWindow(context, defaultLeft) {
    var left, top;
    
    if (defaultLeft === undefined) {
        left = (windowSizeWidth / 2) - ($(context).width() / 2);
    } else {
        left = defaultLeft;
    }
    top = Math.max(24, (windowSizeHeight / 2) - ($(context).height() / 2));
    
    $(context).css({'left': left + 'px', 'top': top + 'px'});
}
function closeWindow(context) {
    context.style.display = 'none';
}
function focusTabbableWindow(context) {
    var activeElement = document.activeElement,
        isActive = $.contains(context, activeElement);

    if (!isActive) {
        var hasFocus = $(context).find('[autofocus]');
        if (!hasFocus.length) {
            hasFocus = $(context).find(':tabbable');
        }
        hasFocus[0].focus();
    }
}
function assertFocus(evnt) {
    if (evnt.target.tagName !== 'INPUT' && evnt.target.tagName !== 'SELECT' && evnt.target.tagName !== 'TEXTAREA'){
        evnt.preventDefault();
    }
}