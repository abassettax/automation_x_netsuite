var ItemsLocalMOH = new Array();
var ItemsToUpdate = new Array();
var itemsToCHeck = new Array();
var itemsSetT = new Array();
var itemsSetF = new Array();

////////////////////////////////////////////////////////////////////////////////////////
function SetExcessInventory() {
  //TODO: need to verify filters across all 3 searches. there are a few inconsistencies, need to make sure all of the data we want overlaps in the same ranges

  ////////////////////////////// all items
  var allItemSearch = nlapiLoadSearch('item', 5617);    //loads search id 5617 https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=5617
  var allItemsResultSet = allItemSearch.runSearch();
  var resultIndex = 0;
  var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
  var resultSet; // temporary variable used to store the result set
  do {
    resultSet = allItemsResultSet.getResults(resultIndex, resultIndex + resultStep);   // fetch one result set 
    // nlapiLogExecution('debug', 'resultSet.length ALL ', resultSet.length); 
    resultIndex = resultIndex + resultStep; // increase pointer

    // process or log the results
    //  nlapiLogExecution('debug', 'resultSet.length', resultSet.length);
    for (var i = 0; resultSet != null && i < resultSet.length; i++) {
      var columns = resultSet[i].getAllColumns();
      var itemid = resultSet[i].getValue(columns[0]);
      var isExcess = resultSet[i].getValue(columns[2]);
      var itemMOH = resultSet[i].getValue(columns[6]);
      var itemAva = resultSet[i].getValue(columns[8]);
      var itemType = resultSet[i].getValue(columns[10]);
      var ItemPurchasePrice = resultSet[i].getValue(columns[5]);
      if (!ItemPurchasePrice) {
        ItemPurchasePrice = resultSet[i].getValue(columns[4]) / resultSet[i].getValue(columns[7])  //total value / qty on hand
      }
      var ItemTotalValue = resultSet[i].getValue(columns[4]);
      if (!ItemTotalValue) {
        ItemTotalValue = ItemPurchasePrice * resultSet[i].getValue(columns[7]) //price * qty on hand
      }
      //nlapiLogExecution('debug', 'itemsToCHeck', itemsToCHeck.length);

      // if(itemid == 72596){    nlapiLogExecution('debug', 'itemid', itemid + " " + locExcessCount );}
      //if(parseInt(itemMOH) > 5 && (ItemPurchasePrice >10 || ItemTotalValue > 500 ) && isExcess =="F"  ){ ItemsToUpdate.push({ itemid:itemid, locExcessCount:1, itemMOH:itemMOH, isExcess:isExcess,itemTotalValue:ItemTotalValue, itemPurchasePrice:ItemPurchasePrice,   itemType:itemType});  }
      itemsToCHeck.push({
        itemid: itemid,
        itemMOH: itemMOH,
        itemAva: itemAva,
        isExcess: isExcess,
        itemTotalValue: ItemTotalValue,
        itemPurchasePrice: ItemPurchasePrice,
        itemType: itemType
      });
    }
  } while (resultSet.length > 0)// once no records are returned we already got all of them

  ////////////////////////////local moh
  var localMOHearch = nlapiLoadSearch('transaction', 5615);   //loads search id 5615 https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=5615

  var localMOHResultSet = localMOHearch.runSearch();// resultIndex points to record starting current resultSet in the entire results array 

  var resultIndex = 0;
  var startresultindex = 0;
  var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
  var resultSet; // temporary variable used to store the result set

  do {
    resultSet = localMOHResultSet.getResults(resultIndex, resultIndex + resultStep);   // fetch one result set 
    // nlapiLogExecution('debug', 'resultSet.length ALL ', resultSet.length); 
    resultIndex = resultIndex + resultStep; // increase pointer

    // process or log the results
    //  nlapiLogExecution('debug', 'resultSet.length', resultSet.length);
    for (var i = 0; resultSet != null && i < resultSet.length; i++) {
      var columns = resultSet[i].getAllColumns();
      var itemid = resultSet[i].getValue(columns[0]);
      var LocAVA = resultSet[i].getValue(columns[1]);
      var locDemand = resultSet[i].getValue(columns[2]);  //3 month run rate

      var LocMOH = 0; 
      if (locDemand > 0) { 
        LocMOH = (parseInt(LocAVA) / parseInt(locDemand)).toFixed(2); 
      } else { 
        LocMOH = 99; 
      }

      ItemsLocalMOH.push({ 
        itemid: itemid, 
        LocAVA: LocAVA, 
        locDemand: locDemand, 
        LocMOH: LocMOH
      });

      // if (itemid == 72596) { nlapiLogExecution('debug', 'ItemsLocalMOHIDs', itemid + ' ' + locExcessCount); }
    }

  } while (resultSet.length > 0)// once no records are returned we already got all of them

  /////////////////////////////////////////////////////////////////////////////////////make list of items to update
  for (q = 0; q < itemsToCHeck.length && itemsToCHeck; q++) {
    var itemid = itemsToCHeck[q].itemid;
    var itemAva = itemsToCHeck[q].itemAva;
    //TODO: find index in ItemsLocalMOH arr
    //get locDemand, compare to itemAva. if itemAva / locDemand > 4, flag for excess. otherwise, flag for not excess
    var itemsLocalMOHIndex = findWithAttr(ItemsLocalMOH, 'itemid', itemid);
    if (itemsLocalMOHIndex != -1) {
      var avgMonthlyDemand = ItemsLocalMOH[itemsLocalMOHIndex].locDemand;
      var calcMOH = Math.ceil(itemAva / avgMonthlyDemand);
    } else {
      var avgMonthlyDemand = 0;
      if (itemAva > 0) {
        var calcMOH = 99;
      } else {
        var calcMOH = 0;
      }
    }
    var IsExcessCheck = itemsToCHeck[q].isExcess;
    // if (itemid == 72596) { nlapiLogExecution('debug', 'before', finalcount + "--" + IsExcessCheck + "--" + itemid); }
    if ((calcMOH > 3 && IsExcessCheck == "F") || (calcMOH <= 3 && IsExcessCheck == "T")) {
      // nlapiLogExecution('debug', 'gettingpushedtoupdate', finalcount + "--" + IsExcessCheck   +"--" + itemid );
      if (calcMOH > 3 && IsExcessCheck == "F") {
        var newExcessVal = 'T';
      } else {
        var newExcessVal = 'F';
      }
      var itemtypes = itemsToCHeck[q].itemType;
      // if (itemid == 72596) { nlapiLogExecution('debug', 'during', finalcount + "--" + IsExcessCheck + "--" + itemid); }
      ItemsToUpdate.push({ 
        itemid: itemid, 
        isExcess: newExcessVal, 
        itemType: itemtypes 
      });
    }
  }
  nlapiLogExecution('debug', 'ItemsToUpdate', ItemsToUpdate.length);
  ///////////////////////////////////////////////////////////////////////Final Item Updates
  for (q = 0; q < ItemsToUpdate.length && ItemsToUpdate; q++) {
    var itype = ItemsToUpdate[q].itemType;
    var itemid = ItemsToUpdate[q].itemid;
    var newExcessVal = ItemsToUpdate[q].isExcess;
    if (newExcessVal == "T") { 
      itemsSetT.push({ itemid: itemid }); 
    }
    if (newExcessVal == "F") { 
      itemsSetF.push({ itemid: itemid }); 
    }

    var recordtype = '';
    switch (itype) {   // Compare item type to its record type counterpart
      case 'InvtPart':
        recordtype = 'inventoryitem';
        break;
      case 'NonInvtPart':
        recordtype = 'noninventoryitem';
        break;
      case 'Service':
        recordtype = 'serviceitem';
        break;
      case 'Assembly':
        recordtype = 'assemblyitem';
        break;
      case 'GiftCert':
        recordtype = 'giftcertificateitem';
        break;
      default:
    }
    nlapiSubmitField(recordtype, itemid, 'custitem69', newExcessVal, false);
  }

  nlapiLogExecution('debug', 'itemsSetF', itemsSetF.length);
  nlapiLogExecution('debug', 'itemsSetT', itemsSetT.length);
  nlapiLogExecution('debug', 'remainingUsage', nlapiGetContext().getRemainingUsage());

}

function findWithAttr(array, attr, value) {
  for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
          return i;
      }
  }
  return -1;
}