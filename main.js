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

    if(binary.length == 30){
        binary = "00".concat(binary)
    } else if(binary.length == 31){
        binary = "0".concat(binary)
    }

    return convertBinaryToDecimal(binary)
}

function convertBinaryToDecimal (binary) {


    //first bit is sign bit
    var sign = ""

    if(binary[0] == 1) {
        sign = "-"
    }

    var MSD = 0 //first digit of decimal
    var ex = 0 //exponent before -101  
    var exponent = 0 //exponent

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

    var co1 = convertBCDtoDecimal(binary, 12) //decimal of the first 10 bits of coefficient
    var co2 = convertBCDtoDecimal(binary, 22) //decimal of the second 10 bits of coefficient 
    var coefficient = co1.concat(co2)


    var float = ""
    var fixed = ""
    var temp = ""
    var whole = 0

    temp = temp.concat(MSD.toString()).concat(coefficient)
    whole = parseInt(temp) * Math.pow(10, exponent)
    float = float.concat(sign).concat(whole.toString())

    fixed = fixed.concat(sign).concat(MSD.toString()).concat(coefficient).concat("x10^").concat(exponent.toString())

    return float
}

function convertBCDtoDecimal (binary, n) {

    var co = ""

    if(binary[n + 6] == 1 && binary[n + 7] == 1 && binary[n + 8] == 1) {

        //x x c 1 1 f 1 1 1 i  =>  100c 100f 100i  (8–9) (8–9) (8–9)
        if(binary[n + 3] == 1 && binary[n + 4] == 1) {

            co = co.concat((8 + binary[n + 2]).toString())
            co = co.concat((8 + binary[n + 5]).toString())
            co = co.concat((8 + binary[n + 9]).toString())
            
        //a b c 1 0 f 1 1 1 i  =>  0abc 100f 100i  (0–7) (8–9) (8–9)
        } else if (binary[n + 3] == 1 && binary[n + 4] == 0) {

            co = co.concat(((4 * binary[n + 0]) + (2 * binary[n + 1]) + (1 * binary[n + 2])).toString())
            co = co.concat((8 + binary[n + 5]).toString())
            co = co.concat((8 + binary[n + 9]).toString())

        //d e c 0 1 f 1 1 1 i  =>  100c 0def 100i  (8–9) (0–7) (8–9)
        } else if (binary[n + 3] == 0 && binary[n + 4] == 1) {

            co = co.concat((8 + binary[n + 2]).toString())
            co = co.concat(((4 * binary[n + 0]) + (2 * binary[n + 1]) + (1 * binary[n + 5])).toString())
            co = co.concat((8 + binary[n + 9]).toString())

        //g h c 0 0 f 1 1 1 i  =>  100c 100f 0ghi  (8–9) (8–9) (0–7)
        } else if (binary[n + 3] == 0 && binary[n + 4] == 0) {

            co = co.concat((8 + binary[n + 2]).toString())
            co = co.concat((8 + binary[n + 5]).toString())
            co = co.concat(((4 * binary[n + 0]) + (2 * binary[n + 1]) + (1 * binary[n + 9])).toString())

        }

    //g h c d e f 1 1 0 i  =>  100c 0def 0ghi  (8–9) (0–7) (0–7)    
    } else if(binary[n + 6] == 1 && binary[n + 7] == 1 && binary[n + 8] == 0) {

        co = co.concat((8 + binary[n + 2]).toString())
        co = co.concat(((4 * binary[n + 3]) + (2 * binary[n + 4]) + (1 * binary[n + 5])).toString())
        co = co.concat(((4 * binary[n + 0]) + (2 * binary[n + 1]) + (1 * binary[n + 9])).toString())

    //a b c g h f 1 0 1 i  =>  0abc 100f 0ghi  (0–7) (8–9) (0–7)
    } else if(binary[n + 6] == 1 && binary[n + 7] == 0 && binary[n + 8] == 1) {

        co = co.concat(((4 * binary[n + 0]) + (2 * binary[n + 1]) + (1 * binary[n + 2])).toString())
        co = co.concat((8 + binary[n + 5]).toString())
        co = co.concat(((4 * binary[n + 3]) + (2 * binary[n + 4]) + (1 * binary[n + 9])).toString())

    //a b c d e f 1 0 0 i  =>  0abc 0def 100i  (0–7) (0–7) (8–9)
    } else if(binary[n + 6] == 1 && binary[n + 7] == 0 && binary[n + 8] == 0) {

        co = co.concat(((4 * binary[n + 0]) + (2 * binary[n + 1]) + (1 * binary[n + 2])).toString())
        co = co.concat(((4 * binary[n + 3]) + (2 * binary[n + 4]) + (1 * binary[n + 5])).toString())
        co = co.concat((8 + binary[n + 9]).toString())

    //a b c d e f 0 g h i  =>  0abc 0def 0ghi  (0-7) (0-7) (0-7)
    } else {

        co = co.concat(((4 * binary[n + 0]) + (2 * binary[n + 1]) + (1 * binary[n + 2])).toString())
        co = co.concat(((4 * binary[n + 3]) + (2 * binary[n + 4]) + (1 * binary[n + 5])).toString())
        co = co.concat(((4 * binary[n + 7]) + (2 * binary[n + 8]) + (1 * binary[n + 9])).toString())

    }

    return co
}