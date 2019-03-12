
const { vdomDebugger } = require('./vdom-debugger');
console.log(vdomDebugger);

const createVDOM = function () {

    /* Constructing the virtual DOM class to export */
    let VDOM = {}

    VDOM.$rootNode = undefined;
    VDOM.currentRenderTree = undefined; // To be defined after first application update
    VDOM.rootComponent = undefined;
    VDOM.setRootComponent = (rootComp) => {
        if (rootComp && 'render' in rootComp) {
            VDOM.rootComponent = rootComp;
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
    const FunctionalComponent = function (component) {
        this.component = component;
        this.props = null;
        this.children = null;
        this.componentInstance = null
        this.rootVirtualNode = null;
        this.rootDOMNode = null;
        this.componentID = null;
        this.componentType = 'functional';
    };
    FunctionalComponent.prototype.constructor = FunctionalComponent;
    const ClassComponent = function (component) {
        this.component = component;
        this.props = null;
        this.children = null;
        this.componentInstance = null
        this.rootVirtualNode = null;
        this.rootDOMNode = null;
        this.componentID = null;
        this.componentType = 'class';
    };
    ClassComponent.prototype.constructor = ClassComponent;
    
    VDOM.createVirtualElement = (type, props = {}, children = []) => {
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
        else { throw new TypeError ("Invalid argument 'type' for renderElement()")};    
    }


    // VDOM.removeEvent = ($target, eventType, useCapture) => {

    // }
    // VDOM.addEvent = ($target = undefined, eventType = undefined, handlerFunction = undefined, options = { preventDefault: false, useCapture: false, stopPropogation: false }) => {

    // }

    VDOM.isCustomProp = (name) => {
        return false // For now...
    }
    VDOM.setBooleanProp = ($target, propName, value) => {
        if (value) {
            $target.setAttribute(propName, value);
            $target[propName] = true;
        } else {
            $target[propName] = false;
        }
    }
    VDOM.removeBooleanProp = ($target, propName) => {
        $target.removeAttribute(propName);
        $target[propName] = false;
    }
    VDOM.setProp = ($target, propName, value = null) => {
        // console.log('Set Prop:', $target.id, propName, value);
        if (VDOM.isCustomProp(propName)) {
            // Temporarily set to return without setting a custom prop. In place for future development purposes.
            return;
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
            VDOM.setBooleanProp($target, propName, value);
        }


        else {
            $target.setAttribute(propName, value);
        }
    }
    VDOM.removeProp = function ($target, propName, value = null) {
        if (VDOM.isCustomProp(propName)) {
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
            VDOM.removeBooleanProp($target, propName);
        }
    }
    VDOM.updateProp = function ($target, propName, newValue, oldValue) {
        // console.log("____ update SINGLE prop ____");

        if (!newValue) {
            VDOM.removeProp($target, propName, oldValue);
        } else if (!oldValue) {
            // console.log("Old prop value is undefined");
            VDOM.setProp($target, propName, newValue);
        } else if (newValue !== oldValue) {
            // Logging to see how many are set during each update;
            if (propName === "events") {
                /*
                KNOWN BUG & WORK-AROUND:

                There is currently an issue where event handler functions in old/new
                virtual DOM instances are evaluating as unequal, despite their
                contexts referring to the same Component class constructor function.
                Below is a workaround that removes the old event listener and adds the new
                one for each VDOM update cycle. This may become a performance issue as more
                event listeners are added in larger applications.

                Currently working on alternative solution that uses top-level event delegation
                at the document level for all event types. This would eliminate the need for new
                event listeners, but it doesn't solve the underlying prop-diffing error,
                so it would still add new event handler functions as props to the virutal DOM.
                These would still need to be removed on each update as a work-around until we
                find a way to maintain references to the original bound event handler functions.
                */
                if (oldValue.click && newValue.click) {
                    // console.log("oldvalue:", oldValue.click);
                    // console.log("newValue:", newValue.click);

                    console.log(oldValue.click === newValue.click);
                    console.log(oldValue.click == newValue.click);

                    // vdomDebugger.data.forEach(handler => {
                    //     if (handler === newValue.click) {console.log(true);}
                    //     else console.log(false);
                    //     if (handler === oldValue.click) {console.log(true, 'Old Handler Equal?');}
                    //     else console.log(false);
                    // });

                }
                let args = Array.prototype.slice.call(arguments, 0);
                console.log(args);
                // vdomDebugger.data.push(args);
                VDOM.removeProp($target, propName, oldValue);
            }


            VDOM.setProp($target, propName, newValue);
        }
    }
    VDOM.updateProps = ($target, newProps, oldProps) => {
        // console.log('________ updateProps ________', $target.id, $target);

        // console.log('Old Props:', oldProps);
        // console.log('New Props:', newProps);
        const props = Object.assign({}, newProps, oldProps);
        Object.keys(props).forEach(propName => {
            /* Call updateProp, passing undefined props as __explicitly__ undefined values */

            let np = (newProps && newProps[propName] ? newProps[propName] : undefined);
            let op = (oldProps && oldProps[propName] ? oldProps[propName] : undefined);

            VDOM.updateProp($target, propName, np, op);

        });
    }
    VDOM.createNewElement = (vNode = { type: undefined, props: {}, children: [] }) => {
        console.log("Start VDOM.createNewElement()");
        const createEl = (vNode) => {
            let $element; // <-- will be conditionally defined DOM node.
            const appendChildren = ($el, children) => {
                if (!!$el && children) {
                    children.map((val) => {
                        let res = createEl(val);
                        return res;
                    }).forEach((child, index) => {
                        if ($el && child) {
                            // console.log(`appending`, child, 'to', $el);
                            $el.appendChild(child);
                        }
                    });
                }
            }
            if (typeof vNode === 'string') { // for a string, create textNode
                $element = document.createTextNode(vNode);
            } else if (vNode instanceof Node) {
                $element = vNode;
            } else if (Array.isArray(vNode) === true) { // for arrays of srings, create textNodes
                vNode.forEach((item) => {
                    createEl(item);
                });
            } else if (typeof vNode === 'function') {
                // if a function is passed to 'createNewElement()'
                let funcResult = vNode();
                VDOM.createNewElement(funcResult);
            } else if (vNode === null) {
                $element = document.createTextNode('');
                createEl($element);
            }
            else {
                // console.log('new node created:', vNode);
                $element = document.createElement(vNode.type);
                if (vNode.children) {
                    appendChildren($element, vNode.children);
                }
            }
            if (vNode && vNode.props) {
                VDOM.updateProps($element, vNode.props);
            }
            return $element;
        }
        $node = createEl(vNode);
        return $node;
    }

    VDOM.nodeHasChanged = (vNode1, vNode2) => {
        if (typeof vNode1 !== typeof vNode2) {
            return true;
        };
        if (typeof vNode1 === 'string' && vNode1 !== vNode2) {
            return true;
        };
        if (vNode1.type !== vNode2.type) {
            return true;
        };
        return false;
    }

    // Main virtual DOM diffing algorithm.
    // 'newNode' and 'oldNode' represent two (potentially different) versions of the same target node.
    // If there are differences between versions, newNode will take precedence.
    // If the node was scheduled for removal from the DOM, then we expect to see
    VDOM.updateElement = ($parent, newNode, oldNode, index = 0) => {
        console.log(newNode);
        if (!oldNode) {             /* If reference to cached node does not exist */
            const $node = VDOM.createNewElement(newNode);
            if ($node instanceof Node) { /* In case a component or function is called, the return value should be of type Node */
                $parent.appendChild($node);
            }
        } else if (!newNode) {      /* If reference to old node exists but the new node is undefined */
            $parent.removeChild($parent.childNodes[index]);
        } else if (typeof newNode === 'object' && newNode.render) {
            VDOM.updateElement($parent, newNode.render(), oldNode.render(), index);
        }
        else if (VDOM.nodeHasChanged(newNode, oldNode) === true) {
            $parent.replaceChild(VDOM.createNewElement(newNode), $parent.childNodes[index]);
        } else if (newNode.type) {
            /* If both versions of the target node exist
            (i.e. the node has already been created and hasn't been removed from the document) */
            VDOM.updateProps($parent.childNodes[index], newNode.props, oldNode.props);
            const newLength = newNode.children.length;
            const oldLength = oldNode.children.length;
            /* Recursively iterate through 'children' array of $parent node,
            stopping at the length of longest array, to ensure we run through each possible child.*/
            for (let i = 0; (i < newLength || i < oldLength); i++) {
                // console.log('BEFORE UPDATING PROPS:', 'index:', index, 'id:', $parent.childNodes[index].id,  $parent.childNodes[index].style);
                VDOM.updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
                // console.log('AFTER UPDATING PROPS:', 'index:', index, 'id:', $parent.childNodes[index].id,  $parent.childNodes[index].style);
            }
        }
    };

    VDOM


    VDOM.componentLifecycle = function (component) {
        // to be filled out later;
        console.log(component);
        let result;
        result = component.render();
        return result;
    };


    const filterAndCopy = function (sourceItem) {

        // console.log('Source Item:', sourceItem);
        if (!sourceItem) {
            return sourceItem;
        }

        // if (typeof sourceItem === 'function') { 
        //     console.log('FUNCTION', sourceItem);
        //     return sourceItem;
        // }

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
                } if (sourceItem instanceof ClassComponent) {
                    return null;
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

    VDOM.buildRenderTree = function () {
        // Expected types for renderedItem: VdomComponent, function, object,
        const rootObject = VDOM.rootComponent.render();
        const result = filterAndCopy(rootObject);


        return result;
    }

    VDOM.updateRealDOM = function ($parent, newRenderTree, oldRenderTree) {
        console.log('Updating Real DOM @', $parent);
        // Starting point for algorithm to diff VDOM instances and apply changes to the real DOM.
        VDOM.updateElement($parent, newRenderTree, oldRenderTree);
    }

    VDOM.updateVirtualDOM = function () {
        console.log('____________________________ UPDATING ____________________________');
        console.log('Old Virtual DOM Tree:');
        console.log(VDOM.currentRenderTree);
        if (VDOM.currentRenderTree) {
            console.log(VDOM.currentRenderTree.children[1].children[3].props.events.click);
            vdomDebugger.data.push(VDOM.currentRenderTree.children[1].children[3].props.events.click);
        }
        const newRenderTree = VDOM.buildRenderTree();
        console.log('New Virtual DOM Tree:');
        console.log(newRenderTree);

        VDOM.updateRealDOM(VDOM.$rootNode, newRenderTree, VDOM.currentRenderTree);
        VDOM.currentRenderTree = filterAndCopy(newRenderTree);
        if (VDOM.currentRenderTree && newRenderTree) {
            console.log(
                newRenderTree.children[1].children[3].props.events.click ===
                VDOM.currentRenderTree.children[1].children[3].props.events.click
            );
        }



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
        return new Error('VDOM.render is undefined');
    }
    VdomComponent.prototype.update = () => {
        VDOM.updateVirtualDOM();
    }
    VdomComponent.prototype.setState = (newState) => {
        if (newState) {
            Object.keys(newState).forEach((prop) => {
                VdomComponent.state[prop] = newState[prop];
            });
        }
    }
    

    // createClass is a class extension pattern for ES5 that imitates ES6 syntactic sugar.
    const createClass = function (SuperClass, ClassConstructor, protoMethods, staticMethods) {
        ClassConstructor.prototype = Object.create(SuperClass.prototype);
        ClassConstructor.prototype.constructor = ClassConstructor;
        if (protoMethods) { extendObject(ClassConstructor.prototype, protoMethods); }
        if (staticMethods) { extendObject(ClassConstructor, staticMethods); }
        return ClassConstructor;
    }




    VDOM.config = function (options = {
        rootNode: undefined,
        rootComponent: undefined,
        plugins: undefined,
        mixins: undefined,
    }) {
        if (options.rootNode) {
            if (options.rootNode instanceof Node) {
                VDOM.$rootNode = options.rootNode;
            } else throw new TypeError("Invalid argument type for 'rootNode'");
        }
        if (options.rootComponent) {
            if ('render' in options.rootComponent) {
                VDOM.setRootComponent(options.rootComponent);
            } else throw new TypeError("Invalid argument type for 'rootComponent'");
        }
    }

    return {
        oldRenderTree: VDOM.currentRenderTree,
        Component: Component,
        VdomComponent: VdomComponent,
        createClass: createClass,
        createVirtualElement: VDOM.createVirtualElement,
        v$: VDOM.createVirtualElement,
        setRootComponent: VDOM.setRootComponent,
        config: VDOM.config
    };
}




const VDOM = createVDOM();
console.log('VDOM Library Loaded');

module.exports = VDOM;

// =============================================================================================
// =========================================  TESTING  =========================================
// =============================================================================================






