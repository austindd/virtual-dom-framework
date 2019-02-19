// The one that sweitches to Factory Functions for component class composition

document.addEventListener("DOMContentLoaded", () => {

    
    const createVDOM = (rootNode) => {
        let $rootNode;
        if (typeof rootNode === 'string') {
            $rootNode = document.getElementById(rootNode);
        } else {
            $rootNode = rootNode;
        }
        /* Constructing the virtual DOM class to export */
        let VDOM = function () {
            this.$rootNode = $rootNode;
        }
        VDOM.prototype.currentVirtualDOM = undefined; // To be defined after first application update

        // ==============================================================================================
        // =================================  DOM Manipulation Methods  =================================
        // ==============================================================================================

        VDOM.prototype.VirtualElement = function (type, props = {}, children = []) {
            this.type = type;
            this.props = props;
            this.children = children;
        }
        VDOM.prototype.createVirtualElement = (type, props = {}, children = []) => {
            return new VDOM.prototype.VirtualElement(type, props, children);
        }
        VDOM.prototype.isCustomProp = (name) => {
            return false // For now...
        }
        VDOM.prototype.setBooleanProp = ($target, propName, value) => {
            if (value) {
                $target.setAttribute(propName, value);
                $target[propName] = true;
            } else {
                $target[propName] = false;
            }
        }
        VDOM.prototype.removeBooleanProp = ($target, propName) => {
            $target.removeAttribute(propName);
            $target[propName] = false;
        }
        VDOM.prototype.setProp = ($target, propName, value = null) => {
            if (VDOM.prototype.isCustomProp(propName)) {
                // Temporarily set to return without setting a custom prop. In place for future development purposes.
                return;
            } else if (propName === 'events') {
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
                VDOM.prototype.setBooleanProp($target, propName, value);
            } else {
                $target.setAttribute(propName, value);
            }
        }
        VDOM.prototype.removeProp = ($target, propName, value = null) => {
            if (VDOM.prototype.isCustomProp(propName)) {
                return;
            } else if (propName === 'events') {
                Object.keys(value).forEach((eventName) => {
                    $target.removeEventListener(eventName);
                });
            } else if (propName === 'style') {
                Object.keys(value).forEach((prop) => {
                    $target.style[prop] = null;
                });
            }
            else if (propName === 'className') {
                $target.removeAttribute('class');
            } else if (typeof value === 'boolean') {
                VDOM.prototype.removeBooleanProp($target, propName);
            }
        }
        VDOM.prototype.updateProp = ($target, propName, newValue, oldValue) => {
            if (!newValue) {
                VDOM.prototype.removeProp($target, propName, oldValue);
            } else if (!oldValue || newValue !== oldValue) {
                VDOM.prototype.setProp($target, propName, newValue);
            }
        }
        VDOM.prototype.updateProps = ($target, newProps, oldProps) => {
            // console.log('New Props: ', newProps, '| Old Props:', oldProps)
            const props = Object.assign({}, newProps, oldProps);
            Object.keys(props).forEach(propName => {
                /* Call updateProp, passing undefined props as __explicitly__ undefined values */
                VDOM.prototype.updateProp($target, propName, (newProps ? newProps[propName] : undefined), (oldProps ? oldProps[propName] : undefined));
            });
        }
        VDOM.prototype.nodeHasChanged = (vNode1, vNode2) => {
            if ((typeof vNode1 !== vNode2) || (typeof vNode1 === 'string' && vNode1 !== vNode2) || (vNode1.type !== vNode2.type)) {
                return true;
            } else {
                return false;
            }
        }
        VDOM.prototype.createNewElement = (vNode = { type: undefined, props: {}, children: [] }) => {
            const createEl = (vNode) => {
                let $element; // <-- will be conditionally defined DOM node.
                const appendChildren = ($el, children) => {
                    if(!!$el && !!children) {
                        children.map((val) => {
                            let res = createEl(val);
                            return res;
                        }).forEach((child, index) => {
                            if($el && child) {
                                $el.appendChild(child);
                            }
                        });    
                    }
                }
                if (typeof vNode === 'string') { // for a string, create textNode
                    $element = document.createTextNode(vNode);
                } else if (vNode instanceof Node) {
                    $element = vNode;
                } else if (vNode instanceof Array) { // for arrays of srings, create textNodes
                    vNode.forEach((item) => {
                        if (typeof item === 'string') {
                            createEl(item);
                        }
                    });
                    // } else if (typeof vNode === 'object' && vNode.prototype && 'render' in vNode.prototype) {
                } else if (vNode instanceof VDOMComponent || vNode instanceof ROOTComponent) {
                    let result = vNode.render();
                    $element = document.createElement(result.type);
                    VDOM.prototype.updateProps($element, result.props, null);
                    appendChildren($element, result.children);
                } else if (typeof vNode === 'function') {
                    // if a function is passed to 'createNewElement()'
                    let funcResult = vNode();
                    VDOM.prototype.createNewElement(funcResult);
                } else if (vNode === null){
                    $element = document.createTextNode('');
                    createEl($element);
                }
                else {
                    $element = document.createElement(vNode.type);
                    if (vNode.children) {
                        appendChildren($element, vNode.children);
                    }
                }
                if (vNode && vNode.props) {
                    VDOM.prototype.updateProps($element, vNode.props);
                }
                return $element;
            }
            $node = createEl(vNode);
            return $node;
        }
        VDOM.prototype.isComponent = (vNode) => {
            // Test whether the value passed through a component chain is a VDOM component.
            // VDOM components expect to call the 'render' method, whereas other functions will simply be executed.
            if (vNode instanceof VDOMComponent) {
                return vNode.render(vNode);
            } else if (typeof vNode === 'function') {
                return vNode();
            }
        }
        // Main virtual DOM diffing algorithm.
        // 'newNode' and 'oldNode' represent two (potentially different) versions of the same target node.
        // If there are differences between versions, newNode will take precedence.
        // If the node was scheduled for removal from the DOM, then we expect to see
        VDOM.prototype.updateElement = ($parent, newNode, oldNode, index = 0) => {
            if (!oldNode) {             /* If reference to cached node does not exist */
                const $node = VDOM.prototype.createNewElement(newNode);
                if ($node instanceof Node) { /* In case a component or function is called, the return value should be of type Node */
                    $parent.appendChild($node);
                }
            } else if (!newNode) {      /* If reference to old node exists but the new node is undefined */
                $parent.removeChild($parent.childNodes[index]);
            } else if (VDOM.prototype.nodeHasChanged(newNode, oldNode) === true) {
                $parent.replaceChild(VDOM.prototype.createNewElement(newNode), $parent.childNodes[index]);
            } else if (newNode.type) {
                /* If both versions of the target node exist
                (i.e. the node has already been created and hasn't been removed from the document) */
                VDOM.prototype.updateProps($parent.childNodes[index], newNode.props, oldNode.props);
                const newLength = newNode.children.length;
                const oldLength = oldNode.children.length;
                /* Recursively iterate through 'children' array of $parent node,
                stopping at the length of longest array, to ensure we run through each possible child.*/
                for (let i = 0; (i < newLength || i < oldLength); i++) {
                    VDOM.prototype.updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
                }
            }
        };
        /* Each 'normal' Component instance will be able to call their own 'update' methods,
         Which calls the UNIQUE 'update' method of the ROOT COMPONENT to generate the render tree. */
        VDOM.prototype.rootComponent = undefined;

        VDOM.prototype.setRootComponent = (rootComp) => {
            if (!!rootComp && 'render' in rootComp) {
                VDOM.prototype.rootComponent = rootComp;
            } else {
                console.error('Invalid Root Component');
            }
        }
        VDOM.prototype.v$ = (type, props = {}, children = {}) => {
            return { type, props, children };
        };

        const VDOMComponent = function (props) {
            Object.keys(props).forEach((propName) => {
                this[propName] = props[propName];
            });
            this.selfRef = this;
            if (!this.render) {
                this.render = () => {
                    // To be defined in the component instance.
                    // Initially returns undefined to throw an error if not overwritten.
                    return new Error('ROOTComponent.render is undefined');
                }
            }
            this.update = () => {
                console.log('Root Component:', VDOM.prototype.rootComponent)
                VDOM.prototype.rootComponent.update();
            }
            this.setState = (newState) => {
                console.log('Old State:', this.state);
                if (newState) {
                    Object.keys(newState).forEach((prop) => {
                        this.state[prop] = newState[prop];
                    });
                }
                console.log('New State:', this.state);
            }
        }
        const ROOTComponent = function (props) {
            Object.keys(props).forEach((propName) => {
                this[propName] = props[propName];
            });
            this.selfRef = this;
            if (!this.render) {
                this.render = () => {
                    // To be defined in the component instance.
                    // Initially returns undefined to throw an error if not overwritten.
                    return new Error('ROOTComponent.render is undefined');
                }
            }
            this.update = () => {
                console.log('==================  Updating VDOM  ==================');
                let oldVDOMTree = VDOM.prototype.currentVirtualDOM;
                console.log('Ye Olde VDOM Tree:', oldVDOMTree)
                let newVDOMTree = this.render();
                VDOM.prototype.updateElement($rootNode, newVDOMTree, oldVDOMTree);
                VDOM.prototype.currentVirtualDOM = newVDOMTree;
                console.log("Ye New VDOM Tree:", newVDOMTree);
                console.log('==================  Update Complete  =================');
            }
            this.setState = function (newState) {
                console.log('Old State:', this.state);
                if (newState) {
                    Object.keys(newState).forEach((prop) => {
                        this.state[prop] = newState[prop];
                    });
                }
                console.log('New State:', this.state);
            }
        }
        // createClass is a factory function that creates and returns another factory function. 
        const createClass = function (classProps = {}) {
            let ComponentClass = function (parentProps = {}) {
                let mergedProps = Object.assign({}, classProps, {parentProps: parentProps});
                let componentInstance = new VDOMComponent(mergedProps);
                return componentInstance;
            }
            return ComponentClass;
        }

        return {
            VDOMComponent: VDOMComponent,
            ROOTComponent: ROOTComponent,
            createClass: createClass,
            createVirtualElement: VDOM.prototype.createVirtualElement,
            v$: VDOM.prototype.createVirtualElement,
            setRootComponent: VDOM.prototype.setRootComponent,
        };

    }



    // =============================================================================================
    // =========================================  TESTING  =========================================
    // =============================================================================================


    // ======================================  INITIALIZATION  ======================================

    const ROOT = document.getElementById('ROOT');
    const VDOM = createVDOM(ROOT);
    const ROOTComponent = VDOM.ROOTComponent;
    const VDOMComponent = VDOM.VDOMComponent;
    const createClass = VDOM.createClass;
    const v$ = VDOM.v$;

    // ===================================  A SIMPLE RENDER TREE  ===================================



    // A stateful component which is an instance of VDOMComponent:
    const AppContainer = new VDOMComponent({
        styles: {
            main: {
                margin: '0 auto',
                width: '100%',
                height: '100%',
                backgroundColor: 'f6f6ff',
            }
        },
        handleTextClick: function () {
            console.log('CLICKED');
        },
        render: function () {
            return (
                v$('div', { id: 'App', style: this.styles.main }, [
                    AppHeader,
                    AppBody,
                ])
            );
        }
    });

    const AppHeader = new VDOMComponent({
        styles: {
            appHeader: {
                position: 'relative',
                padding: "1em 0 0 0",
                display: 'block',
                margin: '0',
                width: "100%",
                height: "14vh",
                backgroundColor: 'palevioletred',
                textAlign: 'center',
                boxShadow: '0px 2px 10px #060202'
            },
            titleText: {
                position: 'relative',
                display: 'block',
                margin: '0.25em',
                fontSize: "4em",
                verticalAlign: 'middle',
                color: "#f6f6ff"
            }
        },
        render: function () {
            return (
                v$('div', { className: 'AppHeader', style: this.styles.appHeader }, [
                    v$('h1', { style: this.styles.titleText }, ["Gorgeous Header"])
                ])
            );
        }
    });

    const AppBody = new VDOMComponent({
        styles: {
            appBody: {
                display: 'flex',
                margin: '0',
                width: '100%',
                height: '84.28vh'
            },
            sideBar: {

            },
        },
        updateBGColor: function changeBGColor () {
            const HSVtoRGB = function (h, s, v) {
                var r, g, b, i, f, p, q, t;
                if (arguments.length === 1) {
                    s = h.s, v = h.v, h = h.h;
                }
                i = Math.floor(h * 6);
                f = h * 6 - i;
                p = v * (1 - s);
                q = v * (1 - f * s);
                t = v * (1 - (1 - f) * s);
                switch (i % 6) {
                    case 0: r = v, g = t, b = p; break;
                    case 1: r = q, g = v, b = p; break;
                    case 2: r = p, g = v, b = t; break;
                    case 3: r = p, g = q, b = v; break;
                    case 4: r = t, g = p, b = v; break;
                    case 5: r = v, g = p, b = q; break;
                }
                return {
                    r: Math.round(r * 255),
                    g: Math.round(g * 255),
                    b: Math.round(b * 255)
                };
            }
            const randomHValue = function () {
                let h = Math.random();
                h += (0.618033988749895);
                h %= 1;
                return h;
            }
            let rgbValue = HSVtoRGB(randomHValue(), 0.5, 0.95);
            console.log('New Background Color', rgbValue);
            let cssColorString = `rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`;

            this.styles.appBody.backgroundColor = cssColorString;
            console.log(this.styles.appBody);
            this.update();
        },
        render: function () {
            return (
                v$('div', { id: 'AppBody', style: this.styles.appBody }, [
                    ContentCol({updateBGColor: this.updateBGColor.bind(this), key: 1, textValue: "Most of these panels"}),
                    ContentCol({updateBGColor: this.updateBGColor.bind(this), key: 2, textValue: "will change the background color"}),
                    ContentCol({updateBGColor: this.updateBGColor.bind(this), key: 3, textValue: "when you CLICK them"}),
                    ContentCol({updateBGColor: this.updateBGColor.bind(this), key: 4, textValue: "But not ALL of them..."}),
                    ContentCol({key: 5, textValue: "At least, not THIS one."}),

                ])
            )
        }
    });


    const ContentCol = createClass({
        styles: {
            ContentCol: {
                display: 'block',
                margin: '0 auto',
                padding: '30px 2px 10px 2px',
                height: '12em',
                width: '20vh',
                backgroundColor: 'lightblue',
                border: '1px solid black',
                textAlign: 'center',
            }
        },
        textValue: null,
        getTextValue: function () {
            if (this.parentProps && this.parentProps.textValue) {
                return this.parentProps.textValue;
            } else return "";
        },
        handleClick: function () {
            console.log('Clicked!');
            if (this.parentProps.updateBGColor) {
                this.parentProps.updateBGColor();
            }
            return;
        },
        render: function () {
            if (this.parentProps.textValue) {
                this.textValue = this.parentProps.textValue;
            }
            return (
                v$('div', { id: this.parentProps.key, className: 'ContentCol', style: this.styles.ContentCol, events: {click: this.handleClick.bind(this) } }, [
                    this.textValue
                ])
            )
        }
    });


    // ===============================================================================================
    // ===============================================================================================
    // =================================   APPLICATION ENTRY POINT   =================================
    // ===============================================================================================
    // ===============================================================================================

    console.log(AppContainer)
    const MyApplication = new ROOTComponent({
        render: () => {
            return (
                AppContainer
            );
        }
    })
    /*
    Establish the root component of the application
    (determines starting point for diffing Virtual DOM tree)
    */
    VDOM.setRootComponent(MyApplication);
    MyApplication.update();








    

    // ===============================================================================================
    // =====================================  UNUSED COMPONENTS  =====================================
    // ===============================================================================================


    // // Simple stateless functional component, capable of recieving props from its parent,
    // // Note: this is not an instance of VDOMComponent class.
    // // It's similar to vNodeFunction but passes props and defines additional methods.
    // const simpleComponent = (props) => {
    //     this.props = props;
    //     handleTextClick = () => {
    //         console.log('CLICKED');
    //         return;
    //     }
    //     return (
    //         v$('div', { id: 'wrapper-div-1', style: { width: '50vh', margin: '0 auto', backgroundColor: 'lightgreen' } }, [
    //             v$('p', { style: { textAlign: 'center' }, events: { click: handleTextClick.bind(this) } }, ['This is a stateless component']),
    //             v$('p', { style: { textAlign: 'center', color: 'darkblue' }, events: { click: handleTextClick.bind(this) } }, ['It is designed to accept properties from its parent component']),
    //             v$('p', { style: { textAlign: 'center' }, events: { click: handleTextClick.bind(this) } }, ['It returns a "virtual node"']),
    //         ])
    //     );
    // };

    // // Simple function returning a compatible vNode object:
    // const vNodeFunction = () => {
    //     return (
    //         v$('div', { id: 'wrapper-div-1', style: { width: '50vh', margin: '0 auto', backgroundColor: 'yellow' } }, [
    //             v$('p', { style: { textAlign: "center", color: "red" } }, ['This is just a function that returns a set of nested virtual nodes']),
    //             v$('p', { style: { textAlign: "center" } }, ['This is a <p> element with text']),
    //             v$('p', { style: { textAlign: "center" } }, ['And ANOTHER one!']),
    //         ])
    //     );
    // }

});



