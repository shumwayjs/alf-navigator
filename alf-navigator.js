define('View',['jquery', 'animojs'], function(){
	return View;
	
	function View(args){
		var controller = args.controller;		
		
		// el's
		var $el = jQuery('body');	
		var $content = jQuery(controller.targetContent, $el);
		
		function init(){}		

		/**
		 * Shows content based on the given content-controller.
		 * @param baseContentController : BaseContentController 
		 */
		this.createShowContentTask = function(contentController){
			return function(callback){				
				contentController.show($content);
				contentController.view.$el.animo({				
					animation: 'fadeInDown', 
					duration: 0.3				
				}, function(){					
					callback && callback();
				});			
				
			};
		};
		
		/**
		 * Triggers to hide the content of the given contentController.
		 * @param contentController : BaseContentController
		 */
		this.createHideContentTask = function(contentController){
			return function(callback){
				callback = callback || function(){};
				if(!contentController){
					callback();
					return;
				}
				var $target = contentController.view.$el;			
				contentController.view.$el.animo({				
					animation: 'fadeOut', 
					duration: 0.3				
				}, function(){
					$target.remove();
					callback();
				});			
			};
		};

		init();
	}
});
define('Controller',['View', 'underscore', 'backbone', 'parsequery', 'jquery'], function(View){
	return Controller;
	
	/**
	 * Initializes backbone-router and start Backbone.history. 
	 * 
	 */
	function Controller(){
		var scope = this;
		var view = new View({controller: this});		
		var currentContentController = undefined;		
		var router = undefined; // Backbone.Router
		var pageRootPath = ''; // is set to page's root path (form where it is served)
		
		this.contentRegister = {};		
		this.defaultContent = undefined;
		this.targetContent = '.container.content';
		
		function init(){
			initRouter();
		}
		
		function initRouter(){
			var Router = Backbone.Router.extend({
				  routes: {
					    '*path': showContent, // matches all path and splits query-part	 
					  }});
			router = new Router();
			Backbone.history.start({pushState: true});
		}
		
		/**
		 * Based on the given parameters requires for the corresponding controller,
		 * initiates and triggers page-transition on pageView.
		 * @param path : url-path
		 * @param query : query-params, the 'content' is used to extract view, the rest is given the content-controller as argument
		 */
		function showContent(path, query){
			pageRootPath = pageRootPath || path; // first time-set
			var urlState = jQuery.parseQuery(query);
			urlState.content = urlState.content || scope.defaultContent;
			var controllerUri = contentRegister[urlState.content];			
			if(!controllerUri){
				throw new Error('This content-name is not registered, '+urlState.content);
			}
			require([controllerUri], function(ContentController){		
				var formerContentController = currentContentController;
				currentContentController = new ContentController(urlState);
				currentContentController.init(function(){
					async.series([view.createHideContentTask(formerContentController),
					              view.createShowContentTask(currentContentController)]);
				});
			});
		}	
		
		init();
	}
});
define('BaseContentController',['underscore'], function(){
	return BaseContentController;
	
	/**
	 * Abstract-layer for all content-controller.
	 * @param args : urlState (query-params from current-url)
	 */
	function BaseContentController(args){
		this.view = undefined;	
		
		/**
		 * Override in order to init controller.
		 * @param callback : must be called to signal ready with init.
		 */
		this.init = function(callback){
			callback();
		};
		
		/**
		 * Triggers the view to add initialized content ($el) to given $content.
		 * @param $content, the content in which the view to render
		 */
		this.show = function($content){
			this.view.show($content);
		};		
		
		/**
		 * Initializes given View-constructor with given args, this controller instance
		 * is added by default to the args.
		 * @param View - view-constructor
		 * @param args - args to apply
		 */
		this.initPageViewTask = function(View, args){
			var scope = this;
			args = _.extend({controller: this}, args);
			return function(callback){			
				scope.view = new View(args);
				callback();			
			};
		};		
		
	}
});
define('BaseContentView',['jquery'], function(){
	return BaseContentView;
	
	/**
	 * Abstract-layer for all content-views.
	 * @param args : {html : 'html snippet which becomes $el'} 
	 */
	function BaseContentView(args){		
		this.$el = jQuery(args.html); // view context
		this.controller = args.controller;
		
		/**
		 * @param $content : the content to add the view's $el
		 */
		this.show = function($content){
			$content.append(this.$el);
		};
	}	
});
define('main',['Controller', 'BaseContentController', 'BaseContentView', 'underscore'],
function(Controller, BaseContentController, BaseContentView){
	var instance = new Controller();
	//'jquery', 'underscore', 'backbone', 'parseQuery', 'css!animate', 'animojs'
	
	/**
	 * @param args : {contentRegister: ContentRegister,
	 *                defaultContent: String (url-content-name),
	 *                targetContent : String (the container-selector in which views are rendered, default:  '.container.content')}
	 * ContentRegister : {url-content-name -> path-to-content-controller},
	 *   example: 'complexes': 'contents/complexes/ComplexesContentController'
	 */
	var navigator = function (args){
		_.extend(instance, _.pick(args, ['contentRegister', 'defaultContent', 'targetContent']));
		return instance;
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
