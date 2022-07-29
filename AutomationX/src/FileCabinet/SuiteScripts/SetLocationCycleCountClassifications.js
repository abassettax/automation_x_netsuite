  function comparepp( a, b ) {
  if ( a.transactionAndPpVlaue < b.transactionAndPpVlaue ){
    return 1;
  }
  if ( a.transactionAndPpVlaue > b.transactionAndPpVlaue ){
    return -1;
  }
  return 0;
} ///////////// pp * value sort  transactionAndValue  


///////////////////////////////////////sort by total value and transaction 
  function comparetv( a, b ) {
  if ( a.transactionAndValue < b.transactionAndValue ){
    return 1;
  }
  if ( a.transactionAndValue > b.transactionAndValue ){
    return -1;
  }
  return 0;
} /////////////sort by total value and transaction comparetotalscore


///////////////////////////////////////sort by comparetotalscore 
  function comparetotalscore( a, b ) {
  if ( a.TotalRank < b.TotalRank ){
    return -1;
  }
  if ( a.TotalRank > b.TotalRank ){
    return 1;
  }
  return 0;
} /////////////sort by total value and comparetotalscore



var allItemsThisLocation =  new Array();
var itemTransactionCount =new Array();
var itemsInTransactionArray =new Array();
var itemsToUpdate =new Array();
function SetCountClass()
{
 var locationSearch = nlapiSearchRecord('item', 5880); 

  for (var p = 0;   locationSearch != null && p < locationSearch.length; p++ )  /////////////// locations loop
  {
 
    allItemsThisLocation =[];
    itemTransactionCount =[];
    itemsInTransactionArray =[];
    itemsToUpdate =[];
    
var locationColumns = locationSearch[p].getAllColumns(); 
var locationID = locationSearch[p].getValue(locationColumns[0]);  ////////////////location to proccess 
    nlapiLogExecution('debug', 'Start Location', locationID ); 

        var locationFilterPass =  new Array();
    locationFilterPass[0] = new nlobjSearchFilter('inventorylocation',null,'anyof', locationID);   
    locationFilterPass[1] = new nlobjSearchFilter('locationquantityonhand',null,'greaterthan', '0'); 
    locationFilterPass[2] = new nlobjSearchFilter('isinactive',null,'is', 'F'); 
 
var allItemsSearch = nlapiLoadSearch('item', 'customsearch5882'  ); ////////all items in stock
allItemsSearch.setFilters(locationFilterPass);
allItemsSearch.saveSearch('Set Inventory Cycle Count -- All Items', 'customsearch5882' );

var allItemsSearchFiltered = nlapiLoadSearch('item', 5882 );  // run all items again after filter update
var allItemsResultSet = allItemsSearchFiltered.runSearch();
var resultIndex = 0;
var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
var resultSet; // temporary variable used to store the result set
do 
{
     resultSet = allItemsResultSet.getResults(resultIndex, resultIndex + resultStep);   // fetch one result set 
      //    nlapiLogExecution('debug', 'resultSet.length ALL ', resultSet); 
    resultIndex = resultIndex + resultStep; // increase pointer
  
 for (var i = 0;   resultSet != null && i < resultSet.length; i++ )  
  {
var allItemsColumns = resultSet[i].getAllColumns(); 

var itemid = resultSet[i].getValue(allItemsColumns[0]);
var locationId = locationID;
var LocationTotalValue  = resultSet[i].getValue(allItemsColumns[1]);
var currentCountClass =  resultSet[i].getValue(allItemsColumns[2]);
var PurchasePrice  = resultSet[i].getValue(allItemsColumns[3]); if(!PurchasePrice){ PurchasePrice = 1    }
    // nlapiLogExecution('debug', 'PurchasePrice ', PurchasePrice); 
var itemType =   resultSet[i].getValue(allItemsColumns[4]);
var transactionAndValue = 0;
var transactionAndPpVlaue =0;
var TransactionCount  = 1;
var locationValueRank = i + 1;
var ValueTransactionRank = 0;
var PurchasePriceTransactionRank  = 0;
var TotalRank  = 0;
    
  allItemsThisLocation.push({ 
    itemid:itemid, 
    locationId:locationId, 
    itemType:itemType,
    LocationTotalValue:LocationTotalValue, 
    currentCountClass:currentCountClass,
    PurchasePrice:PurchasePrice, 
    transactionAndValue:transactionAndValue,
    transactionAndPpVlaue:transactionAndPpVlaue,
    TransactionCount:TransactionCount,   
    locationValueRank:locationValueRank,
    ValueTransactionRank:ValueTransactionRank,
    PurchasePriceTransactionRank:PurchasePriceTransactionRank,
    TotalRank:TotalRank
                            });  
  }
}while (resultSet.length > 0)
  
//  nlapiLogExecution('debug', 'allItemsThisLocation length', allItemsThisLocation.length);
//     nlapiLogExecution('debug', 'allItemsThisLocation 0', JSON.stringify(allItemsThisLocation[0]) );
 ////////////////////////////////////////////////////
 ////////////////////////////////////////////////////  END ALL ITEMS ARRAY
 ////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////start get transaction count
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var locationTransactionFilterPass =  new Array();
    locationTransactionFilterPass[0] = new nlobjSearchFilter('location','transaction' ,'anyof', locationID);   
    locationTransactionFilterPass[1] = new nlobjSearchFilter('locationquantityonhand',null,'greaterthan', '0'); 
    locationTransactionFilterPass[2] = new nlobjSearchFilter("trandate", 'transaction' ,"onorafter","daysago125"); 
    locationTransactionFilterPass[3] = new nlobjSearchFilter("type" , 'transaction' ,"anyof",["Build","InvAdjst","Unbuild","ItemRcpt","ItemShip","InvTrnfr"]  ); 
    locationTransactionFilterPass[4] = new nlobjSearchFilter("mainline" , 'transaction' ,"is","F"); 
    locationTransactionFilterPass[5] = new nlobjSearchFilter('inventorylocation',null,'anyof', locationID); 

var TransactionItemsSearch = nlapiLoadSearch('item', 'customsearch5878'  ); ////////transaction search
TransactionItemsSearch.setFilters(locationTransactionFilterPass);
TransactionItemsSearch.saveSearch('Set Inventory Cycle Count -- Transaction Count', 'customsearch5878' );

var TransactionItemsSearchFiltered = nlapiLoadSearch('item', 5878 );  // run all items again after filter update
var transactionItemsResultSet =TransactionItemsSearchFiltered.runSearch();
var resultIndex = 0;
var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
var resultSet; // temporary variable used to store the result set
do 
{
  
   resultSet = transactionItemsResultSet.getResults(resultIndex, resultIndex + resultStep);   // fetch one result set 
      //    nlapiLogExecution('debug', 'resultSet.length ALL ', resultSet); 
    resultIndex = resultIndex + resultStep; // increase pointer
   for (var u = 0;   resultSet != null && u < resultSet.length; u++ )  
  {
var TranItemsColumns = resultSet[u].getAllColumns(); 
var itemidtran = resultSet[u].getValue(TranItemsColumns[0]);
var Transactioncount = resultSet[u].getValue(TranItemsColumns[1]);

 itemTransactionCount.push({  itemidtran:itemidtran,   Transactioncount:Transactioncount }); 
 itemsInTransactionArray.push(parseInt(itemidtran));   
  }
}while (resultSet.length > 0)  ////////////end do while loop
  
   //nlapiLogExecution('debug', 'allItemsThisLocation length', itemsInTransactionArray.length);
 //  nlapiLogExecution('debug', 'allItemsThisLocation 0', JSON.stringify(itemsInTransactionArray[0]) );
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////Add transaction count to all items
     for (var y = 0;   allItemsThisLocation != null && y <  allItemsThisLocation.length; y++ )  
  {
     var IndexofThisItemTransactions = "";
    var thisItemAll = allItemsThisLocation[y].itemid;
   IndexofThisItemTransactions = itemsInTransactionArray.indexOf(parseInt(thisItemAll));
  

    if(IndexofThisItemTransactions > -1)
       {
  var TransactionCountThisItem = 1;  if( itemTransactionCount[IndexofThisItemTransactions].Transactioncount> 0){TransactionCountThisItem =   itemTransactionCount[IndexofThisItemTransactions].Transactioncount}
//nlapiLogExecution('debug', 'TransactionCountThisItem', TransactionCountThisItem);
 var PPThisItemValue =   allItemsThisLocation[y].PurchasePrice *  TransactionCountThisItem;  // if(PPThisItemValue = 0){PPThisItemValue =1;}
// nlapiLogExecution('debug', 'PPThisItemValue', PPThisItemValue + '  pp ' + allItemsThisLocation[y].PurchasePrice + 'trancount'  + itemTransactionCount[IndexofThisItemTransactions].Transactioncount); 
 var TVThisitemValue =  allItemsThisLocation[y].LocationTotalValue *  TransactionCountThisItem;
// nlapiLogExecution('debug', 'TVThisitemValue', TVThisitemValue );
  allItemsThisLocation[y].TransactionCount = TransactionCountThisItem; 
  allItemsThisLocation[y].transactionAndPpVlaue = PPThisItemValue;        
  allItemsThisLocation[y].transactionAndValue = TVThisitemValue;         
 

        } else
          {
           if(parseInt(allItemsThisLocation[y].PurchasePrice)>0) {allItemsThisLocation[y].transactionAndPpVlaue =  parseInt(allItemsThisLocation[y].PurchasePrice);}  
           if(parseInt(allItemsThisLocation[y].LocationTotalValue) > 0){ allItemsThisLocation[y].transactionAndValue = parseInt(allItemsThisLocation[y].LocationTotalValue); }
            //if(allItemsThisLocation[y].itemid == '67815' ) {nlapiLogExecution('debug', 'PPThisItemValue', parseInt(allItemsThisLocation[y].LocationTotalValue));}
          }
 //   nlapiLogExecution('debug', 'allItemsThisLocation after ', JSON.stringify(allItemsThisLocation[y]) );
   // if(allItemsThisLocation[y].itemid == '67815' ) {nlapiLogExecution('debug', 'allItemsThisLocation[y].transactionAndPpVlaue', allItemsThisLocation[y].transactionAndPpVlaue);}
  }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////sort array for pp rank

allItemsThisLocation.sort( comparepp );
   for (var y = 0;   allItemsThisLocation != null && y <  allItemsThisLocation.length; y++ ) 
  {
allItemsThisLocation[y].PurchasePriceTransactionRank = y + 1 ;
//  nlapiLogExecution('debug', 'allItemsThisLocation after sort comparepp', JSON.stringify(allItemsThisLocation[y]) );  
  }
     
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////end sort by pp rank   
  
/////////////////////////////////////v//////////////////////////////////////////////////////////////////////////sort array for total value and transaction rank

allItemsThisLocation.sort( comparetv );
   for (var y = 0;   allItemsThisLocation != null && y <  allItemsThisLocation.length; y++ ) 
  {
allItemsThisLocation[y].ValueTransactionRank = y + 1 ;
//   nlapiLogExecution('debug', 'allItemsThisLocation after sort comparetv', JSON.stringify(allItemsThisLocation[y]) );  
  }
//////////////////////////////////////////////////////////////////////////////////////////////////end sort by  total value and transaction rank   
//   
    
////////////////////////////////////////////////////////////////Get Total Score
    for (var y = 0;   allItemsThisLocation != null && y <  allItemsThisLocation.length; y++ ) 
  {
var totalScore = allItemsThisLocation[y].locationValueRank +   allItemsThisLocation[y].ValueTransactionRank  + allItemsThisLocation[y].PurchasePriceTransactionRank;
        
allItemsThisLocation[y].TotalRank = totalScore  ;
//if(allItemsThisLocation[y].itemid == '67817' ) { nlapiLogExecution('debug', 'Total Score', 'item: ' + allItemsThisLocation[y].itemid + " Total Value: "  + allItemsThisLocation[y].locationValueRank +  " value with transaction: " + allItemsThisLocation[y].ValueTransactionRank  + " PP Rank: " + allItemsThisLocation[y].PurchasePriceTransactionRank  + ' ts: ' + totalScore); }

//  nlapiLogExecution('debug', 'Total Score', ' ts: ' +allItemsThisLocation[y].TotalRank +'item: ' + allItemsThisLocation[y].itemid   );  
  }
//////////////////////////////////////////////////////////////////End Total Score
    
allItemsThisLocation.sort( comparetotalscore );
 //nlapiLogExecution('debug', 'allItemsThisLocation after sort', JSON.stringify(allItemsThisLocation[y]) );
  itemsToUpdate =[];

var itemCountTarget = parseInt(allItemsThisLocation.length) * .25;  
                                        if(itemCountTarget < 100 ){ itemCountTarget = 100;}
var AitemTarget = parseInt(allItemsThisLocation.length)  * .09;
                                        if( AitemTarget < 50){ AitemTarget = 50;   }
var BitemTarget = parseInt(allItemsThisLocation.length)  * .1; 
                                        if( BitemTarget < 50){ BitemTarget = AitemTarget/2;   }
    

    
//nlapiLogExecution('debug', 'ItemstoUpdate Start', itemsToUpdate.length );
//nlapiLogExecution('debug', 'itemCountTarget', itemCountTarget );
//nlapiLogExecution('debug', 'AitemTarget', AitemTarget );
//nlapiLogExecution('debug', 'BitemTarget', BitemTarget );
 
    for (var v = 0;   allItemsThisLocation != null && v <  parseInt(AitemTarget); v++ ) /// find A items to update
  {
   //  nlapiLogExecution('debug', 'In A', 'In A');
   //  nlapiLogExecution('debug', 'A items', 'itemid' + allItemsThisLocation[v].itemid + ' currentClass ' + allItemsThisLocation[v].currentCountClass);
if( allItemsThisLocation[v].currentCountClass !='A'  ){
  
var itemids =  allItemsThisLocation[v].itemid;
var locationIDs =  allItemsThisLocation[v].locationId;
var  NewClasss = '1';
var currentClass =  allItemsThisLocation[v].currentCountClass;
var itemType  = allItemsThisLocation[v].itemType;
 
itemsToUpdate.push({ 
    itemid:itemids, 
    itemType:itemType,
    locationID:locationIDs,
    NewClass:1,
    currentClass:currentClass});
     }
  }  

    // nlapiLogExecution('debug', 'itemsToUpdateA', itemsToUpdate.length );
   //  nlapiLogExecution('debug', 'B start', parseInt(AitemTarget) );
   //  nlapiLogExecution('debug', 'B Finish', parseInt(AitemTarget + BitemTarget) );

   for (var h = parseInt(AitemTarget );   allItemsThisLocation != null && h <  (parseInt(AitemTarget + BitemTarget)); h++ ) /// find B items to update
  {
if( allItemsThisLocation[h].currentCountClass != 'B' ){
  
var itemids =  allItemsThisLocation[h].itemid;
var locationIDs =  allItemsThisLocation[h].locationId;
var  NewClasss = 'B';
var currentClass =  allItemsThisLocation[h].currentCountClass;
var itemType  = allItemsThisLocation[h].itemType;
itemsToUpdate.push({ 
    itemid:itemids, 
    itemType:itemType,
    locationID:locationIDs,
    NewClass:2,
    currentClass:currentClass});
     }
    }
    
    ///////////////////END A AND B UPDATE PUSH
    //

    
      //////////////Find C to update
    
   for (var h = parseInt( AitemTarget + BitemTarget );   allItemsThisLocation != null && h < allItemsThisLocation.length; h++ ) /// find B items to update
  {
    
if( allItemsThisLocation[h].currentCountClass != 'C' ){
  
var itemids =  allItemsThisLocation[h].itemid;
var locationIDs =  allItemsThisLocation[h].locationId;
var  NewClasss = 'C';
var currentClass =  allItemsThisLocation[h].currentCountClass;
var itemType  = allItemsThisLocation[h].itemType;
itemsToUpdate.push({ 
    itemid:itemids, 
    itemType:itemType,
    locationID:locationIDs,
    NewClass:3,
    currentClass:currentClass});
     }
      
    }
    
   
    ////End Find updates
 

     nlapiLogExecution('debug', 'itemsToUpdateAll', itemsToUpdate.length );
     for (var y = 0;   itemsToUpdate != null && y <  itemsToUpdate.length; y++ )  
  {
        nlapiLogExecution('debug', 'Item Being Updated', JSON.stringify(itemsToUpdate[y]) );
var itype= itemsToUpdate[y].itemType;    // nlapiLogExecution('debug', 'itype', itype + '   item:' +itemsToUpdate[y].itemid);
        var recordtype = 'assemblyitem';
        switch (itype) {   // Compare item type to its record type counterpart
            case 'InvtPart':
                recordtype = 'inventoryitem';
                break;
            case 'NonInvtPart':
                recordtype = 'noninventoryitem';
                break;
            case 'Assembly/Bill of Materials':
                recordtype = 'assemblyitem';
                break;
            case 'Assembly item':
                recordtype = 'assemblyitem';
                break;
                
            case 'assemblyitem':
                recordtype = 'assemblyitem';
                break;
            default:
                     }
 //nlapiLogExecution('debug', 'recordtype', recordtype );
  
   var item = nlapiLoadRecord(recordtype, itemsToUpdate[y].itemid);

   var ThisItemLocation =  itemsToUpdate[y].locationID;  
   var ThisItemLocationLine = item.findLineItemValue('locations', 'location', ThisItemLocation );    
   var newClass = itemsToUpdate[y].NewClass;
  //   nlapiLogExecution('debug', 'item id', 'Itemid: ' + itemsToUpdate[y].itemid + ' location: ' + ThisItemLocation  + ' NewClass: ' + newClass  );
   //  
   //  nlapiLogExecution('debug', 'ThisItemLocationLine',ThisItemLocationLine );
   //  nlapiLogExecution('debug', 'ThisItemLocation',ThisItemLocation );
    
 
item.setLineItemValue('locations', 'invtclassification', ThisItemLocationLine, newClass);
nlapiSubmitRecord(item, false, true);
 
  }
nlapiLogExecution('debug', 'Finished Location', locationID );  
  

   } /// end this location loop Move to next location
      allItemsThisLocation =[];
    itemTransactionCount =[];
    itemsInTransactionArray =[];
    itemsToUpdate =[];
  nlapiLogExecution('debug', 'Done', 'Done' );  
return true;
}