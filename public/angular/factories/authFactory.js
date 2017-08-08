myApp.factory('authToken', function ($window) {
    var authTokenFactroy = {}
    //Set token
    authTokenFactroy.setToken = function (token) {
        if (token)
            $window.localStorage.setItem('token', token);
        else
            $window.localStorage.removeItem('token');
    }
    //Get token
    authTokenFactroy.getToken = function () {
        return $window.localStorage.getItem('token');
    }
    return authTokenFactroy;
});

// Factory: AuthInterceptors is used to configure headers with token (passed into config, app.js file)
myApp.factory('AuthInterceptors', function (authToken) {
    var authInterceptorsFactory = {}; // Create factory object

    // Function to check for token in local storage and attach to header if so
    authInterceptorsFactory.request = function (config) {
        var token = authToken.getToken(); // Check if a token is in local storage
        if (token) config.headers['x-access-token'] = token; //If exists, attach to headers

        return config; // Return config object for use in app.js (config file)
    };

    return authInterceptorsFactory; // Return factory object

});