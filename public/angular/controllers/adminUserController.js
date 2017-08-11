myApp.controller('adminUserController', ['SkillService', '$routeParams',
    function (SkillService, $routeParams) {
        var main = this;
        main.data = [];
        main.id = $routeParams.id;
        main.statsData = {};
        this.getUserResults = function (id) {
            SkillService.getUserResults(id).then((response) => {
                console.log(response);
                if (response.data.error) {

                } else {
                    main.data = response.data.data;
                    main.statsData.totalTest = main.data.length;
                    main.statsData.correct = 0;
                    main.statsData.wrong = 0;
                    main.statsData.score = 0;
                    for (var i = 0; i < main.data.length; i++) {
                        main.statsData.correct = main.statsData.correct + main.data[i].correctAnswers;
                        main.statsData.wrong = main.statsData.correct + main.data[i].wrongAnswers;
                        main.statsData.score = main.statsData.correct + main.data[i].testScore;
                    }
                    main.statsData.average = 0;
                    main.statsData.average = ((main.statsData.score) / main.data.length)
                }
            }, (err) => {
                alert("Oops something gone wrong");
            })
        }

        //Get User Result list
        this.getUserResults(main.id);
    }
]);