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
            controllerAs: 'adminPage'
        }).
        when('/admin-test-edit/:id', {
            templateUrl: './views/admin-test-view.html',
            controller: 'adminTestController',
            // what is the alias of that controller.
            controllerAs: 'ediTestPage'
        }).
        when('/user-dashboard', {
            templateUrl: './views/user-dashboard-view.html',
            controller: 'userDashController',
            // what is the alias of that controller.
            controllerAs: 'userDashPage'
        }).
        when('/take-test/:id', {
            templateUrl: './views/test-view.html',
            controller: 'testController',
            // what is the alias of that controller.
            controllerAs: 'testPage'
        }).
        when('/user-performance/:id', {
            templateUrl: './views/admin-user-view.html',
            controller: 'adminUserController',
            controllerAs: 'adminUserPage'
        }).
        when('/user-result/:id', {
            templateUrl: './views/user-result-view.html',
            controller: 'userResultController',
            controllerAs: 'userResultPage'
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
            controllerAs:'profilePage'
        }).
        otherwise(
        {
            //redirectTo:'/'
            template: '<h1>404 page not found</h1>'
        }
        );
}]);