/**
 * Copyright (c) [year] Trajectory Inc.
 * 76 Richmond St. East, Suite 400, Toronto, ON, Canada, M5C 1P1
 * www.trajectoryinc.com
 * All Rights Reserved.
 */

/**
 * @System: [Name of the system which is part this class, and the url for the
 *          documentation]
 * @Company: Trajectory Inc. / Kuspide Canada Inc.
 * @CreationDate: [yyyyMMdd]
 * @DocumentationUrl: [Url of the page that has the general description of the
 *                    functionality]
 * @NamingStandard: TJINC_NSJ-1-3
 */

/* exported TJINC_ATXNIN_InventoryCheck */

function TJINC_ATXNIN_InventoryCheck(request, response) {
    'use strict';
    
var json, callback, itemid, custid, custLocation, item, locationCount, locationonhand, locationleadtime, i, foundInventory={locationName:0,onhand:0,locationonhand:0,leadtime:0,onorder:0,source:0};

    try {
        if (request.getMethod().toString() === 'GET') {
            callback = request.getParameter('callback');
            itemid = request.getParameter('itemid') === null || request.getParameter('itemid').length < 1 ? null : parseInt(request.getParameter('itemid'), 10);
            custid = request.getParameter('custid') === null || request.getParameter('custid').length < 1 ? null : parseInt(request.getParameter('custid'), 10);
          if( itemid !== null){
            
            /////////////item search
var itemcolumns = new Array();
  itemcolumns[0] =   new nlobjSearchColumn("locationquantityavailable",null,"SUM"); // on hand company
  itemcolumns[1] =   new nlobjSearchColumn("locationleadtime",null,"AVG"); // lead time
  itemcolumns[2] =   new nlobjSearchColumn("locationquantityonorder",null,"SUM");  // on order
  itemcolumns[3] =   new nlobjSearchColumn("custitem46",null,"GROUP"); // Source
  itemcolumns[4] =   new nlobjSearchColumn("locationquantityintransit",null,"SUM");
   itemcolumns[5] =  new nlobjSearchColumn("locationquantitybackordered",null,"SUM");


    
            var itemSearch = nlapiSearchRecord("item",null,
[
   ["internalidnumber","equalto", itemid],
   "AND", 
 ["inventorylocation.custrecord17","is","T"]
], 
itemcolumns
);
            ////////////////////////////item search
            var qt =  0;  if(parseInt(itemSearch[0].getValue(itemcolumns[4]),10) > 0) { qt = parseInt(itemSearch[0].getValue(itemcolumns[4]),10);}
            var qbo =0;   if(parseInt(itemSearch[0].getValue(itemcolumns[5]),10) > 0) { qbo = parseInt(itemSearch[0].getValue(itemcolumns[5]),10);}
            
foundInventory.onhand = parseInt(itemSearch[0].getValue(itemcolumns[0]),10)  -    qt     -  qbo ;
foundInventory.leadtime = parseInt(itemSearch[0].getValue(itemcolumns[1]),10);
foundInventory.onorder = itemSearch[0].getValue(itemcolumns[2]);
if(itemSearch[0].getValue(itemcolumns[3])== 2){ foundInventory.source = 1; }
//foundInventory.source = itemSearch[0].getValue(itemcolumns[3]);
            
            item = nlapiLoadRecord('inventoryitem', itemid);
            
            if (callback !== null  ) {
                json = callback;
          // foundInventory.onhand= parseInt(item.getFieldValue('totalquantityonhand'),10);  
               if ( custid !== null) {
                custLocation = nlapiLookupField('customer', custid, 'custentity180');
                if (custLocation !== null && custLocation.length > 0 ) {
                    custLocation = parseInt(custLocation, 10);
                    foundInventory.locationName = nlapiLookupField('customer', custid, 'custentity180', true).split(': ')[1];
                    locationCount = item.getLineItemCount('locations');

                    for (i = 1; i <= locationCount; i = i + 1) {
                        if (parseInt(item.getLineItemValue('locations', 'locationid', i), 10) === custLocation) {
                            if (parseInt(item.getLineItemValue('locations', 'quantityonhand', i), 10) > 0) {
                                foundInventory.locationonhand = parseInt(item.getLineItemValue('locations', 'quantityavailable', i), 10);
                              
                              
                            }
                        }
                    }  
                }}
            }}
        }
    } catch (e) {
    }

    response.setContentType('JAVASCRIPT');
    response.write(json + '(' + JSON.stringify(foundInventory) + ');');
}