function fxn_generatePDFSOinvCheck(frank)
{

 var CF =frank;
  var thisorder = frank;

  //call the Suitelet created in Step 1
  var createPDFURL = nlapiResolveURL('SUITELET', 'customscript1270',  'customdeploy1', false);
  
  //pass the internal id of the current record
 // createPDFURL += '&id=' +frank

 
 //show the PDF file 
 window.open(createPDFURL );
 

}