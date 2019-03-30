// ====== DEFINED FOR TESTING PURPOSES ======
const updateVirtualDOM = function () {
    console.log('updateVirtualDOM()');
    return "updating...";
};
// ====== PLEASE REMOVE FUNCTION ABOVE ======


// =====================================================================================
// =================================  Helper Library  ==================================
// =====================================================================================

function longestArray(array1, ...rest) {
    const _slice = Array.prototype.slice;
    const args = _slice.call(arguments);
    const result = args.reduce((max, arr) => {
        if (arr.length > max.length) {
            return arr;
        } else { return max; }
    });
    return result;
}


// Accepts array with any contents. Finds adjacent elements of type 'string' and concatenates them into single elements.
// Does not modify existing array. Ouputs a new array.
function joinAdjacentStrings(inputArr = []) {
    let resultArr = [];
    let str = "";
    let _inputArr = inputArr.map((x) => { return x; })

    while (_inputArr.length > 0) {
        // debugger;
        const item = _inputArr.shift();
        if (typeof item === 'number') {
            str = str + item;
        } else if (typeof item === 'string') {
            str = str + item;
        } else {
            if (str.length > 0) {
                resultArr.push(str);
                str = "";
            }
            resultArr.push(item);
        }
    }
    if (str.length > 0) {
        resultArr.push(str);

    }
    return resultArr;
}
const extendObject = function (targetObj, newObj) {
    // agnostic tool to map object properties onto another object
    let keys = Object.keys(newObj), i = keys.length;
    while (i--) {
        targetObj[keys[i]] = newObj[keys[i]];
    };
    return targetObj;
}

const createClass = function (SuperClass, ClassConstructor, protoMethods, staticMethods, options = { bindMethods: [] }) {
    ClassConstructor.prototype = Object.create(SuperClass.prototype);
    ClassConstructor.prototype.constructor = ClassConstructor;
    if (protoMethods) { extendObject(ClassConstructor.prototype, protoMethods); }
    if (staticMethods) { extendObject(ClassConstructor, staticMethods); }
    if (options.bindMethods.length > 0) {
        options.bindMethods.forEach(function (method) {
            ClassConstructor[method] = protoMethods[method].bind(ClassConstructor);
        });
    }
    ClassConstructor.extend = function (ClassConstructor, protoMethods, staticMethods, options = { bindMethods: [] }) {
        return createClass(this, ClassConstructor, protoMethods, staticMethods, options);
    };
    return ClassConstructor;
}


// =====================================================================================
// ===============================  End Helper Library  ================================
// =====================================================================================


/* _customTypes is a global object with properties defined as specific object references. It is used for
 annotating */

const _customTypes = Object.create({}, {
    _error_not_writable: {
        value: function (p, val) {
            let msg = 'Cannot assign value (' + val + ') to ' + p;
            throw new Error(msg);
        }
    },
    _notDefined: { value: { notDefined: true } },
    _VirtualElement: { value: { virtualElement: true } },
    _VirtualTextNode: { value: { virtualTextNod: true } },
    _Component: { value: { component: true } },
    _ClassComponent: { value: { classComponent: true } },
    _FunctionalComponent: { value: { functionalComponent: true } },
    _MetaComponent: { value: { metaComponent: true } },
    notDefined: {
        get: function () { return this._notDefined; },
        set: function (x) { return this._error_not_writable('_customTypes.notDefined', String(x)); },
        enumerable: true
    },
    VirtualElement: {
        get: function () { return this._VirtualElement; },
        set: function (x) { return this._error_not_writable('_customTypes.VirtualElement', String(x)); },
        enumerable: true
    },
    VirtualTextNode: {
        get: function () { return this._VirtualTextNode; },
        set: function (x) { return this._error_not_writable('_customTypes.VirtualTextNode', String(x)); },
        enumerable: true
    },
    Component: {
        get: function () { return this._Component; },
        set: function (x) { return this._error_not_writable('_customTypes.Component', String(x)); },
        enumerable: true
    },
    ClassComponent: {
        get: function () { return this._ClassComponent; },
        set: function (x) { return this._error_not_writable('_customTypes.ClassComponent', String(x)); },
        enumerable: true
    },
    FunctionalComponent: {
        get: function () { return this._FunctionalComponent; },
        set: function (x) { return this._error_not_writable('_customTypes.FunctionalComponent', String(x)); },
        enumerable: true
    },
    MetaComponent: {
        get: function () { return this._MetaComponent; },
        set: function (x) { return this._error_not_writable('_customTypes.MetaComponent', String(x)); },
        enumerable: true
    },
});





// ============================================================================
const Component = function (props = {}) {
    if (props) {
        Object.keys(props).forEach((propName) => {
            this[propName] = props[propName];
        });
    }
    this.state = {};
}
Component.prototype = {
    constructor: Component,
    __$type$__: _customTypes.ClassComponent,
    render: function () {
        return new Error('render is undefined');
    },
    update: function () {
        updateVirtualDOM();
    },
    setState: function (newState) {
        if (newState) {
            Object.keys(newState).forEach((prop) => {
                Component.state[prop] = newState[prop];
            });
        }
    }
}



const MetaComponent = function (args = {
    archetype: null,
    inheritedProps: null,
    inheritedChildren: null,
    instance: null,
    key: null,
    oldIndex: null,
    newIndex: null,
    componentSubTree: null,
    $nodeRef: null,
    __$type$__: null
}) {
    this.archetype = args.archetype;
    this.inheritedProps = args.inheritedProps;
    this.inheritedChildren = args.inheritedChildren;
    this.instance = args.instance;
    this.key = this.inheritedProps.key ? this.inheritedProps.key : null;
    this.oldIndex = args.oldIndex;
    this.newIndex = args.newIndex;
    this.componentSubTree = args.componentSubTree;
    this.$nodeRef = args.$nodeRef;
    this.metaComponentID = ("" + Math.random()).slice(3);
    this.__$type$__ = args.__$type$__;
    this.name = this.archetype.name;
    this.initialized = false;
}
MetaComponent.prototype = {
    createInstance: function (props = {}) {
        if (this.__$type$__ === _customTypes.ClassComponent) {
            let instance = new this.archetype(props);
            instance.instanceID = ("" + Math.random()).slice(3);
            return instance;
        } else if (this.__$type$__ === _customTypes.FunctionalComponent) {
            throw new TypeError("Cannot create new instance of functional component:", this.archetype);
        }
    },
    updateComponent: function (props = {}, children = []) {
        // Updates the 'instance' property with new instance of user-defined component;
        let renderResult;
        if (this.__$type$__ === _customTypes.FunctionalComponent) {
            this.inheritedProps = props;
            this.inheritedChildren = children;
            this.instance = null;
            renderResult = this.archetype(props);
        } else if (this.__$type$__ === _customTypes.ClassComponent) {
            this.inheritedProps = props;
            this.inheritedChildren = children;
            this.instance = this.createInstance(props);
            renderResult = this.instance.render(props);
        } else throw new TypeError("MetaComponent.__$type$__ not defined");
        if (renderResult === undefined) { throw new TypeError('renderResult is undefined') }
        this.componentSubTree = renderResult;
        this.componentSubTree.key = this.key;

        if (this.componentSubTree.__$type$__ === _customTypes.VirtualTextNode) {
            // Not sure if this is needed yet...
        } else if (this.componentSubTree.__$type$__ === _customTypes.VirtualElement) {
            for (let i = 0; i < this.inheritedChildren.length; i++) {
                this.componentSubTree.children.push(this.inheritedChildren[i]);
            }
        } else if (
            this.componentSubTree.__$type$__ === _customTypes.ClassComponent
            || this.componentSubTree.__$type$__ === _customTypes.FunctionalComponent
        ) {
            for (let i = 0; i < this.inheritedChildren.length; i++) {
                this.componentSubTree.inheritedChildren.push(this.inheritedChildren[i]);
            }
        }
        this.initialized = true;
    },
    renderComponent: function (props = {}) {
        if (!this.componentSubTree) {
            this.updateComponent(props);
        }
        return this.componentSubTree;
    }
}
// ============================================================================

class VirtualTextNode {
    constructor(
        args = {
            textValue: "",
            key: null,
            $nodeRef: null,
            oldIndex: null,
            newIndex: null,
        }
    ) {
        this.textValue = args.textValue;
        this.key = args.key;
        this.$nodeRef = args.$nodeRef;
        this.oldIndex = args.oldIndex;
        this.newIndex = args.newIndex;
        this.__$type$__ = _customTypes.VirtualTextNode;
    }
}
// creates a single VirtualTextNode from a string or array of strings
function createVirtualTextNode(text = "" || [""], key = null, index) {
    switch (typeof text) {
        case "string":
            return new VirtualTextNode({ textValue: text, key: key });
            break;
        case "object":
            return new VirtualTextNode(text.join(""), key);
            break;
        default:
            throw new TypeError("Argument 'text' must be String or Array.");
    }
}
// ============================================================================

const VirtualElement = function (args = {
    type,
    props: {},
    children: [],
    key: null,
    $nodeRef: null,
    oldIndex: null,
    newIndex: null,
    vParent: null
}
) {
    this.type = args.type;
    this.props = args.props;
    this.children = args.children;
    this.key = args.key;
    this.$nodeRef = args.$nodeRef;
    this.oldIndex = args.oldIndex;
    this.newIndex = args.index ? index : null;
    this.__$type$__ = _customTypes.VirtualElement;
}
VirtualElement.prototype.constructor = VirtualElement;

function createVirtualNode(type, props = {}, children = []) {
    debugger;
    let result;
    children = children.map((child, index) => { // transform String-typed children into VirtualTextNode instances
        if (typeof child === "string") {
            child = new VirtualTextNode({
                textValue: child,
            });
        }
        return child;
    });
    if (typeof type === 'string') {
        result = new VirtualElement({
            type: type,
            props: props,
            children: children,
            key: props.key ? props.key : null
        });
    }
    else if (typeof type === "function") {
        if (type.prototype && type.prototype.__$type$__ && type.prototype.__$type$__ === _customTypes.ClassComponent) {
            result = new MetaComponent({ archetype: type, inheritedProps: props, inheritedChildren: children, __$type$__: _customTypes.ClassComponent });
        } else {
            result = new MetaComponent({ archetype: type, inheritedProps: props, inheritedChildren: children, __$type$__: _customTypes.FunctionalComponent });
        }
    }
    return result;
}
const $ = createVirtualNode;


function normalizeChildren([newChildren, oldChildren]) {
    debugger;
    if (!newChildren && !oldChildren) {
        return [[], []];
    } else if (!newChildren) {
        return [
            Array(oldChildren.length).fill(undefined),
            oldChildren.map((child, index) => {
                child.oldIndex = index;
                child.newIndex = index;
                return child;
            })
        ];
    } else if (!oldChildren) {
        return [
            newChildren.map((child, index) => {
                child.oldIndex = index;
                child.newIndex = index;
                return child;
            }),
            Array(newChildren.length).fill(undefined)
        ];
    } else {
        const maxLength = newChildren.length > oldChildren.length ? newChildren.length : oldChildren.length;
        const _newChildren = newChildren.map((x) => { return x; });
        const _oldChildren1 = oldChildren.map((x) => { return x; });
        const _oldChildren2 = [];
        const _placeholder = { _placeholder: true }; // Will be replaced by child values or 'undefined' after matching

        for (let i = 0; i < maxLength; i++) {
            _oldChildren2[i] = _placeholder;
            if (!_oldChildren1[i]) {
                _oldChildren1[i] = undefined;
            } else {
                _oldChildren1[i].oldIndex = i;
            }
            if (!_newChildren[i]) {
                _newChildren[i] = undefined;
            } else {
                _newChildren[i]._currentIndex = i;
            }
        }
        for (let i = 0; i < maxLength; i++) {
            if (typeof _newChildren[i] === 'object' && _newChildren[i].key) {
                for (let j = 0; j < _oldChildren1.length; j++) {
                    if (
                        typeof _oldChildren1[j] === 'object' &&
                        _oldChildren1[j].key &&
                        _oldChildren1[j].key === _newChildren[i].key
                    ) {
                        _oldChildren2[i] = null;
                        _oldChildren2[i] = _oldChildren1.splice(j, 1)[0];
                        break;
                    }
                }
            }
        }
        for (let i = 0; i < maxLength; i++) {
            if (_oldChildren2[i] === _placeholder) {
                _oldChildren2[i] = _oldChildren1.shift();
            }
            if (_oldChildren2[i]) { _oldChildren2[i].newIndex = i; }
        }
        while (_newChildren.length < maxLength) {
            _newChildren.push(undefined);
        }
        console.log('NEW:', _newChildren);
        console.log('OLD1:', _oldChildren1);
        console.log('OLD2:', _oldChildren2);
        return [_newChildren, _oldChildren2];

    }

}


const propsHaveChanged = function (newProps, oldProps) {
    if (!oldProps && newProps) return true;
    if (oldProps && !newProps) return true;
    if (oldProps && newProps) {
        const props = Object.assign({}, newProps, oldProps);
        let propKeys = Object.keys(props);
        for (let i = 0; i < propKeys.length; i++) {
            if (!newProps[propKeys[i]] || !oldProps[propKeys[i]]) return true; // should catch null/undefined
            else if (typeof newProps[propKeys[i]] !== typeof oldProps[propKeys[i]]) return true;
            else if (typeof newProps[propKeys[i]] === 'object') {
                if (propsHaveChanged(newProps[propKeys[i]], oldProps[propKeys[i]]) === true) {
                    return true;
                };
            }
            else if (newProps[propKeys[i]] != oldProps[propKeys[i]]) {
                return true;
            }
        };
    }
    return false;
}



// ==================================================================================================================
// ============================================  RECONCILE VIRTUAL DOM  =============================================
// ==================================================================================================================



function reconcileVirtualDOM(newVirtualDOM, oldVirtualDOM) {
    let result;


    result = walkAndReconcile(newVirtualDOM, oldVirtualDOM);
    
    function walkAndReconcile(newNode, oldNode) {
        let target;
        if (newNode) {
            switch (newNode.__$type$__) {
                case _customTypes.VirtualElement:
                    target = reconcileVirtualElements(newNode, oldNode);
                    break;
                case _customTypes.ClassComponent:
                    target = reconcileClassComponents(newNode, oldNode);
                    break;
                case _customTypes.FunctionalComponent:
                    target = reconcileFunctionalComponents(newNode, oldNode);
                    break;
                case _customTypes.VirtualTextNode:
                    target = reconcileVirtualTextNodes(newNode, oldNode);
                    break;
                default:
                    throw new TypeError("Invalid value for property '__$type$__'");
            }
        } else {
            target = oldNode;
        }
        return target;

        // ========================  Helper methods for Reconciler  ========================

        function reconcileChildren(newChildren, oldChildren) {
            // debugger;
            // let [_newChildren, _oldChildren] = [newChildren, oldChildren]; // $TESTING
            let [_newChildren, _oldChildren] = normalizeChildren([newChildren, oldChildren]); // $TESTING

            let result;
            if (!_oldChildren) {
                result = _newChildren.map(function (child) {
                    return walkAndReconcile(child, undefined);
                });
            } else {
                // determine which node's 'children' array has the most children, so we can iterate through ALL of them.
                const maxLength = (_newChildren.length >= _oldChildren.length ? _newChildren.length : _oldChildren.length);
                result = [];
                for (let i = 0; i < maxLength; i++) {
                    const child = walkAndReconcile(_newChildren[i], _oldChildren[i]);
                    if (child) { // undefined children should not be pushed to the new children array.
                        result.push(child);
                    }
                }
            }
            return result;
        }
        function reconcileVirtualElements(newNode, oldNode) {
            // Input is expected to be VirtualElement instances for both arguments.
            let resultNode;
            if (
                !oldNode
            ) {
                resultNode = newNode;
                resultNode.children = reconcileChildren(newNode.children, undefined);
            }
            else {
                if (
                    newNode.type !== oldNode.type
                    || propsHaveChanged(newNode.props, oldNode.props) === true
                ) {
                    resultNode = newNode;
                    resultNode.children = reconcileChildren(newNode.children, oldNode.children);
                }
                else { resultNode = oldNode; }
            }
            return resultNode;
        }
        function reconcileVirtualTextNodes(newNode, oldNode) {
            debugger;
            if (!oldNode ||
                // typeof newNode !== typeof oldNode ||
                newNode.__$type$__ !== oldNode.__$type$__
            ) {
                resultNode = newNode;
            }
            else {
                if (newNode.textValue === oldNode.textValue) {
                    resultNode = oldNode;
                } else {
                    resultNode = newNode;
                }
            }
            return resultNode;
        }
        function reconcileClassComponents(newNode, oldNode) {
            let resultNode;
            if (!oldNode || typeof newNode !== typeof oldNode) {
                resultNode = newNode;
                resultNode.updateComponent(resultNode.inheritedProps, resultNode.inheritedChildren);
                resultNode.componentSubTree = walkAndReconcile(newNode.componentSubTree, undefined);
            }
            else if (
                !!oldNode
                && typeof newNode === typeof oldNode
                && newNode.archetype === oldNode.archetype
                && propsHaveChanged(newNode.inheritedProps, oldNode.inheritedProps) === false
            ) { resultNode = oldNode; }
            else {
                resultNode = newNode;
                resultNode.updateComponent(resultNode.inheritedProps, resultNode.inheritedChildren);
                resultNode.componentSubTree = walkAndReconcile(newNode.componentSubTree, oldNode.componentSubTree);
            }
            return resultNode;
        }
        function reconcileFunctionalComponents(newNode, oldNode) {
            let resultNode;
            if (!oldNode || typeof newNode !== typeof oldNode) {
                resultNode = newNode;
                resultNode.updateComponent(resultNode.inheritedProps, resultNode.inheritedChildren);
                resultNode.componentSubTree = walkAndReconcile(newNode.componentSubTree, undefined)
            }
            else if (
                newNode.archetype === oldNode.archetype
                && propsHaveChanged(newNode.inheritedProps, oldNode.inheritedProps) === false
            ) {
                resultNode = oldNode;
            } else {
                resultNode = newNode;
                resultNode.updateComponent(resultNode.inheritedProps, resultNode.inheritedChildren);
                resultNode.componentSubTree = walkAndReconcile(newNode.componentSubTree, oldNode.componentSubTree);
            }
            return resultNode;
        }
    }
    return result;
}
// ==================================================================================================================
// ==========================================  END RECONCILE VIRTUAL DOM  ===========================================
// ==================================================================================================================

/* prepareRenderScheme simplifies the virtual DOM tree to the objects that directly correspond with DOM nodes.
Essentially, it removes the component-level objects from the structure, appending a copy of their subtrees.
This simplifies the DOM update function, since it won't have to check for component objects anymore. */
function prepareRenderScheme(reconciledVdom) {
    let result;
    result = walkSubTree(reconciledVdom);
    function walkSubTree(vNode) {
        let target;
        if (typeof vNode === 'object') {
            switch (vNode.__$type$__) {
                case _customTypes.VirtualElement:
                    target = vNode;
                    target.children = vNode.children.map(function (child) {
                        return walkSubTree(child);
                    });
                    break;
                case _customTypes.VirtualTextNode:
                    target = vNode;
                    break;
                case _customTypes.FunctionalComponent:
                    target = walkSubTree(vNode.componentSubTree);
                    break;
                case _customTypes.ClassComponent:
                    target = walkSubTree(vNode.componentSubTree);
                    break;
                default:
                    throw new ReferenceError('__$$type$$__ property does not exist for this virtual node');
            }
        } else {
            target = vNode;
        }
        return target;
    }
    return result;
}
// =====================================================================================
// ==================================  Event Manager  ==================================
// =====================================================================================
const eventManager = {
    _eventList: {},
    _eventQueue: [],
    registerListener: function () {
        console.log('event registered');
    },
    registerEvent: function () {
        return this;
    }
}


// =====================================================================================
// ================================  End Event Manager  ================================
// =====================================================================================



// =====================================================================================
// =================================  DOM Diff/Patch  ==================================
// =====================================================================================


function isCustomProp(name) {
    return false; // for later use;
}
function setBooleanProp($target, propName, value) {
    if (value) {
        $target.setAttribute(propName, value);
        $target[propName] = true;
    } else {
        $target[propName = false];
    }
}
function removeBooleanProp($target, propName) {
    $target.removeAttribute(propName);
    $target[propName] = false;
}
function setProp($target, propName, value = null) {
    if (isCustomProp(propName)) {

    } else if (propName === 'events') {
        console.log('Event set:');
        console.log('Value:', value);
        Object.keys(value).forEach((eventName) => {
            let callback = value[eventName];
            $target.addEventListener(eventName, callback);
        });
    } else if (propName === 'style') { /* Style expected to be object containing single objects for each style property */
        Object.keys(value).forEach((prop) => {
            $target.style[prop] = value[prop];
        });
    } else if (propName === 'className') { /* We use "className" to refer to the HTML "class" attribute */
        $target.setAttribute('class', value);
    } else if (typeof value === 'boolean') {
        setBooleanProp($target, propName, value);
    }
    else {
        $target.setAttribute(propName, value);
    }
}
function removeProp($target, propName, value = null) {
    if (isCustomProp(propName)) {
        return;
    } else if (propName === 'events') {
        Object.keys(value).forEach((eventName) => {
            let callback = value[eventName]
            $target.removeEventListener(eventName, callback);
        });
    } else if (propName === 'style') {
        Object.keys(value).forEach((prop) => {
            $target.style[prop] = null;
        });
    }
    else if (propName === 'className') {
        $target.removeAttribute('class');
    } else if (typeof value === 'boolean') {
        removeBooleanProp($target, propName);
    }
}
function updateProp($target, propName, newValue, oldValue) {
    if (!newValue) {
        removeProp($target, propName, oldValue);
    } else if (!oldValue) {
        setProp($target, propName, newValue);
    } else if (newValue !== oldValue) {
        if (propName === "events") {
            removeProp($target, propName, oldValue);
        }
        setProp($target, propName, newValue);
    }
}
function updateProps($target, newProps, oldProps) {
    const props = Object.assign({}, newProps, oldProps);
    Object.keys(props).forEach(propName => {
        /* Call updateProp, passing undefined props as __explicitly__ undefined values */
        const np = (newProps && newProps[propName] ? newProps[propName] : undefined);
        const op = (oldProps && oldProps[propName] ? oldProps[propName] : undefined);
        updateProp($target, propName, np, op);
    });
}
function createNode(vNode = null || '' || { type: undefined, props: {}, children: [], __$type$__ }) {
    let $node;
    if (!vNode) { // should catch null/undefined
        throw new TypeError('Virtual Node Undefined');
    } else {
        switch (typeof vNode) {
            case 'string' || 'number':
                console.log('Let me know if this happens');
                $node = document.createTextNode(vNode);
                break;
            case 'object':
                if (vNode.__$type$__ === _customTypes.VirtualElement) {
                    $node = document.createElement(vNode.type);
                    vNode.$nodeRef = $node;
                }
                else if (vNode.__$type$__ === _customTypes.VirtualTextNode) {
                    $node = document.createTextNode(vNode.textValue);
                    vNode.$nodeRef = $node;
                }
                break;
            default:
                throw new TypeError('Invalid argument type for vNode');
        }
    }

    /* --- used for keeping track of DOM node objects,
    and knowing when they are destroyed/replaced --- */
    $node.__instanceID = ("" + Math.random()).slice(3);
    /* TODO: Remove after testing */

    return $node;
}
function nodeHasChanged(vNode1, vNode2) {
    if (typeof vNode1 !== typeof vNode2) { return true; };
    if (typeof vNode1 === 'string' && vNode1 !== vNode2) { return true; };
    if (typeof vNode1 === "object") {
        if (vNode1.__$type$__ !== vNode2.__$type$__) { return true; }
        else if (vNode1.__$type$__ === _customTypes.VirtualElement) {
            if (vNode1.type !== vNode1.type) { return true; }
        }
        else if (vNode1.__$type$__ === _customTypes.VirtualTextNode) {
            if (vNode1.textValue !== vNode2.textValue) { return true; }
        }

    };
    return false;
}

function updateElement($parent, newNode, oldNode, index = 0) {
    debugger;
    if (!oldNode) {
        if (!newNode) { console.log("Let me know if this happens"); }
        if (newNode) {
            let $node = createNode(newNode);
            if (typeof newNode === 'object' && newNode.__$type$__ === _customTypes.VirtualElement) {
                updateProps($node, newNode.props, undefined);
                updateChildren($node, newNode.children, undefined);
            }
            newNode.$nodeRef = $node;

            $parent.appendChild($node);
        }
    }
    else if (!newNode) {
        if (!oldNode) { console.log('Let me know if this happens'); }
        else {
            console.log($parent);
            $parent.removeChild($parent.childNodes[index]);
        }
    }
    else if (newNode && oldNode) {
        // [newNode.children, oldNode.children] = normalizeChildren([newNode.children, oldNode.children]); // $TESTING
        if (nodeHasChanged(newNode, oldNode) === true) {
            // if the node type has changed (or if a differente node is intended to be there), replace the node altogether.
            let $node = createNode(newNode);
            newNode.$nodeRef = $node;
            updateProps($node, newNode.props, undefined);
            updateChildren($node, newNode.children, undefined); // @@TESTING
            $parent.replaceChild($node, $parent.childNodes[index]);
        } else {
            // if the node type is the same, then we will just update the props and recursively evaluate children.

            let $node = $parent.childNodes[index];
            oldNode.$nodeRef = $node;
            // newNode.$nodeRef = oldNode.$nodeRef;
            if (newNode.__$type$__ === _customTypes.VirtualElement) {
                updateProps($node, newNode.props, oldNode.props);
                updateChildren($node, newNode.children, oldNode.children); // @@TESTING
            }
            else if (newNode.__$type$__ === _customTypes.VirtualTextNode) {
                if (newNode.textValue !== oldNode.textValue) {
                    $node.textContent = newNode.textValue;
                }
            }
        }
    }

    function updateChildren($parent, newChildren, oldChildren) {
        /* Assuming both virtual children arrays are defined as arrays, and belong to the same
        hypothetical virtual element */
        debugger;
        if (!newChildren && !oldChildren) {
            return;
        } else if (!newChildren) {
            oldChildren.forEach((child, index) => {
                // child.newIndex = index;
                // child.oldIndex = index;
                updateElement($parent, undefined, child, index);
            });
        } else if (!oldChildren) {
            newChildren.forEach((child, index) => {
                // child.newIndex = index;
                // child.oldIndex = index;
                updateElement($parent, child, undefined, index);
            });

        } else {
            const maxLength = newChildren.length > oldChildren.length ? newChildren.length : oldChildren.length;
            // const $children = Array.prototype.map.call($parent.childNodes, (c) => { return c; });
            const _newChildren = newChildren.map((x) => { return x; });
            const _oldChildren = [];
            // const indexMap = {};
            const $fragment = document.createDocumentFragment();


            oldChildren.forEach((child) => {
                _oldChildren[child.newIndex] = child;
            });
            console.log("Old Children", oldChildren);
            console.log("Reordered Children", _oldChildren);
            _oldChildren.forEach((child) => {
                $parent.removeChild(child.$nodeRef);
                $fragment.appendChild(child.$nodeRef);
            });

            // for (let i = 0; i < maxLength; i++) {
            //     indexMap[oldChildren[i].oldIndex] = oldChildren[i].newIndex;
            // }

            for (let i = 0; i < maxLength; i++) {
                updateElement($fragment, newChildren[i], _oldChildren[i], i);
            }
            debugger;
            $parent.appendChild($fragment);
        }
    }

}


// =====================================================================================
// ===============================  END DOM Diff/Patch  ================================
// =====================================================================================









// testing ================================================================================================
// testing ================================================================================================
// testing ================================================================================================

const AppFooter = function (props = {}) {
    let footerClassName = props.footerClassName ? props.footerClassName : 'app-header';
    return (
        $('div', { className: 'app-footer' }, [
            $('h1', { className: footerClassName, style: { backgroundColor: 'blue' } }, [
                "Header Text"
            ])
        ])
    );
}
class AppBody extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.randomID = ("" + Math.random()).slice(2);
        this.item = 'item';
        this.constructorMethod1 = function () {
            return 'staticMethod1';
        }
        this.arrowFunc = () => {
            return 'boundStaticMethod';
        }
    }
    protoMethod1() {
        return 'protoMethod1';
    }
    protoMethod2() {
        return 'protoMethod2 is bound to constructore';
    }
    render() {
        let className;
        if (this.props.inheritedProp) {
            className = this.props.inheritedProp;
        } else {
            className = 'app-body';
        }
        return (
            $('div', { className: className, width: '80%' })
        )
    }
}
const AppHeader = createClass(
    Component,
    function AppHeader(props) {
        Component.apply(this, arguments);
        this.props = props;
        this.stuff = 'newStuff';
    }, {
        myMethod1: function () {
            return this.props;
        },
        render: function () {
            return (
                $('div', { className: 'main-header', style: { backgroundColor: 'blue', textAlign: 'center' } }, [
                    $('h1', { className: 'header-text', style: { color: 'pink' } }, [
                        'Application Header'
                    ])
                ])
            )
        }
    }, {
        myStaticMethod: function () {
            return this;
        }
    }, { bindMethods: ['myMethod1'] }
)
AppHeader.prototype.subClassProtoMethod = function (things) {
    return things;
}
class App1 extends Component {
    constructor(props) {
        super(props);
        this.numbers = 12345;
    }
    render() {
        return (
            $('div', { className: 'App1', style: { width: "50%", height: '300px' } }, [
                $(AppHeader, { key: 'AppHeader' }),
                $(AppBody, { inheritedProp: 'INHERITED PROP', key: 'AppBody' }, [
                    $('div', { className: 'body-content' }, [
                        $('div', { className: 'row' }, ['This is row 1']),
                        $('div', { className: 'row' }, ['This is row 2']),
                        $('div', { className: 'row' }, ['This is row 2'])
                    ]),
                ]),
                $(AppFooter, { stuff: 'stuff', key: "AppFooter" }, ['text'])
            ])
        );
    }
}
class App2 extends Component {
    constructor(props) {
        super(props);
        this.numbers = 12345;
    }
    render() {
        return (
            $('div', { className: 'App2' }, [
                $("div", { style: { height: "20px", width: "200px" } }),
                $(AppHeader, { key: "AppHeader" }),
                $(AppBody, { inheritedProp: 'PROP CHANGED', key: "AppBody" }, [
                    $('div', { className: 'body-content' }, [
                        $('div', { className: 'row' }, ['This is row 4']),
                        $('div', { className: 'row' }, ['This is row 5']),
                        $('div', { className: 'row' }, ['This is row 6']),
                        $('div', { className: 'row' }, ['This is row 7']),
                    ]),
                ]),
                $(AppFooter, { stuff: 'stuff', key: "AppFooter" }, ['text']),
                $('div', { style: { height: "100px", width: "200px", border: "1px solid black" } }),
            ])
        );
    }
}

let rootComponent = $(App1);
let ROOT = document.createElement('div');
ROOT.id = 'ROOT';

const getScriptElements = function () {
    return Array.prototype.slice.call(document.body.childNodes).filter((child) => {
        return child.tagName === 'SCRIPT' ? true : false;
    });
}

document.body.insertBefore(ROOT, getScriptElements()[0]);

let oldVirtualDOM;
let newVirtualDOM;
let renderScheme;
let oldRenderScheme;
let newRenderScheme;

function test_joinAdjacentStrings() {
    let result = joinAdjacentStrings([
        { 1: 0 },
        ['textInsideArray'],
        'plainText',
        ' and other text',
        ' and more text',
        { 0: "placeholder" },
        'even more text',
        2,
        8,
        'stuff',
        NaN
    ]);
    console.log(result.length, result);
    return result;
}

function test_initializeVirtualDOM() {
    console.log(' ----------  Initializing Virtual DOM  ----------- ');
    oldVirtualDOM = initializeVirtualDOM($(App1));
    console.log("oldVirtualDOM:\r\n");
    console.log(oldVirtualDOM);
    console.log(' --------------------  DONE  --------------------- ');
}

function test_prepareRenderScheme() {
    console.log(' ----------  Preparing Render Scheme  ------------ ');
    renderScheme = prepareRenderScheme(oldVirtualDOM);
    console.log('renderScheme:\r\n');
    console.log(renderScheme);
    console.log(' --------------------  DONE  --------------------- ');
}

function test_reconcileVirtualDOM() {
    console.log(' --------  Testing Reconciler Funciton  ---------- ');
    oldVirtualDOM = reconcileVirtualDOM($(App1));
    oldRenderScheme = prepareRenderScheme(oldVirtualDOM);
    // console.log('OLD:', oldVirtualDOM);
    console.log('OLD RENDER SCHEME:\r\n', oldRenderScheme);

    let reconciled = reconcileVirtualDOM($(App2), oldVirtualDOM);
    console.log(
        '----- RECONCILED VIRTUAL DOM -----\r\n',
        reconciled,
        '\r\n----------------------------------'
    );
    newRenderScheme = prepareRenderScheme(reconciled);
    console.log('NEW RENDER SCHEME:\r\n', newRenderScheme);
    console.log(' --------------------  DONE  --------------------- ');
}

function test_initialRender() {
    console.log(' -------------  Testing DOM Patch  --------------- ');

    for (let i = 0; i < ROOT.childNodes.length; i++) {
        ROOT.removeChild(ROOT.childNodes[0]);
    }
    oldVirtualDOM = reconcileVirtualDOM($(App1));
    oldRenderScheme = prepareRenderScheme(oldVirtualDOM);

    console.group('Render Schemes:')
    console.log("Old:\r\n", oldRenderScheme);
    console.log("New:\r\n", newRenderScheme);
    console.groupEnd();

    updateElement(ROOT, oldRenderScheme, undefined, 0);

    // console.group('Messages:\r\n');
    // console.groupEnd();
    console.log(' --------------------  DONE  --------------------- ');
}
function test_patchDOM() {
    console.log(' -------------  Testing DOM Patch  --------------- ');

    newVirtualDOM = reconcileVirtualDOM($(App2));
    newRenderScheme = prepareRenderScheme(newVirtualDOM);

    console.group('Render Schemes:')
    console.log("Old:\r\n", oldRenderScheme);
    console.log("New:\r\n", newRenderScheme);
    console.groupEnd();

    updateElement(ROOT, newRenderScheme, oldRenderScheme, 0);
    oldVirtualDOM = newVirtualDOM;
    oldRenderScheme = newRenderScheme;

    console.log("DOM Structure:\r\n", ROOT.childNodes);
    console.log(' --------------------  DONE  --------------------- ');
}



function test_normalizeChildren() {
    const oldChildren = [
        { type: 'div', props: {}, children: [], id: 6 },
        { type: 'div', props: { key: 1 }, key: 1, children: [], id: 1 },
        { type: 'div', props: { key: 2 }, key: 2, children: [], id: 2 },
        { type: 'div', props: { key: 3 }, key: 3, children: [], id: 3 },
        { type: 'div', props: { key: 4 }, key: 4, children: [], id: 4 },
        { type: 'div', props: { key: 5 }, key: 5, children: [], id: 5 },

    ];
    const newChildren = [
        { type: 'div', props: { key: 1 }, key: 1, children: [], id: 1 },
        { type: 'div', props: { key: 2 }, key: 2, children: [], id: 2 },
        { type: 'div', props: { key: 4 }, key: 4, children: [], id: 4 },
        { type: 'div', props: { key: 5 }, key: 5, children: [], id: 5 },
        { type: 'div', props: { key: 3 }, key: 3, children: [], id: 3 },
    ]
    let result = normalizeChildren([newChildren, oldChildren]);
    console.log(result);
    return result;
}


// ===========================================================================
// ========================== Test Suite Interface: ==========================
// ===========================================================================

let test_interface = document.createElement('div');
test_interface.style.textAlign = "center";
test_interface.id = "test-interface";
document.body.insertBefore(test_interface, document.body.childNodes[0]);

const row1 = document.createElement('div');
row1.id = "row1";
const testBtn1 = document.createElement('button');
const testBtn1Text = document.createTextNode('Test joinAdjacentStrings');
testBtn1.appendChild(testBtn1Text);
testBtn1.onclick = test_joinAdjacentStrings;
row1.appendChild(testBtn1);
test_interface.appendChild(row1);

const row2 = document.createElement('div');
row2.id = "row2";
const testBtn2 = document.createElement('button');
const testBtn2Text = document.createTextNode('Prepare Render Scheme');
testBtn2.appendChild(testBtn2Text);
testBtn2.onclick = test_prepareRenderScheme;
row2.appendChild(testBtn2);
test_interface.appendChild(row2);

const row3 = document.createElement('div');
row3.id = "row3";
const testBtn3 = document.createElement('button');
const testBtn3Text = document.createTextNode('Reconcile VDOM');
testBtn3.appendChild(testBtn3Text);
testBtn3.onclick = test_reconcileVirtualDOM;
row3.appendChild(testBtn3);
test_interface.appendChild(row3);

const row4 = document.createElement('div');
row4.id = "row4";
const testBtn4 = document.createElement('button');
const testBtn4Text = document.createTextNode('Test Initial Render');
testBtn4.appendChild(testBtn4Text);
testBtn4.onclick = test_initialRender;
row4.appendChild(testBtn4);
test_interface.appendChild(row4);

const row5 = document.createElement('div');
row5.id = "row5";
const testBtn5 = document.createElement('button');
const testBtn5Text = document.createTextNode('Test DOM Patch');
testBtn5.appendChild(testBtn5Text);
testBtn5.onclick = test_patchDOM;
row5.appendChild(testBtn5);
test_interface.appendChild(row5);

const row6 = document.createElement('div');
row6.id = "row6";
const testBtn6 = document.createElement('button');
const testBtn6Text = document.createTextNode('Test normalizeChildren');
testBtn6.appendChild(testBtn6Text);
testBtn6.onclick = test_normalizeChildren;
row6.appendChild(testBtn6);
test_interface.appendChild(row6);



// Apply styles to test buttons:
const buttonArray = Array.prototype.slice.call(document.getElementsByTagName('button'));
const buttonStyles = {
    margin: '0.25em',
    padding: '0.5em',
    backgroundColor: "rgb(110, 146, 200)",
    border: '1px solid black',
    borderRadius: '0.15em'
}
buttonArray.forEach((button) => {
    Object.keys(buttonStyles).forEach((propName) => {
        button.style[propName] = buttonStyles[propName];
    });
});



let myTextNode = document.createTextNode('testing textNode');
test_interface.appendChild(myTextNode);
let myBtn = document.createElement('button');
let myBtnText = document.createTextNode('Log Text Node');
myBtn.onclick = (e) => console.log(e.target.childNodes);
myBtn.appendChild(myBtnText);
test_interface.appendChild(myBtn);

// HOT MODULE REPLACEMENT CONFIG:
if (module.hot) {
    module.hot.dispose(function () {
        test_interface.remove();
        ROOT.remove();
        console.clear();
    });
    module.hot.accept();
}