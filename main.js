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

    //first bit is sign bit
    var sign = "positive"

    if(binary[0] == 1) {
        sign = "negative"
    }

    //var r = "00"
    //binary = r.concat(binary)

    var MSB = 0 //most significant bits of exponent
    var MSD = 0 //first digit
    var ex = 0 //exponent before -101  
    var exponent = 0 //exponent 0

    //next 5 bits are combination field 
    //abcde (1 - 7) || ab are MSB of the next 6 bits || cde tells the first digit 
    //11cde (8 - 9) || cd are MSB of the next 6 bits || e tells if first digit is 8 or 9
    if(binary[1] == 1 && binary[2] == 1 && binary[3] == 1 && binary[4] == 1 && binary[5] == 0) { 
       
        //infinity

    } else if(binary[1] == 1 && binary[2] == 1 && binary[3] == 1 && binary[4] == 1 && binary[5] == 1) {
        
        //NaN

    } else if(binary[1] == 1 && binary[2] == 1) {

        //range is 8 - 9
        MSD = 8
        if(binary[5] == 1) {
            MSD = 9
        } 

        ex = (binary[3] * 128) + (binary[4] * 64) + (binary[6] * 32) + (binary[7] * 16) + (binary[8] * 8) +
        (binary[9] * 4) + (binary[10] * 2) + (binary[11] * 1)
        exponent = ex - 101
 
    } else {

        //range is 1 - 7
        MSD = (binary[3] * 4) + (binary[4] * 2) + (binary[5] * 1)
        ex = (binary[1] * 128) + (binary[2] * 64) + (binary[6] * 32) + (binary[7] * 16) + (binary[8] * 8) +
        (binary[9] * 4) + (binary[10] * 2) + (binary[11] * 1)
        exponent = ex - 101
    }

    return binary;
}
