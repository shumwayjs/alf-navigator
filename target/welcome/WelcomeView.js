define(["exports", "jquery", "alfnavigator", "css!welcome/welcome", "text!welcome/welcome.html", "underscore"], function(exports, _jquery, _alfnavigator, _cssWelcomeWelcome, _textWelcomeWelcomeHtml, _underscore) {
  "use strict";

  var _interopRequire = function(obj) {
    return obj && obj.__esModule ? obj["default"] : obj;
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

  var jQuery = _jquery;
  var alfnavigator = _alfnavigator;
  var welcomeHtml = _interopRequire(_textWelcomeWelcomeHtml);

  var WelcomeView = exports.WelcomeView = (function(_alfnavigator$BaseContentView) {
    function WelcomeView(args) {
      _classCallCheck(this, WelcomeView);

      _get(Object.getPrototypeOf(WelcomeView.prototype), "constructor", this).call(this, {
        html: _.template(welcomeHtml)(args.controller.model),
        controller: args.controller
      });
    }

    _inherits(WelcomeView, _alfnavigator$BaseContentView);

    return WelcomeView;
  })(alfnavigator.BaseContentView);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
