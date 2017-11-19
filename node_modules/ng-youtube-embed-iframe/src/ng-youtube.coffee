'use strict'

$youtubePlayerConfig = ->
  width: '100%'
  height: '100%'
  playerVars: {}

$youtube = ($compile, ytFactory, ytPlayer, youtubePlayerConfig) ->
  restrict: 'E'
  transclude: true
  template: '<div id={{ngYoutubeId}}></div>'
  scope:
    height: '@'
    width: '@'
    videoId: '@'
    playerOptions: '=?'
  link: (scope, element, attrs) ->

    if not attrs.id
      throw new Error 'Provide id for element: ' + element[0].outerHTML

    ###
    # load the Youtube IFrame Player API code asynchronously
    # load page only once
    ###

    if typeof YT is 'undefined' or typeof YT.Player is 'undefined'
      tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore tag, firstScriptTag

    ytFactory.onReady ->
      ytPlayer[attrs.id] = createPlayer()
      return

    ###
    # check for parameters assigned to the element
    # if assigned use the parameters
    # else if use parameters are defined in options
    # else use default parameters
    ###

    scope.ngYoutubeId = attrs.id

    scope.playerOptions = if scope.playerOptions then scope.playerOptions else {}

    playerVideoId = if scope.videoId then scope.videoId else
      scope.playerOptions.videoId

    playerHeight = if scope.height then scope.height else
      (tempHeight = if scope.playerOptions.height then scope.playerOptions.height else
        youtubePlayerConfig.height)

    playerWidth = if scope.width then scope.width else
      (tempWidth = if scope.playerOptions.width then scope.playerOptions.width else
        youtubePlayerConfig.width)

    playerVars = if scope.playerOptions.playerVars then scope.playerOptions.playerVars else
      youtubePlayerConfig.playerVars

    # create iframe and append video url to it

    createPlayer = ->
      new YT.Player attrs.id,
        videoId: playerVideoId
        height: playerHeight
        width: playerWidth
        playerVars: playerVars
        events:
          onReady: onPlayerReady
          onPlaybackQualityChange: onPlayerPlaybackQualityChange
          onStateChange: onPlayerStateChange
          onError: onPlayerError
          onPlaybackRateChange: onPlaybackRateChange
          onApiChange: onApiChange

    # events emit by youtube iframe api

    onPlayerReady = (event) ->
      scope.$emit 'ngYoutubePlayer:onPlayerReady', event, attrs.id
      return

    onPlayerPlaybackQualityChange = (event) ->
      scope.$emit 'ngYoutubePlayer:onPlayerPlaybackQualityChange', event, attrs.id
      return

    onPlayerStateChange = (event) ->
      scope.$emit 'ngYoutubePlayer:onPlayerStateChange', event, attrs.id

      switch event.data
        when YT.PlayerState.PLAYING
          scope.$emit 'ngYoutubePlayer:PLAYING', event
        when YT.PlayerState.ENDED
          scope.$emit 'ngYoutubePlayer:ENDED', event
        when YT.PlayerState.UNSTARTED
          scope.$emit 'ngYoutubePlayer:UNSTARTED', event
        when YT.PlayerState.PAUSED
          scope.$emit 'ngYoutubePlayer:PAUSED', event
        when YT.PlayerState.BUFFERING
          scope.$emit 'ngYoutubePlayer:BUFFERING', event
        when YT.PlayerState.CUED
          scope.$emit 'ngYoutubePlayer:CUED', event
      return

    onPlayerError = (event) ->
      scope.$emit 'ngYoutubePlayer:onPlayerError', event, attrs.id
      return

    onPlaybackRateChange = (event) ->
      scope.$emit 'ngYoutubePlayer:onPlaybackRateChange', event, attrs.id
      return

    onApiChange = ->
      scope.$emit 'ngYoutubePlayer:onApiChange', event, attrs.id
      return

    # watch for changes in videoId
    scope.$watch 'videoId', (newValue, oldValue) ->
      if newValue is oldValue
        return

      ytPlayer[attrs.id].cueVideoById(scope.videoId)
      return

    # watch for changes in plyerOptions videoId
    scope.$watch 'playerOptions.videoId', (newValue, oldValue) ->
      if not scope.videoId # considering videoId as priority
        if newValue is oldValue
          return

        ytPlayer[attrs.id].cueVideoById(scope.playerOptions.videoId)

      return

    # destroy elements when destroy is triggered
    scope.$on '$destroy', ->
      YT = undefined

      for i of ytPlayer
        if i and ytPlayer[i].a
          ytPlayer[i].destroy()
      return

    return

# player service invokes when the player is ready
$ytFactory = ($q, $window) ->
  deferred = $q.defer()
  apiReady = deferred.promise

  $window.onYouTubeIframeAPIReady = ->
    deferred.resolve()
    return

  onReady: (cb) ->
    apiReady.then(cb)
    return

# player constant
$ytPlayer = {}

###
# dependency injection
###
$youtube.$inject = ['$compile', 'ytFactory', 'ytPlayer', 'youtubePlayerConfig']
$ytFactory.$inject = ['$q', '$window']

###
# define angular application
###
angular.module 'ngYoutube', []
  .directive('youtube', $youtube)
  .constant('youtubePlayerConfig', $youtubePlayerConfig)
  .factory('ytFactory', $ytFactory)
  .constant('ytPlayer', $ytPlayer)
