var Controller = function() {
    var forward = true;
    var controller = {
        self: null,
        initialize: function() {
            self = this;

            $(".card").on("click", self.clickAnimateFlip);
            $(".check_pref").on("click", self.clickPref);
            //$(".link").on("click", self.changePage);
        },

        clickAnimateFlip: function () {
            if(forward) {
                $(".card").attr("class", "card animate");
                forward = false;
            }
            else {
                $(".card").attr("class", "card");
                forward = true;
            }
        },

        clickPref: function (e) {
            e.stopImmediatePropagation();
        },

        changePage: function() {
            alert("Oui");
        }
    }
    controller.initialize();
    return controller;
}