var tabMovie = null;
var similarMoviesTab = new Array();
var interval;
var number_similar_movies = 20;
var api_key = "f5dbc30b9b6055d3e85d063550790802";
var bool_entry = false;
var number_similar_movies_obtains = 0;

this.imdbID = null;
this.titleM = null;
this.path_poster = null;
this.date = null;
this.popularity = null;
this.vote_average = null;
this.vote_count = null;
this.overview = null;

/*
Array of similar movies
*/
this.similarMovies = new Array();

/*
Object to represent a similar movie
*/
function similarMovie_object() {
	this.id = null;
	this.title = null;
	this.date = null;
	this.path_poster = null;
	this.popularity = null;
	this.vote_average = null;
	this.vote_count = null;
	this.overview = null;
}

$('#submit_search').click(function()
{
	number_similar_movies = $("#number_movies_listed").val();
	search_movie();
    return false;
});

$('#reset_search').click(function()
{
	var display_results_node = document.getElementById('display_results');
	remove_all_child(display_results_node);
});

function reset_all_similar_movies_variables () {

	this.similarMovies = new Array();

}

/*
Function which allows to validate a form
*/
function validate_form (movie) {
	if (movie == null || movie == "") {
		alert("You have to add the name of the movie...");
		return false;
	}
	return true;
}

/*
Function which allows to build/make an http_object
XMLHttpRequest -> Firefox/Chrome/Safari/InternetExplorer(7/8+)
Msxml2 -> Bad Internet Explorer
Microsoft -> Really bad Internet Explorer
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

/*
Function which allows to search in the Movie Database the movie giving in parameter
*/
function send_search_mdb (movie) {
	var http_request = make_http_object();

	http_request.open("GET", "https://api.themoviedb.org/3/search/movie?query="+movie+"&api_key="+api_key);

	http_request.setRequestHeader('Accept', 'application/json');

	http_request.onreadystatechange = function () {
  		if (this.readyState === 4) {
		    tabMovie = eval( '('+this.responseText+')');
		}
	};

	http_request.send(JSON.stringify(http_request.responseText));
}

function get_overview (id) {

	var self = this;

	var http_request = make_http_object();

	http_request.open("GET", "https://api.themoviedb.org/3/movie/"+id+"?api_key="+api_key, false);

	http_request.send(null/*JSON.stringify(http_request.responseText)*/);

	if (http_request.readyState == 4) {
		var obj = eval( '('+http_request.responseText+')');
		return obj.overview;
	}

}

function remove_all_child (document) {

	while (document.firstChild)
    	document.removeChild(document.firstChild);	

}

function display_movie () {

	var display_results_node = document.getElementById('display_results');
	remove_all_child(display_results_node);

	var bold = document.createElement('b');

	var intro = document.createTextNode("Result:");
	var title = document.createTextNode(this.titleM);
	var year = this.date.split("-");
	var date = document.createTextNode(year[0]);

	bold.appendChild(intro);
	display_results_node.appendChild(bold);
	display_results_node.appendChild(document.createElement('br'));
	if (this.path_poster != "" && this.path_poster != null && typeof(this.path_poster) != "undefined") {
		var poster = document.createElement('a');
		poster.setAttribute('href', 'http://image.tmdb.org/t/p/w300/'+this.path_poster);
		poster.setAttribute('onclick', "refresh_overview(); return false;");
		poster.setAttribute('data-lightbox', 'poster_principle_movie');
		poster.setAttribute('data-title', this.overview);
		poster.appendChild(title);
		display_results_node.appendChild(poster);
	}
	else {
		display_results_node.appendChild(title);
	}
	display_results_node.appendChild(document.createElement('br'));
	display_results_node.appendChild(date);
	display_results_node.appendChild(document.createElement('br'));
	display_results_node.appendChild(document.createElement('br'));

}

function display_all_movies() {

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
		var title = this.similarMovies[i].title;
		var path_poster = this.similarMovies[i].path_poster;
		if (path_poster != "" && path_poster != null && typeof(path_poster) != "undefined") {
			var poster = document.createElement('a');
			poster.setAttribute('href', 'http://image.tmdb.org/t/p/w300/'+this.similarMovies[i].path_poster);
			poster.setAttribute('data-lightbox', 'poster_similar_movie');
			poster.setAttribute('data-title', this.similarMovies[i].overview);
			poster.appendChild(document.createTextNode(title));
			td.appendChild(poster);
		}
		else {
			td.appendChild(document.createTextNode(title));
		}
		tr.appendChild(td);
		td = document.createElement('td');
		if (typeof(this.similarMovies[i].date) != "undefined" && this.similarMovies[i].date != null) {
			var date = this.similarMovies[i].date.split("-");
			td.appendChild(document.createTextNode(date[0]));
		}
		tr.appendChild(td);
		table.appendChild(tr);
	}

	center.appendChild(table);

	display_results_node.appendChild(center);

}

function display_no_movie () {

	var display_results_node = document.getElementById('display_results');
	remove_all_child(display_results_node);

	var bold = document.createElement('b');

	var msg = document.createTextNode("No movie found...");
	var msgRetry = document.createTextNode("Please to retry with an other title.");

	bold.appendChild(msg);
	bold.appendChild(document.createElement('br'));
	bold.appendChild(msgRetry);
	display_results_node.appendChild(bold);

	return;

}


function process_request_and_search_similar_movies () {

	if (tabMovie != null) {
		process_request();
		display_movie();
	}
	if (this.imdbID != null) {
		this.similarMoviesTab = new Array();
		search_similar_movies(1);
	}

}

/*
Function which allows to process the request -> search the movie into the tab (default 0), extract name, date, etc...
*/
function process_request () {

	if (tabMovie.results.length != 0) {
		interval = clearInterval(interval);
		this.imdbID = tabMovie.results[0].id;
		this.titleM = tabMovie.results[0].title;
		this.date = tabMovie.results[0].release_date;
		this.path_poster = tabMovie.results[0].poster_path;
		this.popularity = tabMovie.results[0].popularity;
		this.vote_average = tabMovie.results[0].vote_average;
		this.vote_count = tabMovie.results[0].vote_count;

		this.overview = get_overview(this.imdbID);
	}
	else
		display_no_movie();

}

/*
Function which permits to search all of the similar movies of the input
param page_number -> number of the page to search (default: 1)
*/
function search_similar_movies (page_number) {

	if (this.imdbID != null) {

		interval = clearInterval(interval);

		var tmp_similarMoviesTab = null;

		var http_request = make_http_object();

		http_request.open("GET", "https://api.themoviedb.org/3/movie/"+this.imdbID+"/similar?page="+page_number+"&api_key="+api_key);

		http_request.setRequestHeader('Accept', 'application/json');

		http_request.onreadystatechange = function () {
	  		if (this.readyState === 4) {
			    tmp_similarMoviesTab = eval( '('+this.responseText+')');
			    similarMoviesTab.push(tmp_similarMoviesTab);
			    if (page_number > 20) {
			    	process_all_similar_movies();
			    	return;
			    }
			    else {
			    	page_number++;
			    	search_similar_movies(page_number);
			    }
			}
		};

		http_request.send(JSON.stringify(http_request.responseText));

		bool_entry = false;

	}

}

function process_all_similar_movies () {

	if (similarMoviesTab != null && bool_entry == false) {

		bool_entry = true;

		reset_all_similar_movies_variables();

		for (var i = 0; i < similarMoviesTab.length; i++) {

			for (var j = 0; j < similarMoviesTab[i].results.length; j++) {

				var similarMovie = new similarMovie_object();

				similarMovie.id = similarMoviesTab[i].results[j].id;
				similarMovie.title = similarMoviesTab[i].results[j].title;
				similarMovie.date = similarMoviesTab[i].results[j].release_date;
				similarMovie.path_poster = similarMoviesTab[i].results[j].poster_path;
				similarMovie.popularity = similarMoviesTab[i].results[j].popularity;
				similarMovie.vote_average = similarMoviesTab[i].results[j].vote_average;
				similarMovie.vote_count = similarMoviesTab[i].results[j].vote_count;
				
				this.similarMovies.push(similarMovie);

			}

		}

		perform_algorithm_similarities();
		
		display_all_movies();

	}

}

function perform_algorithm_similarities () {

	number_similar_movies_obtains = 0;

	var bestSimilarMovies = new Array();

	var first_part_title = this.titleM.split(' ')[0];

	for (var i = 0; i < this.tabMovie.results.length; i++) {

		if (((this.tabMovie.results[i].title.indexOf(first_part_title) == 0) || (this.titleM.indexOf(this.tabMovie.results[i].title) == 0)) && ((this.titleM != this.tabMovie.results[i].title) || (this.date != this.tabMovie.results[i].release_date))) {

			var similarMovie = new similarMovie_object();

			similarMovie.id = this.tabMovie.results[i].id;
			similarMovie.title = this.tabMovie.results[i].title;
			similarMovie.date = this.tabMovie.results[i].release_date;
			similarMovie.path_poster = this.tabMovie.results[i].poster_path;
			similarMovie.popularity = this.tabMovie.results[i].popularity;
			similarMovie.vote_average = this.tabMovie.results[i].vote_average;
			similarMovie.vote_count = this.tabMovie.results[i].vote_count;

			similarMovie.overview = get_overview(similarMovie.id);

			bestSimilarMovies.push(similarMovie);

			this.tabMovie.results.slice(i, 1);

			number_similar_movies_obtains++;
		}

	}

	bestSimilarMovies.sort(function(a,b) {if (a.title < b.title) return -1; if (a.title > b.title) return 1; return 0});

	for (var i = 0; i < this.tabMovie.results.length; i++) {

		if ((this.tabMovie.results[i].title.indexOf(this.titleM) > 0) || (this.titleM.indexOf(this.tabMovie.results[i].title) > 0)) {
			
			var similarMovie = new similarMovie_object();

			similarMovie.id = this.tabMovie.results[i].id;
			similarMovie.title = this.tabMovie.results[i].title;
			similarMovie.date = this.tabMovie.results[i].release_date;
			similarMovie.path_poster = this.tabMovie.results[i].poster_path;
			similarMovie.popularity = this.tabMovie.results[i].popularity;
			similarMovie.vote_average = this.tabMovie.results[i].vote_average;
			similarMovie.vote_count = this.tabMovie.results[i].vote_count;

			similarMovie.overview = get_overview(similarMovie.id);

			bestSimilarMovies.push(similarMovie);

			number_similar_movies_obtains++;
		}

	}

	for (var i = 0; i < this.similarMovies.length; i++) {

		if ((this.similarMovies[i].title.indexOf(this.titleM) >= 0) || (this.titleM.indexOf(this.similarMovies[i].title) >= 0)) {
			this.similarMovies[i].overview = get_overview(this.similarMovies[i].id);
			bestSimilarMovies.push(this.similarMovies[i]);
			this.similarMovies.splice(i, 1);
			number_similar_movies_obtains++;
		}
		else {
			if (parseInt(this.similarMovies[i].vote_average) >= 7) {
			this.similarMovies[i].overview = get_overview(this.similarMovies[i].id);
			bestSimilarMovies.push(this.similarMovies[i]);
			this.similarMovies.splice(i, 1);
			number_similar_movies_obtains++;
			}
		}

	}

	this.similarMovies = bestSimilarMovies;

}

/*
Function which allows to validate form, search in the mdb database the movie, and give us the result 
*/
function search_movie () {

	var movie = document.forms["form_search_movie"]["movie_searched"].value;

	if (validate_form(movie)) {
		send_search_mdb(movie);
		interval = setInterval("process_request_and_search_similar_movies()", 500);
	}

}