var _forward = true;
var _userContacts, _nbContacts = 0;
//Pour ne pas prendre en compte le touch si l'utilisateur scroll
var _dragging = false;

//Cordova events------------------------------------------------
function initialize() {
    document.addEventListener("deviceready", onDeviceReady);
}

function onDeviceReady() {
    cordova.plugins.notification.local.hasPermission(function (granted) {
        console.log("Autorisation des notifs : " + granted);
    });

    if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
        document.addEventListener("resign", onPause);//pause iOS
    }
    else {
        document.addEventListener("pause", onPause);//pause Android
    }

    if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
        document.addEventListener("active", onResume);//resume iOS
    }
    else {
        document.addEventListener("resume", onResume);//resume Android
    }

    $("body").on("touchstart", function(){
        _dragging = false;
    });
    $("body").on("touchmove", function(){
        _dragging = true;
    });

    getContacts();
    $("#top_card").on("touchend", clickAnimateFlipTopCard);
    $(".card").on("touchend", clickAnimateFlipCard);
    $("#form_add_contact").on("submit", createContact);
    $("#btn_call").on("touchend", receiveCall);
    $("#btn_sms").on("touchend", sendSms);
    $("#btn_photo").on("touchend", takePhoto);
    $("#cancel_all").on("touchend", cancelNotifs);
}

function scheduleNotification() {
    cordova.plugins.notification.local.schedule({
        id: 1,
        title: 'Scheduled with delay',
        text: '5 sec delay',
        trigger: { in: 5, unit: "second" },
        badge: 0,
        foreground: true
    });
}

function onPause() {
    scheduleNotification();
    cordova.plugins.notification.local.isScheduled(2, function (scheduled) {
        if(!scheduled) {
            cordova.plugins.notification.local.schedule({
                id: 2,
                title: 'Scheduled each day',
                text: '14h00',
                trigger: { every: { hour: 14, minute: 0 } },
                badge: 0,
                foreground: true
            });
        }
    });
    console.log("Pause");
}

function onResume() {
    var details = cordova.plugins.notification.local.launchDetails;
    if (details) {
        console.log('Launched by notification with ID ' + details.id);
    }
    
    //Si une notification est prévue alors qu'on revient dans l'application, on l'annule
    cordova.plugins.notification.local.isScheduled(1, function (scheduled) {
        if(scheduled) {
            cordova.plugins.notification.local.cancel(1);
        }
    });
    console.log("Resume");
}


//My events------------------------------------------------
function clickAnimateFlipTopCard() {
    if (_dragging)
        return;

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
    if (_dragging)
        return;

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
    alert("Erreur de récupération des contacts !");
}

function getContacts() {
    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    var filter = [""];
    navigator.contacts.find(filter, onSuccess, onError, options);
}

function successCreateContact(contacts) {
    $(".validation_errors").empty();
    $("#prenom").val("");
    $("#nom").val("");
    $("#numTel").val("");
    alert("Contact créé avec succès");
    //On update la liste des contacts pour les contact cards
    getContacts();
}

function errorCreateContact(contactError) {
    $(".validation_errors").empty();
    alert("Erreur lors de la création du contact");
}

function createContact(ev) {
    ev.preventDefault();

    if($("#nom").val().trim() != "" && $("#prenom").val().trim() != "") {
        var newContact = navigator.contacts.create();
        var name = new ContactName();
        name.givenName = $("#prenom").val().trim();
        name.familyName = $("#nom").val().trim();
        newContact.name = name;
        if($("#numTel").val().trim() != "") {
            var phoneNumbers = [];
            phoneNumbers[0] = new ContactField('mobile', $("#numTel").val().trim(), true);
            newContact.phoneNumbers = phoneNumbers;
        }
        newContact.save(successCreateContact, errorCreateContact);
    }
    else {
        $(".validation_errors").html("<b style='color:red;'>Les champs nom et prénom sont requis</b>");
    }
}

function receiveCall() {
    cordova.plugins.CordovaCall.receiveCall('David Marcus');
}

function successSendSms() {
    $('#numberTxt').val("");
    $('#messageTxt').val("");
    alert('Message envoyé');
}

function sendSms() {
    if (_dragging)
        return;

    if($('#numberTxt').val().toString() != "" && $('#messageTxt').val() != "") {
        var number = $('#numberTxt').val().toString(); /* iOS: ensure number is actually a string */
        var message = $('#messageTxt').val();
        console.log("number=" + number + ", message= " + message);

        var options = {
            replaceLineBreaks: true, // true to replace \n by a new line, false by default
            android: {
                //intent: 'INTENT'  // send SMS with the native android SMS messaging
                intent: '' // send SMS without open any other app
            }
        };

        var error = function (e) { alert('Erreur d\'envoi :' + e); };
        sms.send(number, message, options, successSendSms, error);
    }
}

function cancelNotifs() {
    if (_dragging)
        return;

    cordova.plugins.notification.local.cancelAll();
}

function failPhoto(message) {
    if (message != "No Image Selected") {
        alert('Failed because: ' + message);
    }
}

function successPhoto(imageURI) {
    $("#photo").attr("src", imageURI);
}

function takePhoto() {
    if (_dragging)
        return;

    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        saveToPhotoAlbum: true,
        correctOrientation: true //Corrects Android orientation quirks
    }

    navigator.camera.getPicture(successPhoto, failPhoto, options);
}

initialize();
