// ====== DEFINED FOR TESTING PURPOSES ======
const updateVirtualDOM = function () {
    console.log('updateVirtualDOM()');
    return "updating...";
};
// ====== PLEASE REMOVE FUNCTION ABOVE ======






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














const vdomTypes = {
    VirtualElement: Symbol('VirtualElement'),
    Component: Symbol('ClassComponent'),
    ClassComponent: Symbol('ClassComponent'),
    FunctionalComponent: Symbol('FunctionalComponent'),
    MetaComponent: Symbol('MetaComponent')
}

const setType = function (obj, type) {
    obj.__$type$__ = type;
}

const declare = {



    classComponent: function (component) {
        setType(component, vdomTypes.ClassComponent);
    },
    functionalComponent: function (component) {
        setType(component, vdomTypes.FunctionalComponent);
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

const MetaComponent = function (args = {
    archetype: null,
    props: null,
    children: null,
    instance: null,
    virtualElement: null,
    $element: null,
    metaComponentID: null,
    __$type$__: null
}) {
    const _this = this;
    this.archetype = args.archetype;
    this.props = args.props;
    this.children = args.children;
    this.instance = args.instance;
    this.virtualElement = args.virtualElement;
    this.$element = args.$element;
    this.metaComponentID = ("" + Math.random()).slice(3);
    this.__$type$__ = args.__$type$__;
    this.name = this.archetype.name;
    this.initialized = false;
}
MetaComponent.prototype.createInstance = function (props = {}) {
    if (this.__$type$__ === vdomTypes.ClassComponent) {
        this.instance = new this.archetype(props);
        return this.instance;
    } else if (this.__$type$__ === vdomTypes.FunctionalComponent) {
        throw new TypeError("Cannot create new instance of functional component:", this.archetype);
    }
}
MetaComponent.prototype.updateComponent = function (props = {}, children = []) {
    let _this = this;
    let renderResult;
    if (this.__$type$__ === vdomTypes.FunctionalComponent) {
        renderResult = this.archetype(props);
        this.children = children;
    } else if (this.__$type$__ === vdomTypes.ClassComponent) {
        this.instance = this.createInstance(props);
        renderResult = this.instance.render(props);
        this.children = children;
    } else throw new TypeError("MetaComponent.__$type$__ not defined");
    if (renderResult === undefined) { throw new TypeError() }
    this.virtualElement = renderResult;
console.log(this.children);
    if (this.virtualElement.__$type$__ === vdomTypes.VirtualElement) {
        _this.children.forEach(function (child) {
            _this.virtualElement.children.push(child);
        });
    }
    this.initialized = true;
    // Returns instance of this MetaComponent wrapper class.
    // The 'instance' property updated with new instance of user-defined component;

}
MetaComponent.prototype.renderComponent = function (props = {}) {
    if (!this.virtualElement) {
        this.updateComponent(props);
    }
    return this.virtualElement;
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
    __$type$__: vdomTypes.ClassComponent,
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
    this.__$type$__ = vdomTypes.VirtualElement;
}
VirtualElement.prototype.constructor = VirtualElement;

function createVirtualElement(type, props = {}, children = []) {
    if (typeof type === 'string') {
        return new VirtualElement(type, props, children);
    }
    else if (typeof type === "function") {
        if (type.prototype && type.prototype.__$type$__ && type.prototype.__$type$__ === vdomTypes.ClassComponent) {
            return new MetaComponent({ archetype: type, props: props, children: children, __$type$__: vdomTypes.ClassComponent });
        } else {
            return new MetaComponent({ archetype: type, props: props, children: children, __$type$__: vdomTypes.FunctionalComponent });
        }
    }
}
const $ = createVirtualElement;










function initializeVirtualDOM(rootComponent) {
    console.dir("rootComponent:", { rootComponent });
    let result;
    result = initialWalk(rootComponent);


    function initialWalk(vNode) {
        // console.dir("~~~~~~~~ vNode ~~~~~~~~ \r\n", { vNode });
        let target;
        if (vNode === undefined) { console.log('!vNode'); return vNode; };

        if (!vNode.__$type$__) {
            // console.log('__$type$__ false');
            switch (typeof vNode) {
                case 'string':
                    // console.log("typeof vNode === 'string'");
                    target = vNode;
                    break;
                case 'number':
                    // console.log("typeof vNode === 'number'");
                    target = vNode;
                    break;
                case 'object':
                    // console.log("typeof vNode === 'object'");
                    if (Array.isArray(vNode)) {
                        // console.log("isArray === true");
                        if (vNode.length > 0) {
                            target = vNode.map(function (item) {
                                return initialWalk(item);
                            });
                        } else target = [];
                    } else {
                        // console.log("isArray === false");
                        target = vNode;
                    }
                    break;
                case 'function':
                    // console.log("typeof vNode === 'function'");
                    target = vNode;
                    break;
                case 'bigint':
                    // console.log("typeof vNode === 'bigint'");
                    target = vNode;
                    break;
                case 'symbol':
                    // console.log("typeof vNode === 'symbol'");
                    target = vNode;
                    break;
                default:
                    throw new TypeError("Invalid type for vNode");
            }
        } else {
            // console.log('__$type$__ true');
            switch (vNode.__$type$__) {
                case vdomTypes.VirtualElement:
                    // console.log('Virtual Element', vNode);
                    target = {}
                    target.type = initialWalk(vNode.type); // 'type' property can contain components, so we need to walk the tree;
                    target.props = vNode.props ? vNode.props : {};
                    target.children = initialWalk(vNode.children); // each array element parsed by the walk agorithm;
                    target.__$type$__ = vNode.__$type$__;
                    break;
                case vdomTypes.ClassComponent:
                    // console.log('Class Component', vNode);
                    if (!vNode.virtualElement) {
                        // console.log('instance NULL');
                        vNode.updateComponent(vNode.props, vNode.children);
                        // console.log('vNode.virtualElement', vNode.virtualElement);

                        if (!vNode.virtualElement) {
                            throw new TypeError('vNode instance undefined');
                        } else {
                            target = vNode;
                            target.virtualElement = initialWalk(vNode.virtualElement);
                        }
                    } else {
                        target = vNode;
                        target.virtualElement = initialWalk(vNode.virtualElement);
                    }
                    break;
                case vdomTypes.FunctionalComponent:
                    // console.log('Functional Component', vNode);
                    if (!vNode.virtualElement) {
                        vNode.updateComponent(vNode.props, vNode.children);
                        // console.log('vNode.virtualElement', vNode.virtualElement);
                        if (!vNode.virtualElement) {
                            throw new TypeError('vNode instance undefined');
                        } else {
                            target = vNode;
                            target.virtualElement = initialWalk(vNode.virtualElement);
                        }
                    } else {
                        target = vNode;
                        target.virtualElement = initialWalk(vNode.virtualElement);
                    }
                    break;
                default:
                    throw new TypeError("Invalid value for property '__$type$__' on component");
            }
        }
        // console.log('Target:', target);
        return target;

    }


    console.dir('Result:', result);
    return result;
}




// ==================================================================================================================
// ==============================================  CREATE VIRTUAL DOM  ==============================================
// ==================================================================================================================

function createVirtualDOM() {
    console.dir("rootComponent:", { rootComponent });
    let result;
    result = walkVirtualDOM(rootComponent);


    function walkVirtualDOM(vNode) {
        console.dir("~~~~~~~~ vNode ~~~~~~~~ \r\n", { vNode });
        let target;
        if (vNode === undefined) { console.log('!vNode'); return vNode; };

        if (!vNode.__$type$__) {
            console.log('__$type$__ false');
            switch (typeof vNode) {
                case 'string':
                    console.log("typeof vNode === 'string'");
                    target = vNode;
                    break;
                case 'number':
                    console.log("typeof vNode === 'number'");
                    target = vNode;
                    break;
                case 'object':
                    console.log("typeof vNode === 'object'");
                    if (Array.isArray(vNode)) {
                        console.log("isArray === true");
                        if (vNode.length > 0) {
                            vNode.forEach(function (item) {
                                target = walkVirtualDOM(item);
                            });
                        } else target = [];
                    } else {
                        console.log("isArray === false");
                        target = vNode;
                    }
                    break;
                case 'function':
                    console.log("typeof vNode === 'function'");
                    target = vNode;
                    break;
                case 'bigint':
                    console.log("typeof vNode === 'bigint'");
                    target = vNode;
                    break;
                case 'symbol':
                    console.log("typeof vNode === 'symbol'");
                    target = vNode;
                    break;
                default:
                    throw new TypeError("Invalid type for vNode");
            }
        } else {
            console.log('__$type$__ true');
            switch (vNode.__$type$__) {
                case vdomTypes.VirtualElement:
                    console.log('Virtual Element');
                    target = {}
                    target.type = walkVirtualDOM(vNode.type);
                    target.props = vNode.props ? vNode.props : {};
                    target.children = walkVirtualDOM(vNode.children);
                    break;
                case vdomTypes.ClassComponent:
                    console.log('Class Component');
                    target = walkVirtualDOM(vNode.renderComponent());
                    break;
                case vdomTypes.FunctionalComponent:
                    console.log('Functional Component');
                    target = walkVirtualDOM(vNode.renderComponent());
                    break;
                default:
                    throw new TypeError("Invalid value for property '__$type$__' on component");
            }
        }
        console.log('Target:', target);
        return target;

    }


    console.dir('Result:', result);
    return result;
}








// testing ================================================================================================
// testing ================================================================================================
// testing ================================================================================================


const testFunc1 = function (props = {}) {
    let headerClassName = props.headerClassName ? props.headerClassName : 'app-header';
    return (
        $('div', { className: 'header-wrapper' }, [
            $('h1', { className: headerClassName, style: { backgroundColor: 'blue' } }, [
                "Header Text"
            ])
        ])
    );
}


class TestClass1 extends Component {
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
        console.log(this.props);
    }

    protoMethod1() {
        return 'protoMethod1';
    }
    protoMethod2() {
        return 'protoMethod2 is bound to constructore';
    }
    render() {
        console.log('PROPS dksoafidospahfidospafsdopi', this.props)
        let className;
        if (this.inheritedProp) {
            className = this.props.inheritedProp;
        } else {
            className = 'button-wrapper';
        }
        return (
            $('div', { className: className, width: '3em' }, ['This is a button:'])
        )
    }
}


const TestClass2 = createClass(
    Component,
    function TestClass2(props) {
        Component.apply(this, arguments);
        this.props = props;
        this.stuff = 'newStuff';
    }, {
        myMethod1: function () {
            return this.props;
        },
        render: function () {
            return (
                $('div', { style: { backgroundColor: 'blue' } }, [
                    $('button', { style: { fontColor: 'pink' } }, [
                        'click me!'
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
TestClass2.prototype.subClassProtoMethod = function (things) {
    return things;
}


let NewClass1 = TestClass2.extend(
    function NewClass1(props) {
        TestClass2.apply(this, arguments);
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




class App extends Component {
    constructor(props) {
        super(props);
        this.numbers = 12345;
    }
    render() {
        return (
            $(TestClass1, { inheritedProp: 'INHERITED PROP' }, [
                $(TestClass2),
                $('div', null, [
                    $('h1', { className: 'main-header' }, [
                        'Application Header'
                    ])
                ]),
                $(testFunc1, {stuff: 'stuff'}, ['text'])
            ])
        );
    }
}

// let a = createVirtualElement(testFunc1);
// let b = createVirtualElement(TestClass1);
// let c = createVirtualElement(TestClass2);
// let d = createVirtualElement(NewClass1);
// console.group("createVirtualElement --> MetaComponent")
// console.dir(a.renderComponent())
// console.dir(b.renderComponent());
// console.dir(c.renderComponent());
// console.dir(d.renderComponent());
// console.groupEnd();

// console.dir($(App).renderComponent());

function test_initializeVirtualDOM () {
    console.log(' ------------------  TESTING  ------------------ ');
    initializeVirtualDOM(
        $(App)               // MetaComponent
        // 'Hello World'        // string
        // 5                    // number
        // BigInt(515556666644885588)        // bigint
        // {a:1}                // object !isArray
        // [1, 2, 3]            // object isArray
        // NaN                  // NaN
        // null                 // null
        // undefined            // undefined
    );
    console.log(' --------------------  DONE  --------------------- ');
}


const myButton = document.createElement('button');
myButtonText = document.createTextNode('Update');
myButton.appendChild(myButtonText);
myButton.onclick = test_initializeVirtualDOM;
document.body.appendChild(myButton);
