function init_progress_bar () {

	var display_results_node = document.getElementById('display_results');

	var div = document.createElement("div");
	div.id = "div_progress_bar";
	div.appendChild(document.createTextNode("Please wait..."));
	div.appendChild(document.createElement('br'));

	var progress_bar = document.createElement("progress");
	progress_bar.id = "progress_bar";
	progress_bar.value = 0;
	progress_bar.max = 1;
	div.appendChild(progress_bar);

	display_results_node.appendChild(div);

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
	document.getElementById("div_progress_bar").remove();

}