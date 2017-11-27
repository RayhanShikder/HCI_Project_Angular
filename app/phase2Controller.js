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
    .controller('phase2Controller', phase2Controller);

  phase2Controller.$inject = ['LocalStorage', 'QueryService','$scope','$location','$window'];


  function phase2Controller(LocalStorage, QueryService,$scope,$location,$window) {

    // 'controller as' syntax
    var self = this;

    
  }


})();