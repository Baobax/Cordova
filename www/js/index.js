var forward = true;
var userContacts, nbContacts;

//Cordova events------------------------------------------------
function initialize() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    $("#top_card").on("click", clickAnimateFlipTopCard);
    $(".card").on("click", clickAnimateFlipCard);
    getContacts();
}

function onPause() {
    console.log("Pause");
    /*timeToWait = Math.floor((Math.random() * 2) + 1);

    cordova.plugins.notification.local.schedule({
        title: 'Nouvelle carte',
        text: 'Une nouvelle carte a été tirée !',
        trigger: { in: timeToWait, unit: 'second' },
        //trigger: {every: {hour: 11, minute: 25}},
        foreground: true
    });*/
}

function onResume() {
    console.log("Resume");
}


//My events------------------------------------------------
function clickAnimateFlipTopCard() {
    var numCard = Math.floor((Math.random() * nbContacts) + 0);
    
    //Changing front card src
    $(".card .front .small").attr("srcset", "img/card.png");
    $(".card .front .medium").attr("srcset", "img/card.png");
    $(".card .front img").attr("src", "img/card.png");

    //Changing back card src
    $(".card .back .small").attr("srcset", "img/card.png");
    $(".card .back .medium").attr("srcset", "img/card.png");
    $(".card .back img").attr("src", "img/card.png");

    //19 pour tester le contact qui n'a pas de nom
    showContactInfos(numCard);

    $(".card").transition({scale:1, duration: 200});
}

function showContactInfos(numCard) {
    //Displaying contact informations on the front of the card
    $(".info_contact_front").empty();
    if((userContacts[numCard].photos) != null) {
        $(".info_contact_front").append(
            "<img src='" + userContacts[numCard].photos[0].value + "'><br>"
            );
    }
    //if((userContacts[numCard].name.formatted) != null) {
        $(".info_contact_front").append(
            userContacts[numCard].name.formatted + "<br>"
            );
    //}

    if((userContacts[numCard].phoneNumbers) != null) {
        (userContacts[numCard].phoneNumbers).forEach(function(element) {
            $(".info_contact_front").append(
                element.value + "<br>"
                );
        });
    }

    //Displaying contact informations on the back of the card
    $(".info_contact_back").empty();
    if((userContacts[numCard].addresses) != null) {
        (userContacts[numCard].addresses).forEach(function(element) {
            $(".info_contact_back").append(
                element.formatted + "<br>"
                );
        });
    }
}

function clickAnimateFlipCard() {
    if(forward) {
        $(".card").transition({rotateY:'180deg', duration: 200});

        forward = false;
    }
    else {
        $(".card")
        .transition({scale:0, duration: 200})
        .transition({rotateY:'0deg', duration: 20});

        forward = true;
    }
}

function onSuccess(contacts) {
    userContacts = contacts;
    nbContacts = contacts.length;
}

function onError(contactError) {
    alert("Error on contacts !");
}

function getContacts() {
    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    var filter = [""];
    navigator.contacts.find(filter, onSuccess, onError, options);
}

initialize();