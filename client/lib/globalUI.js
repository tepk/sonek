globalUI = new function () {
    this.callback = function (onSuccess) {

        return function (err, res) {
            if (err) {
                console.log(err)
                toastr.error(err.message, 'Error!');
            } else {
                onSuccess && onSuccess(res);
            }
        }
    }
}
