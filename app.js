// app.js

// console.log('name: ', window.navigator.appName);
// console.log('version: ', window.navigator.appVersion);
// console.log('platform: ', window.navigator.platform);
// console.log('window.location.hostname: ', window.location.hostname); 

// Update the database to trace usage of app

var mql;
var displayMode = "";
mql = window.matchMedia('(display-mode: standalone)');
if (mql.matches) {
    displayMode = "standalone";
}
mql = window.matchMedia('(display-mode: browser)');
if (mql.matches) {
    displayMode = "browser";
}
console.log('mql display-mode: ', displayMode);
console.log('window.navigator.standalone: ', window.navigator.standalone);
if (!displayMode) {
    if (window.navigator.standalone) {
        displayMode = "standalone";
    } else {
        displayMode = "browser";
    }
}
console.log('display-mode: ', displayMode);

/* const firebaseConfig = {
    apiKey: "AIzaSyC1FttZvq19tbUtiRqRwkCeFokDb484J0A",
    authDomain: "mysubscriptiondb.firebaseapp.com",
    databaseURL: "https://mysubscriptiondb.firebaseio.com",
    projectId: "mysubscriptiondb",
    storageBucket: "",
    messagingSenderId: "170203061159"
};
firebase.initializeApp(firebaseConfig);
console.log('firebase initialized: ', firebase); */
// Above firebase initialization is done in createServiceWorker.js

var subsdb = firebase.database();

var tracetime = Date();
var tracemsg = navigator["userAgent"];
const traces = this.subsdb.ref('/' + window.location.hostname.replace(/(\.)/g, "-") + '-traces');
url = "https://api.ipify.org?format=json";
var myip = "00.00.00.00";
fetch(url).then(function (response) {
    return response.json();
}).then(function (data) {
    myip = data.ip;
    writeTrace();
}).catch(function () {
    console.error("Failure requesting ip address from api.ipify.org");
    writeTrace();
});

function writeTrace() {
    traces.push({
        ip: myip,
        timesubmitted: tracetime,
        displayMode: displayMode,
        userAgent: tracemsg
    }, function (error) {
        if (error)
            console.error("'Error has occured when saving trace record: ", error)
        else {
            console.log("Trace data have been saved succesfully: ", tracemsg);
        }
    });
}


// Initialize DOM

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

home();
console.log('app.js initialization complete');

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


// Function gotoShow
function gotoShow(event) {
    // console.log('gotoShow event', event.target.alt);
    show(Number(event.target.alt.substring(0, 2)));
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
        if (floor == 1) {
            trappor = " trappa"
        } else {
            trappor = " trappor"
        };
        where = 'Taxgatan 3  &emsp; &emsp; &emsp;' + floor.toString() + trappor;
    } else {
        floor = mask - 11;
        if (floor == 1) {
            trappor = " trappa"
        } else {
            trappor = " trappor"
        };
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

    // console.log('val', val, 'antal: ', hits.length);

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