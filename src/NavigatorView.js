define(['jquery', 'animojs'], function(){
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
				
				if(!controller.animate){
					callback();
					return;
				}
				
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
				if(!controller.animate){
					$target.remove();
					callback();
					return;
				}
				
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
