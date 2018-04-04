const NOTIF_1 = 1, NOTIF_2 = 2, NOTIF_3 = 3;

//Pour ne pas prendre en compte le touch si l'utilisateur déplace son doigt
var _dragging = false;

var _userContacts, _nbContacts = 0;

//Language
var languageStrings = null;
var languageStringsURL = "";
var frenchlanguageStringsURL = "i18n/fr/strings.json";
var englishlanguageStringsURL = "i18n/en/strings.json";

//Cordova events---------------------------------------------------------
document.addEventListener("deviceready", onDeviceReady, false);

function getSpecificLanguageString(key) {
    value = languageStrings.languageSpecifications[0][key];
    return value;
}

function getLanguageStrings(urlToHit,successCallback){
    $.ajax({
        type: "POST",
        url: urlToHit,
        timeout: 30000 ,
    }).done(function(msg) {
        successCallback(msg);
    }).fail(function(jqXHR, textStatus, errorThrown){
        alert("Internal Server Error");
    });
}

function language() {
    if((navigator.language == "fr-FR")){
        languageStringsURL = frenchlanguageStringsURL;
    }
    else{
        //Default English
        languageStringsURL = englishlanguageStringsURL;
    }
    //Make an ajax call to strings.json files
    getLanguageStrings(languageStringsURL,function(msg){
        languageStrings = JSON.parse(msg);

        $(".languagespecificHTML").each(function(){
            $(this).html(languageStrings.languageSpecifications[0][$(this).data("text")]);
        });
        $(".languageSpecificPlaceholder").each(function(){
            $(this).attr("placeholder",languageStrings.languageSpecifications[0][$(this).data("text")]);
        });
        $(".languageSpecificValue").each(function(){
            $(this).attr("value",languageStrings.languageSpecifications[0][$(this).data("text")]);
        });
    });
}

function onDeviceReady() {
    language();


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
    //$("#top_card").on("touchend", clickAnimateTopCard);
    $("#form_send_call").on("submit", sendCall);
    $("#form_add_contact").on("submit", createContact);
    $("#btn_receive_call").on("touchend", receiveCall);
    $("#btn_sms").on("touchend", sendSms);

    //À chaque lancement d'app, on réinitialise la pastille de notifications
    cordova.plugins.notification.badge.configure({ autoClear: true });

    cordova.plugins.notification.local.on("trigger", function (notification) {
        cordova.plugins.notification.badge.increase(1);
    });
    cordova.plugins.notification.local.on("clear", function (notification) {
        cordova.plugins.notification.badge.decrease(1);
    });
}

function scheduleNotification() {
    cordova.plugins.notification.local.schedule(
        {
            id: NOTIF_1,
            title: 'Scheduled with delay',
            text: '5 sec delay',
            trigger: { in: 5, unit: "second" },
            foreground: true
        }
    );
}

function onPause() {
    scheduleNotification();
    cordova.plugins.notification.local.isScheduled(NOTIF_2, function (scheduled) {
        if(!scheduled) {
            console.log("Notif 9h20 scheduled");
            cordova.plugins.notification.local.schedule(
                {
                    id: NOTIF_2,
                    title: 'Scheduled each day',
                    text: '9h20',
                    trigger: { every: { hour: 9, minute: 20 } },
                    foreground: true
                }
            );
        }
    });
    cordova.plugins.notification.local.isScheduled(NOTIF_3, function (scheduled) {
        if(!scheduled) {
            console.log("Notif 13h40 scheduled");
            cordova.plugins.notification.local.schedule(
                {
                    id: NOTIF_3,
                    title: 'Scheduled each day',
                    text: '13h40',
                    trigger: { every: { hour: 13, minute: 40 } },
                    foreground: true
                }
            );
        }
    });
    console.log("Pause");
}

function onResume() {
    //Si une notification est prévue alors qu'on revient dans l'application, on l'annule
    cordova.plugins.notification.local.isScheduled(NOTIF_1, function (scheduled) {
        if(scheduled) {
            cordova.plugins.notification.local.cancel(NOTIF_1);
        }
    });
    console.log("Resume");
}



//My events--------------------------------------------------------------
function sendCallByLink() {
    var numberToCall = $(this).data("number");

    if(confirm(getSpecificLanguageString("send_call") + " " + numberToCall + " ?")) {
        if(numberToCall.trim() != "") {
            cordova.plugins.CordovaCall.sendCall(numberToCall);
        }
    }
}


function sendCall(ev) {
    ev.preventDefault();

    var numberToCall = $("#number_to_call").val();

    if(numberToCall.trim() != "") {
        $("#number_to_call").val("");
        cordova.plugins.CordovaCall.sendCall(numberToCall);
    }
}


function receiveCall() {
    cordova.plugins.CordovaCall.receiveCall('David Marcus');
}


function successCreateContact(contacts) {
    $(".validation_errors").empty();
    $("#prenom").val("");
    $("#nom").val("");
    $("#numTel").val("");
    $(".validation_errors").html("Contact créé avec succès");
    //On update la liste des contacts
    getContacts();
}

function errorCreateContact(contactError) {
    $(".validation_errors").empty();
    alert("Erreur lors de la création du contact");
}

function addContact(nom, prenom, numTel) {
    if(nom != "" && prenom != "" && numTel != "") {
        var newContact = navigator.contacts.create();

        var name = new ContactName();
        name.givenName = prenom;
        name.familyName = nom;
        newContact.name = name;

        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('mobile', numTel, true);
        newContact.phoneNumbers = phoneNumbers;

        newContact.save(successCreateContact, errorCreateContact);
    }
}

function createContact(ev) {
    ev.preventDefault();

    addContact($("#nom").val().trim(), $("#prenom").val().trim(), $("#numTel").val().trim());
}


function onSuccessGet(contacts) {
    //Tri par ordre alphabétique
    var cSort = function(a, b) {
        //Ces tests sont pour gérer les contacts sans nom et prénom
        if((a.name.formatted) == null) {
            if((b.name.formatted) == null) {
                return 0;
            }
            else {
                return 1;
            }
        }
        else {
            if((b.name.formatted) == null) {
                return -1;   
            }
            else {
                aName = a.name.formatted.toUpperCase();
                bName = b.name.formatted.toUpperCase();

                return aName < bName ? -1 : (aName == bName ? 0 : 1);
            }
        }
    };
    _userContacts = contacts.sort(cSort);
    _nbContacts = contacts.length;
    showContacts();
}

function onErrorGet(contactError) {
    alert("Erreur de récupération des contacts !");
}

function getContacts() {
    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    var filter = [""];
    navigator.contacts.find(filter, onSuccessGet, onErrorGet, options);
}


function showContacts() {
    $(".link_send_call").unbind();
    $("#display_contacts").empty();

    if(_nbContacts > 0) {
        var contactsTable = "";

        contactsTable += "<ul><li>";
        for(var i = 0; i < _nbContacts; i++) {
            contactsTable += "<table><tr>";
            contactsTable += "<td>";
            if((_userContacts[i].photos) != null) {
                contactsTable += "<img class='img_contact' src='" + _userContacts[i].photos[0].value + "'>";
            }
            else {
                contactsTable += "<img class='img_contact' src='img/blank_profile_picture.png'>";
            }
            contactsTable += "</td>";


            contactsTable += "<td>";
            if((_userContacts[i].name.formatted) != null) {
                contactsTable += _userContacts[i].name.formatted + "<br>";
            }
            else {
                contactsTable += "-<br>";
            }

            if((_userContacts[i].phoneNumbers) != null) {
                contactsTable += "<a class='link_send_call' data-number='" + _userContacts[i].phoneNumbers[0].value + "'>" + _userContacts[i].phoneNumbers[0].value + "</a>";
            }
            else {
                contactsTable += "-";
            }
            contactsTable += "</td>";
            contactsTable += "</tr></table>";
        }
        contactsTable += "</li></ul>";


        $("#display_contacts").html(contactsTable);

        /*Displaying contact informations on the front of the card
        if((_userContacts[numCard].photos) != null) {
            frontCard += "<p><img class='img_contact' src='" + _userContacts[numCard].photos[0].value + "'></p><br><hr><br>";
        }
        else {
            frontCard += "<p><img class='img_contact' src='img/blank_profile_picture.png'></p><br><hr><br>";
        }

        if((_userContacts[numCard].name.formatted) != null) {
            frontCard += "<p><b>" + getSpecificLanguageString("name") + "</b><br>" + _userContacts[numCard].name.formatted + "</p>";
        }
        else {
            frontCard += "<p><b>" + getSpecificLanguageString("name") + "</b><br>-</p>";
        }

        if((_userContacts[numCard].phoneNumbers) != null) {
            frontCard += "<p><b>" + getSpecificLanguageString("phone_number") + "</b><br>";
            (_userContacts[numCard].phoneNumbers).forEach(function(element) {
                frontCard += element.value + "<br>";
            });
            frontCard += "</p>";
        }
        else {
            frontCard += "<p><b>" + getSpecificLanguageString("phone_number") + "</b><br>-</p>";
        }

        if((_userContacts[numCard].emails) != null) {
            frontCard += "<p><b>" + getSpecificLanguageString("email") + "</b><br>";
            (_userContacts[numCard].emails).forEach(function(element) {
                frontCard += element.value + "<br>";
            });
            frontCard += "</p>";
        }
        else {
            frontCard += "<p><b>" + getSpecificLanguageString("email") + "</b><br>-</p>";
        }

        $(".info_contact_front").html(frontCard);


        //Displaying contact informations on the back of the card
        if((_userContacts[numCard].addresses) != null) {
            backCard += "<p><b>" + getSpecificLanguageString("address") + "</b><br>";
            (_userContacts[numCard].addresses).forEach(function(element) {
                backCard += element.streetAddress + ", " + element.locality + "<br>";
            });
            backCard += "</p>";
        }
        else {
            backCard += "<p><b>" + getSpecificLanguageString("address") + "</b><br>-</p>";
        }

        if((_userContacts[numCard].urls) != null) {
            backCard += "<p><b>" + getSpecificLanguageString("website") + "</b><br>";
            (_userContacts[numCard].urls).forEach(function(element) {
                backCard += element.value + "<br>";
            });
            backCard += "</p>";
        }
        else {
            backCard += "<p><b>" + getSpecificLanguageString("website") + "</b><br>-</p>";
        }

        $(".info_contact_back").html(backCard);*/
    }
    else {
        contactsTable += "<li>Pas de contact</li>";
        $("#display_contacts").html(contactsTable);
    }

    $(".link_send_call").on("touchend", sendCallByLink);
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