'use strict';

import * as Greeter from 'greeter';

describe('App.Greeter', () => {

    describe('greet', () => {

        it('returns hello world', () => {

            // Arrange
            var greeter = new Greeter('World');

            // Act
            var result = greeter.greet();

            // Assert
            expect(result).toEqual('Hello World');
        });
    });
});
