/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */

/*
* Copyright (c) [year] Trajectory Inc. 
* 250 The Esplanade, Suite 402, Toronto, ON, Canada, M5A 1J2 
* www.trajectoryinc.com 
* All Rights Reserved. 
*/

/* 
* @System: Automation X
* @Module: [Name of the module which is part this class, and the url for the documentation]
* @Version: 1.0.0
* @Company: Trajectory Inc.
* @CreationDate: 20211001
* @FileName: TJINC_ATXNAI_MR_TotalCost.js 
* @NamingStandard: TJINC_NSJ-2-0-1 
*/


define(
    ['N/runtime', 'N/record', 'N/search', 'N/task', 'N/email',
        '/SuiteBundles/Bundle 310544/TJINC_NS_Library_SS21.js'],
    function (runtime, record, search, task, email, tj) {

        var getInputData = function () {
            log.debug('getInputData', 'IN');

            var s_assemblyID = '',
                o_resultsNew = {};
            const o_searchAvgCost = search.createColumn({
                name: "averagecost",
                join: "memberItem",
                label: "Average Cost"
            });
            try {
                const o_searchPurchCost = search.createColumn({
                    name: "cost",
                    join: "memberItem",
                    label: "Purchase Price"
                });
                var o_search = tj.searchAll({
                    'search': search.create({
                        type: "assemblyitem",
                        filters:
                            [
                                ["type", "anyof", "Assembly"],
                                "AND",
                                ["isinactive", "is", "F"],
                                "AND",
                                ["internalid", "anyof", "8919"],
                            ],
                        columns:
                            [
                                "itemid",
                                "custitem_tjinc_marginpercnt",
                                "memberitem",
                                o_searchAvgCost,
                                o_searchPurchCost
                            ]
                    })
                });
                if (o_search) {
                    for (var i = 0; i < o_search.length; i++) {
                        s_assemblyID = o_search[i].id;

                        if (o_resultsNew[s_assemblyID] === undefined) {
                            o_resultsNew[s_assemblyID] = {
                                a_itemMembers: []
                            };
                        }
                        o_resultsNew[s_assemblyID].a_itemMembers.push({
                            assemblyItem: o_search[i].getValue('itemid'),
                            memberItem: o_search[i].getValue('memberitem'),
                            avgCost: o_search[i].getValue(o_searchAvgCost),
                            purchaseCost: o_search[i].getValue(o_searchPurchCost)
                        })
                    }
                }

            } catch (e) {
                log.error('getInputData', e);
            }
            log.debug('getInputData', 'OUT');
            return o_resultsNew;
        }

        var reduce = function (context) {
            log.debug('REDUCE', 'context: ' + JSON.stringify(context));
            //the context key contains the transaction internal id
            var s_key = context.key;
            //Netsuite encapsulates the values in an array, getting the first position we get the value object
            var o_values = JSON.parse(context.values[0]);
            log.debug('REDUCE', 's_key: ' + s_key + ', o_values: ' + JSON.stringify(o_values));

            tjincATXNAI_setTotalValue(s_key, o_values);
        }

        function tjincATXNAI_setTotalValue(s_internalId, o_applyTransactions) {
            log.debug('tjincXXXNXX_setTotalValue', 'In');
            try {
                var s_temporalMemberId = '',
                    s_temporalMemberQty = '',
                    s_temporalTtal = '',
                    s_tjincValue = '',
                    s_totalValueMargin = '',
                    s_itemTotalValue = 0,
                    nsr_assemblyItem = record.load({ type: record.Type.ASSEMBLY_ITEM.toLowerCase(), id: s_internalId, isDynamic: false });

                s_tjincValue = nsr_assemblyItem.getValue({ fieldId: 'custitem_tjinc_marginpercnt' });
                log.debug('ID ASSEMBLY ITEM', s_internalId);

                for (var i = 0; i < o_applyTransactions.a_itemMembers.length; i++) {
                    for (var j = 0; j < nsr_assemblyItem.getLineCount({ sublistId: 'member' }); j++) {
                        s_temporalMemberId = nsr_assemblyItem.getSublistValue({ sublistId: 'member', fieldId: 'item', line: j });
                        s_temporalMemberQty = nsr_assemblyItem.getSublistValue({ sublistId: 'member', fieldId: 'quantity', line: j });
                        if (o_applyTransactions.a_itemMembers[i].memberItem === s_temporalMemberId) {
                            if (o_applyTransactions.a_itemMembers[i].avgCost.length > 0) {
                                s_temporalTtal = parseFloat(o_applyTransactions.a_itemMembers[i].avgCost).toFixed(2) * parseFloat(s_temporalMemberQty);
                            } else if (o_applyTransactions.a_itemMembers[i].purchaseCost.length > 0) {
                                s_temporalTtal = parseFloat(o_applyTransactions.a_itemMembers[i].purchaseCost).toFixed(2) * parseFloat(s_temporalMemberQty);
                            } else {
                                continue;
                            }
                            log.debug('COST', s_temporalTtal);
                            log.debug('Adding', 'this: ' + s_temporalTtal + ' to the total: ' + s_itemTotalValue);
                            s_itemTotalValue += s_temporalTtal;
                            log.debug('Total at moment', s_itemTotalValue);
                        }
                    }
                }
                if (s_tjincValue) {
                    s_totalValueMargin = parseFloat(s_itemTotalValue + (s_itemTotalValue * (s_tjincValue / 100)));
                } else {
                    s_totalValueMargin = parseFloat(s_itemTotalValue);
                }

                s_totalValueMargin = s_totalValueMargin.toFixed(2);
                log.debug('Total', s_itemTotalValue);
                log.debug('Total with Margin', s_totalValueMargin);
                for (var k = 0; k < nsr_assemblyItem.getLineCount({ sublistId: 'price' }); k++) {
                    if (nsr_assemblyItem.getSublistValue({ sublistId: 'price', fieldId: 'pricelevelname', line: k }) === 'Base Price') {
                        nsr_assemblyItem.setSublistValue({ sublistId: 'price', fieldId: 'price_1_', line: k, value: s_totalValueMargin });
                        break;
                    }
                }

                nsr_assemblyItem.setValue({ fieldId: 'custitem_tjinc_totalvalue', value: s_itemTotalValue.toFixed(2), ignoreFieldChange: false });
                nsr_assemblyItem.save({ enableSourcing: false, ignoreMandatoryFields: true });

            } catch (e) {
                log.error('tjincATXNAI_setTotalValue', e);
            }
            log.debug('tjincATXNAI_setTotalValue', 'Out');
        }

        var summarize = function (summary) {
            //log.debug('SUMMARIZE In');
            // if (i_count >= 5000) {
            //     tjincXXXNXX_recallScript();
            // } else {
            //     log.debug('SUMMARIZE OUT', 'Process end');
            // }

            summary.reduceSummary.errors.iterator().each(function (key, value) {
                var o_error = JSON.parse(value);
                var msg = 'Key: ' + key + '. Error in line: ' + o_error.cause.lineNumber + ', error message: ' + o_error.message + '\n';
                log.debug('SUMMARIZE REDUCE ERROR', msg);
                return true;
            });

            tjincATXNAI_sendItemValueEmail();
            tjincATXNAI_sendComponenNoValueEmail();

            log.debug('SUMMARIZE Out');
        }

        function tjincATXNAI_sendItemValueEmail() {
            log.debug('tjincATXNAI_sendItemValueEmail IN');
            var s_author = 44050, //Testing author
                i_searchID = 6777, // Search Assemblies' components no avgcost/prchprice
                s_searchLink = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=6777&whence=',
                s_recipient = ['alex.schultejann@automation-x.com'],
                s_subject = '',
                s_body = '';

                try{
                    search.load({ id: i_searchID, type: 'assemblyitem' });
                    
                    s_subject = 'Base Price Automation results';
                    s_body = 'Dear User,<br /><br />The following is a link of the results of a search for all the changes in the base price of the Assembly Items in the last 24 hrs:<br /><br />' + s_searchLink;
        
    
                    email.send({
                        author: s_author,
                        recipients: s_recipient,
                        subject: s_subject,
                        body: s_body
                    });
                log.debug('tjincATXNAI_sendItemValueEmail OUT');
            } catch (e){
                log.error('tjincATXNAI_sendItemValueEmail', e);
            }
        }

        function tjincATXNAI_sendComponenNoValueEmail() {
            log.debug('tjincATXNAI_sendComponenNoValueEmail IN');
            var s_author = 44050, //Testing author
                i_searchID = 6776, // Search Assemblies' components no avgcost/prchprice
                s_searchLink = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=6776&whence=',
                s_recipient = ['alex.schultejann@automation-x.com'],
                s_subject = '',
                s_body = '';

                try{
                    search.load({ id: i_searchID, type: 'assemblyitem' });
                    
                    s_subject = 'Assemblies components no avgcost/prchprice';
                    s_body = 'Dear User,<br /><br />The following is a link of the results of a search for all the Assembly components with no values set for avgcost/prchprice in the last 24 hrs:<br /><br />' + s_searchLink;
        
    
                    email.send({
                        author: s_author,
                        recipients: s_recipient,
                        subject: s_subject,
                        body: s_body
                    });
                    log.debug('tjincATXNAI_sendComponenNoValueEmail OUT');
                }catch (e){
                    log.error('tjincATXNAI_sendComponenNoValueEmail', e);
                }
        }
        // function tjincXXXNXX_recallScript() {
        //     //log.debug('tjincXXXNXX_recallScript - In');

        //     var o_scriptTask = {},
        //         o_params = {};

        //     o_params.custscript_tjinc_xxxnxx_example = i_example;

        //     o_scriptTask = task.create({
        //         taskType: task.TaskType.MAP_REDUCE
        //     });
        //     o_scriptTask.scriptId = o_scriptObj.id;
        //     o_scriptTask.deploymentId = o_scriptObj.deploymentId;
        //     o_scriptTask.params = o_params;
        //     o_scriptTask.submit();

        //     //log.debug('tjincXXXNXX_recallScript', 'Units remaining: ' + o_scriptObj.getRemainingUsage());
        // }

        return {
            getInputData: getInputData,
            reduce: reduce,
            summarize: summarize
        };

    });