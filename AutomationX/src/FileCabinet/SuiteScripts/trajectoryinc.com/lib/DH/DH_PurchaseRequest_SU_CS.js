/**
 * Module Description...
 *
 * @file DH_PurchaseRequest_SU_CS.js
 * @copyright 2018 Darren Hill Consulting Inc.
 * @author Darren Hill darren@darrenhillconsulting.ca
 *
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType ClientScript
 */
 define(["require", "exports", "N/ui/message", "./DH_Library"], function (require, exports, message, DH_Library_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pageInit = function (context) {
        var screenHeight = screen.height - 400;
        var filterLocation = getParameterFromURL('locationFilter');
        if (filterLocation) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_filterlocationid',
                value: filterLocation,
                ignoreFieldChange: true
            });
        }
      
       var filternormallystocked = getParameterFromURL('normallystocked');
              if (filternormallystocked) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_nonstockonly',
                value: filternormallystocked,
                ignoreFieldChange: true
            });
        }

        var filterPrType = getParameterFromURL('prType');
              if (filterPrType) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_prtype',
                value: filterPrType,
                ignoreFieldChange: true
            });
        } else {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_prtype',
                value: '1',
                ignoreFieldChange: true
            });
        }

        var filterPurchMethod = getParameterFromURL('purchMethod');
              if (filterPurchMethod) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_purchmethod',
                value: filterPurchMethod,
                ignoreFieldChange: true
            });
        // } else {
        //     var currentRecord = context.currentRecord;
        //     currentRecord.setValue({
        //         fieldId: 'custpage_purchmethod',
        //         value: '1',
        //         ignoreFieldChange: true
        //     });
        }
        var filterax5code = getParameterFromURL('ax5code');
              if (filterax5code) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_ax5code',
                value: filterax5code,
                ignoreFieldChange: true
            });
        }
      
        if (screenHeight < 400) {
            screenHeight = 400;
        }
        document.getElementById('custpagesublist_splits').parentElement.style.overflow = 'auto';
        // document.getElementById('custpagesublist_splits').parentElement.style.height = screenHeight + 'px';
        document.getElementById('custpagesublist_splits').parentElement.addEventListener('scroll', function () {
            var translate = 'translate(0,' + this.scrollTop + 'px)';
            var allTh = document.querySelectorAll('tr#custpagesublist_headerrow.uir-machine-headerrow');
            for (var i = 0; i < allTh.length; i++) {
                // noinspection TypeScriptUnresolvedletiable
                // @ts-ignore
                allTh[i].style.transform = translate;
            }
        });
    };
    exports.fieldChanged = function (context) {
        var currentRecord = context.currentRecord, FieldName = context.fieldId;
        if (FieldName === 'custpage_filterlocationid'  || FieldName === 'custpage_nonstockonly' || FieldName === 'custpage_prtype' || FieldName === 'custpage_purchmethod' || FieldName === 'custpage_ax5code') {
            var location_1 = currentRecord.getValue('custpage_filterlocationid');
            var normallystocked = currentRecord.getValue('custpage_nonstockonly');
            var prType = currentRecord.getValue('custpage_prtype');
            var purchMethod = currentRecord.getValue('custpage_purchmethod');
            var ax5code = currentRecord.getValue('custpage_ax5code');
            window.onbeforeunload = null;
            window.open('https://422523.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2234&deploy=1&compid=422523' + '&locationFilter=' + location_1 + '&normallystocked=' + normallystocked + '&prType=' + prType + '&purchMethod=' + purchMethod + '&ax5code=' + ax5code, '_self');
            return true;
        }
      
    };
    exports.saveRecord = function (context) {
        var currentRecord = context.currentRecord;
        var lineCount = currentRecord.getLineCount({
            sublistId: 'custpagesublist'
        });
        var failedLine;
        var zeroLines = true;
        var emptyStatus = false;
        var toNoRate = false;
        var zeroQtys = false;
        // var typesArray = [];
        var methodsArray = [];
        for (var i = 0; i < lineCount; i++) {
            var processLine = currentRecord.getSublistValue({
                sublistId: 'custpagesublist',
                fieldId: 'process',
                line: i
            });
            if (processLine == true) {
                zeroLines = false;
                var status = currentRecord.getSublistValue({
                    sublistId: 'custpagesublist',
                    fieldId: 'status',
                    line: i
                });
                var rate = currentRecord.getSublistValue({
                    sublistId: 'custpagesublist',
                    fieldId: 'rate',
                    line: i
                });
                var qty = currentRecord.getSublistValue({
                    sublistId: 'custpagesublist',
                    fieldId: 'qty',
                    line: i
                });
                if (qty == 0) {
                    zeroQtys = true;
                    failedLine = (i+1);
                    break;
                }
                if (status == '') {
                    emptyStatus = true;
                    failedLine = (i+1);
                    break;
                } else if (status == '2' && (rate == '' || rate == null || rate == undefined)) {
                    toNoRate = true;
                    failedLine = (i+1);
                    break;
                }
                // var prType = currentRecord.getSublistValue({
                //     sublistId: 'custpagesublist',
                //     fieldId: 'prtype',
                //     line: i
                // });
                // if (typesArray.indexOf(prType) == -1) {
                //     typesArray.push(prType);
                // }
                var purchMethod = currentRecord.getSublistValue({
                    sublistId: 'custpagesublist',
                    fieldId: 'purchmethod',
                    line: i
                });
                if (purchMethod == '') {
                    purchMethod = '1';  //if blank, treat as Email
                }
                if (methodsArray.indexOf(purchMethod) == -1) {
                    methodsArray.push(purchMethod);
                }
            }
        }
        if (zeroLines) {
            var myMsg = message.create({
                title: 'NO SELECTION',
                message: 'None of the purchase requests were selected to process. Please select at least one and fill in the required fields before submitting.',
                type: message.Type.ERROR
            });
            myMsg.show({
                duration: 10000 // will disappear after 5s
            });
            return false;
        } else if (zeroQtys) {
            var myMsg = message.create({
                title: 'NO QTY SET ON LINE ' + failedLine,
                message: 'At least one of the requests you selected does not have a quantity set. Please select a quantity greater than zero before submitting.',
                type: message.Type.ERROR
            });
            myMsg.show({
                duration: 10000 // will disappear after 5s
            });
            return false;
        } else if (emptyStatus) {
            var myMsg = message.create({
                title: 'NO ACTION ON LINE ' + failedLine,
                message: 'At least one of the requests you selected does not have an Action set. Please fill in the required fields before submitting.',
                type: message.Type.ERROR
            });
            myMsg.show({
                duration: 10000 // will disappear after 5s
            });
            return false;
        } else if (toNoRate) {
            var myMsg = message.create({
                title: 'NO RATE FOR TRANSFER ON LINE ' + failedLine,
                message: 'At least one of the requests you selected is a Transfer Order that does not have a Rate set. Please fill in the required fields before submitting.',
                type: message.Type.ERROR
            });
            myMsg.show({
                duration: 10000 // will disappear after 5s
            });
            return false;
        // } else if (typesArray.length > 1) {
        //     var myMsg = message.create({
        //         title: 'MULTIPLE PR TYPES',
        //         message: 'The requests you selected are across multiple purchase request types. Please select requests of a single type before submitting.',
        //         type: message.Type.ERROR
        //     });
        //     myMsg.show({
        //         duration: 10000 // will disappear after 5s
        //     });
        //     return false;
        } else if (methodsArray.length > 1) {
            var myMsg = message.create({
                title: 'MULTIPLE PURCH METHODS',
                message: 'The requests you selected are across multiple purchase methods. Please select requests of a single purchase method before submitting.',
                type: message.Type.ERROR
            });
            myMsg.show({
                duration: 10000 // will disappear after 5s
            });
            return false;
        } else {
            return true;
        }
    };
    var getParameterFromURL = function (param) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0] === param) {
                return decodeURIComponent(pair[1]);
            }
        }
        return (false);
    };
    exports.clearalllines = function () {
        var url =  document.URL;
          window.location.href = url + '&clearAll=T';
      };
    exports.reset = function () {
        window.open('https://422523.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2234&deploy=1&compid=422523', '_self');
        return true;
    };
    // exports.gethist = function (type) {
    //     var uid = window.nlapiGetCurrentLineItemValue('custpagesublist', 'itemid');
    //     var cust = window.nlapiGetCurrentLineItemValue('custpagesublist', 'customer');
    //     if (uid === '' || cust === '') {
    //         alert('Please select a line and make sure you have added a customer to view this customers purchasing history.');
    //         return true;
    //     }
    //     if (type === 'item' && (uid === '' || cust === ''))
    //         return true;
    //     var custhistcolumns = [], searchlength = 20, custname = '', ItemName = '';
    //     custhistcolumns[0] = new window.nlobjSearchColumn('trandate', null, 'GROUP').setSort(true);
    //     custhistcolumns[1] = new window.nlobjSearchColumn('item', null, 'GROUP');
    //     custhistcolumns[2] = new window.nlobjSearchColumn('tranid', null, 'GROUP');
    //     custhistcolumns[3] = new window.nlobjSearchColumn('rate', null, 'GROUP');
    //     custhistcolumns[4] = new window.nlobjSearchColumn('baseprice', 'item', 'GROUP');
    //     custhistcolumns[5] = new window.nlobjSearchColumn('pricelevel', null, 'GROUP');
    //     custhistcolumns[6] = new window.nlobjSearchColumn('internalid', null, 'GROUP');
    //     custhistcolumns[7] = new window.nlobjSearchColumn('type', null, 'GROUP');
    //     custhistcolumns[8] = new window.nlobjSearchColumn('entity', null, 'GROUP');
    //     var custhisttransactionSearch = window.nlapiSearchRecord('transaction', null, [
    //         ['type', 'anyof', 'CustInvc', 'Estimate', 'SalesOrd', 'CashSale'],
    //         'AND',
    //         ['status', 'anyof', 'Estimate:C', 'SalesOrd:A', 'SalesOrd:B', 'Estimate:X', 'SalesOrd:D', 'SalesOrd:E', 'SalesOrd:F', 'CashSale:A', 'CashSale:B', 'CashSale:C', 'CustInvc:A', 'CustInvc:B', 'Estimate:A'],
    //         'AND',
    //         ['mainline', 'is', 'F'],
    //         'AND',
    //         ['quantity', 'greaterthan', '0'],
    //         'AND',
    //         ['amount', 'greaterthan', '0.00'],
    //         'AND',
    //         ['taxline', 'is', 'F'],
    //         'AND',
    //         ['shipping', 'is', 'F'],
    //         'AND',
    //         ['trandate', 'onorafter', 'daysago1000'],
    //         'AND',
    //         ['name', 'anyof', cust],
    //         'AND',
    //         ['item.internalidnumber', 'equalto', uid]
    //     ], custhistcolumns);
    //     if (custhisttransactionSearch != null) {
    //         ItemName = custhisttransactionSearch[0].getText(custhistcolumns[1]);
    //         custname = custhisttransactionSearch[0].getText(custhistcolumns[8]);
    //     }
    //     var customerhistoryN = '<table><tr><th style="padding-right: 12px;"> Date </th><th style="padding-right: 20px;">Type</th><th style="padding-right: 12px;">Document #</th><th style="padding-right: 12px;">Item Rate</th><th style="padding-right: 12px;"> Base Price</th><th style="padding-right: 20px;">Price Level</th></tr>';
    //     if (!custhisttransactionSearch) {
    //         customerhistoryN += '<TR><TD> NO RESULTS FOUND <TD></TR>';
    //     }
    //     else if (custhisttransactionSearch.length > 20) {
    //         searchlength = 20;
    //     }
    //     else {
    //         searchlength = custhisttransactionSearch.length;
    //     }
    //     for (var k = 0; custhisttransactionSearch != null && k < searchlength; k++) {
    //         if (k % 2 === 0) {
    //             customerhistoryN += '<tr>';
    //         }
    //         else {
    //             customerhistoryN += '<tr style=" background-color: #f2f4f7 ">'; // #f2f3f4
    //         }
    //         var tranDate = custhisttransactionSearch[k].getValue(custhistcolumns[0]);
    //         var doctypes = custhisttransactionSearch[k].getText(custhistcolumns[7]);
    //         var docnumber = custhisttransactionSearch[k].getValue(custhistcolumns[2]);
    //         var itemrate = custhisttransactionSearch[k].getValue(custhistcolumns[3]);
    //         var Baseprice = custhisttransactionSearch[k].getValue(custhistcolumns[4]);
    //         var pricelevel = custhisttransactionSearch[k].getText(custhistcolumns[5]);
    //         var docinternalid = custhisttransactionSearch[k].getText(custhistcolumns[6]);
    //         var urltype = '';
    //         if (doctypes === 'Sales Order') {
    //             urltype = 'salesord';
    //         }
    //         else if (doctypes === 'Invoice') {
    //             urltype = 'custinvc';
    //         }
    //         else if (doctypes === 'Quote') {
    //             urltype = 'estimate';
    //         }
    //         else {
    //             urltype = 'cashsale';
    //         }
    //         var response = 'https://422523.app.netsuite.com/app/accounting/transactions/' + urltype + '.nl?id=' + docinternalid;
    //         var hreflink = '<a href="' + response + '">' + docnumber + '</a>';
    //         customerhistoryN += '<td style="padding:0px 10px;">' + tranDate + '</td><td style="padding:0px 10px;">' + doctypes + '</td><td style="padding:0px 10px;">' + hreflink + '</td><td style="padding:0px 10px;">$' + itemrate + '</td><td style="padding:0px 10px;">$' + Baseprice + '</td><td style="padding:0px 10px;">' + pricelevel + '</td></tr>';
    //         // <td style=\"padding:0px 10px;\">"+ newdoct + "</td>
    //     }
    //     customerhistoryN += '</table></br></br>';
    //     //////////////////////////////////////////////////////////////////////
    //     var customerhistory = '<div> <b>Customer Purchasing History</B></div> <div style="overflow:hidden; "><iframe style="border: 0px none;  height:100%; margin-top: -250px; width:100%;  " src="https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_NAME=' + cust + '&IT_Item_INTERNALID=' + uid + '&sortcol=Transaction_TRANDATE_raw&sortdir=DESC&csv=HTML&OfficeXML=F&style=GRID&report=&grid=T&searchid=390"></iframe></div>';
    //     var allpricingcolums = [];
    //     allpricingcolums[0] = new window.nlobjSearchColumn(DH_Library_1.FIELDS.TRANSACTION.COLUMN.AX5Code, null, 'GROUP');
    //     allpricingcolums[1] = new window.nlobjSearchColumn('rate', null, 'GROUP');
    //     allpricingcolums[2] = new window.nlobjSearchColumn('item', null, 'GROUP');
    //     allpricingcolums[3] = new window.nlobjSearchColumn('pricelevel', null, 'GROUP');
    //     allpricingcolums[4] = new window.nlobjSearchColumn('tranid', null, 'COUNT').setSort(true);
    //     var AllpricingSearch = window.nlapiSearchRecord('transaction', null, [
    //         ['type', 'anyof', 'Estimate', 'SalesOrd', 'CashSale'],
    //         'AND',
    //         ['mainline', 'is', 'F'],
    //         'AND',
    //         ['quantity', 'greaterthan', '0'],
    //         'AND',
    //         ['amount', 'greaterthan', '0.00'],
    //         'AND',
    //         ['taxline', 'is', 'F'],
    //         'AND',
    //         ['shipping', 'is', 'F'],
    //         'AND',
    //         ['trandate', 'within', 'lastrollingquarter'],
    //         'AND',
    //         ['name', 'anyof', cust]
    //     ], allpricingcolums);
    //     var content = '<table><tr><th> &nbsp; &nbsp;5 Code &nbsp; &nbsp;</th><th>Item</th><th>Price Level</th><th>Unit Price</th></tr>';
    //     for (var i = 0; AllpricingSearch != null && i < AllpricingSearch.length; i++) {
    //         if (i % 2 === 0) {
    //             content += '<tr>';
    //         }
    //         else {
    //             content += '<tr style=" background-color: #f2f4f7 ">'; // #f2f3f4
    //         }
    //         var fivecode = AllpricingSearch[i].getValue(allpricingcolums[0]);
    //         var price = AllpricingSearch[i].getValue(allpricingcolums[1]);
    //         var itemname = AllpricingSearch[i].getText(allpricingcolums[2]);
    //         var pricelevels = AllpricingSearch[i].getText(allpricingcolums[3]);
    //         content += '<td style="padding-right: 12px;">' + fivecode + '</td><td style="padding-right: 12px;">' + itemname + '</td><td style="padding-right: 12px;">' + pricelevels + '</td><td style="padding-right: 12px;">$' + price + '</td></tr>';
    //     }
    //     content += '</table></br></br>';
    //     //////////////////////////////////////////////////////////////////////
    //     var w = screen.width - 100;
    //     var h = screen.height - 100;
    //     var custitemhistory = '';
    //     var newfilter = new window.nlobjSearchFilter('internalid', 'item', 'anyof', uid);
    //     var salesorderSearch = window.nlapiSearchRecord('transaction', '2479', newfilter);
    //     var contentmargin = '<table><tr><th style="padding-right: 12px;">Business Unit</th><th style="padding-right: 19px;">Maximum Margin</th><th style="padding-right: 19px;">Average Margin</th><th style="padding-right: 19px;">  Minimum Margin</th></tr>';
    //     for (var i = 0; salesorderSearch != null && i < salesorderSearch.length; i++) {
    //         if (i % 2 === 0) {
    //             contentmargin += '<tr>';
    //         }
    //         else {
    //             contentmargin += '<tr style=" background-color: #f2f4f7 ">'; // #f2f3f4
    //         }
    //         var salesorderSearchs = salesorderSearch[i];
    //         var sellingmargincolums = salesorderSearchs.getAllColumns();
    //         var bu = salesorderSearchs.getValue(sellingmargincolums[0]);
    //         var minM = salesorderSearchs.getValue(sellingmargincolums[3]);
    //         var avgM = salesorderSearchs.getValue(sellingmargincolums[2]);
    //         var maxM = salesorderSearchs.getValue(sellingmargincolums[1]);
    //         custitemhistory = '<div style="overflow:hidden; "><iframe style="border: 0px none;  height:100%; margin-top: -200px; width:100%;  " src="https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&CU_Entity_INTERNALID=' + cust + '&searchid=758"></iframe></div>';
    //         contentmargin += '<td style="padding-right: 19px;">' + bu + '</td><td>' + maxM + '</td><td>' + avgM + '</td><td>' + minM + '</td></tr>';
    //     }
    //     contentmargin += '</table></br></br>';
    //     ///////////////////////////////////////////////////////////////////////////////////////////////
    //     var docwrite = '<div></div>';
    //     var win = window.open(docwrite, '_blank', 'dependent = yes, height=' + h + ', width=' + w + ', top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes');
    //     if (win == null) {
    //         alert('Your Browsers Popup Blocker has blocked this window.  Please allow Popups from Netsuite. ');
    //         return true;
    //     }
    //     win.document.write('<div><b>History For: ' + custname + '  ---  Item: ' + ItemName + '</b></br></div><div style=" width:100%;  ">' + customerhistoryN + '</div>  <div><b>AX Margin Summary</b></br></div><div style=" width:100%;  ">' + contentmargin + '</div>   <div><b>Customer Item History</b></br></div><div >' + custitemhistory + '</div>'); // + content +'</div>');
    //     return true;
    // };
    // exports.openitem = function () {
    //     var uid = parseInt(window.nlapiGetCurrentLineItemValue('custpagesublist', 'itemid'));
    //     if (!uid) {
    //         alert('Please select an item');
    //         return true;
    //     }
    //     if (uid) {
    //         window.open('https://422523.app.netsuite.com/app/common/item/item.nl?id=' + uid + '&e=T  ', '_blank');
    //         return true;
    //     }
    // };
    // exports.openrequest = function () {
    //     var srID = window.nlapiGetCurrentLineItemValue('custpagesublist', 'id');
    //     if (!srID) {
    //         alert('Please select an item');
    //         return true;
    //     }
    //     if (srID) {
    //         window.open('https://422523.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=463&id=' + srID +'&whence=&e=T', '_blank');
    //         return true;
    //     }
    // };
    // exports.tranHistory = function () {
    //     var uid = window.nlapiGetCurrentLineItemValue('custpagesublist', 'itemid');
    //     var lineloc = window.nlapiGetCurrentLineItemValue('custpagesublist', 'locationid');
    //     var cust = window.nlapiGetCurrentLineItemValue('custpagesublist', 'customer');
    //     var sloc = 'ALL';
    //     if (lineloc) {
    //         sloc = lineloc;
    //     }
    //     if (!uid && !lineloc) {
    //         alert('Please select a line to check inventory.');
    //         return true;
    //     }
    //     if (uid === '')
    //         return true;
    //     var w = screen.width - 50;
    //     var h = screen.height - 50;
    //     window.open('https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_LOCATION=' + sloc + '&IT_Item_INTERNALID=' + uid + '&searchid=4847&whence=', 'newwin', 'dependent = yes, height=' + h + ', width=' + w + ', top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no');
    //     return true;
    // };
    // exports.getinv = function (type) {
    //     var uid = window.nlapiGetCurrentLineItemValue('custpagesublist', 'itemid');
    //     if (uid === '') {
    //         alert('Please select a line to check inventory.');
    //         return true;
    //     }
    //     if (type === 'item' && uid === '')
    //         return true;
    //     var invoiceSearch = window.nlapiSearchRecord('invoice', null, [
    //         ['type', 'anyof', 'CustInvc'],
    //         'AND',
    //         ['mainline', 'is', 'F'],
    //         'AND',
    //         ['item.internalidnumber', 'equalto', uid],
    //         'AND',
    //         ['trandate', 'within', 'daysago90', 'daysago0']
    //     ], [
    //         new window.nlobjSearchColumn('tranid', null, null)
    //     ]);
    //     var w = screen.width - 50;
    //     if (!invoiceSearch) {
    //         window.open('https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INTERNALID=' + uid + '&style=NORMAL&report=&grid=&searchid=3995&sortcol=Item_INVENTOCATION17_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F', 'newwin', 'dependent = yes, height=800, width=' + w + ', top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no');
    //     }
    //     else {
    //         window.open('https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INTERNALID=' + uid + '&style=NORMAL&report=&grid=&searchid=3993&sortcol=Item_INVENTOCATION17_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F', 'newwin', 'dependent = yes, height=800, width=' + w + ', top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no');
    //     }
    //     return true;
    // };
});
