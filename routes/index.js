var express = require('express');
const readline = require('readline');
var router = express.Router();
var request = require('request');
var Promise = require('promise');

const fs = require('fs');
const TOKEN_PATH = 'token.json';
const {google} = require('googleapis');
var authUrl="test";
var oAuth2Client;
const SCOPES = ['https://www.googleapis.com/auth/drive'];
var credContent;
var sdsWinToken;
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  //authorize(JSON.parse(content), listFiles);
  credContent = JSON.parse(content);
  console.log('credContent ' + JSON.stringify(credContent));
  authorize(credContent);
});

function authorize (credContent){

    console.log('authURL is: '+ authUrl)
    const {client_secret, client_id, redirect_uris} = credContent.web;
    oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,

    });
    console.log('authURL is: '+ authUrl)
  }

/* GET home page. */
router.get('/', function(req, res, next) {

  // Access the session as req.session

    if (req.session.views) {
      req.session.views++


    } else {
      req.session.views = 1

    }


    res.render('index', { title: 'Express', authUrl:authUrl });
  });

router.get('/auth/google/callback', function(req, res)
{
  cookie=req.session.sdsWinToken;
  code = req.query.code;

  isTokenStored(cookie).then(function(isTokenStoredResult){
    console.log('isTokenStored result: '+ isTokenStoredResult);
    if(isTokenStoredResult===false){return fetchAccessToken(code);}
    else{return isTokenStoredResult;}
  }).then(function(token){
    if(req.session.sdsWinToken === undefined){
      console.log('cookie is being set');
      req.session.sdsWinToken = token;
    }
    return setoAuth2Client(token);
  }).then(function(setoAuth2ClientResult){
    console.log(setoAuth2ClientResult);
    res.render('dashboard',{title:'You\'re Authorized'})
  });
}); //end google callback router

router.post('/create-folder', function(req, res){

  var projectId=req.body.projectId;
  createFolder(oAuth2Client, projectId).then(function(result){
    console.log('about to render win')
    res.render('win', {title:'folder created!', folderId: result})
  });
});//end create-folder router

router.get('/dashboard', function(req, res){
    res.render('dashboard', {title:'ready to make another folder?'});
});//end create-folder router

let isTokenStored = function(cookie){
  return new Promise(function(resolve, reject){

    console.log('cookie passed to isTokenStored:')
    console.log(cookie)
    if (cookie===undefined)//this seems to always be true
    {
      console.log('no cookie found for sdsWinToken, returning false');
      // req.session.sdsWinToken = getAccessToken(oAuth2Client, listFiles, req.query.code)
      resolve(false);
    }
    else {
      console.log('sdsWinToken found, returning true');
      resolve(cookie);
      // oAuth2Client.setCredentials(req.session.sdsWinToken);
      // console.log('about to call list files');
      // listFiles(oAuth2Client);

    }

  });
};

let setoAuth2Client = function(token){
  console.log('in setoAuth2Client');
  return new Promise(function(resolve, reject){
    oAuth2Client.setCredentials(token);
    resolve(oAuth2Client);
  });
};

let fetchAccessToken = function(code){
  return new Promise(function(resolve, reject){
    console.log('inside fetchAccessToken');
    console.log('code passed to fetchAccessToken: '+code);
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      console.log('token:');
      console.log(token);
      // Store the token to disk for later program executions
      // fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      //   if (err) console.error(err);
      //   console.log('Token stored to', TOKEN_PATH);
      // });

      //set the users cookie for the token for multiple calls and multiple users
      // req.session.sdsWinToken = sdsWinToken;
      // console.log ("sds win token in res is" + req.session.sdsWinToken)
        resolve(token);
    });

  });
};

let createFolder = function(auth, projectId){
  console.log ('in createFolder');
  console.log (auth);
  return new Promise(function(resolve, reject){
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
      'name': 'Invoices '+projectId,
      'mimeType': 'application/vnd.google-apps.folder'
    };
    drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    }, function (err, res) {
      if (err) {
        // Handle error
        console.error(err);
        resolve(err);
      } else {
        var folderId = res.data.id;
        console.log('Folder id: ', folderId);
        console.log('about to resolve and pass folderId');
        resolve(folderId);
      }
    })



  });
};


// function authorizeUser(req){
//
//     return new Promise(function(resolve, reject){
//
//
//
//   if (req.session.sdsWinToken===undefined)//this seems to always be true
//   {
//     console.log('no cookie found for sdsWinToken, getting token');
//     req.session.sdsWinToken = getAccessToken(oAuth2Client, listFiles, req.query.code)
//
//   }
//   else {
//     console.log('sdsWinToken found, using it to set credentials:');
//     console.log(req.session.sdsWinToken);
//
//     oAuth2Client.setCredentials(req.session.sdsWinToken);
//     console.log('about to call list files');
//     listFiles(oAuth2Client);
//
//   }
//
//
// resolve();
// });//end promise
//
// }//end authorizeUser


// authorizeUser(req).then(function(){
// console.log('\n\nright before rednering win req.session.sdsWinToken:')
// console.log(req.session.sdsWinToken)
//
//
// });
//
//
// function getAccessToken(oAuth2Client, callback, code) {
//
//
//
//
// }
//
// function listFiles(auth) {
//
//
//   const drive = google.drive({version: 'v3', auth});
//   var fileMetadata = {
//     'name': 'Invoices',
//     'mimeType': 'application/vnd.google-apps.folder'
//   };
//   drive.files.create({
//     resource: fileMetadata,
//     fields: 'id'
//   }, function (err, res) {
//     if (err) {
//       // Handle error
//       console.error(err);
//     } else {
//       console.log('Folder id: ', res.data.id);
//     }
//   });
//
// }//end listfiles


router.get('/win', function(req, res, next) {
  //
  //
  // // Open a new connection, using the GET request on the URL endpoint
  // request('https://ghibliapi.herokuapp.com/films', function(error, response, body){
  //   console.log('error:', error);
  //   console.log('statusCode:', response && response.statusCode);
  //   res.send(body);
  // });
});


module.exports = router;
