import VDOM, {v$} from '../lib/vdom/vdom';
import ContentCol from './ContentCol';

const AppBody = VDOM.createClass({
    styles: {
        appBody: {
            display: 'flex',
            margin: '0',
            width: '100%',
            height: '84.28vh'
        },
        sideBar: {

        },
    },
    updateBGColor: function changeBGColor() {
        const HSVtoRGB = function (h, s, v) {
            var r, g, b, i, f, p, q, t;
            if (arguments.length === 1) {
                s = h.s, v = h.v, h = h.h;
            }
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }
        const randomHValue = function () {
            let h = Math.random();
            h += (0.618033988749895);
            h %= 1;
            return h;
        }
        let rgbValue = HSVtoRGB(randomHValue(), 0.5, 0.95);
        console.log('New Background Color', rgbValue);
        let cssColorString = `rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`;

        this.styles.appBody.backgroundColor = cssColorString;
        console.log(this.styles.appBody);
        this.update();
    },
    render: function () {
        return (
            v$('div', { id: 'AppBody', style: this.styles.appBody }, [
                ContentCol({ updateBGColor: this.updateBGColor.bind(this), key: 1, textValue: "Most of these panels" }),
                ContentCol({ updateBGColor: this.updateBGColor.bind(this), key: 2, textValue: "will change the background color" }),
                ContentCol({ updateBGColor: this.updateBGColor.bind(this), key: 3, textValue: "when you CLICK them" }),
                ContentCol({ updateBGColor: this.updateBGColor.bind(this), key: 4, textValue: "But not ALL of them..." }),
                ContentCol({ key: 5, textValue: "At least, not THIS one." }),

            ])
        )
    }
});



export default AppBody;