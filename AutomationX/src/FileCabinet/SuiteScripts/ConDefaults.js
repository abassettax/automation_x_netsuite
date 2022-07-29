function getcustdefaults()
{

custid = nlapiGetFieldValue('entity');

var aprover = nlapiLookupField('customer', custid , 'custentity158');
var plantcode = nlapiLookupField('customer', custid , 'custentity157');



nlapiSetFieldValue('custbody73',aprover );  
nlapiSetFieldValue('custbody69',plantcode);

//alert(vendorid);

return true;

}

//-----------------------------------------------------

function PageInt()

{
//var cust = nlapiGetFieldValue('entity');
//if(cust != "")
//{
//var cnote = nlapiLookupField('customer', cust , 'custentity78');
//if(cnote !="")
//{
//alert(cnote);
//}

//}
}

//------------------------------------------



function Fchange(type,name)

{




	if(name =='entity'  )
		{




var cust = nlapiGetFieldValue('entity');
if(cust != "")
{
var cnote = nlapiLookupField('customer', cust , 'custentity78');
if(cnote !="")
{
alert(cnote);
}

}



}}





//----------------------------------------------------




function GetCustCodes()

{



var cust = nlapiGetFieldValue('entity');
var record = nlapiLoadRecord('customer', cust);


//custbody10.style.backgroundColor = '#FFFF99';
//document.getElementById('custbody8').style.backgroundColor = '#FFFF99';




var cust_wellsitename  = record.getFieldValue( 'custentity_req_wellsitename');
var order_wellsitename = nlapiGetFieldValue('custbody8');


var cust_wellnumber  = record.getFieldValue( 'custentity_req_wellnumber');
var order_wellnumber  = nlapiGetFieldValue('custbody9');

var cust_accountingnum  = record.getFieldValue( 'custentity_req_accountingnumber');
var order_accountingnum  = nlapiGetFieldValue('custbody10');



var cust_glaccount  = record.getFieldValue( 'custentity_req_glaccount');
var order_glaccount  = nlapiGetFieldValue('custbody74');


var cust_techname  = record.getFieldValue( 'custentity_req_techname');
var order_techname  = nlapiGetFieldValue('custbody38');



var cust_xtocode  = record.getFieldValue( 'custentity_req_xtocode');
var order_xtocode  = nlapiGetFieldValue('custbody11');



var cust_plantcode  = record.getFieldValue( 'custentity_req_plantcode');
var order_plantcode  = nlapiGetFieldValue('custbody69');



var cust_approverid  = record.getFieldValue( 'custentity_req_approverid');
var order_approverid  = nlapiGetFieldValue('custbody73');


var cust_xtoreasoncodes  = record.getFieldValue( 'custentity_req_xto_reason_codes');
var order_xtoreasoncodes  = nlapiGetFieldValue('custbody67');


var req = 'Required'

if(cust_wellsitename   == "T" && order_wellsitename == "") 
{
nlapiSetFieldValue('custbody8', req,  null, true);
}

if ( cust_wellnumber  == "T" && order_wellnumber == "")  
{
nlapiSetFieldValue('custbody9', req,  null, true);
}

if (  cust_accountingnum == "T" && order_accountingnum == "")  
{
nlapiSetFieldValue('custbody10', req,  null, true);
}

if (  cust_glaccount == "T" && order_glaccount == "")  
{
nlapiSetFieldValue('custbody74', req,  null, true);
}

if (  cust_techname == "T" && order_techname == "")  
{
nlapiSetFieldValue('custbody88', req,  null, true);
}

if(  cust_xtocode == "T" && order_xtocode == "") 
{
nlapiSetFieldValue('custbody11', req,  null, true);
}

if ( cust_plantcode  == "T" && order_plantcode == "") 
{
nlapiSetFieldValue('custbody69', req,  null, true);
}

if (  cust_approverid == "T" && order_approverid == "")  
{
nlapiSetFieldValue('custbody73', req,  null, true);

}

if (  cust_xtoreasoncodes == "T" && order_xtoreasoncodes == "")  
{
nlapiSetFieldValue('custbody67', req,  null, true);
}

var cnote = record.getFieldValue( 'custentity78');

//nlapiLookupField('customer', custid , '');


if(cnote != "")
{
alert(cnote);
}

return true;
}

