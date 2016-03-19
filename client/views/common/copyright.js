Template.copyright.helpers(
    {
        currentYear: function () {
            var a = new Date().getFullYear();
            if (a > 2016) {
                return "2016-" + a
            } else {
                return a
            }
        },
        myBrowser: function () {
            return new navigator.userAgent;
        }
    }
)