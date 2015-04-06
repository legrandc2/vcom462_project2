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
			longitude: '81.0261',
			/*latitude: '[default longitude here]',
			longitude: '[default latitude here]'*/
		}; //end pub.coords

		pub.init = function init() {
			bindEvents();

			startUp();
		}; //end pub.init

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
				}); //end document.addEventListener
				
			}//end if
			else {
				getWeather();
			}//end else
		} //end function startUp

		//geolocation was successful
		function geolocationSuccess(position) {
			app.coords.latitude = position.coords.latitude;
			app.coords.longitude = position.coords.longitude;

			//we need a callback function
			//here to trigger anything that uses our coordinates
			getWeather();
		}//end function geolocationSuccess

		function getWeather() {
			var url = apiUrl + apiKey + '/' + app.coords.latitude + ',' + app.coords.longitude;

			var response = $.ajax({
				url: url
			}); //end ajax request

			response.done(function(data) {
				//console.log(data);

				//how to use moment to make the date show up in the app
				//using daily.data[x] to get future data for the app
				//console.log(moment.unix(data.daily.data[1].time).format('MM/DD/YY'));
				//alert(data.currently.temperature);

				//$('#appContainer').append('<article id="page-one" class="page ' + data.currently.icon + '"></article>');
				//$('#appContainer').append('<article id="page-two" class="page"></article>');
				//$('#appContainer').append('<article id="page-three" class="page"></article>');

				$('#page-1').append('<div id="current_weather"></div>');
				$('#page-1').append('<hr/>');
				$('#page-1').append('<div id="hourly_weather"></div>');
				$('#page-2').append('<div id="future_weather1"></div>');
				$('#page-3').append('<div id="future_weather2"></div>');


				//Page one information: current day information
				$('#current_weather').append('<h3 class="date">' + moment.unix(data.currently.time).format('MMMM Do') + '</h3>');
				$('#current_weather').append('<p class="icon"><img src="../assets/img/' + data.currently.icon + '.png" /></p>');
				$('#current_weather').append('<h3 class="temperature">' + Math.round(data.currently.temperature) + '&deg; F</h3>');
				$('#current_weather').append('<h4 class="weather">' + data.currently.icon + '</h4>');

				//Page two information: hourly information
				for(var i = 1; i < 4; i++) {
					$('#hourly_weather').append('<h4 class="time">' + moment.unix(data.hourly.data[i].time).format('h:00 a') + '</h4>');
					$('#hourly_weather').append('<h4 class="temperature">' + Math.round(data.hourly.data[i].temperature) + '&deg; F</h4>');
					$('#hourly_weather').append('<p class="icon"><img src="../assets/img/' + data.hourly.data[i].icon + '.png" /></p>');
					$('#hourly_weather').append('<hr/>');
				}

				//sunrise/sunset times & high/low percip chance for current day
				$('#hourly_weather').append('<h4 class="tempHighLow">' + Math.round(data.daily.data[0].temperatureMax) + '&deg;/' + Math.round(data.daily.data[0].temperatureMin) + '&deg;</h4>');
				$('#hourly_weather').append('<p class="sunrise"><img src="../assets/img/sunrise.png" />: ' + moment.unix(data.daily.data[0].sunriseTime).format('h:mm a') + '</p>');
				$('#hourly_weather').append('<p class="percipitation">' + data.daily.data[0].precipProbability * 100 + '% Chance for Rain</p>');
				$('#hourly_weather').append('<p class="sunset"><img src="../assets/img/sunset.png" />: ' + moment.unix(data.daily.data[0].sunsetTime).format('h:mm a') + '</p>');

				//Page three information: next few days information
				for(i = 1; i < 3; i++) {
					$('#future_weather' + i).append('<h3 class="date">' + moment.unix(data.daily.data[i].time).format('MMMM Do') + '</h3>');
					$('#future_weather' + i).append('<p class="icon"><img src="../assets/img/' + data.daily.data[i].icon + '.png" /></p>');
					$('#future_weather' + i).append('<h3 class="temperature">' + Math.round(data.daily.data[i].temperatureMax) + '&deg;/' + Math.round(data.daily.data[i].temperatureMin) + '&deg;</h3>');
					$('#future_weather' + i).append('<h4 class="weather">' + data.daily.data[i].icon + '</h4>');
					$('#future_weather' + i).append('<hr/>');
					$('#future_weather' + i).append('<p class="summary">' + data.daily.data[i].summary + '</p>');
					$('#future_weather' + i).append('<p class="sunrise"><img src="../assets/img/sunrise.png" />: ' + moment.unix(data.daily.data[i].sunriseTime).format('h:mm a') + '</p>');
					$('#future_weather' + i).append('<p class="percipitation">' + data.daily.data[i].precipProbability * 100 + '% Chance for Rain</p>');
					$('#future_weather' + i).append('<p class="sunset"><img src="../assets/img/sunset.png" />: ' + moment.unix(data.daily.data[i].sunsetTime).format('h:mm a') + '</p>');
				};
			    
			}); //end response.done function

		} //end function getWeather

		//geolocation failed
		function geolocationError() {
			alert('We could not locate you.');
		} //end function geolocationError

		function bindEvents() {
			$('.page').hammer()
				.bind('swipeleft', swipeLeftHandler)
				.bind('swiperight', swipeRightHandler)
			;
		} //end function bindEvents

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
			} //end if
		} //end function swipeLeftHandler

		function swipeRightHandler(e) {
			if($('.page.left').length) {
				var $activePage = $('.page').not('.left, .right');
				var $prevPage = $activePage.prev('.page');

				$activePage.addClass('right');
				$prevPage.removeClass('left');
			} //end if
		} //end function swipeRightHandler

		return pub;
	}());


	$(document).ready(function() {
		app.init();
	    var icons = new Skycons(),
	          list  = [
	            "clear-day", "clear-night", "partly-cloudy-day",
	            "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
	            "fog"
	          ],
	          i;

	    	for(i = list.length; i--; ) {
	    		icons.set(list[i], list[i]);
	    	}

	    	icons.play();
	});
	$(window).load(function() {
		//if you have any methods that need a fully loaded window, trigger them here
	});


})(window.jQuery, window);