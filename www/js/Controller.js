var Controller = function() {
    var forward = true;
    var controller = {
        self: null,
        initialize: function() {
            self = this;

            $(".top_card").on("click", self.clickAnimateFlip);
            //$(".link").on("click", self.changePage);
        },

        clickAnimateFlip: function () {
            //alert(Math.floor((Math.random() * 54) + 1));
            if(forward) {
                $(".top_card").attr("class", "top_card animate_top_card");
                $(".card").html("<img class='front' src='img/card_front.png'><br>"
                    + "<img class='back' src='img/card_back.png'>");
                $(".card").attr("class", "card animate_card");
                $(".card .back").unbind();
                $(".card .back").on("click", self.clickAnimateFlip);
                forward = false;
            }
            else {
                $(".top_card").attr("class", "top_card");
                $(".card").attr("class", "card");
                //$(".card").empty();
                forward = true;
            }
        },

        changePage: function() {
            alert("Oui");
        }
    }
    controller.initialize();
    return controller;
}