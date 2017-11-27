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
    .controller('phase1QuestionQuantController', phase1QuestionQuantController);

  phase1QuestionQuantController.$inject = ['LocalStorage', 'QueryService','$scope','$location','$window','$routeParams'];


  function phase1QuestionQuantController(LocalStorage, QueryService,$scope,$location,$window,$routeParams) {

    // 'controller as' syntax
    var self = this;
    
    $scope.goToQual = function(){
      console.log('phase is:');
      console.log($routeParams.phase);
      $location.path('/Qual/vidSplit/adsasdlkjfas/'+$routeParams.phase)
    };
  }


})();