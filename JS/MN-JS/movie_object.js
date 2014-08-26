/**
 * Object to represents the first movie inputs.<br/>
 * All the attributes of the object are NULL.
 * @constructor
 */
function movie_object() {
	this.reset();
}

/**
 * Function to reset all the object's attributes.
 */
movie_object.prototype.reset = function() {

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
	this.score = 0;

}

/**
 * Function to get the id of the object.
 * @return Number The id of the object
 */
movie_object.prototype.get_id = function() {
	return this.id;
}

/**
 * Function to get the title of the object.
 * @return String The title of the object
 */
movie_object.prototype.get_title = function() {
	return this.title;
}

/**
 * Function to get the release date of the object.
 * @return String The release date of the object
 */
movie_object.prototype.get_date = function() {
	return this.date;
}

/**
 * Function to get the release year of the object.
 * @return String The release year of the object
 */
movie_object.prototype.get_year = function() {
	return this.date.split('-')[0];
}

/**
 * Function to get the path of the object's poster.
 * @return String The path of the object's poster
 */
movie_object.prototype.get_path_poster = function() {
	return this.path_poster;
}

/**
 * Function to get the popularity of the object.
 * @return Float The popularity of the object
 */
movie_object.prototype.get_popularity = function() {
	return this.popularity;
}

/**
 * Function to get the vote average of the object.
 * @return Float The vote average of the object
 */
movie_object.prototype.get_vote_average = function () {
	return this.vote_average;
}

/**
 * Function to get the vote count of the object.
 * @return Float The vote count of the object
 */
movie_object.prototype.get_vote_count = function() {
	return this.vote_count;
}

/**
 * Function to get the collection of the object.
 * @return Object The collection of the object
 */
movie_object.prototype.get_collection = function() {
	return this.collection;
}

/**
 * Function to get the overview of the object.
 * @return String The overview of the object
 */
movie_object.prototype.get_overview = function() {
	return this.overview;
}

/**
 * Function to get the director of the object.
 * @return String The director of the object
 */
movie_object.prototype.get_director = function() {
	return this.director[0];
}

/**
 * Function to get the score of the object (for a similar movie).
 * @return Number The score of the object
 */
movie_object.prototype.get_score = function() {
	return this.score;
}

/**
 * Function to set the id of the object.
 * @param {Number} id The id of the object
 */
movie_object.prototype.set_id = function(id) {
	this.id = id;
}

/**
 * Function to set the title of the object.
 * @param {String} title The title of the object
 */
movie_object.prototype.set_title = function(title) {
	this.title = title;
}

/**
 * Function to set the date of the object.
 * @param {String} date The date of the object
 */
movie_object.prototype.set_date = function(date) {
	this.date = date;
}

/**
 * Function to set the path poster of the object.
 * @param {String} path_poster The path poster of the object
 */
movie_object.prototype.set_path_poster = function(path_poster) {
	this.path_poster = path_poster;
}

/**
 * Function to set the popularity of the object.
 * @param {Float} popularity The popularity of the object
 */
movie_object.prototype.set_popularity = function(popularity) {
	this.popularity = popularity;
}

/**
 * Function to set the vote average of the object.
 * @param {Float} vote_average The vote average of the object
 */
movie_object.prototype.set_vote_average = function (vote_average) {
	this.vote_average = vote_average;
}

/**
 * Function to set the vote count of the object.
 * @param {Float} vote_count The vote count of the object
 */
movie_object.prototype.set_vote_count = function(vote_count) {
	this.vote_count = vote_count;
}

/**
 * Function to set the collection of the object.
 * @param {Object} collection The collection of the object
 */
movie_object.prototype.set_collection = function(collection) {
	this.collection = collection;
}

/**
 * Function to set the overview of the object.
 * @param {String} overview The overview of the object
 */
movie_object.prototype.set_overview = function(overview) {
	this.overview = overview;
}

/**
 * Function to set the director of the object.
 * @param {String} director The director of the object
 */
movie_object.prototype.set_director = function(director) {
	this.director = director;
}

/**
 * Function to set the score of the object (for a similar movie).
 * @param {Number} score The score of the object
 */
movie_object.prototype.set_score = function(score) {
	this.score = score;
}