jQuery(function($){

    $('[data-send-form]').on('click', function () {
    var flyNum = $('[data-fly-num]').val(),
        depDate = $('[data-dep-date]').val(),
        $placeForInfo = $('[data-place-for-info]');

        if (flyNum == "" || depDate == "") {
            $placeForInfo.html('заполните поля');
        } else {
            $placeForInfo.html('подождите...');

            $.get('/flights/'+flyNum.replace(/-/, "+")+'/'+depDate, function (e) {
                $placeForInfo.html(e);
            })
        }
});

$('[data-dep-date]').mask('9999-99-99');

});