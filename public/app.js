$(document).ready(function(){
	$('#hideAtStart').hide();
	$('#scrape').click(function(){
		$('#hideAtStart').show();
		$('#scrape').hide();
	});

	$.getJSON("/all", function (data){
			var counter = -1;
			// $('#newsTitle').append("<h4>" + data[counter].label + "</h4>");
			$('#newsContent').html('<h2>click here to begin</h2>');	
			$('#article').append("<p>|| Article: ||</p");
			// $('#savedNote').text(data[counter].note);	
			// //$('#deleteNote').append("<p> Note: </p");	
			// $('#article').append("<p>" + "Article: " + (counter + 1) + "</p");		
	
		$(document).on('click keyup', '#newsContent' ,function (){
			$('#newsContent').blur();
			$('#newsTitle').empty();
			$('#newsContent').empty();
			$('#article').empty();
			$('#savedNote').text(" ");
			
			counter =(counter + 1);
			if(counter > (data.length -1)){
				counter = 0;
			}
			console.log(counter);
			$('#newsTitle').append("<h4>" + data[counter].label + "</h4>");
			$('#newsContent').html("<p>" + data[counter].teaser + "</p><br>" + "<a>" + data[counter].link) + "</a>";
			//$('#newsContent').text(data[counter].link);
			console.log(data[counter].link);
			$('#savedNote').text(data[counter].note);
			$('#article').append("<p>||" + "Article: " + (counter + 1) + "||</p");
			$('textarea').blur();
	});	
		
		
	$('#attachNote').on('click', function(){

	    var thisId = data[counter]._id;
	    console.log(thisId);
	    var note = $('#addNote').val();
	    $.ajax({
	      type: "POST",
	      url: '/noteBox/' + thisId,
	      data:{
	      	note: note,
	      	created: Date.now()
	      }
	    })
	    .done(function(result){
	    	console.log(result);
	    	//getNote();
	    	$('#addNote').val(" ");
	    	$('#savedNote').text(note);
	    	
	    	
	    });
	    return false;

	   }); 




	$('#deleteNote').on('click', function(){

	    var thisId = data[counter]._id;
	    console.log(thisId);
	    var note = $('#savedNote').val();
	    $.ajax({
	      type: "POST",
	      url: '/deleteBox/' + thisId,
	      data:{
	      	note: note,
	      	created: Date.now()
	      }
	    })
	    .done(function(result){
	    	console.log(result);
	    	//getNote();
	    	$('#savedNote').empty();
	    	//$('#savedNote').val(note);
	    	
	    });
	    return false;

	   }); 





	});

});