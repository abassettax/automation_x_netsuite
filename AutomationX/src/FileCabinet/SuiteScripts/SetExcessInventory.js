var allItemsAVA =  new Array();
var ItemsJustAdded =  new Array();
var ItemsLocalMOH =  new Array();
var ItemsLocalMOHIDs =  new Array();
var ItemsToUpdate =  new Array();
var itemsToCHeck = new Array();
var itemsSetT = new Array();
var itemsSetF = new Array();

////////////////////////////////////////////////////////////////////////////////////////
function SetExcessInventory()
{
 ////////////////////////////// all items
var allItemSearch = nlapiLoadSearch('item', 5617); 
var allItemsResultSet = allItemSearch.runSearch();
var resultIndex = 0;
var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
var resultSet; // temporary variable used to store the result set
do 
{
    resultSet = allItemsResultSet.getResults(resultIndex, resultIndex + resultStep);   // fetch one result set 
 // nlapiLogExecution('debug', 'resultSet.length ALL ', resultSet.length); 
    resultIndex = resultIndex + resultStep; // increase pointer

    // process or log the results
  //  nlapiLogExecution('debug', 'resultSet.length', resultSet.length);
  for (var i = 0;   resultSet != null && i < resultSet.length; i++ )  
  {
var columns = resultSet[i].getAllColumns(); 
var itemid = resultSet[i].getValue(columns[0]);
var isExcess = resultSet[i].getValue(columns[1]);
var itemMOH = resultSet[i].getValue(columns[2]); 
var itemType =resultSet[i].getValue(columns[6]);
var ItemPurchasePrice = resultSet[i].getValue(columns[4]); if(!ItemPurchasePrice){ ItemPurchasePrice = resultSet[i].getValue(columns[3]) /  resultSet[i].getValue(columns[5])}
var ItemTotalValue = resultSet[i].getValue(columns[3]); if(!ItemTotalValue){ItemTotalValue = ItemPurchasePrice* ItemPurchasePrice}
var locExcessCount = 0;if(!itemMOH || itemMOH > 4 ){locExcessCount =1; }  
//nlapiLogExecution('debug', 'itemsToCHeck', itemsToCHeck.length);
    
    if(itemid == 72596){    nlapiLogExecution('debug', 'itemid', itemid + " " + locExcessCount );}
//if(parseInt(itemMOH) > 5 && (ItemPurchasePrice >10 || ItemTotalValue > 500 ) && isExcess =="F"  ){ ItemsToUpdate.push({ itemid:itemid, locExcessCount:1, itemMOH:itemMOH, isExcess:isExcess,itemTotalValue:ItemTotalValue, itemPurchasePrice:ItemPurchasePrice,   itemType:itemType});  }
  if(ItemPurchasePrice>5 || ItemTotalValue >100  ){ itemsToCHeck.push({ itemid:itemid, locExcessCount:locExcessCount, itemMOH:itemMOH, isExcess:isExcess,itemTotalValue:ItemTotalValue, itemPurchasePrice:ItemPurchasePrice,  itemType:itemType}); }
  
allItemsAVA.push({ itemid:itemid, locExcessCount:locExcessCount, itemMOH:itemMOH, isExcess:isExcess,itemTotalValue:ItemTotalValue, itemPurchasePrice:ItemPurchasePrice});
 }
   
} while (resultSet.length > 0)// once no records are returned we already got all of them



 ////////////////////////////local moh
var localMOHearch = nlapiLoadSearch('transaction', 5615); 
   
var localMOHResultSet = localMOHearch.runSearch();// resultIndex points to record starting current resultSet in the entire results array 
 
var resultIndex = 0;
var startresultindex =0;
var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
var resultSet; // temporary variable used to store the result set
 
do 
{
    resultSet = localMOHResultSet.getResults(resultIndex, resultIndex + resultStep);   // fetch one result set 
 // nlapiLogExecution('debug', 'resultSet.length ALL ', resultSet.length); 
    resultIndex = resultIndex + resultStep; // increase pointer

    // process or log the results
  //  nlapiLogExecution('debug', 'resultSet.length', resultSet.length);
  for (var i = 0;   resultSet != null && i < resultSet.length; i++ )  
  {
var columns = resultSet[i].getAllColumns(); 
var itemid = resultSet[i].getValue(columns[0]);
var LocAVA = resultSet[i].getValue(columns[2]);
var locDemand = resultSet[i].getValue(columns[3]);
var isExcess = resultSet[i].getValue(columns[4]);
 
var LocMOH = 0;  if(locDemand >0){LocMOH = (parseInt(LocAVA)/parseInt(locDemand)).toFixed(2); }else{ LocMOH = 99;}
var locExcessCount = 0;  if(parseInt(LocMOH) >4){ locExcessCount = 1;}
    
    var itemInArray = ItemsLocalMOHIDs.indexOf(itemid);
    if((LocMOH > 4 &&  itemInArray == -1)  )  
    {ItemsLocalMOH.push({ itemid:itemid, LocAVA:LocAVA, locDemand:locDemand,LocMOH:LocMOH, locExcessCount:locExcessCount});}
     ItemsLocalMOHIDs.push(itemid);
    if(itemid == 72596) {nlapiLogExecution('debug', 'ItemsLocalMOHIDs',  itemid + ' ' +locExcessCount );}
  }
  
} while (resultSet.length > 0)// once no records are returned we already got all of them
  
 
 
/////////////////////////////////////////////////////////////////////new items
 
var newItemsearch = nlapiLoadSearch('transaction', 5616); // all items
var newItemsResultSet = newItemsearch.runSearch();
 
// resultIndex points to record starting current resultSet in the entire results array 
var resultIndex = 0;
var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
var resultSet; // temporary variable used to store the result set
do 
{
    resultSet = newItemsResultSet.getResults(resultIndex, resultIndex + resultStep);   // fetch one result set
    resultIndex = resultIndex + resultStep; // increase pointer

  for (var i = 0;   resultSet != null && i < resultSet.length; i++ )  
  {
var columns = resultSet[i].getAllColumns(); 
var itemid = resultSet[i].getValue(columns[0]);
var FirstTran =  resultSet[i].getValue(columns[1]);

if(FirstTran ){   if(itemid == 72596) {nlapiLogExecution('debug', 'first tran',  itemid + ' ' + FirstTran );} ItemsJustAdded.push({ itemid:parseInt(itemid), FirstTran:FirstTran, locExcessCount:-1});}  
    }
 
// once no records are returned we already got all of them
} while (resultSet.length > 0)
  //////////////////////////////////////////end create arrays
  //
  
  /////////////////////////////////////////Update items to update local MOH


var pickuploop = 0;
  
  for (var i = 0;   ItemsLocalMOH != null && i < ItemsLocalMOH.length; i++ )  
  {
var itemidLocalMOH =  ItemsLocalMOH[i].itemid;
var locExcessCountLocalMOH = ItemsLocalMOH[i].locExcessCount;

       for(q =0; q<itemsToCHeck.length && itemsToCHeck; q++)  
    	{
         //     nlapiLogExecution('debug', 'q start', q);
        var itemidAll =  itemsToCHeck[q].itemid;
         
         //  nlapiLogExecution('debug', 'itemsToCHeck[q].locExcessCountBefore', itemidAll + "---"  +itemsToCHeck[q].locExcessCount + "-----" + newcount);
     if(itemidAll == itemidLocalMOH  )
     { 
        var newcount = ( itemsToCHeck[q].locExcessCount + locExcessCountLocalMOH  );
       itemsToCHeck[q].locExcessCount=newcount; 
                 if(q!=0){   pickuploop =q-1;}else{  pickuploop =q;}    break;
     }  
  
          
        }

  }
///////////////////////////////////////////////////////////////////////////////////////////new item adjustment

  var pickuploop = 0;
  
  for (var i = 0;   ItemsJustAdded != null && i < ItemsJustAdded.length; i++ )  
  {
var itemidLocalMOH =  ItemsJustAdded[i].itemid;
var locExcessCountLocalMOH = ItemsJustAdded[i].locExcessCount;

       for(q =0; q<itemsToCHeck.length && itemsToCHeck; q++)  //pickuploop
    	{
         //     nlapiLogExecution('debug', 'q start', q);
        var itemidAll =  itemsToCHeck[q].itemid;
          var newcount = ( itemsToCHeck[q].locExcessCount + locExcessCountLocalMOH  );
        //   nlapiLogExecution('debug', 'itemsToCHeck[q].locExcessCountBefore', itemidAll + "---"  +itemsToCHeck[q].locExcessCount + "-----" + newcount);
  
          if(itemidAll == itemidLocalMOH  )
     { itemsToCHeck[q].locExcessCount=newcount; 
           if(q!=0){   pickuploop =q-1;}else{  pickuploop =q;}      break;
     }  
  
          
        }

  }
  
  /////////////////////////////////////////////////////////////////////////////////////make list of items to update
       for(q =0; q<itemsToCHeck.length && itemsToCHeck; q++)  
    	{
var itemid = itemsToCHeck[q].itemid;
var finalcount = itemsToCHeck[q].locExcessCount;
var IsExcessCheck = itemsToCHeck[q].isExcess;
    if(itemid == 72596){  nlapiLogExecution('debug', 'before', finalcount + "--" + IsExcessCheck   +"--" + itemid );}
if((parseInt(finalcount) > 0 && IsExcessCheck == "F" )|| (parseInt(finalcount) <= 0 && IsExcessCheck == "T") )
{
  
// nlapiLogExecution('debug', 'gettingpushedtoupdate', finalcount + "--" + IsExcessCheck   +"--" + itemid );
  
var isExcess = itemsToCHeck[q].isExcess;
var itemMOH = itemsToCHeck[q].itemMOH;
var ItemPurchasePrice = itemsToCHeck[q].ItemPurchasePrice;
var ItemTotalValue =itemsToCHeck[q].ItemTotalValue;
var itemtypes = itemsToCHeck[q].itemType;
var locExcessCount = locExcessCount;
    
   if(itemid == 72596){  nlapiLogExecution('debug', 'during', finalcount + "--" + IsExcessCheck   +"--" + itemid );}
ItemsToUpdate.push({ itemid:itemid, locExcessCount:finalcount, itemMOH:itemMOH, isExcess:isExcess, itemTotalValue:ItemTotalValue, itemPurchasePrice:ItemPurchasePrice, itemType:itemtypes});  

}
        }

///////////////////////////////////////////////////////////////////////Final Item Updates
    for(q =0; q<ItemsToUpdate.length && ItemsToUpdate; q++)  
    	{
var itype = ItemsToUpdate[q].itemType;
var itemid = ItemsToUpdate[q].itemid;
var isExcessNumber = ItemsToUpdate[q].locExcessCount;
var isExcessText =ItemsToUpdate[q].isExcess;
var isExcessFinal = "F";  if(parseInt(isExcessNumber) > 0){ isExcessFinal="T";}
   if(itemid == 72596){  nlapiLogExecution('debug', 'after', isExcessFinal + "--" + isExcessNumber   +"--" + itemid );}
           if(itemid == 72596){  nlapiLogExecution('debug', 'isExcessText-isExcessFinal before',  isExcessText + "--" + isExcessFinal   +"--" + itemid );}
if( isExcessText != isExcessFinal )
    {
  if(itemid == 72596){  nlapiLogExecution('debug', 'isExcessText-isExcessFinal',  isExcessText + "--" + isExcessFinal   +"--" + itemid );}
if(isExcessFinal== "T"){itemsSetT.push({itemid:itemid  }); }
if(isExcessFinal== "F"){itemsSetF.push({itemid:itemid  }); }

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

//nlapiLogExecution('debug', 'itemid', itemid + "-,-" + isExcessFinal + '-,-' + recordtype );
//      nlapiLogExecution('debug', 'isExcessNumber', isExcessNumber);
         nlapiSubmitField(recordtype, itemid, 'custitem69', isExcessFinal, false);
    }
        }
  
nlapiLogExecution('audit', 'itemsSetF',itemsSetF.length);
 nlapiLogExecution('audit', 'itemsSetT', itemsSetT.length);
 
//nlapiLogExecution('debug', 'allItemsAVA',allItemsAVA.length);
// nlapiLogExecution('debug', 'allItemsAVA',JSON.stringify(allItemsAVA));
  
   nlapiLogExecution('debug', 'ItemsToUpdate',ItemsToUpdate.length);
 //nlapiLogExecution('debug', 'ItemsToUpdate',JSON.stringify(ItemsToUpdate));

  
  // nlapiLogExecution('debug', 'itemsToCHeck',itemsToCHeck.length);
 //nlapiLogExecution('debug', 'itemsToCHeck',JSON.stringify(itemsToCHeck));
 
 //  nlapiLogExecution('debug', 'ItemsLocalMOH',ItemsLocalMOH.length);
 //nlapiLogExecution('debug', 'ItemsLocalMOH',JSON.stringify(ItemsLocalMOH));

 //   nlapiLogExecution('debug', 'ItemsJustAdded',ItemsJustAdded.length);
//    nlapiLogExecution('debug', 'ItemsJustAdded',JSON.stringify(ItemsJustAdded));



nlapiLogExecution('debug', 'remainingUsage',nlapiGetContext().getRemainingUsage() );

}