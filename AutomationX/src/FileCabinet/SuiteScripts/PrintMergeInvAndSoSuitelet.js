function xmltoPDF_pdfSetSOINVCHECK(request, response)
{

  
 var sResult = new Array();
 
 sResult = nlapiSearchRecord('transaction', 'customsearch5696', null, null); //load an existing transaction saved search or create a search
 
 var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
   xml += "<pdfset>";
 
 for(var i=0; sResult != null && i < sResult.length; i++){
  
  var sColumns = sResult[i].getAllColumns();
  
  //generate invoice printout
  var pdfFile = nlapiPrintRecord('TRANSACTION', sResult[i].getValue("internalid"),'PDF');
  var SOFILE =  nlapiPrintRecord('TRANSACTION', sResult[i].getValue("internalid","createdFrom",null),'PDF');  
  //set target folder in file cabinet
  pdfFile.setFolder(6301359);
     SOFILE.setFolder(6301359);
   
  //Set Available without login to true
  pdfFile.setIsOnline(true);
  SOFILE.setIsOnline(true);
   
     //store file in cabinet
  var fileID = nlapiSubmitFile(pdfFile);
 var SOfileID = nlapiSubmitFile(SOFILE);


  
  // load the file to get its URL
  var fileURL = nlapiLoadFile(fileID).getURL();
  var fileURLSO = nlapiLoadFile(SOfileID).getURL();
   
  var pdf_fileURL = nlapiEscapeXML(fileURL);
 var pdf_fileURLSO = nlapiEscapeXML(fileURLSO);
   
    xml += "<pdf src='"+ pdf_fileURL +"'/>";
     xml += "<pdf src='"+ pdf_fileURLSO +"'/>";
    nlapiLogExecution('debug', i , nlapiGetContext().getRemainingUsage() );
        
 }
 
 
   xml += "</pdfset>";
   var consolidatedPDF = nlapiXMLToPDF(xml);
//response.setContentType('PDF', 'Print.pdf ', 'inline');
  
  var searchstartdate =   new Date();  
var dd = searchstartdate.getDate();
var mm = searchstartdate.getMonth()+1;
var y = searchstartdate.getFullYear();
var today=  mm  + '/'+dd+ '/'+ y;
  
     consolidatedPDF.setFolder(6301359);
     consolidatedPDF.setName('Automation-X Consolidated Invoice File ' + today);
nlapiSubmitFile(consolidatedPDF);
  
    // response.write( consolidatedPDF.getValue() );   
  
}