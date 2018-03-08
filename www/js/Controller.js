var Controller = function() {
    var forward = true;
    var controller = {
        self: null,
        initialize: function() {
            self = this;

            $(".top_card").on("click", self.clickAnimateFlipTopCard);
            $(".card").on("click", self.clickAnimateFlipCard);
        },

        clickAnimateFlipTopCard: function () {
            var numCard = Math.floor((Math.random() * 2) + 1);
            //var transformHeight = $(".top_card img").height() + $(".paquet").height() + 10;

            /*$(".top_card")
                .transition({y:-50, duration: 200})
                .transition({y:0, duration: 200});*/

            /*$(".card").html("<img class='front' src='img/cards/" + numCard + "_card_front.png'>"
                + "<img class='back' src='img/cards/" + numCard + "_card_back.png'>");*/

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
               // .transition({y:-transformHeight, duration: 200});
        },

        clickAnimateFlipCard: function () {
           if(forward) {
               $(".card").transition({rotateY:'180deg', duration: 200});
               forward = false;
           }
           else {
               $(".card")
                   .transition({rotateY:'0deg', duration: 20})
                   .transition({y:0, duration: 200})
                   .transition({scale:0, duration: 200});

               /*$(".top_card")
                   .transition({y:-50, duration: 300})
                   .transition({y:0, duration: 200});*/
               forward = true;
           }
       },
    }
    controller.initialize();
    return controller;
}