myApp.service('SkillService', function ($http, authToken) {
    var main = this;

    this.signUp = function (data) {
        return $http({
            method: "POST",
            data: data,
            url: '/users/signup'
        })
    }
    this.login = function (data) {
        return $http({
            method: "POST",
            data: data,
            url: '/users/login'
        })
    }
    this.setToken=function(token){
       return authToken.setToken(token);
    }
    //Is logged in
    this.isLoggedIn = function () {
        if (authToken.getToken()) {
            return true;
        } else {
            return false;
        }
    }
    //Set Token from facebook
    this.facebook=function(token){
        authToken.setToken(token);
    }
    this.getUser=function(){
        if(authToken.getToken()){
            return $http({
                method: "POST",
                url: '/users/profile'
            })
        } else {
            $q.reject({message:'User has no token'})
        }
    }
})