const app = {
	genre    : null,
	duration : 60,
	location : {
		lat  : 43.6532,
		lng  : -79.3832,
		address: '',
		name: '',
	},
	resultsDisplayed : false,
	spotifyPlaylistPromise: null,
	coffeeShopLocationPromise: null,

	coffeeShopsInfo: [],

	spotifyHeader: {}, //for Spotify OAuth

	spotifyPlaylists: [],

	// track num of playlists generated for user.
	// if it equals to spotifyPlaylists.length
	// this value will be reset to zero.
	numOfPlaylistsGenerated: 0,

	// track for offsetting the requested playlists list from Spotify
	// so we get new search results.
	spotifyPlaylistsRequestOffset: 0,
	
	map: {}, //contains Google Map object
	mapZoomLevel: 13,
	mapMarkersLayer: {},
	mapMarkers: [],
	mapPopups: [],
};

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

app.createLocationFormSubmitListener = function(){
	$('.landing__locationFormSubmitBtn').on('click', function(e){
	e.preventDefault();

        // -Do an AJAX call to FourSquare API.
        app.coffeeShopLocationPromise = app.getCoffeeShopLocation();

        if(app.isLocationInputNull()){

			app.alertIncompleteLocationForm();

		} else if ( !app.isResultsShowing() ){
			//Set display: block for section music.
			app.showMusic();
			//Smooth scroll to section music.
			app.scrollToMusic();
        } else {
			//when coffeeshop data is recieved, display it on map.
			app.coffeeShopLocationPromise.then( () => {
				app.clearMap();
				app.displayMap();
			});
			
			app.scrollToResults();
        }
     });
};	

app.getCoffeeShopLocation = function(location){
	// Do an AJAX call to FourSquare API.
	return $.ajax({
		url: 'https://api.foursquare.com/v2/venues/search?',
		data: {
			client_id: CONSTANTS.foursquare_id,
			client_secret: CONSTANTS.foursquare_secret,
			format: 'json',
			v: '20170930',
			query: 'coffee',
			ll: `${app.location.lat}, ${app.location.lng}`	
		}
	}).then(function(res){
		let coffeeShopLocationsRes = res.response.venues;

		app.responseToCoffeeShopInfo(coffeeShopLocationsRes);
	})

};

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

// if no location has been typed in the input field, include error message
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

app.scrollToMusic = function() {
	// Smooth scroll to section music
	$('html,body').animate({
     scrollTop: $(".music").offset().top},
     'slow');
};

app.scrollToResults = function() {
	// Smooth scroll to section results
	$('html,body').animate({
     scrollTop: $(".results").offset().top},
     'slow');
};

app.showMusic = function (){
	// Set display: block for section music.
	$('.music').show('slow');
};

app.isResultsShowing = function(){
	// must return true or false
	return $('.results').css('display') !== 'none'
}; 

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

app.addClassSelected = function(selectedButton) {
	// add class to selected button {music__genreBtn--selected}, 
	$(selectedButton).addClass('music__genreBtn--selected');
};

app.storeGenreVal = function(){
	// store value of selected input in app.genre
	app.genre = $('.music__genreBtn--selected').val();
};

app.resetOtherGenreToDefault = function(){
// -reset the <select class="genreOtherInput"> to default value
	$('.music__GenreOtherSelect option').prop('selected', function() {
        return this.defaultSelected;
    });
};


app.createGenreOtherInputListener = function(){

	 $('select').on('change', function(){
		 if($('#music__GenreOtherSelect').val() !== "other"){
		 	app.removeClassSelectedFromAllBtns();
		 	app.genre = $('#music__GenreOtherSelect').val();
		 }
	 });
};


app.createMusicFormSubmitBtnListener = function(){

		$('.music__musicFormSubmitBtn').on('click', function() {

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


app.showErrorMsg = function(){
	$('.results__loadErrorMsg').show();
};


app.hideErrorMsg = function(){
	$('.results__loadErrorMsg').hide();
};


app.showLoadIndicator = function(){
	$('.results__loadIndicator').show();
};


app.hideLoadIndicator = function(){
	$('.results__loadIndicator').hide();
};


app.hideLoadScreen = function(){
	$('.results__loadScreenContainer').hide();
};


app.showLoadScreen = function(){
	$('.results__loadScreenContainer').show();
};

/******** GOOGLE MAP FUNCTIONALITY ********/
app.initMap = function() {
	console.log('map api ready.');
};

app.displayMap = function() {
	//create map
	if ( !app.hasMap() ) {
		app.map = app.createMap();
	}

	app.setMapView();

	const markers = [];
	const popups = [];

	//generate the markers with popup of shop info.
	for (let shop of app.coffeeShopsInfo) {
		const marker = app.createMapMarker(shop.location);

		console.log(marker, marker.position.lat(), marker.position.lng());

		const popup = app.createMapPopup(shop);

		app.bindPopupToMarker(popup, marker);

		markers.push(marker);
		popups.push(popup);
	}


	app.mapMarkers = markers;
	app.mapPopups = popups;
	
};

app.setMapView = function() {
	app.map.panTo({lat: app.location.lat, lng: app.location.lng});
};

app.createMap = function () {
	return new google.maps.Map(document.getElementById('results__map'), {
		center: {lat: app.location.lat, lng: app.location.lng},
		zoom: app.mapZoomLevel,
		styles: CONSTANTS.googleMapStyles,
	});
};

app.createMapMarker = function(location) {
	return new google.maps.Marker({
		position: location,
		map: app.map,
		icon: 'public/assets/markerIcon50x50wShadow.png',
	});
};

app.createMapPopup = function(shop) {
	const content = `<p class="results__mapPopupTitle">${shop.name}</p>
					<p class="results__mapPopupAddress">${shop.address}</p>
					<p class="results__mapPopupPhoneNum">${shop.phoneNum}</p>
					<a class="results__mapPopupWebsite" href="${shop.website}" target="_blank">Website</a>`;

	return new google.maps.InfoWindow({
		content: content
	  });	
};

app.bindPopupToMarker = function(popup, marker) {
	marker.addListener('click', function() {
		popup.open(app.map, marker);
	});
};


app.clearMap = function () {
	//clear out all the markers from map.
	app.mapMarkers.forEach(function(marker){
		marker.setMap(null);
	});
};



app.hasMap = function () {
	return !$.isEmptyObject(app.map); 
};

/******** ******* ********/

/******** SPOTIFY FUNCTIONALITY ********/

app.displaySpotifyPlaylist = function(){
	const $playlistContainer = $('.results__playlist');
	
	//get playlist uri to display
	const uri = app.pickSpotifyPlaylistUri();

	const $domElement = app.createPlaylistDom(uri);

	app.clearSpotifyPlaylistDom();
	$playlistContainer.append( $($domElement) );
	$playlistContainer.show();
};


app.clearSpotifyPlaylistDom = function() {
	$('.results__playlist').empty();
}


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


app.createPlaylistDom = function(uri) {

	return `<iframe src="${CONSTANTS.spotifyEmbeddedBaseUrl}?uri=${uri.replace(/:/g, '%3A')}&theme=${CONSTANTS.spotifyEmbeddedThemeColor}" width="${CONSTANTS.spotifyEmbeddedWidth}" height="${CONSTANTS.spotifyEmbeddedHeight}" frameborder="0" allowtransparency="true"></iframe>`
};

app.resetSpotifyPlaylistAndData = function() {
	app.numOfPlaylistsGenerated = 0;
	app.spotifyPlaylistsRequestOffset = 0;
	
	app.clearSpotifyPlaylists();
	app.clearSpotifyPlaylistDom();
};


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


app.clearSpotifyPlaylists = function() {
	app.spotifyPlaylists = [];
};

/******** ******* ********/

app.showResults = function(){
	//set <section class="results"> display block.
	$('.results').show();
};

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


app.genreIsNull = function(){
// must return true or false
	return app.genre === null;
};

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

app.scrollToLanding = function(){
	$('html,body').animate({
     scrollTop: $(".landing").offset().top},
     'slow');
};

//  - initialize the auto complete library
app.initLocationInput = function () {
	
	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);

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
		  	name : places[0].name,
		  };

		$('.results__mapTitle').html(`Coffee shops near ${app.location.name}`);

		  $('.landing__locationFormSubmitBtn').trigger('click');
	});	
}


app.createGenerateNewPlaylistBtnListener = function() {
	$('.results__generateNewPlaylistBtn').on('click', function(e) {
		e.preventDefault();
		app.displaySpotifyPlaylist();
	});
}

/********** Spotify Authorization API Related Functions ***********/

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
