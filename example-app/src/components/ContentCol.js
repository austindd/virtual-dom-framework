import VDOM, {v$} from '../lib/vdom/vdom';


    const ContentCol = VDOM.createClass({
        styles: {
            ContentCol: {
                display: 'block',
                margin: '0 auto',
                padding: '30px 2px 10px 2px',
                height: '12em',
                width: '20vh',
                backgroundColor: 'lightblue',
                border: '1px solid black',
                textAlign: 'center',
            }
        },
        textValue: null,
        getTextValue: function () {
            if (this.parentProps && this.parentProps.textValue) {
                return this.parentProps.textValue;
            } else return "";
        },
        handleClick: function () {
            console.log('Clicked!');
            if (this.parentProps.updateBGColor) {
                this.parentProps.updateBGColor();
            }
            return;
        },
        render: function () {
            if (this.parentProps.textValue) {
                this.textValue = this.parentProps.textValue;
            }
            return (
                v$('div', { id: this.parentProps.key, className: 'ContentCol', style: this.styles.ContentCol, events: { click: this.handleClick.bind(this) } }, [
                    this.textValue
                ])
            )
        }
    });

    export default ContentCol;
