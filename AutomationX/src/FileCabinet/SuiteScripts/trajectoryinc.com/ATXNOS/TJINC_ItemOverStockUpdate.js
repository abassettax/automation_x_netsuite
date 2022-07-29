/**
 * Copyright (c) 2011 Trajectory Inc.
 * 165 John St. 3rd Floor, Toronto, ON, Canada, M5T 1X3
 * www.trajectoryinc.com
 * All Rights Reserved.
 */

/**
 * @System: Netsuite - Production
 * @Author: Darren Hill
 * @Company: Trajectory Inc. / Kuspide Canada Inc.
 * @CreationDate: 2012/03/16
 * @GeneralDescription: This script is to enforce Swish Data specific Time Sheet rules.
 * @LastModificationDate: 2012/03/22
 * @LastModificationAuthor: Darren Hill
 * @LastModificationDescription: Creation
 * @FileName: TJINC_ItemOverStockUpdate.js
 * @NamingStandard: TJINC_NSJ-1-1
 * @Version 1.0
 * @DocumentationUrl: https://docs.google.com/a/trajectoryinc.com/document/d/1bQ0LBBrwz8P_PZqeOyQ85cbIli5UJUUsG3PxblD_k4o/  
 */

/*
 * @Function: TJINC_OnSave @Purpose: This function loads @Parameters: Type (default) Defaults record Type Name (default) the field that is being updated linenum (default) the line index of the lineitem @Returns: N/A
 */

/* exported updateOverStock, LocationClassification */

var LocationClassification = {
    'A' : 1,
    'C' : 3
};

function pad2(number) {
    'use strict';
    return (number < 10 ? '0' : '') + number;
}

// https://docs.google.com/a/trajectoryinc.com/document/d/1bQ0LBBrwz8P_PZqeOyQ85cbIli5UJUUsG3PxblD_k4o/edit#heading=h.8tdt32ig5bt0
function TJINC_GetItemUsage(itemid, monthsago) {

    'use strict';
    var filters = [];
    filters.push(new nlobjSearchFilter('internalidnumber', null, 'equalto', itemid));
    filters[0].setLeftParens(1);
    filters[0].setOr(true);

    filters.push(new nlobjSearchFilter('internalidnumber', 'memberitem', 'equalto', itemid));
    filters[1].setRightParens(1);

    filters.push(new nlobjSearchFilter('type', 'transaction', 'anyof', 'ItemShip'));

    filters.push(new nlobjSearchFilter('formulanumeric', null, 'greaterthan', 0));
    filters[3].setFormula('{transaction.quantity}');

    filters.push(new nlobjSearchFilter('type', null, 'noneof', 'Kit'));

    filters.push(new nlobjSearchFilter('trandate', 'transaction', 'onorafter', 'monthsago' + monthsago));
    
    //Change ATX-23
    filters.push(new nlobjSearchFilter('mainline', 'transaction', 'is', 'F'));
    filters.push(new nlobjSearchFilter('custbody133', 'transaction', 'doesnotstartwith', 'Transfer'));
    filters.push(new nlobjSearchFilter('taxline', 'transaction', 'is', 'F'));
    filters.push(new nlobjSearchFilter('shipping', 'transaction', 'is', 'F'));
    filters.push(new nlobjSearchFilter('accounttype', 'transaction', 'anyof', 'COGS'));


    var columns = [];
    columns.push(new nlobjSearchColumn('type'));
    columns[0].setLabel('Item Type');

    columns.push(new nlobjSearchColumn('itemid'));
    columns[1].setLabel('Item Name');
    columns[1].setSort();

    columns.push(new nlobjSearchColumn('internalid', 'transaction'));
    columns[2].setLabel('Transaction Internal ID');

    columns.push(new nlobjSearchColumn('quantity', 'transaction'));
    columns[3].setLabel('Transaction Quantity');

    columns.push(new nlobjSearchColumn('trandate', 'transaction'));

    columns.push(new nlobjSearchColumn('tranid', 'transaction'));
    columns[5].setLabel('Transaction Number');

    columns.push(new nlobjSearchColumn('memberquantity'));

    columns.push(new nlobjSearchColumn('formulanumeric'));
    columns[7].setLabel('ITEM USAGE');
    columns[7].setFormula('CASE WHEN {type}=\'Inventory Item\' THEN {transaction.quantity} ELSE ({transaction.quantity}*{memberquantity}) END');
 


    var searchresults = nlapiSearchRecord('item', null, filters, columns);
    var today = new Date();
    // Set day to start of the month
    today.setDate(1);
    var startDate = null;
    var monthlyTotals = null;
    var monthlyDifferences = null;
    var totalUnits = null;

    if (searchresults !== null && searchresults.length > 0) {
        totalUnits = parseFloat(0);
        monthlyTotals = {};
        monthlyDifferences = {};
        startDate = nlapiAddMonths(today, -(monthsago));

        for (var j = 0; j <= monthsago; j = j + 1) {
            var tempDate = startDate.getFullYear() + '' + pad2(startDate.getMonth());
            monthlyTotals[tempDate] = parseFloat(0);
            monthlyDifferences[tempDate] = parseFloat(0);
            startDate = nlapiAddMonths(startDate, 1);
        }

        for (var i = 0; i < searchresults.length; i = i + 1) {
            var searchresult = searchresults[i];
            var tranDate = nlapiStringToDate(searchresult.getValue(columns[4]));
            var monthKey = tranDate.getFullYear() + '' + pad2(tranDate.getMonth());
            monthlyTotals[monthKey] += parseFloat(searchresult.getValue(columns[7]));
            totalUnits += parseFloat(searchresult.getValue(columns[7]));
        }
    }

    /*
     * Calculate Demand Trend %
     */

    if (monthlyTotals !== null) {
        // Reset startDate
        startDate = nlapiAddMonths(today, -(monthsago));

        for (var k = 0; k < monthsago; k = k + 1) {
            var monthA = startDate.getFullYear() + '' + pad2(startDate.getMonth());
            startDate = nlapiAddMonths(startDate, 1);
            var monthB = startDate.getFullYear() + '' + pad2(startDate.getMonth());

            monthlyDifferences[monthB] = ((monthlyTotals[monthB] - monthlyTotals[monthA]) / monthlyTotals[monthA]) * 100;
        }
    }

    var avgDemandTrend = parseFloat(0);

    for ( var percent in monthlyDifferences) {
        if (monthlyDifferences.hasOwnProperty(percent)) {
            avgDemandTrend += monthlyDifferences[percent];
        }
    }

    avgDemandTrend = avgDemandTrend / monthsago;

    avgDemandTrend = Math.round(avgDemandTrend * 100) / 100;
    totalUnits = Math.round(totalUnits * 100) / 100;
    var avgDemand = totalUnits / monthsago;
    avgDemand = Math.round(avgDemand * 100) / 100;

    totalUnits = totalUnits === null || isNaN(totalUnits) ? parseFloat(0, 10) : totalUnits;
    avgDemand = avgDemand === null || isNaN(avgDemand) ? parseFloat(0, 10) : avgDemand;
    avgDemandTrend = avgDemandTrend === null || isNaN(avgDemandTrend) || !isFinite(avgDemandTrend) ? parseFloat(0, 10) : avgDemandTrend;

    var ItemUsage = {
        total : totalUnits,
        avgDemand : avgDemand,
        avgDemandTrend : avgDemandTrend,
        monthlyTotals : monthlyTotals,
        monthlyDifferences : monthlyDifferences
    };

    return ItemUsage;
}


//https://docs.google.com/a/trajectoryinc.com/document/d/1bQ0LBBrwz8P_PZqeOyQ85cbIli5UJUUsG3PxblD_k4o/edit#heading=h.d5nm9ipvq8a0
function updateOverStock(rec_type, rec_id) {
    'use strict';

    // Load the Item record
    var item = nlapiLoadRecord(rec_type, rec_id);
    var name = item.getFieldValue('itemid');
    var itemactivityClass = item.getFieldText('custitem61');
    var custitemoverstocked = item.getFieldValue('custitemoverstocked');
    var custitem_tjinc_overstocked_company = item.getFieldValue('custitem_tjinc_overstocked_company');
    var isLocationOverstocked = false;
    var requiresRecordSave = false;
    var nextinvtcountdate = null;
    var currentclassification = 0;
    var invtcountinterval = 0;
    var newCountinterval = 30;
    var quantityavailable = 0;
    var quantityonhand = 0;
    var preferredstocklevel = 0;
    var total_quantityavailable = 0;
    var total_preferredstocklevel = 0;
    var fields = [];
    var values = [];
    var i;
    var newDate = nlapiDateToString(nlapiAddDays(new Date(), 30));

    var locationCount = item.getLineItemCount('locations');

    for (i = 1; i <= locationCount; i = i + 1) {

        // Only worry about locations that start with 'A: '
        if (item.getLineItemValue('locations', 'location_display', i).indexOf('A: ') === 0) {
            nextinvtcountdate = item.getLineItemValue('locations', 'nextinvtcountdate', i) === null || item.getLineItemValue('locations', 'nextinvtcountdate', i).length < 2 ? null : item.getLineItemValue('locations', 'nextinvtcountdate', i);
            invtcountinterval = item.getLineItemValue('locations', 'invtcountinterval', i) === null || isNaN(item.getLineItemValue('locations', 'invtcountinterval', i)) ? 0 : parseInt(item.getLineItemValue('locations', 'invtcountinterval', i), 10);
            quantityonhand = item.getLineItemValue('locations', 'quantityonhand', i) === null || isNaN(item.getLineItemValue('locations', 'quantityonhand', i)) ? 0 : parseInt(item.getLineItemValue('locations', 'quantityonhand', i), 10);
            quantityavailable = item.getLineItemValue('locations', 'quantityavailable', i) === null || isNaN(item.getLineItemValue('locations', 'quantityavailable', i)) ? 0 : parseInt(item.getLineItemValue('locations', 'quantityavailable', i), 10);
            preferredstocklevel = item.getLineItemValue('locations', 'preferredstocklevel', i) === null || isNaN(item.getLineItemValue('locations', 'preferredstocklevel', i)) ? 0 : parseInt(item.getLineItemValue('locations', 'preferredstocklevel', i), 10);
            currentclassification = item.getLineItemValue('locations', 'invtclassification', i) === null || isNaN(item.getLineItemValue('locations', 'invtclassification', i)) ? 0 : parseInt(item.getLineItemValue('locations', 'invtclassification', i), 10);

            total_quantityavailable += quantityavailable;
            total_preferredstocklevel += preferredstocklevel;

            // If ANY location is overstocked, check the flag, otherwise, uncheck the flag
            if (parseInt(quantityavailable, 10) - parseInt(preferredstocklevel, 10) > parseInt(0, 10)) {
                isLocationOverstocked = true;
            }

            // If ANY location has a blank 'Next Inventory Count Date', fill it with 
            if (quantityonhand > 0) {
                if (nextinvtcountdate === null) {
                    item.setLineItemValue('locations', 'nextinvtcountdate', i, newDate);
                    nextinvtcountdate = newDate;
                    requiresRecordSave = true;
                }

                if (invtcountinterval <= 0) {
                    item.setLineItemValue('locations', 'invtcountinterval', i, 30);
                    invtcountinterval = 30;
                    requiresRecordSave = true;
                }
            }

            // Set Location Classification
            if (nextinvtcountdate !== null && invtcountinterval > 0) {
                if (quantityonhand > 0  ) { //  change to only count items on hand  preferredstocklevel > 0) {
                    if (currentclassification !== LocationClassification.A) {
                        // Set Classification to 'A'
                        nlapiLogExecution('AUDIT', 'Setting locations classification to A', 'Location: ' + item.getLineItemValue('locations', 'location_display', i));
                       // item.setLineItemValue('locations', 'invtclassification', i, LocationClassification.A);
                        item.setLineItemValue('locations', 'nextinvtcountdate', i, newDate);
                    }
              //if a 30 day if b 40 day if c or less 60 day
              if(itemactivityClass == "A"){newCountinterval = 30;} else if(itemactivityClass == "B") {newCountinterval = 30; } else if(itemactivityClass == "C") {newCountinterval = 45; } else{newCountinterval = 60;}
                    item.setLineItemValue('locations', 'invtcountinterval', i, newCountinterval);
                    requiresRecordSave = true;
                } else {
                    if (currentclassification !== LocationClassification.C) {
                        // Set Classification to 'C'
                        nlapiLogExecution('AUDIT', 'Setting locations classification to C', 'Location: ' + item.getLineItemValue('locations', 'location_display', i));
                       // item.setLineItemValue('locations', 'invtclassification', i, LocationClassification.C);
                        item.setLineItemValue('locations', 'nextinvtcountdate', i, newDate);
                    }
                    item.setLineItemValue('locations', 'invtcountinterval', i, 45);
                    requiresRecordSave = true;
                }

                //ATX-15
                // Requires record Save was here
            }
        }
    }

    //ATX-15
    // Moved the submiting to database instance outside the for loop, in order to avoid a reference to an outdated field.
    // If more than one location needs update, it should be done all together.
    
    if (requiresRecordSave) {
        nlapiSubmitRecord(item, true, false);
        nlapiLogExecution('AUDIT', 'Saving Record', 'Locations modified.  Saved Record');
    }
    
    // Is this item over stocked, Company wide?
    if (parseInt(total_quantityavailable, 10) - parseInt(total_preferredstocklevel, 10) > parseInt(0, 10)) {
        // Don't bother updating if it is ALREADY flagged as overstocked (keeps the logs clean).
        if (custitem_tjinc_overstocked_company !== 'T') {
            fields.push('custitem_tjinc_overstocked_company');
            values.push('T');
            nlapiLogExecution('AUDIT', 'FLAGGING AS OVERSTOCKED (Company)', 'Flagging ' + name + ' (' + rec_type + ',' + rec_id + ') - as OVERSTOCKED!');
        }
    } else {
        // Don't bother updating if it is ALREADY flagged as overstocked (keeps the logs clean).
        if (custitem_tjinc_overstocked_company !== 'F') {
            fields.push('custitem_tjinc_overstocked_company');
            values.push('F');
            nlapiLogExecution('AUDIT', 'FLAGGING AS NOT OVERSTOCKED (Company)', 'Flagging ' + name + ' (' + rec_type + ',' + rec_id + ') - as NOT OVERSTOCKED!');
        }
    }

    if (isLocationOverstocked) {
        // Don't bother updating if it is ALREADY flagged as overstocked (keeps the logs clean).
        if (custitemoverstocked !== 'T') {
            fields.push('custitemoverstocked');
            values.push('T');
            nlapiLogExecution('AUDIT', 'FLAGGING AS OVERSTOCKED (Location)', 'Flagging ' + name + ' (' + rec_type + ',' + rec_id + ') - as OVERSTOCKED!');
        }
    } else {
        // Don't bother updating if it is ALREADY flagged as overstocked (keeps the logs clean).
        if (custitemoverstocked !== 'F') {
            fields.push('custitemoverstocked');
            values.push('F');
            nlapiLogExecution('AUDIT', 'FLAGGING AS NOT OVERSTOCKED (Location)', 'Flagging ' + name + ' (' + rec_type + ',' + rec_id + ') - as NOT OVERSTOCKED!');
        }
    }

    var ItemUsage = TJINC_GetItemUsage(item.getId(), 3);

    var monthsOnHand = parseFloat(0);

    if (ItemUsage.avgDemand > 0) {
        monthsOnHand = total_quantityavailable / ItemUsage.avgDemand;
        monthsOnHand = Math.round(monthsOnHand * 100) / 100;
    }else if ((ItemUsage.avgDemand == 0 || ItemUsage.avgDemand =="") && total_quantityavailable > 0 ) {   monthsOnHand = 99;     }

    fields.push('custitem_tjinc_summaryperiod');
    values.push(3);
    fields.push('custitem_tjinc_totalunitssold');
    values.push(ItemUsage.total);
    fields.push('custitem_tjinc_averagedemand');
    values.push(ItemUsage.avgDemand);
    fields.push('custitem_tjinc_averagedemandtrend');
    values.push(ItemUsage.avgDemandTrend);
    fields.push('custitem_tjinc_monthlytotals');
    values.push(JSON.stringify(ItemUsage.monthlyTotals));
    fields.push('custitem_tjinc_monthlydifferences');
    values.push(JSON.stringify(ItemUsage.monthlyDifferences));
    fields.push('custitem_tjinc_monthsonhand');
    values.push(monthsOnHand);
    nlapiSubmitField(rec_type, rec_id, fields, values);

}
