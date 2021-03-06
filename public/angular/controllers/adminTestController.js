myApp.controller('adminTestController', ['SkillService', '$routeParams',
    function (SkillService, $routeParams) {
        var main = this;
        main.testData = {};
        main.id = $routeParams.id;
        main.isSave = true;
        main.isTError = false;
        main.isQError = false;
        main.errorTmessage = "";
        main.errorQmessage = "";
        //Get Test
        this.getTestById = function (id) {
            SkillService.getTestById(id).then((response) => {
                main.testData = response.data.data;
            }, (err) => {
                alert("Oops something went wrong");
            })
        }

        //Update test
        this.updateTest = function (data) {
            SkillService.updateTest(data, main.id).then((response) => {
                if (response.data.error) {
                    main.isTError = true;
                    main.errorTmessage = response.data.message
                } else {
                    main.testData = response.data.data;
                }
            }, (err) => {
                alert("Oops something went wrong");
            })
        }

        //Creation question
        this.createQuestion = function (data) {
            data.test_id = main.id;

            SkillService.createQuestion(data).then((response) => {
                if (response.data.error) {
                    main.isQError = true;
                    main.errorQmessage = response.data.message
                } else {
                    //   console.log(response.data);
                    main.qData = '';
                    main.testData = response.data.data;
                    //this.getTestById(this.id);
                }
            }, (err) => {
                alert("Oops something gone wrong");
            });
        }

        //Get question
        this.getQuestion = function (data) {
            main.qData = data;
            main.isSave = false;
        }

        this.updateQuestion = function () {
            console.log(main.qData);
            SkillService.updateQuestion(main.qData, main.id).then((response) => {
                if (response.data.error) {
                    main.isQError = true;
                    main.errorQmessage = response.data.message
                } else {
                    main.qData = '';
                    main.testData = response.data.data;
                }


            }, (err) => {
                alert("Oops something gone wrong");
            })
        }

        //Delete question 
        this.deleteQuestion = function (questId) {
            SkillService.deleteQuestion(main.id, questId).then((response) => {
                if (response.data.error) {
                    alert(message);
                } else {
                    console.log(response.data);
                    this.getTestById(main.id)
                    alert("Deleted successfully")
                }
            }, (err) => {
                alert("Oops something gone wrong");
            })
        }
        //Clear the data
        this.clear = function () {
            main.isSave = true;
            main.qData = '';
        }

        //Get Test by Id
        this.getTestById(this.id)
    }
]);