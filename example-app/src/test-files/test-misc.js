document.addEventListener('DOMContentLoaded', function () {

    // Helper Functions
    function createButton(text = "test", handler = null, parent = null, styles = {}) {
        let btn = document.createElement('button');
        let btnText = document.createTextNode(text);
        btn.appendChild(btnText);
        Object.keys(styles).forEach((x) => {
            btn[x] = styles[x];
        });
        btn.onclick = handler;
        if (parent) {
            parent.appendChild(btn);
        }
        return btn;
    }

    // Experiments



    class NodeTable {
        constructor(nodeArray) {

        }
    }



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
        constructor(newVN = null, oldVN = null, $nodeRef = null, key = null, actionList = null) {
            this.newVN = newVN;
            this.oldVN = oldVN;
            this.$nodeRef = $nodeRef;
            this.key = key;
            this.actionList = actionList;
            // this.__$type$__ = null // for now...
        }

    }



    function createChildMap(newChildren = [], oldChildren = [], callback = function callback(x) { return x }) {
        debugger;
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

        debugger;

        // Create childMap.byKeys object, which we will need to reference when sorting children later
        for (let i = 0; i < maxLength; i++) {
            const newChild = _newChildren[i];
            const oldChild = _oldChildren[i];

            if (newChild) {
                newChild.index = i;
                if (newChild.key) {
                    if (!childMap.byKey[newChild.key]) {
                        childMap.byKey[newChild.key] = { newVN: newChild, oldVN: null };
                    } else {
                        childMap.byKey[newChild.key].newVN = newChild;
                    }
                } else { }
            } else { }

            if (oldChild) {
                oldChild.index = i;
                if (oldChild.key) {
                    if (!childMap.byKey[oldChild.key]) {
                        childMap.byKey[oldChild.key] = { newVN: null, oldVN: oldChild };
                    } else {
                        childMap.byKey[oldChild.key].oldVN = oldChild;
                    }

                } else { }
            } else { }
        }

        debugger;


        // Fill childMap.byNewChildren and childMap.byOldChildren, based on key values.
        // If the child does not have a key, we will push that into two separate stacks for later use.
        for (let i = maxLength - 1; i > -1; --i) {
            const newChild = _newChildren[i] || null;
            const oldChild = _oldChildren[i] || null;

            if (oldChild) {
                if (oldChild.key) {
                    if (childMap.byKey[oldChild.key].newVN) {
                        // Matched!
                        childMap.byOldChildren[i] = childMap.byKey[oldChild.key];
                    } else {
                        console.error('This should not happen');
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
                    if (childMap.byKey[newChild.key].oldVN) {
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

        debugger;

        for (let i = 0; i < maxLength; ++i) {
            if (childMap.byNewChildren[i] === _placeholder) {
                childMap.byNewChildren[i] = {
                    newVN: _newStack1.pop() || null,
                    oldVN: _oldStack1.pop() || null
                };
                if (childMap.byOldChildren[i] === _placeholder) {
                    childMap.byOldChildren[i] = childMap.byNewChildren[i];
                    _newStack2.pop(); // to keep track of available children independently
                    _oldStack2.pop();
                }
            }
            else if (childMap.byOldChildren[i] === _placeholder) {
                childMap.byOldChildren[i] = {
                    newVN: _newStack2.pop() || null,
                    oldVN: _oldStack2.pop() || null
                };
            }
        }

        debugger;

        return callback(childMap);

    }

    
    

    function reconcileChildren(childMap = {}) {

    }




    // Test Functions
    function test_createChildMap() {
        const oldChildren = [
            { type: 'div', props: {}, children: [], id: "Header" },
            { type: 'div', props: {}, key: 1, children: [], id: 1 },
            // { type: 'div', props: {}, key: 2, children: [], id: 2 },
            // { type: 'div', props: {}, key: 3, children: [], id: 3 },
            { type: 'div', props: {}, key: 4, children: [], id: 4 },
            { type: 'div', props: {}, key: 5, children: [], id: 5 },
            { type: 'div', props: {}, children: [], id: "Footer" },
        ];
        const newChildren = [
            { type: 'div', props: {}, children: [], id: "Header" },
            { type: 'div', props: {}, key: 1, children: [], id: 1 },
            { type: 'div', props: {}, key: 2, children: [], id: 2 },
            { type: 'div', props: {}, key: 4, children: [], id: 4 },
            { type: 'div', props: {}, key: 5, children: [], id: 5 },
            { type: 'div', props: {}, key: 3, children: [], id: 3 },
        ]
        let result = createChildMap(newChildren, oldChildren);
        console.log(result);
        return result;
    }



    // Test Interface:

    let testBtn1 = createButton('createChildMap',
        test_createChildMap, document.body,
    );



});

