function beforesub()
{
  if(nlapiGetFieldValue('terms') !=8)
    {
var ccline = parseInt( nlapiGetLineItemCount('creditcards'));
	for(x =1; x<= ccline; x++)
	{
 if(nlapiGetLineItemValue('creditcards', 'ccdefault', x) == "T")
{
nlapiSetLineItemValue('creditcards', 'ccdefault', x, "F") ; 
}
        }
    }
}