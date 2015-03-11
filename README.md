# alfnavigator
Navigator for single-page apps giving maximal freedom in implementation.

- page navigations must be registered in 'contentRegister'
  which maps the navigation names as used in url to a contentController
  instance.
- navigation results in replacing the content in container as specified by
  'targetContainer'
- navigation requires for the contentController
- the contentController init-method is invoked, here the contentView should
  be registered and when ready the init-callback must be called.
- the navigator triggers the View to create an remove and add task
- the remove task triggers to remove the former contentView's el to remove
- the add task triggers show-method on the contentController which delegate to
  the contentView. the contentView adds its el to the content-container which
  is passed as argument.
- the navigator provides method to create contentViews and contentController.
  The contentView has a {html: string} argument for the html-content which it uses
  to create its el.
  To both method, constructors are given which implement the specific controller/view.

  Build:
  > r.js -o build.js
  the target is alfnavigator.js

  Initiate the navigator:
  navigator({...options});

  Use the navigator:  
  navigator.navigate(content);
  This call navigate to the registered content-name and returns a promise.
  The promise is fulfilled when the new content is fully rendered on page.
  
  Events:
  - when navigating, before the request for new page contents is made, 'beforeNavigate' is called
    on the current ContentController. This may be used to notify the user about loading resources.  
  
  
  Test:
  >node app.js
  then point browser to: localhost:3000/index.html

  New mvc's which shall become navigation target must be registered in navigator.contentRegister

  Note, in order to set-up animo.js correctly you'll need the dependency
  to animate.css
  Register in requirejs.config:
  a path: 'animate': '../libs/animate.css/animate'
  a shim: 'animojs':{
    		deps: ['jquery', 'animate']
    	}
