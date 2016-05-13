
angular.module('angularapp', [ 'ui.bootstrap', 'ngRoute', 'ui.router',  'ngAnimate', 'ngCookies', 'angularapp.controllers', 'angularapp.services' ] )

.constant('AppSettings', {
    'pages': [ 'Main', 'Login' ],
    'baseurl': 'http://[my stateless rest server]'
})

.config(function($httpProvider, $stateProvider, $urlRouterProvider, AppSettings) {  
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.interceptors.push('authInterceptor');  
  var lpage, upage;
  var pages = AppSettings.pages;
  for(var i = 0; i<pages.length; i++) {                
      /*if(typeof pages[i]!=="string") {
          for(var k in pages[i]) {
              addState([k]);
              addState(pages[i][k]);                  
          };
          continue;
      };*/          
      lpage = pages[i].toLowerCase().replace(/\s/g, '');
      upage = lpage[0].toUpperCase() + lpage.substr(1);
      $stateProvider.state(lpage, { url: '/' + lpage + "?:count", controller: upage + "Ctrl", templateUrl: "tpl/" + lpage + ".html" });
  };  
  
})

.run(function($rootScope, NavService, $state, $localStorage) {
    $rootScope.loggedIn = $localStorage.get("username", false);
    $rootScope.token = $localStorage.get("token", null);    
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if($rootScope.loggedIn === false) {        
        if(toState.name !== "login") {
            NavService.to("login");
            event.preventDefault();
        };
      } else {
        if(toState.name === "login") {
             NavService.to("main");
             event.preventDefault();         
        }
      }
    });    
    NavService.to("main");
})

