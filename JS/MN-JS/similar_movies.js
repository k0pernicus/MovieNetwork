/**
 * Array object which contains all the similar movies computed<br/>
 * Each similar movie MUST BE a movie_object object!
 * @constructor
 */
function similar_movies() {
	this.reset();
}

/**
 * Function to reset the array of similar movies
 */
similar_movies.prototype.reset = function() {
	this.array = new Array();
}

/**
 * Function to add a similar movie in the array attribute
 * @param movie_object similar_movie A movie_object object, which represents a similar movie for the one entered
 */
similar_movies.prototype.add_similar_movie = function(similar_movie) {
	this.array.push(similar_movie);
}

/**
 * Function which returns the array of similar movies
 * @return Array Attribute which contains all the similar movies (movie_object object)
 */
similar_movies.prototype.get_array = function() {
	return this.array;
}