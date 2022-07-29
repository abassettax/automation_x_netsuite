function replaceLetter(str) {return str.replace(/,/g, '\n');}

function ironsave()
{

var cf= nlapiGetFieldValue('createdfrom');
  nlapiSetFieldValue('custbody133', nlapiGetFieldText('createdfrom'));
var user = nlapiGetUser();
var user_location = nlapiLookupField('employee', user, 'location', true);
var user_location2 = nlapiLookupField('employee', user, 'custentity180', true);
var user_location3 = nlapiLookupField('employee', user, 'custentity190', true);
 var irclass = nlapiLookupField('employee', user, 'class', true);
 var uclass = nlapiLookupField('location', user, 'custrecord154', true);
var ff_location = nlapiGetFieldValue("location");  
  var ff_locationText = nlapiGetFieldText("location"); 
var totlines =0;
var totallines =0;

var getUserMultiLocation = nlapiLookupField('employee', user, 'custentity353', true); 
var getUserMultiLocationID = nlapiLookupField('employee', user, 'custentity353', false); 
var userMultiLocation =""; if(getUserMultiLocationID){userMultiLocation = getUserMultiLocationID; }

var MultiLocationString = replaceLetter(userMultiLocation);
 
 // alert(userMultiLocation.indexOf(ff_location)); alert(userMultiLocation);
  
if ( ff_locationText != user_location &&  ff_locationText != user_location2 &&  ff_locationText != user_location3   && userMultiLocation.indexOf(ff_location) == -1  )
{
totlines=1;
totallines = totallines+totlines;
}
//alert(totallines);
  
if(totallines >= 1)
{

alert("One or more items are set to be received into a location not listed as one of your receiving locations.  You may only mark recive into of the following locations: \n \n " + user_location +" \n "+  user_location2    +" \n "+     user_location3   +" \n "+       MultiLocationString + "\n \n"+"Please contact the inside sales location that is listed on the item recipt to finish processing. " +" \n "  +" \n "+  "Option 1: Change the location on the Purchase Order and Item Receipt to your location and receive in. If the final location should be the original location than create a transfer order and fulfill."    +  " \n "+  " \n "+  "Option 2: Create a UPS label and forward the product to the final location for receipt. Put notes on the Purchase order including the new tracking number." +" \n "+  " \n "+ "Please make sure the original location is contacted.");
return false;
}
return true;
}