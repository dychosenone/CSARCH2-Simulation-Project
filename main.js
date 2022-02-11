// This function runs when the site is loaded
$(document).ready(function(e) {

    // Hides the Error Div
    $("#inputAlert").hide();
    $("#copyButton").hide();
    $("#finalAnswer").hide();

    var inputSelect = $('input[name="inputSelect"]:checked').val();

    if(inputSelect === "hexadecimalInput") {
        $("#binaryInput").hide();
        $("#hexadecimalInput").show();
    } else  if(inputSelect === "binaryInput") {
        $("#binaryInput").show();
        $("#hexadecimalInput").hide();
    }     

    var clipboard = new ClipboardJS('.clipbtn');

    var inputHelp_msg = "Your input must be either an 8-digit Hexadecimal Input or 32-bit Binary Input.";

    $('input[type=radio][name=inputSelect]').change(function (e) {

        var inputSelect = $('input[name="inputSelect"]:checked').val();

        if(inputSelect === "hexadecimalInput") {
            $("#binaryInput").hide();
            $("#hexadecimalInput").show();
        } else  if(inputSelect === "binaryInput") {
            $("#binaryInput").show();
            $("#hexadecimalInput").hide();
        }       
    });

    // places space separator for every 4 digits user inputs up until 8 bits
    $("#hexadecimalInput").keypress(function() {

        num = 4;
        var str = $(this).val();
    
        switch(str.length){
            case num:
            case 2*num+1:
                $(this).val($(this).val()+ " ");
    
        }

    })

    $("#inputForm").submit(function (e) {
        e.preventDefault();

        $("#inputAlert").hide();

        var inputSelect = $('input[name="inputSelect"]:checked').val();
        var outputSelect = $('input[name="outputSelect"]:checked').val()

        var input = "";

        // if input is binary, combine all input strings into one
        if(inputSelect === "binaryInput"){
            var sign = $("#binarySign").val();
            var combi = $("#binaryCombi").val();
            var exp = $("#binaryExponent").val();
            var coefficient = $("#binaryCoefficient").val();

            console.log("combi "+combi);

            input = sign + combi + exp + coefficient;
        }

        // else hex input takes string without spaces
        else{
            input = $("#hexadecimalInput").val().replace(/\s/g, '');
        }

        console.log(input);

        if(inputValidation(input, inputSelect)) {
            
            if(inputSelect === "hexadecimalInput") {
                var converted = convertHexToBinary(input, outputSelect);

                $("#finalAnswer").val(converted);
                $("#finalAnswer").show();
                $("#copyButton").show();
               
            } else {
                var converted = convertBinaryToDecimal(input, outputSelect);
           
                $("#finalAnswer").val(converted);
                $("#finalAnswer").show();
                $("#copyButton").show();
                
            }
    
        }
        
    });
});



function inputValidation (input, inputType) {
    
    // Check if input is empty
    if(input === "") {
        $("#inputAlert").text("Please enter a value.");
        $("#inputAlert").show();

        return false;

    } 
    
    if(inputType === "hexadecimalInput") {

        if (input.length != 8) {
            $("#inputAlert").text("Your hexademical value is not 8 bits.");
            $("#inputAlert").show();
    
            return false;
        } else if (checkHexadecimal(input) == false) {
            $("#inputAlert").text("Your hexadecimal input is invalid. Please try again.");
            return false;
        }

    } else if(inputType === "binaryInput") {
        console.log(input);
        if (input.length != 32) {
            $("#inputAlert").text("Your binary value is not 32 bits.");
            $("#inputAlert").show();
    
            return false;
        } else if (checkBinary(input) == false) {
            $("#inputAlert").text("Your binary input is invalid. Please try again.");
            $("#inputAlert").show();
            return false;
        }

    }

    return true;
}

// Uses Regular Expressions to Check if the Input only contains characters for Hexadecimal
function checkHexadecimal(input) {
    let regex = /[0-9A-Fa-f]{8}/g;
    return regex.test(input);
}

// Uses Regular Expressions to Check if the Input only contains characters for binary
function checkBinary(input) {
    let regex = /^[01]+$/;
    return regex.test(input);
}


function convertHexToBinary (number, output) {
    var binary = (parseInt(number, 16).toString(2)).padStart(8, '0');
    console.log(binary);

    while(binary.length != 32){
        binary = "0".concat(binary)
    }

    return convertBinaryToDecimal(binary, output)
}

function convertBinaryToDecimal (binary, output) {


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
        return sign + "Infinity";

    } else if(binary[1] == 1 && binary[2] == 1 && binary[3] == 1 && binary[4] == 1 && binary[5] == 1) {
        //NaN
        return "NaN";

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

    temp = temp.concat(MSD.toString()).concat(coefficient)
    //whole = (parseInt(temp) / 1000000)
    //whole = whole.toFixed(2)
    //whole = (parseInt(temp)) * Math.pow(10, exponent)
    let whole = new BigNumber(temp)
    whole = whole.toFixed(2)
    fixed = fixed.concat(sign).concat(whole.toString())
    console.log(fixed);
    float = float.concat(sign).concat(MSD.toString()).concat(coefficient).concat("x10^").concat(exponent.toString())

    $("#signField").text(binary.slice(0,1));
    $("#combinationField").text(binary.slice(1,6));
    $("#exponentContinuation").text(binary.slice(6,12));
    $("#coefficientContinuation").text(binary.slice(12,32));

    if(output === "floatingSelect") {
        return float
    }

    return fixed
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
