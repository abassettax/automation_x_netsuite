function LineInts()
{
  if(nlapiGetFieldValue('customform') != 303 )
    {
var haslinkedtran =nlapiGetCurrentLineItemValue('item', 'custcol74');
   if(haslinkedtran) 
  {
nlapiDisableLineItemField('item', 'custcol76', true);
    }
  else{nlapiDisableLineItemField('item', 'custcol76', false); }
}
}
