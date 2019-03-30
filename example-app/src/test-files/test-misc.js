document.addEventListener('DOMContentLoaded', function () {

    // Helper Functions
    function createButton(text = "test", handler = null, parent = null, styles = {}) {
        let btn = document.createElement('button');
        let btnText = document.createTextNode(text);
        btn.appendChild(btnText);
        Object.keys(styles).forEach((x) => {
            btn.style[x] = styles[x];
        });
        btn.onclick = handler;
        if (parent) {
            parent.appendChild(btn);
        }
        return btn;
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



    // Experiments




    const _DOMRenderStack = [];

    const domActions = {
        createNode: {},
        destroyNode: {},
        replaceNode: {
            with: null
        },
        updateNode: {},
        appendNodeTo: null,
        moveNode: {
            fromIndex: null,
            toIndex: null
        },


    }


    class VNodePair {
        constructor(newVN = null, oldVN = null, key = null, $nodeRef = null, action = null) {
            this.newVN = newVN;
            this.oldVN = oldVN;
            this.key = key;
            this.$nodeRef = $nodeRef;
            this.action = action;
            this.completedAction = false;
            this.__$type$__ = null // for now...
        }

    }



    function createChildMap(newChildren = [], oldChildren = [], callback = function callback(x) { return x }) {
        // Setup...
        const
            childMap = { byKey: {}, byNewChildren: [], byOldChildren: [] },
            maxLength = newChildren.length > oldChildren.length ? newChildren.length : oldChildren.length,
            _placeholder = { _placeholder: true },
            _newChildren = [], _oldChildren = [],
            _newStack1 = [], _newStack2 = [],
            _oldStack1 = [], _oldStack2 = [];

        for (let i = 0; i < maxLength; ++i) {
            _newChildren[i] = newChildren[i] || null;
            _oldChildren[i] = oldChildren[i] || null;

        }
        // End Setup...

        // Create childMap.byKeys object, which we will need to reference when sorting children later
        for (let i = 0; i < maxLength; i++) {
            const newChild = _newChildren[i];
            const oldChild = _oldChildren[i];
            if (newChild) {
                newChild.index = i;
                if (newChild.key) {
                    if (!childMap.byKey[newChild.key]) {
                        childMap.byKey[newChild.key] = new VNodePair(newChild, null, newChild.key);
                    } else {
                        childMap.byKey[newChild.key].newVN = newChild;
                    }
                }
            }
            if (oldChild) {
                oldChild.index = i;
                if (oldChild.key) {
                    if (!childMap.byKey[oldChild.key]) {
                        childMap.byKey[oldChild.key] = new VNodePair(null, oldChild, oldChild.key);
                    } else {
                        childMap.byKey[oldChild.key].oldVN = oldChild;
                    }

                }
            }
        }
        debugger;
        // Fill childMap.byNewChildren and childMap.byOldChildren, based on key values.
        // If the child does not have a key, we will push that into two separate stacks for later use.
        for (let i = maxLength; i--;) {
            const newChild = _newChildren[i] || null;
            const oldChild = _oldChildren[i] || null;

            if (oldChild) {
                if (oldChild.key) {
                    if (!!childMap.byKey[oldChild.key].newVN) {
                        // Matched!
                        childMap.byOldChildren[i] = childMap.byKey[oldChild.key];
                    } else {
                        // Has a key but no match!
                        childMap.byOldChildren[i] = childMap.byKey[oldChild.key];
                    }
                } else {
                    // No key!
                    _oldStack1.push(oldChild);
                    _oldStack2.push(oldChild);
                    childMap.byOldChildren[i] = _placeholder;
                }
            } else {
                childMap.byOldChildren[i] = _placeholder;
            }

            if (newChild) {
                if (newChild.key) {
                    if (!!childMap.byKey[newChild.key].oldVN) {
                        // Matched!
                        childMap.byNewChildren[i] = childMap.byKey[newChild.key];

                    } else {
                        // Has a key but no match!
                        childMap.byNewChildren[i] = childMap.byKey[newChild.key];
                    }
                }
                else {
                    // No key! 
                    _newStack1.push(newChild);
                    _newStack2.push(newChild);
                    childMap.byNewChildren[i] = _placeholder;
                }
            } else {
                childMap.byNewChildren[i] = _placeholder;
            }
        }

        for (let i = 0; i < maxLength; ++i) {
            if (childMap.byNewChildren[i] === _placeholder) {
                childMap.byNewChildren[i] = new VNodePair(
                    _newStack1.pop() || null,
                    _oldStack1.pop() || null,
                    null
                )
            }
            if (childMap.byOldChildren[i] === _placeholder) {
                childMap.byOldChildren[i] = new VNodePair(
                    _newStack2.pop() || null,
                    _oldStack2.pop() || null,
                    null
                )
            }
        }

        return callback(childMap);
    }



    function annotateChildMap(childMap = {}) {
        let _test_
        // -----------------
        const maxLength = childMap.byNewChildren.length > childMap.byOldChildren.length ?
            childMap.byNewChildren.length :
            childMap.byOldChildren.length;
        let i;

        i = maxLength;
        while (i--) {
            if (!!childMap.byOldChildren[i].oldVN) {
                if (!!childMap.byOldChildren[i].newVN) {
                    if (
                        childMap.byOldChildren[i].oldVN.type !== childMap.byOldChildren[i].newVN.type ||
                        propsHaveChanged(childMap.byOldChildren[i].newVN.props, childMap.byOldChildren[i].oldVN.props)
                    ) {
                        childMap.byOldChildren[i].action = "update";
                    } else {
                        childMap.byOldChildren[i].action = "maintain";
                    }
                } else {
                    childMap.byOldChildren[i].action = "destroy";
                }
            } else {
                if (!!childMap.byOldChildren[i].newVN) {
                    childMap.byOldChildren[i].action = "create";
                }
            }
        }

        i = maxLength;
        while (i--) {
            if (!!childMap.byNewChildren[i].action) {
                /* If it's already been evaluated by the previous 'while' loop */
                continue;
            }
            if (!!childMap.byNewChildren[i].newVN) {
                if (!!childMap.byNewChildren[i].oldVN) {
                    if (
                        childMap.byNewChildren[i].oldVN.type !== childMap.byNewChildren[i].newVN.type ||
                        propsHaveChanged(childMap.byNewChildren[i].newVN.props, childMap.byNewChildren[i].oldVN.props)
                    ) {
                        childMap.byNewChildren[i].action = "update";
                    } else {
                        childMap.byNewChildren[i].action = "maintain";
                    }
                } else {
                    childMap.byNewChildren[i].action = "create";
                }
            }
            else {
                if (!!childMap.byNewChildren[i].oldVN) {
                    childMap.byNewChildren[i].action = "destroy";
                }
            }
        }
        return childMap;
    }


    function reconcileChildMap(childMap = {}) {
        let result = [];

        const maxLength = childMap.byNewChildren.length > childMap.byOldChildren.length ?
            childMap.byNewChildren.length :
            childMap.byOldChildren.length;
        let childPair;


        for (let i = 0; i < maxLength; ++i) {
            switch (childMap.byOldChildren[i].action) {
                case "destroy":
                    console.log("destroy");
                    break;
                case "update":
                    console.log("update");
                    break;
                case "create":
                    console.log("create");
                    break;
                case "maintain":
                    console.log("maintain");
                    break;
                case (null || undefined):
                    console.log('null || undefined');
                    break;
            }   
        }

        console.log("------------");
        for (let i = 0; i < maxLength; ++i) {
            switch (childMap.byNewChildren[i].action) {
                case "destroy":
                    console.log("destroy");
                    break;
                case "update":
                    console.log("update");
                    break;
                case "create":
                    console.log("create");
                    break;
                case "maintain":
                    console.log("maintain");
                    break;
                case (null): case (undefined):
                    console.log('null || undefined');
                    break;
            }   
        }
        return result;
    }


    // Test Data:
    function testFunc1(x) {
        return x;
    };

    const testData_1 = {
    
        oldChildren: [
            { type: 'div', props: { 0: 'zero' }, children: [], id: "Header" },
            { type: 'div', props: {}, key: 1, children: [], id: 1 },
            { type: 'div', props: { testFunc: testFunc1 }, key: 4, children: [], id: 4 },
            { type: 'div', props: {}, key: 5, children: [], id: 5 },
            { type: 'div', props: {}, children: [], id: "Footer" },
            { type: 'div', props: {}, key: 2, children: [], id: 2 },
            { type: 'div', props: {}, key: 3, children: [], id: 3 },
    
        ],
        newChildren: [
            { type: 'div', props: {}, children: [], id: "Header" },
            { type: 'h1', props: {}, key: 1, children: [], id: 1 },
            { type: 'div', props: {}, key: 2, children: [], id: 2 },
            { type: 'div', props: { testFunc: testFunc1 }, key: 4, children: [], id: 4 },
            { type: 'div', props: {}, key: 5, children: [], id: 5 },
            // { type: 'div', props: {}, key: 3, children: [], id: 3 },
            // { type: 'div', props: {}, children: [], id: "Footer" },
    
        ],
    
    }



    // Test Functions:
    function test_createChildMap() {
        let result = createChildMap(testData_1.newChildren, testData_1.oldChildren);
        console.log(result);
        return result;
    }

    function test_annotateChildMap() {
        console.group('Start annotateChildMap()');
        const childMap = createChildMap(testData_1.newChildren, testData_1.oldChildren);

        let result = annotateChildMap(childMap);

        console.log(result);
        console.log('Done!');
        console.groupEnd;
        return (result);

    }

    function test_reconcileChildMap() {
        console.group("Start reconcileChildMap");
        let childMap = annotateChildMap(createChildMap(testData_1.newChildren, testData_1.oldChildren));
        let result = reconcileChildMap(childMap);
        console.log(childMap);
        console.log(result);
        console.log("Done!")
        console.groupEnd();
        return result;
    }

    // Test Interface:
    let testBtn1 = createButton('createChildMap',
        test_createChildMap, document.body, {
            backgroundColor: "yellow"
        }
    );

    let testBtn2 = createButton('annotateChildMap',
        test_annotateChildMap, document.body, {
            backgroundColor: "lightblue"
        }
    );

    let testBtn3 = createButton('reconcileChildMap',
        test_reconcileChildMap, document.body, {
            backgroundColor: "lightgreen"
        }
    );

    let testBtn4 = createButton('reconcileChildMap',
        test_reconcileChildMap, document.body, {
            backgroundColor: "lightpink"
        }
    );


});

