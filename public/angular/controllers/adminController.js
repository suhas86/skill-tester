myApp.controller('adminController', ['SkillService',
    function (SkillService) {
        var main = this;
        main.response = {};

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

        //Create Test
        this.createTicket = function (data) {
            SkillService.createTest(data).then((response) => {
                main.response = response.data;
                if (main.response.error) {

                } else {
                    main.testData = "";
                    main.getTestList();
                }
            }, (err) => {
                alert("Oops something gone wrong");
            });
        }

        //Call List
        this.getTestList();
    }
]);