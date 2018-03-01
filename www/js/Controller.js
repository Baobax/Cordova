var Controller = function() {
    var sens = 0;
    var controller = {
        self: null,
        initialize: function() {
            self = this;

            $(".card").on("click", self.click);
        },

        click: function () {
            if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                if(sens == 0) {
                    $(".card .front img").attr("src", "img/card_front.png");
                    sens++;
                }
                else {
                    $(".card .front img").attr("src", "img/card_back.png");
                    sens--;
                }
            }
            else {
                if(sens == 0) {
                    $(".card").css("transform", "rotateY(180deg)");
                    sens++;
                }
                else {
                    $(".card").css("transform", "");
                    sens--;
                }
            }
        },
    }
    controller.initialize();
    return controller;
}