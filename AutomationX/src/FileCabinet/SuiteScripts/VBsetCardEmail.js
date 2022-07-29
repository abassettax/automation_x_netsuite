function setcardempemail()
{
  
if( nlapiGetFieldValue('entity') == '28734')
  {
 var splitmemo =   nlapiGetFieldValue('memo').indexOf(" |");  
     
var empEmail  = nlapiGetFieldValue('memo').substring(-1000, splitmemo);
    nlapiLogExecution('DEBUG', 'empEmail',empEmail );
    nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custbody186', empEmail);

  }

}