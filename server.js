const express = require('express');
const cors = require('cors');
var admin = require('firebase-admin');
var bodyParser = require('body-parser')

const app = express();



//middleWare
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


var serviceAccount = require("./service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mamed-7686b-default-rtdb.firebaseio.com"
});


let db = admin.database();
let ref = db.ref("users");

ref.on("value", function(snapshot) {
  //sending push notifcation ===>send

  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


//add user doctor
app.post('/create-doctor', (req, res) => {
    (async () => {
        try {
        	console.log('___________POS_________==>', req.body)
        	let doc = req.body;
        	doc = {...doc, emailVerified: true, disabled: false, is_doctor: true}
        	const { uid } = await  admin.auth().createUser(doc)
        	console.log('iud iud', uid)

       		await admin.auth().setCustomUserClaims(uid, { doctor: true });
       		let ref2 = db.ref("users/"+uid)
       		await ref2.set(doc);
            return res.status(200).send();
        } catch (error) {
          console.log(" == create doc error=>",error);
          return res.status(500).send(error);
        }
      })();
  });

app.post('/create-admin', (req, res) => {
    (async () => {
        try {
        	console.log('___________POS_________==>', req.body)
        	let doc = req.body;
        	doc = {...doc, emailVerified: true, disabled: false, is_admin: true}
        	const { uid } = await  admin.auth().createUser(doc)
        	console.log('iud iud', uid)

       		await admin.auth().setCustomUserClaims(uid, { admin: true });
            return res.status(200).send();
        } catch (error) {
          console.log(" == create doc error=>",error);
          return res.status(500).send(error);
        }
      })();
  });

app.listen(3002, () => console.log('listed on 3002'));


