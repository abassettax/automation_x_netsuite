function changeclass(recordType, recordID)
{

var cust_class ="51";


nlapiSubmitField(recordType, recordID, 'class', cust_class );



var recOpportunity = nlapiLoadRecord(recordType, recordID);
recOpportunity.setFieldValue('class', cust_class );
nlapiSubmitRecord(recOpportunity); 
}
