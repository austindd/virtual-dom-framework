

eventTypes = [
    "click",
    "dblclick",
    "mousedown",
    "mouseup",
    "mouseover",
    "mousemove",
    "mouseout",
    "dragstart",
    "drag",
    "dragenter",
    "dragleave",
    "dragover",
    "drop",
    "dragend",
    "keydown",
    "keypress",
    "keyup",
    "load",
    "unload",
    "abort",
    "error",
    "resize",
    "scroll",
    "select",
    "change",
    "submit",
    "reset",
    "focus",
    "blur",
    "focusin",
    "focusout",
    "DOMActivate",
    // "DOMSubtreeModified",
    // "DOMNodeInserted",
    // "DOMNodeRemoved",
    // "DOMNodeRemovedFromDocument",
    // "DOMNodeInsertedIntoDocument",
    // "DOMAttrModified",
    // "DOMCharacterDataModified",
    "loadstart",
    "progress",
    "error",
    "abort",
    "load",
    "loadend",
    "touchstart",
    "touchend",
    "touchmove",
    "touchenter",
    "touchleave",
    "touchcancel",
    "pointerdown",
    "pointerup",
    "pointercancel",
    "pointermove",
    "pointerover",
    "pointerout",
    "pointerenter",
    "pointerleave",
    "gotpointercapture",
    "lostpointercapture",
]

const EventHub = {
    eventTypes: eventTypes,
    listeners: {
        elements: [], // <--- elements array is primary index
        data: [], // all oth
    },
    getCallbacks: function ($element) {
        
    },
    getElementsByEventType: function (eventType) {

    },
    getListenerData: function ($element) {

    },
    setListenerData: function ($element, callback) {

    },
    executeCallbacks: function (eventType) {

    }
}

EventHub.registerListener = function (eData = {
    $target: undefined, 
    eventType: undefined, 
    callback: undefined, 
    options: { 
        preventDefault: false, 
        useCapture: false, 
        stopPropogation: false 
    }
}) {
    document.getElementsByClassName('u-borderBox u-backgroundWhite u-marginAuto u-xs-marginHorizontal10 u-paddingLeft20 u-paddingRight100 u-xs-paddingVertical15 u-xs-paddingHorizontal10 u-paddingVertical25 u-maxWidth1040 u-sm-maxWidth740 u-backgroundWhite u-borderLightest u-boxShadow2px10pxBlackLighter u-borderRadius4');


}


const eventMaster = function (event) {

}

EventHub.TopLevelNode = window.document;

EventHub.eventTypes.forEach((eType) => {
    try {
        EventHub.TopLevelNode.addEventListener(eType, eventMaster);
    } catch (err) {
        console.log(err);
    }
});

module.exports = {
    EventHub: EventHub
};
