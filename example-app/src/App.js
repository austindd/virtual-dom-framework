console.log('-- Loading App.js');

const App = new VDOM.ROOTComponent({
    render: () => {
        return (
            AppContainer
        );
    }
});
VDOM.setRootComponent(App);
console.log(App);


export default App;