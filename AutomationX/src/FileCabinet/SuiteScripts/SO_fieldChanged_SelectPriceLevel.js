function FchangedSelectpercentoff(type, name) {
  if (nlapiGetFieldValue('customform') != 303) {
    if (name == 'custcol61') {

      var margincalcfield = nlapiGetCurrentLineItemValue('item', 'custcol61');
      if (margincalcfield > 0 && margincalcfield * 1 == margincalcfield && margincalcfield != "") {

        var linepricechange = nlapiGetCurrentLineItemValue('item', 'price');
        nlapiSetCurrentLineItemValue('item', 'custcol61', "", false);
        window.oneanddone = 0;
        var itemType = nlapiGetCurrentLineItemValue('item', 'itemtype');
        var uid = nlapiGetCurrentLineItemValue('item', 'item');
        var itemLookupType = "";

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

        if ((itemLookupType == 'inventoryitem' || itemLookupType == 'assemblyitem') && uid) {

          var itemRecord = nlapiLoadRecord(itemLookupType, uid);
          var preferedvendorrate = itemRecord.getFieldValue('cost');
          var itemaveragecost = itemRecord.getFieldValue('averagecost');

          window.preferedvendorrate = preferedvendorrate;
          window.itemaveragecost = itemaveragecost;


          ////look for location average cost
          window.labelac = "AC:";

          var linelocation = nlapiGetCurrentLineItemValue('item', 'location');
          ///
          if (linelocation) {
            var columnsAC = new Array();
            columnsAC[0] = new nlobjSearchColumn("locationaveragecost", null, null);
            var itemSearchAC = nlapiSearchRecord("item", null,
              [
                ["inventorylocation", "anyof", linelocation],
                "AND",
                ["internalidnumber", "equalto", uid]
              ],
              columnsAC
            );
            var locationac = 0;
            if (itemSearchAC) {
              locationac = itemSearchAC[0].getValue(columnsAC[0]);
            }
            if (locationac > 0) { window.itemaveragecost = locationac; window.labelac = "LAC:"; }
          }
          /// end location average cost 
          var newPG = (margincalcfield) / 100;
          var newSP = (preferedvendorrate / (1 - newPG)).toFixed(2);
          //alert(preferedvendorrate);  alert(newSP);
          var baseprice = itemRecord.getLineItemMatrixValue('price', 'price', 1, 1);
          var pricelevel = itemRecord.getLineItemValue('price', 'pricelevel', 1);

          if (newSP >= baseprice) {
            nlapiSetCurrentLineItemValue('item', 'price', pricelevel);
            return true;
          }

          var pricelevelprice = "";
          var priceleveldiscount = "";
          var pricelevel = "";

          var pricelineCount = parseInt(itemRecord.getLineItemCount('price'));
          for (x = 0; x < pricelineCount; x++) {


            var pricelevelprice = itemRecord.getLineItemMatrixValue('price', 'price', x, 1);
            var priceleveldiscount = itemRecord.getLineItemValue('price', 'discount', x);
            var pricelevel = itemRecord.getLineItemValue('price', 'pricelevel', x);

            if (itemRecord.getLineItemValue('price', 'pricelevel', x) == 157) { pricelevelprice = 99999999999; }

            //  alert(newSP + ">" + pricelevelprice + "  pg " + pricelevel  ) ;
            if (newSP >= pricelevelprice && priceleveldiscount && pricelevelprice) {
              //pricelevel =  itemRecord.getLineItemValue('price','pricelevel',x); 
              //if(newSP !=  pricelevelprice )
              //  {
              var y = x; //-1;   
              pricelevel = itemRecord.getLineItemValue('price', 'pricelevel', y);
              pricelevelprice = itemRecord.getLineItemMatrixValue('price', 'price', y, 1);
              break;
              //     }

            }

          }

          nlapiSetCurrentLineItemValue('item', 'price', pricelevel);

          return true;

        } return true;
      } return true;
    }
    if (name == 'custcol123') {
      var margincalcfield = nlapiGetCurrentLineItemValue('item', 'custcol123');
      var splitMargin= margincalcfield.split('%');
      var finalMargin = splitMargin[0]/100;
      // alert(finalMargin);
      if (finalMargin > 0) {
        var itemcostrate = nlapiGetCurrentLineItemValue('item', 'costestimaterate');
        var calcrate = (itemcostrate / (1 - finalMargin)).toFixed(2);
        nlapiSetCurrentLineItemValue('item', 'price', '-1');  //custom price level
        nlapiSetCurrentLineItemValue('item', 'rate', calcrate); //calc rate from given margin
        return true;
      } 
      return false;
    }

  }

}