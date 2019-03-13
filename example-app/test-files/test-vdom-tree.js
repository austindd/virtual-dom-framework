

// input root virtual node
// output virtual DOM tree

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

const ComponentInstance = function (args = {
    instanceID: null,
    archetype: null,
    instance: null,
    props: null,
    virtualElement: null,
    domElement: null,
    componentType: null
}) {
    const _this = this;
    Object.keys(args).forEach(function (key) {
        _this[key] = args[key];
    });
    console.log(this);
}
ComponentInstance.prototype.renderInstance = function () {
    if (!this.virtualElement) {
        console.log('dfjioaphfds', true);
        this.virtualElement = this.instance.render();
    }
    return this.virtualElement;    

}


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





// Wrapper class for identifying class components
const ClassComponent = function (archetype) {
    this.archetype = archetype;
};
ClassComponent.prototype.constructor = ClassComponent;
ClassComponent.prototype.createInstance = function (args = {
    props: null,
    domElement: null,
}) {
    return new ComponentInstance({
        instanceID: ("" + Math.random()).slice(2),
        archetype: this.archetype,
        instance: new this.archetype(args.props),
        props: args.props,
        virtualElement: null,
        domElement: args.domElement,
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
    return new VirtualElement(type, props, children);
}




function buildComponentTree (rootComponent = undefined) {

    if (!rootComponent) {
        return rootComponent;
    };

    let target = {}
    walkVirtualDOM(rootVirtualNode);
    return target;

    function walkVirtualDOM (vElement) {
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
        return(
            createVirtualElement('div', {className: 'header-wrapper'}, [
                createVirtualElement('h1', {className: 'app-header', style: {backgroundColor: 'blue'}}, [
                    "Header Text"
                ])
            ])
        );
    }
};

let classComp1 = classComponent(TestClass1);
let classComp2 = classComponent(TestClass1);
console.dir(classComp1);
console.dir(classComp2);
console.log(classComp1 === classComp2);
console.log(classComp1.archetype === classComp2.archetype);

let inst1 = classComp1.createInstance({props: {sayHi: 'Hello'}});
let inst2 = classComp1.createInstance({props: {anotherProp: 42}});

console.dir(inst1);
console.dir(inst2);
console.log(inst1 === inst2);
console.log(inst1.instanceID.length);

let testVElement = inst1.renderInstance();
console.dir(inst1);
console.dir(testVElement);
console.log(inst1.virtualElement === testVElement);