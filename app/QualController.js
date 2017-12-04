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

  phase1QuestionQualController.$inject = ['LocalStorage', 'QueryService','$scope','$location','$window','$routeParams','$anchorScroll'];


  function phase1QuestionQualController(LocalStorage, QueryService,$scope,$location,$window,$routeParams,$anchorScroll) {
    // 'controller as' syntax
    var self = this;
    self.currentPhase = $routeParams.phase;   
    self.currentNASAQuestionIndex = $routeParams.ques_id;
    self.currentAnswer = '';
    self.high = '';
    self.view = 'firstView';
    self.selectedComarison = 0;
    if(!self.NASAQuestionsOfAVideo){
      self.NASAQuestionsOfAVideo = {};
    }
    self.ques_completed = false;
    if($routeParams.ques_id=='completed'){
        self.ques_completed = true;
    }

    self.radioChoices = [
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      },
      {
        selected:'',
      }
    ];

    self.gotoComparison = function(){
      self.view = 'comparison';
    };
    self.goToNextComparisonQuestion = function(){
      self.selectedComarison++;
      if(self.selectedComarison == 15){
        calculateNASATLX();
      }
    };

    var calculateNASATLX = function(){
      var totalValue = 0;
      for(var i=0;i<self.NASAQuestionsOfAVideo.length;i++){
        var counter = 0;
        for(var j=0;j<self.radioChoices.length;j++){
          console.log(self.NASAQuestionsOfAVideo[i].answer_options);
          console.log(self.radioChoices[j]);
            if(self.NASAQuestionsOfAVideo[i].answer_options  == self.radioChoices[j])
            {
              counter++;
            } 
        }
        totalValue+=(counter*self.NASAQuestionsOfAVideo[i].users_answer);
        // console.log('insider iterator:');
        // console.log(totalValue);
      }
      totalValue/=15;
      console.log("total Value is:");
      console.log(totalValue);
      console.log("users answer is :");
      console.log(self.NASAQuestionsOfAVideo);
      console.log("radioChoices");
      console.log(self.radioChoices);
      submitNASAAnswer(totalValue);
    };

    var submitNASAAnswer = function(nasa_val){
      let param = {
            video_id: $routeParams.video_id,
            type: 'NASATLX',
            condition: $routeParams.condition,
            question_type: 'NASATLX_SUMMARY',
            accuracy: nasa_val,
            total_time_taken_to_answer: 111,
            total_time_taken_in_video: 1212,
            user_id: $window.localStorage['user_id']
          };
          QueryService.query('POST', 'answer_summaries/', {}, param)
          .then(function(ovocie) {
            console.log('response is');
            console.log(ovocie.data);
          });
          $scope.goToQuant();
    };

    var loadNASAQuestions = function(){

        QueryService.query('GET', 'questions/Any/Both/NASATLX', {}, {})
        .then(function(ovocie) {
          self.NASAQuestionsOfAVideo = ovocie.data;
          console.log('response is');
          console.log(ovocie.data);
        });
    };
    loadNASAQuestions();
    


    self.gotoBottom = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('bottom');

      // call $anchorScroll()
      $anchorScroll();
    };


    self.goToNextQues =function(){
      self.currentAnswer = '';
      if(self.currentQuantQuestionIndex<(self.NASAQuestionsOfAVideo.length -1))
      {
        $location.path('/Qual/'+$routeParams.video_id+'/'+$routeParams.condition+'/'+$routeParams.phase+'/'+(parseInt($routeParams.ques_id)+1));
      }
      else
      {
        $location.path('/Qual/'+$routeParams.video_id+'/'+$routeParams.condition+'/'+$routeParams.phase+'/completed');
      }

    };

    self.submitAnswer = function(ques,users_answer){
      let param = {
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
      QueryService.query('POST', 'answers/', {}, param)
        .then(function(ovocie) {
          console.log('response is');
          console.log(ovocie.data);
          self.goToNextQues();
        });
      
    };


    $scope.goToQuant = function(){
      console.log('phase is:');
      console.log($routeParams.phase);
      $location.path('/Quant/'+$routeParams.video_id+'/'+$routeParams.condition+'/'+$routeParams.phase+'/0')
    };


  }


})();