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

	coffeeShopsInfo: {}, //TODO: remember to use this.

	spotifyHeader: {}, //for Spotify OAuth
};

app.init = function () {
	// initialize the auto complete library
	app.initLocationInput();
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
	// -on Submit EventListener
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
};	

// Jenn
app.getCoffeeShopLocation = function(){
	// -Do an AJAX call to FourSquare API.
};

// Jenn
app.scrollToMusic = function() {
	// Smooth scroll to section music
};

// Jenn
app.scrollToResults = function() {
	// Smooth scroll to section results
};

// Jenn
app.showMusic = function (){
	// Set display: block for section music.
};

// Jenn
app.isResultsShowing = function(){
	// must return true or false
};

// Maren
app.createMusicGenreBtnListener = function(){

	// -IF user picks <button class="music__genreBtn">... on click, 
			// -add class to selected button {music__genreBtn--selected}, 
				app.addClassSelected(this);
			// store value of selected input in app.genre
				app.storeGenreVal();
	//      -remove the class of {music__genreBtn--selected} from all other buttons to this.not
				app.removeClassSelected($(this).not());
	//      -reset the <select class="genreOtherInput"> to default value
				app.resetOtherGenreToDefault();
};

// Maren
app.storeGenreVal = function(){
	// store value of selected input in app.genre
};

// Maren
app.addClassSelected = function(selectedButton) {
	// add class to selected button {music__genreBtn--selected}, 
};

// Maren
app.removeClassSelected = function(unselectedButtons){
	// -remove the class of {music__genreBtn--selected} from all other buttons to this.not
};

// Maren
app.resetOtherGenreToDefault = function(){
// -reset the <select class="genreOtherInput"> to default value
};

// Maren
app.createGenreOtherInputListener = function(){
	 // -IF user selects <select class="music__genreOtherInput>", remove the class {music__genreBtn--selected} from all buttons, store value of selected input in app.genre
	 	app.removeClassSelected($('.music__genreBtn'));
};

//Fatin 
app.createMusicFormSubmitBtnListener = function(){
		// -on {music__musicFormSubmitBtn}, click,
		$('.music__musicFormSubmitBtn').on('click', function() {
			//- store the value of both inputs in minutes from {music__durationForm}, call this value app.duration
			app.storeDurationVal();

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
	//

	// display markers
		//create popups

};

// Fatin
app.displaySpotifyPlaylist = function(){
	//TODO
	$('.results__playlist').show();
	console.log('app.displaySpotifyPlaylist not coded.');
};

// Fatin
app.getSpotifyPlaylist = function(){
	console.log('app.getSpotifyPlaylist not coded.'); 
 // - call Spotify AJAX function
	return Promise.then( () => { return {}; } );
 	
};

// Fatin
app.showResults = function(){
	//set <section class="results"> display block.
	$('.results').show();
};

// Maren
app.alertIncompleteForm = function(){
// sweet alert message
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

};

/********** Spotify API Related Functions ***********/

//Main method to get token and set the header for Spotify OAuth.
app.setSpotifyAuthorization = function() {
	return app.getSpotifyToken()
				.then( (res) => {
					app.setSpotifyHeader(res.token_type, res.access_token);
				});
}

app.spotifyAuthorizationErrorHandle = function(err) {
	//if the token is no longer valid, redo authorization
	if (err.status === 401) {
		return app.setSpotifyAuthorization();
	} else {
		console.log('Spotify API HTTP Error:', err.status);
		//pass on a Promise with the error.
		return $.Deferred.catch( (err) => err ); 
		
	}
}

app.getSpotifyToken = function () {
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