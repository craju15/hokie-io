var MongoClient = require('mongodb').MongoClient;
var sha256 = require('sha256');

var url = 'mongodb://localhost:27017/askahokie';

function addJacob (db, callback) {
  var userCollection = db.collection('users');
  userCollection.insert({
    firstName: 'Jacob',
    lastName: 'Merizian',
    userID: 'jacob.merizian',
    pic: 'https://upload.wikimedia.org/wikipedia/commons/0/01/LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg',
    email: '321@vt.edu',
    enc_pass: sha256('apples'),
    questions: [],
    answers: [],
    hokieRank: 69,
    dateJoined: new Date(),
    peopleReached: 1000
  }, function (err, results) {
    if (!err) {
      console.log(results);
      callback();
    } else {
      throw new Error(err);
    }
  });
}

function addMolly (db, callback) {
  var userCollection = db.collection('users');
  userCollection.insert({
    firstName: 'Molly',
    lastName: 'LastName',
    userID: 'molly.lastname',
    pic: 'http://i.imgur.com/UENgWeT.gif',
    questions: [],
    answers: [],
    hokieRank: 69,
    dateJoined: new Date(),
    peopleReached: 9001
  }, function (err, results) {
    if (!err) {
      console.log(results);
      callback();
    } else {
      throw new Error(err);
    }
  });
}

function addQuestion1 (db, callback) {
  getNextSequence('questionID', db, function (nextQuestionID) {
    db.collection('questions').insert({
      _id: nextQuestionID,
      title: 'Why is the sky blue?',
      body: 'I really have to know!',
      amt: 69,
      userID: 'jacob.merizian',
      name: 'Jacob Merizian',
      date: new Date()
    }, function (err, result) {
      if (!err) {
        console.log(result);
        callback();
      } else {
        throw new Error(err);
      }
    });
  }); 
}

function addQuestion2 (db, callback) {
  getNextSequence('questionID', db, function (nextQuestionID) {
    db.collection('questions').insert({
      _id: nextQuestionID,
      title: 'What\'s your phone number?',
      body: 'i suk 4 frii',
      amt: -69,
      userID: 'jacob.merizian',
      name: 'Jacob Merizian',
      date: new Date()
    }, function (err, result) {
      if (!err) {
        console.log(result);
        callback();
      } else {
        throw new Error(err);
      }
    });
  });
}


function removeJacob (db, callback) {
  var userCollection = db.collection('users');
  userCollection.deleteMany({firstName: 'Jacob'}, function (err, result) {
    if (!err) {
      console.log(result);
      callback();
    } else {
      throw new Error(err);
    }
  });
}

function removeMolly (db, callback) {
  var userCollection = db.collection('users');
  userCollection.deleteMany({firstName: 'Molly'}, function (err, result) {
    if (!err) {
      console.log(result);
      callback();
    } else {
      throw new Error(err);
    }
  });
}


function removeQuestions (db, callback) {
  var questionCollection = db.collection('questions');
  questionCollection.deleteMany({}, function (err, result) {
    if (!err) {
      console.log(result);
      callback();
    } else {
      throw new Error(err);
    }
  });
}

function showAllUsers (db, callback) {
  var userCollection = db.collection('users');
  userCollection.find({}).toArray(function (err, results) {
    if (!err) {
      console.log(results);
      callback();
    } else {
      throw new Error(err);
    }
  });
} 

function showAllQuestions (db, callback) {
  var questionCollection = db.collection('questions');
  questionCollection.find({}).toArray(function (err, results) {
    if (!err) {
      console.log(results);
      callback();
    } else {
      throw new Error(err);
    }
  });
} 

function getNextSequence (name, db, callback) {
  db.collection("counters").findAndModify(
    { '_id': name }, // look for document with this _id = name
    [['_id', 1]], // sort for duplicates (basically unused)
    { '$inc': { 'seq': 1 } }, // increment specified value
    { new: true }, // not sure what this does; check the shitty docs
    function (err, doc) {
      if (!err) {
        console.log("next question index: " + doc.value.seq);
        callback(doc.value.seq);
      } else {
        console.error(err);
      }
    }
  );
}

function removeAllAnswers (db, callback) {
  db.collection('answers').remove({}, function (err, result) {
    if (!err) {
      console.log(result);
      callback();
    } else {
      throw new Error(err);
    }
  });
}

function addAnswer1 (db, callback) {
  getNextSequence('answerID', db, function (nextAnswerID) {
    db.collection('answers').insert({
      _id: nextAnswerID,
      amt: -4,
      body: 'Wow u suk',
      name: 'Jacob Merizian',
      userID: 'jacob.merizian',
      date: new Date(),
      accepted: false,
      comments: []
    }, function (err, result) {
      if (!err) {
        console.log(result);
        callback();
      } else {
        throw new Error(err);
      }
    });
  });
}

function addComment1 (db, callback) {
  getNextSequence('commentID', db, function (nextCommentID) {
    db.collection('comments').insert({
      _id: nextCommentID,
      body: 'fkudolphiin!',
      name: 'Molly LastName',
      date: new Date(),
      userID: 'molly.lastname',
      answer: 1
    }, function (err, result) {
      console.log(result);
      callback();
    });
  });
}

MongoClient.connect(url, function(err, db) {
  if (!err) {
    console.log("Connected successfully to mongodb server!");

    addComment1(db, function () {
      db.close();
    });

  } else {
    console.error(err);
  }
});
