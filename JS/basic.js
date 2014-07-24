var tabMovie = null;
var similarMovies = null;
var interval;
var api_key = "";
var bool_entry = false;

this.imdbID = null;
this.titleM = null;
this.date = null;
this.popularity = null;
this.vote_average = null;
this.vote_count = null;

this.similarMovies_imdbID = new Array();
this.similarMovies_title = new Array();
this.similarMovies_date = new Array();
this.similarMovies_popularity = new Array();
this.similarMovies_vote_average = new Array();
this.similarMovies_vote_count = new Array();

$('#submit_search').click(function()
{
    search_movie();
    return false;
});

$('#reset_search').click(function()
{
	var display_results_node = document.getElementById('display_results');
	remove_all_child(display_results_node);
});

/*
Function which allows to hide or display the input_movie form
*/
function hide_and_display_new_movie () {

	var form_input_movie = document.getElementById("form_input_movie");

	if (form_input_movie.style.display == "none")
		form_input_movie.style.display = "block";
	else
		form_input_movie.style.display = "none";

	console.log(form_input_movie.style.display);

}

function reset_all_similar_movies_variables () {

	this.similarMovies_imdbID = new Array();
	this.similarMovies_title = new Array();
	this.similarMovies_date = new Array();
	this.similarMovies_popularity = new Array();
	this.similarMovies_vote_average = new Array();
	this.similarMovies_vote_count = new Array();

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
		    console.log('Status:', this.status);
		    console.log('Headers:', this.getAllResponseHeaders());
		    console.log('Body:', this.responseText);
		    tabMovie = eval( '('+this.responseText+')');
		}
	};

	http_request.send(JSON.stringify(http_request.responseText));
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
	var date = document.createTextNode(this.date);

	bold.appendChild(intro);
	display_results_node.appendChild(bold);
	display_results_node.appendChild(document.createElement('br'));
	display_results_node.appendChild(title);
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

	var intro = document.createTextNode("Similar movies:");

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
	for (var i = 0; i < similarMovies_title.length; i++) {
		tr = document.createElement('tr');
		td = document.createElement('td');
		td.appendChild(document.createTextNode(similarMovies_title[i]));
		tr.appendChild(td);
		td = document.createElement('td');
		td.appendChild(document.createTextNode(similarMovies_date[i]));
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

	if (tabMovie != null)
		process_request();
	if (this.imdbID != null)
		search_similar_movies();

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
		this.popularity = tabMovie.results[0].popularity;
		this.vote_average = tabMovie.results[0].vote_average;
		this.vote_count = tabMovie.results[0].vote_count;

		display_movie();
	}
	else
		display_no_movie();

}

/*
Function which permits to search all of the similar movies of the input
*/
function search_similar_movies () {

	if (this.imdbID != null) {

		interval = clearInterval(interval);

		var http_request = make_http_object();

		http_request.open("GET", "https://api.themoviedb.org/3/movie/"+this.imdbID+"/similar?api_key="+api_key);

		http_request.setRequestHeader('Accept', 'application/json');

		http_request.onreadystatechange = function () {
	  		if (this.readyState === 4) {
			    console.log('Status:', this.status);
			    console.log('Headers:', this.getAllResponseHeaders());
			    console.log('Body:', this.responseText);
			    similarMovies = eval( '('+this.responseText+')');
			}
		};

		http_request.send(JSON.stringify(http_request.responseText));

		setInterval("process_all_similar_movies()", 500);

		bool_entry = false;

	}

}

function process_all_similar_movies () {

	if (similarMovies != null && bool_entry == false) {

		bool_entry = true;

		reset_all_similar_movies_variables();

		for (var i = 0; i < similarMovies.results.length; i++) {

			this.similarMovies_imdbID.push(similarMovies.results[i].id);
			this.similarMovies_title.push(similarMovies.results[i].title);
			this.similarMovies_date.push(similarMovies.results[i].release_date);
			this.similarMovies_popularity.push(similarMovies.results[i].popularity);
			this.similarMovies_vote_average.push(similarMovies.results[i].vote_average);
			this.similarMovies_vote_count.push(similarMovies.results[i].vote_count);

		}

		display_all_movies();

	}

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