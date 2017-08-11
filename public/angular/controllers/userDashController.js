myApp.controller('userDashController', ['SkillService', function (SkillService) {
    var main = this;
    main.list = [];
    //Stats data
    main.statsData={};
    main.data=[];
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
    this.getStats=function(){
        SkillService.getStats().then((response)=>{
            console.log(response.data);
            main.data=response.data.data;
            main.statsData.totalTest=main.data.length;
            main.statsData.correct=0;
            main.statsData.wrong=0;
            main.statsData.score=0;
            for (var i=0;i<main.data.length;i++){
                main.statsData.correct=main.statsData.correct+main.data[i].correctAnswers;
                main.statsData.wrong=main.statsData.correct+main.data[i].wrongAnswers;
                main.statsData.score=main.statsData.correct+main.data[i].testScore;
            }
            main.statsData.average=0;
            main.statsData.average=((main.statsData.score)/main.data.length)
        },(err)=>{
            alert("Oops something gone wrong");
        })
    }

    //Call List
    this.getTestList();
    //getStats
    this.getStats();
}])