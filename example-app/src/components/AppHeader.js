import VDOM, {v$} from '../lib/vdom/vdom';


    const AppHeader = VDOM.createClass({
        styles: {
            appHeader: {
                position: 'relative',
                padding: "1em 0 0 0",
                display: 'block',
                margin: '0',
                width: "100%",
                height: "14vh",
                backgroundColor: 'palevioletred',
                textAlign: 'center',
                boxShadow: '0px 2px 10px #060202'
            },
            titleText: {
                position: 'relative',
                display: 'block',
                margin: '0.25em',
                fontSize: "4em",
                verticalAlign: 'middle',
                color: "#f6f6ff"
            }
        },
        render: function () {
            return (
                v$('div', { className: 'AppHeader', style: this.styles.appHeader }, [
                    v$('h1', { style: this.styles.titleText }, ["Gorgeous Header"])
                ])
            );
        }
    });
export default AppHeader;
