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

router.get('/auth/google/callback', async function(req, res, next)
{


function authorizeUser(req){

      return new Promise(function(resolve, reject){


        console.log('Cookies: ', req.cookies)
    // sdsWinToken = req.cookies.sdsWinToken
    console.log('req.session');
    console.log(req.session);
    if (req.session.sdsWinToken===undefined)//this seems to always be true
    {
      console.log('no cookie found for sdsWinToken, getting token');
      getAccessToken(oAuth2Client, listFiles)

    }
    else {
      console.log('sdsWinToken found, using it to set credentials:');
      console.log(req.session.sdsWinToken);

      oAuth2Client.setCredentials(req.session.sdsWinToken);
      console.log('about to call list files');
      listFiles(oAuth2Client);

    }

    function getAccessToken(oAuth2Client, callback) {

      code=req.query.code;
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error('Error retrieving access token', err);
          console.log('token:');
          console.log(token);
          sdsWinToken = token;
          console.log('sdsWinToken set to token and now value is:')
          console.log(sdsWinToken);
          oAuth2Client.setCredentials(sdsWinToken);
          // Store the token to disk for later program executions
          // fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          //   if (err) console.error(err);
          //   console.log('Token stored to', TOKEN_PATH);
          // });

          //set the users cookie for the token for multiple calls and multiple users
          req.session.sdsWinToken = sdsWinToken;
          console.log ("sds win token in res is" + req.session.sdsWinToken)
          console.log("about to callback listFiles");
          callback(oAuth2Client);
        });

    }

    function listFiles(auth) {
      console.log('inside listFiles');
      console.log('req.session.sdsWinToken:')
      console.log(req.session.sdsWinToken)

      const drive = google.drive({version: 'v3', auth});
      var fileMetadata = {
        'name': 'Invoices',
        'mimeType': 'application/vnd.google-apps.folder'
      };
      drive.files.create({
        resource: fileMetadata,
        fields: 'id'
      }, function (err, res) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          console.log('Folder id: ', res.data.id);
        }
      });
resolve();
}//end listfiles

});//end promise

}//end authorizeUser


authorizeUser(req).then(function(){
  console.log('\n\nright before rednering win req.session.sdsWinToken:')
console.log(req.session.sdsWinToken)
res.render('win',{title:'Folder Created'})

});



}); //end router


  /**
   * Lists the names and IDs of up to 10 files.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */



//res.render('win',{title:'Authorized for Drive'})

// --previous work--
//   fs.readFile('credentials.json', (err, content) => {
//     if (err) return console.log('Error loading client secret file:', err);
//     // Authorize a client with credentials, then call the Google Drive API.
//     authorize(JSON.parse(content), listFiles);
//   });
//
//
//
//
//   // This will provide an object with the access_token and refresh_token.
// // Save these somewhere safe so they can be used at a later time.
// code=req.query.code;
// console.log('code is: '+code);
// const {tokens} =  await oauth2Client.getToken(code)
// fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
//         if (err) console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//
//
// console.log("tokens access token is: "+tokens.access_token)
// await oauth2Client.setCredentials(tokens);
// // oauth2Client.credentials = {access_token : tokens.access_token}
// console.log(oauth2Client);
//
// console.log("About to try to create drive object")
//
//   const drive = await google.drive({version: 'v3', oauth2Client});
//
//   console.log("drive initialized")
//
//   var fileMetadata = {
//       'name': 'Invoices',
//       'mimeType': 'application/vnd.google-apps.folder'
//   };
//
//
//   drive.files.list({
//     pageSize: 10,
//     fields: 'nextPageToken, files(id, name)',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const files = res.data.files;
//     if (files.length) {
//       console.log('Files:');
//       files.map((file) => {
//         console.log(`${file.name} (${file.id})`);
//       });
//     } else {
//       console.log('No files found.');
//     }
//   });
//
//   // drive.files.create({
//   //     //auth:oauth2Client.credentials.tokens.access_token,
//   //     resource: fileMetadata,
//   //     fields: 'id'
//   //   }, function (err, file) {
//   //     if (err) {
//   //       // Handle error
//   //       console.error(err);
//   //     } else {
//   //       console.log('Folder Id: ', file.id);
//   //     }
//   // });
//
// // console.log('auth is' + auth);


router.get('/create-folder', function(req, res, next){


res.render('win',{title:'Folder Created'})

});

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
