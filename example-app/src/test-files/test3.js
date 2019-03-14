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
                console.log('OBJECT PROP');
                if (propsHaveChanged(newProps[propKeys[i]], oldProps[propKeys[i]]) === true) {
                    return true;
                };
            }
            else if (newProps[propKeys[i]] != oldProps[propKeys[i]]) {
                console.log(newProps[propKeys[i]], oldProps[propKeys[i]], "not equal");
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
    instanceID: null,
    __$type$__: null
}) {
    const _this = this;
    this.archetype = args.archetype;
    this.props = args.props;
    this.children = args.children;
    this.virtualElement = null,
    this.$element = null,
    this.instanceID = null,
    this.__$type$__ = null
    this.name = this.archetype.name;
}
MetaComponent.createInstance = function (props) {
    if (!this.__$type$__) throw new TypeError("")
    if (this.__$type$__ === vdomTypes.ClassComponent) {
        this.instance = new this.archetype(props);
        return this.instance;
    } else if (this.__$type$__ === vdomTypes.FunctionalComponent) {
        throw new TypeError("Cannot create new instance of functional component:", this.archetype);
    }
}
MetaComponent.renderComponent = function (props) {
    let _renderResult = this.instance.render(props);

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
Component.__$type$__ = vdomTypes.ClassComponent;
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
    this.__$type$__ = __VdomSymbols__.VirtualElement;
}
VirtualElement.prototype.constructor = VirtualElement;

function createVirtualElement(type, props = {}, children = []) {
    if (typeof type === 'string') { return new VirtualElement(type, props, children); }
    else if (typeof type === "function") {
        if (type.prototype && type.prototype.__$type$__ && type.prototype.__$type$__ === vdomTypes.ClassComponent) {
            return new MetaComponent({ archetype: type, props: props, children: children, __$type$__: vdomTypes.ClassComponent })

        } else {
            return new MetaComponent({archetype: type, props: props, children: children, __$type$__: vdomTypes.FunctionalComponent})
        }
    }
}

// testing =============================================================================
const testFunc1 = function (props = {}) {
    let headerClassName = props.headerClassName ? props.headerClassName : 'app-header';
    return (
        createVirtualElement('div', { className: 'header-wrapper' }, [
            createVirtualElement('h1', { className: headerClassName, style: { backgroundColor: 'blue' } }, [
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
}


const TestClass2 = createClass(
    Component,
    function TestClass2(props) {
        Component.apply(this, arguments);
        this.props = props;
        console.dir(this);
        this.stuff = 'newStuff';
    }, {
        myMethod1: function () {
            return this.props;
        },
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




let a = createVirtualElement(testFunc1);
let b = createVirtualElement(TestClass1);
let c = createVirtualElement(TestClass2);
let d = createVirtualElement(NewClass1);
console.group("createVirtualElement --> MetaComponent")
console.dir(a);
console.dir(b);
console.dir(c);
console.dir(d);
console.groupEnd();
