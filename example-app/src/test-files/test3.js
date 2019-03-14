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
    this.virtualElement = args.virtualElement;
    this.$element = args.$element;
    this.metaComponentID = ("" + Math.random()).slice(3);
    this.__$type$__ = args.__$type$__;
    this.name = this.archetype.name;
}
MetaComponent.prototype.createInstance = function (props = {}) {
    if (this.__$type$__ === vdomTypes.ClassComponent) {
        this.instance = new this.archetype(props);
        return this.instance;
    } else if (this.__$type$__ === vdomTypes.FunctionalComponent) {
        throw new TypeError("Cannot create new instance of functional component:", this.archetype);
    }
}
MetaComponent.prototype.updateComponent = function (props = {}) {
    let renderResult;
    if (this.__$type$__ === vdomTypes.FunctionalComponent) {
        renderResult = this.archetype(props);
    } else if (this.__$type$__ === vdomTypes.ClassComponent) {
        this.instance = this.createInstance(props);
        renderResult = this.instance.render(props);
    } else throw new TypeError("MetaComponent.__$type$__ not defined");
    this.virtualElement = renderResult;
    if (this.virtualElement.__$type$__ === vdomTypes.VirtualElement) {
        console.log('Virtual Element');
        this.virtualElement.children.push(this.children);
    }
    return this;
}
MetaComponent.prototype.renderComponent = function () {
    if (!this.virtualElement) {
        this.updateComponent();
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
Component.prototype.constructor = Component;
Component.prototype.__$type$__ = vdomTypes.ClassComponent;
Component.prototype.render = () => {
    // To be defined in the component instance.
    // Initially returns undefined to throw an error if not overwritten.
    return new Error('render is undefined');
}
Component.prototype.update = () => {
    updateVirtualDOM();
}
Component.prototype.setState = (newState) => {
    if (newState) {
        Object.keys(newState).forEach((prop) => {
            Component.state[prop] = newState[prop];
        });
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
            return new MetaComponent({ archetype: type, props: props, children: children, __$type$__: vdomTypes.ClassComponent })
        } else {
            return new MetaComponent({ archetype: type, props: props, children: children, __$type$__: vdomTypes.FunctionalComponent })
        }
    }
}
const $ = createVirtualElement;


function initializeVirtualDOM(rootComponent) {
    console.log("rootComponent:",rootComponent);
    let result;
    result = renderTree(result, rootComponent);

    function renderTree(target, vNode) {
        if (!vNode) {console.log('!vNode'); return vNode;};

        if (!vNode.__$type$__) {
            console.log('no __$type$__');
            switch (typeof vNode) {
                case 'string':
                    console.log("typeof vNode === 'string'");
                    target = vNode;
                    break;
                case 'number':
                    console.log("typeof vNode === 'number'");
                    target = vNode;
                    break;
                case 'bigint':
                    console.log("typeof vNode === 'bigint'");
                    target = vNode;
                    break;
                default:
                    throw new TypeError("Invalid type for vNode");
            }
        } else {
            console.log('__$type$__ exists');
            switch (vNode.__$type$__) {
                case vdomTypes.VirtualElement:
                    console.log('Virtual Element');
                    break;
                case vdomTypes.ClassComponent:
                    console.log('Class Component');
                    target = vNode.renderComponent();
                    break;
                case vdomTypes.FunctionalComponent:
                    console.log('Functional Component');
                    break;
                default:
                    throw new TypeError("Invalid value for property '__$type$__' on component");
            }
        }


        return target;
    }



    return result;
}

function createVirtualDOM() {

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
    }

    protoMethod1() {
        return 'protoMethod1';
    }
    protoMethod2() {
        return 'protoMethod2 is bound to constructore';
    }
    render() {
        return (
            $('button', { width: '3em' }, ['click me!'])
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
                    $('div', { style: { fontColor: 'pink' } }, [])
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
                ])
            ])
        )
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




console.log(initializeVirtualDOM(
    // $(App)               // MetaComponent
    // 'Hello World'        // string
    // 5                    // number



    // NaN                  // NaN
    // undefined            // undefined
    // null                 // null
));