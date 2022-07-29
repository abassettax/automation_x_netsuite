function TempFFUpdate()
{
var searchresults = nlapiSearchRecord('transaction', 6125, null, null );
for ( var x = 0; searchresults != null && x < searchresults.length ; x++ )
 		{
          var searchresult = searchresults[x];	
var iid = searchresult.getId( );
var afe =searchresult.getValue("custbody214","createdFrom",null);
var loe =searchresult.getValue("custbody215","createdFrom",null);
var invoiceappr =searchresult.getValue("custbody212","createdFrom",null);
var wellname =searchresult.getValue("custbody8","createdFrom",null);
          var signedby = searchresult.getValue("custbody169","createdFrom",null);

   var rec = nlapiLoadRecord('itemfulfillment', iid);
          rec.setFieldValue('custbody214' , afe);
            rec.setFieldValue('custbody215' , loe); 
             rec.setFieldValue('custbody212' ,invoiceappr );
             rec.setFieldValue('custbody8' , wellname);
           rec.setFieldValue('custbody169' , signedby);
nlapiSubmitRecord(rec);
          nlapiLogExecution('debug','FF - line', iid + '  - '+ x);	
        }


}