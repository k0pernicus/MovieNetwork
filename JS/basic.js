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