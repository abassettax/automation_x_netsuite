function AFTERSAVESIGjf(type) {
   if (type == 'delete')
  {
   return false;
  }
  var recid = nlapiGetRecordId(); //get record ID

   var RT = nlapiGetRecordType();
	var rec = nlapiLoadRecord(RT,recid); //load the record
  
  //remove oldsignature
  var sigtoRemove = "";
  if(RT != 'salesorder')
  {sigtoRemove = nlapiGetFieldValue('custbodysavedsignature');}
  else{ sigtoRemove = nlapiGetFieldValue('custbodycustbodysavedsignature_ff');}
  
  if(sigtoRemove)
  {nlapiDetachRecord('file', sigtoRemove, RT, recid);}




var src = rec.getFieldValue('custbody140');
      if(src != null && src != "undefined" && src.length > 1000){


var src=src.substring(22);
var Sdate  = new Date();
var file1 = nlapiCreateFile('salesorder'+recid + '_' + Sdate + '.png', 'PNGIMAGE', src);
file1.setFolder(2331330);
file1.setIsOnline(true);
var recordid=nlapiSubmitFile(file1);

       
        var test= "";
if(RT != 'salesorder')
  {test=rec.setFieldValue('custbodycustbodysavedsignature_ff',recordid);}
        else{ test=rec.setFieldValue('custbodysavedsignature',recordid);}


//test=rec.setFieldValue('custbodysavedsignature',recordid);

//start url create
   var file = nlapiLoadFile(recordid);

if(file !="" || file  != null )
{
   var imageUrl = file.getURL();
  // var completeUrl =   'https://system.na3.netsuite.com' + imageUrl
   var completeUrl ='https://422523.app.netsuite.com/'+ imageUrl

   rec.setFieldValue('custbody141',completeUrl);



/////////////end url create

var SOid=nlapiSubmitRecord(rec);
}

}
    
}

