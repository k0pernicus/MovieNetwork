/**
Save_pdf_file class
@author Carette Antonin
@date 16/08/14
*/

function save_pdf_file (first_movie, number_similar_movies, number_similar_movies_obtains, similarMovies) {

	var specialElementHandlers = 
        function (element,renderer) {
            return true;
        };
                            
    var doc = new jsPDF();
    var pageHeight= doc.internal.pageSize.height;
    var pageWidth = doc.internal.pageSize.width;
    
    var x = 20;
    var y = 20;

    var number_movies_to_display = number_similar_movies;

    if (number_similar_movies >  number_similar_movies_obtains)
    	number_movies_to_display = number_similar_movies_obtains;

    doc.setFont("times", "bold");

    doc.text(x, y, "Movie: ");

    doc.setFontStyle("normal");

    doc.text(x + 20, y, first_movie.get_title());

    y += 15;

    doc.setFontStyle("bold");

    doc.text(x, y, "Similar movies ("+number_movies_to_display+"):");

    doc.setFontStyle("normal");

    y += 15;

    for (var i = 0; i < number_movies_to_display; i++) {

		if ( (y + 30) >= pageHeight) {
	  		doc.addPage();
	  		y = 20; // Restart height position
		}

		doc.setFontStyle("bold");

		doc.text(x, y, i+": "+similarMovies[i].title);

		y += 10;

		doc.text(x, y, ""+similarMovies[i].date+"");

		doc.setFontStyle("normal");

		y += 10;

		x = 40;

		addOverviewTo(i);

		for (var j = 0; j < similarMovies[i].overview.length; j++) {

			if (x >= (pageWidth - 20)) {
				x = 40;
				y += 10;
			}
			if ( (y + 30) >= pageHeight) {
		  		doc.addPage();
		  		y = 20; // Restart height position
			}
			var character = similarMovies[i].overview[j];
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

    doc.save(first_movie.get_title()+'_MN.pdf');

}
