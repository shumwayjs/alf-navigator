define(["exports", "welcome/WelcomeView", "alfnavigator"], function(exports, _welcomeWelcomeView, _alfnavigator) {
  "use strict";

  var _prototypeProperties = function(child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _get = function get(object, property, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);
      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      return desc.value;
    } else {
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return getter.call(receiver);
    }
  };

  var _inherits = function(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var _classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var WelcomeView = _welcomeWelcomeView.WelcomeView;
  var alfnavigator = _alfnavigator;
  var WelcomeController = exports.WelcomeController = (function(_alfnavigator$BaseContentController) {
    function WelcomeController() {
      _classCallCheck(this, WelcomeController);

      _get(Object.getPrototypeOf(WelcomeController.prototype), "constructor", this).call(this);
    }

    _inherits(WelcomeController, _alfnavigator$BaseContentController);

    _prototypeProperties(WelcomeController, null, {
      init: {
        value: function init(callback) {
          this.model = {
            name: "User"
          };
          this.view = new WelcomeView({
            controller: this
          });
          callback();
        },
        writable: true,
        configurable: true
      },
      testme: {
        value: function testme() {
          return "tested";
        },
        writable: true,
        configurable: true
      }
    });

    return WelcomeController;
  })(alfnavigator.BaseContentController);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
