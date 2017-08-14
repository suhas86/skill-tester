myApp.controller('takeController',['SkillService','$location',
function(SkillService,$location){
    var main=this;
      main.list = [];

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

     main.modalShown = false;
    this.toggleModal = function (id) {
        main.selectedTest=id;
        main.modalShown = !main.modalShown;
    };
    this.takeTest=function(){
        $location.path('/take-test/'+main.selectedTest);
    }

    this.getTestList();
}])