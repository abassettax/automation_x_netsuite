function fxn_generatePDFSOinvCheck(frank)
{
 
 var CF =frank;
  var thisorder = frank;

  //call the Suitelet created in Step 1
  var createPDFURL = nlapiResolveURL('SUITELET', 'customscript861',  'customdeploy1', false);
  
  //pass the internal id of the current record
  createPDFURL += '&id=' +frank
 
  //show the PDF file 
  window.open(createPDFURL );
    
        //if(win.document) { 
              //  win.document.write('<html><head><title>Invoice PDF Merge</title></head><body height="100%" width="100%"><iframe id="pdfprint" src="' + createPDFURL + '" height="100%" width="100%"></iframe></body></html>');


        // }

}
