var tabMovie = null;
var similarMoviesTab = new Array();
var interval;
var number_similar_movies = 20;
var results_display = null;
var api_key = "";
var bool_entry = false;
var number_similar_movies_obtains = 0;

this.id = null;
this.title = null;
this.date = null;
this.path_poster = null;
this.popularity = null;
this.vote_average = null;
this.vote_count = null;
this.overview = null;

/*
Array of similar movies
*/
var similarMovies = new Array();

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

/*
Graph variables
*/
var height = 500;
var width = 500;
var coordinates = {
	x : 0,
	y : 0
};
var zoom = 1.0;
var xScale = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);
var yScale = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);
var zoomScale = d3.scale.linear()
    .domain([1,6])
    .range([1,6])
    .clamp(true);
var d3force = null;

/*
Actions
*/

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
		url:'https://api.themoviedb.org/3/search/movie?api_key=API_KEY&',
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
    return $("<li></li>").data("item.autocomplete", item).attr("id", "list_choice_movie").append("<b>"+item.title+"</b> ("+item.date+")").on('click', function(e) {$( "#movie_searched" ).val(item.title);}).appendTo(ul.addClass('list-row'));
};
});

$('#submit_search').click(function()
{
	number_similar_movies = $("#number_movies_listed").val();
	results_display = $('input[name=how_to_display_results]:checked', '#form_search_movie').val();
	reset_all_variables();
	search_movie();
    return false;
});

$('#reset_search').click(function()
{
	var display_results_node = document.getElementById('display_results');
	remove_all_child(display_results_node);
});

$('#save_pdf_file').click(function()
{
	save_pdf_file();
})

/*
Functions
*/

function reset_all_variables () {

	tabMovie = null;
	bool_entry = false;
	number_similar_movies_obtains = 0;
	this.id = null;
	this.title = null;
	this.path_poster = null;
	this.date = null;
	this.popularity = null;
	this.vote_average = null;
	this.vote_count = null;
	this.overview = null;

	height = 500;
	width = 500;
	coordinates = {
	x : 0,
	y : 0
	};
	zoom = 1.0;
	d3force = null;

}

function reset_all_similar_movies_variables () {

	similarMovies = new Array();

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

	if (bool)
		document.getElementById("save_pdf_file").setAttribute("class", "pure-button pure-button-primary");
	else
		document.getElementById("save_pdf_file").setAttribute("class", "pure-button pure-button-disabled");

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
		interval = setInterval("process_request_and_search_similar_movies()", 500);
	}
	else
		display_save_file_button(false)

}

function process_request_and_search_similar_movies () {

	if (tabMovie != null) {
		if (process_request()) {
			if (results_display == "List")
				display_movie_list();
		}
	}
	if (this.id != null) {
		this.similarMoviesTab = new Array();
		search_similar_movies(1);
	}

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
		this.id = tabMovie.results[0].id;
		this.title = tabMovie.results[0].title;
		this.date = tabMovie.results[0].release_date;
		this.path_poster = tabMovie.results[0].poster_path;
		this.popularity = tabMovie.results[0].popularity;
		this.vote_average = tabMovie.results[0].vote_average;
		this.vote_count = tabMovie.results[0].vote_count;

		this.overview = get_overview(this.id);

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

	http_request.open("GET", "https://api.themoviedb.org/3/movie/"+id+"?api_key="+api_key, false);

	http_request.send(null/*JSON.stringify(http_request.responseText)*/);

	if (http_request.readyState == 4 && http_request.status == 200) {
		var obj = eval( '('+http_request.responseText+')');
		return obj.overview;
	}

}

function remove_all_child (document) {

	while (document.firstChild)
    	document.removeChild(document.firstChild);	

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
	var title = document.createTextNode(this.title);
	var year = this.date.split("-");
	var date = document.createTextNode(year[0]);

	bold.appendChild(intro);
	display_results_node.appendChild(bold);
	display_results_node.appendChild(document.createElement('br'));
	if (this.path_poster != "" && this.path_poster != null && typeof(this.path_poster) != "undefined") {
		var poster = document.createElement('a');
		poster.setAttribute('href', 'http://image.tmdb.org/t/p/w300/'+this.path_poster);
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

	display_msg("Computing! Please wait...");

}

function display_all_movies_graph () {

	display_msg("Building! Still alpha...");

	/*

	force = d3.layout.force()
    			.charge(-320)
    			.size( [width, height] )
    			.linkStrength( function(d,idx) { return d.weight; } );

	var svg = d3.select('#display_results')
				.append('svg:svg')
				.attr('xmlns','http://www.w3.org/2000/svg')
			    .attr("width", width)
			    .attr("height", height)
			    .attr("id","graph_vizu")
			    .attr("viewBox", "0 0 " + width + " " + height )
			    .attr("preserveAspectRatio", "xMidYMid meet");

	d3.json(

	)
*/

}

/*
Function which permits to search all of the similar movies of the input
param page_number -> number of the page to search (default: 1)
*/
function search_similar_movies (page_number) {

	if (this.id != null) {

		interval = clearInterval(interval);

		var tmp_similarMoviesTab = null;

		var http_request = make_http_object();

		http_request.open("GET", "https://api.themoviedb.org/3/movie/"+this.id+"/similar?page="+page_number+"&api_key="+api_key);

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
		
		if (results_display == "List")
			display_all_movies_list();
		else
			display_all_movies_graph();

		display_save_file_button(true);

	}

}

function perform_algorithm_similarities () {

	display_msg("Performing! Please wait...");

	number_similar_movies_obtains = 0;

	var bestSimilarMovies = new Array();

	/*
	Management of unique case like "Harry Potter" -> search first position "Harry" in "Harry Potter and the chamber of secrets", and not "Harry Potter and the philosopher's stone" in "Harry potter and the chamber of secrets" (-> GAME OVER)
	*/
	var first_part_title = this.title.split(' ')[0];

	for (var i = 0; i < this.tabMovie.results.length; i++) {

		if (((this.tabMovie.results[i].title.indexOf(first_part_title) == 0) || (this.title.indexOf(this.tabMovie.results[i].title) == 0)) && ((this.title != this.tabMovie.results[i].title) || (this.date != this.tabMovie.results[i].release_date))) {

			var similarMovie = new similarMovie_object();

			similarMovie.id = this.tabMovie.results[i].id;
			similarMovie.title = this.tabMovie.results[i].title;
			similarMovie.date = this.tabMovie.results[i].release_date;
			similarMovie.path_poster = this.tabMovie.results[i].poster_path;
			similarMovie.popularity = this.tabMovie.results[i].popularity;
			similarMovie.vote_average = this.tabMovie.results[i].vote_average;
			similarMovie.vote_count = this.tabMovie.results[i].vote_count;

			bestSimilarMovies.push(similarMovie);

			this.tabMovie.results.slice(i, 1);

			number_similar_movies_obtains++;
		}

	}

	bestSimilarMovies.sort(function(a,b) {if (a.title < b.title) return -1; if (a.title > b.title) return 1; return 0});

	for (var i = 0; i < this.tabMovie.results.length; i++) {

		if ((this.tabMovie.results[i].title.indexOf(this.title) > 0) || (this.title.indexOf(this.tabMovie.results[i].title) > 0)) {
			
			var similarMovie = new similarMovie_object();

			similarMovie.id = this.tabMovie.results[i].id;
			similarMovie.title = this.tabMovie.results[i].title;
			similarMovie.date = this.tabMovie.results[i].release_date;
			similarMovie.path_poster = this.tabMovie.results[i].poster_path;
			similarMovie.popularity = this.tabMovie.results[i].popularity;
			similarMovie.vote_average = this.tabMovie.results[i].vote_average;
			similarMovie.vote_count = this.tabMovie.results[i].vote_count;

			bestSimilarMovies.push(similarMovie);

			number_similar_movies_obtains++;
		}

	}

	for (var i = 0; i < similarMovies.length; i++) {

		if ((similarMovies[i].title.indexOf(this.title) >= 0) || (this.title.indexOf(this.similarMovies[i].title) >= 0)) {
			bestSimilarMovies.push(similarMovies[i]);
			similarMovies.splice(i, 1);
			number_similar_movies_obtains++;
		}
		else {
			if (parseInt(similarMovies[i].vote_average) >= 7) {
			bestSimilarMovies.push(similarMovies[i]);
			similarMovies.splice(i, 1);
			number_similar_movies_obtains++;
			}
		}

	}

	display_msg("End of performing...");

	similarMovies = bestSimilarMovies;

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

function save_pdf_file () {

	var specialElementHandlers = 
        function (element,renderer) {
            return true;
        };
                            
    var doc = new jsPDF();
    var pageHeight= doc.internal.pageSize.height;
    var pageWidth = doc.internal.pageSize.width;

    console.log(pageWidth);
    
    var x = 20;
    var y = 20;

    var number_movies_to_display = number_similar_movies;

    if (number_similar_movies >  number_similar_movies_obtains)
    	number_movies_to_display = number_similar_movies_obtains;

    doc.setFont("times", "bold");

    doc.text(x, y, "Movie: ");

    doc.setFontStyle("normal");

    doc.text(x + 20, y, this.title);

    y += 15;

    doc.setFontStyle("bold");

    doc.text(x, y, "Similar movies ("+number_movies_to_display+"):");

    doc.setFontStyle("normal");

    y += 15;

    for (var i = 0; i < number_movies_to_display; i++) {

		if ( (y + 30) >= pageHeight) {
	  		doc.addPage();
	  		y = 20; // Restart height position
		}

		doc.setFontStyle("bold");

		doc.text(x, y, i+": "+similarMovies[i].title);

		y += 10;

		doc.text(x, y, ""+similarMovies[i].date+"");

		doc.setFontStyle("normal");

		y += 10;

		x = 40;

		for (var j = 0; j < similarMovies[i].overview.length; j++) {
			if (x >= (pageWidth - 20)) {
				x = 40;
				y += 10;
			}
			if ( (y + 30) >= pageHeight) {
		  		doc.addPage();
		  		y = 20; // Restart height position
			}
			var character = similarMovies[i].overview[j];
			doc.text(x, y, character)
			if (character == character.toLowerCase() && character != 'm' && character != 'w')
				x+=2;
			else {
				if (character == character.toUpperCase()) {
					if (character == 'M' || character == 'W')
						x+=4.5
					else
						x+=3;
				}
				else  {
					if (character.toLowerCase() == 'm' || character.toLowerCase() == 'w')
						x+=4.5;
				}
			}
		}

		x = 20;

		y += 20;

    }

    doc.save('MovieNetwork_'+this.title+'.pdf');

}
