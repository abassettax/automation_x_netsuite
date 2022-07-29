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
 * @NamingStandard: TJINC_NSJ-1-2
 */

/* exported UpdateBusinessPercentage */

var RANK = {
    'Platinum' : 1,
    'Gold' : 2,
    'Silver' : 3,
    'Bronze' : 4,
    'Lead' : 5,
};

function UpdateBusinessPercentage(recType, recId) {
    'use strict';

    var businessPercent = parseFloat(0), a_filters = [], a_column = [], o_searchResults, i_custRanking, i_percentageFactor, r_totalSale = parseFloat(0);
    recId = parseInt(recId, 10);
    i_custRanking = nlapiLookupField(recType, recId, 'custentity181');
mh_percentageFactor = nlapiLookupField(recType, recId, 'custentity247'); 
    i_custRanking = i_custRanking === null || isNaN(parseInt(i_custRanking, 10)) ? null : parseInt(i_custRanking, 10);

    // Only process those records who have a valid Ranking.
    if (i_custRanking !== null) {
        // Define search filters
        a_filters.push(new nlobjSearchFilter('type', null, 'anyof', [ 'CustInvc' ]));
        a_filters.push(new nlobjSearchFilter('mainline', null, 'is', [ 'T' ]));
        a_filters.push(new nlobjSearchFilter('trandate', null, 'within', [ 'lastrollinghalf' ]));
        a_filters.push(new nlobjSearchFilter('internalidnumber', 'customermain', 'equalto', [ recId ]));
        a_filters.push(new nlobjSearchFilter('status', null, 'anyof', [ 'CustInvc:B' ]));

        // Define column
        a_column.push(new nlobjSearchColumn('total', null, 'sum'));

        // Run search
        o_searchResults = nlapiSearchRecord('invoice', null, a_filters, a_column);

        if (o_searchResults !== null && o_searchResults.length > 0) {
            r_totalSale = parseInt(o_searchResults[0].getValue(a_column[0]), 10);
            r_totalSale = isNaN(r_totalSale) ? parseFloat(0) : r_totalSale;
        }

        nlapiLogExecution('DEBUG', 'UpdateBusinessPercentage', 'Transaction Total: ' + r_totalSale.toString());

        // Set percentageFactor based on customer ranking
        i_percentageFactor = 0;

        switch (i_custRanking) {
        case RANK.Platinum:
            i_percentageFactor = parseFloat(500000);
            break;
        case RANK.Gold:
            i_percentageFactor = parseFloat(200000);
            break;
        case RANK.Silver:
            i_percentageFactor = parseFloat(100000);
            break;
        case RANK.Bronze:
            i_percentageFactor = parseFloat(50000);
            break;
        case RANK.Lead:
            i_percentageFactor = parseFloat(10000);
            break;
        }

        // Set customer business percentage field
        if (r_totalSale > 0 && parseFloat( mh_percentageFactor) > 0){
            businessPercent = Math.round((r_totalSale /(parseFloat( mh_percentageFactor) *6) ) * 100);
            nlapiSubmitField(recType, recId, 'custentity184', businessPercent);
        } else {
            nlapiSubmitField(recType, recId, 'custentity184', 0.0);
        }
        nlapiLogExecution('DEBUG', 'UpdateBusinessPercentage', '% Business: ' + businessPercent.toString());
    }
}