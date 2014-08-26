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
 * Function to add a similar movie in the array attribute (last position)
 * @param {movie_object} similar_movie A movie_object object, which represents a similar movie for the one entered
 */
similar_movies.prototype.add_similar_movie_after = function(similar_movie) {
	this.array.push(similar_movie);
}

/**
 * Function to add a similar movie in the array attribute (first position)
 * @param {movie_object} similar_movie A movie_object object, which represents a similar movie for the one entered
 */
similar_movies.prototype.add_similar_movie_before = function(similar_movie) {
	this.array.unshift(similar_movie);
}

/**
 * Function to return the movie_object object at a given position
 * @param  {Number} i The position of the object to return, in the array attribute
 * @return movie_object A movie_object object
 */
similar_movies.prototype.get_similar_movie_position = function(i) {
	return this.array[i];
}

/**
 * Function to delete the movie_object at a given position
 * @param {Number} i The position of the object to delete, in the array attribute
 */
similar_movies.prototype.remove_similar_movie_position = function(i) {
	this.array.splice(i, 1);
}

/**
 * Function to return the length of the array of similar movies
 * @return {Number} The length of the attribute 'array'
 */
similar_movies.prototype.get_length = function() {
	return this.array.length;
}

/**
 * Function which returns the array of similar movies
 * @return {Array} Attribute which contains all the similar movies (movie_object object)
 */
similar_movies.prototype.get_array = function() {
	return this.array;
}

/**
 * Function which clean duplicates in all the array
 */
similar_movies.prototype.clean_duplicates = function() {
	var cache = {};
	this.array = this.array.filter(function(elem,index,array){
		return cache[elem.id]?0:cache[elem.id]=1;
	});
}