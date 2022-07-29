function hidevendortabs(type,form)
{


var  IsInternational = nlapiGetFieldText('custitem46');

if( IsInternational == "International" && nlapiGetRole() != 1078  )  
{
var hidtab = form.getSubList('vendorstab'); 
var hideman  = form.getField('manufacturer'); 
if(hidtab != null)
{
hidtab.setDisplayType('hidden');
 
}
  
  if(hideman != null)
{
hideman.setDisplayType('hidden');
}

}
}