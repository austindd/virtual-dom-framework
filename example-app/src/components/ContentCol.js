import VDOM, { v$, Component } from '../lib/vdom/vdom';


// const ContentCol = VDOM.createClass({
//     name: 'ContentCol',
//     styles: {
//         ContentCol: {
//             display: 'block',
//             margin: '0 auto',
//             padding: '30px 2px 10px 2px',
//             height: '12em',
//             width: '20vh',
//             backgroundColor: 'lightblue',
//             border: '1px solid black',
//             textAlign: 'center',
//         }
//     },
//     textValue: null,
//     getTextValue: function () {
//         if (this.props && this.props.textValue) {
//             return this.props.textValue;
//         } else return "";
//     },
//     handleClick: function () {
//         console.log('Clicked!');
//         if (this.props.updateBGColor) {
//             this.props.updateBGColor();
//         }
//         return;
//     },
//     render: function () {
//         console.log(this);
//         if (this.props && this.props.textValue) {
//             this.textValue = this.props.textValue;
//         }
//         return (
//             v$('div', { id: this.props.key, className: 'ContentCol', style: this.styles.ContentCol, events: {click: this.handleClick.bind(this)} }, [
//                 this.textValue
//             ])
//         )
//     }
// });

class ContentCol extends Component {
    constructor(props) {
        console.log("ContentCol newly constructed");
        super(props);
        this.name = 'ContentCol';
        this.styles = {
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
        };
        this.textValue = null;
        this.getTextValue = this.getTextValue.bind(this);
        this.handleClick = this.handleClick.bind(this);
        // this.render.bind(this);
        console.log(this);
    }
    getTextValue() {
        if (this.props && this.props.textValue) {
            return this.props.textValue;
        } else return "";
    }

    handleClick() {
        console.log('Clicked!');
        if (this.props.updateBGColor) {
            this.props.updateBGColor();
        }
        return;
    }
    render() {
        console.log(this);
        if (this.props && this.props.textValue) {
            this.textValue = this.props.textValue;
        }
        return (
            v$('div', { id: this.props.key, className: 'ContentCol', style: this.styles.ContentCol, events: { click: this.handleClick } }, [
                this.textValue
            ])
        )
    }

}


export default ContentCol;
