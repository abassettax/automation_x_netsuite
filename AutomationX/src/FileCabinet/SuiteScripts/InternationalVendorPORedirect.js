function internationalvendorPOredirect()
{
  
var number = nlapiGetFieldValue('tranid');
var ven = nlapiGetFieldValue('entity');
if( number != "To Be Generated" || ven != null)

{
var ven = nlapiGetFieldValue('entity');
if(ven != null)
{
var  IsInternational = nlapiLookupField('vendor', ven,'custentity_as_intl_supplier');
if( IsInternational == "T"  )  
{
var hidtabbilling = form.getSubList('billingtab'); 
var hidtabrelationships = form.getSubList('contacts'); //
var hideman  = form.getField('billaddress'); 
var vendoraddselect =form.getField('billaddresslist'); 
 var hidesystemnotes = form.getSubList('systemnotes'); 
  var hidevendor = form.getField('entity'); 
  var hidemessages = form.getSubList('output'); 
  var hidefiles = form.getSubList('mediaitem'); 
   var hideirmessages = form.getSubList('messages');  
      if(hideirmessages != null)
{
hideirmessages.setDisplayType('hidden');
}
  
    if(hidefiles != null)
{
hidefiles.setDisplayType('hidden');
}
    if(hidemessages != null)
{
hidemessages.setDisplayType('hidden');
}
  
  if(hidevendor != null)
{
hidevendor.setDisplayType('hidden');
}
if(hidtabrelationships != null)
{
hidtabrelationships.setDisplayType('hidden');
}
  if(hidtabbilling != null)
{
hidtabbilling.setDisplayType('hidden');
}
  
  if(hideman != null)
{
hideman.setDisplayType('hidden');
}
  
    if(vendoraddselect != null)
{
vendoraddselect.setDisplayType('hidden');
}
    if(hidesystemnotes != null)
{
hidesystemnotes.setDisplayType('hidden');
}  
  
  
  
  return true;
}
}
}

  
  
  
  
  
  
}/*
  
var number = nlapiGetFieldValue('tranid');
var ven = nlapiGetFieldValue('entity');
if( number != "To Be Generated" || ven != null)

{
var ven = nlapiGetFieldValue('entity');
if(ven != null)
{
var  IsInternational = nlapiLookupField('vendor', ven,'custentity_as_intl_supplier');
if( IsInternational == "T"  )  
{
nlapiSetRedirectURL('TASKLINK', 'CARD_-29');
  return true;
}
}
}
}*/