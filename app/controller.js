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
    .controller('MainController', MainController);

  MainController.$inject = ['LocalStorage', 'QueryService','$scope','$location','$window','$routeParams'];


  function MainController(LocalStorage, QueryService,$scope,$location,$window,$routeParams) {

    // 'controller as' syntax
    var self = this;
    self.user = {
      age: null,
      sex: null,
      profession: '',
      macchinLearningKnowledgeLevel: null,
      highestDegreeAchieved:null,
      major:null,
      video1:'',
      condition1:'',
      video2:'',
      condition2:''
    };

    $window.localStorage.clear();

    self.low=10;
    self.high=100;
    
    var video1 = '59ffbc081a22b8372a9fca4a';
    var url1 = 'FMiCOx95lAc';
    var video2 = '59fff599ef77ff41f89dc5ee';
    var url2 = 'XySEe4uNsCY';

    self.flow = [
      {
        "video1":video1,
        "url1": url1,
        "condition1":'vidSplit',
        "video2":video2,
        "url2": url2,
        "condition2":'learnerSource'
      },
      {
        "video1":video1,
        "url1":url1,
        "condition1":'learnerSource',
        "video2":video2,
        "url2": url2,
        "condition2":'vidSplit'
      },
      {
        "video1":video2,
        "url1":url2,
        "condition1":'vidSplit',
        "video2":video1,
        "url2": url1,
        "condition2":'learnerSource'
      },
      {
        "video1":video2,
        "url1": url2,
        "condition1":'learnerSource',
        "video2":video1,
        "url2": url1,
        "condition2":'vidSplit'
      }
    ];


    console.log('routeparams');
    console.log($routeParams);
    $window.localStorage['selectedFlow'] = angular.toJson($routeParams);
    self.user.video1 = angular.fromJson($window.localStorage['selectedFlow']).video1;
    self.user.condition1 = angular.fromJson($window.localStorage['selectedFlow']).condition1;
    self.user.video2 = angular.fromJson($window.localStorage['selectedFlow']).video2;
    self.user.condition2 = angular.fromJson($window.localStorage['selectedFlow']).condition2;
    console.log('user is');
    console.log(self.user);

    // var completedUserCount = 0;
    // QueryService.query('GET', 'users', {}, {})
    //   .then(function(resp) {
    //     console.log('user successfully retrieved. response is:');
    //     console.log(resp);

    //     for(let i=0;i<resp.data.length;i++){
    //       if(resp.data[i].creation_status && resp.data[i].creation_status == 'completed'){
    //         completedUserCount++;
    //       }
    //     }

    //     $window.localStorage['selectedFlow'] = angular.toJson(self.flow[completedUserCount%4]);
    //     self.user.video1 = angular.fromJson($window.localStorage['selectedFlow']).video1;
    //     self.user.condition1 = angular.fromJson($window.localStorage['selectedFlow']).condition1;
    //     self.user.video2 = angular.fromJson($window.localStorage['selectedFlow']).video2;
    //     self.user.condition2 = angular.fromJson($window.localStorage['selectedFlow']).condition2;
    //     console.log('user is');
    //     console.log(self.user);
    //   });
   
   self.createUser = function(){
    console.log('inside createUser');

    QueryService.query('POST', 'users', {}, self.user)
      .then(function(resp) {
        console.log('user successfully created. response is:');
        console.log(resp);
        $window.localStorage['user_id']=resp.data._id;
        $location.path('/parent_phase/'+angular.fromJson($window.localStorage['selectedFlow']).url1+'/'+angular.fromJson($window.localStorage['selectedFlow']).video1+'/phase1/'+angular.fromJson($window.localStorage['selectedFlow']).condition1);
      });
   };


    ////////////  function definitions


    /**
     * Load some data
     * @return {Object} Returned object
     */
    QueryService.query('GET', 'videos', {}, {})
      .then(function(ovocie) {
        self.ovocie = ovocie.data;
        console.log('response is');
        console.log(self.ovocie);
      });
  }


})();