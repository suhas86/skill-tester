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
            controller:'facebookController',
            controllerAs:'fbPage'
        }).
        when('/google/:token', {
            templateUrl: './views/social-view.html',
            controller:'facebookController',
            controllerAs:'fbPage'
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
        otherwise(
        {
            //redirectTo:'/'
            template: '<h1>404 page not found</h1>'
        }
        );
}]);