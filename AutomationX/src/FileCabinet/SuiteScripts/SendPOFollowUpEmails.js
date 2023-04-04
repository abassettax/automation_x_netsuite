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

    if ((materialstatus == 7 || materialstatus == 1) && POtransmitEmail != '')//////////////////////////////////start transmit email
    {

      var fileinvoice = nlapiPrintRecord('TRANSACTION', thisPOID, 'DEFAULT', null);
      fileinvoice.setName(documentnumber + ".pdf");

      var templateid = 66;
      if (nlapiGetFieldValue('custbody147') == 'T' && materialstatus == 7) { templateid = 75; } //drop
      if (nlapiGetFieldValue('custbody70') == 'T' && materialstatus == 7) { templateid = 74; }  // expidite 


      var author = nlapiGetUser();
      // var author = 38129;
      var USERNAME = nlapiLookupField('employee', author, 'entityid');
      var recipient = POtransmitEmail;

      var emailMerger = nlapiCreateEmailMerger(templateid); // Initiate Email Merger
      emailMerger.setTransaction(thisPOID); // Set the ID of the transaction where you are going to fetch the values to populate the variables on the template
      var mergeResult = emailMerger.merge(); // Merge the template with the email


      // var emailSubject = mergeResult.getSubject(); // Get the subject for the email
      // var emailBody = mergeResult.getBody(); // Get the body for the email

      var emailBody = '<font size="2"><b><font color="#ff0000"><span style="mso-spacerun: yes">***PLEASE NOTE THE SHIP TO ADDRESS***</span></font></b></font><br /><br /><b>Automation-X Corporation: Purchase Order # '+documentnumber+'</b><br /><br />';                   


      if (materialstatus == 1) { 
        var emailSubject = ' **Confirm PO** Automation-X Corporation: Purchase Order # ' + documentnumber;
        emailBody += '<font size="3">Please review the attached purchase order and reply to this email within <b>24 hours</b> to verify this purchase order was received and processed. Please include an expected ship date and/or tracking if available.</font><p><font size="3"><font face="Calibri"><span style="mso-spacerun: yes">';
 
      }///unconfirmed
      if (materialstatus == 7) { 
        var emailSubject = ' **Confirm PO Ship Date** Automation-X Corporation: Purchase Order # ' + documentnumber;
        emailBody += '<font size="3">Please review the attached purchase order and reply to this email within <b>24 hours</b> to verify this purchase order was received and processed. Please include an expected ship date and/or tracking if available.</font><p><font size="3"><font face="Calibri"><span style="mso-spacerun: yes">';
 
      }///unconfirmed

      emailBody += '<b>NOTE: If pricing on PO is not correct, do not ship product until you have received a revised PO.  Acceptance of this PO constitutes acceptance of listed pricing.</b></span></font></font></p><font size="3"><font face="Calibri"><font face="Arial" size="1"> </font></font></font><p align="center" class="MsoNormal" style="TEXT-ALIGN: center; MARGIN: 0in 0in 0pt"><b style="mso-bidi-font-weight: normal"><font size="3">Automation-X Shipping Terms:</font></span></b></p><p align="center"><font size="3"><font size="2"><b>Standard Warehouse Shipments:</b></font></font></p><p align="center" class="MsoNormal" style="text-align: center; margin: 0in 0in 0pt;"><font size="3"><font face="Calibri"><span style="font-family: "Garamond","serif";">Please ship all small package shipments via UPS Ground account #05R4X4.  </span></font></font></p><p align="center" class="MsoNormal" style="TEXT-ALIGN: center; MARGIN: 0in 0in 0pt"><font size="3"><font face="Calibri">For Freight shipments use FedEx Freight #653849990.  These shipping accounts can be used for anything that is shipping to one of our warehouse locations.<br /><br />Please send an order confirmation or report any discrepancies within 24 hours to <font color="#0000ff"><a href="mailto:purchasing@automation-x.com">purchasing@automation-x.com</a>. </font>Please include estimated ship dates. In the event of delays or back-orders please contact purchasing immediately.<br /><br />Please let us know if you have any questions.<br /><br />Have a great week!</span></font></font></p><font size="3"><font face="Calibri"> </font></font><p align="center"><font size="3"><font face="Calibri"><a href="mailto:purchasing@automation-x.com"><font color="#0000ff">purchasing@automation-x.com</font></a></span></font></font></p>';

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
      // if (materialstatus == 8 && !ExistingreleaseNotes) { releasenotes = transmistiondate + ' Emailed to Vendor for ship dates.' + USERNAME; }///confirmed pending ship dates
      // if (materialstatus == 8 && !ExistingreleaseNotes && nlapiGetFieldValue('custbody147') == 'T') { releasenotes = transmistiondate + 'Emailed to Vendor for ship dates  and freight cost. ' + USERNAME; }///confirmed pending ship dates drop

      if (ExistingreleaseNotes && materialstatus == 7) { releasenotes = ExistingreleaseNotes + '</br>' + transmistiondate + ' Emailed to Vendor. ' + USERNAME; }
      if (ExistingreleaseNotes && materialstatus == 1) { releasenotes = ExistingreleaseNotes + '</br>' + transmistiondate + ' Emailed to Vendor for confirmation. ' + USERNAME; }///unconfirmed
      // if (ExistingreleaseNotes && materialstatus == 8) { releasenotes = ExistingreleaseNotes + '</br>' + transmistiondate + ' Emailed to Vendor for ship dates. ' + USERNAME; }///confirmed pending ship dates
      // if (ExistingreleaseNotes && materialstatus == 8 && nlapiGetFieldValue('custbody147') == 'T') { releasenotes = ExistingreleaseNotes + '</br>' + transmistiondate + ' Emailed to Vendor for ship dates and freight cost. ' + USERNAME; }///confirmed pending ship dates

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

      nlapiSubmitField('purchaseorder', thisPOID, ['custbody45', 'shipdate', 'custbody6', 'custbody77', 'custbody71', 'custbody201', 'custbody242'], [releasenotes, shipdate, newmaterialstatus, lastsaved, nextactiondate, 'F', today]);
      var selectedTabParam = new Array();
      selectedTabParam['selectedtab'] = 'cmmnctntab';
      selectedTabParam['custparamsendemail'] = 'T';

      nlapiSetRedirectURL('record', 'purchaseorder', thisPOID, false, selectedTabParam);

    }

  }

}