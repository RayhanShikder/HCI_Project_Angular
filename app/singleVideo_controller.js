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

  singleVideoController.$inject = ['LocalStorage', 'QueryService','$routeParams'];


  function singleVideoController(LocalStorage, QueryService,$routeParams) {

    // 'controller as' syntax
    var self = this;


    ////////////  function definitions


    /**
     * Load some data
     * @return {Object} Returned object
     */
    QueryService.query('GET', 'videos/'+$routeParams.id, {}, {})
      .then(function(ovocie) {
        self.ovocie = ovocie.data;
        console.log('response is');
        console.log(self.ovocie);
      });
  }


})();