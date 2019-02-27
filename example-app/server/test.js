let testData = {

    col: {
        name: 0,
        id: 1,
        text: 2,
    },
    data: [
        [],
        [],
        [],
    ],
    get: function (colName, value = null) {

    },
    set: function (colName, data = {}) {
        let index = this.data[this.col[colName]];
        Object.keys(data).forEach((column) => {
            if (column in this.col) {
                // To be continued...
            }
        });

    },
    append: function () {

    },
    prepend: function () {

    },
}