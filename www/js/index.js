var pause = false;
var forward = true;

//Cordova events------------------------------------------------
function initialize() {
    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
}

function onDeviceReady() {
    $("#top_card").on("click", clickAnimateFlipTopCard);
    $(".card").on("click", clickAnimateFlipCard);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function backgroundTask() {
    pause = true;
    var i = 0, card = 0, carteTiree = false;

    while(pause && !carteTiree) {
        console.log(i + " ème tour de boucle");
        card = Math.floor((Math.random() * 10) + 1);
        if(card == 3) {
            console.log("Carte tirée");
            carteTiree = true;
        }
        i++;
        await sleep(2000);
    }   
}

function onPause() {
    backgroundTask();
}

function onResume() {
    pause = false;
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