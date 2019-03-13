
const { vdomDebugger } = require('./vdom-debugger');
import { updateElement } from './vdom-update-element';
console.log(vdomDebugger);

const createVDOM = function () {

    /* Constructing the virtual DOM class to export */
    let VDOM = {};

    VDOM.$rootNode = undefined;
    VDOM.currentRenderTree = undefined; // To be defined after first application update
    VDOM.rootComponent = undefined;

    const setRootComponent = (rootComp) => {
        if (rootComp && 'render' in rootComp) {
            rootComponent = rootComp;
        } else {
            console.error('Invalid Root Component:', rootComp);
        }
    }

    // ==============================================================================================
    // =================================  DOM Manipulation Methods  =================================
    // ==============================================================================================

    const VirtualElement = function (type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }
    VirtualElement.prototype.constructor = VirtualElement;

    // Component wrapper classes -- defines the type of function
    const FunctionalComponent = function (component, props = {}, children = []) {
        this.component = component;
        this.props = props;
        this.children = children;
        this.componentInstance = null
        this.rootVirtualNode = null;
        this.rootDOMNode = null;
        this.componentID = null;
        this.componentType = 'functional';
    };
    FunctionalComponent.prototype.constructor = FunctionalComponent;
    const ClassComponent = function (component, props = {}, children = []) {
        this.component = component;
        this.props = props;
        this.children = children;
        this.componentInstance = null
        this.rootVirtualNode = null;
        this.rootDOMNode = null;
        this.componentID = null;
        this.componentType = 'class';
    };
    ClassComponent.prototype.constructor = ClassComponent;

    const functionalComponent = function (component) {
        return new FunctionalComponent(component);
    }

    const classComponent = function (component) {
        return new ClassComponent(component, props, children);
    }

    const createVirtualElement = (type, props = {}, children = []) => {
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
        else { throw new TypeError("Invalid argument 'type' for renderElement()") };
    }











    const componentLifecycle = function (component) {
        // to be filled out later;
        console.log(component);
        let result;
        result = component.render();
        return result;
    };


    const filterAndCopy = function (sourceItem) {

        // console.log('Source Item:', sourceItem);
        if (!sourceItem) { // catch undefined value, handled by update function.
            return sourceItem;
        }

        let targetItem;

        if (typeof sourceItem === 'object') {
            if (Array.isArray(sourceItem) === true) {
                targetItem = [];
                for (let i = 0; i < sourceItem.length; i++) {
                    targetItem[i] = filterAndCopy(sourceItem[i]);
                };
            } else {
                targetItem = {};
                if (sourceItem instanceof VdomComponent || 'render' in sourceItem) {
                    targetItem = filterAndCopy(sourceItem.render());
                }
                else {
                    Object.keys(sourceItem).forEach((k) => {
                        targetItem[k] = filterAndCopy(sourceItem[k]);
                        // if (sourceItem[k] === targetItem[k]) {
                        //     console.log('_______EQUAL', sourceItem[k]);
                        //     console.log(sourceItem[k] === targetItem[k]);
                        // } else {
                        //     console.log('_NOT EQUAL', sourceItem[k]);
                        //     console.log(sourceItem[k] === targetItem[k]);

                        // }
                    });
                }
            }
        } else {
            targetItem = sourceItem;
        }
        // console.log('Target Item:', targetItem);
        return targetItem;
    }

    const buildRenderTree = function () {
        // Expected types for renderedItem: VdomComponent, function, object,
        const rootObject = VDOM.rootComponent.render();
        const result = filterAndCopy(rootObject);


        return result;
    }

    const updateRealDOM = function ($parent, newRenderTree, oldRenderTree) {
        console.log('Updating Real DOM @', $parent);
        // Starting point for algorithm to diff VDOM instances and apply changes to the real DOM.
        updateElement($parent, newRenderTree, oldRenderTree);
    }

    const updateVirtualDOM = function () {
        console.log('____________________________ UPDATING ____________________________');
        console.log('Old Virtual DOM Tree:');
        console.log(currentRenderTree);

        const newRenderTree = buildRenderTree();

        console.log('New Virtual DOM Tree:');
        console.log(newRenderTree);

        updateRealDOM($rootNode, newRenderTree, currentRenderTree);
        currentRenderTree = filterAndCopy(newRenderTree);

        console.log('______________________________ DONE ______________________________');
    }

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


    const extendObject = function (targetObj, newObj) {
        // agnostic tool to map object properties onto another object
        let keys = Object.keys(newObj), i = keys.length;
        while (i--) {
            targetObj[keys[i]] = newObj[keys[i]];
        };
        return targetObj;
    }

    // createClass is a class extension pattern for ES5 that imitates ES6 syntactic sugar.
    const createClass = function (SuperClass, ClassConstructor, protoMethods, staticMethods) {
        ClassConstructor.prototype = Object.create(SuperClass.prototype);
        ClassConstructor.prototype.constructor = ClassConstructor;
        if (protoMethods) { extendObject(ClassConstructor.prototype, protoMethods); }
        if (staticMethods) { extendObject(ClassConstructor, staticMethods); }
        return ClassConstructor;
    }



    const config = function (options = {
        rootNode: undefined,
        rootComponent: undefined,
        plugins: undefined,
        mixins: undefined,
    }) {
        if (options.rootNode) {
            if (options.rootNode instanceof Node) {
                $rootNode = options.rootNode;
            } else throw new TypeError("Invalid argument type for 'rootNode'");
        }
        if (options.rootComponent) {
            if ('render' in options.rootComponent) {
                setRootComponent(options.rootComponent);
            } else throw new TypeError("Invalid argument type for 'rootComponent'");
        }
    }

    return {
        oldRenderTree: currentRenderTree,
        VdomComponent: VdomComponent,
        createClass: createClass,
        createVirtualElement: createVirtualElement,
        v$: createVirtualElement,
        setRootComponent: setRootComponent,
        config: config
    };
}




const VDOM = createVDOM();
console.log('VDOM Library Loaded');

module.exports = VDOM;

// =============================================================================================
// =========================================  TESTING  =========================================
// =============================================================================================






