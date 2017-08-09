myApp.controller('adminTestController', ['SkillService', '$routeParams',
    function (SkillService, $routeParams) {
        var main = this;
        main.testData={};
        main.id=$routeParams.id;
        //Get Test
        this.getTestById = function (id) {
            SkillService.getTestById(id).then((response) => {
                main.testData=response.data.data;
            }, (err) => {
                alert("Oops something went wrong");
            })
        }

        //Update test
        this.updateTest=function(data){
            SkillService.updateTest(data,main.id).then((response)=>{
                    if(response.data.error){

                    } else {
                        main.testData=response.data.data;
                    }
            },(err)=>{
                alert("Oops something went wrong");
            })
        }

        //Creation question
        this.createQuestion=function(data){
            data.test_id=main.id;

            SkillService.createQuestion(data).then((response)=>{
                if(response.data.error){

                } else {
                 //   console.log(response.data);
                    main.qData='';
                    main.testData=response.data.data;
                    //this.getTestById(this.id);
                }
            },(err)=>{
                alert("Oops something gone wrong");
            })
        }

        //Get Test by Id
        this.getTestById(this.id)
    }
]);