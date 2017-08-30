app = {
	genre    : null,
	duration : 60,
	location : {
		lat  : 0,
		lng  : 0
	},
	resultsDisplayed : false,
	spotifyPlaylistPromise: null,
	coffeeShopLocationPromise: null,
};

app.init = function () {
	// initialize the auto complete library
	app.initLocationInput();
	app.events();
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

app.getCoffeeShopLocation = function(){
	// -Do an AJAX call to FourSquare API.
};

app.scrollToMusic = function() {
	// Smooth scroll to section music
};

app.scrollToResults = function() {
	// Smooth scroll to section results
};

app.showMusic = function (){
	// Set display: block for section music.
};

app.isResultsShowing = function(){
	// must return true or false
};

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

app.storeGenreVal = function(){
	// store value of selected input in app.genre
};

app.addClassSelected = function(selectedButton) {
	// add class to selected button {music__genreBtn--selected}, 
};

app.removeClassSelected = function(unselectedButtons){
	// -remove the class of {music__genreBtn--selected} from all other buttons to this.not
};

app.resetOtherGenreToDefault = function(){
// -reset the <select class="genreOtherInput"> to default value
};

app.createGenreOtherInputListener = function(){
	 // -IF user selects <select class="music__genreOtherInput>", remove the class {music__genreBtn--selected} from all buttons, store value of selected input in app.genre
	 	app.removeClassSelected($('.music__genreBtn'));
};

app.createMusicFormSubmitBtnListener = function(){
		// -on {music__musicFormSubmitBtn}, click,

	 //        - store the value of both inputs in minutes from {music__durationForm}, call this value app.duration
	 app.storeDurationVal();

	 //        -if the value of variable app.genre is =null, sweet alert message
	 	if(app.genreIsNull()) {
	 		app.alertIncompleteForm();

	 	}else {
	 		app.showResults();
	 		app.scrollToResults();
	 		app.spotifyPlaylistPromise = app.getSpotifyPlaylist();
	 			$.when(app.spotifyPlaylistPromise, app.coffeeShopLocationPromise)
	 				.then( (spotifyRes, coffeeShopLocationRes) => {
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
};

app.showErrorMsg = function(){

};

app.hideLoadIndicator = function(){

};

app.hideLoadScreen = function(){

};

app.displayMap = function(){

};

app.displaySpotifyPlaylist = function(){

};

app.getSpotifyPlaylist = function(){
 // - call Spotify AJAX function
};

app.showResults = function(){
 //set <section class="results"> display block.
};

app.alertIncompleteForm = function(){
// sweet alert message
};

app.genreIsNull = function(){
// must return true or false
};
 //- store the value of both inputs in minutes from {music__durationForm}, call this value app.duration
app.storeDurationVal = function(){

};
// on results__reloadBtn click
app.createReloadBtnListener = function(){
	// error message reload button (have yet to put into html context)
};
// on results__changeMusicBtn click
app.createChangeMusicBtnListener = function(){
	// - smooth scroll up to music section.
	app.scrollToMusic();
};
// on results__changeLocationBtn click
app.createChangeLocationBtnListener = function(){
	// -smooth scroll up to landing section.
	app.scrollToLanding();
};


app.scrollToLanding = function(){

};



//  - initialize the auto complete library
app.initLocationInput = function () {

};