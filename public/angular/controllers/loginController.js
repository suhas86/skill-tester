myApp.controller('loginController', ['SkillService', '$location', '$rootScope', '$window', '$timeout',
    function (SkillService, $location, $rootScope, $window, $timeout) {
        var main = this;
        this.response = {};
        main.loadme = false;
        //Formats required for validation
        this.emailFormat = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        this.mobileFormat = /^[0-9]{10,10}$/;
        main.userId = 0;
        main.name = '';
        //Root Scope to check login and get user
        $rootScope.$on('$routeChangeStart', function () {
            if (SkillService.isLoggedIn()) {
                main.isLoggedIn = true;

                SkillService.getUser().then((response) => {
                    main.loadme = true;
                        console.log(response)
                    if (response.data == null) {
                        main.logout();
                    } else {
                        main.userId = response.data.userType;
                        if (response.data.firstName == '') {
                            main.name = "User";
                        } else {
                            main.name = response.data.firstName + ' ' + response.data.lastName;
                        }

                    }
                })
            } else {
                main.isLoggedIn = false;
                main.loadme = true;
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
                if (response.data.error) {

                } else {
                    SkillService.setToken(main.response.token);
                    main.regData = "";
                    $location.path('/user-dashboard');
                }


            }, (err) => {
                main.response = response.data;
            })
        }

        //Login
        this.login = function (data) {
            SkillService.login(data).then((response) => {
                console.log(response);
                main.response = response.data;
                if (response.data.error) {

                } else {
                    SkillService.setToken(main.response.token);
                    main.logData = '';
                    if (main.response.data.userType == 1) {
                        $location.path('/admin-dashboard');
                    } else {
                        $location.path('/user-dashboard');
                    }
                }

            }, (err) => {
                main.response = response.data;
            })
        }

        //Facebook
        this.facebook = function () {
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook'
        }
        //Google
        this.google = function () {
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google'
        }
        //Twitter
        this.twitter = function () {
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter'
        }

        //Logout
        this.logout = function () {
            SkillService.setToken();
            main.userId = 0;
            main.name = '';
            $location.path('/logout');
            $timeout(function () {
                $location.path('/log-in');
            }, 2000);
        }
    }
]);