var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var twilio = require('twilio');

var oConnections = {};

// Define the port to run on
app.set('port', process.env.PORT || parseInt(process.argv.pop()) || 5100);

// Define the Document Root path
var sPath = path.join(__dirname, '.');

app.use(express.static(sPath));
app.use(bodyParser.urlencoded({ extended: true }));


function fStart(req, res){
  var sFrom = req.body.From;
  oConnections[sFrom].fCurState = fBeginning;
  var twiml = new twilio.twiml.MessagingResponse();
  twiml.message('Welcome mount haunt to begin this scary adventure. Actions you can peform are in capitals. Text BEGIN to Start.');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}



function fBeginning(req, res){
  var sFrom = req.body.From;
  oConnections[sFrom].fCurState = fEntrance;
  var twiml = new twilio.twiml.MessagingResponse();
  twiml.message('You are now outside the Mount Haunt , would you like LEAVE OR go IN. ');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fEntrance(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("in") != -1){
    twiml.message("You have enter the building do You go RIGHT or UP the grand staircase.");
    oConnections[sFrom].fCurState = fGrandstaircase ;
  }else if(sAction.toLowerCase().search("leave") != -1){  
    twiml.message("You find yourself unable to leave. You must go IN");
  }else {
    twiml.message("You can not " + sAction + ". Choose one of the actions above")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fGrandstaircase (req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("right") != -1){
    twiml.message("you have walked into the Dark Living room; do you go LEFT or RIGHT?");
    oConnections[sFrom].fCurState = fRightgrand ;
  }else if(sAction.toLowerCase().search("up") != -1){  
    twiml.message("you are infront of three doors, which one will you pick Door ONE, TWO, THREE?");
    oConnections[sFrom].fCurState = fUpstairs ;
  }else {
    twiml.message("You can not " + sAction + ". Choose one of the actions above")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}
function fRightgrand (req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("right") != -1){
    twiml.message("you hit a Brick wall you must LEAVE.");
    oConnections[sFrom].fCurState = fGrandstaircaseBack  ;
  }else if(sAction.toLowerCase().search("left") != -1){  
    twiml.message("You have entered the kitchen do you want to LEAVE or go DOWN into the basement?");
    oConnections[sFrom].fCurState = fKitchen  ;
  }else {
    twiml.message("You can not " + sAction + ". Choose one of the actions above")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fGrandstaircaseBack(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("leave") != -1){
    twiml.message("you have walked into the Dark Living room; do you go LEFT or RIGHT? ");
    oConnections[sFrom].fCurState = fRightGrand;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fKitchen(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("down") != -1){
    twiml.message("you have entered the dark basement will you go LEFT or RIGHT? ");
    oConnections[sFrom].fCurState = fBasement;
    else if(sAction.toLowerCase().search("leave") != -1){  
      twiml.message("you have walked into the Dark Living room; do you go LEFT or RIGHT?");
      oConnections[sFrom].fCurState = fRightGrand  ;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fBasement(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("left") != -1){
    twiml.message("you have reached a storage room do you ENTER or PASS ?");
    oConnections[sFrom].fCurState = fBaseleft;
  }else if(sAction.toLowerCase().search("right") != -1){
    twiml.message("You have reached the Back Door Congratulations you have made it out!! Type BEGIN to Start Again");
    oConnections[sFrom].fCurState = fBeginning;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}


function fupstairs(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("one") != -1){
    twiml.message("you are in a bedroom do you want to Search UNDER the Bed or go LEFT?");
    oConnections[sFrom].fCurState = fOne;
  }else if(sAction.toLowerCase().search("two") != -1){
    twiml.message("you are in an empty room you can only LEAVE");
    oConnections[sFrom].fCurState = fTwo;
  }else if(sAction.toLowerCase().search("three") != -1){
    twiml.message("you are in a Tiny Office but you can only go RIGHT?");
    oConnections[sFrom].fCurState = fThree;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fOne(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("under") != -1){
    twiml.message("you have found 300 dallors but also the chainsaw killer you are now dead …… Type BEGIN to start again!");
    oConnections[sFrom].fCurState = fBeginning;
  }else if(sAction.toLowerCase().search("left") != -1){
    twiml.message("you have entered the bathroom you must go thought the HIDDEN door.");
    oConnections[sFrom].fCurState = fHiddenkit;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}


function fTwo(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("leave") != -1){
    twiml.message("you are infront of three doors, which one will you pick Door ONE, TWO, THREE");
    oConnections[sFrom].fCurState = fupstairs;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}
function fThree(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("right") != -1){
    twiml.message("you enter the Bathroom you must go thought the HIDDEN door");
    oConnections[sFrom].fCurState = fHiddenkit;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}


function fHiddenkit(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("hidden") != -1){
    twiml.message("you have entered the dark basement will you go LEFT or RIGHT?");
    oConnections[sFrom].fCurState = fBasement;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fBaseleft(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("enter") != -1){
    twiml.message("You have entered the dark stories room would you like to turn on the LIGHT or LEAVE?");
    oConnections[sFrom].fCurState = fStorageroom;
  }else if(sAction.toLowerCase().search("pass") != -1){
    twiml.message(" you have run into two doors Do you Pick door ONE or TWO");
    oConnections[sFrom].fCurState = fBasedoors;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}



function fStorageroom(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("light") != -1){
    twiml.message("You turned on the light and found that you’re not alone there are many eating dogs There and you have died, Type in BEGIN to Start Again?");
    oConnections[sFrom].fCurState = fBeginning;
  }
  else if(sAction.toLowerCase().search("leave") != -1){
    twiml.message("you have reached a storage room do you ENTER or PASS ?");
    oConnections[sFrom].fCurState = fBaseleft;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}



function fBasedoors(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("one") != -1){
    twiml.message("you have entered the room and found 200 dollar on the bed but there are only 2 ways to leave do you  go LEFT Or RIGHT?");
    oConnections[sFrom].fCurState = fBaseone;
  }else if(sAction.toLowerCase().search("two") != -1){
    twiml.message("you have made it thought the back door in one piece to start again Type BEGIN");
    oConnections[sFrom].fCurState = fBeginning;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}


function fBaseone(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("left") != -1){
    twiml.message("You have walked into a dark room with no way out sorry but you lost , to try again Type in BEGIN.");
    oConnections[sFrom].fCurState = fBeginning;
  }else if(sAction.toLowerCase().search("right") != -1){
    twiml.message("you have reached the Back Door Congraulation you have made it out with 200 Dallors  to play again type BEGIN.");
    oConnections[sFrom].fCurState = fBeginning;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}



//define a method for the twilio webhook
app.post('/sms', function(req, res) {
  var sFrom = req.body.From;
  if(!oConnections.hasOwnProperty(sFrom)){
    oConnections[sFrom] = {"fCurState":fStart};
  }
  oConnections[sFrom].fCurState(req, res);
});

// Listen for requests
var server = app.listen(app.get('port'), () =>{
  var port = server.address().port;
  console.log('Listening on localhost:' + port);
  console.log("Document Root is " + sPath);
});