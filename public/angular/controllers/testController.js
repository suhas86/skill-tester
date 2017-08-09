myApp.controller('testController', ['SkillService', '$routeParams',
    function (SkillService, $routeParams) {
        var main = this;
        main.testData = {};
        main.id = $routeParams.id;
        this.getTestById = function (id) {
            SkillService.getTestById(id).then((response) => {
                main.testData = response.data.data;
            }, (err) => {
                alert("Oops something went wrong");
            })
        }

        //Get Test by Id
        this.getTestById(this.id)
    }])