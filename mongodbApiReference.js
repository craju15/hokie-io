var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/askahokie';

var insertDocuments = function (db, callback) {
  var collection = db.collection('documents');
  collection.insertMany([
    {a: 4}, {a: 5}, {a: 6}
  ], function (err, result) {
    if (!err) {
      console.log("Inserted 3 documents into the collection");
      callback(result);
    } else {
      console.error(err);
      console.log(err);
    }
  });
};

var findDocuments = function (db, callback) {
  var collection = db.collection('documents');
  collection.find({}).toArray(function (err, results) {
    if (!err) {
      console.log("Found the documents!");
      console.log(results);
      callback(results);
    } else {
      console.error(err);
    }
  });
};

var updateDocument = function (db, callback) {
  var collection = db.collection('documents');
  collection.updateOne({a: 2}, {$set: {b: 2}}, function (err, result) {
    if (err) {
      console.log(err);
    } else if (result.result.n != 1) {
      console.log(result);
    } else {
      console.log("Update the document!");
      callback(result);
    }
  });
};

var deleteDocument = function (db, callback) {
  var col = db.collection('documents');
  col.deleteOne({a: 2}, function (err, result) {
    if (err) {
      console.error(err);
    } else if (result.result.n != 1) {
      console.log(result);
    } else {
      console.log("Delete one document!");
      console.log(result);
      callback(result);
    }
  });
}

MongoClient.connect(url, function(err, db) {
  if (!err) {
    console.log("Connected successfully to mongodb server!");

    deleteDocument(db, function () {
      db.close();
    });

  } else {
    console.error(err);
  }
});
