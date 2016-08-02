$(document).ready(function(){
	$('#hideAtStart').hide();
	$('#scrape').click(function(){
		$('#hideAtStart').show();
		$('#scrape').hide();
	});

	$.getJSON("/all", function (data){
			var counter = 0;
			$('#newsTitle').append("<h4>" + data[counter].label + "</h4>");
			$('#newsContent').append("<p>" + data[counter].teaser + "</p");		
	
		$(document).on('click', 'p' ,function(){
			$('#newsTitle').empty();
			$('#newsContent').empty();
			counter =(counter + 1);
			if(counter > (data.length -1)){
				counter = 0;
			}
			console.log(counter);
			$('#newsTitle').append("<h4>" + data[counter].label + "</h4>");
			$('#newsContent').append("<p>" + data[counter].teaser + "</p");

		});	
		

		// $('#newsTitle').append("<h4>" + data[counter].label + "</h4>");
		// $('#newsContent').append("<p>" + data[counter].teaser + "</p");


	});



});