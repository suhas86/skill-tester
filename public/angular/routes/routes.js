myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './views/home-view.html',
            controller: 'homeController',
            // what is the alias of that controller.
            controllerAs: 'homePage'
        }).
        when('/log-in', {
            templateUrl: './views/login-view.html',
            controller: 'loginController',
            // what is the alias of that controller.
            controllerAs: 'loginPage'
        }).
        when('/facebook/:token', {
            templateUrl: './views/social-view.html',
            controller: 'facebookController',
            controllerAs: 'fbPage'
        }).
        when('/google/:token', {
            templateUrl: './views/social-view.html',
            controller: 'facebookController',
            controllerAs: 'fbPage'
        }).
        when('/twitter/:token', {
            templateUrl: './views/social-view.html',
            controller: 'facebookController',
            controllerAs: 'fbPage'
        }).
        when('/admin-dashboard', {
            templateUrl: './views/admin-dashboard-view.html',
            controller: 'adminController',
            // what is the alias of that controller.
            controllerAs: 'adminPage',
            authenticated: true,
            isAdmin:true
        }).
        when('/admin-test-edit/:id', {
            templateUrl: './views/admin-test-view.html',
            controller: 'adminTestController',
            // what is the alias of that controller.
            controllerAs: 'ediTestPage',
            authenticated: true,
            isAdmin:true
        }).
        when('/user-dashboard', {
            templateUrl: './views/user-dashboard-view.html',
            controller: 'userDashController',
            // what is the alias of that controller.
            controllerAs: 'userDashPage',
            authenticated: true
        }).
        when('/take-test/:id', {
            templateUrl: './views/test-view.html',
            controller: 'testController',
            // what is the alias of that controller.
            controllerAs: 'testPage',
            authenticated: true
        }).
        when('/user-performance/:id', {
            templateUrl: './views/admin-user-view.html',
            controller: 'adminUserController',
            controllerAs: 'adminUserPage',
            authenticated: true,
            isAdmin:true
        }).
        when('/user-result/:id', {
            templateUrl: './views/user-result-view.html',
            controller: 'userResultController',
            controllerAs: 'userResultPage',
            authenticated: true
        }).
        when('/logout', {
            templateUrl: './views/logout-view.html'
        }).
        when('/forgot-password',{
            templateUrl:'./views/forgot-password-view.html',
            controller:'forgotController',
            controllerAs:'forgotPage'
        }).
        when('/reset/:token',{
            templateUrl:'./views/reset-password-view.html',
            controller:'resetController',
            controllerAs:'resetPage'
        }).
         when('/profile',{
            templateUrl:'./views/profile-view.html',
            controller:'profileController',
            controllerAs:'profilePage',
            authenticated: true
        }).
         when('/take-test',{
            templateUrl:'./views/take-test-view.html',
            controller:'takeController',
            controllerAs:'takePage',
            authenticated: true
        }).
        otherwise(
        {
            //redirectTo:'/'
            template: '<h1>404 page not found</h1>'
        }
        );
}]);

myApp.run(["$rootScope", "$location", "SkillService",
    function ($rootScope, $location, SkillService) {
        $rootScope.$on("$routeChangeStart",
            function (event, next, current) {
                //If user tries to access route which are authenticated 
                //condition will allow only if he is logged in else 
                //redirect him back to login page
                if (next.$$route.authenticated) {
                    if (!SkillService.isLoggedIn()) {
                        $location.path("/log-in");
                    }
                }
                //Only Admin can acess these pages
                if (next.$$route.isAdmin) {
                    if (!SkillService.checkAdmin()) {
                        $location.path(current.$$route.originalPath);
                    }
                }
                //If user is logged in and try to access login page
                //redirect him back to original page
                if (next.$$route.originalPath == "/log-in") {
                    if (SkillService.isLoggedIn()) {
                        console.log("Current route ",current);
                        console.log("Event route ",next);
                        $location.path(current.$$route.originalPath);
                    }
                }
            })
    }]);