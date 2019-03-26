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

    const _DOMInstructions = {
        create: {},
        destroy: {},
        replace: {
            with: null
        },
        move: {
            from: null,
            to: null
        },
        update: {
            addProps: [],
            removeProps: [],
            replaceProps: []
        }
    }

    function createChildMap(newChildren, oldChildren, callback = function callback(x) { return x }) {
        debugger;

        const maxLength = newChildren.length > oldChildren.length ? newChildren.length : oldChildren.length;
        const _placeholder = { _placeholder: true };
        const childMap = {
            byKey: {},
            byNewChildren: [],
            byOldChildren: []
        }

        const newChildStack = !newChildren ? [] : newChildren.filter((x, i) => {
            x.index = i;
            childMap.byNewChildren.push({ new: x || null, old: null });
            if (x.key) {
                if (!childMap.byKey[x.key]) { childMap.byKey[x.key] = { new: null, old: null }; }
                childMap.byKey[x.key].new = x;
                return false; // already sorted, no need to push to stack
            } else {
                return true; // push to stack
            }
        });

        const oldChildStack = !oldChildren ? [] : oldChildren.filter((x, i) => {
            x.index = i;
            childMap.byOldChildren.push({ new: null, old: x || null });
            if (x.key) {
                if (!childMap.byKey[x.key]) { childMap.byKey[x.key] = { new: null, old: null }; }
                childMap.byKey[x.key].old = x;
                return false; // already sorted, no need to push to stack
            } else {
                return true; // push to stack
            }
        });

        // iterating over the greater of the two children array inputs, handling other things as well.
        for (let i = 0; i < maxLength; i++) {
            debugger;
            if (!childMap.byOldChildren[i]) {
                childMap.byOldChildren.push({ new: null, old: null });
            }
            if (!childMap.byNewChildren[i]) {
                childMap.byNewChildren.push({ new: null, old: null });
            }

            // fill oldChildren
            if (oldChildren[i] && oldChildren[i].key) {
                // if this oldChild has a key, then assign the corresponding newChild (newChild can be null value).
                childMap.byOldChildren[i].new = childMap.byKey[oldChildren[i].key].new;
            }
            else if (newChildStack[0]) {
                // if no oldChild key for this index, then grab a newChild value from the newChildStack instead.
                childMap.byNewChildren[i].old = newChildStack.shift();
            }


            if (newChildren[i] && newChildren[i].key) {
                // if this newChild has a key, then assign the corresponding oldChild (oldChild can be null value).
                childMap.byNewChildren[i].old = childMap.byKey[newChildren[i].key].old;
            }
            else if (oldChildStack[0]) {
                // if no newChild key for this index, then grab an oldChild value from the oldChildStack instead.
                childMap.byNewChildren[i].old = oldChildStack.shift();
            }

        }

        debugger;

        return callback(childMap);

    }






    // Test Functions
    function test_createChildMap() {
        const oldChildren = [
            { type: 'div', props: {}, children: [], id: 6 },
            { type: 'div', props: {}, key: 1, children: [], id: 1 },
            { type: 'div', props: {}, key: 2, children: [], id: 2 },
            { type: 'div', props: {}, key: 3, children: [], id: 3 },
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

    let testBtn1 = createButton('Normalize Children',
        test_createChildMap, document.body,
    );



});

