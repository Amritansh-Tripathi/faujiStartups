$(document).ready(function () {

    var data = $('#demo_like_data').data();

    $('.demo_like:not(.demo_like_done)').on('click', '.demo_like_img', function () {
        var click = $(this);
        var demo = click.data('demo');
        $.ajax('index.php?like=1', {
            method: 'POST',
            data: Object.assign({
                demo: demo,
            }, data),
            success: function (data) {
                $(click).closest('.demo_like').addClass('demo_like_done');
                if (data !== 'false') {
                    $(click).siblings('.demo_like_total').text(data);
                }
            },
        });
    });
});
