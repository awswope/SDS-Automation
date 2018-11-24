var express = require('express');
const readline = require('readline');
var router = express.Router();
var request = require('request');
const fs = require('fs');
const TOKEN_PATH = 'token.json';
const {google} = require('googleapis');
var authUrl="test";
var oAuth2Client;
const SCOPES = ['https://www.googleapis.com/auth/drive'];
var credContent;
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



    res.render('index', { title: 'Express', authUrl:authUrl });
  });

router.get('/auth/google/callback', async function(req, res, next)
{

  // // Load client secrets from a local file.
  // fs.readFile('credentials.json', (err, content) => {
  //   if (err) return console.log('Error loading client secret file:', err);
  //   // Authorize a client with credentials, then call the Google Drive API.
  //   authorize(JSON.parse(content), listFiles);
  // });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  // function authorize(credentials, callback) {
    // const {client_secret, client_id, redirect_uris} = credentials.web;
    // const oAuth2Client = new google.auth.OAuth2(
    //     client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, listFiles);

      oAuth2Client.setCredentials(JSON.parse(token));
      console.log('about to call list files');
      listFiles(oAuth2Client);
    });

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
    // const authUrl = oAuth2Client.generateAuthUrl({
    //   access_type: 'offline',
    //   scope: SCOPES,
    // });
    //console.log('Authorize this app by visiting this url:', authUrl);
    // const rl = readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout,
    // });
    // rl.question('Enter the code from that page here: ', (code) => {
    //   rl.close();
    code=req.query.code;
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });

        console.log("about to callback listFiles");
        callback(oAuth2Client);
      });

  }

  function listFiles(auth) {
    console.log('inside listFiles');
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) {
        console.log('Files:');
        files.map((file) => {
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log('No files found.');
      }
    });
  }
res.render('win',{title:'Folder Created'})

});
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

function listFiles(auth) {

  }

module.exports = router;
