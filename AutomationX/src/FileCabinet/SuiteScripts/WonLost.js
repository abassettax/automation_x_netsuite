function WonLost (type,name)
{
if(name=='custbody138')
{
if((nlapiGetFieldValue('custbody138'))=='T')
{
var itemsall = "";
var lineCount = parseInt(nlapiGetLineItemCount('item'));
var x=1;
while (x<= lineCount)
{
nlapiSelectLineItem('item',x);
nlapiSetCurrentLineItemValue('item', 'custcol55','T','false');
nlapiCommitLineItem('item');
x++;
}
}

else 
{
var itemsall = "";
var lineCount = parseInt(nlapiGetLineItemCount('item'));
var x=1;
while (x<= lineCount)
{
nlapiSelectLineItem('item',x);
nlapiSetCurrentLineItemValue('item', 'custcol55','F','false');
nlapiCommitLineItem('item');
x++;
}
}
}}