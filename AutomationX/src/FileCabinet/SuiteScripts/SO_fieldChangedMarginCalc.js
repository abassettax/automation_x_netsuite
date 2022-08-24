function FchangedMarginCalc(type, name) {
  if (nlapiGetFieldValue('customform') != 303) {

    if (name == 'povendor') { nlapiSetCurrentLineItemValue('item', 'costestimatetype', 'PURCHPRICE'); }

    if (name == 'price' || (type === 'item' && name == 'location') || name == 'custcol81') {


      //nlapiSetCurrentLineItemValue('item', 'custcol61', "",false);

      var linepricegroup = nlapiGetCurrentLineItemValue('item', 'price');
      // alert(linepricegroup);
      if (linepricegroup < 0) {
        nlapiSetCurrentLineItemValue('item', 'custcol61', "Please enter a target margin or select a price level to see margin.", false);
        return true;
      }




      var margincalcfield = "";
      var itemType = nlapiGetCurrentLineItemValue('item', 'itemtype');
      var itemLookupType = "";

      var uid = nlapiGetCurrentLineItemValue('item', 'item');
      switch (itemType) {

        case 'InvtPart':
          itemLookupType = 'inventoryitem';
          break;
        case 'Assembly':
          itemLookupType = 'assemblyitem';
          break;
        case 'Kit':
          itemLookupType = 'kititem';
          break;
        case 'Group':
          itemLookupType = 'kititem';
          break;

      }

      if (itemLookupType == 'inventoryitem' || itemLookupType == 'assemblyitem') {



        if (!window.preferedvendorrate && uid) {

          window.labelac = "AC:";
          var linelocation = nlapiGetCurrentLineItemValue('item', 'location');
          ///

          if (linelocation) {
            var columnsAC = new Array();
            columnsAC[0] = new nlobjSearchColumn("locationaveragecost", null, "AVG");
            columnsAC[1] = new nlobjSearchColumn("averagecost", null, "AVG");
            columnsAC[2] = new nlobjSearchColumn("cost", null, "GROUP");
            columnsAC[3] = new nlobjSearchColumn("locationpreferredstocklevel", null, "AVG");
            columnsAC[4] = new nlobjSearchColumn("custrecord154", "inventorylocation", "GROUP");
            columnsAC[5] = new nlobjSearchColumn("class", "user", "GROUP");  //
            columnsAC[6] = new nlobjSearchColumn("custitem46", null, "GROUP");
            columnsAC[7] = new nlobjSearchColumn("locationquantityavailable", null, "GROUP");
            columnsAC[8] = new nlobjSearchColumn("custitem50", null, "MAX");
            columnsAC[9] = new nlobjSearchColumn("custrecord302", "CUSTRECORD301", "COUNT")
            var itemSearchAC = nlapiSearchRecord("item", null,
              [
                ["inventorylocation", "anyof", linelocation],
                "AND",
                ["internalidnumber", "equalto", uid]
              ],
              columnsAC
            );

            var locationac = 0;
            var isStocked = 'N';
            window.source = itemSearchAC[0].getValue(columnsAC[6]);
            window.locationAva = itemSearchAC[0].getValue(columnsAC[7]);
            window.lastNegotiationDate = itemSearchAC[0].getValue(columnsAC[8]);
            window.altCount = itemSearchAC[0].getValue(columnsAC[9]);
            if (itemSearchAC) {
              locationac = itemSearchAC[0].getValue(columnsAC[0]);
              window.preferedvendorrate = itemSearchAC[0].getValue(columnsAC[2]);
              window.itemaveragecost = itemSearchAC[0].getValue(columnsAC[1]);
              window.isStocked = itemSearchAC[0].getValue(columnsAC[3]);
              window.LocationClass = itemSearchAC[0].getValue(columnsAC[4]);
              window.userClass = itemSearchAC[0].getValue(columnsAC[5]);

            }

            var itemSource = window.source;
            if (itemSource == 2 && window.itemaveragecost) {
              nlapiSetCurrentLineItemValue('item', 'costestimatetype', 'AVGCOST', false, true);
            }
            else {

              var lineQty = nlapiGetCurrentLineItemValue('item', 'quantity');
              var qtyAva = window.locationAva;

              if (parseInt(qtyAva) >= parseInt(lineQty) && locationac) { nlapiSetCurrentLineItemValue('item', 'costestimatetype', 'AVGCOST'); } else { nlapiSetCurrentLineItemValue('item', 'costestimatetype', 'PURCHPRICE'); }

            }


            //alert(window.preferedvendorrate );
            if (locationac > 0) { window.itemaveragecost = locationac; window.labelac = "LAC:"; }
            /// end location average cost 
          }
        }


        var itemrate = nlapiGetCurrentLineItemValue('item', 'rate');
        var ppMargin = ((1 - (window.preferedvendorrate / itemrate)) * 100).toFixed(2); //-2
        //alert(window.itemaveragecost);
        var avgcostMargin = ((1 - (window.itemaveragecost / itemrate)) * 100).toFixed(2);
        //alert(avgcostMargin);
        var avgmargintext = "";
        var purchasepricemargintext = "";
        var LastNegoshDate = window.lastNegotiationDate;
        var altItemCount = window.altCount;

        if (window.itemaveragecost > 0) {
          var avgmargintext = window.labelac + avgcostMargin + " % \n ";
          // alert(avgmargintext);
        }

        if (itemLookupType != 'assemblyitem') {
          var purchasepricemargintext = "PP: " + ppMargin + "% \n";
        }

        var isstockedlocal = "Non-Stock" + "\n";
        if (parseInt(window.isStocked) > 0) { isstockedlocal = 'Is Stocked' + '.\n'; }

        var NegoshLabel = "";
        var AltLabel = "";

        if (window.lastNegotiationDate) { NegoshLabel = "LND:" }
        if (parseInt(window.window.altCount) > 0) { AltLabel = " \n Alternates:" + parseInt(window.window.altCount) }
        var marginfieldvalue = purchasepricemargintext + avgmargintext + isstockedlocal + NegoshLabel + window.lastNegotiationDate + AltLabel;
        nlapiSetCurrentLineItemValue('item', 'custcol112', window.isStocked, false);
        nlapiSetCurrentLineItemValue('item', 'custcol61', marginfieldvalue, false);

        window.oneanddone = 1;
        window.preferedvendorrate = "";
        window.itemaveragecost = "";
        window.isStocked = "";
        window.LocationClass = "";
        window.userClass = "";
        window.source = "";
        window.locationAva = "";
        //window.lastNegotiationDate = "";
        return true;
      }
      return true;
    }



  }

}