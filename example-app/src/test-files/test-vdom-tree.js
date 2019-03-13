
// input root virtual node
// output virtual DOM tree

// ====== DEFINED FOR TESTING PURPOSES ======
const updateVirtualDOM = function () {
    console.log('updateVirtualDOM()');
    return "updating...";
};
// ====== PLEASE REMOVE FUNCTION ABOVE ======

const VdomComponent = function (props = {}) {
    if (props) {
        Object.keys(props).forEach((propName) => {
            this[propName] = props[propName];
        });
    }
    this.state = {};
}
VdomComponent.prototype.constructor = VdomComponent;
VdomComponent.prototype.render = () => {
    // To be defined in the component instance.
    // Initially returns undefined to throw an error if not overwritten.
    return new Error('render is undefined');
}
VdomComponent.prototype.update = () => {
    updateVirtualDOM();
}
VdomComponent.prototype.setState = (newState) => {
    if (newState) {
        Object.keys(newState).forEach((prop) => {
            VdomComponent.state[prop] = newState[prop];
        });
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



// ========================================================================
// ===========================  META COMPONENT  ===========================
// ========================================================================
const MetaComponent = function (args = {
    instanceID: null,
    archetype: null,
    instance: null,
    props: null,
    virtualElement: null,
    $element: null,
    componentType: null
}) {
    const _this = this;
    Object.keys(args).forEach(function (key) {
        _this[key] = args[key];
    });
    console.log(this);
}
MetaComponent.prototype.updateVirtualElement = function (props) {
    if (this.componentType === "class") {
        this.virtualElement = this.instance.render();
    } else if (this.componentType === "functional") {
        this.virtualElement = this.instance(props);
    } else throw new TypeError('componentType is invalid');
}
MetaComponent.prototype.renderVirtualElement = function (props) {
    if (!this.virtualElement) {
        this.updateVirtualElement(props);
    }
    return this.virtualElement;
}
MetaComponent.prototype.reconstructInstance = function (props = undefined) {
    this.props = props
    this.instance = new this.archetype(this.props);
    this.updateVirtualElement(this.props);
}
// END META COMPONENT =====================================================



const VirtualElement = function (type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
}
VirtualElement.prototype.constructor = VirtualElement;

// Wrapper class for identifying functional components
const FunctionalComponent = function (archetype) {
    this.archetype = archetype;
};
FunctionalComponent.prototype.constructor = FunctionalComponent;
FunctionalComponent.prototype.instantiate = function (args = {
    props: null,
    $element: null,
}) {
    return new MetaComponent({
        instanceID: ("" + Math.random()).slice(2),
        archetype: this.archetype,
        instance: (args) => archetype(args), // curried archetype function bound to this MetaComponent instance
        props: args.props,
        virtualElement: null,
        $element: args.$element,
        componentType: "class"
    });
}


// Wrapper class for identifying class components
const ClassComponent = function (archetype) {
    this.archetype = archetype;
};
ClassComponent.prototype.constructor = ClassComponent;
ClassComponent.prototype.instantiate = function (args = {
    props: null,
    $element: null,
}) {
    return new MetaComponent({
        instanceID: ("" + Math.random()).slice(2),
        archetype: this.archetype,
        instance: new this.archetype(args.props),
        props: args.props,
        virtualElement: null,
        $element: args.$element,
        componentType: "class"
    });
}

const functionalComponent = function (component) {
    return new FunctionalComponent(component);
}
const classComponent = function (component) {
    return new ClassComponent(component);
}
const createVirtualElement = (type, props = {}, children = []) => {
    let _type;
    if (type instanceof VdomComponent) {
        _type = new ClassComponent(type);
    } else {
        _type = type;
    }
    return new VirtualElement(_type, props, children);
}









function vdomInitialRender(domRootNode, virtualRootNode) {
    if (!virtualRootNode) return undefined;
    let target = {};
    function walk($node, vNode) {
        if (vNode.type instanceof ClassComponent) {
            const instance = ClassComponent.instantiate({props: vNode.props, $element: $node}); // creates MetaComponent instance
            console.dir('Component Instance:', instance);
            
        }
        else {
            target.type = vNode.type;
            target.props = vNode.props
        }
        
        
    }


}

function buildVirtualDomTree(newVirtualRootNode = undefined, oldVirtualRootNode) {

    if (!newVirtualRootNode) {
        return undefined;
    };
    if (!oldVirtualRootNode) {
        return vdomInitialRender(newVirtualRootNode);
    }

    let target = {}
    walkVirtualDOM(rootVirtualNode);
    return target;

    function walkVirtualDOM(vElement) {
        if (vElement.type instanceof ClassComponent) {

        }


        if (vElement.children) {

        }
    }


}


// TESTING ===========================================================================================


class TestClass1 {
    constructor(props) {
        this.props = props;
        this.randomID = ("" + Math.random()).slice(3);
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
            createVirtualElement('div', { className: 'header-wrapper' }, [
                createVirtualElement('h1', { className: 'app-header', style: { backgroundColor: 'blue' } }, [
                    "Header Text"
                ])
            ])
        );
    }
};


// testing ClassComponent mutations in the render tree
let classComp1 = classComponent(TestClass1);
let classComp2 = classComponent(TestClass1);
console.dir(classComp1);
console.dir(classComp2);
console.log(classComp1 === classComp2);
console.log(classComp1.archetype === classComp2.archetype);

let inst1 = classComp1.instantiate({ props: { sayHi: 'Hello' } });
let inst2 = classComp1.instantiate({ props: { anotherProp: 42 } });

console.dir(inst1);
console.dir(inst2);
console.log(inst1 === inst2);
console.log(inst1.instanceID.length);

let testVElement = inst1.renderVirtualElement();
console.dir(inst1);
console.dir(testVElement);
console.log(inst1.virtualElement === testVElement);





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


// testing FunctionalComponent mutations in the render tree
let funcComp1 = functionalComponent(testFunc1);
let funcComp2 = functionalComponent(testFunc1);

console.dir(funcComp1);
console.dir(funcComp2);
console.log(funcComp1 === funcComp2);

let inst3 = funcComp1.instantiate({props: {headerClassName: "pizza"}});
let inst4 = funcComp1.instantiate({props: {headerClassName: "never-gonna-give-you-up"}});

console.dir(inst3);
console.dir(inst4);
