var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var parse = require('csv-parse');

var url = 'mongodb://localhost:27017/askahokie';

var insertGroups = function (data, db, callback) {
  var collection = db.collection('groups');
  collection.insertMany(data, function (err, result) {
    if (!err) {
      callback(result);
    } else {
      console.error(err);
    }
  });
};

MongoClient.connect(url, function(err, db) {
  if (!err) {
    console.log("Connected successfully to mongodb server!");

    var csvData = [];
    var skippedFirst = false;
    fs.createReadStream('groups.txt')
      .pipe(parse({delimeter: '='}))
      .on('data', function (csvrow) {
        if (skippedFirst) {
          var obj = {
            _id: csvrow[0],
            title: csvrow[1],
            motd: csvrow[2],
            course: csvrow[3] == 'true',
          };
          csvData.push(obj);
        } else {
          skippedFirst = true;
        }
      })
      .on('end', function () {
        // csvData is ready
        //console.log(csvData.slice(0, 10));
        insertGroups(csvData, db, function (result) {
          console.log(result);
        });
      });

  } else {
    console.error(err);
  }
});


