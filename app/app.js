/*@author suman kunwar
* 8th jun 2016
*
*/
var app = angular.module('surveyapp', ['ui.router','angular-loading-bar','angularUtils.directives.dirPagination']);
//root configuartion
app.config(['$stateProvider','$urlRouterProvider',
	function ($stateProvider,$urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');
		$stateProvider
			.state('home', {
				url: "/home",
				templateUrl: "templates/home.html"
			})
			.state('ViewSurvey', {
						url: "/viewsurvey/:id",
						templateUrl: "templates/viewSurvey.html",
						controller: 'survey-list'
			})
	}
]);

app.run(function($rootScope, $state) {
	$rootScope.$state = $state;
});

// used for search
app.filter('searchFor', function(){
	return function(arr, searchSurvey){
		if(!searchSurvey){
			return arr;
		}
		var result = [];
		searchSurvey = searchSurvey.toLowerCase();
		angular.forEach(arr, function(survey){
			if(survey.title.toLowerCase().indexOf(searchSurvey) !== -1 || survey.tagline.toLowerCase().indexOf(searchSurvey) !== -1){
			result.push(survey);
		}
		});
		return result;
	};
});
// get list of survays
app.controller('survey-list',function($scope,$state,$http,$filter, $stateParams){
	$scope.surveylist = [];
	$scope.pageSize = 5;// se
	$scope.currentPage = 1;
	$http.get("http://private-anon-0dbbf9a9f-surveysmock.apiary-mock.com/api/surveys").success(function(response){
		if(response.surveys.length){
			$scope.sortType     = 'title'; // set the default sort type
  		$scope.sortReverse  = false;  // set the default sort order
  		$scope.searchTitle   = '';     // set the default search/filter term
			$scope.surveylist = response.surveys;
			$scope.surveylistSearch = $scope.surveylist;
			$scope.$watch('searchSurvey', function(val){
				$scope.surveylist = $filter('searchFor')($scope.surveylistSearch, val);
			});
		}else{
			$scope.surveylist = [];
		}
	});
// show particular survey
	$scope.viewSurvey = function(id){
		$state.go('ViewSurvey', {id:id});
	};
  $scope.isloaded = false;
  $scope.completion=[];
	$scope.getSurvey = function () {
		$http.get("http://private-anon-0dbbf9a9f-surveysmock.apiary-mock.com/api/surveys/"+$stateParams.id).success(function(response){
			$scope.currentSurvey = response.survey;
		  $scope.isloaded = true;
		});
	}
	if($stateParams.id){
		$scope.getSurvey();
	}

// get selected answer
	$scope.selectedAnswer= function (questionId, answer) {
		var answerSelected = {
			question_id:questionId,
			answer:answer
		}

// if user selects the survey and change the option
		$filter('filter')($scope.completion, function (answer) {
			if(answer.question_id == questionId){
				//get the index of that question
				var index = $scope.completion.indexOf(answer);
				$scope.completion.splice(index, 1);
				return;
			}

		});
		$scope.completion.push(answerSelected);

	} //end fn selectedAnswer
//submitting the survey
	$scope.submitSurvey = function () {
    if($scope.completion.length<=0){
			$.notify("you are completing this survey without answers !", "warn");
		}
		var finalAnswers = {completion: $scope.completion};
		$http.post("http://private-anon-0dbbf9a9f-surveysmock.apiary-mock.com/api/surveys/"+$stateParams.id+"/completions", finalAnswers).success(function() {
				$.notify("Thanks for answering the survey!", "success");
				$state.go('home');
		});

	}
});
