function lockIR(type, form, request)
{
  if(type == 'edit')
    {
   var CFT =  nlapiGetFieldText('createdfrom');
   var cfid =  nlapiGetFieldValue('createdfrom');
  var CFtype="";

  if(CFT.indexOf('Purchase') != -1)
  {CFtype='purchaseorder';}
      
if(CFtype !="")
{
if(nlapiLookupField(CFtype , cfid, 'status') == "fullyBilled" )
  {
  var fa =   form.getSubList('item').getField('quantity'); 
  var fb =   form.getSubList('item').getField('rate');  
form.removeButton('delete');
  
   if(fa && nlapiGetUser() != 11360){fa.setDisplayType('disabled');}
   if(fb){fb.setDisplayType('disabled');}
  
  }
  }
    }}
