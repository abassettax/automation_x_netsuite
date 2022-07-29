function changeclass(recordType, recordID)
{

//nlapiSubmitField(recordType, recordID, 'class', cust_class );

var recOpportunity = nlapiLoadRecord(recordType, recordID);
var locid = recOpportunity.getFieldValue('adjlocation');
var cust_class = nlapiLookupField('location', locid , 'custrecord154');
recOpportunity.setFieldValue('class', cust_class );
nlapiSubmitRecord(recOpportunity,null, true); 

}