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
    .controller('phase1QuestionQualController', phase1QuestionQualController);

  phase1QuestionQualController.$inject = ['LocalStorage', 'QueryService','$scope','$location','$window','$routeParams'];


  function phase1QuestionQualController(LocalStorage, QueryService,$scope,$location,$window,$routeParams) {

    // 'controller as' syntax
    var self = this;

    $scope.goToPhase2 = function(){

      if($routeParams.phase == 'phase1'){
        $location.path('/parent_phase/FMiCOx95lAc/adsasdlkjfas/phase2/learnerSourcing');  
     }
     else{//go to final page
        $location.path('/final_page');  
     }
      
    };


  }


})();