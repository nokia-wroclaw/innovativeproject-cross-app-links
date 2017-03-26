(function () {
    var component = {
        element: document.querySelectorAll('#web-component-navbar')[0],
        button: document.querySelectorAll('#web-component-navbar .burger-icon')[0],
        overflow: document.querySelectorAll('#web-component-navbar .component-overflow')[0],
        iframe: document.querySelectorAll('#web-component-navbar iframe')[0],
        use: function () {
            var component = this.element;
            var componentOverflow = this.overflow;

            if (component.className.indexOf("visible") === -1) {
                component.className = component.className.replace(/hidden/g, 'visible');
                componentOverflow.className = componentOverflow.className.replace(/hidden/g, 'visible');
            } else {
                component.className = component.className.replace(/visible/g, 'hidden');
                componentOverflow.className = componentOverflow.className.replace(/visible/g, 'hidden');
            }
        },
        start: function () {
            var button = this.button;
            var component = this.element;
            var iframe = this.iframe;
            var componentOverflow = this.overflow;

            //Element which contains web-component
            var pageNavbarHeight = button.parentElement.parentElement.clientHeight;
            //Create square
            component.style.width = parseInt(pageNavbarHeight) + 'px';
            componentOverflow.style.top = parseInt(pageNavbarHeight) + 'px';
            button.addEventListener('click', this.use.bind(this));
            component.style.visibility = 'visible';
        }
    };
    //Run
    component.start();

})()