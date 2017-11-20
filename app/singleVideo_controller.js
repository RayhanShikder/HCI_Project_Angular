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
    .controller('singleVideoController', singleVideoController);

  singleVideoController.$inject = ['LocalStorage', 'QueryService','$routeParams','$scope','ytPlayer'];


  function singleVideoController(LocalStorage, QueryService,$routeParams,$scope,ytPlayer) {
   
    // 'controller as' syntax
    var self = this;
    console.log('route param is:');
    console.log($routeParams.id);
    $scope.showQuestionDivFlag = false;
    var currentQuestionTime;
    var crowdEntriesOfAVideo;
    $scope.selectedSelection = "Tab";
    $scope.agreedFlag = false;

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
      for(var i=0;i<crowdEntriesOfAVideo.length;i++){
        if(Math.floor(time)==crowdEntriesOfAVideo[i].time){
          return crowdEntriesOfAVideo[i].flag;
        }
      }
      return true;
    };
    var setShownFlag = function(time){
      for(var i=0;i<crowdEntriesOfAVideo.length;i++)
      {
        if(Math.floor(time)==crowdEntriesOfAVideo[i].time){
          crowdEntriesOfAVideo[i].flag=true;
          return;
        }
      }
      return;
    };
    var getCurrentQuestion = function(time){
      for(var i=0;i<crowdEntriesOfAVideo.length;i++){
        if(time == crowdEntriesOfAVideo[i].time){
          return crowdEntriesOfAVideo[i];
        }
      }
      return ;
    };
    
    var showQuestion = function(){
        console.log('showing');
        console.log($scope.showQuestionDivFlag);
        $scope.$apply(function () { 
          $scope.currentQuestion = getCurrentQuestion(currentQuestionTime);
          $scope.showQuestionDivFlag = true;
        });
    };
    $scope.submitAnswer = function(){
      $scope.showQuestionDivFlag = false;
      setShownFlag(currentQuestionTime);
      $scope.seekToVideo(currentQuestionTime); 
      updateVerification($scope.currentQuestion,$scope.answer.type);
      $scope.answer = {
        type: ''
      };
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
        neutral: 0
      };
      

      QueryService.query('GET', 'verifications/'+data.videoId+'/'+data._id+'/_turker', {}, {})
      .then(function(ovocie) {
        if(ovocie.data.length>0){
          param = ovocie.data[0];
        }

        console.log('response is');
        console.log(ovocie);

        if(answer == 'Yes')
        {
          param.positive = param.positive+1;
        }
        else if(answer == 'No')
        {
          param.negative = param.negative+1;
        }
        else if(answer == 'Neutral')
        {
          param.neutral = param.neutral+1;
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


    ////////////  function definitions


    /**
     * Load some data
     * @return {Object} Returned object
     */
    QueryService.query('GET', 'getcrowdEntriesOfAVideo/'+$routeParams.videoId, {}, {})
      .then(function(ovocie) {
        crowdEntriesOfAVideo = ovocie.data;
        console.log('response is');
        console.log(crowdEntriesOfAVideo);
      });
  }


})();