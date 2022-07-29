//2815 check id 

//new class 63



//saved search 2206

function updateRecord()
{

var records = nlapiSearchRecord('paycheck', 2206, null, null); //you will have to specify the search you need to grab specifically the records you need to update. Refer to the dev guide this API

for ( var i = 0; records != null && i < records.length; i++ )
{
var record = nlapiLoadRecord( 'paycheck',1111266 );
record.setFieldValue('class', 63); //replace xxx by the internal id of the department you want to update to

nlapiSubmitRecord(record, false, true);

}

}