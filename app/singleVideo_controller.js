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
    

    var timeFlags = [ //later save it in localstorage
      {
        "time":12,
        "shown":false
      },
      {
        "time": 22,
        "shown": false
      }
    ];


    $scope.options = {
      host: 'https://www.youtube.com',
      videoId:$routeParams.id,
      startSeconds:5.00,
      end:8,
      height:'100%',
      width:'700px',
      playerVars:{
        
      } // all parameters supported by youtube-iframe-api
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
      for(var i=0;i<timeFlags.length;i++){
        if(Math.floor(time)==timeFlags[i].time){
          return timeFlags[i].shown;
        }
      }
      return true;
    };
    var setShownFlag = function(time){
      for(var i=0;i<timeFlags.length;i++)
      {
        if(Math.floor(time)==timeFlags[i].time){
          timeFlags[i].shown=true;
          return;
        }
      }
      return;
    };
    
    var showQuestion = function(){
        console.log('showing');
        console.log($scope.showQuestionDivFlag);
        $scope.$apply(function () { 
          $scope.showQuestionDivFlag = true;
        });
    };
    $scope.submitAnswer = function(){

      $scope.showQuestionDivFlag = false;
      setShownFlag(currentQuestionTime);
      $scope.seekToVideo(currentQuestionTime);
     
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



    ////////////  function definitions


    /**
     * Load some data
     * @return {Object} Returned object
     */
    QueryService.query('GET', 'videos/59ffbc081a22b8372a9fca4a', {}, {})
      .then(function(ovocie) {
        self.ovocie = ovocie.data;
        console.log('response is');
        console.log(self.ovocie);
      });
  }


})();