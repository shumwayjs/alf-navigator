define(['jquery'], function(){
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