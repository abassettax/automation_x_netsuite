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
              var openSales = getSales();
              log.debug({
                  title: 'openSales:',
                  details: openSales.length + ' | ' + JSON.stringify(openSales)
              });
              log.debug('getInputData', 'OUT');
              return openSales;
          } catch (e) {
              log.error('getInputData', e);
          }
      }
      var reduce = function (context) {
          var values = JSON.parse(context.values[0]);
          var cusrec = values.cusrec;
          var qtrsaleschange = values.qtrsaleschange;
          var rollinghalf = values.rollinghalf;
          var rollingqtr = values.rollingqtr;
          var prevrollingqtr = values.prevrollingqtr;
          var samerollingqtrLY = values.samerollingqtrLY;
          if (cusrec) {
            record.submitFields({
              type: record.Type.CUSTOMER,
              id: cusrec,
              values: {
                custentity257: qtrsaleschange,
                custentity258: rollinghalf,
                custentity264: rollingqtr,
                custentity263: prevrollingqtr,
                custentity262: samerollingqtrLY,
              },
              options: {
                  enableSourcing: false,
                  ignoreMandatoryFields : true
              }
            });
          }
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
      function getSales() {
          var searchId = 'customsearch7427'   //customsearch7427 ax qtr sales
          var salesSearch = search.load({
              type: search.Type.TRANSACTION,
              id: searchId
          });
          var allResults = getAllResults(salesSearch);
          log.debug('allResults', JSON.stringify(allResults));
          var soData = [];
          for (var i = 0; i < allResults.length; i++) {
              var cusrec = allResults[i].getValue(allResults[i].columns[4]);
              var qtrsaleschange = allResults[i].getValue(allResults[i].columns[0]);
              var rollinghalf = allResults[i].getValue(allResults[i].columns[5]);
              var rollingqtr = allResults[i].getValue(allResults[i].columns[1]);
              var prevrollingqtr = allResults[i].getValue(allResults[i].columns[2]);
              var samerollingqtrLY = allResults[i].getValue(allResults[i].columns[3]);
              //unique list, don't need to aggregate
              soData.push({
                cusrec: cusrec,
                qtrsaleschange: qtrsaleschange,
                rollinghalf: rollinghalf,
                rollingqtr: rollingqtr,
                prevrollingqtr: prevrollingqtr,
                samerollingqtrLY: samerollingqtrLY
              });
          }
          return soData;
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
      return {
          getInputData: getInputData,
          reduce: reduce,
          summarize: summarize
      };

  });