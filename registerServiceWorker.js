var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent && !navigator.userAgent.match('CriOS');

console.log('isSafari: ', isSafari);

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


// Install service worker and subscribe user to push messages
window.onload = function () {

    if ('serviceWorker' in navigator) {

        // window.navigator.serviceWorker.register('/sw.js?' + Math.random().toString())
        window.navigator.serviceWorker.register('/sw.js')
            .then(function (swReg) {
                console.log('Successful serviceworker.register. Registration :', swReg);
                // console.log('swReg.onupdatefound: ', swReg.onupdatefound);
                swReg.onupdatefound = () => {
                    // console.log('swReg.installing: ',swReg.installing);
                    const installingWorker = swReg.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // At this point, the old content will have been purged and
                                // the fresh content will have been added to the cache.
                                // It's the perfect time to display a "New content is
                                // available; please refresh." message in your web app.
                                console.log('New content is available; alert will show.');
                                window.alert('Appen har uppdaterats. Gå ur appen och starta om den för att få den nya versionen.');
                            } else {
                                // At this point, everything has been precached.
                                // It's the perfect time to display a
                                // "Content is cached for offline use." message.
                                console.log('Content is cached for offline use. Alert will show');
                                window.alert('App och medlemsdata har lagrats i din enhet, så nu kan appen användas off-line.');
                            }
                        }
                    };
                };

                //  swReg.update();
                //  console.log('Service Worker is updated', swReg);
                handleSubscribe(swReg);
            })
            .catch(function (error) {
                console.error('Error during service worker registration:', error);
            })
    } else {
        // Service worker not supported
        if (isSafari) {
            if (!window.navigator.standalone) {
                window.alert('Tryck på "actions" (rutan med uppåtpil) till höger på översta raden. Välj sedan "Lägg till på hemskärmen".  Då får du en ikon på hemskärmen som du sedan använder för att starta appen.')
            }
        }
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
                    } else {
                        // console.log('save subscription just in case');
                        logSubscription(subscription);
                    };
                })
                .catch(function (err) {
                    console.log('Error during getSubscription()', err);
                });
        };
    }

    // Function subscribeMe

    function subscribeMe(swReg) {

        console.log('subscribeMe called');

        navigator.serviceWorker.ready.then(function (reg) {

            swReg.pushManager.subscribe({
                    userVisibleOnly: true
                })

                .then(function (subscription) {
                    logSubscription(subscription);
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
    }

    // Function logSubsciprion

    function logSubscription(sub) {
        console.log('logSubscription called');
        var mysub = JSON.stringify(sub);
        // Update the subscription database 
        const subs = this.subsdb.ref('/' + window.location.hostname.replace(/(\.)/g, "-") + '-subs');
        var subtime = Date();
        subs.push({
            subscription: mysub,
            timesubmitted: subtime
        }, function (error) {
            if (error)
                console.error('Error has occured saving subscription', error)
            else {
                console.log('"Subscription has been saved succesfully: ', mysub);
                // window.location.href="home.html";  //Goto home page
            }
        });
    }
}