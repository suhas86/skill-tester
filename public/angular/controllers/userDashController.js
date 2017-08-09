myApp.controller('userDashController', ['SkillService', function (SkillService) {
    var main = this;
    main.list = [];
    //Get list
    this.getTestList = function () {
        SkillService.getAllTest().then((response) => {
            if (response.data.error) {

            } else {
                main.list = response.data.data;
            }
        }, (err) => {
            alert("Oops something gone wrong");
        });
    }

    //Call List
        this.getTestList();
}])