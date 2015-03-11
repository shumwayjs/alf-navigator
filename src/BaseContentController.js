define(['underscore'], function(){
	/**
	 * Abstract-layer for all content-controller.
	 * @param args : urlState (query-params from current-url)
	 */
	function BaseContentController(args){}

	// this way of implementation ensures that it works together with es6 inheritance
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
		 * Called when user navigate away from this content.
		 * The call takes place before the new-content request is performed.
		 * This enables to show loading notification.
		 */
		beforeNavigate : function(){},

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
