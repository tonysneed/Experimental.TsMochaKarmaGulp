var App;
(function (App) {
    class Greeter {
        constructor(message) {
            this.message = message;
        }
        greet() {
            return 'Hello ' + this.message;
        }
    }
    App.Greeter = Greeter;
})(App || (App = {}));

//# sourceMappingURL=greeter.js.map
