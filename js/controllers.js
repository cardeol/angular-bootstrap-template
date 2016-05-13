angular.module('angularapp.controllers', [])

.controller('MainCtrl', function ($scope, $rootScope) {
      
})

.controller('NavCtrl',function($scope, $http, $rootScope, $location, NavService, AppSettings) {
    var p, item , pages = [];

    var init = function() {
        $scope.pages = [];
        for(var i =0;  i < AppSettings.pages.length; i++) {
            p = {};
            item = AppSettings.pages[i];
            if(typeof item === "string") {
                p.name = item;
                p.link = item.toLowerCase();
                p.hasmenu = false;
                p.menu = null;
            } else {
                for(var k in item) {
                    p.name = k;
                    p.link = k.toLowerCase();
                    p.hasmenu = true;
                    p.menu = item[k];    
                }            
            };
            pages.push(p);
        };
        $scope.pages = pages;
    }
    if(typeof $scope.pages === "undefined") init();
    
    $scope.isCollapsed = true;

    $scope.isActive = function (page) { 
        return page.link === $location.path();
    };   

    $scope.requireLogin = function(page) {
        return page.link !== "login";
    };


    $scope.nav = function(page) {
        if(typeof page === "string")  {
            if(page=="logout") $scope.isCollapsed = true;
            NavService.to(page);
        } else {
            NavService.to(page.link);    
        }
        return false;
    };      
})


.controller('LoginCtrl', function ($scope, $rootScope, LoginService, NavService) {    
    $scope.login = function() {
        // mock login
        LoginService.setAccess($scope.username,$scope.password);
        NavService.to("main");
        return;
        LoginService.loginUser($scope.username, $scope.password)
        .then(function(response) {
            var data = response.data;
            if(data.token !== null && data.token !== "") {
                LoginService.setAccess($scope.username,data.token);
                NavService.to("main");
                return;
            } else if(data.error !== null) {
                alert("check your credentials");
            }                
        }, function(response) {
             if(response.status=="401") {
                alert("login failed");
             } else {
                if(typeof response==="string") alert("Error: " + response); else alert("check your network");
             }

        });
        return false;
    };
})  

.controller('PushtestCtrl', function($scope, NavService, RestService) {
     $scope.sendMessage = function() {        
        if(typeof $scope.regid === "undefined" || $scope.regid == "") {
            NavService.modal("danger", "Registration ID is not defined");
            return;
        }
        if(typeof $scope.message === "undefined" || $scope.message == "") {
            NavService.modal("danger", "Message is not defined");
            return;
        }
        RestService.sendMessage($scope.regid, $scope.message)
        .then(function(r) {
            console.log(r);
            NavService.modal("success", "Message sent! ");    
        }, function(err) {
            console.log(err);
            NavService.modal("danger", "Error Sending Message");

        });        
    };   
})
