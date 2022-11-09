/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */

 define(
    ['N/record', 'N/search', 'N/format', 'N/log', 'N/runtime'],
    function (record, search, format, log, runtime) {

        var getInputData = function (context) {
            log.debug('getInputData', 'IN');
            try {
                var fixIrs = getReceipts();
                log.debug({
                    title: 'fixIrs:',
                    details: fixIrs.length + ' | ' + JSON.stringify(fixIrs)
                });
                log.debug('getInputData', 'OUT');
                return fixIrs;
            } catch (e) {
                log.error('getInputData', e);
            }
        }
        var reduce = function (context) {
            var values = JSON.parse(context.values[0]);
            var irId = values.id;
            var rfsUser = values.rfsuser;
            var locClass = values.locclass;
            var valuesObj = {};
            if (rfsUser != '') {
                valuesObj.custbody102 = rfsUser;
            }
            if (locClass != '') {
                valuesObj.class = locClass;
            }
            log.debug('valuesObj', JSON.stringify(valuesObj));
            record.submitFields({
                type: record.Type.ITEM_RECEIPT,
                id: irId,
                values: valuesObj,
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields : true
                }
            });
        }
        var summarize = function (summary) {
            log.debug('SUMMARIZE In');
            summary.reduceSummary.errors.iterator().each(function (key, value) {
                var o_error = JSON.parse(value);
                var msg = 'Key: ' + key + '. Error in line: ' + o_error.cause.lineNumber + ', error message: ' + o_error.message + '\n';
                log.debug('SUMMARIZE REDUCE ERROR', msg);
                return true;
            });
            log.debug('SUMMARIZE Out');
        }
        function getReceipts() {
            var searchId = 'customsearch7350'   //customsearch7345 all open sos search. current id is just open sos where values are off
            var salesSearch = search.load({
                type: search.Type.TRANSACTION,
                id: searchId
            });
            var allResults = getAllResults(salesSearch);
            log.debug('allResults', JSON.stringify(allResults));
            var irData = [];
            for (var i = 0; i < allResults.length; i++) {
                var tranid = allResults[i].getValue(allResults[i].columns[0]);
                // log.debug('tranid', tranid);
                var currClass = allResults[i].getValue(allResults[i].columns[3]);
                // log.debug('currClass', currClass);
                var rfsUser = allResults[i].getValue(allResults[i].columns[4]);
                // log.debug('rfsUser', rfsUser);
                var empResults = getEmployee(rfsUser);
                log.debug({
                    title: 'afterSubmit',
                    details: 'empResults: ' + empResults
                });
                if (empResults.length > 0) {
                    var empId = empResults[0];
                } else {
                    var empId = '';
                }
                var locClass = allResults[i].getValue(allResults[i].columns[5]);
                // log.debug('locClass', locClass);
                //unique list, don't need to aggregate
                if (currClass != '') {
                    locClass = '';
                }
                irData.push({
                    id: tranid,
                    rfsuser: empId,
                    locclass: locClass
                });
            }
            return irData;
        }
        function getAllResults(searchObj) {
            try {
                var searchResultsArr = new Array();
                var startCount = 0;

                do {
                    var searchResults = searchObj.run().getRange({
                        start: startCount,
                        end: startCount + 1000
                    });
                    startCount = startCount + 1000;
                    for (var i = 0; i < searchResults.length; i++) {
                        searchResultsArr.push(searchResults[i]);
                    }
                } while (searchResults.length >= 1000)
                return searchResultsArr;
            } catch (e) {
                log.error('Error in getAllResults',e)
            }
        }
        function getEmployee(rfSmartUser) {
            var empIds = [];
            var employeeSearchObj = search.create({
                type: "employee",
                filters:
                [
                   ["entityid","contains",rfSmartUser], 
                   "AND", 
                   ["isinactive","is","F"]
                ],
                columns:
                [
                   search.createColumn({name: "internalid", label: "Internal ID"}),
                   search.createColumn({name: "email", label: "Email"})
                ]
             });
             employeeSearchObj.run().each(function(result){
                // .run().each has a limit of 4,000 results
                empIds.push(result.getValue('internalid'));
                return true;
             });
             log.debug({
                title: 'getEmployee',
                details: 'empIds: ' + JSON.stringify(empIds)
            });
            return empIds;
        }
        return {
            getInputData: getInputData,
            reduce: reduce,
            summarize: summarize
        };

    });