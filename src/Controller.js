define(['View', 'underscore', 'backbone', 'parsequery', 'jquery'], function(View){
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
		
		/**
		 * @param navTarget : via name as registered in 'contentRegister'
		 */
		this.navigate = function(navTarget){
			router.navigate(pageRootPath+'?'+jQuery.param({content:navTarget}), {trigger: true});
		};
		
		init();
	}
});