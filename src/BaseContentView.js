define(['jquery'], function(){
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

	// this way of implementation ensures that it works together with es6 inheritance
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
