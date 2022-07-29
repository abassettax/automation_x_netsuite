

function blMH(axCopy)
{

//----------------------&& getParameterFromURL('axCopy')!= 'yes'
  
if (typeof nlapiGetFieldValue('entity') !== "undefined" && axCopy 	!= 'yes') {
var cust = nlapiGetFieldValue('entity');
 
  if(cust)
    {
    //  alert("hi");
var stat = nlapiGetFieldValue('status');
var number = nlapiGetFieldValue('tranid'); 
var CFF = nlapiGetFieldValue('createdfrom');
  


if(cust && number == "To Be Generated" )//&& !CFF )
 {
//alert("hi");
var record = nlapiLoadRecord('customer', cust);
//-------------------------------------------------------------------

var cust_location = record.getFieldValue('custentity180');
var cust_class = record.getFieldValue('custentity149');


var cust_wellsitename  = record.getFieldValue('custentity_req_wellsitename');
//var order_wellsitename = nlapiGetFieldValue('custbody8');

var cust_wellnumber  = record.getFieldValue( 'custentity_req_wellnumber');
//var order_wellnumber  = nlapiGetFieldValue('custbody9');

var cust_accountingnum  = record.getFieldValue( 'custentity_req_accountingnumber');
//var order_accountingnum  = nlapiGetFieldValue('custbody10');

var cust_glaccount  = record.getFieldValue( 'custentity_req_glaccount');
//var order_glaccount  = nlapiGetFieldValue('custbody74');

var cust_techname  = record.getFieldValue( 'custentity_req_techname');
//var order_techname  = nlapiGetFieldValue('custbody38');

var cust_xtocode  = record.getFieldValue( 'custentity_req_xtocode');
//var order_xtocode  = nlapiGetFieldValue('custbody11');

var cust_plantcode  = record.getFieldValue( 'custentity_req_plantcode');
//var order_plantcode  = nlapiGetFieldValue('custbody69');

var cust_approverid  = record.getFieldValue( 'custentity_req_approverid');
//var order_approverid  = nlapiGetFieldValue('custbody73');

var cust_xtoreasoncodes  = record.getFieldValue( 'custentity_req_xto_reason_codes');
//var order_xtoreasoncodes  = nlapiGetFieldValue('custbody67');

var cust_paykey_userId_required   = nlapiLookupField('customer', cust, 'custentity187');
//var order_paykey_userId_required  = nlapiGetFieldValue('custbody7');

var cust_po_required   = nlapiLookupField('customer', cust, 'custentity193');
//var order_po_required  = nlapiGetFieldValue('otherrefnum');

var req = 'Required'
var blank = ""


///------------------------

 nlapiLogExecution('debug','cust_accountingnum', cust_accountingnum );
if(cust_wellsitename == "T")// && order_wellsitename == "") 
{
if( !nlapiGetFieldValue('custbody8') )
  {
nlapiSetFieldValue('custbody8', req,  null, false);
  }
}

if ( cust_wellnumber  == "T" )//&& order_wellnumber == "")  
{
  if( !nlapiGetFieldValue('custbody9'))
  {
nlapiSetFieldValue('custbody9', req,  null, false );
  }
}

if (  cust_accountingnum == "T" )//&& order_accountingnum == "")  
{
   if( !nlapiGetFieldValue('custbody10'))
  {
nlapiSetFieldValue('custbody10', req,  null, false);
  }
}

if (  cust_glaccount == "T" )//&& order_glaccount == "")  
{
     if( !nlapiGetFieldValue('custbody74') == "")
  {
nlapiSetFieldValue('custbody74', req,  null, false);
  }
}

if (  cust_techname == "T" )//&& order_techname == "")  
{
       if( !nlapiGetFieldValue('custbody38') )
  {
nlapiSetFieldValue('custbody38', req,  null, false);
  }
}

if(  cust_xtocode == "T" )//&& order_xtocode == "") 
{
         if( !nlapiGetFieldValue('custbody11'))
  {
nlapiSetFieldValue('custbody11', req,  null, false);
  }
}

if ( cust_plantcode == "T" )//&& order_plantcode == "") 
{
           if( !nlapiGetFieldValue('custbody69'))
  {
nlapiSetFieldValue('custbody69', req,  null, false);
  }
}

if (  cust_approverid == "T" )//&& order_approverid == "")  
{
             if( !nlapiGetFieldValue('custbody73'))
  {
nlapiSetFieldValue('custbody73', req,  null, false);
  }
}

if (  cust_xtoreasoncodes == "T" )//&& order_xtoreasoncodes == "")  
{
               if( !nlapiGetFieldValue('custbody67') )
  {
nlapiSetFieldValue('custbody67', req,  null, true);
  }
}

if (  cust_paykey_userId_required == "T" )//&& order_paykey_userId_required  == "")  
{
                 if( !nlapiGetFieldValue('custbody7'))
  {
nlapiSetFieldValue('custbody7', 182,  null, true);
  }
}

if (  cust_po_required == "T" )//&& order_po_required == "")  
{
                   if( !nlapiGetFieldValue('otherrefnum'))
  {
nlapiSetFieldValue('otherrefnum', req,  null, true);
  }
}


//------------------------
var empty = "";

nlapiSetFieldValue('class',cust_class );
nlapiSetFieldValue('location', cust_location );



//----------------------------------------------------------------------------------




//-----------------------

//return true;
}
return true;
    } }}

//---------------------------



//------------------------------