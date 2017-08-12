myApp.controller('userDashController', ['SkillService', function (SkillService) {
    var main = this;
    main.list = [];
    //Stats data
    main.statsData = {};
    main.data = [];

    
    main.chartLabels = ["Total Tests","Total Correct Answers","Total Wrong Answers","Total Score"];
    main.chartData = [];
    main.colors = ["#337AB7","#E74C3C","#F39C12","#7DCEA0"]
 

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

    //Get Stats
    this.getStats = function () {
        SkillService.getStats().then((response) => {
            console.log(response.data);
            main.data = response.data.data;
            main.statsData.totalTest = main.data.length;
            main.statsData.correct = 0;
            main.statsData.wrong = 0;
            main.statsData.score = 0;
            for (var i = 0; i < main.data.length; i++) {
                main.statsData.correct = main.statsData.correct + main.data[i].correctAnswers;
                main.statsData.wrong = main.statsData.wrong + main.data[i].wrongAnswers;
                main.statsData.score = main.statsData.score + main.data[i].testScore;
            }
            main.statsData.average = 0;
            main.statsData.average = ((main.statsData.score) / main.data.length);
            main.chartData=[main.statsData.totalTest,main.statsData.correct,main.statsData.wrong,main.statsData.score]
        }, (err) => {
            alert("Oops something gone wrong");
        })
    }

    //Call List
    this.getTestList();
    //getStats
    this.getStats();
}])