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
    .controller('finalPageController', finalPageController);

  finalPageController.$inject = ['LocalStorage', 'QueryService','$scope','$location','$window','$routeParams'];


  function finalPageController(LocalStorage, QueryService,$scope,$location,$window,$routeParams) {

    // 'controller as' syntax
    var self = this;
    self.FinalQuestions = {};
    var currentUser = {};
    var loadFinalQuestions = function(){

        QueryService.query('GET', 'questions/Any/Both/Final', {}, {})
        .then(function(ovocie) {
          self.FinalQuestions = ovocie.data;
          console.log('response is');
          console.log(ovocie.data);
        });

        QueryService.query('GET', 'users/'+$window.localStorage['user_id'], {}, {})
        .then(function(ovocie) {
          currentUser = ovocie.data[0];
          console.log('response is');
          console.log(ovocie.data);
        });
    };
    loadFinalQuestions();

    self.submitAnswer = function(){
      for(let i=0;i<self.FinalQuestions.length;i++){

        let param = {
            video_id: self.FinalQuestions[i].video_id,
            type: self.FinalQuestions[i].type,
            condition: self.FinalQuestions[i].condition,
            question_type: self.FinalQuestions[i].question_type,
            question: self.FinalQuestions[i].question,
            accuracy: -1,
            text_answer: self.FinalQuestions[i].users_answer,
            total_time_taken_to_answer: 111,
            total_time_taken_in_video: 1212,
            user_id: $window.localStorage['user_id']
          };
          if(self.FinalQuestions[i].question_type == 'likert'){
            param.accuracy = self.FinalQuestions[i].users_answer;
          }
          QueryService.query('POST', 'answer_summaries/', {}, param)
          .then(function(ovocie) {
            console.log('response is');
            console.log(ovocie.data);
          });

          currentUser.creation_status = 'completed';
           QueryService.query('PUT', 'users/'+$window.localStorage['user_id'], {}, currentUser)
          .then(function(ovocie) {
            console.log('response is');
            console.log(ovocie.data);
            $scope.goToThanksPage();
          });

          
      }
       
      
    };

    $scope.goToThanksPage = function(){
        $location.path('/thank_you');  
    };

    self.checkAll = function(){
      return false;
    };


  }


})();