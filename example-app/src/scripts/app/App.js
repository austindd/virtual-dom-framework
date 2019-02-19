console.log('-- Loading App.js');

define(['vdom', 'components/AppContainer'], function (VDOM, AppContainer) {

    const AppRoot = new VDOM.ROOTComponent({
        render: () => {
            return (
                AppContainer
            );
        }
    });
    VDOM.setRootComponent(AppRoot);
    console.log(AppRoot);
    return AppRoot;
});


    // ===============================================================================================
    // =====================================  UNUSED COMPONENTS  =====================================
    // ===============================================================================================


    // // Simple stateless functional component, capable of recieving props from its parent,
    // // Note: this is not an instance of VDOMComponent class.
    // // It's similar to vNodeFunction but passes props and defines additional methods.
    // const simpleComponent = (props) => {
    //     this.props = props;
    //     handleTextClick = () => {
    //         console.log('CLICKED');
    //         return;
    //     }
    //     return (
    //         v$('div', { id: 'wrapper-div-1', style: { width: '50vh', margin: '0 auto', backgroundColor: 'lightgreen' } }, [
    //             v$('p', { style: { textAlign: 'center' }, events: { click: handleTextClick.bind(this) } }, ['This is a stateless component']),
    //             v$('p', { style: { textAlign: 'center', color: 'darkblue' }, events: { click: handleTextClick.bind(this) } }, ['It is designed to accept properties from its parent component']),
    //             v$('p', { style: { textAlign: 'center' }, events: { click: handleTextClick.bind(this) } }, ['It returns a "virtual node"']),
    //         ])
    //     );
    // };

    // // Simple function returning a compatible vNode object:
    // const vNodeFunction = () => {
    //     return (
    //         v$('div', { id: 'wrapper-div-1', style: { width: '50vh', margin: '0 auto', backgroundColor: 'yellow' } }, [
    //             v$('p', { style: { textAlign: "center", color: "red" } }, ['This is just a function that returns a set of nested virtual nodes']),
    //             v$('p', { style: { textAlign: "center" } }, ['This is a <p> element with text']),
    //             v$('p', { style: { textAlign: "center" } }, ['And ANOTHER one!']),
    //         ])
    //     );
    // }
