var App;
(function (App) {
    var Greeter = (function () {
        function Greeter(message) {
            this.message = message;
        }
        Greeter.prototype.greet = function () {
            return 'Hello ' + this.message;
        };
        return Greeter;
    })();
    App.Greeter = Greeter;
})(App || (App = {}));

//# sourceMappingURL=greeter.js.map
