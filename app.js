// app.js

 console.log('window.navigator.standalone: ', window.navigator.standalone);

window.onload = function () {

    if ('serviceWorker' in navigator) {

        // window.navigator.serviceWorker.register('/sw.js?' + Math.random().toString())
        window.navigator.serviceWorker.register('/sw.js')
            .then(function (swReg) {
                console.log('Service Worker is registered', swReg);
              //  swReg.update();
              //  console.log('Service Worker is updated', swReg);
                handleSubscribe(swReg);
            })
            .catch(function (error) {
                console.error('Service Worker Error', error);
            })
    }
}

// Update the database to trace usage of app

const firebaseConfig = {
    apiKey: "AIzaSyC1FttZvq19tbUtiRqRwkCeFokDb484J0A",
    authDomain: "mysubscriptiondb.firebaseapp.com",
    databaseURL: "https://mysubscriptiondb.firebaseio.com",
    projectId: "mysubscriptiondb",
    storageBucket: "",
    messagingSenderId: "170203061159"
};
firebase.initializeApp(firebaseConfig);
console.log('firebase initialized: ', firebase);
var subsdb = firebase.database();
// console.log('this.subsdb: ', this.subsdb);

var tracetime = Date();
var tracemsg = navigator["userAgent"];
const traces = this.subsdb.ref('/traces');
traces.push({
    userAgent: tracemsg,
    timesubmitted: tracetime
}, function (error) {
    if (error)
        console.log('Error has occured during saving process')
    else {
        console.log("Trace data have been saved succesfully: ", tracemsg);
    }
});

header1 = document.getElementById("header1");
header2 = document.getElementById("header2");
header3 = document.getElementById("header3");
bluediv = document.getElementById("bluehouse");
reddiv = document.getElementById("redhouse");
membdiv = document.getElementById("memberlist");
footer1 = document.getElementById("footer1");
footer2 = document.getElementById("footer2");
footer3 = document.getElementById("footer3");


mytable = document.getElementById("membertable");
var td = [
    [],
    [],
    [],
    []
];
var tr = [];

var oldmask;

// members array is included through <script> clause in HTML right before app.js
// console.log(members);

for (i = members.length - 1; i >= 0; i--) {

    td[0][i] = document.createElement("td");
    td[0][i].appendChild(document.createTextNode(""));
    td[1][i] = document.createElement("td");
    td[1][i].appendChild(document.createTextNode(""));
    td[2][i] = document.createElement("td");
    td[2][i].appendChild(document.createTextNode(""));
    td[3][i] = document.createElement("img");
    td[3][i].setAttribute('src', 'assets/icon/if_arrow-right_227601.png');
    td[3][i].addEventListener("click", gotoShow);
    td[3][i].style.visibility = 'hidden';

    tr[i] = document.createElement("tr");
    tr[i].insertBefore(td[3][i], tr[i].childNodes[0]);
    tr[i].insertBefore(td[2][i], tr[i].childNodes[0]);
    tr[i].insertBefore(td[1][i], tr[i].childNodes[0]);
    tr[i].insertBefore(td[0][i], tr[i].childNodes[0]);

    mytable.insertBefore(tr[i], mytable.childNodes[0]);
}
extrarow = document.createElement("tr");
mytable.insertBefore(extrarow, mytable.childNodes[0]);

// console.log('mytable ', mytable);

// window.alert('app.js nästan klar');
home();


console.log('app.js initialization complete');


// Function gotoShow
function gotoShow(event) {
    console.log('gotoShow event', event.target.alt);
    show(Number(event.target.alt.substring(0, 2)));
}


// Function handleSubscript
function handleSubscribe(swReg) {

    console.log('handleSubscribe called');

    if ('Notification' in window) {

        var notperm = window["Notification"].permission
        console.log('Notification.permisson: ', notperm);

        if (notperm === 'denied') return;


        swReg.pushManager.getSubscription()
            .then(function (subscription) {
                if (!subscription) { // Don't subscribe if we are already subscribed
                    if (notperm != 'granted') {
                        // Don't ask if we already allow push messages
                        window.alert(
                            'Vill du ta emot viktiga meddelanden från bostadsrättsföreningen?' +
                            ' Svara i så fall Tillåt (Allow) på frågan om aviseringar som kommer när du trycker på OK.'
                        );
                    }
                    subscribeMe(swReg);
                };
            })
            .catch(function (err) {
                console.log('Error during getSubscription()', err);
            });
    };
} // end of function handleSubscribe

// Function subscribeMe

function subscribeMe(swReg) {

    console.log('subscribeMe startad');

    navigator.serviceWorker.ready.then(function (reg) {

        swReg.pushManager.subscribe({
                userVisibleOnly: true
            })

            .then(function (subscription) {
                // console.log('User is subscribed. Subscription:', subscription);
                var mysub = JSON.stringify(subscription);
                // Update the subscription database 
                // console.log('this.subsdb again: ', this.subsdb);
                const subs = this.subsdb.ref('/subs');
                console.log('subs:', subs);
                var subtime = Date();
                subs.push({
                    subscription: mysub,
                    timesubmitted: subtime
                }, function (error) {
                    if (error)
                        console.log('Error has occured during saving process')
                    else {
                        console.log("Subscription has been saved succesfully: ", mysub);
                        // window.location.href="home.html";  //Goto home page
                    }
                });


            })

            .catch(function (err) {
                var newperm = window["Notification"].permission;
                if (newperm === 'denied') {
                    console.warn('Permission for notifications was denied by user');
                } else {
                    console.error('Failed to subscribe the user: ', err);
                }
            });
    });
} // end of function subscribeMe */




function home() {

    console.log('home called');

    header1.style.visibility = 'visible';
    header2.style.visibility = 'hidden';
    header3.style.visibility = 'hidden';
    membdiv.style.visibility = 'hidden';
    for (i = members.length - 1; i >= 0; i--) {
        td[3][i].style.visibility = 'hidden';
    }
    bluediv.style.visibility = 'visible';
    reddiv.style.visibility = 'visible';
    footer1.style.visibility = 'visible';
    footer2.style.visibility = 'hidden';
    footer3.style.visibility = 'hidden';
}


function show(mask) {

    oldmask = mask;

    console.log('show called with mask ', mask);
    header1.style.visibility = 'hidden';
    header2.style.visibility = 'visible';
    header3.style.visibility = 'hidden';
    membdiv.style.visibility = 'visible';
    bluediv.style.visibility = 'hidden';
    reddiv.style.visibility = 'hidden';
    footer1.style.visibility = 'hidden';
    footer2.style.visibility = 'visible';
    footer3.style.visibility = 'hidden';

    var floor, trappor;
    if (mask > 20) {
        floor = mask - 21;
        if (floor == 1) {trappor=" trappa"} else {trappor=" trappor"};
        where = 'Taxgatan 3  &emsp; &emsp; &emsp;' + floor.toString() + trappor;
    } else {
        floor = mask - 11;
        if (floor == 1) {trappor=" trappa"} else {trappor=" trappor"};
        where = 'Taxgatan 3  &emsp; &emsp; &emsp;' + floor.toString() + trappor;
    }
    document.getElementById("where").innerHTML = where;

    var hits = [];
    var j = 0;
    for (i = 0; i < members.length; i++) {
        if (members[i].lgh.substring(0, 2) === mask.toString()) {
            hits[j] = members[i];
            j++
        }
    }
    // console.log('hits ', hits);

    oldlgh = hits[0].lgh;
    j = 0;

    for (i = 0; i < hits.length; i++) {

        if (hits[i].lgh != oldlgh) {
            td[0][j].innerHTML = "";
            td[1][j].innerHTML = "";
            td[2][j].innerHTML = "";
            td[3][j].style.visibility = 'hidden';
            j++;
            oldlgh = hits[i].lgh
        }

        td[0][j].innerHTML = hits[i].lgh;
        td[1][j].innerHTML = hits[i].lmv;
        td[2][j].innerHTML = hits[i].membername;
        td[3][j].style.visibility = 'hidden';
        j++;
    }

    // console.log('i ', i, 'j ', j);

    for (j; j < members.length; j++) {
        td[0][j].innerHTML = "";
        td[1][j].innerHTML = "";
        td[2][j].innerHTML = "";
        td[3][j].style.visibility = 'hidden';
    }

}

function up() {
    console.log('up called');
    // valid range for mask is 12-17 and 22-28 
    if (oldmask < 17 || (oldmask >= 22 && oldmask < 28)) {
        show(oldmask + 1);
    }
}

function down() {
    console.log('down called');
    if (oldmask > 22 || (oldmask > 12 && oldmask <= 17)) {
        show(oldmask - 1);
    }
}


function search() {
    console.log('search called ');

    header1.style.visibility = 'hidden';
    header2.style.visibility = 'hidden';
    header3.style.visibility = 'visible';
    membdiv.style.visibility = 'visible';
    bluediv.style.visibility = 'hidden';
    reddiv.style.visibility = 'hidden';
    footer1.style.visibility = 'hidden';
    footer2.style.visibility = 'hidden';
    footer3.style.visibility = 'visible';


    this.hits = this.members;

    for (i = 0; i < hits.length; i++) {
        td[0][i].innerHTML = hits[i].lgh;
        td[1][i].innerHTML = hits[i].lmv;
        td[2][i].innerHTML = hits[i].membername;
        td[3][i].setAttribute('alt', hits[i].lgh);
        td[3][i].style.visibility = 'visible';
    }
}

function showHits(ev) {

    let val = ev.target.value;

    if (!val) {
        this.hits = this.members; // cancel cross clicked
    } else {
        this.hits = this.hits.filter((member) => {
            return (
                (member.membername.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                (member.lgh.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                (member.lmv.toLowerCase().indexOf(val.toLowerCase()) > -1)
            );
        })
    }

    console.log('val', val, 'antal: ', hits.length);

    for (i = 0; i < hits.length; i++) {
        td[0][i].innerHTML = hits[i].lgh;
        td[1][i].innerHTML = hits[i].lmv;
        td[2][i].innerHTML = hits[i].membername;
        td[3][i].setAttribute('alt', hits[i].lgh);
        td[3][i].style.visibility = 'visible';
    }
    for (i; i < members.length; i++) {
        td[0][i].innerHTML = "";
        td[1][i].innerHTML = "";
        td[2][i].innerHTML = "";
        td[3][i].style.visibility = 'hidden';
    }
}