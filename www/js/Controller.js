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
            var cardHeight = ($(".top_card img").height() / 1.6) + ($(".paquet").height() / 1.6) + 10;


            $(".top_card")
                .transition({y:-50, duration: 200})
                .transition({y:0, duration: 200});

            $(".card .front").attr("src", "img/cards/" + numCard + "_card_front.png");
            $(".card .back").attr("src", "img/cards/" + numCard + "_card_back.png");

            $(".res").html(cardHeight);

            $(".card")
                .transition({scale:1.6, duration: 200})
                .transition({y:-cardHeight, duration: 200});
        },

        clickAnimateFlipCard: function () {
            if(forward) {
                $(".card").transition({perspective:'1000px', rotateY:'180deg', duration: 200});
                
                forward = false;
            }
            else {
                $(".card")
                    .transition({perspective:'1000px', rotateY:'0deg', duration: 20})
                    .transition({y:0, duration: 200})
                    .transition({scale:0, duration: 200});

                $(".top_card")
                    .transition({y:-50, duration: 300})
                    .transition({y:0, duration: 200});

                forward = true;
            }
        },
    }
    controller.initialize();
    return controller;
}