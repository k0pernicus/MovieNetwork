/*
First_movie class
@author Carette Antonin
@date 08/16/14
*/

/*
first_movie object
*/
function first_movie () {
	/*
	Parameters
	*/
	this.id = null;
	this.title = null;
	this.date = null;
	this.path_poster = null;
	this.popularity = null;
	this.vote_average = null;
	this.vote_count = null;
	this.collection = null;
	this.overview = null;
	this.director = null;
	/*
	GET - Functions
	*/
	this.get_id = function() {
		return this.id;
	}
	this.get_title = function() {
		return this.title;
	}
	this.get_date = function() {
		return this.date;
	}
	this.get_year = function() {
		return this.date.split('-')[0];
	}
	this.get_path_poster = function() {
		return this.path_poster;
	}
	this.get_popularity = function() {
		return this.popularity;
	}
	this.get_vote_average = function () {
		return this.vote_average;
	}
	this.get_vote_count = function() {
		return this.vote_count;
	}
	this.get_collection = function() {
		return this.collection;
	}
	this.get_overview = function() {
		return this.overview;
	}
	this.get_director = function() {
		return this.director[0];
	}
	/*
	SET - Functions
	*/
	this.set_id = function(id) {
		this.id = id;
	}
	this.set_title = function(title) {
		this.title = title;
	}
	this.set_date = function(date) {
		this.date = date;
	}
	this.set_path_poster = function(path_poster) {
		this.path_poster = path_poster;
	}
	this.set_popularity = function(popularity) {
		this.popularity = popularity;
	}
	this.set_vote_average = function (vote_average) {
		this.vote_average = vote_average;
	}
	this.set_vote_count = function(vote_count) {
		this.vote_count = vote_count;
	}
	this.set_collection = function(collection) {
		this.collection = collection;
	}
	this.set_overview = function(overview) {
		this.overview = overview;
	}
	this.set_director = function(director) {
		this.director = director;
	}
}

/*
Function to reset all parameters, in the first_movie object
*/
first_movie.prototype.reset = function() {

	this.id = null;
	this.title = null;
	this.date = null;
	this.path_poster = null;
	this.popularity = null;
	this.vote_average = null;
	this.vote_count = null;
	this.collection = null;
	this.overview = null;
	this.director = null;

}