this.request = null;
var tabMovie = null;
var similarMovies = null;
var interval;
var api_key = "<?php echo $apikey; ?>";

this.imdbID = null;
this.titleM = null;
this.date = null;
this.popularity = null;
this.vote_average = null;
this.vote_count = null;

$('#submit_search').click(function()
{
    search_movie();
    return false;
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
Function which allows to search in the OMDB database the movie giving in parameter
*/
function send_search_mdb (movie) {
	var http_request = make_http_object();

	http_request.open("GET", "https://api.themoviedb.org/3/search/movie?query="+movie+"&api_key="+api_key);

	http_request.setRequestHeader('Accept', 'application/json');

	return http_request;
}

/*
Function which allows to process the request of 'send_search_omdb'
*/
function process_search_omdb (request) {

	request.onreadystatechange = function () {
  		if (this.readyState === 4) {
		    console.log('Status:', this.status);
		    console.log('Headers:', this.getAllResponseHeaders());
		    console.log('Body:', this.responseText);

		}
	};

	request.send(JSON.stringify(request.responseText));

}

/*
Function which allows to validate form, search in the OMDB database the movie, and give us the result 
*/
function search_movie () {

	var api_key = document.forms["form_search_movie"]["user_api_key"].value;

	var movie = document.forms["form_search_movie"]["movie_searched"].value;

	if (validate_form(movie)) {
		this.request = send_search_mdb(movie);
		process_search_mdb();
		interval = setInterval("process_request_and_search_similar_movies()", 1000);
	}
}