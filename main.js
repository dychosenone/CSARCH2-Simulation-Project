// This function runs when the site is loaded
$(document).ready(function(e) {

    $("#inputForm").submit(function (e) {
        e.preventDefault();
        var input = $("#input").val();

        if(input == "") {
            
        }

        console.log(input);
        var converted = convertHexToBinary(input);
    
        $("#finalAnswer").text(converted);
    
    });
});




function convertHexToBinary (number) {
    var binary = (parseInt(number, 16).toString(2)).padStart(8, '0');
    console.log(binary);
    return binary;
}
