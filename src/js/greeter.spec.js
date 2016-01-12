'use strict';

describe('App.Greeter', () => {

    describe('greet', () => {

        it('returns hello world', () => {

            // Arrange
            var greeter = new App.Greeter('World');

            // Act
            var result = greeter.greet();

            // Assert
            expect(result).toEqual('Hello World');
        });
    });
});
