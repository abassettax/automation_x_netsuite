function autosendpos() {


  try {
    var searchresults = nlapiSearchRecord('transaction', 6089, null, null); // results from the POs_Pending_Auto_Transmission
  }
  catch (error) {
    var author = 38129;
    var recipienterror = "Purchasing@automation-x.com";
    var emailSubject = "Automation-X PO Auto Transmission Email Error";
    var emailBody = "Error on Auto Send PO Email Report saved search for auto generated emails has occured.  Please Contact your administrator.  Saved Search ID 6089  Script ID  customscript1515 " + error;  // Get the body for the email
    nlapiSendEmail(author, recipienterror, emailSubject, emailBody);

  }


  try {
    for (var mm = 0; searchresults != null && mm < searchresults.length; mm++) {

      var searchresult = searchresults[mm];
      var iid = searchresult.getId();
      var documentnumber = searchresult.getValue("tranid", null, null);
      var recipient = searchresult.getValue("email", "vendor", null); //'mike.harris@automation-x.com';//
      nlapiLogExecution('debug', 'vendor email', searchresult.getValue("email", "vendor", null));
      var sender = 38129;
      var releasenotes = searchresult.getValue("custbody45", null, null);

      var emailMerger = nlapiCreateEmailMerger('66'); // Initiate Email Merger
      emailMerger.setTransaction(iid); // Set the ID of the transaction where you are going to fetch the values to populate the variables on the template
      var mergeResult = emailMerger.merge(); // Merge the template with the email


      var emailSubject = "Automation-X Invoice " + documentnumber; //mergeResult.getSubject(); // Get the subject for the email
      var emailBody = mergeResult.getBody(); // Get the body for the email
      var emailSubject = mergeResult.getSubject(); // Get the body for the email

      var filePO = nlapiPrintRecord('TRANSACTION', iid, 'DEFAULT', null);
      filePO.setName(documentnumber + ".pdf");

      var records = new Object();
      records['transaction'] = iid;

      nlapiSendEmail(sender, recipient, emailSubject, emailBody, ['purchasing@automation-x.com '], null, records, filePO, true);

      var now = new Date();
      var dd = now.getDate();
      var month = now.getMonth() + 1;
      var y = now.getFullYear();
      var transmistiondate = month + '/' + dd + '/' + y;

      nlapiLogExecution('debug', '1', 1);

      var someDate = new Date();
      someDate.setDate(someDate.getDate() + 2);

      var ddNextAction = someDate.getDate();
      var monthNextAction = someDate.getMonth() + 1;
      var yNextAction = someDate.getFullYear();
      var NextActionDate = monthNextAction + '/' + ddNextAction + '/' + yNextAction;

      var breakBR = ''; if (releasenotes) { breakBR = '</br>'; }
      var releaseNoteThisPO = breakBR + " PO Auto Emailed " + transmistiondate;


      var materialStatus = 1; //'B: Unconfirmed';
      var LastSaved = transmistiondate;
      var NewReleaseNotes = releasenotes += releaseNoteThisPO;
      var nextAction = NextActionDate;

      var thisPO = nlapiLoadRecord('purchaseorder', iid); nlapiLogExecution('debug', 'iid', iid);
      thisPO.setFieldValue('custbody6', materialStatus);
      thisPO.setFieldValue('custbody77', LastSaved); nlapiLogExecution('debug', 'NewReleaseNotes', NewReleaseNotes);
      thisPO.setFieldValue('custbody45', NewReleaseNotes);
      thisPO.setFieldValue('custbody71', NextActionDate);
      nlapiSubmitRecord(thisPO, true);

    }
  }

  catch (error) {
    var author = 38129;
    var recipienterror = "Purchasing@automation-x.com";
    var emailSubject = "Automation-X PO Auto Transmission Email Error";
    var emailBody = "Error on Auto Send PO Email Report saved search for auto generated emails has occured in loop.  Please Contact your administrator.  Saved Search ID 6089  Script ID  customscript1515 " + error;  // Get the body for the email
    nlapiSendEmail(author, recipienterror, emailSubject, emailBody);
  }
  return true;
}