var tabMovie = null;
var interval;
var number_similar_movies = 20;
var results_display = null;
var api_key = "f5dbc30b9b6055d3e85d063550790802";
var bool_entry = false;
var number_similar_movies_obtains = 0;

var first_movie = new first_movie();
var similarMoviesTab = new Array();
var similarMovies = new Array();

/*
Predictive action (for movie title search only)
*/
$(function(){
var suggestions = [];
$( "#movie_searched" ).autocomplete({
	minLength: 2,
	scrollHeight: 220, 
	source: function(req, add){
		$.ajax({
		url:'https://api.themoviedb.org/3/search/movie?api_key=f5dbc30b9b6055d3e85d063550790802&',
		type:"get",
		dataType: 'json',
		data: 'query='+req.term,
		async: true,
		cache: true,
		success: function(data){
			data = data.results;
			add($.map(data, function(item, i) {
	                return {
	                    title : item.title,
	                    date : item.release_date.split('-')[0]
	                }
            }));
        }
    });
    },
    focus : function(event, ui) {
        $(this).val(ui.item.title);
        return false;
    },
}).data("ui-autocomplete")._renderItem = function (ul, item) {
    return $("<li></li>").data("item.autocomplete", item).attr("id", "list_choice_movie").append(item.title+" ("+item.date+")").on('click', function(e) {$( "#movie_searched" ).val(item.title);}).appendTo(ul.addClass('list-row'));
};
});

$('#submit_search').click(function()
{
	remove_all_display_results();
	number_similar_movies = $("#number_movies_listed").val();
	results_display = $('input[name=how_to_display_results]:checked', '#form_search_movie').val();
	reset_all_variables();
	search_movie();
    return false;
});

$('#reset_search').click(function()
{
	remove_all_display_results();
	display_save_file_button(false);
});

$('#save_pdf_file').click(function()
{
	save_pdf_file(first_movie, number_similar_movies, number_similar_movies_obtains, similarMovies);
})

/*
Functions
*/

function reset_all_variables () {

	tabMovie = null;
	bool_entry = false;
	number_similar_movies_obtains = 0;
	first_movie.reset();

}

function reset_all_similar_movies_variables () {

	similarMovies = new Array();

}


function remove_all_child (document) {

	while (document.firstChild)
    	document.removeChild(document.firstChild);	

}

function remove_all_display_results () {

	var display_results_node = document.getElementById('display_results');
	remove_all_child(display_results_node);

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

function display_save_file_button (bool) {

	if (bool) {
		document.getElementById("save_pdf_file").style.display = "inline";
		document.getElementById("save_pdf_file").setAttribute("class", "pure-button pure-button-primary");
	}
	else {
		document.getElementById("save_pdf_file").setAttribute("class", "pure-button pure-button-disabled");
		document.getElementById("save_pdf_file").style.display = "none";
	}

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
Function which allows to validate form, search in the mdb database the movie, and give us the result 
*/
function search_movie () {

	var movie = document.forms["form_search_movie"]["movie_searched"].value;

	if (validate_form(movie)) {
		send_search_mdb(movie);
		process_request_and_search_similar_movies();
	}
	else
		display_save_file_button(false)

}

function process_request_and_search_similar_movies () {

	// -> process the input movie
	if (process_request()) {
		if (results_display == "List")
			display_movie_list();
	}
	else
		return;
	// -> process the similar movies
	search_similar_movies(1);

}

/*
Function which allows to search in the Movie Database the movie giving in parameter
*/
function send_search_mdb (movie) {
	var http_request = make_http_object();

	http_request.open("GET", "https://api.themoviedb.org/3/search/movie?query="+movie+"&api_key="+api_key, false);

	http_request.setRequestHeader('Accept', 'application/json');

	http_request.onreadystatechange = function () {
  		if (this.readyState === 4 && http_request.status == 200) {
		    tabMovie = eval( '('+this.responseText+')' );
		}
	};

	http_request.send(JSON.stringify(http_request.responseText));
}

/*
Function which allows to process the request -> search the movie into the tab (default 0), extract name, date, etc...
*/
function process_request () {

	if (tabMovie.results.length != 0) {
		interval = clearInterval(interval);
		first_movie.set_id(tabMovie.results[0].id);
		first_movie.set_title(tabMovie.results[0].title);
		first_movie.set_date(tabMovie.results[0].release_date);
		first_movie.set_path_poster(tabMovie.results[0].poster_path);
		first_movie.set_popularity(tabMovie.results[0].popularity);
		first_movie.set_vote_average(tabMovie.results[0].vote_average);
		first_movie.set_vote_count(tabMovie.results[0].vote_count);

		/*Get crew + overview*/
		var crewMovie = get_overview(first_movie.id);
		first_movie.set_overview(crewMovie.overview);
		first_movie.set_director(get_director(crewMovie));
		first_movie.set_collection(crewMovie.belongs_to_collection);

		/*Function OK*/
		return true;
	}
	else {
		display_no_movie();
		display_save_file_button(false);
		return false;
	}

}

function get_overview (id) {

	var self = this;

	var http_request = make_http_object();

	http_request.open("GET", "https://api.themoviedb.org/3/movie/"+id+"?append_to_response=credits&api_key="+api_key, false);

	http_request.send(null/*JSON.stringify(http_request.responseText)*/);

	if (http_request.readyState == 4 && http_request.status == 200) {
		var obj = eval( '('+http_request.responseText+')');
		return obj;
	}

}

function get_director (object) {

	var tabDirector = new Array();

	var crew = object.credits.crew;

	for (var i=0; i < crew.length; i++) {

		if (crew[i].job == "Director")
			tabDirector.push(crew[i].name);

	}

	return tabDirector;

}

function get_score (obj) {

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

function get_collection () {

	var self = this;

	var http_request = make_http_object();

	http_request.open('GET', 'https://api.themoviedb.org/3/collection/'+first_movie.get_collection().id+"?api_key="+api_key, false);

	http_request.send(null);

	if (http_request.readyState == 4 && http_request.status == 200) {
		var obj = eval( '('+http_request.responseText+')');
		return obj;
	}

}

function display_msg (msg) {

	if (document.getElementById('msg_waiting') != null)
		document.getElementById('msg_waiting').remove();

	var display_results_node = document.getElementById('display_results');

	var h1 = document.createElement('h1');
	h1.setAttribute('id', 'msg_waiting');

	h1.appendChild(document.createTextNode(msg));

	display_results_node.appendChild(h1);

}

function display_no_movie () {

	interval = clearInterval(interval);

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

function display_movie_list () {

	var display_results_node = document.getElementById('display_results');

	remove_all_child(display_results_node);

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

	display_msg("Computing! Please wait...");

}

/*
Function which permits to search all of the similar movies of the input
param page_number -> number of the page to search (default: 1)
*/
function search_similar_movies (page_number) {

	if (first_movie.get_id() != null) {

		interval = clearInterval(interval);

		var tmp_similarMoviesTab = null;

		var http_request = make_http_object();

		http_request.open("GET", "https://api.themoviedb.org/3/movie/"+first_movie.get_id()+"/similar?page="+page_number+"&api_key="+api_key);

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

		display_msg("Processing! Please wait...");

		for (var i = 0; i < similarMoviesTab.length; i++) {

			for (var j = 0; j < similarMoviesTab[i].results.length; j++) {

				var similarMovie = new similar_movie();

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
		
		if (results_display == "List")
			display_all_movies_list();
		else
			display_all_movies_graph();

		display_save_file_button(true);

	}

}

function cleanDuplicates (array) {

	var cache = {};
	array = array.filter(function(elem,index,array){
		return cache[elem.id]?0:cache[elem.id]=1;
	});

	return array;

}

/*Algorithm patch*/
function perform_algorithm_similarities () {

	display_msg("Performing! Please wait...");

	number_similar_movies_obtains = 0;

	var bestSimilarMovies = new Array();

	if (first_movie.get_collection() != null) {
		var collection = get_collection(first_movie.get_collection());
		
		for (var i = 0; i < collection.parts.length; i++) {

			if (collection.parts[i].title != first_movie.get_title()) {

				var similarMovie = new similar_movie();

				similarMovie.id = collection.parts[i].id;
				similarMovie.title = collection.parts[i].title;
				similarMovie.date = collection.parts[i].release_date;
				similarMovie.path_poster = collection.parts[i].poster_path;
				similarMovie.popularity = collection.parts[i].popularity;
				similarMovie.vote_average = collection.parts[i].vote_average;
				similarMovie.vote_count = collection.parts[i].vote_count;

				similarMovie.score += 6;

				bestSimilarMovies.push(similarMovie);

				number_similar_movies_obtains++;

			}

		}
	}

	if (results_display == "List")
		bestSimilarMovies.sort(function(a,b) {if (a.date < b.date) return -1; if (a.date > b.date) return 1; return 0});

	for (var i = 0; i < similarMovies.length; i++) {

		if (parseInt(similarMovies[i].vote_average) >= 7) {
			bestSimilarMovies.push(similarMovies[i]);
			similarMovies.splice(i, 1);
			number_similar_movies_obtains++;
		}

	}

	//Delete all duplications here
	similarMovies = cleanDuplicates(bestSimilarMovies);

	if (results_display == "Graph") {
		for (var i = 0; i < bestSimilarMovies.length; i++) {

			var objOverview = get_overview(bestSimilarMovies[i].id);

			bestSimilarMovies[i].overview = objOverview.overview;

			bestSimilarMovies[i].director = get_director(objOverview);

			bestSimilarMovies[i].score += get_score(objOverview);

		}

		bestSimilarMovies.sort(function(a,b) {if (a.score < b.score) return 1; if (a.score > b.score) return -1; return 0});
	}

	display_msg("Finishing...");

}

function addOverviewTo(i) {

	var similarObject = get_overview(similarMovies[i].id);

	similarMovies[i].overview = similarObject.overview;
	similarMovies[i].director = get_director(similarObject);

}

function display_all_movies_graph () {

	display_msg("Building! Still alpha...");

}

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
		var title = similarMovies[i].title;
		var path_poster = similarMovies[i].path_poster;
		if (path_poster != "" && path_poster != null && typeof(path_poster) != "undefined") {
			var poster = document.createElement('a');
			poster.setAttribute('href', 'http://image.tmdb.org/t/p/w300/'+similarMovies[i].path_poster);
			poster.setAttribute('onclick', addOverviewTo(i));
			poster.setAttribute('data-lightbox', 'poster_similar_movie');
			poster.setAttribute('data-title', similarMovies[i].overview);
			poster.appendChild(document.createTextNode(title));
			td.appendChild(poster);
		}
		else {
			td.appendChild(document.createTextNode(title));
		}
		tr.appendChild(td);
		td = document.createElement('td');
		if (typeof(similarMovies[i].date) != "undefined" && similarMovies[i].date != null) {
			var date = similarMovies[i].date.split("-");
			td.appendChild(document.createTextNode(date[0]));
		}
		tr.appendChild(td);
		table.appendChild(tr);
	}

	center.appendChild(table);

	document.getElementById("msg_waiting").remove();

	display_results_node.appendChild(center);

}