console.log('-- Loading App.js');



import {VDOM} from './lib/vdom/vdom';
import AppContainer from './components/AppContainer';


console.log(VDOM);

const App = new VDOM.ROOTComponent({
    render: () => {
        return (
            AppContainer()
        );
    }
});

VDOM.setRootComponent(App);
App.update();

console.log(VDOM.setRootComponent);
console.log(VDOM.rootComponent);
console.log(App);


export default App;