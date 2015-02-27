var expect = chai.expect;

describe("alfnavigator", function() {
	before(function(done) {
		// ensure the app and request navigation to obtain
		// reference to test-target
		require(['alfnavigator'], function(alfnavigator) {
			alfnavigator({
				contentRegister: {welcome: 'welcome/WelcomeController'},
				defaultContent: 'welcome',
				targetContent: '.container.content',
				animate: false
			});
			done();
		});
	});

	describe("#navigate", function() {
		it("should make navigation", function() {
			require(['alfnavigator'], function(navigator) {
				navigator.navigate('welcome')
				.then(function(contentController){
					expect(contentController).to.not.be.undefined;
					done();
				});
			});
		});


	});



});
