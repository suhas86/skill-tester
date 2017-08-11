myApp.filter('toMinSec', function () {
    return function (input) {
        var minutes = parseInt(input / 60, 10);
        var seconds = input % 60;

        return minutes + ' minutes' + (seconds ? ' and ' + seconds + ' seconds' : '');
    }
})