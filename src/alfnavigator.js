define(['NavigatorController', 'BaseContentController', 'BaseContentView', 'underscore'],
function(NavigatorController, BaseContentController, BaseContentView){
	/**
	 * Call to instantiate.
	 * @param args : {contentRegister: ContentRegister,
	 *                defaultContent: String (url-content-name),
	 *                targetContent : String (the container-selector in which views are rendered, default:  '.container.content')},
	 *                animate: true (if page-transition are animated)
	 *
	 * ContentRegister : {url-content-name -> path-to-content-controller},
	 *   example: 'complexes': 'contents/complexes/ComplexesContentController'
	 */
	var navigator = function (args){
		_.extend(navigator, new NavigatorController(args));
		navigator.BaseContentController = BaseContentController;
		navigator.BaseContentView = BaseContentView;
	};

	/**
	 * Creates Constructor based on the given Constr but when initializing setting an instance of
	 * BaseContentController as prototype first.
	 * @param Constr : function
	 */
	navigator.ContentController = function(Constr){
		return function(args){
			Constr.prototype = new BaseContentController(args);
			Constr.prototype.constructor = Constr;
			return new Constr(args);
		};
	};

	/**
	 * Creates Constructor based on the given Constr but when initializing setting an instance of
	 * BaseContentView as prototype first.
	 * @param Constr : function
	 */
	navigator.ContentView = function(Constr){
        // @param args : {html : 'html snippet which becomes $el'}
		return function(args){
			Constr.prototype = new BaseContentView(args);
			Constr.prototype.constructor = Constr;
			return new Constr(args);
		};
	};

	return navigator;
});
