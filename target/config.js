require.config({
    baseUrl: '.',
    paths: {
    	'jquery':'libs/jquery/dist/jquery',
    	'bootstrap':'libs/bootstrap/dist/js/bootstrap',
    	'backbone': 'libs/backbone/backbone',
    	'underscore': 'libs/underscore/underscore',
      	'async': 'libs/lib/async',
    	    'animojs': 'libs/animo.js/animo',
    	    'animate': 'libs/animate.css/animate',
    	    'parsequery': 'libs/parsequery/index',
    	   'async':'libs/async/lib/async',
    	   'css': 'libs/require-css/css',
    	   'text': 'libs/text/text',
         'q': 'libs/q/q'
    },
    shim:{
    	'bootstrap':{
    		deps: ['jquery']
    	},
    	'backbone':{
    		deps: ['jquery','underscore']
    	},
    	'parsequery':{
    		deps: ['jquery']
    	},
    	'animojs':{
    		deps: ['jquery', 'css!animate']
    	}
    },
    map: {
    	  '*': {
    	    'css': 'css',
    	    'text': 'text'
    	  }
    	}
  });
