function CreatePDFandSend(request, response)

{

//retrieve the record id passed to the Suitelet
   var recId = request.getParameter('id');
   var filename = request.getParameter('tranNum');
   var rectype = request.getParameter('rectype');
   //var newfilenum =localStorage.Newfiles;
  //localStorage.Newfiles = 1;
nlapiLogExecution('debug','recId', recId );
nlapiLogExecution('debug','rectype', rectype );
///////////////////////////////////////////////////////
 var printtype = 'TRANSACTION';
 if(rectype =='itemfulfillment' )
   {
    printtype = 'PACKINGSLIP'; 
    }
 
 var invFile = nlapiPrintRecord(printtype, recId,'PDF');
  invFile.setFolder(3630067);
  invFile.setIsOnline(true);
 var nametype = "";
  if(rectype =='itemfulfillment' )
   {
   nametype = 'Packing_Slip'; 
    }
if (rectype =='salesorder' )
   {
   nametype = 'Sales_Order' ;
  }


  invFile.setName(nametype + ' ' + filename + ' ' + 'Docusign.pdf' );

  //store file in cabinet
 var invfileID = nlapiSubmitFile(invFile);
//localStorage.NewFileID =invfileID;
nlapiAttachRecord('file', invfileID, 'itemfulfillment', recId);
  
response.write( invFile );   
//nlapiDetachRecord('file', invfileID, 'itemfulfillment', recId);
}


