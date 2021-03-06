var MongoClient = require('mongodb').MongoClient;
var sha256 = require('sha256');
var express = require('express');
var app = express();
var ax = require('axios');
var nodemailer = require('nodemailer');
var fs = require('fs');

var cors = require('cors');
app.use(cors());

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var url = 'mongodb://localhost:27017/askahokie';

var port = 3010;

var browser_code = sha256('apples');

var questions_offset = 4;

MongoClient.connect(url, function (err, db) {
  if (!err) {
    console.log("Connected to MongoDB server.");
    setupExpress(db);
  } else {
    throw new Error(err);
  }
});

function setupExpress (db) {
  // serve all static files
  app.use('/static', express.static('./dist/static'));

  // get information about a user
  app.get('/getProfile/:userID', function (req, res) {
    findUser(req.params.userID, db, function (result) {
      if (result) {
        addToLog('getProfile', req.get('host') + req.originalUrl, req.query.email, req.query.userID, db, function (err) {
          res.send({
            blockInfo: {
              name: result.firstName + ' ' + result.lastName,
              pic: result.pic,
              hokieRank: result.hokieRank,
              dateJoined: formatDate(result.dateJoined),
              peopleReached: result.peopleReached
            },
            otherStats: {
              totalQuestions: result.questions ? result.questions.length : -999,
              totalAnswers: result.answers ? result.answers.length : -999,
              totalQuestionUpvotes: -1,
              totalAnswerUpvotes: -1
            },
            questionTags: [
              {amt: '--', title: '--'},
              {amt: '--', title: '--'}
            ]
          });
        });
      } else {
        res.send({
          error: "User not found!"
        });
      }

    });
  });

  app.get('/getQuestionInfo/:questionID', function (req, res) {
    findQuestion(parseInt(req.params.questionID), db, function (questionDoc) {
      if (questionDoc) {
        questionDoc.date = formatDate(questionDoc.date);
        findAnswers(parseInt(req.params.questionID), db, function (answerObjects) {
          addToLog('getQuestionInfo', req.get('host') + req.originalUrl, req.query.email, req.query.userID, db, function (err) {
            res.send({
              questionInfo: questionDoc,
              answers: answerObjects
            }); 
          });
        });
      } else {
        res.send({err: 'Question not found!'}); 
      }
    });
  });

  app.get('/getRecentQuestions', function (req, res) {
    getRecentQuestions(db, function (results) {
      results.map(function (result) {
        result.date = formatDate(result.date);
        return result;
      });
      addToLog('getRecentQuestions', req.get('host') + req.originalUrl, req.query.email, req.query.userID, db, function (err) {
        res.send({results: results});
      });
    });
  });

  app.get('/getPopularQuestions', function (req, res) {
    getPopularQuestions(db, function (results) {
      results.map(function (result) {
        result.date = formatDate(result.date);
        return result;
      });
      // uniqueword
      addToLog('getPopularQuestions', req.get('host') + req.originalUrl, req.query.email, req.query.userID, db, function (err) {
        res.send({results: results});
      });
    });
  });

  app.get('/addNewAnswer', function (req, res) {
    // requires sessionToken, body, name, userID,
    // email, and questionID
    var answerInfo = {
      amt: 0,
      body: req.query.body,
      userID: req.query.userID,
      date: new Date(),
      accepted: false,
      upVoters: [],
      downVoters: [],
      question: parseInt(req.query.questionID)
    };
    verifySession(req.query.email, req.query.sessionToken, db, function (verified) {
      if (verified) {
        findUser(req.query.userID, db, function (userDoc) {
          answerInfo.name = userDoc.firstName + ' ' + userDoc.lastName;
          addNewAnswer(answerInfo, req.query.userID, parseInt(req.query.questionID), db, function (err, result) {
            answerInfo.date = formatDate(answerInfo.date);
            answerInfo.comments = [];
            addToLog('addAnswer', req.get('host') + req.originalUrl, req.query.email, req.query.userID, db, function (err) {
              res.send({err: err, answerInfo: answerInfo});
            });
          });
        });
      } else {
        res.send({err: "User session is invalid!"})
      }
    });
  });

  app.get('/addNewComment', function (req, res) {
    var commentInfo = {
      body: req.query.body,
      userID: req.query.userID,
      date: new Date(),
      answer: parseInt(req.query.answerID)
    };
    verifySession(req.query.email, req.query.sessionToken, db, function (verified) {
      if (verified) {
        findUser(req.query.userID, db, function (userDoc) {
          commentInfo.name = userDoc.firstName + ' ' + userDoc.lastName;
          addNewComment(commentInfo, req.query.userID, parseInt(req.query.answerID), db, function (err, result) {
            if (!err) {
              commentInfo.date = formatDate(commentInfo.date);
              addToLog('addComment', req.get('host') + req.originalUrl, req.query.email, req.query.userID, db, function (err) {
                res.send({err: err, commentInfo: commentInfo});
              });
            } else {
              res.send({err, err});
            }
          })
        });
      } else {
        res.send({err: "User session is invalid!"})
      }
    });
  });

  app.get('/addNewQuestion', function (req, res) {
    if (req.query.title.length < 5) {
      res.send({err: 'The question is too short!'});
    } else if (req.query.title.length > 255) {
      res.send({err: 'The question is too long!'});
    } else if (req.query.body > 5000) {
      res.send({err: 'The body is too long!'});
    } else if (req.query.body < 10) {
      res.send({err: 'The body is too short!'});
    } else if (req.query.group === 'default') {
      res.send({err: 'Please select a group!'});
    } else {
      var questionInfo = {
        title: req.query.title,
        body: req.query.body,
        userID: req.query.userID,
        date: new Date(),
        amt: 0,
        upVoters: [],
        downVoters: [],
        groupID: parseInt(req.query.group)
      };
      verifySession(req.query.email, req.query.sessionToken, db, function (verified) {
        if (verified) {
          findUser(req.query.userID, db, function (userDoc) {
            questionInfo.name = userDoc.firstName + ' ' + userDoc.lastName;
            addNewQuestion(questionInfo, req.query.userID, db, function (err, result) {
              addToLog('addQuestion', req.get('host') + req.originalUrl, req.query.email, req.query.userID, db, function (err) {
                res.send({err: err, questionInfo: questionInfo});
              });
            });
          });
        } else {
          res.send({err: 'Invalid session!'});
        }
      });
    }
  });

  app.get('/addNewUser', function (req, res) {
    userInfo = {};
    userInfo.firstName = req.query.firstName;
    userInfo.lastName = req.query.lastName;
    userInfo.email = req.query.email;
    userInfo.major = req.query.major;
    userInfo.verificationCode = Math.floor(Math.random() * 10000);
    // sanitize inputs:
    if (!userInfo.firstName || userInfo.firstName == '') {
      res.send({err: 'Please enter your first name!'});
    } else if (!userInfo.lastName || userInfo.lastName == '') {
      res.send({err: 'Please enter your last name!'});
    } else if (!userInfo.email || userInfo.email == '') {
      res.send({err: 'Please enter your email!'});
    } else if (!req.query.password || userInfo.password == '') {
      res.send({err: 'Please enter a password!'});
    } else if (req.query.password.length < 7) {
      res.send({err: 'Password is too short!'});
    } else if (!/@vt\.edu$/.test(userInfo.email)) {
      res.send({err: 'Must use a "@vt.edu" email!'});
    } else if (req.query.major === 'default') {
      res.send({err: 'Please select a major!'});
    } else {
      // userID still must be checked in case it matches another person
      userInfo.userID = (userInfo.firstName + '.' + userInfo.lastName).replace(/\s/g, '').toLowerCase();
      // encrypt password
      userInfo.enc_pass = sha256(req.query.password);
      // add user init info
      userInfo.dateJoined = new Date();
      userInfo.hokieRank = 69;
      userInfo.peopleReached = 0;
      userInfo.pic = '';
      findUserArray(userInfo.userID, db, function (userDocs) {
        // change userID if other people have to same name
        if (userDocs.length != 0) {
          userInfo.userID = userInfo.userID + (userDocs.length);
        }
        // check if email has been used
        findUserByEmail(userInfo.email, db, function (err, results) {
          if (results) {
            res.send({err: 'Email already in use!'});
          } else {
            addNewUser(userInfo, db, function (err, result) {
              addToLog('signup', req.get('host') + req.originalUrl, req.query.email, req.query.userID, db, function (err) {
                res.send({err: err, userInfo: userInfo});
              });
            });
          }
        });
      });
    }
  });

//  app.get('/signup2', function (req, res) {
//    userInfo = {};
//    userInfo.email = req.query.email;
//    if (!userInfo.email || userInfo.email == '') {
//      res.send({err: 'Please enter your email!'});
//    } else if (!req.query.password || userInfo.password == '') {
//      res.send({err: 'Please enter a password!'});
//    } else if (req.query.password.length < 7) {
//      res.send({err: 'Password is too short!'});
//    } else if (!/@vt\.edu$/.test(userInfo.email)) {
//      res.send({err: 'Must use a "@vt.edu" email!'});
//    } else {
//    ax.get('https://webapps.middleware.vt.edu/peoplesearch/JsonSearch?query=' + userInfo.email)
//      .then(function (vtResults) {
//        if (vtResults.data.length != 1) {
//          res.send({err: 'Invalid Virginia Tech email!'});
//        } else {
//          userInfo.firstName = vtResults.data[0].givenName[0];
//          userInfo.lastName = vtResults.data[0].sn[0];
//          userInfo.major = vtResults.data[0].major;
//          // userID still must be checked in case it matches another person
//          userInfo.userID = (userInfo.firstName + '.' + userInfo.lastName).replace(/\s/g, '').toLowerCase();
//          // encrypt password
//          userInfo.enc_pass = sha256(req.query.password);
//          // add user init info
//          userInfo.dateJoined = new Date();
//          userInfo.hokieRank = 69;
//          userInfo.peopleReached = 0;
//          userInfo.pic = 'lightblue';
//          findUserArray(userInfo.userID, db, function (userDocs) {
//            // change userID if other people have to same name
//            if (userDocs.length != 0) {
//              userInfo.userID = userInfo.userID + (userDocs.length);
//            }
//            // check if email has been used
//            findUserByEmail(userInfo.email, db, function (err, results) {
//              if (results) {
//                res.send({err: 'Email already in use!'});
//              } else {
//                addNewUser(userInfo, db, function (err, result) {
//                  res.send({err: err, userInfo: userInfo});
//                });
//              }
//            });
//          });
//        }
//      });
//    }
//  });

  app.get('/getSession', function (req, res) {
    // requires enc_password, email
    var email = req.query.email;
    var password = req.query.password
    if (email && password) {
      verifyPassword(email, password, db, function (verified, userID) {
        if (verified) {
          checkEmailVerified(email, db, function (emailVerified) {
            if (emailVerified) {
              createSession(email, db, function (sessionToken) {
                var censoredUrl = req.originalUrl.substring(0, req.originalUrl.indexOf('&password=') + 10) + '***';
                addToLog('getSession', req.get('host') + censoredUrl, req.query.email, req.query.userID, db, function (err) {
                  res.send({
                    sessionToken: sessionToken,
                    verified: verified,
                    userID: userID
                  });
                });
              });
            } else {
              res.send({error: "verify email"});
            }
          });
        } else {
          res.send({error: "Wrong password or username!"});
        }
      });
    } else {
      res.send({error: "A field was undefined!"});
    }
  });

  app.get('/getQuickSearchResults/:query', function (req, res) {
    getQuickSearchResults(req.params.query, db, function (results) {
      results = results.slice(0, 5);
      results.map(function (result) {
        result.date = formatDate(result.date);
        return result;
      });
      res.send({results: results});
    });
  });

  app.get('/getSearchResults/:query', function (req, res) {
    getSearchResults(req.params.query, db, function (results) {
      results.map(function (result) {
        result.date = formatDate(result.date);
        return result;
      });
      addToLog('searchQuery', req.get('host') + req.originalUrl, req.query.email, req.query.userID, db, function (err) {
        res.send({err: err, results: results});
      });
    });
  });

  app.get('/getPopularQuestionsByGroup/', function (req, res) {
    getPopularQuestionsByGroup(parseInt(req.query.group), db, function (results) {
      results.map(function (result) {
        result.date = formatDate(result.date);
        return result;
      });
      res.send({results: results});
    });
  });

  app.get('/getRecentQuestionsByGroup/', function (req, res) {
    getRecentQuestionsByGroup(parseInt(req.query.groupID), db, function (results) {
      results.map(function (result) {
        result.date = formatDate(result.date);
        return result;
      });
      res.send({results: results});
    });
  });

  app.get('/updateQuestionAmt/', function (req, res) {
    var change = parseInt(req.query.change);
    if (change == -1 || change == 1) {
      var questionID = parseInt(req.query.questionID);
      verifySession(req.query.email, req.query.sessionToken, db, function (verified) {
        if (verified) {
          updateAmt('questions', questionID, change, req.query.email, db, function (err, results) {
            addToLog('updateQuestionAmt', req.get('host') + req.originalUrl, req.query.email, req.query.userID, db, function (err) {
              res.send({err: err});
            });
          });
        } else {
          res.send({err: "Invalid session!"});
        }
      });
    } else {
      res.send({err: "Invalid change amount!"});
    }
  });

  app.get('/updateAnswerAmt/', function (req, res) {
    var change = parseInt(req.query.change);
    if (change == -1 || change == 1) {
      var answerID = parseInt(req.query.answerID);
      verifySession(req.query.email, req.query.sessionToken, db, function (verified) {
        if (verified) {
          updateAmt('answers', answerID, change, req.query.email, db, function (err, results) {
            addToLog('updateAnswerAmt', req.get('host') + req.originalUrl, req.query.email, req.query.userID, db, function (err) {
              res.send({err: err});
            });
          });
        } else {
          res.send({err: "Invalid session!"});
        }
      });
    } else {
      res.send({err: "Invalid change amount!"});
    }
  });

  app.get('/changeProfilePic', function (req, res) {
    verifySession(req.query.email, req.query.sessionToken, db, function (verified) {
      if (verified) {
        updateProfilePic(req.query.email, req.query.url, db, function (err) {
          res.send({err: err});
        });
      } else {
        res.send({err: "Invalid session!"});
      }
    });
  });

  app.get('/getMajors', function (req, res) {
    getMajors(db, function (results) {
      res.send({results: results});
    });
  });


  app.get('/visitedNewQuestionPage', function (req, res) {
    addToLog('visitedNewQuestionPage', req.get('host') + req.originalUrl, req.query.email, req.query.userID, db, function (err) {
      res.send({err: err});
    });
  });

  app.get('/getLast100Logs', function (req, res) {
    if (req.query.userID == 'jacob.merizian') {
      getLast100Logs(db, function (err, result) {
        res.send({result: result});
      });
    } else {
      res.send({err: "You don't have access to this page!"});
    }
  });

  app.get('/verifyEmail', function (req, res) {
    verifyEmail(req.query.code, req.query.email, db, function (err, result) {
      res.send({err: err});
    });
  });

  app.get('/emailVerificationCode', function (req, res) {
    fs.readFile('pass.txt', 'utf8', function (err, data) {
      //console.log(data.slice(0, data.length - 1));
      var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'jmerizia@vt.edu',
          pass: data
        }
      });
      findUserByEmail(req.query.email, db, function (err, userInfo) {
        if (!err) {
          transport.sendMail({
            from: 'Jake <jake@hokie.io>',
            to: req.query.email,
            subject: 'Hokie.IO - Verification Code',
            text: userInfo.firstName + ',\n\nThanks for signing up for Hokie.IO!\n\n' +
              'Your verification code is ' + userInfo.verificationCode +
              '\n\nSincerely,\n\nJake, the creator of Hokie.IO'
          }, function (err, responseStatus) {
            if (err) {
              res.send({err: err});
            } else {
              res.send({responseStatus, responseStatus});
            }
          });
        } else {
          res.send({err: err});
        }
      });
    });
  });

  // GROUP OPERATIONS:

  app.get('/getGroups', function (req, res) {
    getGroups(db, function (results) {
      res.send({results: results});
    });
  });

  app.get('/addNewGroup', function (req, res) {
    var groupInfo = {};
    groupInfo.title = req.query.title;
    groupInfo.creator = req.query.userID;
    groupInfo.motd = req.query.motd;
    groupInfo.date = new Date();
    verifySession(req.query.email, req.query.sessionToken, db, function (verified) {
      if (verified) {
        getNextSequence('groupID', db, function (nextGroupID) {
          groupInfo._id = nextGroupID;
          db.collection('groups')
            .insert(groupInfo, function (err, result) {
              if (!err) {
                addUserToGroup(req.query.userID, nextGroupID, db, function (err, result) {
                  res.send({err: err, result: result, groupID: nextGroupID});
                });
              } else {
                console.error(err);
              }
            });
        });
      } else {
        res.send({err: "Invalid session!"});
      }
    });
  });

  app.get('/getGroupsForUser', function (req, res) {
    db.collection('userGroups')
      .find({userID: req.query.userID})
      .toArray(function (err, userGroupDocs) {
        var groupIDs = userGroupDocs.map(function (userGroupDoc) {
          return userGroupDoc.groupID;
        });
        db.collection('groups')
          .find({_id: {$in: groupIDs}})
          .toArray(function (err, groupDocs) {
            res.send({err: err, results: groupDocs});
          });
      });
  });

  app.get('/getUsersInGroup', function (req, res) {
    db.collection('userGroups')
      .find({groupID: req.query.groupID})
      .toArray(function (err, userGroupDocs) {
        var userIDs = userGroupDocs.map(function (userGroupDoc) {
          return userGroupDoc.userID;
        });
        db.collection('users')
          .find({userID: {$in: userIDs}})
          .toArray(function (err, userDocs) {
            res.send({err: err, results: userDocs});
          });
      });
  });

  app.get('/checkIfUserInGroup', function (req, res) {
    checkIfUserInGroup(req.query.userID, parseInt(req.query.groupID), db, function (err, isInGroup) {
      res.send({err: err, isInGroup: isInGroup})
    });
  });

  app.get('/joinGroup', function (req, res) {
    verifySession(req.query.email, req.query.sessionToken, db, function (verified) {
      if (verified) {
        addUserToGroup(req.query.userID, parseInt(req.query.groupID), db, function (err, result) {
          res.send({err: err, result: result});
        });
      } else {
        res.send({err: 'Invalid session!'});
      }
    });
  });

  app.get('/getGroup', function (req, res) {
    db.collection("groups")
      .findOne({_id: parseInt(req.query.group)}, function (err, result) {
        if (!err) {
          res.send({group: result});
        } else {
          console.error(err);
        }
      });
  });

  app.get('/getMoreRecent', function (req, res) {
    db.collection('questions')
      .find({})
      .sort({_id: -1})
      .skip(parseInt(req.query.skip))
      .limit(10)
      .toArray(function (err, results) {
        results.map(function (result) {
          result.date = formatDate(result.date);
          return result;
        })
        res.send({results: results});
      });
  });

  app.get('/getMorePopular', function (req, res) {
    db.collection('questions')
      .find({})
      .sort({amt: -1})
      .skip(parseInt(req.query.skip))
      .limit(10)
      .toArray(function (err, results) {
        results.map(function (result) {
          result.date = formatDate(result.date);
          return result;
        });
        res.send({results: results});
      });
  });

  app.get('/getMoreRecentByGroup', function (req, res) {
    db.collection('questions')
      .find({groupID: parseInt(req.query.group)})
      .sort({_id: -1})
      .skip(parseInt(req.query.skip))
      .limit(10)
      .toArray(function (err, results) {
        results.map(function (result) {
          result.date = formatDate(result.date);
          return result;
        });
        db.collection('groups')
          .findOne({_id: parseInt(req.query.group)}, function (err, groupDoc) {
            res.send({results: results, groupTitle: groupDoc.title});
          });
      });
  });

  app.get('/getMorePopularByGroup', function (req, res) {
    db.collection('questions')
      .find({groupID: parseInt(req.query.group)})
      .sort({amt: -1})
      .skip(parseInt(req.query.skip))
      .limit(10)
      .toArray(function (err, results) {
        results.map(function (result) {
          result.date = formatDate(result.date);
          return result;
        });
        db.collection('groups')
          .findOne({_id: parseInt(req.query.group)}, function (err, groupDoc) {
            res.send({results: results, groupTitle: groupDoc.title});
          });
      });
  });

  app.get('/removeUserFromGroup', function (req, res) {
    verifySession(req.query.email, req.query.sessionToken, db, function (verified) {
      if (verified) {
        removeUserFromGroup(req.query.userID, parseInt(req.query.groupID), db, function (err, result) {
          res.send({err: err, result: result});
        })
      } else {
        res.send({err: "Invalid session!"})
      }
    })
  });

  app.get('/editMotd', function (req, res) {
    verifySession(req.query.email, req.query.sessionToken, db, function (verified) {
      if (verified) {
        checkIfUserInGroup(req.query.userID, parseInt(req.query.groupID), db, function (err, isInGroup) {
          if (!err) {
            if (isInGroup) {
              db.collection('groups')
                .update({_id: parseInt(req.query.groupID)}, {$set: {
                  motd: req.query.newMotd
                }}, function (err, result) {
                  res.send({err: err, result: result})
                });
            } else {
              res.send({err: "You are not in this group!"});
            }
          } else {
            res.send({err: err});
          }
        });
      } else {
        res.send({err: "Invalid session!"})
      }
    });
  });

  app.get('/getSubLevel', function (req, res) {
    verifySession(req.query.email, req.query.sessionToken, db, function (verified) {
      if (verified) {
        db.collection('users')
          .findOne({userID: req.query.userID}, function (err, userDoc) {
            if (userDoc) {
              res.send({err: err, subLevel: userDoc.subLevel});
            } else {
              res.send({err: "Invalid userID!"});
            }
          });
      } else {
        res.send({err: "Invalid session!"});
      }
    })
  });

  app.get('/changeSubLevel', function (req, res) {
    verifySession(req.query.email, req.query.sessionToken, db, function (verified) {
      if (verified) {
        db.collection('users')
          .update({
            userID: req.query.userID
          }, {
            $set: {subLevel: req.query.subLevel}
          }, function (err, result) {
            if (!err) {
              res.send({result: result});
            } else {
              res.send({err: err});
            }
          });
      } else {
        res.send({err: "Invalid session!"});
      }
    });
  });

  // This is a catch all which serves the index.html
  // file to all other routes. That way, route handling
  // can be done with the front end
  app.get('/*', function (req, res) {
    addToLog('initial', req.get('host') + req.originalUrl, null, null, db, function (err) {
      if (!err) {
        res.sendFile(__dirname + '/dist/index.html');
      } else {
        res.send({err: err})
      }
    });
  });

  app.listen(port, function () {
    console.log("Magic is happening on port " + port);
  });

}

function findUser (userID, db, callback) {
  var userCollection = db.collection('users');
  userCollection.findOne({userID: userID}, function (err, results) {
    if (!err) {
      callback(results);
    } else {
      console.error(err);
    }
  });
}

function findUserByEmail(email, db, callback) {
  db.collection('users')
    .findOne({email: email}, function (err, results) {
      callback(err, results);
    })
}

function findUserArray (userID, db, callback) {
  db.collection('users')
    .find({userID: userID}).toArray(function (err, results) {
      if (!err) {
        callback(results);
      } else {
        console.error(err);
      }
    });
}

function getRecentQuestions (db, callback) {
  db.collection('questions')
    .find({})
    .sort({_id: -1})
    .limit(6)
    .toArray(function (err, results) {
    if (!err) {
      callback(results);
    } else {
      console.error(err);
    }
  });
}

function formatDate (dateObj) {
  if (!dateObj) {
    return undefined;
  }
  // convert to local VT time (-4 hours)
  // dateObj.setMinutes(dateObj.getMinutes() - 240);
  var currentDate = new Date();
  var months = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'
  ];
  var day = dateObj.getDate();
  var month = months[dateObj.getMonth()];
  var year = dateObj.getFullYear();
  var hours = dateObj.getHours();
  var minutes = dateObj.getMinutes();
  var time = (hours % 12 == 0 ? 12 : hours % 12) + ":" + (minutes < 10 ? "0" : "") + minutes + (hours < 12 ? "am" : "pm");
  if (day == currentDate.getDate() && dateObj.getMonth() == currentDate.getMonth()) {
    return 'Today' + ' at ' + time;
  } if (day == currentDate.getDate() - 1 && dateObj.getMonth() == currentDate.getMonth()) {
    return 'Yesterday' + ' at ' + time;
  } else if (year == currentDate.getFullYear()) {
    return month + ' ' + day;
  } else {
    return month + ' ' + day + ', ' + year;
  } 
}

function findQuestion (questionID, db, callback) {
  db.collection('questions')
    .findOne(
      {_id: questionID},
      function (err, results) {
        if (!err) {
          callback(results);
        } else {
          console.error(err)
        }
      }
    );
}

function findAnswers(questionID, db, callback) {
  db.collection('answers')
    .find({question:questionID})
    .toArray(function (err, answerDocs) {
      answerIDs = [];
      answerDocs.forEach(function (answerDoc) {
        answerIDs.push(answerDoc._id);
      });
      findCommentsForManyAnswers(answerIDs, db, function (commentObjectsByAnswer) {
        answerDocs.map(function (answerDoc) {
          answerDoc.date = formatDate(answerDoc.date);
          answerDoc.comments = commentObjectsByAnswer[answerDoc._id.toString()];
          return answerDoc;
        });
        callback(answerDocs);
      });
    });
}

function findCommentsForManyAnswers(answerIDs, db, callback) {
  db.collection('comments')
    .find({answer: {"$in": answerIDs}})
    .toArray(function (err, commentDocs) {
      commentObjectsByAnswer = {};
      commentDocs.forEach(function (commentDoc) {
        var answerID = commentDoc.answer;
        // format date:
        commentDoc.date = formatDate(commentDoc.date);
        if (commentObjectsByAnswer.hasOwnProperty(answerID.toString())) {
          // answerID has been used
          commentObjectsByAnswer[answerID].push(commentDoc);
        } else {
          // answerID has not been used
          commentObjectsByAnswer[answerID] = [commentDoc];
        }
      });
      // check that all answerIDs are accounted for 
      answerIDs.forEach(function (answerID) {
        if (!commentObjectsByAnswer.hasOwnProperty(answerID)) {
          commentObjectsByAnswer[answerID] = [];
        }
      });
      callback(commentObjectsByAnswer);
    });
}

function addNewAnswer(answerInfo, userID, questionID, db, callback) {
  db.collection('answers')
    .findOne({$and: [{userID: userID}, {question: questionID}]}, function (err, result) {
      if (false && result) { // for now, don't limit users
        callback("Cannot post another answer!")
      } else {
        getNextSequence('answerID', db, function (nextAnswerID) {
          answerInfo._id = nextAnswerID;
          db.collection('answers').insert(answerInfo, function (err, result) {
            // send callback, THEN send email (faster)
            callback(err, result);
            // check subscription level
            isSubscribedTo(userID, "answers", db, function (isSubscribed) {
              if (isSubscribed) {
                // get information about question poster
                db.collection('questions')
                  .findOne({_id: questionID}, function (err, questionDoc) {
                    db.collection('users')
                      .findOne({userID: questionDoc.userID}, function (err, userDoc) {
                        // generate and send email
                        var email = userDoc.email;
                        var subject = 'Somebody answered your question!';
                        var message = userDoc.firstName + ',<br /><br />' +
                          '<p>Your question: <b>' + questionDoc.title +
                          '</b> was answered!</p>' +
                          '<p>Click the following link to see their response!</p>' +
                          '<p><a href="https://hokie.io/question/' +
                          questionDoc._id + '">https://hokie.io/question/' +
                          questionDoc._id + '</a></p><br />' +
                          'Sincerely,<br /><br />' +
                          'Jake, the creator of Hokie.IO';
                        sendEmail(email, subject, message, db,
                          function (err, result) {
                          });
                      });
                  });
              }
            });
          });
        });
      }
    });
}

function addNewComment(commentInfo, userID, answerID, db, callback) {
  db.collection('comments')
    .findOne({$and: [{userID: userID}, {answer: answerID}]}, function (err, result) {
      if (false && result) { // for now, don't limit users
        callback("Cannot post another comment!");
      } else {
        getNextSequence('commentID', db, function (nextCommentID) {
          commentInfo._id = nextCommentID;
          db.collection('comments').insert(
            commentInfo,
            function (err, result) {
              callback(err, result)

//              // check subscription level
//              isSubscribedTo(userID, "comments", db, function (isSubscribed) {
//                if (isSubscribed) {
//                  // get information about question poster
//                  db.collection('questions')
//                    .findOne({_id: questionID}, function (err, questionDoc) {
//                      db.collection('users')
//                        .findOne({userID: questionDoc.userID}, function (err, userDoc) {
//                          // generate and send email
//                          var email = userDoc.email;
//                          var subject = 'Somebody answered your question!';
//                          var message = userDoc.firstName + ',<br /><br />' +
//                            '<p>Somebody left a comment on your answer: <b>'
//                            + questionDoc.title +
//                            '</b></p>' +
//                            '<p>Click the following link to see what they said!</p>' +
//                            '<p><a href="https://hokie.io/question/' +
//                            questionDoc._id + '">https://hokie.io/question/' +
//                            questionDoc._id + '</a></p><br />' +
//                            'Sincerely,<br /><br />' +
//                            'Jake, the creator of Hokie.IO';
//                          sendEmail(email, subject, message, db,
//                            function (err, result) {
//                            });
//                        });
//                    });
//                }
//              });
            }
          );
        });
      }
    });
}

function addNewQuestion(questionInfo, userID, db, callback) {
  getNextSequence('questionID', db, function (nextQuestionID) {
    questionInfo._id = nextQuestionID;
    db.collection('questions').insert(
      questionInfo,
      function (err, result) {
        callback(err, result);
        // get users in group
        // and send them all users
      }
    );
  });
}

function addNewUser(userInfo, db, callback) {
  getNextSequence('userID', db, function (nextUserID) {
    userInfo._id = nextUserID;
    db.collection('users')
      .insert(userInfo, function (err, result) {
        callback(err, result);
      });
  });
}

function verifyPassword(email, password, db, callback) {
  db.collection('users').findOne({"email": email}, function (err, result) {
    if (!err) {
      if (result) {
        callback(result.enc_pass == sha256(password), result.userID);
      } else {
        callback(false, null);
      }
    } else {
      console.error(err);
    }
  })
}

function checkEmailVerified(email, db, callback) {
  db.collection('users').findOne({'email': email}, function (err, result) {
    if (!err) {
      if (result) {
        callback(result.emailVerified);
      } else {
        callback(false);
      }
    }
  });
}

function createSession(email, db, callback) {
  db.collection('sessions')
    .findOne({"email": email}, function (err, result) {
      if (!err) {
        // generate session token:
        var randomInt = Math.floor(Math.random() * 100000000);
        var sessionToken = sha256(email + randomInt);
        if (result) {
          db.collection('sessions')
            .update(
              {"email": email},
              {"$set": {"sessionToken": sessionToken, "dateCreated": new Date()}},
              function (err, result) {
                if (!err) {
                  callback(sessionToken);
                } else {
                  console.error(err);
                }
              });
        } else {
          db.collection('sessions')
            .insert({
              "email": email,
              "sessionToken": sessionToken,
              "dateCreated": new Date()
            }, function (err, result) {
              if (!err) {
                callback(sessionToken);
              } else {
                console.error(err);
              }
            });
        }
      } else {
        console.error(err);
      }
    });
}

function verifySession (email, sessionToken, db, callback) {
  db.collection('sessions')
    .findOne({email: email}, function (err, result) {
      if (!err) {
        callback(!!result && sessionToken == result.sessionToken);
      } else {
        console.error(err);
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
        callback(doc.value.seq);
      } else {
        console.error(err);
      }
    }
  );
}

function updateAmt(collection, ID, change, email, db, callback) {
  // check through up voters and down voters in question doc
  // if change==1:
  //   if user in upvoters: send duplicate error
  //   if user in downvoters: remove from downvoters and increment
  //   else: add to upvoters and increment
  // if change==0:
  //   if user in downvoters: send duplicate error
  //   if user in upvoters: remove from upvoters and decrement
  //   else: add to down voters and decrement
  db.collection('users')
    .findOne({email: email}, function (err, userDoc) {
      db.collection(collection)
        .findOne({_id: ID}, function (err, questionDoc) {
          var userAlreadyUpVoted = false;
          var userAlreadyDownVoted = false;
          // check up votes:
          questionDoc.upVoters.forEach(function (upVoter) { // expensive
            if (upVoter == email) {
              userAlreadyUpVoted = true;
            }
          });
          // check down votes:
          questionDoc.downVoters.forEach(function (downVoter) { // expensive
            if (downVoter == email) {
              userAlreadyDownVoted = true;
            }
          });
          if (change == 1) {
            if (userAlreadyUpVoted) {
              // send duplicate error
              callback("Cannot upvote a second time!");
            } else if (userAlreadyDownVoted) {
              // remove from downvoters and increment
              var newDownVoters = [];
              questionDoc.downVoters.forEach(function (downVoter) {
                if (downVoter != email) {
                  newDownVoters.push(email);
                }
              });
              db.collection(collection)
                .update({_id: ID}, {$set: {downVoters: newDownVoters}}, function (err, result) {
                  changeVoterAmt(collection, ID, change, db, function (err) {
                    callback(err);
                  });
                });
            } else {
              // add to up voters and increment
              db.collection(collection)
                .update({_id: ID}, {$push: {upVoters: email}}, function (err, result) {
                  changeVoterAmt(collection, ID, change, db, function (err) {
                    callback(err);
                  });
                });
            }
          } else {
            if (userAlreadyDownVoted) {
              // send duplicate error
              callback("Cannot downvote a second time!");
            } else if (userAlreadyUpVoted) {
              // remove from upvoters and decrement
              var newUpVoters = [];
              questionDoc.upVoters.forEach(function (upVoter) {
                if (upVoter != email) {
                  newUpVoters.push(email);
                }
              });
              db.collection(collection)
                .update({_id: ID}, {$set: {upVoters: newUpVoters}}, function (err, result) {
                  changeVoterAmt(collection, ID, change, db, function (err) {
                    callback(err);
                  });
                });
            } else {
              // add to down voters and decrement
              db.collection(collection)
                .update({_id: ID}, {$push: {downVoters: email}}, function (err, result) {
                  changeVoterAmt(collection, ID, change, db, function (err) {
                    callback(err);
                  });
                });
            }
          }
        });
    });
}

function changeVoterAmt (collection, ID, change, db, callback) {
  db.collection(collection)
    .update({_id: ID}, {
      '$inc': {'amt': change}
    }, function (err, result) {
      callback(err);
    });
}

function getQuickSearchResults (query, db, callback) {
  // EVENTUALLY, this code must be rewritten in order
  // to account for a large amount of questions. In order
  // to stay lean, I just use regex :P
  // But yes, I admit, this is a 0(n^99) clusterfuck

  db.collection('questions').find({}).toArray(function (err, questionDocs) {
    if (!err) {
      var matching = [];
      var reArr = [];
      var matchCount = 0;
      // remove stop words:
      var stopwords = "a an and are as at be but by for if in into is it no not of on or s such t that the their then there these they this to was will with".split(' ');
      var queryWithoutStop = [];
      query.split(' ').forEach(function (word) {
        if (stopwords.indexOf(word) == -1) {
          queryWithoutStop.push(word.toLowerCase());
        }
      });
      
      queryWithoutStop.forEach(function (queryWord) {
        reArr.push(new RegExp(queryWord));
      });
      questionDocs.forEach(function (questionDoc) { // this is is very expensive
        matchCount = 0;
        reArr.forEach(function (re) {
          if (re.test(questionDoc.title.toLowerCase())) {
            matchCount++;
          }
        });
        var score = matchCount / parseFloat(reArr.length);
        if (score > 0.5) {
          matching.push(questionDoc);
        }
      });

      callback(matching);
    } else {
      console.error(err);
    }
  });
}

function getSearchResults (query, db, callback) {
  db.collection('questions')
    .find({$text: {$search: query}}, {score: {$meta: "textScore"}})
    .sort({score: {$meta: "textScore"}})
    .toArray(function (err, questionDocs) {
      if (!err) {
        callback(questionDocs.slice(0, 30));
      } else {
        console.error(err);
      }
    });
}

function getSearchResultsByCategory (category, db, callback) {
  var questions = db.collection('questions');
  questions
    .count(function (error, numberOfQuestions) {
      questions
        .find({category: category, _id: {$gt: numberOfQuestions - 30}})
        .toArray(function (error, results) {
          callback(error, results);
        });
    });
}

function updateProfilePic (email, url, db, callback) {
  db.collection('users')
    .update({email: email}, {$set: {pic: url}}, function (err, result) {
      callback(err);
    });
}

function addToLog (logName, logInfo, email, userID, db, callback) {
  getNextSequence('logID', db, function (nextLogID) {
    db.collection('logs')
      .insert({
        _id: nextLogID,
        name: logName, 
        info: logInfo, 
        time: new Date(),
        email: email,
        userID: userID
      }, function (err, result) {
        callback(err, result)
      });
  });
}

function getLast100Logs (db, callback) {
  var logs = db.collection('logs');
  logs.count(function (error, amt) {
    logs
      .find({_id: {$gt: amt - 100}})
      .sort({_id: -1})
      .toArray(function (err, logs) {
        logs.forEach(function (log) {
          log.time = formatDate(log.time);
          return log;
        });
      callback(err, logs);
    });
  });
}

function getPopularQuestions (db, callback) {
  var questionCollection = db.collection('questions');
  questionCollection.count(function (error, numberOfQuestions) {
    questionCollection
      .find()
      .sort({amt: -1})
      .limit(6)
      .toArray(function (err, results) {
        if (!err) {
          callback(results);
        } else {
          console.error(err);
        }
    });
  });
}

function getPopularQuestionsByGroup (groupID, db, callback) {
  db.collection('questions')
    .find({groupID: groupID})
    .sort({amt: -1})
    .limit(6)
    .toArray(function (err, results) {
      if (!err) {
        callback(results);
      } else {
        console.error(err);
      }
  });
}

function getRecentQuestionsByGroup (groupID, db, callback) {
  db.collection('questions')
    .find({groupID: groupID})
    .sort({_id: -1})
    .limit(6)
    .toArray(function (err, results) {
    if (!err) {
      callback(results);
    } else {
      console.error(err);
    }
   });
}

function getMajors (db, callback) {
  var majors = db.collection('majors')
  majors
    .find()
    .toArray(function (err, results) {
      if (!err) {
        callback(results);
      } else {
        console.error(err);
      }
    });
}

function getGroups (db, callback) {
  var groups = db.collection('groups')
  groups
    .find()
    .toArray(function (err, results) {
      if (!err) {
        callback(results);
      } else {
        console.error(err);
      }
    });
}

function getSearchResultsByGroup (group, db, callback) {
  var questions = db.collection('questions');
  questions
    .find({group: group})
    .toArray(function (err, results) {
      if (!err) {
        callback(results);
      } else {
        console.error(err);
      }
    });
}

function verifyEmail (code, email, db, callback) {
  var users = db.collection('users');
  users
    .findOne({email: email}, function (err, result) {
      if (String(result.verificationCode) === code) {
        if (result) {
          users
            .update({email: email}, {$set: {emailVerified: true}}, function (err, result) {
              console.log(result);
              callback(err, result);
            })
        } else {
          callback('Invalid email!', null);
        }
      } else {
        callback('Incorrect verification code!', null);
      }
    });
}

function addUserToGroup (userID, groupID, db, callback) {
  checkIfUserInGroup(userID, groupID, db, function (err, isInGroup) {
    if (!err) {
      if (!isInGroup) {
        getNextSequence('userGroupID', db, function (nextUserGroupID) {
          db.collection('userGroups')
            .insert({
              _id: nextUserGroupID,
              userID: userID,
              groupID: groupID
            }, function (err, result) {
              callback(err, result);
            });
        });
      } else {
        callback("You are already in this group!");
      }
    } else {
      callback(err);
    }

  });
}

function removeUserFromGroup (userID, groupID, db, callback) {
  checkIfUserInGroup(userID, groupID, db, function (err, isInGroup) {
    if (!err) {
      if (isInGroup) {
        db.collection('userGroups')
          .remove({
            userID: userID,
            groupID: groupID
          }, function (err, result) {
            callback(err, result);
          });
      } else {
        callback("You are not in this group!");
      }
    } else {
      callback(err);
    }
  });
}

function checkIfUserInGroup (userID, groupID, db, callback) {
  db.collection('userGroups')
    .findOne({userID: userID, groupID: groupID}, function (err, results) {
      callback(err, !!results);
    });
}

function checkIfGroupExists(groupID, db, callback) {
  db.collection('groups')
    .find({_id: groupID})
    .toArray(function (err, groupDocs) {
      callback(err, groupDocs.length != 0);
    });
}

function sendEmail(email, subject, message, db, callback) {
  fs.readFile('pass.txt', 'utf8', function (err, data) {
    var transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jmerizia@vt.edu',
        pass: data
      }
    });
    transport.sendMail({
      from: 'Jake <jake@hokie.io>',
      to: email,
      subject: 'Hokie.IO - ' + subject,
      html: message
    }, function (err, responseStatus) {
      callback(err, responseStatus);
    });
  });
}

function isSubscribedTo(userID, sub, db, callback) {
  db.collection('users')
    .findOne({userID: userID}, function (err, userDoc) {
      if (!err) {
        if (userDoc) {
          var level = userDoc.subLevel;
          console.log(sub === 'answers');
          if (sub === 'answers') {
            callback(parseInt(level.charAt(0)) == 1);
          } else if (sub === 'comments') {
            callback(parseInt(level.charAt(1)) == 1);
          } else if (sub === 'questions') {
            callback(parseInt(level.charAt(2)) == 1);
          }
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
}
