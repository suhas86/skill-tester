myApp.controller('profileController', ['SkillService','$location',
    function (SkillService,$location) {
        var main = this;
        main.data = {};
        SkillService.getUser().then((response) => {
            main.data = response.data;
        }, (err) => {
            alert("Oops something went wrong");
        })

        //Update profile
        this.update = function (value) {
            SkillService.updateProfile(main.data._id, value).then((response) => {
                if (response.data.error) {

                } else {
                    SkillService.setToken(response.data.token);
                    $location.path('/user-dashboard');
                }
            }, (err) => {
                alert("Oops something gone wrong")
            })
        }
    }
])