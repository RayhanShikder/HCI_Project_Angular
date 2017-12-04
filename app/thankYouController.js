/**
 * Main application controller
 *
 * You can use this controller for your whole app if it is small
 * or you can have separate controllers for each logical section
 * 
 */
;(function() {

  angular
    .module('boilerplate')
    .controller('thankYouController', thankYouController);

  thankYouController.$inject = ['LocalStorage', 'QueryService','$scope','$location','$window','$routeParams'];


  function thankYouController(LocalStorage, QueryService,$scope,$location,$window,$routeParams) {

    // 'controller as' syntax
    var self = this;
   $window.localStorage.clear();


  }


})();