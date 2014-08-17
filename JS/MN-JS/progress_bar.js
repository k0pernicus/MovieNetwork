function init_progress_bar () {

	var display_results_node = document.getElementById('display_results');

	var div = document.createElement("progress");
	div.id = "progress_bar";
	div.value = 0;
	div.max = 1;

	display_results_node.appendChild(div);
	display_results_node.appendChild(document.createElement('br'));
	display_results_node.appendChild(document.createElement('br'));

}

function evolve_progress_bar (value) {

	document.getElementById("progress_bar").value = value;

}

function upgrade_progress_bar () {

	var value = document.getElementById("progress_bar").value;
	document.getElementById("progress_bar").value = (value+0.01);

}
 
function clean_progress_bar () {

	//Removal progress bar
	document.getElementById("progress_bar").remove();
	//Removal 'br' tags
	var display_results = document.getElementById('display_results');
	display_results.removeChild(display_results.childNodes[0]);

}