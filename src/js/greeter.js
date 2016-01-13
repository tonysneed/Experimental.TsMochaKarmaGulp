var Greeter = (function () {
    function Greeter(message) {
        this.message = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello " + this.message;
    };
    return Greeter;
})();
exports.Greeter = Greeter;

//# sourceMappingURL=greeter.js.map
