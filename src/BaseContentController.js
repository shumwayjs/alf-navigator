define(['underscore'], function(){
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