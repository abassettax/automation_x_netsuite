function locktimecard(type, form)  // used in user event script customscript379
{

var userroles = nlapiGetRole();
if(userroles!=1054 &&  userroles!=1059   &&  userroles!=1086  &&  userroles!=3)   
{

if( nlapiGetRole() != 1088)
{
nlapiSetFieldValue('customform', 85);
}

var forms = nlapiGetFieldValue('customform');
if(forms ==85 )
{


//form.getField('employee').setDisplayType('inline');
form.getField('custcol69').setDisplayType('inline');
form.getField('custcol70').setDisplayType('inline');
//form.getField('trandate').setDisplayType('inline');
//form.getField('payrollitem').setDisplayType('inline');
form.getField('department').setDisplayType('inline');
form.getField('class').setDisplayType('inline');
form.getField('location').setDisplayType('inline');
form.getField('custcol65').setDisplayType('inline');
form.getField('custcol66').setDisplayType('inline');
  form.getField('hours').setDisplayType('inline');
 form.getField('payrollitem').setDisplayType('inline');

        

var user = nlapiGetUser();

var emprec = nlapiLoadRecord('employee', user);     
var paydate = emprec.getFieldValue('lastpaiddate');

var paydatestring   = Date.parse(paydate );

var td = nlapiGetFieldValue('trandate');
var tds= Date.parse(td );

if ( paydatestring > tds)
{
if(nlapiGetFieldValue('id') != "")
{
var deletebutton = form.getButton('delete'); 

//Hide the button in the UI
deletebutton.setVisible(false); 
}
}}
}
}


function beforesubmit() // used on client side script customscript381
{
var forms = nlapiGetFieldValue('customform');
if(forms ==85 )
{

var user = nlapiGetUser();
var emprec = nlapiLoadRecord('employee', user);     
var paydate = emprec.getFieldValue('lastpaiddate');
var floatingholiday = nlapiGetFieldValue('custcol68');
var payrollitems = nlapiGetFieldValue('payrollitem');
//-----------------------------------------------------------------------------------------------------------------------
if(floatingholiday !="T" && (payrollitems == 47 || payrollitems == 48))
{
nlapiSubmitField('employee', user , 'custentity260', "T");
}
//-----------------------------------------------------------------------------------------------------------------------
var userroles = nlapiGetRole();
if(userroles!=1054 &&  userroles!=1059   &&  userroles!=1086  &&  userroles!=3)   
{

var paydatestring   = Date.parse(paydate );

var td = nlapiGetFieldValue('trandate');
var tds= Date.parse(td );

if ( paydatestring > tds)
{
alert("Editing time is not allowed outside of current pay period");
return false;
}
return true;
} 
return true;
}
return true;
}