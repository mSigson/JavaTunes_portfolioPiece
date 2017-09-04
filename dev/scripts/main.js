const app = {
	genre    : null,
	duration : 60,
	location : {
		lat  : 43.6532,
		lng  : -79.3832,
		address: ''
	},
	resultsDisplayed : false,
	spotifyPlaylistPromise: null,
	coffeeShopLocationPromise: null,

	coffeeShopsInfo: [],
	//name, address, phoneNum, website, location: {lat:, lng:}

	spotifyHeader: {}, //for Spotify OAuth

	client_id : 'RT3LKD5UVN1NHTLW20JOPKOLJEPNXGCDZFNRCZAH5UIJ5XNN',
	client_secret : 'JK0QPEHBL5WHEUBISF1NGUXNPHF30F2QKYYNNU30PHVVEFMW',

	spotifyPlaylists: [],

	// track num of playlists generated for user.
	// if it equals to spotifyPlaylists.length
	// this value will be reset to zero.
	numOfPlaylistsGenerated: 0,

	// track for offsetting the requested playlists list from Spotify
	// so we get new search results.
	spotifyPlaylistsRequestOffset: 0,
	
	map: {}, //contains Leaflet map object
	mapZoomLevel: 13,
	mapMarkersLayer: {},
	mapMarkers: [],

};

 //TODO: remember to use this.

app.init = function () {
	app.initDisplay();
	app.events();
	app.setSpotifyAuthorization();

}

app.initDisplay = function() {
	$('.music').hide();
	$('.results').hide();
};

app.events = function () {
	// on landing__locationFormSubmit submit 
	app.createLocationFormSubmitListener();
	// on music__genreBtn click
	app.createMusicGenreBtnListener();
	// on music__genreOtherInput change
	app.createGenreOtherInputListener();
	// on music__musicFormSubmitBtn click
	app.createMusicFormSubmitBtnListener();
	// on results__reloadBtn click
	app.createReloadBtnListener();
	// on results__changeMusicBtn click
	app.createChangeMusicBtnListener();
	// on results__changeLocationBtn click
	app.createChangeLocationBtnListener();
	// on results__generateNewPlaylistBtn
	app.createGenerateNewPlaylistBtnListener();
}

// Jenn
app.createLocationFormSubmitListener = function(){
	$('.landing__locationFormSubmitBtn').on('click', function(e){
	e.preventDefault();

        // -Do an AJAX call to FourSquare API.
        app.coffeeShopLocationPromise = app.getCoffeeShopLocation();

        if(app.isLocationInputNull()){

			app.alertIncompleteLocationForm();

		} else if ( !app.isResultsShowing() ){
	//    -Set display: block for section music.
			app.showMusic();
	//    - Smooth scroll to section music.
			app.scrollToMusic();
        } else {
        // ELSE (<section class ="results" === display.block)
		//    - smooth scroll to section result

			//when coffeeshop data is recieved, display it on map.
			app.coffeeShopLocationPromise.then( () => {
				app.clearMap();
				app.displayMap();
			});
			
			app.scrollToResults();
        }
     });
};	

// Jenn
app.getCoffeeShopLocation = function(location){
	// -Do an AJAX call to FourSquare API.
	return $.ajax({
		url: 'https://api.foursquare.com/v2/venues/search?',
		data: {
			client_id: app.client_id,
			client_secret: app.client_secret,
			format: 'json',
			v: '20170930',
			query: 'coffee',
			ll: `${app.location.lat}, ${app.location.lng}`	
		}
	}).then(function(res){
		let coffeeShopLocationsRes = res.response.venues;
		// console.log(coffeeShopLocationsRes);

		app.responseToCoffeeShopInfo(coffeeShopLocationsRes);
	})

};

// TODO: Needs to be renamed to something like: responseToCoffeShopsInfo()
app.responseToCoffeeShopInfo = function(coffeeData) {
	//reset coffee shop data.
	app.coffeeShopsInfo = [];
	// console.log(coffeeData);
	coffeeData.forEach(function(data){
		// pushing this data to app.coffeShopsInfo array in order to populate our map markers
		app.coffeeShopsInfo.push({
			name: data.name,
			phoneNum: data.contact.formattedPhone,
			address: data.location.address,
			website: data.url,
			location: {
				lat: data.location.lat,
				lng: data.location.lng
			}
		});
	});
}

// if no location has been typed in the
app.isLocationInputNull = function () {
	 return app.location.address === '';
};

app.alertIncompleteLocationForm = function(){
		sweetAlert({
	         title: 'Incomplete',
	         text: 'Please Type in a Location!',
	         type: 'error',
	         allowEscapeKey: 'true',
	         showConfirmButton: true,
	         confirmButtonColor: "#1f6d69",
	    });
}


// Jenn
app.scrollToMusic = function() {
	// Smooth scroll to section music
	$('html,body').animate({
     scrollTop: $(".music").offset().top},
     'slow');
};

// Jenn
app.scrollToResults = function() {
	// Smooth scroll to section results
	$('html,body').animate({
     scrollTop: $(".results").offset().top},
     'slow');
};

// Jenn
app.showMusic = function (){
	// Set display: block for section music.
	$('.music').show('slow');
};

// Jenn
app.isResultsShowing = function(){
	// must return true or false
	return $('.results').css('display') !== 'none'
}; 

// Maren
app.createMusicGenreBtnListener = function(){

	$('.music__genreBtn').on('click', function (e){
		e.preventDefault();
			//remove the class of {music__genreBtn--selected} from all other buttons to this.not
				app.removeClassSelectedFromAllBtns();
			// -add class to selected button {music__genreBtn--selected}, 
				app.addClassSelected(this);
			// store value of selected input in app.genre
				app.storeGenreVal();
			// reset the <select class="genreOtherInput"> to default value
				app.resetOtherGenreToDefault();
	});
};

app.removeClassSelectedFromAllBtns = function(){
	// -remove the class of {music__genreBtn--selected} from all other buttons to this.not
	$('.music__genreBtn').removeClass('music__genreBtn--selected');
};

// Maren
app.addClassSelected = function(selectedButton) {
	// add class to selected button {music__genreBtn--selected}, 
	$(selectedButton).addClass('music__genreBtn--selected');
};

// Maren
app.storeGenreVal = function(){
	// store value of selected input in app.genre
	app.genre = $('.music__genreBtn--selected').val();
};

// Maren
app.resetOtherGenreToDefault = function(){
// -reset the <select class="genreOtherInput"> to default value
	$('.music__GenreOtherSelect option').prop('selected', function() {
        return this.defaultSelected;
    });
};

// Maren
app.createGenreOtherInputListener = function(){
	 // -IF user selects <select class="music__genreOtherInput>", remove the class {music__genreBtn--selected} from all buttons, store value of selected input in app.genre

	 $('select').on('change', function(){
		 if($('#music__GenreOtherSelect').val() !== "other"){
		 	app.removeClassSelectedFromAllBtns();
		 	app.genre = $('#music__GenreOtherSelect').val();
		 }
	 });
};

//Fatin 
app.createMusicFormSubmitBtnListener = function(){

		$('.music__musicFormSubmitBtn').on('click', function() {
			//- store the value of both inputs in minutes from {music__durationForm}, call this value app.duration
			// app.storeDurationVal(); //DEPRECATED

				//if the value of variable app.genre is =null, sweet alert message
				if(app.genreIsNull()) {
					app.alertIncompleteForm();

				} else {
					app.resetSpotifyPlaylistAndData();

					//set the load screen
					app.showLoadIndicator();
					app.hideErrorMsg();
					app.showLoadScreen();
					
					//show and scroll to results.
					app.showResults();
					app.scrollToResults();

					app.spotifyPlaylistPromise = app.getSpotifyPlaylist();
						$.when(app.spotifyPlaylistPromise, app.coffeeShopLocationPromise)
							.then( (spotifyRes, coffeeShopLocationRes) => {
								app.displaySpotifyPlaylist();

								app.displayMap();
								app.hideLoadScreen();

							}).fail((err) =>{
								app.hideLoadIndicator();
								app.showErrorMsg();
							});


				}
		});
};

// Fatin
app.showErrorMsg = function(){
	$('.results__loadErrorMsg').show();
};

// Fatin
app.hideErrorMsg = function(){
	$('.results__loadErrorMsg').hide();
};

// Fatin
app.showLoadIndicator = function(){
	$('.results__loadIndicator').show();
};

// Fatin
app.hideLoadIndicator = function(){
	$('.results__loadIndicator').hide();
};

// Fatin
app.hideLoadScreen = function(){
	$('.results__loadScreenContainer').hide();
};

// Fatin
app.showLoadScreen = function(){
	$('.results__loadScreenContainer').show();
};


// Fatin
app.displayMap = function(){
	//TODO: remove this line
	// $('#results__map').css('height', '200px').css('width','100%');
	
	//create map
	if ( !app.hasMap() ) {
		app.map = app.createMap();
	}

	app.setMapView();

	const markers = [];

	//generate the markers with popup of shop info.
	for (let shop of app.coffeeShopsInfo) {
		const marker = app.createMapMarker(shop.location);

		marker.bindPopup( app.createMapPopup(shop) );

		markers.push(marker);
	}

	
	markers.forEach(function(marker) {
		marker.addTo(app.map);
	});

	app.markers = markers;

	//add all markers to map.
	// app.mapMarkersLayer = L.layerGroup(markers);
	// app.mapMarkersLayer.addTo(app.map);
	// console.log(app.mapMarkersLayer);
	

};

app.setMapView = function() {
	app.map.setView([app.location.lat, app.location.lng], app.mapZoomLevel);
};

// Fatin
app.createMap = function () {
	//initialize map
	const $map = L.map('results__map')
	.setView([app.location.lat, app.location.lng], app.mapZoomLevel);


	//setup tile layer for map.
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		//add credits for the data
		attribution:    
						'Map data &copy;<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom:        18,
		id:             'mapbox.streets',
		accessToken:    CONSTANTS.mapboxApiKey,
	})
	.addTo($map); // Pass in the tile layer data to the Leaflet map, mymap

	return $map;
};

app.createMapMarker = function(location) {
	return L.marker([location.lat, location.lng]);
};

app.createMapPopup = function(shop) {
	return `<p class="results__mapPopupTitle">${shop.name}</p>
			<p class="results__mapPopupAddress">${shop.address}</p>
			<p class="results__mapPopupPhoneNum">${shop.phoneNum}</p>
			<a class="results__mapPopupWebsite" href="${shop.website}">Website</a>`;
};

// TODO
// Fatin
app.clearMap = function () {
	//clear out all the markers from map.
	app.markers.forEach(function(marker){
		marker.remove();
	});
};

app.hasMap = function () {
	return !$.isEmptyObject(app.map); 
};

// Fatin
app.displaySpotifyPlaylist = function(){
	const $playlistContainer = $('.results__playlist');
	
	//get playlist uri to display
	const uri = app.pickSpotifyPlaylistUri();

	const $domElement = app.createPlaylistDom(uri);

	app.clearSpotifyPlaylistDom();
	$playlistContainer.append( $($domElement) );
	$playlistContainer.show();
};

// Fatin
app.clearSpotifyPlaylistDom = function() {
	$('.results__playlist').empty();
}

// Fatin
app.pickSpotifyPlaylistUri = function() {
	const uri = app.spotifyPlaylists[app.numOfPlaylistsGenerated++].uri;

	app.spotifyPlaylistsRequestOffset++;

	if ( app.isSpotifyPlaylistsExhausted() ) {
		app.getSpotifyPlaylist()
		app.numOfPlaylistsGenerated = 0;
	}

	return uri;
};

app.isSpotifyPlaylistsExhausted = function() {
	return app.numOfPlaylistsGenerated >= app.spotifyPlaylists.length;
};

// Fatin
app.createPlaylistDom = function(uri) {

	return `<iframe src="${CONSTANTS.spotifyEmbeddedBaseUrl}?uri=${uri.replace(/:/g, '%3A')}&theme=${CONSTANTS.spotifyEmbeddedThemeColor}" width="${CONSTANTS.spotifyEmbeddedWidth}" height="${CONSTANTS.spotifyEmbeddedHeight}" frameborder="0" allowtransparency="true"></iframe>`
};

// Fatin

app.resetSpotifyPlaylistAndData = function() {
	app.numOfPlaylistsGenerated = 0;
	app.spotifyPlaylistsRequestOffset = 0;
	
	app.clearSpotifyPlaylists();
	app.clearSpotifyPlaylistDom();
}

// Fatin
app.getSpotifyPlaylist = function(){
 // - call Spotify AJAX function
	return $.ajax({
		url: `${CONSTANTS.spotifyPlaylistsBaseUrl}${app.genre}/playlists?limit=${CONSTANTS.numOfPlaylistLimit}`,
		method: 'GET',
		headers: app.spotifyHeader,
		data: {
			offset: app.spotifyPlaylistsRequestOffset,
		},
	})
	.then( (res) => {
		app.clearSpotifyPlaylists();
		app.spotifyPlaylists = app.responseToSpotifyPlaylist(res);
	})
	.catch( app.spotifyErrorHandle );
};

// Fatin
app.responseToSpotifyPlaylist = function(res) {
	const spotifyPlaylists = [];

	for(let item of res.playlists.items) {
		spotifyPlaylists.push({
			id: item.id,
			uri: item.uri,
			loaded: false, //state check if user loaded it.
		});
	}

	return spotifyPlaylists;
};

// Fatin
app.clearSpotifyPlaylists = function() {
	app.spotifyPlaylists = [];
};

// Fatin
app.showResults = function(){
	//set <section class="results"> display block.
	$('.results').show();
};

// Maren
app.alertIncompleteForm = function(){
		sweetAlert({
	         title: 'Incomplete',
	         text: 'Please pick from either the genres provided or from the "Other" menu.',
	         type: 'error',
	         allowEscapeKey: 'true',
	         showConfirmButton: true,
	         confirmButtonColor: "#1f6d69",
	    });
};

// Fatin
app.genreIsNull = function(){
// must return true or false
	return app.genre === null;
};

// Jenn
// DEPRECATED
 //- store the value of both inputs in minutes from {music__durationForm}, call this value app.duration
// app.storeDurationVal = function(){

// };


// on results__reloadBtn click
app.createReloadBtnListener = function(){
	$('.results__reloadBtn').on('click', function() {
		$('.music__musicFormSubmitBtn').trigger('click');
	});
};


// on results__changeMusicBtn click
app.createChangeMusicBtnListener = function(){
	$('.results__changeMusicBtn').on('click', function() {
		app.scrollToMusic();
	});
};

// on results__changeLocationBtn click
app.createChangeLocationBtnListener = function(){
	$('.results__changeLocationBtn').on('click', function() {
		// -smooth scroll up to landing section.
		app.scrollToLanding();
	});
};

// Jenn
app.scrollToLanding = function(){
	$('html,body').animate({
     scrollTop: $(".landing").offset().top},
     'slow');
};

// Maren
//  - initialize the auto complete library
app.initLocationInput = function () {
	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);
	// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	// $('landing__locationForm').on('submit',function(e) {
	// 	e.preventDefault();
	// 	console.log('form submitting.');
	// });

	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
	      var places = searchBox.getPlaces();

		  if (places.length == 0) {
		    return;
		}

		 app.location = {
		  	lng : places[0].geometry.location.lng(),
		  	lat : places[0].geometry.location.lat(),
		  	address : places[0].formatted_address,
		  };

		$('.results__mapTitle').append(`<p>Coffee shop locations near</p><p>${app.location.address}</p>`);




		  // e.preventDefault();

		  // For each place, get the icon, name and location.
		  // var bounds = new google.maps.LatLngBounds();
		  // places.forEach(function(place) {
		  //   if (!place.geometry) {
		  //     console.log("Returned place contains no geometry");
		  //     return;
		  //   }
		  // });

		  $('.landing__locationFormSubmitBtn').trigger('click');
	});	
}

// Fatin
app.createGenerateNewPlaylistBtnListener = function() {
	$('.results__generateNewPlaylistBtn').on('click', function(e) {
		e.preventDefault();
		app.displaySpotifyPlaylist();
	});
}

/********** Spotify API Related Functions ***********/

//Main method to get token and set the header for Spotify OAuth.
app.setSpotifyAuthorization = function() {
	return app.getSpotifyToken()
				.then( (res) => {
					app.setSpotifyHeader(res.token_type, res.access_token);
				});
}

app.spotifyErrorHandle = function(err) {
	if(err.status !== undefined) {
		if (err.status === 401) {
			return app.setSpotifyAuthorization();
		} else {
			console.log('Spotify API HTTP Error:', err.status);
			
			//pass on a Promise with the error.
			return new Promise().catch( (err) => err ); 	
		}
	} else {
		console.log('Error in handling of Spotify response.');
	}
}

app.getSpotifyToken = function (){
	return $.ajax({
		url: CONSTANTS.hackeryouProxyUrl,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		data: JSON.stringify({
			reqUrl: CONSTANTS.spotifyAuthUrl,
			params: {
				grant_type: 'client_credentials'
			},
			proxyHeaders: CONSTANTS.spotifyAuthProxyHeader,
		}),
	});
};

app.setSpotifyHeader = function (tokenType, accessToken) {
	app.spotifyHeader = {
		'Authorization': `${tokenType} ${accessToken}`
	}
};

// app.createSpotifyPlaylist = function() {
// 	//getSpotify tracks
// 	app.getSpotifyTracks()
// 		.then( () => app.generatePlaylist );
// };

// app.generatePlaylist = function() {
// 	console.log(app.potentialTracks);
// };

// app.getSpotifyTracks = function() {
// 	return $.ajax({
// 				url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
// 				method: 'GET',
// 				headers: app.spotifyHeader,
// 				data: {},
// 			})
// 			.then( (res) => console.log(res) )
// 			.catch( app.spotifyAuthorizationErrorHandle );
// };