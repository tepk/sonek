Template.copyright.helpers(
    {
        currentYear: function () {
            return new Date().getFullYear();
        },
        myBrowser: function () {
            return new navigator.userAgent;
        }
    }
)