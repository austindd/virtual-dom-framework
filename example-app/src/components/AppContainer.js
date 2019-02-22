import VDOM from '../lib/vdom/vdom';
import AppHeader from './AppHeader';
import AppBody from './AppBody';


const AppContainer = VDOM.createClass({
    styles: {
        main: {
            margin: '0 auto',
            width: '100%',
            height: '100%',
            backgroundColor: 'f6f6ff',
        }
    },
    handleTextClick: function () {
        console.log('CLICKED');
    },
    render: function () {
        return (
            VDOM.v$('div', { id: 'App', style: this.styles.main }, [
                AppHeader(),
                AppBody(),
            ])
        );
    }
});

export default AppContainer;
