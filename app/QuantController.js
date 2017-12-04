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
    self.currentPhase = $routeParams.phase;   
    self.currentQuantQuestionIndex = parseInt($routeParams.ques_id);
    self.currentAnswer = '';
    if(!self.QuantQuestionsOfAVideo){
      self.QuantQuestionsOfAVideo = {};
    }
    self.ques_completed = false;
    if($routeParams.ques_id=='completed'){
        self.ques_completed = true;
    }
    var startTime = null;
    if($routeParams.ques_id == 0 && !startTime){
      startTime = Date.now();
      $window.localStorage['startTime'] = (Date.now()/1000);
    }

    var loadQuantQuestions = function(){

        QueryService.query('GET', 'questions/'+$routeParams.video_id+'/Both/Quant', {}, {})
        .then(function(ovocie) {
          self.QuantQuestionsOfAVideo = ovocie.data;
          console.log('response is');
          console.log(ovocie.data);
        });
    };
    loadQuantQuestions();
    
    

   

     $scope.goToPhase2 = function(){

      if($routeParams.phase == 'phase1'){
        $location.path('/parent_phase/'+angular.fromJson($window.localStorage['selectedFlow']).url2+'/'+angular.fromJson($window.localStorage['selectedFlow']).video2+'/phase2/'+angular.fromJson($window.localStorage['selectedFlow']).condition2);  
     }
     else{//go to final page
        $location.path('/final_page');  
     }
      
    };


    self.goToNextQues =function(){
      self.currentAnswer = '';
      if(self.currentQuantQuestionIndex<(self.QuantQuestionsOfAVideo.length -1))
      {
        $location.path('/Quant/'+$routeParams.video_id+'/'+$routeParams.condition+'/'+$routeParams.phase+'/'+(parseInt($routeParams.ques_id)+1));
      }
      else
      {
        $location.path('/Quant/'+$routeParams.video_id+'/'+$routeParams.condition+'/'+$routeParams.phase+'/completed');
      }

    };

    var calculatedAccuracy = function(){
        let correct = $window.localStorage['correct']?parseInt($window.localStorage['correct']):0;
        return ((correct/self.QuantQuestionsOfAVideo.length)*100);
    };

    self.submitAnswer = function(ques,users_answer){
      
       if(self.QuantQuestionsOfAVideo[self.currentQuantQuestionIndex].correct_answer && users_answer == self.QuantQuestionsOfAVideo[self.currentQuantQuestionIndex].correct_answer){
            $window.localStorage['correct'] = parseInt($window.localStorage['correct']?$window.localStorage['correct']:0)+1;
        }

      if(self.currentQuantQuestionIndex == (self.QuantQuestionsOfAVideo.length -1)){
          let calculated_accuracy = calculatedAccuracy();
          let param = {
            video_id: ques.video_id,
            type: ques.type,
            condition: $routeParams.condition,
            question_type: ques.question_type,
            accuracy: calculated_accuracy,
            total_time_taken_to_answer: Date.now() - parseInt($window.localStorage['startTime'])*1000,
            total_time_taken_in_video: $window.localStorage['time_in_video'],
            user_id: $window.localStorage['user_id']
          };
          QueryService.query('POST', 'answer_summaries/', {}, param)
          .then(function(ovocie) {
            console.log('response is');
            console.log(ovocie.data);
          });

          }


     

      let param2 = {
        question_id: ques._id,
        video_id: ques.video_id,
        type: ques.type,
        condition: $routeParams.condition,
        question_type: ques.question_type,
        asnswer_options: ques.asnswer_options,
        question: ques.question,
        answer: users_answer,
        correct_answer: ques.correct_answer,
        user_id: $window.localStorage['user_id']
      };
      QueryService.query('POST', 'answers/', {}, param2)
        .then(function(ovocie) {
          console.log('response is');
          console.log(ovocie.data);
          self.goToNextQues();
        });
      
        

      
    };
  }


})();