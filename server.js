
//Initialize Express app
var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');
var logger 		= require('morgan');

//Require request and cheerio. This makes the scraping possible
var request 	= require('request');
var cheerio 	= require('cheerio');

//Database configuration
var mongojs 	= require('mongojs');
var databaseUrl = "scraper";
var collections = ["scrapedData"];

//Hook mongojs configuration to the db variable
//var db = mongojs(databaseUrl, collections);
var db = mongojs('mongodb://heroku_6jtkwl62:hbcdvckrtl82oplaq0l584rcdn@ds023902.mlab.com:23902/heroku_6jtkwl62');
db.on('error', function(err){
  console.log('Database Error:', err);
});

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static('public'));

//Route to serve up the index page
app.get('/', function(req, res){
  res.send(index.html);
});

//Route to retrieve all of the data 
app.get('/all', function(req, res) {
	db.scrapedData.find({}, function (err, docs){
    
    res.json(docs);
    
  	});  
});

//Route that receives data to update and add notes to the database
app.post('/noteBox/:id', function(req, res){
	var note = req.body;

	db.scrapedData.update({
	    '_id': mongojs.ObjectId(req.params.id)}, 
	    {
	    	$set: {
	      	'note':note.note
	    	}
	  	}, 
	  function(err, edited){
	    if (err){
	      console.log(err);
	      res.send(err);
	    } 
	    else{
	      console.log(edited);
	      res.send(edited);
	    }

	  });

		console.log(note);
});

//Route to delete notes from database based on id received
app.post('/deleteBox/:id', function(req, res){
	var note = req.body;

	db.scrapedData.update({
		'_id': mongojs.ObjectId(req.params.id)}, 
	    {
		    $set: {
		      'note':" "
		    }
	  	},
	  	function(err, edited){
		    if (err) {
		      console.log(err);
		      res.send(err);
		    } 
		    else{
		      console.log(edited);
		      res.send(edited);
		    }
	  	});

		console.log(note);
});

//Route scrapes data from the NPR news site, and save it to MongoDB.
app.get('/scraper', function(req, res){

	request('http://www.npr.org/sections/news/', function (error, response, html){

	var $ = cheerio.load(html);
  
	$('div.item-info').each(function(i, element){


	    var label = $(this).find('h2.title a').text();
	    var link = $(this).find('h2.title a').attr('href');
	    var teaser = $(this).find('p').text();
	    console.log('link:', link);
	    db.scrapedData.save({'_id': mongojs.ObjectId(req.params.id),
  "label":label, "teaser": teaser, "link": link});
    });
  
	});

  		res.redirect('/');

});

// listen on port 3000
app.listen(3000, function(){
  console.log('App running on port 3000!');
});
