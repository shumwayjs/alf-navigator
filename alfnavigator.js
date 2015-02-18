define('NavigatorView',['jquery', 'animojs'], function(){
	return NavigatorView;
	
	function NavigatorView(args){
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
define('NavigatorController',['NavigatorView', 'async', 'underscore', 'backbone', 'parsequery', 'jquery'], function(NavigatorView, async){
	return NavigatorController;
	
	/**
	 * Initializes backbone-router and start Backbone.history. 
	 * 
	 */
	function NavigatorController(args){
		var scope = this;
		var view = undefined;	
		var currentContentController = undefined;		
		var router = undefined; // Backbone.Router
		var pageRootPath = ''; // is set to page's root path (form where it is served)
		
		this.contentRegister = {};		
		this.defaultContent = undefined;
		this.targetContent = '.content-container';
		
		function init(){
			scope.applyOptions(args);			
			_.bindAll.apply(_,[scope].concat(_.functions(scope)));
			view = new NavigatorView({controller: scope});	
			initRouter();
		}
		
		this.applyOptions = function(args){
			_.extend(this, _.pick(args, ['contentRegister', 'defaultContent', 'targetContent']));
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
			var controllerUri = scope.contentRegister[urlState.content];			
			if(!controllerUri){
				throw new Error('This content-name is not registered, '+urlState.content);
			}
			require([controllerUri], function(ContentController){		
				if(ContentController.__esModule){
					ContentController = ContentController[_.functions(ContentController)[0]];
				}
				
				var formerContentController = currentContentController;
				currentContentController = new ContentController(urlState);
				if(!currentContentController.init){
					throw new Error('ContentController '+currentContentController.constructor+' has no init-method, consider '+
							' to inherit from a BaseContentController instance via alfnavigator.ContentController ');
				}				
				currentContentController.init(function(){
					async.series([view.createHideContentTask(formerContentController),
					              view.createShowContentTask(currentContentController)]);
				});
			});
		}
		
		/**
		 * @param navTarget : via name as registered in 'contentRegister'
		 */
		this.navigate = function(navTarget){
			router.navigate(pageRootPath+'?'+jQuery.param({content:navTarget}), {trigger: true});
		};
		
		init();
	}
});
define('BaseContentController',['underscore'], function(){	
	/**
	 * Abstract-layer for all content-controller.
	 * @param args : urlState (query-params from current-url)
	 */
	function BaseContentController(args){}
	
	BaseContentController.prototype = {
		view: undefined,  
		
		/**
		 * Override in order to init controller.
		 * Note, before the callback the view must be initialized.
		 * @param callback : must be called to signal ready with init.
		 */
		init : function(callback){
			callback();
		},
		
		/**
		 * Triggers the view to add initialized content ($el) to given $content.
		 * @param $content, the content in which the view to render
		 */
		show : function($content){
			if(!this.view){
				throw new Error('The controller '+this.constructor+' must initialize the view!');
			}
			this.view.show($content);
		},
		
		/**
		 * Initializes given View-constructor with given args, this controller instance
		 * is added by default to the args.
		 * @param View - view-constructor
		 * @param args - args to apply
		 */
		initPageViewTask : function(View, args){
			var scope = this;
			args = _.extend({controller: this}, args);
			return function(callback){			
				scope.view = new View(args);
				callback();			
			};
		}		
	}
	BaseContentController.prototype.constructor = BaseContentController;
	
	return BaseContentController;
});
define('BaseContentView',['jquery'], function(){	
	/**
	 * Abstract-layer for all content-views.
	 * @param args : {html : 'html snippet which becomes $el'} 
	 */
	function BaseContentView(args){		
		var scope = this;

		function init(){
			if(!args.html){
				window.console && console.warn('Instances of BaseContentView should always be initialized with html-argument');
			}
			scope.$el = jQuery(args.html); // view context
			scope.controller = args.controller;
		}	

		init();
	}

	BaseContentView.prototype = {
			$el : undefined, // view context
			controller : undefined,
			/**
			 * @param $content : the content to add the view's $el
			 */
			show : function($content){
				$content.append(this.$el);
			}
	};
	BaseContentView.prototype.constructor = BaseContentView;

	return BaseContentView;
});
define('alfnavigator',['NavigatorController', 'BaseContentController', 'BaseContentView', 'underscore'],
function(NavigatorController, BaseContentController, BaseContentView){	
	/**
	 * Call to instantiate.
	 * @param args : {contentRegister: ContentRegister,
	 *                defaultContent: String (url-content-name),
	 *                targetContent : String (the container-selector in which views are rendered, default:  '.container.content')}
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
