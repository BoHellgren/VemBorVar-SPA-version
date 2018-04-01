// Send push message to registered devices
// usage: node pushmessage [appname]
// where appname defaults to husaviken
// Hit return on message prompt do just show statistics

var firebase = require('firebase');
var webPush = require('web-push');
var prompt = require('prompt');

// console.log('args: ', process.argv);
if (process.argv[2]) {
  var appname = process.argv[2];
} else {
  appname = "husarviken"
};
console.log('appname: ', appname);
// process.exit();

var config = {
  apiKey: "AIzaSyC1FttZvq19tbUtiRqRwkCeFokDb484J0A",
  authDomain: "mysubscriptiondb.firebaseapp.com",
  databaseURL: "https://mysubscriptiondb.firebaseio.com",
  projectId: "mysubscriptiondb",
  storageBucket: "",
  messagingSenderId: "170203061159"
};

firebase.initializeApp(config);
var subsdb = firebase.database();

var options = {
  gcmAPIKey: 'AAAAApVyuTs:APA91bE4xJzeSk4dbDyn9PnlxkByu4qpdQvTPKWsqRnU_08b_z4iV7tNUyA5CBA0W_x8f_rqdfwqxWuoGB8GPHzCMwaClicoSnoQ8oqSLN2wSSI4bQyuTwehLVthOQlzszXqH9N1D4Q8',
  TTL: 120,
};

var pushSubs = [];
const subs = subsdb.ref('/' + appname + '-firebaseapp-com-subs');
subs.once('value', function (snapshot) {
  // console.log('snapshot: ', snapshot);
  snapshot.forEach(function (childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    // console.log('childData: ', childData);
    if (childData.subscription) {
      var pushSub = JSON.parse(childData.subscription);
      // console.log('pushSub: ', pushSub);
      pushSubs.push(pushSub);
    };
  });
});

var ips = [];
const traces = subsdb.ref('/' + appname + '-firebaseapp-com-traces');
traces.once('value', function (snapshot) {
  // console.log('snapshot: ', snapshot);
  snapshot.forEach(function (childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    // console.log('childData: ', childData);
    if (childData.ip) {
      var ip = childData.ip;
      //console.log('ip: ',ip);
      ips.push(ip);
    };
  });
});

var schema = {
  properties: {
    msg: {
      description: 'Vänta några sekunder. Skriv sedan Meddelande från bostadsrättsföreningen',
      type: 'string',
      pattern: /^[a-zA-Z0-9åäöÅÄÖ.,!\s\-]+$/,
      message: 'Must not contain special characters.',
      required: false
    }
  }
};

prompt.start();

prompt.get(schema, function (err, result) {
  if (err) {
    console.log('prompt.get error:', err);
    return;
  };

  var uniqueSubs = [];
  // uniqueSubs[0] = pushSubs[0];
  for (i = 0; i < pushSubs.length; i++) {
    duplicate = false;
    for (j = 0; j < uniqueSubs.length; j++) {
      if (JSON.stringify(pushSubs[i]) == JSON.stringify(uniqueSubs[j])) {
        duplicate = true;
      }
    }
    if (!duplicate) uniqueSubs.push(pushSubs[i]);
  }

  var uniqueIps = [];
  // uniqueIps[0] = ips[0];
  for (i = 0; i < ips.length; i++) {
    duplicate = false;
    for (j = 0; j < uniqueIps.length; j++) {
      if (ips[i] == uniqueIps[j]) {
        duplicate = true;
      }
    }
    if (!duplicate) uniqueIps.push(ips[i]);
  }
  console.log('Number of unique IP addresses: ', uniqueIps.length);
  console.log('Unique IP addresses: ', uniqueIps);

  console.log('Number of unique subscriptions: ', uniqueSubs.length);

  var payload = 'Meddelande från bostadsrättsföreningen: ' + result.msg;
  console.log('Payload: ', payload);

  if (result.msg) { // skip if no message
    for (i = 0; i < uniqueSubs.length; i++) {
      console.log('Sending notification number ', i);
      webPush.sendNotification(
          uniqueSubs[i],
          payload,
          options
        )
        .catch((err) => {
          // console.log('webPush error: ', err);
          console.log('webPush error message ', err.message, '. Status code: ', err.statusCode);
        })
    }
  }
  // process.exit()
})