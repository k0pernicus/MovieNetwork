/**
 * Predictive action
 * Add a predictive feature to find the good movie in the TMDb database
 * @return Object Object which contains a list of movies which are similars from what we had typing
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