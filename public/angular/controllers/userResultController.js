myApp.controller('userResultController',['SkillService','$routeParams',
function(SkillService,$routeParams){
    var main=this;
    main.testId=$routeParams.id;
    main.result={};
    this.getResult=function(id){
        SkillService.getUserResult(id).then((response)=>{
            if(response.data.error){

            } else {
                main.result=response.data.data;
                console.log(main.result);
            }
        },(err)=>{
            alert("Oops Something gone wrong")
        })
    }

    //Get Result
    this.getResult(main.testId);
}])