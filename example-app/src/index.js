
import VDOM from './lib/vdom/vdom';
import App from './App';
import eventHub from './lib/vdom/vdom-events/vdom-events';


console.log(('' + Math.random()).slice(2));

// Define the root node in the DOM for application entry point.
let ROOT = document.createElement('div');
ROOT.id = "ROOT";
document.body.appendChild(ROOT);

// Configure the virtual DOM object to render at the root node.
// Mixin/plugin support coming soon.
VDOM.config({
    rootNode: ROOT,
    rootComponent: App
})


// Call the 'update' function of the root component to begin updating the DOM.
App.update();

// Boilerplate for Hot Module Replacement using Webpack dev server./
if (module.hot) {
    module.hot.dispose(function () {
        ROOT.remove();
        console.clear();
    })
    module.hot.accept();
}


