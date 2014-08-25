/**
 * Object to represents a progress bar.<br/>
 * The progress_bar object represents the HTML 'progress' object.<br/>
 * This object serves to display the progress of the principal request.<br/>
 * Exemple: <progress>
 * @constructor
 */
function progress_bar() {}

/**
 * Function to init the object.<br/>
 * The progress_bar object will be display as first child of the 'display_results' div.
 */
progress_bar.prototype.init_progress_bar = function() {

	var display_results_node = document.getElementById('display_results');

	var div = document.createElement("div");
	div.id = "div_progress_bar";
	div.appendChild(document.createTextNode("Computing - please wait..."));
	div.appendChild(document.createElement('br'));

	var progress_bar = document.createElement("progress");
	progress_bar.id = "progress_bar";
	progress_bar.value = 0;
	progress_bar.max = 1;
	div.appendChild(progress_bar);

	display_results_node.appendChild(div);

	this.progress_bar = document.getElementById("progress_bar");

}

/**
 * Function to evolve the value of the object.
 * @param int value New value of the progress_bar object
 */
progress_bar.prototype.evolve_progress_bar = function(value) {
	this.progress_bar.value = value;
}

/**
 * Function to get the value of the object.
 */
progress_bar.prototype.get_value_progress_bar = function() {
	return this.progress_bar.value;
}

/**
 * Function to upgrade the value of the object.<br/>
 * The gap of the upgrade is 0.01.
 */
progress_bar.prototype.upgrade_progress_bar = function() {
	this.evolve_progress_bar(this.get_value_progress_bar() + 0.01);
}

/**
 * Function to clean/remove the object.
 */
progress_bar.prototype.clean_progress_bar = function() {
	this.progress_bar.remove();
}