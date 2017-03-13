angular.module('conFusionApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
	
  $scope.reservation = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
	
	$ionicModal.fromTemplateUrl('templates/reserve.html', {scope: $scope})
		.then (function (modal) {
			$scope.reserveform = modal;
		});
	
	$scope.closeReserve = function () {
		$scope.reserveform.hide();
	};
	
	$scope.reserve = function () {
		$scope.reserveform.show();
	};
	
	$scope.doReserve = function () {
		console.log('Doing reservation', $scope.reservation);
		$timeout(function() {
		    $scope.closeReserve();
		}, 1000);		
	};
})

	.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', function($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate) {
        $scope.baseURL = baseURL;
		$scope.tab = 1;
		$scope.filtText ="";
		$scope.showDetails = false;
        $scope.showMenu = false;
        $scope.message = "Loading...";

		$scope.dishes = menuFactory.getDishes().query(
            function (response) {
                $scope.dishes = response;
                $scope.showMenu = true;
            },
            function (response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            }
        );

		$scope.select = function(setTab) {
			$scope.tab = setTab;

			if (setTab === 2) {
				$scope.filtText = "appetizer";
			} else if (setTab === 3) {
				$scope.filtText = "mains";
			} else if (setTab === 4) {
				$scope.filtText = "dessert";
			} else {
				$scope.filtText = "";
			}
		};

		$scope.isSelected = function(checkTab) {
			return ($scope.tab === checkTab);
		};

		$scope.toggleDetails = function() {
			$scope.showDetails = !$scope.showDetails;
		};
		
		$scope.addFavorite = function(index) {
			console.log("index is " + index);
			favoriteFactory.addToFavorites(index);
			$ionicListDelegate.closeOptionButtons();
		};
	}])

    .controller('ContactController', ['$scope', function($scope) {
        $scope.feedback = {
            mychannel: "",
            firstName: "",
            lastName: "",
            agree: false,
            email: "",
        };

        $scope.channels = [
            {value: "tel", label: "Tel."},
            {value: "Email", label: "Email"},
        ];

        $scope.invalidChannelSelection = false;
    }])

    .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {
        $scope.sendFeedback = function() {
            console.log($scope.feedback);
            if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            } else {
                $scope.invalidChannelSelection = false;
                
                feedbackFactory.getFeedbacks().save({}, $scope.feedback);
                
                $scope.feedback = {mychannel:"", firstName:"", lastName:"",
                                   agree:false, email:"" };

                $scope.feedbackForm.$setPristine();
                console.log($scope.feedback);
            }
        };
    }])

    .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'baseURL', function($scope, $stateParams, menuFactory, baseURL) {
        $scope.baseURL = baseURL;
        $scope.showDish = false;
        $scope.message = "Loading...";
        
        $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id, 10)})
            .$promise.then(
                function(response){
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );

        $scope.commentsOrder = "";
    }])

    .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {
        // Step 1: Create a JavaScript object to hold the comment from the form
        $scope.comments = {
            rating: 5,
            author: "",
            comment: "",
            date: "",
        };

        $scope.setRaing = function(value) {
            $scope.comments.rating = value;
        };
        
        $scope.submitComment = function () {
            
            //Step 2: This is how you record the date
            $scope.comments.date = new Date().toISOString();
            
            // Step 3: Push your comment into the dish's comment array
            $scope.dish.comments.push($scope.comments);
            
            menuFactory.getDishes().update({id:$scope.dish.id}, $scope.dish);
            
            //Step 4: reset your form to pristine
            $scope.commentForm.$setPristine();

            //Step 5: reset your JavaScript object that holds your comment
            $scope.comments = {
                rating: 5,
                author: "",
                comment: "",
                date: "",
            };
        };
    }])

    .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', function ($scope, menuFactory, corporateFactory, baseURL) {
        $scope.baseURL = baseURL;
        $scope.showDish = false;
        $scope.message = "Loading...";
        
        $scope.showPromotion = false;
        $scope.promotionMsg = "Loading...";
        
        $scope.showLeader = false;
        $scope.leaderMsg = "Loading...";
        
        $scope.dish = menuFactory.getDishes().get({id:0})
            .$promise.then(
                function(response){
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
        
        $scope.promotion = menuFactory.getPromotion().get({id:0})
            .$promise.then(
                function (response) {
                    $scope.promotion = response;
                    $scope.showPromotion = true;
                },
                function (response) {
                    $scope.promotionMsg = "Error: "+response.status + " " + response.statusText;
                }
            );
        $scope.leader = corporateFactory.getLeaders().get({id:3})
            .$promise.then(
                function (response) {
                    $scope.leader = response;
                    $scope.showLeader = true;
                },
                function (response) {
                    $scope.leaderMsg = "Error: "+response.status + " " + response.statusText;
                }
            );
    }])

    .controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function ($scope, corporateFactory, baseURL) {
        $scope.baseURL = baseURL;
        $scope.showLeaders = false;
        $scope.leadersMsg = "Loading...";
        
        $scope.leaders = corporateFactory.getLeaders().query(
            function (response) {
                $scope.leaders = response;
                $scope.showLeaders = true;
            },
            function (response) {
                $scope.leadersMsg = "Error: "+response.status + " " + response.statusText;
            }
        );
    }])

	.controller('FavoritesController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {
		$scope.baseURL = baseURL;
		$scope.shouldShowDelete = false;
		
		$ionicLoading.show({
			template: '<ion-spinner></ion-spinner> Loading...'
		});

		$scope.favorites = favoriteFactory.getFavorites();

		$scope.dishes = menuFactory.getDishes().query(
			function (response) {
				$scope.dishes = response;
				$timeout(function () {
					$ionicLoading.hide();
				}, 1000);
			},
			function (response) {
				$scope.message = "Error: " + response.status + " " + response.statusText;
				$timeout(function () {
					$ionicLoading.hide();
				}, 1000);
			});

		$scope.toggleDelete = function () {
			$scope.shouldShowDelete = !$scope.shouldShowDelete;
		}

		$scope.deleteFavorite = function (index) {
			var confirmPopup = $ionicPopup.confirm({
				title: 'Confirm Delete',
				template: 'Are you sure you want to delete this item?'
			});
			
			confirmPopup.then(function (res) {
				if(res) {
					console.log('ok to delete');
					favoriteFactory.deleteFromFavorites(index);
				} else {
					console.log('Canceled delete');
				}
			});
			
			$scope.shouldShowDelete = false;
		}
	}])

	.filter('favoriteFilter', function () {
		return function (dishes, favorites) {
			var out = [];
			for (var i = 0; i < favorites.length; i++) {
				for (var j = 0; j < dishes.length; j++) {
					if (dishes[j].id === favorites[i].id)
						out.push(dishes[j]);
				}
			}
			return out;
		}
	})
;
