function customeronload ()
{
  
forms = nlapiGetFieldValue('customform');
var entityids =  form.getField('entityid'); 
var compName =  form.getField('companyname'); 
  
if(entityids){entityids.setDisplayType('disabled');}
if(compName){compName.setDisplayType('disabled');}
}