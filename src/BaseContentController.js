define(['underscore'], function(){	
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