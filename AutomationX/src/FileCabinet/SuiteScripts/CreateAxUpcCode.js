function CreateAxUpcCode ()
{
//generates internal UPC code for new item
var itemid = nlapiGetRecordId();
var itemType = nlapiGetRecordType();

var digitOne = itemid.slice(0, 1); 
var digitTwo = itemid.slice(1, 2);
var digitThree = itemid.slice(2,3);
var digitFour = itemid.slice(3, 4); 
var digitFive = itemid.slice(4,5);
var digitSix = itemid.slice(5,6); if(!digitSix){digitSix = 0;}
var digitSeven = itemid.length; 

var even = parseInt(digitTwo) +  parseInt(digitFour) +  parseInt(digitSix);
var odd = (parseInt(digitOne) +  parseInt(digitThree)  +  parseInt(digitFive)  +  parseInt(digitSeven)) *3;
var totalsForLastUpcDigit = even + odd;
var totalsForLastUpcDigitString = totalsForLastUpcDigit.toString();
var lastDigit = 10 - parseInt(totalsForLastUpcDigitString.slice( -1)); if(lastDigit == 10){lastDigit = 0; }
var AXupcRaw = digitOne +  digitTwo + digitThree + digitFour + digitFive + digitSix + digitSeven + '0000000000';

var AXupc = AXupcRaw.slice(0, 11) + lastDigit; 

nlapiSubmitField(itemType, itemid, 'upccode', AXupc);
alert(AXupc);


}