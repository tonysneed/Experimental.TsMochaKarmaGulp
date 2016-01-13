var greeter_1 = require("./greeter");
describe("Greeter", function () {
    describe("greet", function () {
        it("returns Hello World", function () {
            var greeter = new greeter_1.Greeter("World");
            var result = greeter.greet();
            expect(result).toEqual("Hello World");
        });
    });
});

//# sourceMappingURL=greeter.spec.js.map
