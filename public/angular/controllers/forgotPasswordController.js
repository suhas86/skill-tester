myApp.controller('forgotController', ['SkillService',
    function (SkillService) {
        var main = this;
        this.forgotPassword = function (data) {
            SkillService.forgotPassword(data).then((response) => {
                console.log(response);
                main.data='';
            }, (err) => {
                alert("Oops something gone wrong");
            })
        }
    }
])