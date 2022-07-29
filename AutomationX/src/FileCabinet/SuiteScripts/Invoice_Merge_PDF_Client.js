function fxn_generatePDF()
{
  
  var CF = nlapiGetFieldValue('createdfrom' );
  var thisorder = nlapiGetFieldValue('tranid');

  //call the Suitelet created in Step 1
  var createPDFURL = nlapiResolveURL('SUITELET', 'customscript390',  'customdeploy1', false);
  
  //pass the internal id of the current record
  createPDFURL += '&id=' + nlapiGetRecordId()+ '&cf=' + CF;
 
  //show the PDF file 
 var  win = window.open( );
    
         if(win.document) { 
                win.document.write('<html><head><title>Invoice PDF Merge</title></head><body height="100%" width="100%"><iframe id="pdfprint" src="' + createPDFURL + '" height="100%" width="100%"></iframe></body></html>');
     var iframe = win.document.frames ? win.document.frames["pdfprint"] : win.document.getElementById("pdfprint");
   var ifWin = iframe.contentWindow || iframe;
    iframe.focus();
    ifWin.print();

         }

}

///////////////////////////
////////////////////////////
///////////////////////////////


function fxn_generatePDF_savedsearch(frank)
{

  var thisorder =frank*1;
 
  var CF = nlapiLookupField('invoice', thisorder, 'createdfrom');


  //call the Suitelet created in Step 1
  var createPDFURL = nlapiResolveURL('SUITELET', 'customscript390',  'customdeploy1', false);
  
  //pass the internal id of the current record
  createPDFURL += '&id=' + thisorder + '&cf=' + CF;
 
 window.open(createPDFURL );

}
