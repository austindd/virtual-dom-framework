let testButton = document.createElement('button');
testButton.appendChild(document.createTextNode('Click to print to console!'));
document.body.appendChild(testButton);



const AppInit = function () {

}
AppInit();

import {VDOM} from './lib/vdom/vdom';
import App from './App';




console.log('-- Done');

if (module.hot) {
    module.hot.accept();
}


// App.update();