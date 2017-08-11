var myApp=angular.module('skilltest',['ngRoute','ngCookies','chart.js'])
.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});