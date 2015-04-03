;(function($, window, undefined) {

	'use strict';

	var app = (function() {
		var pub = {};

		//toggle this to switch between running in browser and running in simulator/device
		pub.localDev = false; //true = browser; false = device/simulator

		//our forecast.io api information
		var apiUrl = 'https://api.forecast.io/forecast/';
		var apiKey = '17ed4446c9d28f74db2ee22886e6f75d';

		pub.coords = {
			latitude: '34.9381',
			longitude: '81.0261'
			/*latitude: '[default longitude here]',
			longitude: '[default latitude here]'*/
		};

		pub.init = function init() {
			bindEvents();

			startUp();
		};

		//get initial values for geolocation, etc.
		function startUp() {
			if(!app.localDev) {
				document.addEventListener('deviceready', function() {
					navigator
						.geolocation
						.getCurrentPosition(
							geolocationSuccess,
							geolocationError
						)
					;
				});
				
			} else {
				getWeather();
			}
		}

		//geolocation was successful
		function geolocationSuccess(position) {
			app.coords.latitude = position.coords.latitude;
			app.coords.longitude = position.coords.longitude;

			//we need a callback function
			//here to trigger anything that uses our coordinates
			getWeather();
		}

		function getWeather() {
			var url = apiUrl + apiKey + '/' + app.coords.latitude + ',' + app.coords.longitude;

			var response = $.ajax({
				url: url
			});

			response.done(function(data) {
				console.log(data);

				//console.log(data.hourly.data[1]);

				//how to use moment to make the date show up in the app
				//using daily.data[x] to get future data for the app
				//console.log(moment.unix(data.daily.data[1].time).format('MM/DD/YY'));
				//alert(data.currently.temperature);

				//Page one information: current day information
				$('#page-one').append('<p class="time"> Current Date: ' + moment.unix(data.currently.time).format('MM/DD/YY, h:mm a') + '</p>');
				$('#page-one').append('<p class="temperature"> Current Temperature: ' + data.currently.temperature + '</p>');
				$('#page-one').append('<p class="percipitation"> Percipitation Probability: ' + data.currently.precipProbability + '</p>');
				$('#page-one').append('<p class="icon"> Icon: ' + data.currently.icon + '</p>');
				$('#page-one').append('<p class="summary"> Summary: ' + data.currently.summary + '</p>');

				//Page two information: hourly information
				for(var i = 0; i < 3; i++) {
					$('#page-two').append('<p class="time"> Hourly: ' + moment.unix(data.hourly.data[i].time).format('MM/DD/YY, h a') + '</p>');
					$('#page-two').append('<p class="temperature"> Hourly Temperature: ' + data.hourly.data[i].temperature + '</p>');
					$('#page-two').append('<p class="percipitation"> Percipitation Probability: ' + data.hourly.data[i].precipProbability + '</p>');
					$('#page-two').append('<p class="icon"> Icon: ' + data.hourly.data[i].icon + '</p>');
				}

				//Page three information: next day information
				for(var i = 0; i < 2; i++) {
					$('#page-three').append('<p class="time"> Tomorrow Date: ' + moment.unix(data.daily.data[i].time).format('MM/DD/YY') + '</p>');
					$('#page-three').append('<p class="temperature"> Tomorrow Temperature High: ' + data.daily.data[i].temperatureMax + '</p>');
					$('#page-three').append('<p class="temperature"> Tomorrow Temperature Low: ' + data.daily.data[i].temperatureMin + '</p>');
					$('#page-three').append('<p class="percipitation"> Percipitation Probability: ' + data.daily.data[i].precipProbability + '</p>');
					$('#page-three').append('<p class="icon"> Icon: ' + data.daily.data[i].icon + '</p>');
					$('#page-three').append('<p class="summary"> Summary: ' + data.daily.data[i].summary + '</p>');
				}
				
			});
		}

		//geolocation failed
		function geolocationError() {
			alert('We could not locate you.');
		}

		function bindEvents() {
			$('.page').hammer()
				.bind('swipeleft', swipeLeftHandler)
				.bind('swiperight', swipeRightHandler)
			;
		}

		function swipeLeftHandler(e) {
			//make sure there is a page with .right
			//figure out which page is active (does not have .left or .right)
			//add .left to current page
			//remove .right from next page
			if($('.page.right').length) {
				var $activePage = $('.page').not('.right, .left');
				var $nextPage = $activePage.next('.page');

				$activePage.addClass('left');
				$nextPage.removeClass('right');
			}
		}

		function swipeRightHandler(e) {
			if($('.page.left').length) {
				var $activePage = $('.page').not('.left, .right');
				var $prevPage = $activePage.prev('.page');

				$activePage.addClass('right');
				$prevPage.removeClass('left');
			}
		}

		return pub;
	}());


	$(document).ready(function() {
		app.init();
	});

	$(window).load(function() {
		//if you have any methods that need a fully loaded window, trigger them here
	});


})(window.jQuery, window);