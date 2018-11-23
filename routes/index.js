var express = require('express');
var router = express.Router();
var request = require('request');


const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

var passport = require('passport-google-drive');
var auth = require('auth');
auth(passport);
router.use(passport.initialize());



/* GET home page. */
router.get('/', function(req, res, next) {



    res.render('index', { title: 'Express' });
  });

  router.get('/auth/google', passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/drive']
  }));
  router.get('/auth/google/callback',
      passport.authenticate('google', {
          failureRedirect: '/'
      }),
      (req, res) => {}
  );

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




// function listFiles(auth) {
//     const drive = google.drive({version: 'v3', auth});
//
//     console.log("drive initialized")
//
//     var fileMetadata = {
//         'name': 'Invoices',
//         'mimeType': 'application/vnd.google-apps.folder'
//     };
//
//     drive.files.create({
//         resource: fileMetadata,
//         fields: 'id'
//       }, function (err, file) {
//         if (err) {
//           // Handle error
//           console.error(err);
//         } else {
//           console.log('Folder Id: ', file.id);
//         }
//     });

module.exports = router;
