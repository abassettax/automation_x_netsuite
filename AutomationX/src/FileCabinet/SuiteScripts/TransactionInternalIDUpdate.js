function addid(type, form)  
{

var recid = nlapiGetRecordId();
nlapiSubmitField(nlapiGetRecordType(), recid, 'custbody209', recid );
  
}