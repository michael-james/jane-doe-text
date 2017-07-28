
var sw = require('stopword'),
	fs = require('fs'),
	request = require('request');
const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Insert the poll ID in to the URL like this: localhost:3000/pollID</br></br>example: kbhiaYeDDHCIGXj');
});

app.get('/:pollID', function (req, res) {  
  	var pollID = req.params.pollID;

  	var options = {
		url: 'https://www.polleverywhere.com/free_text_polls/' + pollID + '/results',
		headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Authorization': 'Basic aW5mb0B3ZWFyZWphbmVkb2Uub3JnOnJlYWRpbmc=',
		}
	};

	// current time

	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;
	console.log(dateTime);

  	function callback(error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var info = JSON.parse(body);

	    var text = "";

	    for(var attributename in info){
	    	
	    	for(var key in info[attributename]){
	    		if (key == "value") {
	    			text += (info[attributename][key] + " ");
	    		}
	    	}
		}

		// string operations
		text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"\r?\n|\r]/g," ");
		text = text.replace(/[0-9]/g,"");
		text = text.replace(/'/g,"");
		text = text.toLowerCase();

		// remove stop words
		const oldString = text.split(' ').sort();
		const newArray = sw.removeStopwords(oldString); // default English stop words
		// const newArray = sw.removeStopwords(oldString, sw.cu); // custom English stop words
		const newString = newArray.join(' ');

		res.send('<head><title>Jane Doe - ' + pollID + '</title></head><html><h3> PollID: ' + pollID + ' - ' + dateTime + '</h3>' + newString + '</html>');
	  }
	}
	 
	request(options, callback);
});

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});

