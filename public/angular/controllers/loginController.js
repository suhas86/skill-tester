myApp.controller('loginController', ['SkillService', '$location','$rootScope',
function (SkillService,$location,$rootScope) {
    var main = this;
    this.response = {};
    main.loadme=false;
    //Formats required for validation
    this.emailFormat = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    this.mobileFormat = /^[0-9]{10,10}$/;

    //Root Scope to check login and get user
    $rootScope.$on('$routeChangeStart',function(){
        if(SkillService.isLoggedIn()){
            main.isLoggedIn=true;
            main.loadme=true;
        } else {
            main.isLoggedIn=false;
            main.loadme=true;
        }
    });
    /*if(SkillService.isLoggedIn())
    {
        SkillService.getUser().then((data)=>{
            console.log(data);
        })
    }*/
    //Register
    this.register = function (data) {

        SkillService.signUp(data).then((response) => {
            console.log(response);
            main.response = response.data;
            SkillService.setToken(main.response.token);
            main.regData="";
            
        }, (err) => {
            main.response = response.data;
        })
    }

    //Login
    this.login = function (data) {
        SkillService.login(data).then((response) => {
            console.log(response);
            main.response = response.data;
            SkillService.setToken(main.response.token);
            main.logData=''; 
        }, (err) => {
            main.response = response.data;
        })
    }

    //Logout
    this.logout=function(){
        SkillService.setToken();
        $location.path('/');
    }
}]);