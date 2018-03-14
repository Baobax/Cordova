var _forward = true;
var _userContacts, _nbContacts = 0;

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
    var numCard = Math.floor((Math.random() * _nbContacts) + 0);
    
    //Changing front card src
    $(".card .front .small").attr("srcset", "img/card.png");
    $(".card .front .medium").attr("srcset", "img/card.png");
    $(".card .front img").attr("src", "img/card.png");

    //Changing back card src
    $(".card .back .small").attr("srcset", "img/card.png");
    $(".card .back .medium").attr("srcset", "img/card.png");
    $(".card .back img").attr("src", "img/card.png");

    showContactInfos(numCard);

    $(".card").transition({scale:1, duration: 200});
}

function showContactInfos(numCard) {
    if(_nbContacts > 0) {
        var frontCard = "", backCard = "";

        //Displaying contact informations on the front of the card
        if((_userContacts[numCard].photos) != null) {
            frontCard += "<p><img class='img_contact' src='" + _userContacts[numCard].photos[0].value + "'></p><br><hr><br>";
        }
        else {
            frontCard += "<p><img class='img_contact' src='img/blank_profile_picture.png'></p><br><hr><br>";
        }

        if((_userContacts[numCard].name.formatted) != null) {
            frontCard += "<p><b>Nom</b><br>" + _userContacts[numCard].name.formatted + "</p>";
        }
        else {
            frontCard += "<p><b>Nom</b><br>-</p>";
        }

        if((_userContacts[numCard].phoneNumbers) != null) {
            frontCard += "<p><b>Numéro(s) de téléphone</b><br>";
            (_userContacts[numCard].phoneNumbers).forEach(function(element) {
                frontCard += element.value + "<br>";
            });
            frontCard += "</p>";
        }
        else {
            frontCard += "<p><b>Numéro(s) de téléphone</b><br>-</p>";
        }

        if((_userContacts[numCard].emails) != null) {
            frontCard += "<p><b>eMail(s)</b><br>";
            (_userContacts[numCard].emails).forEach(function(element) {
                frontCard += element.value + "<br>";
            });
            frontCard += "</p>";
        }
        else {
            frontCard += "<p><b>eMail(s)</b><br>-</p>";
        }

        $(".info_contact_front").html(frontCard);


        //Displaying contact informations on the back of the card
        if((_userContacts[numCard].addresses) != null) {
            backCard += "<p><b>Adresse(s)</b><br>";
            (_userContacts[numCard].addresses).forEach(function(element) {
                backCard += element.streetAddress + ", " + element.locality + "<br>";
            });
            backCard += "</p>";
        }
        else {
            backCard += "<p><b>Adresse(s)</b><br>-</p>";
        }

        if((_userContacts[numCard].urls) != null) {
            backCard += "<p><b>Site(s) web</b><br>";
            (_userContacts[numCard].urls).forEach(function(element) {
                backCard += element.value + "<br>";
            });
            backCard += "</p>";
        }
        else {
            backCard += "<p><b>Site(s) web</b><br>-</p>";
        }

        $(".info_contact_back").html(backCard);
    }
    else {
        $(".info_contact_front").html("<p><b>Vous n'avez aucun contact</b></p>");
    }
}

function clickAnimateFlipCard() {
    if(_forward) {
        $(".card").transition({rotateY:'180deg', duration: 200});

        _forward = false;
    }
    else {
        $(".card")
        .transition({scale:0, duration: 200})
        .transition({rotateY:'0deg', duration: 20});

        _forward = true;
    }
}

function onSuccess(contacts) {
    _userContacts = contacts;
    _nbContacts = contacts.length;
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