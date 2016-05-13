angular.module('angularapp.services', [  ] )

.service('LoginService', function($rootScope, $http, $q, NavService, $localStorage, AppSettings ) {
    return {        
        loginUser: function(username, password) {
            if(typeof username == "undefined" || username === "")  { 
                return $q.reject("Empty Username");
            }
            if(typeof password == "undefined" || password === "")  { 
                return $q.reject("Empty Password");
            }
            var baseurl = AppSettings.baseurl;
            var data = { "username": username, "password": password };
            var req = {
              "method": 'POST',
              "url": baseurl + '/rest/auth/login',
              "headers": {
                'Content-Type': "application/json"
              },
              "data": JSON.stringify(data)
            };
            return $http(req);
        },        
        setAccess: function(username, token) {
            $rootScope.loggedIn = username;
            $rootScope.token = token;
            $localStorage.set("username", username);
            $localStorage.set("token", token);
        }
    };
})



.factory("NavService", function($rootScope, $state, AppSettings, $localStorage, $uibModal) {
    return {             
        to: function() {
            var ts = new Date().getTime();
            var route = arguments.length>0 ? arguments[0] : null;
            var p1 = arguments.length>1 ? arguments[1] : null;
            var p2 = arguments.length>2 ? arguments[2] : null;
            var item;
            for(var i = 0; i < AppSettings.pages.length; i++ ) {
                item = AppSettings.pages[i].replace(/\s/g, '').toLowerCase();                
                if(item == route) {
                   $state.go(route, { count: ts }, { reload: true }); 
                   break;
                };
            };
            if(item==route) return;
            switch(route) { // else
              case "logout": 
                  $rootScope.token = null;
                  $rootScope.loggedIn = false;
                  $localStorage.set("username", false);
                  $localStorage.set("token" , null)                  
                  $state.go('main', { count: ts }, { reload: true }); 
                  break;              
            }            
        },
        modal: function(mode, message) {
            var ModalInstanceCtrl = function ($scope, $uibModalInstance) {        
              $scope.data = { 
                mode: mode,
                boldTextTitle: mode == "danger" ? "Warning" : "Message",
                textAlert: message
              };
              $scope.ok = function () {
                $uibModalInstance.close($scope);
              };
              $scope.close = function() {
                    $uibModalInstance.close($scope);
              };              
              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };
            };
            return $uibModal.open({
              templateUrl: 'tpl/modalalert.html',
              controller: ModalInstanceCtrl,
              backdrop: true,
              keyboard: true,
              backdropClick: true,
              size: 'lg',
              resolve: {
                data: {}
              }
            });
        }
    };
})



.factory('authInterceptor', function ($rootScope, $q) {
  return {
    request: function (config) {      
      var url = config.url;     
      if(url) {
          if(url.indexOf("tpl/")===0) return config;          
          if(url.indexOf("auth/login")>-1) return config;
      }      
      config.headers = config.headers || {};
      var token = $rootScope.token;
      if(token!==null) config.headers.Authorization = 'Bearer ' + token;
      return config;
    },
    response: function (config) {   
      return config;         
    },
    responseError: function (response) {
      if (response.status === 401) {
          //here I preserve login page           
          $rootScope.$broadcast('unauthorized');
      }
      return $q.reject(response);
    }
  };
}) 

.factory('$localStorage', ['$window', '$cookies', function($window, $cookies) {
  var abstractStorage = function() {
      this.strategy = null;

      this.setStrategy = function(strategy) {
          this.strategy = strategy;
      };
      this.set = function(k,v) {
          return this.strategy.set(k,v);
      };
      this.get =  function(k,d) {
          return this.strategy.get(k,d);
      };
  };  
  var htmlStorage = function() {
     this.set = function(key, value) {
          var data = { 'd': value };      
          $window.localStorage[key] = encodeURIComponent(JSON.stringify(data));
     };
     this.get = function(key, defaultValue) {
        if($window.localStorage[key]) {
            var data = JSON.parse(decodeURIComponent($window.localStorage[key]));
            return data['d'];
        };
        return defaultValue;
     };   
  };
  var cookieStorage = function() {
    this.set = function(key, value) {
        var data = { 'd': value };      
        var d = new Date();
        var minutes = 30;
        d.setTime(d.getTime() + (minutes * 60 * 1000));
        $cookies.put(key, encodeURIComponent(JSON.stringify(data)),{ expires: d });
    };
    this.get = function(key, defaultValue) {
      var c = $cookies.get(key);
      if(typeof c !== "undefined") {
          var data = JSON.parse(decodeURIComponent($cookies.get(key)));
          return data['d'];
      };
      return defaultValue;
    };   
  };

  var cookies = new cookieStorage();
  var storage = new abstractStorage();
  storage.setStrategy(cookies);
  return storage;
}])


.factory('RestService', function($http , $rootScope, $q, AppSettings) {  

  var baseurl = AppSettings.baseurl;  
  
  var mservice = {
    "dashboard": function(userid) {
        var dfd = $q.defer();
        var req = {
            "method": 'GET',
            "url": baseurl + "/rest/dashboard/" + userid,              
            "cache": false
        };    
        $http(req).then(function(result) {
            dfd.resolve({success: true, result: result.data});
        },function(result) {
            dfd.resolve({success: false});
        });       
        return dfd.promise;
    }
  };
  return mservice; 
})
