myApp.controller('facebookController', ['SkillService', '$location','$rootScope','$routeParams',
function (SkillService,$location,$rootScope,$routeParams) {

    SkillService.facebook($routeParams.token);
    $location.path('/user-dashboard');

}]);