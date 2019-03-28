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

        const maxLength = newChildren.length > oldChildren.length ? newChildren.length : oldChildren.length;
        const _placeholder = { _placeholder: true };

        const childMap = {
            byKey: {},
            byNewChildren: [],
            byOldChildren: []
        }


        for (let i = 0; i < maxLength; i++) {
            const newChild = newChildren[i] || null;
            const oldChild = oldChildren[i] || null;

            if (newChild) {
                newChild.index = i;
                if (newChild.key) {
                    if (!childMap.byKey[newChild.key]) {
                        childMap.byKey[newChild.key] = {newVN: newChild, oldVN: null };
                    } else {
                        childMap.byKey[newChild.key].newVN = newChild;
                    }
                } else { }
            } else { }

            if (oldChild) {
                oldChild.index = i;
                if (oldChild.key) {
                    if (!childMap.byKey[oldChild.key]) {
                        childMap.byKey[oldChild.key] = {newVN: null, oldVN: oldChild };
                    } else {
                        childMap.byKey[oldChild.key].oldVN = oldChild;
                    }
                    
                } else {  }
            } else { }

        }


        for (let i = 0; i < maxLength; ++i) {
            const newChild = newChildren[i] || null;
            const oldChild = oldChildren[i] || null;

            if (oldChild) {
                if (oldChild.key) {
                    if (childMap.byKey[oldChild.key].newVN) {
                        // Matched!
                        childMap.byOldChildren[i] = childMap.byKey[oldChild.key];
                    } else {
                        // Has a key but no match!
                        childMap.byOldChildren[i] = {newVN: null, oldVN: oldChild};
                    }
                }
            }

            if (newChild) {
                if (newChild.key) {
                    if (childMap.byKey[newChild.key].oldVN) {
                        // Matched!
                        childMap.byNewChildren[i] = childMap.byKey[newChild.key];

                    } else {
                        // Has a key but no match!
                        childMap.byNewChildren[i] = {newVN: newChild, oldVN: null};
                    }
                }
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
            { type: 'div', props: {}, key: "Header", children: [], id: "Header" },
            { type: 'div', props: {}, key: 1, children: [], id: 1 },
            // { type: 'div', props: {}, key: 2, children: [], id: 2 },
            // { type: 'div', props: {}, key: 3, children: [], id: 3 },
            { type: 'div', props: {}, key: 4, children: [], id: 4 },
            { type: 'div', props: {}, key: 5, children: [], id: 5 },

        ];
        const newChildren = [
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

