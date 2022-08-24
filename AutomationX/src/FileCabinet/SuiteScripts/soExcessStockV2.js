function arraysort(a, b){
    if(a.picklocation < b.picklocation) { return -1; }
    if(a.picklocation > b.picklocation) { return 1; }
    return 0;
 }
 
 function valLine(type,name){
     var headerlocation = nlapiGetFieldValue('location'); 
 if(!nlapiGetCurrentLineItemValue('item', 'location') ) 
   {
 nlapiSetCurrentLineItemValue('item', 'location',headerlocation,false,true );
   }
    return true;
 }

 function getParameterFromURL(param) {
  if (param = (new RegExp('[?&]' + encodeURIComponent(param) + '=([^&]*)')).exec(location.search))
    return decodeURIComponent(param[1]);
}  
 
 function postsourceES(type,name)
 {
 
      if(name =='item' &&  nlapiGetFieldValue('customform') != 303  && getParameterFromURL('axCopy') != 'yes')// && nlapiGetUser() == 3354
     {
 
 ///////////////////////////////////////////overstock
     var overstockES = nlapiGetCurrentLineItemValue('item',  "custcol87");
     var avaLocalES = nlapiGetCurrentLineItemValue('item',  "quantityavailable");
     var avaCompES = nlapiGetCurrentLineItemValue('item',  "custcol32");
     var uidES = nlapiGetCurrentLineItemValue('item',  "item");
     var locationES =  nlapiGetCurrentLineItemValue('item',  "location");
     var lineQty = nlapiGetCurrentLineItemValue('item',  "quantity");  
     var headerLocation = nlapiGetFieldValue('location');
    
     var newlocationES;
     if(overstockES == "T" && avaCompES >0 ) 
                  {
 var columnsES = new Array();
 columnsES[0] =  new nlobjSearchColumn("inventorylocation", "item" ,"GROUP");
 columnsES[1] =  new nlobjSearchColumn("locationquantityavailable", "item","MAX").setSort(false);
 columnsES[2] = new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("Case WHEN ({locationnohierarchy}= {item.inventorylocation} ) and {trandate} < (sysdate+1) THEN  ABS({quantity})/3  ELSE NULL END");
 //columnsES[3] =  new nlobjSearchColumn("custrecord302","CUSTRECORD301","COUNT");
                    
 var itemSearchESDemand = nlapiSearchRecord("transaction",null,
 [
    ["type","anyof","WorkOrd","SalesOrd"], 
    "AND", 
    ["mainline","is","F"], 
    "AND", 
    ["taxline","is","F"], 
    "AND", 
    ["shipping","is","F"], 
    "AND", 
    ["trandate","onorafter","daysago100"], 
    "AND", 
    ["item.locationquantityavailable","greaterthan","0"], 
    "AND", 
    ["location.custrecord17","is","T"], 
    "AND", 
    ["item.internalidnumber","equalto",uidES], 
    "AND", 
    ["closed","is","F"], 
    "AND", 
    ["item.inventorylocation","noneof","@NONE@","62","21","66","73","49","28","36","52","46","72","57","30","33","48","61","25","22","24","63","50","38","26","31","37","29","70","68","20","75","71","69","51","23","65","18","56","19","39","6","59","54","16"]
 ],
 columnsES
 );
 
 /////////////////////////////start search  if item has demand
   if(itemSearchESDemand){
 
 var locationsWithINV = new Array();
        for(q =0; q<itemSearchESDemand.length && itemSearchESDemand; q++)  
         {
         
 var picklocation = itemSearchESDemand[q].getValue(columnsES[0]);
 var locatonText = itemSearchESDemand[q].getText(columnsES[0]);
 var pickLocAva = itemSearchESDemand[q].getValue(columnsES[1]);
 var pickDemand = itemSearchESDemand[q].getValue(columnsES[2]);
             if((picklocation == locationES)  &&  pickLocAva>0 ){ return false;}
 var pickLocMOH = 0;  if(pickDemand>0){pickLocMOH = (pickLocAva / pickDemand).toFixed(1); }else{pickLocMOH = 99; }
 var pickSort =   (pickLocAva * pickLocMOH).toFixed(2); //  alert(locatonText + "-moh: " + pickLocMOH  + " ava: " + pickLocAva + " sort# " +  pickSort + " demand "  + pickDemand );
 if(pickLocMOH < 4){picklocation ="";} locationsWithINV.push({picklocation:picklocation,pickLocAva:pickLocAva, pickSort:pickSort, locatonText:locatonText  });
 if( locationES == picklocation ){ avaLocalES = pickLocAva;}else{ avaLocalES = 0; }
         }
     if(avaLocalES > 0)
 {
 return true; 
 }
 else if (avaCompES >0)
 {
  
 var locationArrayIndex =0;
 var picSortMax=0;
          for(i =0; i < locationsWithINV.length && locationsWithINV; i++)    // search array for location with most overstock.
         { 
           var thismax = locationsWithINV[i].pickSort;
       //   alert("max" + picSortMax + " t hismax " + thismax);
           if(thismax*1 > picSortMax*1 && picklocation != headerLocation){  picSortMax = thismax;  locationArrayIndex = i; }
         }
 newlocationES = locationsWithINV[locationArrayIndex].picklocation;
   //  alert(newlocationES + "---"  +  locationArrayIndex + "---" +  picSortMax);
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////end location search
   }
 }
 else
 {
 var columnsESnoDemand = new Array();
 columnsESnoDemand[0] =  new nlobjSearchColumn("inventorylocation", null, null );
 columnsESnoDemand[1] =  new nlobjSearchColumn("locationquantityavailable",null, null ).setSort(false);
 //columnsESnoDemand[2] =  new nlobjSearchColumn("custrecord302","CUSTRECORD301","COUNT");
 var itemSearchNoDemand = nlapiSearchRecord("item",null,
 [
    ["inventorylocation.custrecord17","is","T"], 
    "AND", 
    ["locationquantityavailable","greaterthan","0"], 
    "AND", 
    ["internalidnumber","equalto", uidES], 
    "AND", 
    ["inventorylocation","noneof","16"]
 ], 
 columnsESnoDemand
 );
 
   if(itemSearchNoDemand  )
     {
 var picklocation = itemSearchNoDemand[0].getValue(columnsESnoDemand[0]);
 
 newlocationES = picklocation;
     }
 }
  //alert(headerLocation + " " + newlocationES); 
 if(newlocationES && headerLocation !=  newlocationES)
   {
   nlapiSetCurrentLineItemValue('item', 'location', newlocationES);
    var newlocationtextES = nlapiGetCurrentLineItemText('item', 'location');
 
    var descplainES = nlapiGetCurrentLineItemValue('item', 'custcol_linenumber');
    var descboldES = descplainES + "-ES"
 
    nlapiSetCurrentLineItemValue('item', 'custcol_linenumber', descboldES);
 
    alert("This item has excess stock at another location.  The location for this line item has been changed to:\n\n " +newlocationtextES + " \n \n Please ship or transfer this product from the new location." );
  return true;
   }
                }
 ///////////////////////////////////////endoverstock
 
   }
 }