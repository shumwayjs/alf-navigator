define(['NavigatorView', 'async', 'q', 'underscore', 'backbone', 'parsequery', 'jquery'], function(NavigatorView, async, q){
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
					              view.createShowContentTask(currentContentController),
												createContentReadyTask()]);
				});
			});
		}

		// TODO belongs to the 'contentReadyCallback'-hack and will be passed in future
		// the 'resolve' function from the promise directly:  (resolve, callback)
		function createContentReadyTask(){
			return function(callback){
				scope.contentReadyCallback();
				scope.contentReadyCallback = function(){};
				callback();
			};
		}

		//TODO this is a hack, which will be removed when replacing backbone by native code.
		// called when contentController is initialzed and view replaced (navigation finished)
		// In future this instance will be supplied directly to the 'navigate'-method and the 'showContent'
		// is called with this callback as argument.
		this.contentReadyCallback = function(err){};

		/**
		 * @param navTarget : via name as registered in 'contentRegister'
		 * @returns : promise, resolve is called with 'currentContentController' as argument.
		 */
		this.navigate = function(navTarget){
			return q.Promise(function(resolve, reject, notify) {
				router.navigate(pageRootPath+'?'+jQuery.param({content:navTarget}), {trigger: true});
				scope.contentReadyCallback = function(){
					resolve(currentContentController);
				};
			});
		};

		init();
	}
});
