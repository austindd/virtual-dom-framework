

// // =====================================================================================
// // ======================================== ES5 ========================================
// // =====================================================================================
// let ES5_constructor = function (props = {}) {
//     // this.name = "ES5_constructor";
//     this.life = 42;
//     this.props = props;
//     this.method1 = function () {
//         console.log('method1 called from es5 instance');
//     }
// }
// ES5_constructor.prototype.method1 = function () {
//     console.log('method1 called from es5 prototype');
// }
// let es5_instance = new ES5_constructor();



// // =====================================================================================
// // ======================================== ES6 ========================================
// // =====================================================================================

// class ES6_class {
//     constructor(props = {}) {
//         this.name = "ES6_class";
//         this.life = 42;
//         this.props = props;
//     }
//     method1() {
//         console.log('method1 called from es6 instance');
//     }
// }
// let es6_instance = new ES6_class();
// // es6_instance.prototype = ES6_class;
// // ===================================================================


// class testClass extends ES5_constructor {
//     constructor(props) {
//         super(props);
//         this.id = 12345;
//     }
// }

// let testInstance = new testClass({ list: [1, 2, 3] });

// console.log(testClass);
// console.log(testInstance);



// // ====================    TESTING

// console.log();
// console.log();


// // ===============================================================================

// console.group('----- ES5 Constructor Function -----');
// console.log(typeof ES5_constructor);
// console.log(ES5_constructor);
// console.log(ES5_constructor.constructor);
// console.log(ES5_constructor.name);
// console.log(ES5_constructor.life);
// console.log(ES5_constructor.method1);

// console.log();
// console.log();
// console.groupEnd();



// console.group('----- ES5 Constructor Prototype -----');
// console.log(typeof ES5_constructor.prototype);
// console.log(ES5_constructor.prototype);
// console.log(ES5_constructor.prototype.constructor);
// console.log(ES5_constructor.prototype.name);
// console.log(ES5_constructor.prototype.life);
// console.log(ES5_constructor.prototype.method1);
// ES5_constructor.prototype.method1();

// console.log();
// console.log();
// console.groupEnd();



// console.group('----------- ES5 Instance -----------');
// console.log(typeof es5_instance);
// console.log(es5_instance);
// console.log(es5_instance.constructor);
// console.log(es5_instance.name);
// console.log(es5_instance.life);
// console.log(es5_instance.method1);
// es5_instance.method1();

// console.log();
// console.log();
// console.groupEnd();


// // ===============================================================================

// console.group('----- ES6 Constructor Function -----');
// console.log(typeof ES6_class);
// console.log(ES6_class);
// console.log(ES6_class.constructor);
// console.log(ES6_class.name);
// console.log(ES6_class.life);
// console.log(ES6_class.method1);
// console.log();
// console.log();
// console.groupEnd();



// console.group('----- ES6 Constructor Prototype -----');
// console.log(typeof ES6_class.prototype);
// console.log(ES6_class.prototype);
// console.log(ES6_class.prototype.constructor);
// console.log(ES6_class.prototype.name);
// console.log(ES6_class.prototype.life);
// console.log(ES6_class.prototype.method1);
// ES6_class.prototype.method1();

// console.log();
// console.log();
// console.groupEnd();



// console.group('----------- ES6 Instance -----------');
// console.log(typeof es6_instance);
// console.log(es6_instance);
// console.log(es6_instance.constructor);
// console.log(es6_instance.name);
// console.log(es6_instance.life);
// console.log(es6_instance.method1);
// es6_instance.method1();

// console.log();
// console.log();
// console.groupEnd();







// function MySuperClass(name, props = {}) {
//     this.name = name;
//     this.props = props;
// }
// MySuperClass.prototype.sayHi = function () {
//     console.log("Hello");
//     return "World";
// }



// const createClass = function (name, superClass = Function, props = {}) {

//     let _staticMixins = function () { };

//     let _CreateClass = function (name, props) {
//         this.name = name;
//         this._super.call(this, props);
//     }
//     _CreateClass.prototype = Object.create(superClass.prototype);
//     _CreateClass.prototype.constructor = _CreateClass;
//     _CreateClass.prototype._super = superClass;

//     Object.keys(props).forEach(function (propName) {
//         if (props[propName].value) {
//             switch (props[propName]['place']) {
//                 case 'proto':
//                     _CreateClass.prototype[propName] = props[propName].value;
//                     break;
//                 case 'static':
//                     _staticMixins[propName] = props[propName].value;
//                     break;
//                 case 'this':
//                 case undefined:
//                 case null:
//                     _CreateClass[propName] = props[propName].value;
//                     break;
//             }
//         }
//     });


// }

// let myClass = createClass('myClass', MySuperClass, {
//     name: {
//         place: 'this',
//         value: 'myClass'
//     },
//     sayBye: {
//         place: 'proto',
//         value: function sayBye() {
//             console.log('Bye');
//             return "World";
//         }
//     }
// });

// const extendClass = function () {

// }


// createClassTemplate = function () {
//     function assignProps(obj, props) {
//         const propNames = Object.keys(props);
//         for (let i = 0; i < propNames.length; i++) {
//             obj[propNames[i]] = props[propNames[i]];
//         }
//         return obj;
//     }
//     function defineSubclass(superConstructor, subConstructor, instanceMethods) {

//     }



//     const GenericClass = function () { };
//     GenericClass.prototype.extendClass = function (superClass, ) {

//     }

// }




const updateElement = function () {

}

const childrenHaveChanged = function (newChildren, oldChildren) {

}

const eventPropsHaveChanged = function (newEventProps, oldEventProps) {

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

const testChanged = function () {
    let newProps = { first: 0, second: 'two', third: { 'three': 3 } };
    let oldProps = { first: 1, second: 'two', third: { 'three': 4 } };
    let res = propsHaveChanged(newProps, oldProps);
    console.log(res);
}

// testChanged();



// const buildNewRenderTree = function (component) {

// }




const extendObject = function (targetObj, newObj) {
    // agnostic tool to map object properties onto another object
    let keys = Object.keys(newObj), i = keys.length;
    while (i--) {
        targetObj[keys[i]] = newObj[keys[i]];
    };
    return targetObj;
}












// =================================================================
// Component Composition

const VirtualElement = function (type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
}
// Type Callable Function
const FunctionalComponent = function (component) {
    this.component = component;
    this.props = null;
    this.children = null;
};
FunctionalComponent.prototype.constructor = FunctionalComponent;
const ClassComponent = function (component) {
    this.component = component;
    this.props = null;
    this.children = null;
};
ClassComponent.prototype.constructor = ClassComponent;

let gCounter = 0;

// Type Class
const Component = function (props = {}) {
    gCounter++;
    if (props) {
        Object.keys(props).forEach(function (propName) {
            this.propName = props[propName];
        });
    }
    this.state = {};
    console.trace({ gCounter });
};
Component.prototype = Object.create(Object);
Component.prototype.constructor = Component;
Component.prototype.render = function () {
    throw new Error('VDOM.render must be defined');
}
Component.prototype.update = (options = { forceUpdate: false }) => {
    // VDOM.updateVirtualDOM();
}
Component.prototype.setState = (newState) => {
    if (newState) {
        Object.keys(newState).forEach((prop) => {
            Component.state[prop] = newState[prop];
        });
    }
}

const createClass = function (SuperClass, ClassConstructor, protoMethods, staticMethods) {
    ClassConstructor.prototype = Object.create(SuperClass.prototype);
    ClassConstructor.prototype.constructor = ClassConstructor;
    if (protoMethods) { extendObject(ClassConstructor.prototype, protoMethods); }
    if (staticMethods) { extendObject(ClassConstructor, staticMethods); }
    return ClassConstructor;
}

const functionalComponent = function (component) {
    return new FunctionalComponent(component);
}

const classComponent = function (component) {
    component.prototype = Object.create(ClassComponent)
}

const renderElement = function (type, props = {}, children = []) {
    if (type instanceof FunctionalComponent) {
        type.props = props; type.children = children;
        return type;
    }
    else if (type instanceof ClassComponent) {
        type.props = props; type.children = children;
        return type;
    }
    else if (typeof type === 'string') {
        return new VirtualElement(type, props, children);
    }
}

// TESTING =================================================================================================


// class TestClass1 extends Component {
//     constructor(props) {
//         super(props);
//         this.props = props;
//         this.randomID = ("" + Math.random()).slice(2);
//         this.item = 'item';
//         this.staticMethod1 = function () {
//             return 'staticMethod1';
//         }
//         this.boundStaticMethod = () => {
//             return 'boundStaticMethod';
//         }
//     }

//     protoMethod1() {
//         return 'protoMethod1';
//     }
//     protoMethod2() {
//         return 'protoMethod2 is bound to constructore';
//     }
// }


// console.dir(TestClass1);


const TestClass2 = createClass(
    Component,
    function TestClass2(props) {
        Component.apply(this, arguments);
        this.props = props;
        console.dir(this);
        this.stuff = 'newStuff';
        this.myMethod1 = this.myMethod1.bind(this);
    }, {
        myMethod1: function () {
            return this.props;
        },
    }, {
        myStaticMethod: function () {
            return this;
        }
    }
)
TestClass2.prototype.subClassProtoMethod = function (things) {
    return things;
}

let ttt = new TestClass2({ prop1: 'idospahidopsaf' });


console.dir({ ttt });
console.dir(ttt.myMethod1());

console.dir(TestClass2.constructor);
console.dir(TestClass2.myStaticMethod());
