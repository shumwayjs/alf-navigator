var expect = chai.expect;
var assert = chai.assert;

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
		var firstContentController = undefined;
		it("should make navigation", function(done) {
			require(['alfnavigator', 'sinon'], function(navigator, sinon) {
				navigator.navigate('welcome')
				.then(function(contentController){
					expect(contentController).to.not.be.undefined;
					firstContentController = contentController;
					sinon.spy(firstContentController, 'beforeNavigate');
					done();
				})
				.done(null, done);
			});
		});

		it("should make second navigation", function(done) {
			require(['alfnavigator'], function(navigator) {
				navigator.navigate('welcome')
				.then(function(contentController){
					assert(firstContentController.beforeNavigate.calledOnce);
					firstContentController.beforeNavigate.restore();
					expect(contentController).to.not.be.undefined;
					done();
				})
				.done(null, done);
			});
		});

	});



});
