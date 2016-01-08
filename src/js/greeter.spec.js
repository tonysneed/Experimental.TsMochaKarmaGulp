describe('App.Greeter', function() {
    
    describe('greet', function(){   
            
        it('returns hello world', function(){
            
            // Arrange
            var greeter = new App.Greeter('World');
            
            // Act
            var result = greeter.greet();
            
            // Assert
            expect(result).toEqual('Hello World');
        });
    });
});
