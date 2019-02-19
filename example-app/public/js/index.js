console.log('-- Loading index.js');


require.config({
    baseUrl: '../../src/scripts',

    paths: {
        // Folder paths:
        src: '../../src',
        app: '../../src/scripts/app',
        components: '../../src/scripts/app/components',
        lib: '../../src/scripts/lib',

        // Library APIs
        vdomCore: '../../src/scripts/lib/vdom/vdom-core',
        vdom: '../../src/scripts/lib/vdom/vdom'
    }
});


requirejs([
    "app/app",
], function (AppRoot) {
    AppRoot.update();
});

