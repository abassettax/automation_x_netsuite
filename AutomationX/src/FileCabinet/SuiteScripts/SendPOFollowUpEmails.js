function EmailPOButton(context, form) {
  var sendemail = nlapiGetFieldValue('custbody201');
  if (sendemail == 'T') {

    var materialstatus = nlapiGetFieldValue('custbody6');
    if (materialstatus == 7 || materialstatus == 1 || materialstatus == 8) {
      var fieldMaterialStatus = form.getField('custbody202');
      if (fieldMaterialStatus) { fieldMaterialStatus.setDisplayType('normal'); }
    }

    nlapiLogExecution('debug', 'sendemail', sendemail);

    var materialstatuss = nlapiGetFieldValue('custbody6');
    var vendorid = nlapiGetFieldValue('entity');
    var POtransmitEmail = nlapiLookupField('vendor', vendorid, 'email');
    var thisPOID = nlapiGetRecordId();
    var documentnumber = nlapiGetFieldValue('tranid');


    if (materialstatus == 7 || materialstatus == 1 || materialstatus == 8)//////////////////////////////////start transmit email
    {

      var fileinvoice = nlapiPrintRecord('TRANSACTION', thisPOID, 'DEFAULT', null);
      fileinvoice.setName(documentnumber + ".pdf");

      var templateid = 66;
      if (nlapiGetFieldValue('custbody147') == 'T' && materialstatus == 7) { templateid = 75; } //drop
      if (nlapiGetFieldValue('custbody70') == 'T' && materialstatus == 7) { templateid = 74; }  // expidite 


      var author = nlapiGetUser();
      var USERNAME = nlapiLookupField('employee', author, 'entityid');
      var recipient = POtransmitEmail;

      var emailMerger = nlapiCreateEmailMerger(templateid); // Initiate Email Merger
      emailMerger.setTransaction(thisPOID); // Set the ID of the transaction where you are going to fetch the values to populate the variables on the template
      var mergeResult = emailMerger.merge(); // Merge the template with the email


      var emailSubject = mergeResult.getSubject(); // Get the subject for the email
      var emailBody = mergeResult.getBody(); // Get the body for the email

      if (materialstatus == 1) { emailSubject = ' **Confirm PO** Automation-X Corporation: Purchase Order # ' + documentnumber; emailBody = '**DO NOT DUPLICATE**THIS IS A REQUEST FOR AN UPDATE ON AN EXISTING ORDER** Please confirm receipt of ' + documentnumber + ' and provide a ship date.'; }///unconfirmed
      if (materialstatus == 8) { emailSubject = ' **Ship Dates** Automation-X Corporation: Purchase Order # ' + documentnumber; emailBody = '**DO NOT DUPLICATE**THIS IS A REQUEST FOR AN UPDATE ON AN EXISTING ORDER** Please provide a ship date for our order ' + documentnumber + '. If the order has shipped, please provide tracking.'; }///confirmed pending ship dates
      if (materialstatus == 8 && nlapiGetFieldValue('custbody147') == 'T') { emailSubject = ' **Ship Dates** Automation-X Corporation: Purchase Order # ' + documentnumber; emailBody = '**DO NOT DUPLICATE**THIS IS A REQUEST FOR AN UPDATE ON AN EXISTING ORDER** Please provide a ship date for our order ' + documentnumber + '. If the order has shipped, please provide tracking and freight cost.'; }///confirmed pending ship dates

      var records = new Object();
      records['transaction'] = thisPOID;

      nlapiSendEmail(author, recipient, emailSubject, emailBody, ['purchasing@automation-x.com '], null, records, fileinvoice, true); // Send the email with merged template 
      var now = new Date();
      var dd = now.getDate();
      var month = now.getMonth() + 1;
      var y = now.getFullYear();
      var transmistiondate = month + '/' + dd + '/' + y;

      var ExistingreleaseNotes = nlapiGetFieldValue('custbody45');

      var releasenotes = '';
      if (materialstatus == 7 && !ExistingreleaseNotes) { releasenotes = transmistiondate + ' Emailed to Vendor. ' + USERNAME; } // untransmited 
      if (materialstatus == 1 && !ExistingreleaseNotes) { releasenotes = transmistiondate + ' Emailed to Vendor for confirmation. ' + USERNAME; }///unconfirmed
      if (materialstatus == 8 && !ExistingreleaseNotes) { releasenotes = transmistiondate + ' Emailed to Vendor for ship dates.' + USERNAME; }///confirmed pending ship dates
      if (materialstatus == 8 && !ExistingreleaseNotes && nlapiGetFieldValue('custbody147') == 'T') { releasenotes = transmistiondate + 'Emailed to Vendor for ship dates  and freight cost. ' + USERNAME; }///confirmed pending ship dates drop

      if (ExistingreleaseNotes && materialstatus == 7) { releasenotes = ExistingreleaseNotes + '</br>' + transmistiondate + ' Emailed to Vendor. ' + USERNAME; }
      if (ExistingreleaseNotes && materialstatus == 1) { releasenotes = ExistingreleaseNotes + '</br>' + transmistiondate + ' Emailed to Vendor for confirmation. ' + USERNAME; }///unconfirmed
      if (ExistingreleaseNotes && materialstatus == 8) { releasenotes = ExistingreleaseNotes + '</br>' + transmistiondate + ' Emailed to Vendor for ship dates. ' + USERNAME; }///confirmed pending ship dates
      if (ExistingreleaseNotes && materialstatus == 8 && nlapiGetFieldValue('custbody147') == 'T') { releasenotes = ExistingreleaseNotes + '</br>' + transmistiondate + ' Emailed to Vendor for ship dates and freight cost. ' + USERNAME; }///confirmed pending ship dates

      var lastsaved = transmistiondate;
      var shipdate = "";

      var daystoadd = 2;
      var today = new Date();
      var nextactionday = now.getDay();

      if (nextactionday == 4) { daystoadd = 5; } else if (nextactionday == 5) { daystoadd = 4; }
      var nextactiondate = nlapiAddDays(today, daystoadd);

      nlapiLogExecution('debug', 'releasenotes', releasenotes);
      nlapiLogExecution('debug', 'lastsaved', lastsaved);
      nlapiLogExecution('debug', 'shipdate', shipdate);
      nlapiLogExecution('debug', 'nextactiondate', nextactiondate);

      var newmaterialstatus = 1;
      if (materialstatuss == 8) { newmaterialstatus = 8; }

      nlapiSubmitField('purchaseorder', thisPOID, ['custbody45', 'shipdate', 'custbody6', 'custbody77', 'custbody71', 'custbody201'], [releasenotes, shipdate, newmaterialstatus, lastsaved, nextactiondate, 'F']);
      var selectedTabParam = new Array();
      selectedTabParam['selectedtab'] = 'cmmnctntab';
      selectedTabParam['custparamsendemail'] = 'T';

      nlapiSetRedirectURL('record', 'purchaseorder', thisPOID, false, selectedTabParam);

    }

  }

}