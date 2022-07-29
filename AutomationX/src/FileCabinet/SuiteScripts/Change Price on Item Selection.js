/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/currentRecord', 'N/search', 'N/record'],
    function(currentRecord, search, record) {

        function pageInit(context) {

        }

        function postSourcing(context) {
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            var fromLocation = currentRecord.getValue({
                fieldId: 'location'
            })

            var line = context.line;
            if (sublistName === 'item' && sublistFieldName === 'item' && fromLocation) {

                var toLocation = currentRecord.getValue({
                    fieldId: 'transferlocation'
                })

                var itemID = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item'
                });

                var itype = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'itemtype'
                });

                var recordtype = '';

                switch (itype) {
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

                var locationCost = 0
                if (itemID) {

                    var recObj = record.load({
                        type: recordtype,
                        id: itemID
                    })

                    var lineCount = recObj.getLineCount({
                        sublistId: 'locations'
                    });
                    //alert("Line ------ 43")

                    for (var i = 0; i < lineCount; i++) {

                        var locationID = recObj.getSublistValue({
                            sublistId: 'locations',
                            fieldId: 'location',
                            line: i
                        });
                        if (locationID == fromLocation) {

                            locationCost = recObj.getSublistValue({
                                sublistId: 'locations',
                                fieldId: 'lastpurchasepricemli',
                                line: i
                            });
                        }

                    }

                    if (locationCost != 0) {
                        currentRecord.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'rate',
                            value: locationCost,
                            ignoreFieldChange: true
                        });
                    } else {
                        alert("Please add Transfer price manually ")
                    }

                }




            }



        }
        return {
            pageInit: pageInit,
            postSourcing: postSourcing
        };
    });