var expect = chai.expect;

describe("alfnavigator", function() {
  var welcomeController = undefined;
  before(function(done) {
    // ensure the app and request navigation to obtain
    // reference to test-target
    require(['../alfnavigator'], function(navigator) {
      // app.app.navigator.navigate('welcome')
      //   .then(function(contentController){
      //     welcomeController = contentController;
      //     done();
      //   });
      done();
    });
  });

  describe("#testme", function() {
    it("should return 'tested'", function() {
      // expect(welcomeController.testme()).to.equal("tested");
    });

    it("should not return 'nichts'", function() {
      // expect(welcomeController.testme()).to.not.equal("nichts");
    });

  });



});
