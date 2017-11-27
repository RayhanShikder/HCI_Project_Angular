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

  MainController.$inject = ['LocalStorage', 'QueryService','$scope','$location','$window'];


  function MainController(LocalStorage, QueryService,$scope,$location,$window) {

    // 'controller as' syntax
    var self = this;
    self.user = {
      age: '',
      sex: '',
      profession: '',
      macchinLearningKnowledgeLevel:'',
      highestDegreeAchieved:'',
      major:''
    };
    

   
   self.createUser = function(){
    console.log('inside createUser');

    QueryService.query('POST', 'users', {}, self.user)
      .then(function(resp) {
        console.log('user successfully created. response is:');
        console.log(resp);
        $window.localStorage['user_id']=resp.data._id;
        $location.path('/parent_phase/FMiCOx95lAc/59ffbc081a22b8372a9fca4a/phase1/vidSplit')
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