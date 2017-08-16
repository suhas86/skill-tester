myApp.controller('adminController', ['SkillService','$location',
    function (SkillService,$location) {
        var main = this;
        main.response = {};

        main.list = [];
        main.users=[];
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

        //Get Users
        this.getUsers=function(){
            SkillService.getUsers().then((response)=>{
                if(response.data.error){

                } else {
                    main.users=response.data.data;
                }
            },(err)=>{
                alert("Oops something gone wrong");
            })
        }

        //Create Test
        this.createTicket = function (data) {
            SkillService.createTest(data).then((response) => {
                main.response = response.data;
                if (main.response.error) {

                } else {
                    alert("Test created successfully");
                    main.testData = "";
                    main.getTestList();
                }
            }, (err) => {
                alert("Oops something gone wrong");
            });
        }

        //Delete Test
        this.deleteTest=function(id){
            SkillService.deleteTest(id).then((response)=>{
                if(response.data.error){
                    alert(message);
                } else {
                    alert("Deleted successfully");
                    main.getTestList();
                }
            },(err)=>{
                alert("Oops something gone wrong");
            })
        }

        //Navigate to get all users
        this.getAll=function(){
            $location.path('/user-performance/1')
        }

        //Call List
        this.getTestList();

        //Get List
        this.getUsers();
    }
]);