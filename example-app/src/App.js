console.log('-- Loading App.js');



import VDOM from './lib/vdom/vdom';
import AppContainer from './components/AppContainer';



const App = VDOM.createClass({
    name: 'App',
    test: 'TEST',
    render: () => {
        return (
            AppContainer
        );
    }
});
console.log("App:", App.render());




export default App;