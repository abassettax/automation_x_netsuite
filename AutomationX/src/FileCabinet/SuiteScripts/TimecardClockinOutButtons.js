function beforeLoadAddButtonTime(type,form)
{
var currentTime = new Date().getTime();





  
if (type == 'create' ||  type == 'edit' || type == 'copy')
{
  
  

//var currentTime = new Date().getTime();

   //while (currentTime + 5000 >= new Date().getTime()) {
  // }
  
var forms = nlapiGetFieldValue('customform');
var timeid = nlapiGetFieldValue('id');
var UserR = nlapiGetRole();
if(forms ==87 && UserR != 18 && UserR != 3 && UserR != 1052 && UserR != 1090 && UserR != 1059  )
{


form.removeButton('resetter'); 
//form.removeButton('new');   
form.removeButton('delete');   


form.getField('employee').setDisplayType('inline');
form.getField('custcol69').setDisplayType('inline');
form.getField('custcol70').setDisplayType('inline');
form.getField('payrollitem').setDisplayType('hidden');
form.getField('department').setDisplayType('inline');
form.getField('class').setDisplayType('inline');
form.getField('location').setDisplayType('inline');
form.getField('memo').setDisplayType('inline');
form.getField('hours').setDisplayType('inline');
form.getField('trandate').setDisplayType('disabled');
  
  
  



//---------------------------------------------------------------------------------------------
  var user = nlapiGetUser();
var timebillSearch = nlapiSearchRecord("timebill",null,
[
   ["custcol69","isnotempty",""], 
   "AND", 
   ["date","within","today"], 
   "AND", 
   ["custcol70","isempty",""], 
   "AND", 
   ["employee","anyof",user]
], 
[
   new nlobjSearchColumn("date",null,null).setSort(false), 
   new nlobjSearchColumn("employee",null,null), 
   new nlobjSearchColumn("customer",null,null)
]
);
  
  
	if((timeid =="" || timeid ==null )&&  timebillSearch == null)
{
        form.addButton('custpage_clockin', 'CLOCK IN', 'starttime()');  
   	form.setScript('customscript383'); // sets the script on the client side
  
}

//---------------------------------------------------------------------------------------------
else if(  nlapiGetFieldValue('custcol70') == null && timeid )
        {
	form.addButton('custpage_clockout', 'CLOCK OUT', 'stoptime() ');  
   	form.setScript('customscript383'); // sets the script on the client side

        form.getField('trandate').setDisplayType('inline');
        }
//---------------------------------------------------------------------------------------------
else{alert("There was an error clocking in or out.  Please contact HR to correct your time card.");}

}
else
  {
 // alert("There was an error clocking in or out.  Please contact HR to correct your time card. Error code 2TimecardClockinOutButtons.js");
    
  }



}

return true;


  }

function aftersubmit()
{
  
  
var timeidis =  nlapiGetFieldValue('id');
  nlapiSetRedirectURL('RECORD','timebill',  timeidis,  'EDIT');
  return true;
}