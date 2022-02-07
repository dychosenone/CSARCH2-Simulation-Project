// This function runs when the site is loaded
$(document).ready(function(e) {

    var inputHelp_msg = "Your input must be either an 8-digit Hexadecimal Input or 32-bit Binary Input.";

    $("#inputForm").submit(function (e) {
        e.preventDefault();
        var input = $("#input").val();

        if (input.length!=8 && input.length!=32){
            highlightErrorInput();
            $("#inputHelp").text("Invalid number of digits or bits. "+inputHelp_msg);
        }

        else{
            console.log(input);
            var converted = convertHexToBinary(input);
            removeErrorInput();
            $("#inputHelp").text(inputHelp_msg);

            $("#finalAnswer").text(converted);
        }
        
    
    });
});




function convertHexToBinary (number) {
    var binary = (parseInt(number, 16).toString(2)).padStart(8, '0');
    console.log(binary);
    return binary;
}

function highlightErrorInput (){
    $("#input").css('border-color', 'red');
    $("#inputHelp").css('color', 'red');
}

function removeErrorInput (){
    $("#inputHelp").css('color', '#888');
    $("#input").css('border-color', '');
}
