myApp.controller('loginController', ['SkillService', function (SkillService) {
    var main = this;
    this.response = {};
    //Formats required for validation
    this.emailFormat = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    this.mobileFormat = /^[0-9]{10,10}$/;
    //Register
    this.register = function (data) {

        SkillService.signUp(data).then((response) => {
            console.log(response);
            main.response = response.data;
        }, (err) => {
            main.response = response.data;
        })
    }

    //Login
    this.login = function (data) {
        SkillService.login(data).then((response) => {
            console.log(response);
            main.response = response.data;
        }, (err) => {
            main.response = response.data;
        })
    }
}]);