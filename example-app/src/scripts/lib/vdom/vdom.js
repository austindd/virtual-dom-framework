

define(['vdomCore'], function () {
    const ROOT = document.getElementById('ROOT');
    const VDOM = createVDOM(ROOT);
    return VDOM;
});