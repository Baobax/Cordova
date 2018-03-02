var Controller = function() {
    var forward = true;
    var controller = {
        self: null,
        initialize: function() {
            self = this;

            $(".card").on("click", self.click);
            $(".link").on("click", self.changePage);
        },

        click: function () {
            if(forward) {
                $(".card").attr("class", "card animate");
                forward = false;
            }
            else {
                $(".card").attr("class", "card");
                forward = true;
            }
        },

        changePage: function(e) {
            alert(e.serialize);
        }
    }
    controller.initialize();
    return controller;
}