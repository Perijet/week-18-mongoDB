
// Initialize Express app
var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');
var logger 		= require('morgan');


// Require request and cheerio. This makes the scraping possible
var request 	= require('request');
var cheerio 	= require('cheerio');



// Database configuration
var mongojs 	= require('mongojs');
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static('public'));
// Main route (simple Hello World Message)
// app.get('/', function(req, res) {
//   res.send(test.html);
// });

app.get('/', function(req, res) {
  res.send(index.html);
});

// Route 1 This route will retrieve all of the data 
app.get('/all', function(req, res) {

	db.scrapedData.find({}, function (err, docs) {
		//console.log(docs);
    res.json(docs);
    
  });
  
});


// Route 2 When you visit this route, the server will
// scrape data from the site of your choice, and save it to MongoDB.
app.get('/scraper', function(req, res) {

request('http://www.npr.org/sections/news/', function (error, response, html) {

  var $ = cheerio.load(html);
  
	$('div.item-info').each(function(i, element){
	    var label = $(this).find('h2.title a').text();
	    var link = $(this).find('h2.title a').attr('href');
	    var teaser = $(this).find('p').text();
	    console.log('label:', label);
	    db.scrapedData.insert({"label":label, "teaser": teaser});
    });
  
});

  res.send("Website Scraped");

});


// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});