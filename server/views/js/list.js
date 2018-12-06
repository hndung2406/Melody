$(document).ready(function() {

    $(".btn-info").click(function() {
        $("#text").val($(this).parent().parent().find("th:nth-child(2)").text());
        $("#id").val($(this).parent().parent().find("th:nth-child(1)").text());
    });

    $(".btn-danger").click(function() {
        $("#idDelete").val($(this).parent().parent().find("th:nth-child(1)").text());
    });

});
