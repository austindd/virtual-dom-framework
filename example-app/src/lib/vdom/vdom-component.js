

// ====== DEFINED FOR TESTING PURPOSES ======
const updateVirtualDOM = function () {
    console.log('updateVirtualDOM()');
    return "updating...";
};
// ====== PLEASE REMOVE FUNCTION ABOVE ======

const VdomComponent = function (props = {}) {
    if (props) {
        Object.keys(props).forEach((propName) => {
            this[propName] = props[propName];
        });
    }
    this.state = {};
}
VdomComponent.prototype.constructor = VdomComponent;
VdomComponent.prototype.render = () => {
    // To be defined in the component instance.
    // Initially returns undefined to throw an error if not overwritten.
    return new Error('render is undefined');
}
VdomComponent.prototype.update = () => {
    updateVirtualDOM();
}
VdomComponent.prototype.setState = (newState) => {
    if (newState) {
        Object.keys(newState).forEach((prop) => {
            VdomComponent.state[prop] = newState[prop];
        });
    }
}

module.exports = {
    VdomComponent: VdomComponent
}