/* exported TJINC_SetItemClassification_Revenue, TJINC_SetItemClassification_Activity, setRevenueClassification_Scheduled, setActivityClassification_Scheduled */


//***********************************************************************
//General

function splits(a, n) {
    'use strict';
    var len = a.length, out = [], i = 0, size;
    while (i < len) {
        size = Math.ceil((len - i) / n - n - 1);
        out.push(a.slice(i, i += size));
    }
    return out;
}

function sliceTen(a, n) {
    'use strict';
 var  search = nlapiLoadSearch('item', 1542);
   var TenPercentChunch = Math.floor(search.length * .10);
  
    var len = a.length, out = [], i = 0, size;
    
    while (i < len) {

    	if ( (i + TenPercentChunch) > len || out.length === 5 ){
        	size = len - i;
        }
        else{
        	size = len;
        }

    	out.push(a.slice(i, i += size));
        
    } 
    return out;
}

function slice(a, n) {
    'use strict';
    var len = a.length, out = [], i = 0, size;
    
    while (i < len) {

    	if ( (i + n) > len || out.length === 5 ){
        	size = len - i;
        }
        else{
        	size = n;
        }

    	out.push(a.slice(i, i += size));
        
    } 
    return out;
}









//***********************************************************************
//Revenue Classification


function callRevenueClassificationScheduledScript(ids, letter, index) {
    'use strict';
    var params = {};
    params.custscript_ids = ids.join(',');
    params.custscript_letter = letter;

    nlapiScheduleScript('customscript_tjinc_setrevenueclass_sched', 'customdeploy_revenueclass_dp_' + index, params);
}

function callActivityClassificationScheduledScript(ids, letter, index) {
    'use strict';
    var params = {};
    params.custscript_ids_2 = ids.join(',');
    params.custscript_letter_2 = letter;

    nlapiScheduleScript('customscript_tjinc_setactivityclass_sche', 'customdeploy_activityclass_dp_' + index, params);
}

function TJINC_SetItemClassification_Revenue(s_type) {
    'use strict';

    var search, resultSet, ids, chunks, i;
    s_type = s_type;
    // Load the Saved Search for Item Revenue
    search = nlapiLoadSearch('item', 1542);
    resultSet = search.runSearch();
    ids = [];
    // Grab all the id and place them in the array in order
    resultSet.forEachResult(function(searchResult) {
        ids.push(searchResult.getValue(searchResult.getAllColumns()[0]));
        return true;
    });
   //var  searchcount = nlapiSearchRecord('item', 1542);
   var TenPercentChunk = Math.floor(ids.length * .10);
  
   nlapiLogExecution('AUDIT', 'TenPercentChunch', TenPercentChunk);
     
    // Split the large array into 10 chunks (each chunk represents 10%)
   chunks = slice(ids, TenPercentChunk);// chunks = slice(ids, 150);
    for (i = 0; i < chunks.length; i = i + 1) {
        switch (i) {
        case 0:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'A - 1');
            callRevenueClassificationScheduledScript(chunks[i], 1, i);
            break;

        case 1:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'B - 2');
            callRevenueClassificationScheduledScript(chunks[i], 2, i);
            break;

        case 2:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'C - 3');
            callRevenueClassificationScheduledScript(chunks[i], 3, i);
            break;

        case 3:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'D - 4');
            callRevenueClassificationScheduledScript(chunks[i], 4, i);
            break;
        case 4:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'E - 5');
            callRevenueClassificationScheduledScript(chunks[i], 5, i);
            break;

        default:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'F - 6');
            callRevenueClassificationScheduledScript(chunks[i], 6, i);
        }
    }
}



function updateRevenueClassification(type, element, letter) {
    'use strict';
    nlapiSubmitField(type, element, [ 'custitem45' ], [ letter ], false);
    nlapiLogExecution('DEBUG', 'setRevenueClassification_Scheduled', 'Updated ' + type + ' ID: ' + element + ' to Revenue Classification ' + letter);
}

function setRevenueClassification_Scheduled(s_type) {
    'use strict';
    var context, ids, letter, length, element;

    context = nlapiGetContext();
    ids = context.getSetting('SCRIPT', 'custscript_ids').split(',');
    letter = context.getSetting('SCRIPT', 'custscript_letter');

    nlapiLogExecution('AUDIT', 'setRevenueClassification_Scheduled', 'Number of IDs:' + ids.length);

    length = ids.length;
    element = null;
    nlapiLogExecution('AUDIT', 'setRevenueClassification_Scheduled', '--STARTED-- (type = ' + s_type + ')');
    for ( var i = 0; i < length; i = i + 1) {
        element = ids[i];

        // I don't know the ITEM type, so I'll unfortunately have to try catch this
        try {
            updateRevenueClassification('inventoryitem', element, letter);
        } catch (ex1) {
            try {
                updateRevenueClassification('assemblyitem', element, letter);
            } catch (ex2) {
                try {
                    updateRevenueClassification('kititem', element, letter);
                } catch (ex3) {
                    nlapiLogExecution('ERROR', 'setRevenueClassification_Scheduled', 'Element: ' + element);
                    nlapiLogExecution('ERROR', 'setRevenueClassification_Scheduled', ex3.message);
                }
            }
        }
    }
    nlapiLogExecution('AUDIT', 'setRevenueClassification_Scheduled', '--FINISHED--');
}














//***********************************************************************
//Activity Classification

function TJINC_SetItemClassification_Activity(s_type) {
    'use strict';

    var search, resultSet, ids, chunks, i;
    s_type = s_type;
    // Load the Saved Search for Item Revenue
    search = nlapiLoadSearch('item', 2519);//1523);
    resultSet = search.runSearch();
    ids = [];
    // Grab all the id and place them in the array in order
    resultSet.forEachResult(function(searchResult) {
        ids.push(searchResult.getValue(searchResult.getAllColumns()[0]));
        return true;
    });

    // Split the large array into 10 chunks (each chunk represents 10%)
  
    chunks = slice(ids, 400);
    for (i = 0; i < chunks.length; i = i + 1) {
        switch (i) {
        case 0:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'A - 1');
            callActivityClassificationScheduledScript(chunks[i], 1, i);
            break;

        case 1:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'B - 2');
            callActivityClassificationScheduledScript(chunks[i], 2, i);
            break;

        case 2:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'C - 3');
            callActivityClassificationScheduledScript(chunks[i], 3, i);
            break;

        case 3:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'D - 4');
            callActivityClassificationScheduledScript(chunks[i], 4, i);
            break;
        case 4:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'E - 5');
            callActivityClassificationScheduledScript(chunks[i], 5, i);
            break;            

        default:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'F - 6');
            callActivityClassificationScheduledScript(chunks[i], 6, i);
        }
    }
}

function updateActivityClassification(type, element, letter) {
    'use strict';

    nlapiSubmitField(type, element, [ 'custitem61' ], [ letter ], false);
    nlapiLogExecution('DEBUG', 'setActivityClassification_Scheduled', 'Updated ' + type + ' ID: ' + element + ' to Activity Classification ' + letter);

}

function setActivityClassification_Scheduled(s_type) {
    'use strict';
    var context, ids, letter, length, element;

    context = nlapiGetContext();
    ids = context.getSetting('SCRIPT', 'custscript_ids_2').split(',');
    letter = context.getSetting('SCRIPT', 'custscript_letter_2');

    nlapiLogExecution('AUDIT', 'setActivityClassification_Scheduled', 'Number of IDs:' + ids.length);

    length = ids.length;
    element = null;
    nlapiLogExecution('AUDIT', 'setActivityClassification_Scheduled', '--STARTED-- (type = ' + s_type + ')');
    for ( var i = 0; i < length; i = i + 1) {
        element = ids[i];

        // I don't know the ITEM type, so I'll unfortunately have to try catch this
        try {
            updateActivityClassification('inventoryitem', element, letter);
        } catch (ex1) {
            try {
                updateActivityClassification('assemblyitem', element, letter);
            } catch (ex2) {
                try {
                    updateActivityClassification('kititem', element, letter);
                } catch (ex3) {
                    nlapiLogExecution('ERROR', 'setActivityClassification_Scheduled', 'Element: ' + element);
                    nlapiLogExecution('ERROR', 'setActivityClassification_Scheduled', ex3.message);
                }
            }
        }
    }
    nlapiLogExecution('AUDIT', 'setActivityClassification_Scheduled', '--FINISHED--');
}













//***********************************************************************
// Spend Classification

function callSpendClassificationScheduledScript(ids, letter, index) {
    'use strict';
    var params = {};
    params.custscript_ids_3 = ids.join(',');
    params.custscript_letter_3 = letter;

    nlapiScheduleScript('customscript_tjinc_setspendclass_sche', 'customdeploy_spendclass_dp_' + index, params);
}

function TJINC_SetItemClassification_Spend(s_type) {
    'use strict';

    var search, resultSet, ids, chunks, i;
    
    // Load the Saved Search for Item Revenue
    search = nlapiLoadSearch('transaction', 1876);
    resultSet = search.runSearch();
    ids = [];
    // Grab all the id and place them in the array in order
    resultSet.forEachResult(function(searchResult) {
        ids.push(searchResult.getValue(searchResult.getAllColumns()[0]));
        return true;
    });
  
var TenPercentChunk = Math.floor(ids.length * .10);

    // Split the large array into 10 chunks (each chunk represents 10%)
    chunks = slice(ids, TenPercentChunk);
    for (i = 0; i < chunks.length; i = i + 1) {
        switch (i) {
        case 0:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'A - 1');
            callSpendClassificationScheduledScript(chunks[i], 1, i);
            break;

        case 1:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'B - 2');
            callSpendClassificationScheduledScript(chunks[i], 2, i);
            break;

        case 2:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'C - 3');
            callSpendClassificationScheduledScript(chunks[i], 3, i);
            break;

        case 3:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'D - 4');
            callSpendClassificationScheduledScript(chunks[i], 4, i);
            break;

        case 4:
            nlapiLogExecution('AUDIT', 'Assign Classification', 'E - 5');
            callSpendClassificationScheduledScript(chunks[i], 5, i);
            break;
        default: 
        	nlapiLogExecution('AUDIT', 'Assign Classification', 'F - 6');
            callSpendClassificationScheduledScript(chunks[i], 6, i);
        	
        }
    }
}

function updateSpendClassification(type, element, letter) {
    'use strict';
    
    var activityFields, override, current;
    activityFields = nlapiLookupField(type, element, [ 'custitem57', 'custitem23' ]);
    override = activityFields.custitem57 === null || isNaN(parseInt(activityFields.custitem57, 10)) ? -1 : parseInt(activityFields.custitem57, 10);
    current = activityFields.custitem23 === null || isNaN(parseInt(activityFields.custitem23, 10)) ? -1 : parseInt(activityFields.custitem23, 10);

    // If the OVERRIDE is populated and the current Classification is different, update it
    if (override > 0 && (current !== override)) {
        nlapiSubmitField(type, element, [ 'custitem23' ], [ override ], false);
        nlapiLogExecution('DEBUG', 'updateSpendClassification', 'Updated ' + type + ' ID: ' + element + ' to Activity Classification ' + override);
    } else {
        nlapiSubmitField(type, element, [ 'custitem23' ], [ letter ], false);
        nlapiLogExecution('DEBUG', 'updateSpendClassification', 'Updated ' + type + ' ID: ' + element + ' to Activity Classification ' + letter);
    }
}

function setSpendClassification_Scheduled(s_type) {
    'use strict';
    var context, ids, letter, length, element;

    context = nlapiGetContext();
    ids = context.getSetting('SCRIPT', 'custscript_ids_3').split(',');
    letter = context.getSetting('SCRIPT', 'custscript_letter_3');

    nlapiLogExecution('AUDIT', 'setSpendClassification_Scheduled', 'Number of IDs:' + ids.length);

    length = ids.length;
    element = null;
    nlapiLogExecution('AUDIT', 'setSpendClassification_Scheduled', '--STARTED-- (type = ' + s_type + ')');
    for ( var i = 0; i < length; i = i + 1) {
        element = ids[i];

        // I don't know the ITEM type, so I'll unfortunately have to try catch this
        try {
        	updateSpendClassification('inventoryitem', element, letter);
        } catch (ex1) {
            try {
            	updateSpendClassification('assemblyitem', element, letter);
            } catch (ex2) {
                try {
                	updateSpendClassification('kititem', element, letter);
                } catch (ex3) {
                    nlapiLogExecution('ERROR', 'updateSpendClassification', 'Element: ' + element);
                    nlapiLogExecution('ERROR', 'updateSpendClassification', ex3.message);
                }
            }
        }
    }
    nlapiLogExecution('AUDIT', 'updateSpendClassification', '--FINISHED--');
}