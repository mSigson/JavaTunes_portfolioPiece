const app = {
	genre    : null,
	duration : 60,
	location : {
		lat  : 0,
		lng  : 0
	},
	resultsDisplayed : false,
	spotifyPlaylistPromise: null,
	coffeeShopLocationPromise: null,
	coffeeShopsInfo: [],
	//objects inside coffeeShopsInfo{name:,website:,address:,phoneNum:}

	coffeeShopsInfo: [], //TODO: remember to use this.
	//name, address, phoneNum, website

	spotifyHeader: {}, //for Spotify OAuth

	client_id : 'RT3LKD5UVN1NHTLW20JOPKOLJEPNXGCDZFNRCZAH5UIJ5XNN',
	client_secret : 'JK0QPEHBL5WHEUBISF1NGUXNPHF30F2QKYYNNU30PHVVEFMW',

	spotifyPlaylists: [],

	// track num of playlists generated for user.
	// if it equals to spotifyPlaylists.length
	// this value will be reset to zero.
	numOfPlaylistsGenerated: 0,

};

function getFirstElementFromArray(elem) {
	return elem[0];
}


app.init = function () {
	// initialize the auto complete library
	// app.initLocationInput();
	app.events();
	app.setSpotifyAuthorization();

}

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
}

// Jenn
app.createLocationFormSubmitListener = function(){
	$('.landing__LocationForm').on('submit', function(e){
	e.preventDefault();


        // -Do an AJAX call to FourSquare API.
        app.coffeeShopLocationPromise = app.getCoffeeShopLocation();

        if(app.isResultsShowing()){
        //    -Set display: block for section music.
        		app.showMusic();
        //    - Smooth scroll to section music.
        		app.scrollToMusic();
        } else {
        // ELSE (<section class ="results" === display.block)
        //    - smooth scroll to section results
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
			ll: '43.654416538795935, -79.40131094320991'
		}
	}).then(function(res){
		let coffeeShopLocationsRes = res.response.venues;
		// console.log(coffeeShopLocationsRes);

		app.getCoffeeShopData(coffeeShopLocationsRes)


	})

};


app.getCoffeeShopData = function(coffeeData) {
	console.log(coffeeData);

	coffeeData.forEach(function(data){
		let name = data.name;
		// console.log(coffeeShopName);

		let phoneNum = data.contact.formattedPhone;
		// console.log(coffeeShopPhoneNum);

		let address = data.location.address;
		// console.log(coffeeShopAddress);

		let website = data.url;
		// console.log(coffeeShopWebsite);

		//  app.coffeeShopsInfo = [name, phoneNum, address, website]
		// console.log(app.coffeeShopsInfo);
	})
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
		// -on {music__musicFormSubmitBtn}, click,
		$('.music__musicFormSubmitBtn').on('click', function() {
			//- store the value of both inputs in minutes from {music__durationForm}, call this value app.duration
			app.storeDurationVal();

			app.genre = 'rock'; // TODO: delete

			//-if the value of variable app.genre is =null, sweet alert message
				if(app.genreIsNull()) {
					app.alertIncompleteForm();

				} else {
					app.showResults();
					app.scrollToResults();
					app.spotifyPlaylistPromise = app.getSpotifyPlaylist();
						$.when(app.spotifyPlaylistPromise, app.coffeeShopLocationPromise)
							.then( (spotifyRes, coffeeShopLocationRes) => {
								//TODO: Need to add response handles.
								
			//                - display spotify playlist (function)
								app.displaySpotifyPlaylist();
			//                - display map, CONSTANTS.numOfLocations, (function)
								app.displayMap();
			//                - set {results__loadScreen} to display none
								app.hideLoadScreen();

							}).fail((err) =>{
			//                - set {results__loadIndicator} to display none
								app.hideLoadIndicator();
			//                - set {results__loadErrorMsg} to display block
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
app.hideLoadIndicator = function(){
	$('.results__loadIndicator').hide();
};

// Fatin
app.hideLoadScreen = function(){
	$('.results__loadScreen').hide();
};

// TODO
// Fatin
app.displayMap = function(){
	//display markers


	// display markers
		//create popups
};

// Fatin
// TODO
app.displaySpotifyPlaylist = function(){
	// const $playlistContainer = $('.results__playlist');

	// const uri = app.pickSpotifyPlaylistUri();
	// const $domElement = app.createPlaylistDom(uri);

	// $playlistContainer.empty();
	// $playlistContainer.append('CATNIP');
	// $playlistContainer.append( $($domElement) );
	// $playlistContainer.show();
};

// Fatin
app.pickSpotifyPlaylistUri = function() {
	const uri = app.spotifyPlaylists[app.numOfPlaylistsGenerated++].uri;

	if ( app.isSpotifyPlaylistsExhausted() ) {
		app.getSpotifyPlaylist();
	}

	return uri;
};

app.isSpotifyPlaylistsExhausted = function() {
	return app.numOfPlaylistsGenerated >= app.spotifyPlaylists.length;
};

// Fatin
app.createPlaylistDom = function(uri) {
	console.log('spotify playlist dom created.');

	console.log(`<iframe src="${CONSTANTS.spotifyEmbeddedBaseUrl}?uri=${uri}&theme=${CONSTANTS.spotifyEmbeddedThemeColor}" width="${CONSTANTS.spotifyEmbeddedWidth}" height="${CONSTANTS.spotifyEmbeddedHeight}" frameborder="0" allowtransparency="true"></iframe>`);

	return 
		`<iframe src="${CONSTANTS.spotifyEmbeddedBaseUrl}?uri=${uri}&theme=${CONSTANTS.spotifyEmbeddedThemeColor}" width="${CONSTANTS.spotifyEmbeddedWidth}" height="${CONSTANTS.spotifyEmbeddedHeight}" frameborder="0" allowtransparency="true"></iframe>`
};

// Fatin
app.getSpotifyPlaylist = function(){
 // - call Spotify AJAX function
	return $.ajax({
		url: `${CONSTANTS.spotifyPlaylistsBaseUrl}${app.genre}/playlists?limit=${CONSTANTS.numOfPlaylistLimit}`,
		method: 'GET',
		headers: app.spotifyHeader,
		data: {},
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
	if(app.genre === null){
		sweetAlert({
	         title: 'Incomplete',
	         text: 'Please pick from either the genres provided or from the "Other" menu.',
	         type: 'error',
	         allowEscapeKey: 'true',
	         showConfirmButton: true
	    });
	}
};

// Fatin
app.genreIsNull = function(){
// must return true or false
	return app.genre === null;
};

// Jenn
 //- store the value of both inputs in minutes from {music__durationForm}, call this value app.duration
app.storeDurationVal = function(){

};

// TODO
// on results__reloadBtn click
app.createReloadBtnListener = function(){
	// error message reload button (have yet to put into html context)
	$('.results__reloadBtn').on('click', function() {
		console.log('createReloadBtnListener function needs to be complete.');
	});
};

// Fatin
// on results__changeMusicBtn click
app.createChangeMusicBtnListener = function(){
	$('.results__changeMusicBtn').on('click', function() {
		// - smooth scroll up to music section.
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

};

// Maren
//  - initialize the auto complete library
app.initLocationInput = function () {
	app.initAutocomplete()
	
};


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