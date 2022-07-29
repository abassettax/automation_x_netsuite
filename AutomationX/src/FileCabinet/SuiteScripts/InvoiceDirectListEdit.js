function invdirectlistedit(type, name)
{

//if(name == 'custbody208')
//{
  var record = nlapiLoadRecord(nlapiGetRecordType(),nlapiGetRecordId()); // loading the new record
  var rcdOld = nlapiGetOldRecord();
  
 
  
  var oldRrecord=    rcdOld.getFieldValue('otherrefnum');
  var newrecord =    record.getFieldValue('custbody208');
if(oldRrecord != newrecord && newrecord){
  
   record.setFieldValue( 'otherrefnum', record.getFieldValue('custbody208'));
 nlapiSubmitRecord(record,true); 
 
     }
}