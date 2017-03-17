'use strict';

angular.module('conFusionApp.services', ['ngResource'])

    .constant("baseURL", "http://localhost:3000/")

	  .factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) { 
      return $resource(baseURL+"dishes/:id", null, {'update':{method:'PUT'}});
		}])

		.factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
			return $resource(baseURL+"promotions/:id", null, {'update':{method:'PUT'}});
		}])	

    .factory('corporateFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        var corpfac = {};

        corpfac.getLeaders = function () {
            return $resource(baseURL+"leadership/:id", null, {'update':{method:'PUT'}});
        };

        return corpfac;
    }])

    .factory('feedbackFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        var feedbackfac = {};
        feedbackfac.getFeedbacks = function () {
            return $resource(baseURL+"feedback/:id", null, {'update':{method:'PUT'}});
        };
        
        return feedbackfac;
    }])

	.factory('favoriteFactory', ['$resource', 'baseURL', function($resource, baseURL) {
		var favFac = {};
		var favorites = [];
		
		favFac.addToFavorites = function (index) {
			for (var i = 0; i < favorites.length; i++) {
				if (favorites[i].id === index)
					return;
			}
			favorites.push({id: index});
		};
		
		favFac.getFavorites = function () {
			return favorites;
		};
		
		favFac.deleteFromFavorites = function (index) {
			for (var i = 0; i < favorites.length; i++) {
				if (favorites[i].id === index) {
					favorites.splice(i, 1);
				}
			}
		};
		
		return favFac;
	}])
;