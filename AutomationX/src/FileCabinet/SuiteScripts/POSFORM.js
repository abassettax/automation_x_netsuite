function beforeSubmitSO()
{

  
}

function POSform(type, form)
{

  /*
   var lineidarray = new Array(); 
  var lineidarrayDP = new Array();
  var lineinfos = new Array();
  var locationVendorPOheader = new Array();
    var locationVendorPOheaderWC = new Array();
  var lineinfosDP = new Array();
  var lineifosWC = new Array();
  var locationVendorPOheaderDP = new Array();
  var Stocklines  = new Array();
  var POLines  = new Array();
  var DropPOlines  = new Array();
  var WillcallPOlines = new Array();
  
  var checkVenLoctionItemStatusArray = new Array();
  var checkVenLoctionItemStatusArrayDP = new Array();
  
        var soupdate = new Array();
        var customers = nlapiGetFieldValue("entity");
        var headerclass = nlapiGetFieldValue("class");
        var sonum = nlapiGetRecordId();
  
    	var lineCount = parseInt( nlapiGetLineItemCount('item'));
	for(x =1; x<=lineCount; x++)
      {
        var linecreateType = nlapiGetLineItemValue("item", "custcol90", x);
        var linealreadyprocessed = nlapiGetLineItemValue("item", "custcol91", x) ;
        var POalreadycreated = nlapiGetLineItemValue("item", "custcol74", x) ;
        if( linecreateType == 1 && !linealreadyprocessed ){  Stocklines.push(x);  }  if( linecreateType == 2 && !linealreadyprocessed && !POalreadycreated){ POLines.push(x);    }  if( linecreateType == 3 && !linealreadyprocessed && !POalreadycreated){  DropPOlines.push(x);   } 
        if( linecreateType == 4 && !linealreadyprocessed && !POalreadycreated){  WillcallPOlines.push(x);   }
      }
   nlapiLogExecution('AUDIT', 'Stocklines',  Stocklines);
   nlapiLogExecution('AUDIT', 'POLines',  POLines);
   nlapiLogExecution('AUDIT', 'DropPOlines',  DropPOlines);
   nlapiLogExecution('AUDIT', 'WillcallPOlines',  WillcallPOlines);
  ///////////////////////////////////////////////////////////////////////start stock request
       for( l =0; l<Stocklines.length && Stocklines; l++  )  
      {
        var x = Stocklines[l];
  nlapiLogExecution('AUDIT', 'createStockRequest',  x);
        
//if(nlapiGetLineItemValue("item", "custcol91", x)){alert("This Item has an existing request." + '  ' + nlapiGetLineItemValue("item", "custcol91", x)); break;}
   if( nlapiGetLineItemValue("item", "custcol90", x) == 1 &&  !nlapiGetLineItemValue("item", "custcol91", x) )
      {
        var PONOTES =  nlapiGetFieldValue("custbody34");
       var rec = nlapiCreateRecord('customrecord463'); 
       var location = nlapiGetLineItemValue("item", "location", x);
     var SRpoVendor = nlapiGetLineItemValue("item", "povendor", x); 
 nlapiLogExecution('AUDIT', 'SRpoVendor',  SRpoVendor);
     rec.setFieldValue('custrecord192',location );
     rec.setFieldValue('custrecord203',headerclass );
     rec.setFieldValue( 'custrecord202',customers );
     rec.setFieldValue( 'custrecord224', x);
     rec.setFieldValue( 'custrecord221',sonum);
      rec.setFieldValue( 'custrecord196',PONOTES); //
       rec.setFieldValue( 'custrecord197',SRpoVendor);
        
      var soqtysr = nlapiGetLineItemValue('item', 'quantity', x);
      var coavasr =     nlapiGetLineItemValue('item', 'quantityavailable', x);//quantityavailable
      var lineQTYsr = soqtysr;
     rec.setFieldValue( 'custrecord189',lineQTYsr);  
         rec.setFieldValue( 'custrecord223',nlapiGetLineItemValue("item", "quantity", x));  
        
 var itemid = nlapiGetLineItemValue("item", "item", x);
        var SRpoVendor = nlapiGetLineItemValue("item", "povendor", x); 
          rec.setFieldValue( 'custrecord187', itemid);
       //  nlapiLogExecution('AUDIT', 'itemid',  itemid);
//  var loc = location;
     
       
    ////////////////////////////demand search////////////  
      var columns = new Array();
      columns[0] =new nlobjSearchColumn("locationpreferredstocklevel",null,"MAX");
      columns[1] =new nlobjSearchColumn("locationquantityonhand",null,"MAX");
      columns[2] = new nlobjSearchColumn("locationquantitycommitted",null,"MAX");
      columns[3] =new nlobjSearchColumn("locationquantityavailable",null,"MAX");
      columns[4] = new nlobjSearchColumn("locationquantitybackordered",null,"MAX");
      columns[5] = new nlobjSearchColumn("locationquantityonorder",null,"MAX");
      columns[6] = new nlobjSearchColumn("locationquantityintransit",null,"MAX");
      columns[7] = new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("  CASE WHEN ({transaction.location}= {inventorylocation} ) THEN  {transaction.quantity}/3 ELSE NULL END");
      columns[8] = new nlobjSearchColumn("custitem_tjinc_averagedemand",null,"AVG");
      columns[9] =new nlobjSearchColumn("custitem_tjinc_monthsonhand",null,"AVG");
      columns[10] =new nlobjSearchColumn("quantityavailable",null,"AVG");
      columns[11] =new nlobjSearchColumn("locationleadtime",null,"MAX");
      columns[12] =new nlobjSearchColumn("leadtime",null,"MAX");
      columns[13] = new nlobjSearchColumn("custitem35",null,"GROUP");
      columns[14] = new nlobjSearchColumn("vendor",null,"GROUP");
      columns[15] = new nlobjSearchColumn("cost",null,"MAX");
    
      var transactionSearch = nlapiSearchRecord("item",null,
[
   [["locationquantityonhand","greaterthan","0"],"OR",["locationpreferredstocklevel","greaterthan","0"],"OR",["locationquantityonorder","greaterthan","0"],"OR",["inventorylocation.custrecord17","is","T"]], 
   "AND", 
   [["transaction.type","anyof","SalesOrd"],"AND",["transaction.mainline","is","F"],"AND",["transaction.trandate","onorafter","daysago90"]], 
   "AND", 
   ["inventorylocation","anyof",location], 
   "AND", 
   ["internalidnumber","equalto",itemid]
],columns
);
  if(transactionSearch)
      {
var Lava = 0;
var fivecode =  '';
var locleadtime =  0;
var leadtime =  0;
var moh =  0;
var avaDemand =  0;
var  LocavaDemand =  0;
var prefvendor =  '';
 
var Lava = transactionSearch[0].getValue(columns[3]);
var fivecode = transactionSearch[0].getValue(columns[13]);
var locleadtime = transactionSearch[0].getValue(columns[11]);
var leadtime = transactionSearch[0].getValue(columns[12]);
var moh = transactionSearch[0].getValue(columns[9]);
var avaDemand = transactionSearch[0].getValue(columns[8]);
var  LocavaDemand = Math.round(transactionSearch[0].getValue(columns[7]));   
var prefvendor = transactionSearch[0].getValue(columns[14]);
var loconorder = transactionSearch[0].getValue(columns[5]); 
var ItemPP  = transactionSearch[0].getValue(columns[15]);
        
        var adjleadtime = 0;  if(locleadtime){ adjleadtime =locleadtime;} else{ adjleadtime =leadtime;}

        rec.setFieldValue('custrecord188',fivecode );   // nlapiSetFieldValue('terms',termss);
        rec.setFieldValue('custrecord193',LocavaDemand );
        rec.setFieldValue('custrecord191',avaDemand );
        rec.setFieldValue('custrecord195',adjleadtime );
        rec.setFieldValue('custrecord197',SRpoVendor );  
        rec.setFieldValue( 'custrecord209',Lava ); //
        rec.setFieldValue('custrecord217',loconorder ); //
        rec.setFieldValue( 'custrecord220',ItemPP );//recmachcustrecord221
       // return true;
      }
   else
    {
/////////////////////////////////nodemand
   
 var itemid = nlapiGetLineItemValue("item", "item", x);
      var SRpoVendor = nlapiGetLineItemValue("item", "povendor", x); 
  //var loc = location;
  //    alert(items);
      
    ////////////////////////////no demand search////////////  
      var columnsD =new Array();
      columnsD[0] =new nlobjSearchColumn("locationpreferredstocklevel",null,"MAX");
      columnsD[1] =new nlobjSearchColumn("locationquantityonhand",null,"MAX");
      columnsD[2] = new nlobjSearchColumn("locationquantitycommitted",null,"MAX");
        columnsD[3] =new nlobjSearchColumn("locationquantityavailable",null,"MAX");
        columnsD[4] = new nlobjSearchColumn("locationquantitybackordered",null,"MAX");
        columnsD[5] = new nlobjSearchColumn("locationquantityonorder",null,"MAX");
        columnsD[6] = new nlobjSearchColumn("locationquantityintransit",null,"MAX");
        columnsD[7] = new nlobjSearchColumn("locationquantityintransit",null,"MAX");
        columnsD[8] = new nlobjSearchColumn("custitem_tjinc_averagedemand",null,"AVG");
        columnsD[9] =new nlobjSearchColumn("custitem_tjinc_monthsonhand",null,"AVG");
        columnsD[10] =new nlobjSearchColumn("quantityavailable",null,"AVG");
        columnsD[11] =new nlobjSearchColumn("locationleadtime",null,"MAX");
      columnsD[12] =new nlobjSearchColumn("leadtime",null,"MAX");
       columnsD[13] = new nlobjSearchColumn("custitem35",null,"GROUP");
        columnsD[14] = new nlobjSearchColumn("vendor",null,"GROUP");
      
      var ItemDemand = nlapiSearchRecord("item",null,
[
   ["inventorylocation","anyof",location], 
   "AND", 
   ["internalidnumber","equalto",itemid]
],
  columnsD
);
if(ItemDemand)
      {
var Lava = 0;
var fivecode =  '';
var locleadtime =  0;
var leadtime =  0;
var moh =  0;
var avaDemand =  0;
var  LocavaDemand =  0;
var prefvendor =  '';
 
var Lava = ItemDemand[0].getValue(columnsD[3]);
var fivecode = ItemDemand[0].getValue(columnsD[13]);
var locleadtime = ItemDemand[0].getValue(columnsD[11]);
var leadtime = ItemDemand[0].getValue(columnsD[12]);
var moh = ItemDemand[0].getValue(columnsD[9]);
var avaDemand = ItemDemand[0].getValue(columnsD[8]);
var  LocavaDemand = 0;   // Math.round(ItemDemand[0].getValue(columnsD[7]));   
var prefvendor = ItemDemand[0].getValue(columnsD[14]);

        var adjleadtime = 0;  if(locleadtime){ adjleadtime =locleadtime;} else{ adjleadtime =leadtime;}

         rec.setFieldValue( 'custrecord188',fivecode );
          rec.setFieldValue('custrecord193',LocavaDemand );
          rec.setFieldValue( 'custrecord191',avaDemand );
         rec.setFieldValue('custrecord195',adjleadtime );
          rec.setFieldValue( 'custrecord197',SRpoVendor );  
          rec.setFieldValue( 'custrecord209',Lava );
        //return true;
    }
    }
      
  var idd  = nlapiSubmitRecord(rec);

soupdate.push({
  linkTranid:idd,
  lineid:x,
  trantype:1,});
      }
  }// end stock request for loop
  
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////start EX PO loop
  for( r =0; r<POLines.length && POLines; r++  )   
      {
         var x = POLines[r];
        
      if( nlapiGetLineItemValue("item", "custcol90", x) == 2 &&  !nlapiGetLineItemValue("item", "custcol91", x) )// start expdite loop 
          {
            var SRpoVendor = nlapiGetLineItemValue("item", "povendor", x); 
      var POtype = nlapiGetLineItemValue("item", "custcol90", x);
      var itemidex = nlapiGetLineItemValue('item', 'item', x);
      var Poloc = nlapiGetLineItemValue('item', 'location', x); 
      var POven = nlapiGetLineItemValue("item", "povendor", x); //nlapiLookupField('inventoryitem', itemidex, 'vendor');//////////////////////////////////////////////////////////////////////
      var soqty = nlapiGetLineItemValue('item', 'quantity', x);
      var coava =     nlapiGetLineItemValue('item', 'quantityavailable', x);//quantityavailable
      var lineQTY = soqty; // - coava;
      var so = nlapiGetRecordId();  //nlapiGetFieldValue("tranid");
            var sotext =  nlapiGetFieldValue("tranid");
      var solineid = x;// nlapiGetLineItemValue("item", "item", x);
      var empemailfg =  nlapiGetFieldValue("custbody_po_follow_up");
       var PONOTES =  nlapiGetFieldValue("custbody34");
      var  checkVenLocation = Poloc +"-"+POven; 
      var checkVenLocationItem =Poloc +"-"+POven +"-"+itemidex;
    var checkVenLoctionItemStatus = Poloc +"-"+POven +"-"+ itemidex ;
/// push values into array
        if(Poloc != POven && POven && Poloc )  //
        { 
  if(locationVendorPOheader.indexOf(checkVenLocation) == -1)  
  {locationVendorPOheader.push(checkVenLocation);   }
          
//if(checkVenLoctionItemStatusArray.indexOf(checkVenLoctionItemStatus) == -1 )
            if(itemidex)  {
checkVenLoctionItemStatusArray.push(checkVenLoctionItemStatus);
lineinfos.push({
  Poloc:Poloc,
  POven:POven,
  lineQTY:lineQTY,
  itemids:itemidex,
  checkVenLocation:checkVenLocation,  
  checkVenLocationItem:checkVenLocationItem,
  so:so,
   sotext:sotext,
  solineid:solineid,
  empemailfg:empemailfg
});
              }
 

     }//end array value push
     // end line loop array    
     } ///end expedite array loop
      } // end for loop
// nlapiLogExecution('AUDIT', 'checkVenLoctionItemStatusArray',  checkVenLoctionItemStatusArray);

        
////start expdite

//nlapiLogExecution('AUDIT', 'locationVendorPOheader', locationVendorPOheader);
///loop to create POs//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 for(y =0; y<locationVendorPOheader.length && locationVendorPOheader; y++  )  
	{ 
         nlapiLogExecution('AUDIT', ' EXPO',  1);
 var newpurchaseorderEX = nlapiCreateRecord('purchaseorder');
var ItemsperlocationPO = 0;
 lineidarray.length = 0;
var combinedlocationPO =  locationVendorPOheader[y];
var dashspotPO =  combinedlocationPO.indexOf("-");
var currentPOvendor =  combinedlocationPO.substring((dashspotPO+1), 1000);
var currentPOlocation  = combinedlocationPO.substring(-1000, (dashspotPO));
var empemails = nlapiGetFieldValue("custbody_po_follow_up");
 //nlapiLogExecution('AUDIT', '1',  1);
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
if(dd<10) {  dd = '0'+dd } ;
if(mm<10) {  mm = '0'+mm}; 
today = mm + '/' + dd + '/' + yyyy;
 
          //set header fields
   var createdby = '';//Created From Stock Request';
   newpurchaseorderEX.setFieldValue( 'entity',  currentPOvendor );  //custbody34
   newpurchaseorderEX.setFieldValue( 'custbody34',  PONOTES );  //
   newpurchaseorderEX.setFieldValue( 'location',  currentPOlocation );
   newpurchaseorderEX.setFieldValue( 'custbody70',  "T" );  
   newpurchaseorderEX.setFieldValue( 'trandate',  today );
   newpurchaseorderEX.setFieldValue( 'approvalstatus',  2 );
   newpurchaseorderEX.setFieldValue( 'custbody_po_follow_up',  empemails );
         // end set header fields 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start add Items
  // nlapiLogExecution('AUDIT', '2',  2);
  for(q =0; q<lineinfos.length && lineinfos; q++)  
	{
    //   nlapiLogExecution('AUDIT', 'lineinfos',  lineinfos);

if( lineinfos[q].checkVenLocation == combinedlocationPO )   //
  {   
//nlapiLogExecution('AUDIT', '3',  3);

var ItemsPOlocation =  lineinfos[q].Poloc;
var Itemsvendor = lineinfos[q].POven;
var lineQTY = lineinfos[q].lineQTY;
var itemidss =  lineinfos[q].itemids;
   
// nlapiLogExecution('AUDIT', '4',  4);
var currentSO = lineinfos[q].so;
var currentSOtext = nlapiLookupField('salesorder', currentSO, 'tranid');  //lineinfos[q].sotext;
var currentSOlineID = lineinfos[q].solineid; 
var currentSOvenLocItem = lineinfos[q].checkVenLocationItem;
var TOqty = 0;
var TOitemcost = 0;
    
//nlapiLogExecution('AUDIT', '5', 5);
 //   nlapiLogExecution('AUDIT', 'lineinfos', lineinfos[q].checkVenLocation);
 //   nlapiLogExecution('AUDIT', 'combinedlocationPO', combinedlocationPO);
 //    nlapiLogExecution('AUDIT', 'lineQTY', lineQTY);
    
     if( lineinfos[q].checkVenLocation == combinedlocationPO    && lineQTY> 0 )
     {
       lineidarray.push(currentSOlineID);
      //    nlapiLogExecution('AUDIT', '6',  6);
        newpurchaseorderEX.selectNewLineItem('item');
     //     nlapiLogExecution('AUDIT', 'itemidss',  itemidss);
        newpurchaseorderEX.setCurrentLineItemValue('item','item', itemidss ,true);
      
        newpurchaseorderEX.setCurrentLineItemValue('item','quantity', lineQTY, true);
        newpurchaseorderEX.setCurrentLineItemValue('item','location',  nlapiGetLineItemValue('item', 'location', x) ,true);
       
     //   nlapiLogExecution('AUDIT', 'itemidss',  itemidss);
        newpurchaseorderEX.setCurrentLineItemValue('item','custcol89',currentSOtext , true);
        newpurchaseorderEX.commitLineItem('item'); 
      //    nlapiLogExecution('AUDIT', '7',  7);
      }
  }  

      }   ///end add items.
       //  nlapiLogExecution('AUDIT', '8',  8);
var iddpo = nlapiSubmitRecord(newpurchaseorderEX);

   for( z =0; z<lineidarray.length && lineidarray; z++  )  //DropPOlines var x = Stocklines[l];
      {
        var thislineid =lineidarray[z];
soupdate.push({
  linkTranid:iddpo,
  lineid:thislineid,
  trantype:2,});
    }//endpusharray
    }
      
///////////////////////////////////////////////////////////end create Purchase order
  
        
/////////////////////////////////////////end expidite
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////start drop po
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  for( z =0; z<DropPOlines.length && DropPOlines; z++  )  //DropPOlines var x = Stocklines[l];
      {
         var x = DropPOlines[z];
        
      if( nlapiGetLineItemValue("item", "custcol90", x) == 3 &&  !nlapiGetLineItemValue("item", "custcol91", x) )// start expdite loop 
          {
      var POtypeDP = nlapiGetLineItemValue("item", "custcol90", x);
      var itemidexDP = nlapiGetLineItemValue('item', 'item', x);
      var PolocDP = nlapiGetLineItemValue('item', 'location', x); 
      var SRpoVendor = nlapiGetLineItemValue("item", "povendor", x); 
      var POvenDP =  nlapiGetLineItemValue("item", "povendor", x); //nlapiLookupField('inventoryitem', itemidexDP, 'vendor');
      var soqty = nlapiGetLineItemValue('item', 'quantity', x);
      var coava =   nlapiGetLineItemValue('item', 'quantityavailable', x);//quantityavailable
            
      var lineQTYDP = soqty;// - coava;
      var soDP = nlapiGetRecordId(); 
            var soDPtext = nlapiGetFieldValue("tranid");
      var solineidDP = x ; //nlapiGetLineItemValue("item", "item", x);
      var empemailfgDP =  nlapiGetFieldValue("custbody_po_follow_up");
      var  checkVenLocationDP = PolocDP +"-"+SRpoVendor; 
      var checkVenLocationItemDP =PolocDP +"-"+SRpoVendor +"-"+itemidexDP;
    var checkVenLoctionItemStatusDP = PolocDP +"-"+SRpoVendor +"-"+ itemidexDP ;
/// push values into array
        if(PolocDP != SRpoVendor && SRpoVendor && PolocDP )  //
        { 
  if(locationVendorPOheaderDP.indexOf(checkVenLocationDP) == -1)  
  {locationVendorPOheaderDP.push(checkVenLocationDP);   }
          
//if(checkVenLoctionItemStatusArrayDP.indexOf(checkVenLoctionItemStatusDP) == -1 )
       if(itemidexDP)          {
checkVenLoctionItemStatusArrayDP.push(checkVenLoctionItemStatusDP);
lineinfosDP.push({
  PolocDP:PolocDP,
  SRpoVendor:SRpoVendor,
  lineQTYDP:lineQTYDP,
  itemidsDP:itemidexDP,
  checkVenLocationDP:checkVenLocationDP,  
  checkVenLocationItemDP:checkVenLocationItemDP,
  soDP:soDP,
   soDPtext:soDPtext,
  solineidDP:solineidDP,
  empemailfgDP:empemailfgDP
});
              }
 

     }//end array value push
     // end line loop array    
     } ///end expedite array loop
        } // end for loop
// nlapiLogExecution('AUDIT', 'checkVenLoctionItemStatusArray',  checkVenLoctionItemStatusArray);

        
////start expdite

//nlapiLogExecution('AUDIT', 'locationVendorPOheaderDP', locationVendorPOheaderDP);
///loop to create POs//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 for(y =0; y<locationVendorPOheaderDP.length && locationVendorPOheaderDP; y++  )  
	{ 
         nlapiLogExecution('AUDIT', ' start drop',  3);
 var newpurchaseorderDP = nlapiCreateRecord('purchaseorder');
       lineidarrayDP.length = 0;
var ItemsperlocationPODP = 0;
var combinedlocationPODP =  locationVendorPOheaderDP[y];
var dashspotPODP =  combinedlocationPODP.indexOf("-");
var currentPOvendorDP =  combinedlocationPODP.substring((dashspotPODP+1), 1000);
var currentPOlocationDP  = combinedlocationPODP.substring(-1000, (dashspotPODP));
var empemailsDP = nlapiGetFieldValue("custbody_po_follow_up");
// nlapiLogExecution('AUDIT', '1',  1);
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
if(dd<10) {  dd = '0'+dd } ;
if(mm<10) {  mm = '0'+mm}; 
today = mm + '/' + dd + '/' + yyyy;
 
          //set header fields
   var createdby = '';//Created From Stock Request';
   newpurchaseorderDP.setFieldValue( 'entity',  currentPOvendorDP );
   newpurchaseorderDP.setFieldValue( 'location',  currentPOlocationDP );
   newpurchaseorderDP.setFieldValue( 'custbody147',  "T" );  
   newpurchaseorderDP.setFieldValue( 'trandate',  today );
   newpurchaseorderDP.setFieldValue( 'approvalstatus',  2 );
   newpurchaseorderDP.setFieldValue( 'custbody_po_follow_up',  empemailsDP ); //var soid =nlapiGetFieldValue('custbody184');
    
         // end set header fields 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start add Items
  // nlapiLogExecution('AUDIT', '2',  2);
  for(q =0; q<lineinfosDP.length && lineinfosDP; q++)  
	{
    //   nlapiLogExecution('AUDIT', 'lineinfos',  lineinfos);

if( lineinfosDP[q].checkVenLocationDP == combinedlocationPODP )   //
  {   
//nlapiLogExecution('AUDIT', '3',  3);
 
var ItemsPOlocationDP =  lineinfosDP[q].PolocDP;
var ItemsvendorDP = lineinfosDP[q].SRpoVendor;
var lineQTYDP = lineinfosDP[q].lineQTYDP;
var itemidssDP =  lineinfosDP[q].itemidsDP;
   
// nlapiLogExecution('AUDIT', '4',  4);
var currentSODP = lineinfosDP[q].soDP;
var currentSOtextDP = nlapiLookupField('salesorder', currentSODP, 'tranid');
    nlapiLogExecution('AUDIT', 'tranid', currentSOtextDP);
var currentSOlineIDDP = lineinfosDP[q].solineidDP; 
var currentSOvenLocItemDP = lineinfosDP[q].checkVenLocationItemDP;
var TOqtyDP = 0;
var TOitemcostDP = 0;
    
    newpurchaseorderDP.setFieldValue( 'custbody184',  currentSODP );
//nlapiLogExecution('AUDIT', '5', 5);
 //   nlapiLogExecution('AUDIT', 'lineinfos', lineinfosDP[q].checkVenLocation);
//    nlapiLogExecution('AUDIT', 'combinedlocationPO', combinedlocationPODP);
//     nlapiLogExecution('AUDIT', 'lineQTY', lineQTYDP);
    
     if( lineinfosDP[q].checkVenLocationDP == combinedlocationPODP    && lineQTYDP> 0 )
     {
        lineidarrayDP.push(currentSOlineIDDP);
 //         nlapiLogExecution('AUDIT', '6',  6);
        newpurchaseorderDP.selectNewLineItem('item');
//          nlapiLogExecution('AUDIT', 'itemidss',  itemidss);
        newpurchaseorderDP.setCurrentLineItemValue('item','item', itemidssDP ,true);
        newpurchaseorderDP.setCurrentLineItemValue('item','custcol4', "T", true); 
        newpurchaseorderDP.setCurrentLineItemValue('item','quantity', lineQTYDP, true);
        newpurchaseorderDP.setCurrentLineItemValue('item','location',  nlapiGetLineItemValue('item', 'location', x) ,true);
       
//        nlapiLogExecution('AUDIT', 'itemidss',  itemidssDP);
        newpurchaseorderDP.setCurrentLineItemValue('item','custcol89',currentSOtextDP , true);
        newpurchaseorderDP.commitLineItem('item'); 
 //         nlapiLogExecution('AUDIT', '7',  7);
      }
  }  

      }   ///end add items.
           var address = nlapiLookupField('salesorder', sonum , 'shipaddress');
           newpurchaseorderDP.setFieldValue('shipaddress',address);
        //  newpurchaseorderDP.setFieldValue('createdfrom',currentSODP);
var iddpoDP = nlapiSubmitRecord(newpurchaseorderDP);
  for( z =0; z<lineidarrayDP.length && lineidarrayDP; z++  )  //DropPOlines var x = Stocklines[l];
      {
        var thislineid =lineidarrayDP[z];    
soupdate.push({
  linkTranid:iddpoDP,
  lineid:thislineid,
  trantype:3,}); 
      }
    }
      
///////////////////////////////////////////////////////////end create drop order

  /////////// end Drop
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////start willcall PO loop
  for(b=0; b<WillcallPOlines.length && WillcallPOlines; b++  )   
      {
         var x = WillcallPOlines[b];
        
      if( nlapiGetLineItemValue("item", "custcol90", x) == 4 &&  !nlapiGetLineItemValue("item", "custcol91", x) )// start expdite loop 
          {
      var POtype = nlapiGetLineItemValue("item", "custcol90", x);
      var itemidex = nlapiGetLineItemValue('item', 'item', x);
            var SRpoVendor = nlapiGetLineItemValue("item", "povendor", x); 
      var Poloc = nlapiGetLineItemValue('item', 'location', x); 
      var POven = nlapiLookupField('inventoryitem', itemidex, 'vendor');
      var soqty = nlapiGetLineItemValue('item', 'quantity', x);
      var coava =     nlapiGetLineItemValue('item', 'quantityavailable', x);//quantityavailable
      var lineQTY = soqty;// - coava;
      var so = nlapiGetRecordId();
       var sotext =      nlapiGetFieldValue("tranid");
      var solineid = x;// nlapiGetLineItemValue("item", "item", x);
      var empemailfg =  nlapiGetFieldValue("custbody_po_follow_up");
       var PONOTES =  nlapiGetFieldValue("custbody34");
      var  checkVenLocation = Poloc +"-"+POven; 
      var checkVenLocationItem =Poloc +"-"+POven +"-"+itemidex;
    var checkVenLoctionItemStatus = Poloc +"-"+POven +"-"+ itemidex ;
/// push values into array
        if(Poloc != POven && POven && Poloc )  //
        { 
  if(locationVendorPOheaderWC.indexOf(checkVenLocation) == -1)  
  {locationVendorPOheaderWC.push(checkVenLocation);   }
          
//if(checkVenLoctionItemStatusArray.indexOf(checkVenLoctionItemStatus) == -1 )
            if(itemidex)  {
checkVenLoctionItemStatusArray.push(checkVenLoctionItemStatus);
lineifosWC.push({
  Poloc:Poloc,
  POven:POven,
  lineQTY:lineQTY,
  itemids:itemidex,
  checkVenLocation:checkVenLocation,  
  checkVenLocationItem:checkVenLocationItem,
  so:so,
   sotext:sotext,
  solineid:solineid,
  empemailfg:empemailfg
});
              }
 

     }//end array value push
     // end line loop array    
     } ///end expedite array loop
      } // end for loop
// nlapiLogExecution('AUDIT', 'checkVenLoctionItemStatusArray',  checkVenLoctionItemStatusArray);

        
////start Will Call Loop

//nlapiLogExecution('AUDIT', 'locationVendorPOheaderWC', locationVendorPOheaderWC);
///loop to create POs//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 for(p =0; p<locationVendorPOheaderWC.length && locationVendorPOheaderWC; p++  )  
	{ 
         nlapiLogExecution('AUDIT', ' EXPO',  1);
 var newpurchaseorderWC = nlapiCreateRecord('purchaseorder');
var ItemsperlocationPO = 0;
 lineidarray.length = 0;
var combinedlocationPO =  locationVendorPOheaderWC[p];
var dashspotPO =  combinedlocationPO.indexOf("-");
var currentPOvendor =  combinedlocationPO.substring((dashspotPO+1), 1000);
var currentPOlocation  = combinedlocationPO.substring(-1000, (dashspotPO));
var empemails = nlapiGetFieldValue("custbody_po_follow_up");
var materialstatusWC = 38;
 //nlapiLogExecution('AUDIT', '1',  1);
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
if(dd<10) {  dd = '0'+dd } ;
if(mm<10) {  mm = '0'+mm}; 
today = mm + '/' + dd + '/' + yyyy;
 
          //set header fields
   var createdby = '';//Created From Stock Request';
   newpurchaseorderWC.setFieldValue( 'entity',  currentPOvendor );  //custbody34
   newpurchaseorderWC.setFieldValue( 'custbody34',  PONOTES );  //
   newpurchaseorderWC.setFieldValue( 'location',  currentPOlocation );
   newpurchaseorderWC.setFieldValue( 'custbody179',  "T" );  
   newpurchaseorderWC.setFieldValue( 'custbody6',materialstatusWC  ); 
   newpurchaseorderWC.setFieldValue( 'trandate',  today );
   newpurchaseorderWC.setFieldValue( 'approvalstatus',  2 );
   newpurchaseorderWC.setFieldValue( 'custbody_po_follow_up',  empemails );
         // end set header fields 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start add Items
  // nlapiLogExecution('AUDIT', '2',  2);
  for(q =0; q<lineifosWC.length && lineifosWC; q++)  
	{
    //   nlapiLogExecution('AUDIT', 'lineinfos',  lineinfos);

if( lineifosWC[q].checkVenLocation == combinedlocationPO )   //
  {   
//nlapiLogExecution('AUDIT', '3',  3);

var ItemsPOlocation =  lineifosWC[q].Poloc;
var Itemsvendor = lineifosWC[q].POven;
var lineQTY = lineifosWC[q].lineQTY;
var itemidss =  lineifosWC[q].itemids;
   
// nlapiLogExecution('AUDIT', '4',  4);
var currentSO = lineifosWC[q].so;
var currentSOtext = nlapiLookupField('salesorder', currentSO, 'tranid'); //lineifosWC[q].sotext;
var currentSOlineID = lineifosWC[q].solineid; 
var currentSOvenLocItem = lineifosWC[q].checkVenLocationItem;
var TOqty = 0;
var TOitemcost = 0;
    
//nlapiLogExecution('AUDIT', '5', 5);
 //   nlapiLogExecution('AUDIT', 'lineifosWC', lineifosWC[q].checkVenLocation);
 //   nlapiLogExecution('AUDIT', 'combinedlocationPO', combinedlocationPO);
 //    nlapiLogExecution('AUDIT', 'lineQTY', lineQTY);
    
     if( lineifosWC[q].checkVenLocation == combinedlocationPO    && lineQTY> 0 )
     {
       lineidarray.push(currentSOlineID);
      //    nlapiLogExecution('AUDIT', '6',  6);
        newpurchaseorderWC.selectNewLineItem('item');
     //     nlapiLogExecution('AUDIT', 'itemidss',  itemidss);
        newpurchaseorderWC.setCurrentLineItemValue('item','item', itemidss ,true);
      
        newpurchaseorderWC.setCurrentLineItemValue('item','quantity', lineQTY, true);
        newpurchaseorderWC.setCurrentLineItemValue('item','location',  nlapiGetLineItemValue('item', 'location', x) ,true);
       
     //   nlapiLogExecution('AUDIT', 'itemidss',  itemidss);
        newpurchaseorderWC.setCurrentLineItemValue('item','custcol89',currentSOtext , true);
        newpurchaseorderWC.commitLineItem('item'); 
      //    nlapiLogExecution('AUDIT', '7',  7);
      }
  }  

      }   ///end add items.
       //  nlapiLogExecution('AUDIT', '8',  8);
var iddpo = nlapiSubmitRecord(newpurchaseorderWC);


   for( z =0; z<lineidarray.length && lineidarray; z++  )  //DropWillcallPOlines var x = Stocklines[l];
      {
        var thislineid =lineidarray[z];
soupdate.push({
  linkTranid:iddpo,
  lineid:thislineid,
  trantype:4,});
    }//endpusharray
    }
      
///////////////////////////////////////////////////////////end create Purchase order
  ///////////////////////////////////////////////////////////////////////////////////////////////////PO CREATE ENDS HERE
  //
  //
  //
  //
  //
  //
  //
        
/////////////////////////////////////////end Will Call
  
var SOrec = nlapiLoadRecord('salesorder', sonum);
  for(q =0; q<soupdate.length && soupdate; q++)  
	{
  var linktranidlist=soupdate[q].linkTranid;
  var linidlist=soupdate[q].lineid;
  var trantypelist =soupdate[q].trantype;
       nlapiLogExecution('AUDIT', 'trantypelist',  trantypelist);
     SOrec.selectLineItem("item", linidlist);
      if(trantypelist ==1){SOrec.setCurrentLineItemValue("item", "custcol91", linktranidlist);} 
      if(trantypelist ==2){ SOrec.setCurrentLineItemValue("item", "custcol74", linktranidlist); } //var response =  nlapiResolveURL('RECORD', 'transferorder',linktranidlist ); window.open(response);   nlapiLookupField('salesorder', linktranidlist, 'tranid', true)
      if(trantypelist ==3){ SOrec.setCurrentLineItemValue("item", "custcol74",linktranidlist);   }
      if(trantypelist ==4){ SOrec.setCurrentLineItemValue("item", "custcol74", linktranidlist);   }
      SOrec.commitLineItem("item");
    }
  nlapiSubmitRecord(SOrec);
  soupdate.length =0;
  //nlapiSetRedirectURL('RECORD', 'salesorder', sonum, false);

  */
  
  ////////////////////////////////////////////////////////change form
if(nlapiGetFieldValue('customform') == 303 && type == 'create')
  {
var id = nlapiGetRecordId();
var records = nlapiLoadRecord('salesorder', id );
records.setFieldValue('customform',294 ); 
   nlapiSubmitRecord(records);
 nlapiSetRedirectURL('RECORD', 'salesorder', id, false);
//  return true;
  }
}
