/**
 * Object to represents the pdf to save.
 * @constructor
 * @param {movie_object} first_movie The object first_movie, from main.js
 * @param {Number} number_similar_movies The number of similar movies the user wants on the pdf file
 * @param {Number} number_similar_movies_obtains The maximum number of similar movies founded
 * @param {Array} similarMovies Array of all the similar movies
 */
function pdf_file(first_movie, number_similar_movies, number_similar_movies_obtains, similarMovies) {

	this.first_movie = first_movie;
	this.number_movies_to_display = 
		(function() {
			(number_similar_movies>number_similar_movies_obtains)?number_similar_movies_obtains:number_similar_movies;
		});
	this.similarMovies = similarMovies;

}

/**
 * Function to write the pdf, and save it. <br/>
 * Usage of jsPDF
 */
pdf_file.prototype.write_pdf = function() {

	var specialElementHandlers = 
        function (element,renderer) {
            return true;
        };
                            
    var doc = new jsPDF();
    var pageHeight= doc.internal.pageSize.height;
    var pageWidth = doc.internal.pageSize.width;
    
    var x = 20;
    var y = 20;

    doc.setFont("times", "bold");

    doc.text(x, y, "Movie: ");

    doc.setFontStyle("normal");

    doc.text(x + 20, y, this.first_movie.get_title());

    y += 15;

    doc.setFontStyle("bold");

    doc.text(x, y, "Similar movies ("+this.number_movies_to_display+"):");

    doc.setFontStyle("normal");

    y += 15;

    for (var i = 0; i < this.number_movies_to_display; i++) {

		if ( (y + 30) >= pageHeight) {
	  		doc.addPage();
	  		y = 20; // Restart height position
		}

		doc.setFontStyle("bold");

		doc.text(x, y, i+": "+this.similarMovies[i].title);

		y += 10;

		doc.text(x, y, ""+this.similarMovies[i].date+"");

		doc.setFontStyle("normal");

		y += 10;

		x = 40;

		addOverviewTo(i);

		for (var j = 0; j < this.similarMovies[i].overview.length; j++) {

			if (x >= (pageWidth - 20)) {
				x = 40;
				y += 10;
			}
			if ( (y + 30) >= pageHeight) {
		  		doc.addPage();
		  		y = 20; // Restart height position
			}
			var character = this.similarMovies[i].overview[j];
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

    doc.save(this.first_movie.get_title()+'_MN.pdf');

}
