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
    .controller('parentPhaseController', parentPhaseController);

  parentPhaseController.$inject = ['LocalStorage', 'QueryService','$routeParams','$scope','ytPlayer','$location','$window'];


  function parentPhaseController(LocalStorage, QueryService,$routeParams,$scope,ytPlayer,$location,$window) {
   
    // 'controller as' syntax
    var self = this;
    console.log('route param is:');
    console.log($routeParams.id);
    $scope.showQuestionDivFlag = false;
    var currentQuestionTime;
    var questionsOfAVideo;
    $scope.selectedSelection = "Tab";
    $scope.agreedFlag = false;
    $scope.condition='';
    $scope.learnerSourceQuestionAnswer = {
      answer:''
    };
    // var timeFlags = [ //later save it in localstorage
    //   {
    //     "time":12,
    //     "shown":false
    //   },
    //   {
    //     "time": 22,
    //     "shown": false
    //   }
    // ];


    $scope.options = {
      host: 'https://www.youtube.com',
      videoId:$routeParams.id,
      startSeconds:5.00,
      end:8,
      height:'100%',
      width:'100%',
      playerVars:{rel: 0
        
      } // all parameters supported by youtube-iframe-api
    };
    
    $scope.answer = {
        type: ''
      };
      

    $scope.ytPlayer;

    $scope.$on('ngYoutubePlayer:onPlayerReady', function(event, data, id) {
        $scope.ytPlayer = ytPlayer;
        var videotime = 0; 
        var timeupdater = null;
        function updateTime() {
        var oldTime = videotime;
        if($scope.ytPlayer['myYoutubePlayer'] && $scope.ytPlayer['myYoutubePlayer'].getCurrentTime()) {
          videotime = $scope.ytPlayer['myYoutubePlayer'].getCurrentTime();
        }
        if(videotime !== oldTime) {
          onProgress(videotime);
        }
      }
      timeupdater = setInterval(updateTime, 100);
    });

    var alreadyShown = function(time){
      for(var i=0;i<questionsOfAVideo.length;i++){
        if(Math.floor(time)==questionsOfAVideo[i].time){
          return questionsOfAVideo[i].flag;
        }
      }
      return true;
    };
    var setShownFlag = function(time){
      for(var i=0;i<questionsOfAVideo.length;i++)
      {
        if(Math.floor(time)==questionsOfAVideo[i].time){
          questionsOfAVideo[i].flag=true;
          return;
        }
      }
      return;
    };
    var getCurrentQuestion = function(time){
      for(var i=0;i<questionsOfAVideo.length;i++){
        if(time == questionsOfAVideo[i].time){
          return questionsOfAVideo[i];
        }
      }
      return ;
    };
    
    var showQuestion = function(){
        console.log('showing');
        console.log($scope.showQuestionDivFlag);
        $scope.$apply(function () { 
          $scope.currentQuestion = getCurrentQuestion(currentQuestionTime);
          $scope.currentQuestionEdit = $scope.currentQuestion;
          $scope.showQuestionDivFlag = true;
        });
    };
    $scope.submitAnswer = function(){
      $scope.showQuestionDivFlag = false;
      setShownFlag(currentQuestionTime);
      $scope.seekToVideo(currentQuestionTime); 
      if($routeParams.condition == 'vidSplit'){
        updateVerification($scope.currentQuestion,$scope.answer.type);
        $scope.answer = {
        type: ''
      };
      }
      else if($routeParams.condition == 'learnerSource'){
        submitLearnerSourceAnswer($scope.currentQuestion,$scope.learnerSourceQuestionAnswer.answer);
        $scope.learnerSourceQuestionAnswer.answer = '';
      }
      
      
    };
    $scope.skipAnswer = function(){
      $scope.showQuestionDivFlag = false;
      setShownFlag(currentQuestionTime);
      $scope.seekToVideo(currentQuestionTime); 
      $scope.answer = {
        type: ''
      };
    };

    $scope.setAgreed = function(){
      $scope.agreedFlag = true;
    };

    $scope.$on('ngYoutubePlayer:onPlayerStateChange', function(event, data, id) {
      console.log('inside onPlayerStateChange');
      // console.log($scope.ytPlayer['myYoutubePlayer']);
      // console.log($scope.ytPlayer['myYoutubePlayer'].getPlayerState());
      /*
      player.getPlayerState():Number Returns the state of the player. Possible values are: -1 – unstarted 0 – ended 1 – playing 2 – paused 3 – buffering 5 – video cued
      */
        if (event.data == $scope.ytPlayer['myYoutubePlayer'].getPlayerState()==1 && !done) {
          console.log('inside if');
          //setTimeout($scope.stopVideo, 6000);
          done = true;
        }
        if (event.data == $scope.ytPlayer['myYoutubePlayer'].getPlayerState()==0 && !alreadyShown($scope.ytPlayer['myYoutubePlayer'].getCurrentTime())) {//ended in a location
          $scope.pauseVideo();
          console.log('video ended at:');
          console.log(alreadyShown($scope.ytPlayer['myYoutubePlayer'].getCurrentTime()));
          console.log($scope.ytPlayer['myYoutubePlayer'].getCurrentTime());
          currentQuestionTime = Math.floor($scope.ytPlayer['myYoutubePlayer'].getCurrentTime());
          //showQuestion();
          
          //setTimeout($scope.stopVideo, 6000);
          
        }
    });

    // when the time changes, this will be called.
    function onProgress(currentTime) {
      // console.log('calling');
      if(!alreadyShown(Math.floor(currentTime))) {
        console.log("the video reached"+ Math.floor(currentTime)+ "seconds!");
        currentQuestionTime = Math.floor($scope.ytPlayer['myYoutubePlayer'].getCurrentTime());
        $scope.pauseVideo();
        showQuestion();
      }
    }


    $scope.pauseVideo = function(){
      $scope.ytPlayer['myYoutubePlayer'].pauseVideo();
    };
     $scope.playVideo = function(){
     // $scope.ytPlayer['myYoutubePlayer'].playVideo();
      // $scope.ytPlayer['myYoutubePlayer'].loadVideoById({'videoId': $routeParams.id,
      //          'startSeconds': 5,
      //          'endSeconds': 12,
      //          'suggestedQuality': 'large'});
    };
    $scope.stopVideo = function(){
      console.log('stopping video');
      $scope.ytPlayer['myYoutubePlayer'].stopVideo();
    };
    $scope.seekToVideo = function(specifiedTime){
      $scope.ytPlayer['myYoutubePlayer'].seekTo(specifiedTime,true);
      if($scope.ytPlayer['myYoutubePlayer'].getPlayerState()==2){
        $scope.ytPlayer['myYoutubePlayer'].playVideo();
      }
    };


    var updateVerification = function(data,answer){
      let param = {
        videoId: data.videoId,
        crowdEntryId: data._id,
        positive: 0,
        negative: 0,
        neutral: 0,
        contributor:$window.localStorage['user_id']
      };
      

      QueryService.query('GET', 'verifications/'+data.videoId+'/'+data._id+'/'+$window.localStorage['user_id'], {}, {})
      .then(function(ovocie) {
        if(ovocie.data.length>0){
          param = ovocie.data[0];
        }

        console.log('response is');
        console.log(ovocie);

        if(answer == 'Yes')
        {
          // param.positive = param.positive+1;
          param.positive = 1;
        }
        else if(answer == 'No')
        {
          // param.negative = param.negative+1;
          param.negative = 1;
        }
        else if(answer == 'Neutral')
        {
          // param.neutral = param.neutral+1;
          param.neutral = 1;
        }

        if(ovocie.data.length>0){//updating an existing entry
          QueryService.query('PUT', 'verifications/'+param._id, {}, param)
          .then(function(resp) {
            console.log('response is');
            console.log(resp);
          });
        }
        else{//creating a new entry in verifications
            QueryService.query('POST', 'verifications', {}, param)
              .then(function(resp) {
                console.log('response is');
                console.log(resp);
              });
        }

         
      });


    };

    var submitLearnerSourceAnswer = function(data,answer){
      let param = {
        video_id: data.video_id,
        question_id: data._id,
        answer: answer,
        contributor:$window.localStorage['user_id']
      };

      console.log('param is:');
      console.log(param);
      console.log(answer);

      QueryService.query('GET', 'learnerSourceAnswers/'+data.video_id+'/'+data._id+'/'+$window.localStorage['user_id'], {}, {})
      .then(function(ovocie) {
        if(ovocie.data.length>0){//updating an existing entry
          param._id=ovocie.data[0]._id;
          QueryService.query('PUT', 'learnerSourceAnswers/'+param._id, {}, param)
          .then(function(resp) {
            console.log('response is');
            console.log(resp);
          });
        }
        else{//creating a new entry in verifications
            QueryService.query('POST', 'learnerSourceAnswers', {}, param)
              .then(function(resp) {
                console.log('response is');
                console.log(resp);
              });
        }

         
      });
    };

    $scope.goToQuant = function(){
      $location.path('/Quant/vidSplit/adsasdlkjfas/'+$routeParams.phase)
    };


    ////////////  function definitions


    /**
     * Load some data
     * @return {Object} Returned object
     */
     if($routeParams.condition=='vidSplit'){
      $scope.condition = 'vidSplit';
      QueryService.query('GET', 'getCrowdEntriesOfAVideo/'+$routeParams.videoId, {}, {})
      .then(function(ovocie) {
        questionsOfAVideo = ovocie.data;
        console.log('response is');
        console.log(questionsOfAVideo);
      });
     }
     else if($routeParams.condition=='learnerSource'){
      $scope.condition = 'learnerSource';
      QueryService.query('GET', 'getLearnerSourceQuestionsOfAVideo/'+$routeParams.videoId, {}, {})
      .then(function(ovocie) {
        questionsOfAVideo = ovocie.data;
        console.log('response is');
        console.log(questionsOfAVideo);
      });
     }
    
  }


})();