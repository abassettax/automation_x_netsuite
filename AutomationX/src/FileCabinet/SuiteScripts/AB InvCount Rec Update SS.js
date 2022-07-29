/**THIS IS  AN UNFINISHED SCRIPT TO MEANT TO SAVE INVOICES TO A FILE IN MASS.  
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/record'],
function (record) { 
    function execute(context) {
		var recIds = [1653553,2023789,2592110,3638090,4442186,4493546,4500197,4652475,4652599,4653606,4733715,4775222,4805742,5186351,5275966,5276468,5276851,5278053,5278061,5284176,5285492,5288871,5288893,5288931,5290729,5297292,5298152,5305435,5306832,5307858,5309386,5309753,5309756,5309768,5309977,5310004,5310016,5310071,5310091,5310101,5310108,5310336,5310342,5310344,5310486,5311015,5311059];
        var createdByArr = [4097,4358,34821,36796,32995,43616,11360,43604,43604,43616,43616,23116,43603,45676,24852,24852,24852,24852,24852,45736,45874,44168,44843,44843,44168,45736,45874,15909,45874,45874,44843,45874,45736,45874,45189,45189,45189,45189,45736,45189,45189,45189,45189,45189,15909,44843,48249]
        for (var i = 0; i < recIds.length; i++) {
            var recId = recIds[i];
            var createdBy = createdByArr[i];
            if (recId == 5311059) {
                record.submitFields({
                    type: record.Type.INVENTORY_COUNT,
                    id: recId,
                    values: {
                        custbody_ax_invcount_owner: '',
                    }
                });
            } else {
                record.submitFields({
                    type: record.Type.INVENTORY_COUNT,
                    id: recId,
                    values: {
                        custbody_ax_invcount_owner: createdBy,
                        custbody_ax_invcount_app: 3263
                    }
                });
            }
        }
    }
    return {
        execute: execute
    };
});