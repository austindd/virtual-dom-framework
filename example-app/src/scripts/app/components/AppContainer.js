define(['vdom', 'components/AppHeader', 'components/AppBody'], ({VDOMComponent, v$}, AppHeader, AppBody) => {

    const AppContainer = new VDOMComponent({
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
                v$('div', { id: 'App', style: this.styles.main }, [
                    AppHeader,
                    AppBody,
                ])
            );
        }
    });
    return AppContainer;    
});

