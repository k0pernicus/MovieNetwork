var api_key = "f5dbc30b9b6055d3e85d063550790802";

var number_similar_movies = 25;
var number_similar_movies_obtains = 0;
var results_display = null;

//Movie searched
var first_movie = new movie_object();
//Array of similar movies, from first_movie
var similarMovies = new similar_movies();

//similarMoviesTab will contains the untraited data from the HTTP request (for similar movies)
var similarMoviesTab = new Array();
//Variable which contains the progress HTML5 element
var progress_bar = null;

/**
 * Action 'submit_search' button click<br/>
 * 1st: reset the results<br/>
 * 2nd: get the number of movies wanted<br/>
 * 3rd: get the display form<br/>
 * 4th: reset variables & objects<br/>
 * 5th: search the movie
 * @return {Boolean} False -> No send data to new page
 */
$('#submit_search').click(function()
{
	//Clean results div
	remove_all_display_results();
	//Search the number of similar movies the user want to display
	number_similar_movies = $("#number_movies_listed").val();
	//Search the display method (Graph, List, ...)
	results_display = $('input[name=how_to_display_results]:checked', '#form_search_movie').val();
	//Reset all variables and objects
	reset_all_variables();
	//Search the movie
	search_movie();
	//Don't load the homepage again -> False
    return false;
});

/**
 * Action 'reset_search' button click<br/>
 * 1st: reset the results<br/>
 * 2nd: to hide the 'save_pdf_file' button
 */
$('#reset_search').click(function()
{
	//Clean results div
	remove_all_display_results();
	//Hide the "pdf_file" button
	display_save_file_button(false);
});

/**
 * Action 'save_pdf_file' button click<br/>
 * 1st: to build pdf_file object (see developer documentation)<br/>
 * 2nd: write results & save the file<br/>
 */
$('#save_pdf_file').click(function()
{
	//Construction of a pdf_file object
	var pdf_file = new pdf_file(first_movie, number_similar_movies, number_similar_movies_obtains, similarMovies);
	//Write & save the pdf file
	pdf_file.write_pdf();
})

/**
 * Function to reset variables & objects</br>
 * Reset 'number_similar_movies_obtains', first_movie & similar_movies objects
 */
function reset_all_variables() {

	number_similar_movies_obtains = 0;
	first_movie.reset();
	reset_all_similar_movies_variables();

}

/**
 * Function to reset only similar_movies object
 */
function reset_all_similar_movies_variables() {

	similarMovies.reset();

}

/**
 * Function to remove all child of a part of the HTML DOM
 * @param  {DOM} document div, span, etc...
 */
function remove_all_child(document) {

	while (document.firstChild)
    	document.removeChild(document.firstChild);	

}

/**
 * Function to remove all results allready display
 */
function remove_all_display_results() {

	var display_results_node = document.getElementById('display_results');
	remove_all_child(display_results_node);

}

/**
 * Function to get the overview of a specific movie, by his id & an HTTP request (to TMDb)
 * @param  {String} id The specific id of a movie
 * @return {JSON} A JSON object, which contains the results of the HTTP request
 */
function get_overview(id) {

	var self = this;

	var http_request = make_http_object();

	//False -> sync
	http_request.open("GET", "https://api.themoviedb.org/3/movie/"+id+"?append_to_response=credits&api_key="+api_key, false);

	http_request.send(null/*JSON.stringify(http_request.responseText)*/);

	if (http_request.readyState == 4 && http_request.status == 200) {
		var obj = eval( '('+http_request.responseText+')');
		return obj;
	}

}

/**
 * Function to get the director of a movie, from a JSON object
 * @param  {JSON} object A JSON object, results of the 'get_overview' function (see developer documentation)
 * @return {Array} An array which contains all the directors of the movie
 */
function get_director(object) {

	var tabDirector = new Array();

	var crew = object.credits.crew;

	for (var i=0; i < crew.length; i++) {

		if (crew[i].job == "Director")
			tabDirector.push(crew[i].name);

	}

	return tabDirector;

}

/**
 * Function to get the score of a similar movie<br/>
 * The score is computed first by comparing directors<br/>
 * Good idea is to compute also with screenwriters...<br/>
 * NOTE: See perform_algorithm function to see the comparing of collections
 * @param {JSON} obj JSON object, results of the 'get_overview' function
 * @return {Number} The score of the similar movie
 */
function get_score(obj) {

	var director = get_director(obj);

	console.log("Director -> "+director);

	//var screenwriter = get_screenwriter(obj);

	var score = 0;

	if (first_movie.get_director()[0] == director) {
		console.log("--> OK BUDDY");
		score += 3;
	}
	/*
	if (this.screenwriter == screenwriter)
		score += 1;
	*/
	return score;

}

/**
 * Function to get the collection of the first_movie object (<b>ONLY FIRST_MOVIE OBJECT</b>)
 * @return {JSON} JSON object, which represents the collection of the first_movie object, if she exists
 */
function get_collection() {

	var self = this;

	var http_request = make_http_object();

	http_request.open('GET', 'https://api.themoviedb.org/3/collection/'+first_movie.get_collection().id+"?api_key="+api_key, false);

	http_request.send(null);

	if (http_request.readyState == 4 && http_request.status == 200) {
		var obj = eval( '('+http_request.responseText+')');
		return obj;
	}

}

/**
 * Function to validate the form
 * @param  {String} movie A String which represents the movie's name
 * @return {Boolean} True if the form validate, False else
 */
function validate_form(movie) {
	if (movie == null || movie == "") {
		alert("You have to add the name of the movie...");
		return false;
	}
	return true;
}

/**
 * Function to display (or not) the 'save_pdf_file' button
 * @param  {Boolean} bool Boolean which represents the decision to display or not the button
 */
function display_save_file_button(bool) {

	if (bool) {
		document.getElementById("pdf_file").style.display = "inline";
		document.getElementById("pdf_file").setAttribute("class", "pure-button pure-button-primary");
	}
	else {
		document.getElementById("pdf_file").setAttribute("class", "pure-button pure-button-disabled");
		document.getElementById("pdf_file").style.display = "none";
	}

}

/**
 * Function which allows to build/make an http_object<br/>
 * XMLHttpRequest -> Firefox/Chrome/Safari/InternetExplorer(7/8+)<br/>
 * Msxml2 -> Bad Internet Explorer<br/>
 * Microsoft -> Really bad Internet Explorer
 * @throws {Error} If creation of the HTTP request is not possible
 */
function make_http_object() {
  try {return new XMLHttpRequest();}
  catch (error) {}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}

  throw new Error("Creation of the HTTP request object is not OK...");
}

/**
 * Function which allows to do a treatment on the first_movie object<br/>
 * 1st: get the value of the movie (title)<br/>
 * 2nd: check the form (see developer documentation)<br/>
 * 3rd: 
 * <ul>
 * 			<li>IF OK = Init the progress bar + send HTTP request to search the movie in TMDb (see 'send_search_mdb' function in the developer documentation)</li>
 * 			<li>IF NOT OK = hide the 'save_pdf_file' button (see 'display_save_file_button' function in the developer documentation)</li>
 * </ul>
 */
function search_movie() {

	var movie = document.forms["form_search_movie"]["movie_searched"].value;

	if (validate_form(movie)) {
		progress_bar = new progress_bar();
		progress_bar.init_progress_bar();
		send_search_mdb(movie);
	}
	else
		display_save_file_button(false)

}

/**
 * Function which allows to send an HTTP request to have some informations about a movie, from TMDb<br/>
 * When the request is done, the searching about similar movies can begins with 'search_similar_movies' (see developer documentation)
 * @param {String} movie The title of the movie to search
 */
function send_search_mdb(movie) {

	progress_bar.evolve_progress_bar(0.05);

	var http_request = make_http_object();

	http_request.open("GET", "https://api.themoviedb.org/3/search/movie?query="+movie+"&api_key="+api_key, true);

	http_request.setRequestHeader('Accept', 'application/json');

	http_request.onreadystatechange = function () {
		//When it's ready, process the request and display the movie which was input.
  		if (this.readyState === 4 && http_request.status == 200) {
		    progress_bar.evolve_progress_bar(0.10);
		    if (first_movie.process_request_basic(eval( '('+this.responseText+')' ))) {
		    	var crewMovie = get_overview(first_movie.id);
				first_movie.set_overview(crewMovie.overview);
				first_movie.set_director(get_director(crewMovie));
				first_movie.set_collection(crewMovie.belongs_to_collection);
		    	/*if (results_display == "List")
					display_movie_list();*/
				//After that, process with the similar movies
				progress_bar.evolve_progress_bar(0.15);
				similarMoviesTab = new Array();
				search_similar_movies(1);
		    }
		    else {
		    	display_no_movie();
				display_save_file_button(false);
		    }
		}
	};

	http_request.send(JSON.stringify(http_request.responseText));
}

/**
 * Function to display a message, in the results div
 * @param  {String} msg The message to display
 */
function display_msg(msg) {

	if (document.getElementById('msg_waiting') != null)
		document.getElementById('msg_waiting').remove();

	var display_results_node = document.getElementById('display_results');

	var h1 = document.createElement('h1');
	h1.setAttribute('id', 'msg_waiting');

	h1.appendChild(document.createTextNode(msg));

	display_results_node.appendChild(h1);

}

/**
 * Function to display a message, which is <b>there is no movie with the title inputed</b>
 */
function display_no_movie() {

	var display_results_node = document.getElementById('display_results');
	
	remove_all_child(display_results_node);

	var bold = document.createElement('b');

	var msg = document.createTextNode("No movie found...");
	var msgRetry = document.createTextNode("Please to retry with an other title.");

	bold.appendChild(msg);
	bold.appendChild(document.createElement('br'));
	bold.appendChild(msgRetry);
	display_results_node.appendChild(bold);

}

/**
 * Function which allows to display the first_movie object, in the results div
 */
function display_movie_list() {

	var display_results_node = document.getElementById('display_results');

	var bold = document.createElement('b');

	var intro = document.createTextNode("Result:");
	var title = document.createTextNode(first_movie.get_title());
	var date = first_movie.get_year();

	bold.appendChild(intro);
	display_results_node.appendChild(bold);
	display_results_node.appendChild(document.createElement('br'));
	var path_poster = first_movie.get_path_poster();
	if (path_poster != "" && path_poster != null && typeof(path_poster) != "undefined") {
		var poster = document.createElement('a');
		poster.setAttribute('href', 'http://image.tmdb.org/t/p/w300/'+path_poster);
		poster.setAttribute('data-lightbox', 'poster_principle_movie');
		poster.setAttribute('data-title', first_movie.get_overview());
		poster.appendChild(title);
		display_results_node.appendChild(poster);
	}
	else {
		display_results_node.appendChild(title);
	}
	display_results_node.appendChild(document.createElement('br'));
	display_results_node.appendChild(document.createTextNode(""+date+""));
	display_results_node.appendChild(document.createElement('br'));
	display_results_node.appendChild(document.createElement('br'));

}

/**
 *Function which permits to search all of the similar movies of the one inputed
 *@param {Number} page_number Number of the page to search (default: 1), in TMDb
 */
function search_similar_movies(page_number) {

	if (first_movie.get_id() != null) {

		progress_bar.evolve_progress_bar(0.20);

		var tmp_similarMoviesTab = null;

		var http_request = make_http_object();

		http_request.open("GET", "https://api.themoviedb.org/3/movie/"+first_movie.get_id()+"/similar?page="+page_number+"&api_key="+api_key, true);

		http_request.setRequestHeader('Accept', 'application/json');

		http_request.onreadystatechange = function () {
	  		if (this.readyState === 4) {
			    progress_bar.evolve_progress_bar(0.25);
			    tmp_similarMoviesTab = eval( '('+this.responseText+')');
			    similarMoviesTab.push(tmp_similarMoviesTab);
			    if (page_number > 20) {
			    	progress_bar.evolve_progress_bar(0.45);
			    	process_all_similar_movies();
			    	return;
			    }
			    else {
			    	page_number++;
			    	search_similar_movies(page_number);
			    	progress_bar.upgrade_progress_bar();
			    }
			}
		};

		http_request.send(JSON.stringify(http_request.responseText));

	}

}

/**
 * Function which allows to display all the similar movies (after the first_movie displays), in the results div
 */
function process_all_similar_movies() {

	if (similarMoviesTab != null) {

		progress_bar.evolve_progress_bar(0.50);

		reset_all_similar_movies_variables();

		for (var i = 0; i < similarMoviesTab.length; i++) {

			for (var j = 0; j < similarMoviesTab[i].results.length; j++) {

				var similarMovie = new movie_object();

				similarMovie.id = similarMoviesTab[i].results[j].id;
				similarMovie.title = similarMoviesTab[i].results[j].title;
				similarMovie.date = similarMoviesTab[i].results[j].release_date;
				similarMovie.path_poster = similarMoviesTab[i].results[j].poster_path;
				similarMovie.popularity = similarMoviesTab[i].results[j].popularity;
				similarMovie.vote_average = similarMoviesTab[i].results[j].vote_average;
				similarMovie.vote_count = similarMoviesTab[i].results[j].vote_count;

				similarMovies.add_similar_movie_after(similarMovie);

			}

		}

		progress_bar.evolve_progress_bar(0.55);

		perform_algorithm_similarities();

		progress_bar.evolve_progress_bar(0.75);
		
		if (results_display == "List") {
			display_movie_list();
			progress_bar.evolve_progress_bar(0.85);
			display_all_movies_list();
		}
		else
			display_all_movies_graph();

	}

}

/**
 * Algorthm patch<br/>
 * This path permits to have better results for the similar movies<br>
 * He compute, for all similar movies, the score of similarities with the first_movie object by:
 * <ul>
 * 	<li>Affiliations with the same collection</li>
 * 	<li>The vote average (>7 to keep a movie by default)</li>
 * 	<li>Clean all duplicates</li>
 * </ul>
 */
function perform_algorithm_similarities () {

	number_similar_movies_obtains = 0;

	if (first_movie.get_collection() != null) {
		var collection = get_collection(first_movie.get_collection());
		
		for (var i = 0; i < collection.parts.length; i++) {

			if (collection.parts[i].title != first_movie.get_title()) {

				var similarMovie = new movie_object();

				similarMovie.set_id(collection.parts[i].id);
				similarMovie.set_title(collection.parts[i].title);
				similarMovie.set_date(collection.parts[i].release_date);
				similarMovie.set_path_poster(collection.parts[i].poster_path);
				similarMovie.set_popularity(collection.parts[i].popularity);
				similarMovie.set_vote_average(collection.parts[i].vote_average);
				similarMovie.set_vote_count(collection.parts[i].vote_count);

				similarMovie.set_score(6);

				similarMovies.add_similar_movie_before(similarMovie);

			}

		}
	}

	for (var i = 0; i < similarMovies.get_length(); i++) {

		if (parseInt(similarMovies.get_similar_movie_position(i).get_vote_average()) < 7) {
			similarMovies.remove_similar_movie_position(i);
		}

	}

	//Delete all duplications here
	similarMovies.clean_duplicates();

	number_similar_movies_obtains = similarMovies.get_length();

	if (results_display == "Graph") {
		for (var i = 0; i < similarMovies.get_length(); i++) {

			var objOverview = get_overview(similarMovies.get_similar_movie_position(i).get_id());

			similarMovies.get_similar_movie_position(i).set_overview(objOverview.overview);

			similarMovies.get_similar_movie_position(i).set_director(get_director(objOverview));

			similarMovies.get_similar_movie_position(i).set_score(similarMovies.get_similar_movie_position(i).get_score() += get_score(objOverview));

		}

		similarMovies.sort(function(a,b) {if (a.score < b.score) return 1; if (a.score > b.score) return -1; return 0});
	}

}

/**
 * Function to add the overview of the movie at position i
 * @param {Number} i The position of the movie, to add overview
 */
function addOverviewTo(i) {

	var similarObject = get_overview(similarMovies.get_similar_movie_position(i).get_id());

	similarMovies.get_similar_movie_position(i).set_overview(similarObject.overview);
	similarMovies.get_similar_movie_position(i).set_director(get_director(similarObject));

}

/**
 * Function to display all movies in a graph<br/>
 * BUILDING
 */
function display_all_movies_graph () {

	display_msg("Building! Still alpha...");

}

/**
 * Function which allows to display all the similar movies, after the first movie results, in the results div
 */
function display_all_movies_list() {

	var display_results_node = document.getElementById('display_results');

	var center = document.createElement('center');
	var h3 = document.createElement('h3');
	var table = document.createElement('table');
	var caption = document.createElement('caption');
	var th = document.createElement('th');
	var tr = document.createElement('tr');
	var td = document.createElement('td');

	var intro = document.createTextNode("Similar movies ("+number_similar_movies_obtains+"): ");

	h3.appendChild(intro);
	caption.appendChild(h3);
	table.appendChild(caption);
	th.style.textAlign = 'left';
	th.appendChild(document.createTextNode("Title"));
	table.appendChild(th);
	th = document.createElement('th');
	th.style.textAlign = 'left';
	th.appendChild(document.createTextNode("Release date"));
	table.appendChild(th);
	for (var i = 0; i < (number_similar_movies > number_similar_movies_obtains? number_similar_movies_obtains : number_similar_movies); i++) {
		tr = document.createElement('tr');
		td = document.createElement('td');
		var title = similarMovies.get_similar_movie_position(i).get_title();
		var path_poster = similarMovies.get_similar_movie_position(i).get_path_poster();
		if (path_poster != "" && path_poster != null && typeof(path_poster) != "undefined") {
			var poster = document.createElement('a');
			poster.setAttribute('href', 'http://image.tmdb.org/t/p/w300/'+path_poster);
			poster.setAttribute('onclick', addOverviewTo(i));
			poster.setAttribute('data-lightbox', 'poster_similar_movie');
			poster.setAttribute('data-title', similarMovies.get_similar_movie_position(i).get_overview());
			poster.appendChild(document.createTextNode(title));
			td.appendChild(poster);
		}
		else {
			td.appendChild(document.createTextNode(title));
		}
		tr.appendChild(td);
		td = document.createElement('td');
		if (typeof(similarMovies.get_similar_movie_position(i).get_date()) != "undefined" && similarMovies.get_similar_movie_position(i).get_date() != null) {
			var date = similarMovies.get_similar_movie_position(i).get_date().split("-");
			td.appendChild(document.createTextNode(date[0]));
		}
		tr.appendChild(td);
		table.appendChild(tr);
	}

	center.appendChild(table);

	display_results_node.appendChild(center);

	display_save_file_button;

	progress_bar.clean_progress_bar();

}