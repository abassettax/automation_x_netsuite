function updateShipDate(type, name) {



  if (nlapiGetRecordId()) {
    var searchstartdate = new Date();
    var dd = searchstartdate.getDate();
    var mm = searchstartdate.getMonth() + 1;
    var y = searchstartdate.getFullYear();
    var searchstartdateformated = mm + '/' + dd + '/' + y;

    var daystoadd = 2;
    var now = new Date();
    var nextactionday = now.getDay();
    if (nextactionday == 4) { daystoadd = 5; } else if (nextactionday == 5) { daystoadd = 4; }
    var nextactiondate = nlapiAddDays(searchstartdate, daystoadd);

    var rcdOld = nlapiGetOldRecord();// loading the old record 
    //var rcdOldFields = rcdOld.getAllFields();

    var record = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId()); // loading the new record
    // nlapiLogExecution('debug','rcdOldFields', s);

    // old record
    var oldRcustbody197 = rcdOld.getFieldValue('custbody197');
    var oldRcustbody71 = rcdOld.getFieldValue('custbody71');
    var oldRcustbody6 = rcdOld.getFieldValue('custbody6');
    var oldRcustbody158 = rcdOld.getFieldValue('custbody158');
    var oldRcustbody198 = rcdOld.getFieldValue('custbody198');
    var oldRcustbody203 = rcdOld.getFieldValue('custbody203');

    //newrecord
    var newRcustbody197 = record.getFieldValue('custbody197');
    var newRcustbody71 = record.getFieldValue('custbody71');
    var newRcustbody6 = record.getFieldValue('custbody6');
    var newRcustbody158 = record.getFieldValue('custbody158');
    var newRcustbody198 = record.getFieldValue('custbody198');
    var newRcustbody203 = record.getFieldValue('custbody203');

    var changed = 0;
    // for (var z = 0; z < rcdOldFields.length; z++)
    //    {
    if (oldRcustbody197 != newRcustbody197 || newRcustbody71 != oldRcustbody71 || newRcustbody6 != oldRcustbody6 || newRcustbody158 != oldRcustbody158 || newRcustbody198 != oldRcustbody198 || newRcustbody203 != oldRcustbody203) { changed = 1; nlapiLogExecution('debug', 'changed', changed); }
    //    }
    if (changed > 0) {
      nlapiLogExecution('debug', 'in', '');
      record.setFieldValue('custbody77', searchstartdateformated);      // set last saved date
      if (newRcustbody71 == oldRcustbody71 && newRcustbody71 > oldRcustbody71) { record.setFieldValue('custbody71', nextactiondate); }// set nextactiondate 

      if (record.getFieldValue('custbody203')) { var combineReleaseNotes = record.getFieldValue('custbody45') + '</br>' + record.getFieldValue('custbody203'); record.setFieldValue('custbody45', combineReleaseNotes); }

      if (rcdOld.getFieldValue('custbody198') != record.getFieldValue('custbody198') && record.getFieldValue('custbody198')) // compare field values 
      {
        var originalshipdate = record.getFieldValue('shipdate');
        var newshipdate = record.getFieldValue('custbody198');
        //nlapiLogExecution('debug','shipdatenew', record.getFieldValue('custbody198'));
        record.setFieldValue('shipdate', record.getFieldValue('custbody198'));

        var lineCount = record.getLineItemCount('item');
        for (var i = lineCount; i >= 1; i--) {

          var qtyremaining = parseInt(record.getLineItemValue('item', 'quantity', i)) - parseInt(record.getLineItemValue('item', 'quantityreceived', i));
          var linedate = record.getLineItemValue('item', 'custcol11', i);
          if (linedate == originalshipdate && qtyremaining > 0) {
            record.selectLineItem('item', i);
            record.setCurrentLineItemValue('item', 'custcol11', newshipdate, true);
            record.commitLineItem('item');
          }
        }
      }

      // start email 
      nlapiLogExecution('debug', '1', '');

      var tranid = nlapiGetRecordId();
      nlapiLogExecution('debug', 'tranid', tranid);
      var oldPO = "";
      if (tranid) { var oldPO = nlapiGetRecordId(); }

      var rec = record.getFieldValue('custbody_po_follow_up');
      var sendemail = record.getFieldValue('custbody76');



      var porecord = new Array();
      porecord['transaction'] = nlapiGetRecordId();

      var VenHoldCheck = record.getFieldValue('custbody6');

      var soid = record.getFieldValue('createdfrom');
      var SOS = "";
      var SO = record.getFieldText('createdfrom');
      if (SO) { SOS = SO; } else { SOS = record.getFieldValue('custbody184'); }
      var soCust = "";

      if (soid) { soCust = nlapiLookupField('transaction', soid, 'entity', true); }
      if (rec) {
        //var CFtype = ""
        //if(SO.indexOf("Sales") == -1)
        //  {CFtype='salesorder';}

        nlapiLogExecution('debug', '2', '');

        //if(!rec && SO && CFtype !=""){   rec = nlapiLookupField(CFtype,soid,'custbody_po_follow_up');  record.setFieldValue('custbody_po_follow_up', rec );   }
        var hasPOemail = record.getFieldValue('custbody_po_follow_up'); //updated to look for follow up email not if its linked to SO    
        if (hasPOemail) {
          //var CFtype = "salesorder"
          //if(SO.startsWith("Sales"))
          // {CFtype='salesorder';}

          //////////start get customers
          var columnsD = new Array();
          columnsD[0] = new nlobjSearchColumn("custrecord241", null, "GROUP").setSort(false);
          columnsD[1] = new nlobjSearchColumn("formulatext", null, "GROUP").setFormula("{custrecord241}");
          columnsD[2] = new nlobjSearchColumn("custbody38", "CUSTRECORD_PO_SO_LINKAGE_SO", "GROUP"); //Tech
          columnsD[3] = new nlobjSearchColumn("custbody9", "CUSTRECORD_PO_SO_LINKAGE_SO", "GROUP"); //well number
          columnsD[4] = new nlobjSearchColumn("custbody8", "CUSTRECORD_PO_SO_LINKAGE_SO", "GROUP"); //Well Name 
          columnsD[5] = new nlobjSearchColumn("custbody73", "CUSTRECORD_PO_SO_LINKAGE_SO", "GROUP"); // approver
          columnsD[6] = new nlobjSearchColumn("otherrefnum", "CUSTRECORD_PO_SO_LINKAGE_SO", "GROUP"); //Cust PO

          var customrecord_dh_po_so_linkageSearch = nlapiSearchRecord("customrecord_dh_po_so_linkage", null,
            [
              ["custrecord_po_so_linkage_po.internalidnumber", "equalto", tranid],
              "AND",
              ["custrecord_po_so_linkage_so_line", "isnotempty", ""]
            ],
            columnsD
          );

          var CUS = "";
          var thisCust = "";
          var tech = "";
          var WellNumber = "";
          var wellName = "";
          var approver = "";
          var customerPO = "";

          var Thistech = "";
          var ThisWellNumber = "";
          var ThiswellName = "";
          var Thisapprover = "";
          var ThiscustomerPO = "";

          if (customrecord_dh_po_so_linkageSearch) {
            var lineCount = parseInt(customrecord_dh_po_so_linkageSearch.length);
            for (b = 0; b < lineCount && customrecord_dh_po_so_linkageSearch; b++) {
              thisCust = customrecord_dh_po_so_linkageSearch[b].getValue(columnsD[1]);
              CUS += thisCust;

              Thistech = customrecord_dh_po_so_linkageSearch[b].getValue(columnsD[2]);
              ThisWellNumber = customrecord_dh_po_so_linkageSearch[b].getValue(columnsD[3]);
              ThiswellName = customrecord_dh_po_so_linkageSearch[b].getValue(columnsD[4]);
              Thisapprover = customrecord_dh_po_so_linkageSearch[b].getValue(columnsD[5]);
              ThiscustomerPO = customrecord_dh_po_so_linkageSearch[b].getValue(columnsD[6]);

              tech += Thistech + ",";
              WellNumber += ThisWellNumber + ",";
              wellName += ThiswellName + ",";
              approver += Thisapprover + ",";
              customerPO += ThiscustomerPO + ",";

            }
          }
          //////////////////////////end get customers


          //if(!rec && SO && CFtype !=""){  rec = nlapiLookupField(CFtype,soid,'custbody_po_follow_up'); nlapiSetFieldValue('custbody_po_follow_up', rec );   }



          if (sendemail == "T" && rec && VenHoldCheck != 37 && VenHoldCheck != 34) {
            nlapiLogExecution('debug', '2.6', '');
            var PO = record.getFieldValue('tranid');
            var NA = record.getFieldValue('custbody71');
            var MS = record.getFieldText('custbody6');
            var RN = record.getFieldValue('custbody45');
            var VN = record.getFieldText('entity');
            //var CUS = "";
            //if(soCust){CUS = soCust;}
            var redate = record.getFieldValue('shipdate');
            //alert(redate);


            var author = nlapiGetUser();

            //--------------------------
            nlapiLogExecution('debug', '3', '');

            //alert(rec);
            var sub = ("PO Update " + PO + " Created From " + SO + " Vendor: " + VN + " Customer : " + CUS + " ( " + tech + " )");
            if (!CUS) { sub = "PO Update " + PO + " Created From Stock Request for  Vendor: " + VN; }
            var body = (PO + " created from " + SO + " for " + CUS + " containg items from " + VN + " has been Updated <br><br>" + " <b>Next Action: </b>" + NA + "<br>" + " <b>Material Status: </b>" + MS + "<br>" + " <b>Expected Ship Date(Line1):</b> " + redate + "<br><br>" + " <b>Release Notes:</b><br> " + RN + "<BR><BR> This email is an automated email alerting you that a change has been made to a Purchase Order related to one of your orders. <b>Tech:</b> " + tech + " <b>WellName/Number </b>" + wellName + " / " + wellName + " <b>Approver</b> " + approver + " <b>Customer PO </b>" + customerPO + "               Please call purchasing with additional questions-.");

            if (!CUS) {
              sub = "PO Update " + PO + " Created from a Purchasing Request for Vendor: " + VN;
              body = PO + " created from a Purchasing Request from " + VN + " has been Updated <br><br>" + " <b>Next Action: </b>" + NA + "<br>" + " <b>Material Status: </b>" + MS + "<br>" + " <b>Expected Ship Date(Line1):</b> " + redate + "<br><br>" + " <b>Release Notes:</b><br> " + RN + "<BR><BR> This email is an automated email alerting you that a change has been made to a Purchase Order related to one of your requests.  Please call purchasing with additional questions.";
            }

            nlapiSendEmail(author, rec, sub, body, null, null, porecord);

            nlapiLogExecution('debug', '4', '');
          }
        }
      }


      //end email
      nlapiSubmitRecord(record, true);

    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

