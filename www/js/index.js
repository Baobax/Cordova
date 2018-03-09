var forward = true;

//Cordova events------------------------------------------------
function initialize() {
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
}

function onDeviceReady() {
    $("#top_card").on("click", clickAnimateFlipTopCard);
    $(".card").on("click", clickAnimateFlipCard);
}

function onPause() {
    console.log("Pause");
    timeToWait = Math.floor((Math.random() * 20) + 1);

    cordova.plugins.notification.local.schedule({
        title: 'Nouvelle carte',
        text: 'Une nouvelle carte a été tirée !',
        trigger: { in: timeToWait, unit: 'second' },
        foreground: true
    });
}

function onResume() {
    console.log("Resume");
}


//My events------------------------------------------------
function clickAnimateFlipTopCard() {
    var numCard = Math.floor((Math.random() * 2) + 1);
    
    //Changing front card src
    $(".card .front .small").attr("srcset", "img/cards/" + numCard + "_card_front.png");
    $(".card .front .medium").attr("srcset", "img/cards/" + numCard + "_card_front.png");
    $(".card .front img").attr("src", "img/cards/" + numCard + "_card_front.png");

    //Changing back card src
    $(".card .back .small").attr("srcset", "img/cards/" + numCard + "_card_back.png");
    $(".card .back .medium").attr("srcset", "img/cards/" + numCard + "_card_back.png");
    $(".card .back img").attr("src", "img/cards/" + numCard + "_card_back.png");

    $(".card")
    .transition({scale:1, duration: 200});
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

initialize();