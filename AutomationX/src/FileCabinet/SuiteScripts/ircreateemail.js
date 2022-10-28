function beforesubitIR(type) {
  /////////////////////////////////landed cost value
  var landedCostPercent = .02;
  ////////////////////////////////////////////////
  var cf = nlapiGetFieldText('createdfrom');
  //nlapiLogExecution('DEBUG', 'cf', cf); 

  if (cf.indexOf("Purchase") > -1) {
    var amountlandedcost = 0;
    var amountrate = 0;
    var lineCount = parseInt(nlapiGetLineItemCount('item'));
    nlapiLogExecution('DEBUG', 'lineCount', lineCount);
    for (x = 1; x <= lineCount; x++) {
      //need to explicitly check context instead of implicitly checking qty. otherwise we may attribute landed shipping from other receivable lines, not just received lines
      // if (type == 'create') {
        var receive = nlapiGetLineItemValue('item', 'itemreceive', x);
      // } else {
      //   var receive = 'T';
      // }
      nlapiLogExecution('DEBUG', 'receive', receive);
      var qty = nlapiGetLineItemValue('item', 'quantity', x);
      if ((qty && qty > 0) && receive == 'T') {
        var itemrate = nlapiGetLineItemValue('item', 'rate', x);
        var itemtypes = nlapiGetLineItemValue('item', 'itemtype', x);
        nlapiLogExecution('DEBUG', 'itemtypes', itemtypes);
        if (itemrate > 0 && itemtypes == 'InvtPart') { amountlandedcost = parseFloat(amountlandedcost) + ((itemrate * parseInt(qty)) * landedCostPercent); }
        amountrate = parseFloat(amountrate) + itemrate * parseInt(qty);
      }
    }
    var landed1 = nlapiGetFieldValue('landedcostamount1');
    var landed2 = nlapiGetFieldValue('landedcostamount2');
    var landed3 = nlapiGetFieldValue('landedcostamount3');
    var landed4 = nlapiGetFieldValue('landedcostamount4');
    var actLanded = landed1 + landed2 + landed3 + landed4;
    if ((landed1 == '' && landed2 == '' && landed3 == '' && landed4 == '') && nlapiGetFieldValue('landedcostsource1') == 'MANUAL' && amountlandedcost > .01) {
      actLanded = amountlandedcost;
      nlapiSetFieldValue('landedcostmethod', 'VALUE');
      nlapiSetFieldValue('landedcostamount1', amountlandedcost);
    }
    nlapiLogExecution('DEBUG', 'actLanded', actLanded);
    nlapiLogExecution('DEBUG', 'amountrate', amountrate);
    nlapiLogExecution('DEBUG', 'landed cost %', (actLanded/amountrate) * 100);
    if (actLanded > .01 && amountrate > 0) {
      nlapiSetFieldValue('custbody187', (actLanded/amountrate) * 100);
      nlapiSetFieldValue('custbody238', nlapiGetFieldValue('landedcostsource1'));
    }
  }

}



function ircreate(type, request, response) {

  /////////////////////////////////////////////////////////////////
  if (type == ' create ') {
    var npo = nlapiGetFieldValue('createdfrom');

    var createdfromtype = nlapiLookupField('transaction', npo, 'type', true);


    if (createdfromtype != 'Transfer Order' && createdfromtype != 'Return Authorization') {



      var record = nlapiLoadRecord('purchaseorder', npo);


      var so = record.getFieldValue('createdfrom');


      if (so != null && createdfromtype != "transferorder" && createdfromtype != 'returnauthorization') {


        var po = record.getFieldValue('tranid');
        var loc = record.getFieldValue('location');

        var rec = record.getFieldValue('custbody_po_follow_up');

        if (rec != null) {

          var sendemail = record.getFieldValue('custbody76');


          var date = new Date();
          var month = (date.getMonth() + 1);
          var day = date.getDate();
          var year = date.getFullYear();

          var today = (month + "/" + day + "/" + year);

          //nlapiSetFieldValue('custbody77',today);


          var soid = record.getFieldValue('createdfrom');

          var so = record.getFieldText('createdfrom');


          var PO = nlapiGetFieldText('createdfrom');
          var NA = record.getFieldValue('custbody71');
          var MS = record.getFieldValue('custbody6');
          var RN = record.getFieldValue('custbody45');
          var VN = record.getFieldText('entity');



          var author = nlapiGetUser();
          var rec = record.getFieldValue('custbody_po_follow_up');
          var sub = ("PO received Notification: " + PO + " Created From " + so + " Vendor: " + VN + " ");
          var body = (PO + " has been received. It was created from " + so + " and contains items from " + VN + "<br><br>" + " Release Notes: " + RN + "<BR><BR> This email is an automated email alerting you that a change has been made to a Purchase Order related to one of your orders.  Please call purchasing with additional questions.");


          nlapiSendEmail(author, rec, sub, body);

          return (true);

        }
      }
    }
  }
}