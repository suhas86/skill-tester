var myApp=angular.module('skilltest',['ngRoute','ngCookies'])
.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});