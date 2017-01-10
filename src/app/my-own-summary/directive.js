'use strict';

module.exports = 'wfm-mobile.myownsummary';

/**
 *
 * Controller to manage viewing any fields that require editing.
 *
 * @param mediator
 * @param $stateParams
 * @constructor
 */
function MyOwnSummaryController(mediator, $stateParams) {
  var self = this;

  //Finished editing the data. Need to update the results of the submission
  self.done = function(event) {
    event.preventDefault();
    event.stopPropagation();

    //Subscribing to the done topic for updating the result. When the result has been updated we can proceed.
    mediator.once("done:wfm:result:update:" + $stateParams.workorderId, function() {
      mediator.publish('wfm:workflow:step:done', {});
    });

    //Publishing a topic to update the result to reflect any changes in the form.
    mediator.publish("wfm:result:update", $stateParams.workorderId, self.result);
  };

  //Going back to the previous step
  self.back = function(event) {
    mediator.publish('wfm:workflow:step:back');
    event.preventDefault();
    event.stopPropagation();
  };

  //$stateParams is the current state of the route in the app.
  //This is used to get the ID of the current workorder that is being worked on.
  mediator.request("wfm:result:read", $stateParams.workorderId).then(function(result) {

    /**
     * result example
     *
     *
     {
        "status": "In Progress",
        "_localuid": "0a8bafa5e141e42d70a2f44c5dc2236c9b39455e",
        "stepResults": {
          "risk-assessment": { // step code defined in the workflow
            "step": {
              "code": "risk-assessment",
              "name": "Risk Assessment",
              "templates": {
                "form": "<risk-assessment-form></risk-assessment-form>",
                "view": "<risk-assessment value=\"result.submission\"></risk-assessment>"
              }
            },
            //submission is the data that was submitted by the step
            "submission": {
              "complete": true
            },
            "type": "static",
            "status": "complete",
            "timestamp": 1484037536516,
            "submitter": "rJeXyfdrH"
          },
          "vehicle-inspection": {
            "step": {
              "code": "vehicle-inspection",
              "name": "Vehicle Inspection",
              "templates": {
                "form": "<vehicle-inspection-form></vehicle-inspection-form>",
                "view": "<vehicle-inspection value=\"result.submission\"></vehicle-inspection>"
              }
            },
            "submission": {
              "tires": true,
              "fuel": 25,
              "lights": true
            },
            "type": "static",
            "status": "complete",
            "timestamp": 1484037539745,
            "submitter": "rJeXyfdrH"
          }
        },
        "workorderId": "B1r71fOBr",
        "id": "BygiazMUl"
      }
     */
    self.result = result;
  });
}

angular.module('wfm-mobile.myownsummary', [
  'ui.router'
  , 'wfm.core.mediator'
]).directive('myOwnSummary', function() {
  return {
    restrict: 'E'
    , templateUrl: 'app/my-own-summary/my-own-summary.tpl.html'
    , controller: 'MyOwnSummaryController'
    , controllerAs: 'customSummaryCtrl'
  };
})
  .directive('myOwnSummaryView', function() {
    return {
      restrict: 'E'
      , template: ''
      , controller: function() {}
      , controllerAs: 'customSummaryCtrl'
    };
  })
  .controller('MyOwnSummaryController', ['mediator', '$stateParams', MyOwnSummaryController]);
