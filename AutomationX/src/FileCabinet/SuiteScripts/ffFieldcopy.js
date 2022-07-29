function emailcopy(type,name)
{

if(name=='custbody91'||name=='custbody_po_follow_up')
{
var allemails='';
nlapiSetFieldValue('email',allemails);

var fulfield= nlapiGetFieldValue('custbody_po_follow_up');
var farafield= nlapiGetFieldValue('custbody91');
alert(farafield);
if(farafield>1)
{
allemails="your@mom.com"
}
else
{
allemails=fulfield;
}
nlapiSetFieldValue('email',allemails);
}
return(true);
}