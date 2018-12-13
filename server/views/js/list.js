$(document).ready(function() {

    var progress = parseInt($("#progress").text());
    var price = $(".price").text();
    var total = price.split('$');
    var sum = 0;
    total.pop();

    $.each(total, function(k, v) {
        sum += parseInt(v);
    });

    var percent = Math.round((progress/sum)*100);

    $("#progress-bar").text(percent + "%");
    $("#progress-bar").css("width", percent + "%");

    $("#total").text("\u00A0" + sum + "$");

    $(".btn-info").click(function() {
        var priceString = $(this).parent().parent().find("th:nth-child(4)").text().replace(/[^\d\.]/g, '');
        var priceInt = parseInt(priceString);
        var id = $(this).parent().parent().find("th:nth-child(1)").text();
        var text = $(this).parent().parent().find("th:nth-child(2)").text();
        var link = $(this).parent().parent().find("th:nth-child(2)").children().attr('href');
        var imageURL = $(this).parent().parent().find("th:nth-child(3)").children().children().attr('src');
        var description = $(this).parent().parent().find("th:nth-child(5)").text();

        $("#id").val(id);
        $("#text").val(text);
        $("#link").val(link);
        $("#image").attr("src", imageURL);
        $("#price").val(priceInt);
        $("#description").val(description);
    });

    $(".btn-danger").click(function() {
        var id = $(this).parent().parent().find("th:nth-child(1)").text();
        
        $("#idDelete").val(id);
    });
      
    $("#photo").change(function() {
        readURL(this);
    });

    function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();
      
            reader.onload = function(e) {
                $('#image').attr('src', e.target.result);
            }
      
            reader.readAsDataURL(input.files[0]);
        }
      }
});
