var Controller = function() {
    var sens = 0;
    var controller = {
        self: null,
        initialize: function() {
            self = this;

            $(".card").on("click", self.click);
        },

        click: function () {
            if(sens == 0) {
                $(".card").css("transform", "rotateY(180deg)");
                sens++;
            }
            else {
                $(".card").css("transform", "");
                sens--;
            }
        },
    }
    controller.initialize();
    return controller;
}