var sw = require('stopword'),
	request = require('request');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:pollID', function(req, res, next) {
	var pollID = req.params.pollID;
	// var pollID = 'kbhiaYeDDHCIGXj';

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
	    var txts = [ ];

	    for(var attributename in info){
	    	
	    	for(var key in info[attributename]){
	    		if (key == "value") {
	    			text += (info[attributename][key] + " ");
	    			txts.push(info[attributename][key]);
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

		// res.send('<head><title>Jane Doe - ' + pollID + '</title></head><html><h3> PollID: ' + pollID + ' - ' + dateTime + '</h3>' + newString + '</html>');
		res.render('poll', { title: dateTime + ' - Jane Doe Text Submission', pollID: pollID, dateTime: dateTime, text: newString, txts: txts });
	  }
	}
	 
	request(options, callback);
});

module.exports = router;
