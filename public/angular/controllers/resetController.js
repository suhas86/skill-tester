myApp.controller('resetController',['SkillService','$routeParams',
function(SkillService,$routeParams){
    var main=this;
    main.token=$routeParams.token;
    main.user={};
    main.isError=false;
    main.errormessage='';
    this.resetPassToken=function(token){
        SkillService.resetPassToken(token).then((response)=>{
            if(response.data.error){
                main.isError=true;
                main.errormessage=response.data.message;
            } else {
                main.user=response.data.data
            }
        },(err)=>{
            alert("Oops something gone wrong");
        })
    }
    this.resetPassword=function(data){
        var temp={};
        temp.password=data.password;
        temp.id=main.user._id;
        SkillService.resetPassword(temp).then((response)=>{
            if(response.data.error){
                main.isError=true;
                main.errormessage=response.data.message;
            } else {
                alert("Password changed successfully. Please log in")
                main.data='';
                main.user=response.data.data
            }
        },(err)=>{
            alert("Oops something gone wrong");
        })
    }

    this.resetPassToken(main.token);
}])