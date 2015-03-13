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

		// options
		this.contentRegister = {};
		this.defaultContent = undefined;
		this.targetContent = '.content-container';
		this.animate = true;
		this.onContentInitError = function(err){ throw new Error(err); }; // called when ContentController init fails

		function init(){
			scope.applyOptions(args);
			_.bindAll.apply(_,[scope].concat(_.functions(scope)));
			view = new NavigatorView({controller: scope});
			initRouter();
		}

		this.applyOptions = function(args){
			_.extend(this, _.pick(args, ['contentRegister', 'defaultContent',
			 														 'targetContent', 'animate', 'onContentInitError']));
		}

		function initRouter(){
			var Router = Backbone.Router.extend({
				  routes: {
					    '*path': handleRouting, // matches all path and splits query-part
					  }});
			router = new Router();
			Backbone.history.start({pushState: true});
		}

		/**
		 * Handles routing by extracting content from query part and calling showContent.
		 * @param path : url-path
		 * @param query : query-params, the 'content' is used to extract view, the rest is given the content-controller as argument
		 */
		function handleRouting(path, query){
			pageRootPath = pageRootPath || path; // first time-set
			var urlState = jQuery.parseQuery(query);
			showContent(urlState.content || scope.defaultContent, urlState);
		}

		/**
		 * Based on the given parameters requires for the corresponding controller,
		 * initiates and triggers page-transition on pageView.
		 * @param content : registered name in 'contentRegister'
		 * @param urlState : if given, ContentController is given this as argument
		 * @param contentReady : function() - called when content is changed
		 */
		function showContent(content, urlState, contentReady){
			var controllerUri = scope.contentRegister[content];
			if(!controllerUri){
				throw new Error('This content-name is not registered, '+content);
			}
			currentContentController && currentContentController.beforeNavigate();
			require([controllerUri], function(ContentController){
				if(ContentController.__esModule){
					ContentController = ContentController[_.functions(ContentController)[0]];
				}

				var formerContentController = currentContentController;
				currentContentController = new ContentController(urlState || {});
				if(!currentContentController.init){
					throw new Error('ContentController '+currentContentController.constructor+' has no init-method, consider '+
							' to inherit from a BaseContentController instance via alfnavigator.ContentController ');
				}
				currentContentController.init(function(err){
					if(err){
						scope.onContentInitError(err);
						return;
					}
					async.series([view.createHideContentTask(formerContentController),
					              view.createShowContentTask(currentContentController)], contentReady || function(){});
				});
			});
		}

		/**
		 * @param navTarget : via name as registered in 'contentRegister'
		 * @returns : promise, resolve is called with 'currentContentController' as argument.
		 */
		this.navigate = function(navTarget){
			return q.Promise(function(resolve, reject, notify) {
				router.navigate(pageRootPath+'?'+jQuery.param({content:navTarget}), {trigger: false});
				showContent(navTarget, null, function(){ resolve(currentContentController); });
			});
		};

		init();
	}
});
