const __myDataTypes__ = {
    notDefined: Symbol("notDefined"),
    validObject: Symbol("validObject"),
}

let objA = {
    prop1: __myDataTypes__.notDefined,
    prop2: __myDataTypes__.notDefined,
    __valid__: __myDataTypes__.validObject
}

objB = {
    prop1: 'foo',
    prop2: undefined,
    __valid__: Symbol('validObject') /* new Symbol will not equal original one */
}

console.log(
    objA.prop1 === undefined,            /* false */
    objA.prop1 === objA.prop2,           /* true */
    objA.prop1 === Symbol("notDefined"), /* false */
);

function validateObject(x) {
    return (x.__valid__ && x.__valid__ === __myDataTypes__.validObject);
}

console.log(
    validateObject(objA),   /* true */
    validateObject(objB)    /* false */
);