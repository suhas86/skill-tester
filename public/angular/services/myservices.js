myApp.service('SkillService', function ($http) {
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
})