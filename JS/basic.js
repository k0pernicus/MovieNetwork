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
function validate_form (movie, api_key) {
	if (movie == null || movie == "") {
		alert("You have to add the name of the movie...");
		return false;
	}
	if (api_key == null || api_key == "") {
		alert("Your api_key is null -> Please to enter your Movie Database api_key...");
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
function send_search_omdb (movie) {
	var http_request = make_http_object();
	http_request.open("GET", "http://www.omdbapi.com/?t="+movie, false);
	http_request.send(null);

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

	var movie = document.forms["form_search_movie"]["movie_searched"].value;

	if (validate_form(movie)) {
		var request = send_search_omdb(movie);
		process_search_omdb(request);
	}
}