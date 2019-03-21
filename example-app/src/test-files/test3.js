// ====== DEFINED FOR TESTING PURPOSES ======
const updateVirtualDOM = function () {
    console.log('updateVirtualDOM()');
    return "updating...";
};
// ====== PLEASE REMOVE FUNCTION ABOVE ======


const _customTypes = Object.create({}, {
    _error_invalidSet: {
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
        set: function (x) { return this._error_invalidSet('_customTypes.notDefined', String(x)); }
    },
    VirtualElement: {
        get: function () { return this._VirtualElement; },
        set: function (x) { return this._error_invalidSet('_customTypes.VirtualElement', String(x)); }
    },
    VirtualTextNode: {
        get: function () { return this._VirtualTextNode; },
        set: function (x) { return this._error_invalidSet('_customTypes.VirtualTextNode', String(x)); }
    },
    Component: {
        get: function () { return this._Component; },
        set: function (x) { return this._error_invalidSet('_customTypes.Component', String(x)); }
    },
    ClassComponent: {
        get: function () { return this._ClassComponent; },
        set: function (x) { return this._error_invalidSet('_customTypes.ClassComponent', String(x)); }
    },
    FunctionalComponent: {
        get: function () { return this._FunctionalComponent; },
        set: function (x) { return this._error_invalidSet('_customTypes.FunctionalComponent', String(x)); }
    },
    MetaComponent: {
        get: function () { return this._MetaComponent; },
        set: function (x) { return this._error_invalidSet('_customTypes.MetaComponent', String(x)); }
    },
});

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

const MetaComponent = function (args = {
    archetype: null,
    inheritedProps: null,
    inheritedChildren: null,
    instance: null,
    virtualElement: null,
    $element: null,
    metaComponentID: null,
    __$type$__: null
}) {
    this.archetype = args.archetype;
    this.inheritedProps = args.inheritedProps;
    this.inheritedChildren = args.inheritedChildren;
    this.instance = args.instance;
    this.componentSubTree = args.componentSubTree;
    this.$element = args.$element;
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
        let _this = this;
        let renderResult;
        if (this.__$type$__ === _customTypes.FunctionalComponent) {
            this.inheritedProps = props;
            this.inheritedChildren = children;
            this.instance = null;
            renderResult = this.archetype(props);
        } else if (this.__$type$__ === _customTypes.ClassComponent) {
            this.inheritedProps = props
            this.inheritedChildren = children;
            this.instance = this.createInstance(props);
            renderResult = this.instance.render(props);
        } else throw new TypeError("MetaComponent.__$type$__ not defined");
        if (renderResult === undefined) { throw new TypeError('renderResult is undefined') }
        this.componentSubTree = renderResult;
        // console.log(this.inheritedChildren);
        if (this.componentSubTree.__$type$__ === _customTypes.VirtualElement) {
            for (let i = 0; i < this.inheritedChildren.length; i++) {
                this.componentSubTree.children.push(this.inheritedChildren[i])
            }
        } else if (
            this.componentSubTree.__$type$__ === _customTypes.ClassComponent
            || this.componentSubTree.__$type$__ === _customTypes.FunctionalComponent
        ) {
            for (let i = 0; i < this.inheritedChildren.length; i++) {
                this.componentSubTree.inheritedChildren.push(this.inheritedChildren[i])
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
// ============================================================================

const VirtualElement = function (type, props = {}, children = []) {
    this.type = type;
    this.props = props;
    this.children = children;
    this.$nodeRef = null;
    this.__$type$__ = _customTypes.VirtualElement;
}
VirtualElement.prototype.constructor = VirtualElement;

function createVirtualElement(type, props = {}, children = []) {
    if (typeof type === 'string') {
        return new VirtualElement(type, props, children);
    }
    else if (typeof type === "function") {
        if (type.prototype && type.prototype.__$type$__ && type.prototype.__$type$__ === _customTypes.ClassComponent) {
            return new MetaComponent({ archetype: type, inheritedProps: props, inheritedChildren: children, __$type$__: _customTypes.ClassComponent });
        } else {
            return new MetaComponent({ archetype: type, inheritedProps: props, inheritedChildren: children, __$type$__: _customTypes.FunctionalComponent });
        }
    }
}
const $ = createVirtualElement;

class VirtualTextNode {
    constructor(textValue) {
        this.type = "textNode";
        this.textValue = textValue;
        this.prevVirtualSibling = null;
        this.nextVirtualSibling = null;
        this.normalizedSuperstring = null;
        this.nodeRef = null;
        this.__$type$__ = _customTypes.VirtualTextNode;
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



// Special case of reconcileVirtualDOM, performed on initial render of application.
// Omits comparison to previous virtual DOM object (since it doesn't exist yet). 
function initializeVirtualDOM(rootComponent) {
    let result;
    result = initialWalk(rootComponent);

    function initialWalk(vNode) {
        // console.dir("~~~~~~~~ vNode ~~~~~~~~ \r\n", { vNode });
        let target;
        if (vNode === undefined) { console.log('!vNode'); return vNode; };
        if (vNode === null) { console.log('vNode is null'); return vNode; };

        if (!vNode.__$type$__) {
            // console.log('__$type$__ false');
            switch (typeof vNode) {
                case 'object':
                    // console.log("typeof vNode === 'object'", vNode);
                    if (Array.isArray(vNode)) {
                        // console.log("isArray === true");
                        if (vNode.length > 0) {
                            target = vNode.map(function (item) {
                                return initialWalk(item);
                            });
                        } else target = [];
                    } else {
                        // console.log("isArray === false");
                        target = {};
                        const propKeys = Object.keys(vNode);
                        for (let i = 0; i < propKeys.length; i++) {
                            target[propKeys[i]] = vNode[propKeys[i]];
                        }
                    }
                    break;
                default:
                    target = vNode;
            }
        } else {
            // console.log('__$type$__ true');
            switch (vNode.__$type$__) {
                case _customTypes.VirtualElement:
                    // console.log('Virtual Element', vNode);
                    target = new VirtualElement(
                        initialWalk(vNode.type), // 'type' property can contain components, so we need to walk the tree;
                        initialWalk(vNode.props),
                        initialWalk(vNode.children), // each array element parsed by the walk agorithm;
                    );
                    break;
                case _customTypes.ClassComponent:
                    // console.log('Class Component', vNode);
                    if (!vNode.componentSubTree) {
                        // console.log('instance NULL');
                        vNode.updateComponent(vNode.inheritedProps, vNode.inheritedChildren);
                        // console.log('vNode.componentSubTree', vNode.componentSubTree);
                        if (!vNode.componentSubTree) {
                            throw new TypeError('vNode instance undefined');
                        } else {
                            target = vNode;
                            target.componentSubTree = initialWalk(vNode.componentSubTree);
                        }
                    } else {
                        target = vNode;
                        target.componentSubTree = initialWalk(vNode.componentSubTree);
                    }
                    break;
                case _customTypes.FunctionalComponent:
                    // console.log('Functional Component', vNode);
                    if (!vNode.componentSubTree) {
                        vNode.updateComponent(vNode.inheritedProps, vNode.inheritedChildren);
                        // console.log('vNode.componentSubTree', vNode.componentSubTree);
                        if (!vNode.componentSubTree) {
                            throw new TypeError('vNode instance undefined');
                        } else {
                            target = vNode;
                            target.componentSubTree = initialWalk(vNode.componentSubTree);
                        }
                    } else {
                        target = vNode;
                        target.componentSubTree = initialWalk(vNode.componentSubTree);
                    }
                    break;
                default:
                    throw new TypeError("Invalid value for property '__$type$__' on component");
            }
        }
        // console.log('Target:', target);
        return target;
    }
    return result;
}



// ==================================================================================================================
// ============================================  RECONCILE VIRTUAL DOM  =============================================
// ==================================================================================================================



function reconcileVirtualDOM(newVirtualDOM, oldVirtualDOM) {
    let result;
    // if (!oldVirtualDOM) {
    //     console.log("!oldVirtualDOM");
    //     result = (newVirtualDOM);
    // } else {
    //     result = walkAndReconcile(newVirtualDOM, oldVirtualDOM);
    //     // console.log(result);
    // }
    result = walkAndReconcile(newVirtualDOM, oldVirtualDOM);
    function walkAndReconcile(newNode, oldNode) {
        let target;

        if (!newNode.__$type$__) {
            // Fill out non-component value handling here...
            if (!oldNode || typeof newNode !== typeof oldNode) {
                target = newNode;
            }
            switch (typeof newNode) {
                case "object":
                    if (Array.isArray(newNode) === true) {
                        console.log('--- non-component array ??');
                        if (Array.isArray(oldNode) === false) { target = newNode; }
                        else {
                            target = [];
                            const maxLength = (newNode.length >= oldNode.length ? newNode.length : oldNode.length);
                            for (let i; i < maxLength; i++) {
                                const item = walkAndReconcile(newNode[i], oldNode[i]);
                                if (!!item) {
                                    target.push(item);
                                }
                            }
                        }
                    } else {
                        // regular objects:
                        if (Array.isArray(oldNode) === true) { target = newNode; }
                        target = {};
                        const props = Object.assign({}, newNode, oldNode);
                        const propKeys = Object.keys(props);
                        for (let i = 0; i < propKeys.length; i++) {
                            target[propKeys[i]] = walkAndReconcile(newNode[propKeys[i]], oldNode[propKeys[i]]);
                        }
                    }
                    break;
                default:
                    if (newNode !== oldNode) {
                        target = newNode;
                    }
            }
        } else {
            switch (newNode.__$type$__) {
                case _customTypes.VirtualElement:
                    target = reconcileVirtualElements(newNode, oldNode);
                    break;
                case _customTypes.ClassComponent:
                    target = reconcileClassComponents(newNode, oldNode)
                    break;
                case _customTypes.FunctionalComponent:
                    target = reconcileFunctionalComponents(newNode, oldNode);
                    break;
                default:
                    throw new TypeError("Invalid value for property '__$type$__' on component");
            }

        }
        // console.log('target:', target);
        return target;

        // ========================  Helper methods for Reconciler  ========================

        function reconcileChildren(newChildren, oldChildren) {
            let result;
            if (!oldChildren) {
                result = newChildren.map(function (child) {
                    return walkAndReconcile(child, undefined);
                });
            } else {
                // determine which node's 'children' array has the most children, so we can iterate through ALL of them.
                const maxLength = (newChildren.length >= oldChildren.length ? newChildren.length : oldChildren.length);
                result = [];
                for (let i = 0; i < maxLength; i++) {
                    const child = walkAndReconcile(newChildren[i], oldChildren[i]);
                    if (child) { // undefined children should not be pushed to the new children array.
                        result.push(child);
                    }
                }

            }
            return result;
        }
        function reconcileVirtualElements(newNode, oldNode) {
            // console.log(newNode, oldNode);
            // Input is expected to be VirtualElement instances for both arguments.
            let resultNode;
            if (
                !oldNode
                || typeof newNode !== typeof oldNode
                || typeof newNode.type !== typeof oldNode.type
            ) {
                resultNode = newNode;
                resultNode.children = reconcileChildren(newNode.children, undefined);
            }
            else {
                if (typeof newNode.type === 'string') {
                    if (
                        newNode.type !== oldNode.type
                        || propsHaveChanged(newNode.props, oldNode.props) === true
                    ) {
                        resultNode = newNode;
                        resultNode.children = reconcileChildren(newNode.children, oldNode.children);
                    }
                    else { resultNode = oldNode; }
                }
                else { // the node types look the same!
                    // So let's check the props!
                    if (propsHaveChanged(newNode.props, oldNode.props) === true) {
                        resultNode = newNode;
                        // resultNode.type = walkAndReconcile(newNode.type, oldNode.type);
                        resultNode.children = reconcileChildren(newNode.children, oldNode.children);
                    }
                    // if props have changed, then we will use the new node, but we still need to compare children.
                    else { resultNode = oldNode; }
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

function prepareRenderScheme(reconciledVdom) { // Constructs the 
    let result;
    result = walkSubTree(reconciledVdom);

    function walkSubTree(vNode) {
        let target;
        if (typeof vNode === 'object') {
            switch (vNode.__$type$__) {
                case _customTypes.VirtualElement:
                    // console.log('VirtualElement');
                    target = vNode;
                    target.children = vNode.children.map(function (child) {
                        return walkSubTree(child);
                    });
                    break;
                case _customTypes.FunctionalComponent:
                    // console.log('FunctionalComponent');
                    target = walkSubTree(vNode.componentSubTree);
                    break;
                case _customTypes.ClassComponent:
                    // console.log('ClassComponent');
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
    // console.log('Target:\r\n', $target);
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
        throw new TypeError('Cannot create node with value === null || undefined');
    } else {
        switch (typeof vNode) {
            case 'string':
                $node = document.createTextNode(vNode);
                break;
            case 'object':
                if (vNode.__$type$__ === _customTypes.VirtualElement) {
                    $node = document.createElement(vNode.type);
                }
                else { console.log('Let me know if this happens'); }
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
    if (typeof vNode1 === "object" && vNode1.type !== vNode2.type) { return true; };
    return false;
}

function updateElement($parent, newNode, oldNode, index = 0) {
    if (!oldNode) {
        if (!newNode) { console.log("Let me know if this happens"); }
        if (newNode) {
            let $node = createNode(newNode);
            if (typeof newNode === 'object' && newNode.__$type$__ === _customTypes.VirtualElement) {
                updateProps($node, newNode.props, undefined);
                for (let i = 0; i < newNode.children.length; i++) {
                    updateElement($node, newNode.children[i], undefined, i);
                }
            }
            $parent.appendChild($node);
            newNode.$nodeRef = $node;
        }
    }
    else if (!newNode) {
        if (!oldNode) { console.log('Let me know if this happens'); }
        console.log($parent.childNodes[index]);
        console.log(oldNode);
        $parent.removeChild($parent.childNodes[index]);
    }
    else if (newNode && oldNode) {
        if (nodeHasChanged(newNode, oldNode) === true) {
            // if the node type has changed (or if a differente node is intended to be there), replace the node altogether.
            let $node = createNode(newNode);
            newNode.$nodeRef = $node;
            updateProps($node, newNode.props, undefined);
            for (let i = 0; i < newNode.children; i++) {
                updateElement($node, newNode.children[i], oldNode.children[i], i);
            }
            $parent.replaceChild($node, $parent.childNodes[index]);
        } else {
            // if the node type is the same, then we will just update the props and recursively evaluate children.

            if (typeof newNode === 'object') {
                let $node = $parent.childNodes[index];
                newNode.$nodeRef = $node;
                updateProps($node, newNode.props, oldNode.props);
                const maxLength = (
                    newNode.children.length > oldNode.children.length ?
                        newNode.children.length : oldNode.children.length
                );
                for (let i = 0; i < maxLength; i++) {
                    updateElement($node, newNode.children[i], oldNode.children[i], i);
                }
            }
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
let NewClass1 = AppHeader.extend(
    function NewClass1(props) {
        AppHeader.apply(this, arguments);
        this.props = props;
        this.data = 'data';
    }, {
        myMethod2: function () {
            return this.props;
        }
    }, {
        staticMethod2: function () {
            return this;
        }
    }, {
        bindMethods: ['myMethod2']
    }
)
class App1 extends Component {
    constructor(props) {
        super(props);
        this.numbers = 12345;
    }
    render() {
        return (
            $('div', { className: 'App1', style: { width: "50%", height: '300px' } }, [
                $(AppHeader, { uniqueKey: 'disopafdis' }),
                $(AppBody, { inheritedProp: 'INHERITED PROP' }, [
                    $('div', { className: 'body-content' }, [
                        $('div', { className: 'row' }, ['This is row 1']),
                        $('div', { className: 'row' }, ['This is row 2']),
                        $('div', { className: 'row' }, ['This is row 2'])
                    ]),
                ]),
                $(AppFooter, { stuff: 'stuff' }, ['text'])
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
                $(AppHeader),
                $(AppBody, { inheritedProp: 'PROP CHANGED' }, [
                    $('div', { className: 'body-content' }, [
                        $('div', { className: 'row' }, ['This is row 4']),
                        $('div', { className: 'row' }, ['This is row 5']),
                        $('div', { className: 'row' }, ['This is row 6']),
                        $('div', { className: 'row' }, ['This is row 7']),
                    ]),
                ]),
                $(AppFooter, { stuff: 'stuff' }, ['text']),
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

oldVirtualDOM = initializeVirtualDOM($(App1));


function test_initializeVirtualDOM() {
    console.log(' ----------  Initializing Virtual DOM  ----------- ');
    oldVirtualDOM = initializeVirtualDOM($(App1));
    console.log("oldVirtualDOM:\r\n");
    console.log(oldVirtualDOM);
    console.log(' --------------------  DONE  --------------------- ');
}

function test_prepareRenderScheme(virtualDomObject) {
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

function test_longestArray() {
    let result1 = longestArray(
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [2, 3, 1, 2, 3, 3, 2, 2, 3, 4]
    )
    let result2 = longestArray(
        [2, 3, 5, 3, 2, 4, 5, 6, 7, 5, 3, 4, 5, 4],
        [3, 5, 6, 7, 3],
        [1, 5, 0, 9, 8, 9, 6, 4, 3, 3],
        [1, 3, 5, 6, 74, 2]
    )
    console.log("\r\n", result1, "\r\n", result2);
}

function normalizeChildren([newChildren, oldChildren]) {
    if (!newChildren && !oldChildren) {
        return [[], []];
    } else if (!newChildren) {
        return [[].fill(undefined, 0, oldChildren.length - 1), oldChildren];
    } else if (!oldChildren) {
        return [newChildren, [].fill(undefined, 0, oldChildren.length - 1)];
    }

    const maxLength = newChildren.length > oldChildren.length ? newChildren.length : oldChildren.length;
    const _newChildren = newChildren.map((x) => { return x; });
    const _oldChildren1 = oldChildren.map((x) => { return x; });
    const _oldChildren2 = [];
    const _placeholder = { _placeholder: true }; // Will be replaced by child values or 'undefined' after matching

    for (let i = 0; i < maxLength; i++) {
        _oldChildren1[i]._fromIndex = i;
        _oldChildren2[i] = _placeholder;
        if (!_newChildren[i]) {
            _newChildren[i] = undefined;
        } else {
            _newChildren[i]._currentIndex_ = i;
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
        // console.log(_newChildren[i], _oldChildren2[i]);
    }
    for (let i = 0; i < maxLength; i++) {
        if (_oldChildren2[i] === _placeholder) {
            _oldChildren2[i] = _oldChildren1.shift();
        }
        _oldChildren2[i]._toIndex_ = i;
    }
    while (_newChildren.length < maxLength) {
        _newChildren.push(undefined);
    }
    console.log('NEW:', _newChildren);
    console.log('OLD1:', _oldChildren1);
    console.log('OLD2:', _oldChildren2);
    return [_newChildren, _oldChildren2];
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
const testBtn1Text = document.createTextNode('Initialize VDOM');
testBtn1.appendChild(testBtn1Text);
testBtn1.onclick = test_initializeVirtualDOM;
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










// HOT MODULE REPLACEMENT CONFIG:
if (module.hot) {
    module.hot.dispose(function () {
        test_interface.remove();
        ROOT.remove();
        console.clear();
    });
    module.hot.accept();
}