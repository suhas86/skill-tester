myApp.service('SkillService', function ($http, authToken) {
    var main = this;

    this.signUp = function (data) {
        return $http({
            method: "POST",
            data: data,
            url: '/users/signup'
        })
    }
    this.login = function (data) {
        return $http({
            method: "POST",
            data: data,
            url: '/users/login'
        })
    }
    this.setToken=function(token){
       return authToken.setToken(token);
    }
    //Is logged in
    this.isLoggedIn = function () {
        if (authToken.getToken()) {
            return true;
        } else {
            return false;
        }
    }
    //Set Token from facebook
    this.facebook=function(token){
        authToken.setToken(token);
    }
    this.getUser=function(){
        if(authToken.getToken()){
            return $http({
                method: "POST",
                url: '/users/profile'
            })
        } else {
            $q.reject({message:'User has no token'})
        }
    }

    /**********Admin Apis ***********************/
    //Create test
    this.createTest=function(data){
        return $http({
            method:"POST",
            url:'/test/admin/create',
            data:data
        })
    }
    //Get Test
    this.getAllTest=function(){
        return $http({
            method:"GET",
            url:'/test/admin/all'
        })
    }
    //Get test by id
    this.getTestById=function(id){
        return $http({
            method:"GET",
            url:'/test/single/'+id
        })
    }
    //Update test
    this.updateTest=function(data,id){
        return $http({
            method:"PUT",
            url:'/test/admin/update/'+id,
            data:data
        })
    }
    //Create question
    this.createQuestion=function(data){
        return $http({
            method:'POST',
            url:'/test/createquestion',
            data:data
        })
    }
})