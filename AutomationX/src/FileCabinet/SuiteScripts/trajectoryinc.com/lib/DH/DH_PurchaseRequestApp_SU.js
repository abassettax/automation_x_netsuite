/**
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType Suitelet
 */
define(["require", "exports", "N/log", "N/record", "N/url", "N/https", "N/search", "N/format", "N/runtime", "N/task", "N/ui/serverWidget", "./DH_Library", "./PurchaseRequestItemDetail", "./DH_ProcessManager"],
    function (require, exports, log, record, url, https, search, format, runtime, task, serverWidget, DH_Library_1, PurchaseRequestItemDetail_1, DH_ProcessManager_1) {
        Object.defineProperty(exports, "__esModule", { value: true });
        var FORM = {
            title: 'Approve Purchase Requests'
        };
        var ITEMSUBLIST = {
            id: 'custpagesublist',
            label: 'Purchase Requests'
        };
        var uniqueItemIds = function (value, index, self) {
            return self.indexOf(value) === index;
        };
        var UniqueItemIds;
        var isItemAvailable = {};
        var itemDetails = [];
        var itemLocations = [];
        exports.onRequest = function (context) {
            var requestRouter = {};
            requestRouter[https.Method.GET] = getHandler;
            requestRouter[https.Method.POST] = postHandler;
            var form = requestRouter[context.request.method] ? requestRouter[context.request.method](context) : null;
            if (form !== null) {
                context.response.writePage(form);
            }
        };
        var getHandler = function (context) {
            log.debug({
                title: 'params',
                details: JSON.stringify(context.request.parameters)
            });
            var locationId = -1;
            if (context.request.parameters.locationFilter) {
                locationId = +context.request.parameters.locationFilter;
            }
            if (context.request.parameters.prType) {
                var prType = +context.request.parameters.prType;
            } else {
                var prType = '';   //Standard
            }
            var ax5code = '';
            if (context.request.parameters.ax5code) {
                ax5code = context.request.parameters.ax5code;
            }
            var sourcing = '';
            if (context.request.parameters.sourcing) {
                sourcing = context.request.parameters.sourcing;
            }
            var stockRequests = getStockRequests(locationId, prType, ax5code, sourcing);
            var form = serverWidget.createForm({ title: FORM.title });
            var itemList = form.addSublist({ id: ITEMSUBLIST.id, label: stockRequests.length + " " + ITEMSUBLIST.label, type: serverWidget.SublistType.LIST });
            itemList.addMarkAllButtons();
            STOCK_REQUEST_FIELDS.forEach(function (stockRequestField) {
                var field = itemList.addField(stockRequestField.config).updateDisplayType({ displayType: stockRequestField.displayType });
                if (stockRequestField.config.id == 'status') {
                    field.addSelectOption({
                        value: '',
                        text: ''
                    });
                    field.addSelectOption({
                        value: '1',
                        text: 'Approve'
                    });
                    field.addSelectOption({
                        value: '2',
                        text: 'Reject'
                    });
                }
            });
            FORM_BUTTONS.forEach(function (formButton) {
                form.addButton(formButton);
            });
            form.addField({ id: 'custpage_filterlocationid', type: serverWidget.FieldType.SELECT, label: 'Filter By Location', source: 'location' });
            form.addField({ id: 'custpage_prtype', type: serverWidget.FieldType.SELECT, label: 'Request Type', source: 'customlist1277'});
            form.addField({ id: 'custpage_ax5code', type: serverWidget.FieldType.TEXT, label: '5 Code'});
            var sourcingFld = form.addField({ id: 'custpage_sourcing', type: serverWidget.FieldType.SELECT, label: 'Assigned To'});
            sourcingFld.addSelectOption({
                value: '',
                text: ''
            });
            sourcingFld.addSelectOption({
                value: '1',
                text: 'Purchasing'
            });
            sourcingFld.addSelectOption({
                value: '2',
                text: 'Sourcing'
            });

            form.addSubmitButton({
                label: 'Submit'
            });
            form.clientScriptModulePath = './DH_PurchaseRequestApp_SU_CS.js';
            var baseUrl = url.resolveDomain({
                hostType: url.HostType.APPLICATION,
                accountId: '422523'
            });
            log.debug({
                title: 'stockRequests',
                details: JSON.stringify(stockRequests)
            });
            stockRequests.forEach(function (stockRequest, index) {
                var links = '';
                var soLinks = '';
                var itemType = '';
                var item5Code;
                stockRequest.values.forEach(function (stockRequest) {
                    if (stockRequest.value) {
                        if (stockRequest.config.id == DH_Library_1.FIELDS.ITEM.AX5Code) {
                            item5Code = stockRequest.value;
                        }
                        if (stockRequest.config.id == 'id') {
                            // var recIdsArr = JSON.parse(stockRequest.value);
                            // log.debug({
                            //     title: 'recIdsArr',
                            //     details: JSON.stringify(recIdsArr) + 'type1 : ' + typeof(recIdsArr) + ' len: ' + recIdsArr.length + ' type2: ' + typeof(recIdsArr[0])
                            // });
                            // for (var i = 0; i < recIdsArr.length; i++) {
                                var recId = stockRequest.value;
                                // log.debug({
                                //     title: 'recId',
                                //     details: recId
                                // });
                                var recUrl = url.resolveRecord({
                                    recordType: 'customrecord463',
                                    recordId: recId
                                });
                                links = links + '<a href="https://' + baseUrl + recUrl + '" target="_blank">PR '+recId+'</a><br>';
                            // }
                        } else if (stockRequest.config.id == 'so') {
                            var soArr = JSON.parse(stockRequest.value);
                            // log.debug({
                            //     title: 'soArr',
                            //     details: JSON.stringify(soArr) + 'type1 : ' + typeof(soArr) + ' len: ' + soArr.length + ' type2: ' + typeof(soArr[0])
                            // });
                            for (var i = 0; i < soArr.length; i++) {
                                var recId = soArr[i].id;
                                if (soArr[i].type == 'salesorder') {
                                    var recUrl = url.resolveRecord({
                                        recordType: record.Type.SALES_ORDER,
                                        recordId: recId
                                    });
                                } else {
                                    var recUrl = url.resolveRecord({
                                        recordType: record.Type.WORK_ORDER,
                                        recordId: recId
                                    });
                                }
                                soLinks = soLinks + '<a href="https://' + baseUrl + recUrl + '" target="_blank">'+soArr[i].text+'</a>';
                                if (i < (soArr.length - 1)) {
                                    soLinks = soLinks + '<br>'
                                }
                            }
                        } else if (stockRequest.config.id == 'itemid') {
                            //item links
                            var itemId = stockRequest.value;
                            // var itemUrl = url.resolveRecord({
                            //     recordType: record.Type.ITEM,
                            //     recordId: itemId
                            // });
                            links = links + '<br><a href="https://' + baseUrl + '/app/common/item/item.nl?id=' + itemId + '" target="_blank">Item</a><br><br>';
                            //inv check link
                            links = links + '<a href="https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INVENTORYLOCATION=&CUSTITEM35='+item5Code+'&Item_FORMULATEXT=&CUSTITEM111=ANY&style=NORMAL&CUSTITEM35type=STARTSWITH&Item_FORMULATEXTtype=STARTSWITH&report=&grid=&searchid=7042&sortcol=Item_FORMULATEXT_raw&sortdir=DESC" target="_blank">Check Inv</a><br><br>';
                            //po history link
                            links = links + '<a href="https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&IT_Item_INTERNALID=' + itemId + '&searchid=7144" target="_blank">PO History</a><br><br>';
                            //similar items link
                            var itemLookup = search.lookupFields({
                                type: search.Type.ITEM,
                                id: itemId,
                                columns: ['custitem_item_main_category', 'manufacturer', 'type']
                            });
                            if (itemLookup.custitem_item_main_category[0]) {
                                var itemCat1 = itemLookup.custitem_item_main_category[0].value;
                            } else {
                                var itemCat1 = '';
                            }
                            var itemManu = itemLookup.manufacturer;
                            itemType = itemLookup.type[0].text;
                            if (itemType == 'Non-inventory Item') {
                                itemType = 'Direct Code';
                            }
                            links = links + '<a href="https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&CUSTITEM_ITEM_MAIN_CATEGORY=' + itemCat1 + '&Item_MANUFACTURER=' + itemManu + '&Item_MANUFACTURERtype=STARTSWITH&searchid=7220" target="_blank">Similar Items</a>';
                        }
                        if (stockRequest.config.id == 'rate') {
                            if (!isNaN(stockRequest.value)) {
                                itemList.setSublistValue({ id: stockRequest.config.id, value: stockRequest.value, line: index });
                            }
                        } else if (stockRequest.config.id == 'line') { 
                            itemList.setSublistValue({ id: stockRequest.config.id, value: parseFloat(index + 1).toFixed(), line: index });
                        } else {
                            itemList.setSublistValue({ id: stockRequest.config.id, value: stockRequest.value, line: index });
                        }
                    }
                });
                if (links != '') {
                    itemList.setSublistValue({ id: 'links', value: links, line: index });
                }
                if (soLinks != '') {
                    itemList.setSublistValue({ id: 'so', value: soLinks, line: index });
                }
                itemList.setSublistValue({ id: 'itemtype', value: itemType, line: index });
            });
            return form;
        };
        var postHandler = function (context) {
            var purchaseRequestIds = [];
            var purchaseRequestData = [];
            var purchaseRequestStatuses = [];
            var purchaseRequestNotes = [];
            for (var i = 0, lineCount = +context.request.getLineCount({ group: ITEMSUBLIST.id }); i < lineCount; i = i + 1) {
                var status_1 = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'process', line: i });
                var processStatus = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'status', line: i });
                var purchNotes = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'purchasingnotes', line: i });
                var loc = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'locationid', line: i});
                var qty = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'qty', line: i});
                var sourcing = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'sourcing', line: i});
                var vendor = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'vendor', line: i});
                var rate = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'rate', line: i});
                log.debug({
                    title: 'checking line',
                    details: 'line: ' + i + ' | process: '  + status_1
                });
                if (status_1 == 'T') {
                    var prId = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'id', line: i });
                    purchaseRequestIds.push(prId);
                    purchaseRequestData.push({
                        process: processStatus,
                        notes: purchNotes,
                        loc: loc,
                        qty: qty,
                        sourcing: sourcing,
                        vendor: vendor,
                        rate: rate
                    });
                }
            }
            log.debug({
                title: 'post purchaseRequestIds',
                details: JSON.stringify(purchaseRequestIds)
            });
            log.debug({
                title: 'post purchaseRequestStatuses',
                details: JSON.stringify(purchaseRequestStatuses)
            });
            //set User who approved/rejected the PR
            var userObj = runtime.getCurrentUser();
            log.debug('Internal ID of current user: ' + userObj.id);
            //Set placeholder "Processing" status on each record
            log.debug({
                title: 'post purchaseRequestData',
                details: JSON.stringify(purchaseRequestData)
            });
            for (var i = 0; i < purchaseRequestIds.length; i++) {
                var updateValues = {};
                if (purchaseRequestData[i].process == '1') {
                    //approve
                    updateValues['custrecord349'] = 1;
                    updateValues['custrecord350'] = userObj.id;
                } else if (purchaseRequestData[i].process == '2') {
                    //reject
                    updateValues['custrecord349'] = 2;
                    updateValues['custrecord350'] = userObj.id;
                    updateValues[PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.ProcessingStatus] = PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.Reject
                }   
                updateValues[PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.PurchaseNotes] = purchaseRequestData[i].notes;
                updateValues['custrecord192'] = parseInt(purchaseRequestData[i].loc);
                updateValues['custrecord189'] = parseInt(purchaseRequestData[i].qty);
                updateValues['custrecord352'] = purchaseRequestData[i].sourcing;
                updateValues['custrecord197'] = parseInt(purchaseRequestData[i].vendor);
                updateValues['custrecord_tjinc_sorate'] = purchaseRequestData[i].rate;
                record.submitFields({
                    type: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.RECORD_TYPE,
                    id: purchaseRequestIds[i],
                    values: updateValues
                });
            }
            // Reload the current page.
            context.response.sendRedirect({
                type: https.RedirectType.SUITELET,
                identifier: runtime.getCurrentScript().id,
                id: runtime.getCurrentScript().deploymentId
            });
            return null;
        };
        // endregion  

        var getStockRequests = function (locationId, prType, ax5code, sourcing) {
            log.debug({
                title: 'getStockRequests params',
                details: locationId
            });
            var stockRequests = [], purchaseRequestItemDetails = getPurchaseRequestItemDetails(locationId, prType, ax5code, sourcing);
            log.debug({
                title: 'purchaseRequestItemDetails',
                details: purchaseRequestItemDetails.length + ' | ' + JSON.stringify(purchaseRequestItemDetails)
            });
            //only consolidate if standard. show standalone lines for special types so Purch can decide how to group them
            var consPurchaseRequests = consolidateRequests2(purchaseRequestItemDetails);
            
            log.debug({
                title: 'consPurchaseRequests',
                details: consPurchaseRequests.length + ' | ' + JSON.stringify(consPurchaseRequests)
            });
            consPurchaseRequests.forEach(function (purchaseRequestItemDetail) {
                var stockRequest = { values: JSON.parse(JSON.stringify(STOCK_REQUEST_FIELDS)) };
                stockRequest.values.forEach(function (itemListField) {
                    switch (itemListField.config.id) {
                        case 'status':
                            itemListField.value = purchaseRequestItemDetail.processingStatus;
                            break;
                        case 'line':
                            itemListField.value = 'test';  //placeholder so indexing on field set forEach doesn't break
                            break;
                        case 'isstocked':
                            itemListField.value = purchaseRequestItemDetail.isStock ? 'Y' : 'N';
                            break;
                        case DH_Library_1.FIELDS.ITEM.AX5Code:
                            itemListField.value = purchaseRequestItemDetail.fiveCode;
                            break;
                        case 'itemid':
                            itemListField.value = purchaseRequestItemDetail.itemId;
                            break;
                        case 'qty':
                            itemListField.value = purchaseRequestItemDetail.quantity.toString();
                            break;
                        case 'soqty':
                            if (purchaseRequestItemDetail.salesOrderQuantity > 0) {
                                itemListField.value = purchaseRequestItemDetail.salesOrderQuantity.toString();
                            }
                            break;
                        case 'locationid':
                            itemListField.value = purchaseRequestItemDetail.locationId;
                            break;
                        case 'fromlocationid':
                            itemListField.value = purchaseRequestItemDetail.fromLocationId;
                            break;
                        case 'moh':
                            itemListField.value = purchaseRequestItemDetail.monthsOnHand;
                            break;
                        case 'demandavgs':
                            itemListField.value = purchaseRequestItemDetail.locationAverageDemand + " / " + purchaseRequestItemDetail.companyAverageDemand;
                            break;
                        case 'customer':
                            itemListField.value = purchaseRequestItemDetail.customerId;
                            break;
                        case 'loccompava':
                            itemListField.value = purchaseRequestItemDetail.locationAvailable + " / " + purchaseRequestItemDetail.companyAvailable;
                            break;
                        case 'loccomponorder':
                            itemListField.value = purchaseRequestItemDetail.locationOnOrder + " / " + purchaseRequestItemDetail.companyOnOrder;
                            break;
                        case 'locad':
                            itemListField.value = purchaseRequestItemDetail.locationAverageDemand;
                            break;
                        case 'compad':
                            itemListField.value = purchaseRequestItemDetail.companyAverageDemand;
                            break;
                        case 'leadtime':
                            itemListField.value = purchaseRequestItemDetail.leadTime;
                            break;
                        case 'vendor':
                            itemListField.value = purchaseRequestItemDetail.vendorId;
                            break;
                        case 'newstock':
                            itemListField.value = purchaseRequestItemDetail.addLocalStockLevel ? 'T' : 'F';
                            break;
                        case 'forecastnotes':
                            itemListField.value = purchaseRequestItemDetail.forecastnotes;
                            break;
                        case 'purchasingnotes':
                            itemListField.value = purchaseRequestItemDetail.purchasingNotes;
                            break;
                        case 'so':
                            itemListField.value = JSON.stringify(purchaseRequestItemDetail.soArr);
                            break;
                        case 'soids':
                            // log.debug({
                            //     title: 'purchaseRequestItemDetail.soIdArr',
                            //     details: purchaseRequestItemDetail.soIdArr.length + ' | ' + JSON.stringify(purchaseRequestItemDetail.soIdArr)
                            // });
                            itemListField.value = JSON.stringify(purchaseRequestItemDetail.soIdArr);
                            break;
                        case 'avgcost':
                            itemListField.value = purchaseRequestItemDetail.estimatedCost;
                            break;
                        case 'custbu':
                            itemListField.value = purchaseRequestItemDetail.businessUnit + " / " + purchaseRequestItemDetail.customer;
                            break;
                        case 'estcost':
                            var estCost = purchaseRequestItemDetail.estimatedCost * purchaseRequestItemDetail.quantity;
                            itemListField.value = "$" + format.format({ value: estCost, type: format.Type.CURRENCY });
                            break;
                        case 'id':
                            // log.debug({
                            //     title: 'purchaseRequestItemDetail.prids',
                            //     details: purchaseRequestItemDetail.prids.length + ' | ' + JSON.stringify(purchaseRequestItemDetail.prids)
                            // });
                            itemListField.value = JSON.stringify(purchaseRequestItemDetail.prids);
                            break;
                        case 'idlink':
                            itemListField.value = purchaseRequestItemDetail.internalId;
                            break;
                        case 'solineid':
                            itemListField.value = purchaseRequestItemDetail.salesOrderLine.toString();
                            break;
                        case 'empemails':
                            itemListField.value = purchaseRequestItemDetail.email;
                            break;
                        case 'potype':
                            itemListField.value = +purchaseRequestItemDetail.purchaseOrderType.toString();
                            break;
                        case 'description':
                            itemListField.value = (purchaseRequestItemDetail.description).substring(0, 299);
                            break;
                        case 'iscutomprice':
                            itemListField.value = purchaseRequestItemDetail.isCustomPrice ? 'T' : 'F';
                            break;
                        case 'vendornotes':
                            itemListField.value = purchaseRequestItemDetail.vendorNotes;
                            break;
                        case 'rate':
                            itemListField.value = purchaseRequestItemDetail.rate;
                            break;
                        case 'lastnegotiationdate':
                            itemListField.value = purchaseRequestItemDetail.LastNegotiationDate;
                            break;  // MH added
                        case 'purchmethod':
                            itemListField.value = purchaseRequestItemDetail.purchMethod;
                            break;
                        case 'prtype':
                            itemListField.value = purchaseRequestItemDetail.prType;
                            break;
                        case 'dropshipadd':
                            itemListField.value = purchaseRequestItemDetail.dropShipAdd;
                            break;
                        case 'created':
                            var ogDate = purchaseRequestItemDetail.created;
                            // log.debug({
                            //     title: 'ogDate',
                            //     details: ogDate
                            // });
                            var a = ogDate.split(' '); // break date from time
                            // log.debug({
                            //     title: 'a',
                            //     details: JSON.stringify(a)
                            // });
	                        var date = a[0];
                            // var formattedDate = format.parse({
                            //     value: date,
                            //     type: format.Type.DATE
                            // });
                            itemListField.value = date;
                            break;
                        case 'itemclass':
                            itemListField.value = purchaseRequestItemDetail.stockClass;
                            break;
                        case 'multiitem':
                            itemListField.value = purchaseRequestItemDetail.multiitem;
                            break;
                        case 'runrate':
                            itemListField.value = purchaseRequestItemDetail.runrate;
                            break;
                        case 'sourcing':
                            if (purchaseRequestItemDetail.sourcing == true) {
                                var stringVal = 'T';
                            } else {
                                var stringVal = 'F';
                            }
                            itemListField.value = stringVal;
                            break;
                        case 'noalts':
                            if (purchaseRequestItemDetail.noAlts == true) {
                                var stringVal = 'T';
                            } else {
                                var stringVal = 'F';
                            }
                            itemListField.value = stringVal;
                            break;
                    }
                });
                stockRequests.push(stockRequest);
            });
            return stockRequests;
        };
        var getPurchaseRequestItemDetails = function (locationId, prType, ax5code, sourcing) {
            var itemIds = [], itemLocationIds = [], purchaseRequestItemDetails = [];
            var filter = [['isinactive', 'is', 'F'], 'AND', ['custrecord315', 'is', 'F'], 'AND', [PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.FromSalesOrderProcess, 'is', 'F'], 'AND', [PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Date, 'onorbefore', 'today'], 'AND', [PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.ProcessingStatus, 'anyof', ['@NONE@','4']], 'AND', ['custrecord349', 'anyof', ['@NONE@','2']]];
            if (locationId > 0) {
                filter.push('AND');
                filter.push([PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Location, 'anyof', locationId]);
            }
            else {
                filter.push('AND');
                filter.push([PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Location, 'noneof', '@NONE@']);
            }
            log.debug({
                title: 'prType | ax5code | sourcing',
                details: prType + ' | ' + ax5code + ' | ' + sourcing
            });
            if (prType > 1) {
                filter.push('AND');
                filter.push(['custrecord314', 'anyof', prType]);
            }
            if (ax5code != '') {
                filter.push('AND');
                filter.push(["custrecord188","startswith",ax5code]);
            }
            if (sourcing != '') {
                if (sourcing == '1') {
                    var sourcingVal = 'F';
                } else {
                    var sourcingVal = 'T'
                }
                filter.push('AND');
                filter.push(["custrecord352","is",sourcingVal]);
            }
            log.debug({
                title: 'getPurchaseRequestItemDetails filter',
                details: JSON.stringify(filter)
            });

            //End Normally Stocked Filter
            search.create({
                type: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.RECORD_TYPE,
                filters: filter,
                columns: [
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Date }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.FiveCode, sort: search.Sort.ASC }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Item }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Quantity }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Location, sort: search.Sort.ASC }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.LocationAverageDemand }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.LocationAvailable }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.CompanyAvailable }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Vendor, sort: search.Sort.ASC }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.AddLocalStockLevel }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.ForecastNotes }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.CompanyAverageDemand }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.LeadTime }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.BusinessUnit }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Customer }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.FromLocation }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.ProcessingStatus, sort: search.Sort.ASC }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.MonthsOnHand }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.CompanyOnOrder }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.LocationOnOrder }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.EstimatedCost }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.SalesOrder }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.SalesOrderQuantity }),
                    search.createColumn({ name: 'email', join: 'owner' }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.SalesOrderLine }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.PurchaseNotes }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.PurchaseOrderType }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.ItemDescription }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.IsCustomPrice }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.VendorNotes }), // 29 VendorNotes
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.LastNegotiationDate }),//30 MH Added
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Rate }),//31 SO rate added
                    search.createColumn({ name: 'cost', join: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Item }),//32 Item purchase price added
                    search.createColumn({ name: 'custitem115', join: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Item }),//33 Item purchase method added
                    search.createColumn({ name: 'custrecord314' }),//34 Pr type added
                    search.createColumn({ name: 'custrecord212' }),//35 date created added
                    search.createColumn({ name: 'custitem116', join: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Item }),//36 item stock class added
                    search.createColumn({ name: 'custrecord352' }),//37 assigned to sourcing checkbox added
                    search.createColumn({ name: 'custrecord353' })//38 does not accept alternates checkbox added
                ]
            }).run().each(function (result) {
                var purchaseRequestItemDetail = {
                    isStock: false,
                    isAvailable: false,
                    date: result.getValue(result.columns[0]),
                    fiveCode: result.getValue(result.columns[1]),
                    itemId: parseInt(result.getValue(result.columns[2])),
                    quantity: +result.getValue(result.columns[3]),
                    locationId: +result.getValue(result.columns[4]),
                    locationAverageDemand: +result.getValue(result.columns[5]),
                    locationAvailable: +result.getValue(result.columns[6]),
                    available: +result.getValue(result.columns[7]),
                    vendorId: +result.getValue(result.columns[8]),
                    addLocalStockLevel: result.getValue(result.columns[9]),
                    forecastnotes: result.getValue(result.columns[10]),
                    companyAverageDemand: +result.getValue(result.columns[11]),
                    leadTime: result.getValue(result.columns[12]),
                    businessUnitId: +result.getValue(result.columns[13]),
                    businessUnit: result.getText(result.columns[13]),
                    customerId: +result.getValue(result.columns[14]),
                    customer: result.getText(result.columns[14]),
                    fromLocationId: +result.getValue(result.columns[15]),
                    processingStatus: result.getValue(result.columns[16]), //PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.BLANK,
                    monthsOnHand: +result.getValue(result.columns[17]),
                    companyOnOrder: +result.getValue(result.columns[18]),
                    locationOnOrder: +result.getValue(result.columns[19]),
                    salesOrderId: result.getValue(result.columns[21]),
                    salesOrderText: result.getText(result.columns[21]),
                    salesOrderQuantity: +result.getValue(result.columns[22]),
                    email: result.getValue(result.columns[23]),
                    salesOrderLine: result.getValue(result.columns[24]),
                    purchasingNotes: result.getValue(result.columns[25]),
                    purchaseOrderType: parseInt(result.columns[26]),
                    description: result.getValue(result.columns[27]),
                    isCustomPrice: result.getValue(result.columns[28]) === 'T',
                    vendorNotes: result.getValue(result.columns[29]),
                    LastNegotiationDate: result.getValue(result.columns[30]), // MH Added
                    relatedTransactionId: -1,
                    createdById: -1,
                    companyAvailable: -1,
                    createdFromId: -1,
                    internalId: result.id,
                    internalId2: result.id,
                    locationPreferredStockLevel: -1,
                    fromSalesOrderProcess: false,
                    rate: result.getValue(result.columns[31]),
                    purchMethod: result.getValue(result.columns[33]),
                    prids: 0,
                    soArr: [],
                    soIdArr: [],
                    soNotesConcat: '',
                    dropShipAdd: '',
                    created: result.getValue(result.columns[35]),
                    stockClass: result.getText(result.columns[36]),
                    sourcing: result.getValue(result.columns[37]),
                    noAlts: result.getValue(result.columns[38])
                };
                var estCost = +result.getValue(result.columns[20]);
                if (estCost == 0) {
                    estCost = +result.getValue(result.columns[32]);
                }
                purchaseRequestItemDetail.estimatedCost = estCost;
                var prType = result.getValue(result.columns[34]);
                // log.debug({
                //     title: 'checking prType',
                //     details: 'prType: ' + prType
                // });
                if (prType == '') {
                    prType = '1';
                }
                purchaseRequestItemDetail.prType = prType;
                itemIds.push(purchaseRequestItemDetail.itemId);
                // Ensure we only keep the unique Item / Location combinations
                if (itemLocationIds.indexOf(purchaseRequestItemDetail.itemId + "_" + purchaseRequestItemDetail.locationId) === -1) {
                    itemLocationIds.push(purchaseRequestItemDetail.itemId + "_" + purchaseRequestItemDetail.locationId);
                    itemLocations.push({
                        internalId: purchaseRequestItemDetail.itemId,
                        loctionId: purchaseRequestItemDetail.locationId
                    });
                }
                // log.debug({
                //     title: 'result.getValue(result.columns[21])',
                //     details: result.getValue(result.columns[21])
                // });
                if (result.getValue(result.columns[21]).length > 0) {
                    var soLookup = search.lookupFields({
                        type: search.Type.TRANSACTION,
                        id: result.getValue(result.columns[21]),
                        columns: ['shipaddress']
                    });
                    // log.debug({
                    //     title: 'soLookup',
                    //     details: JSON.stringify(soLookup)
                    // });
                    var soShipTo = soLookup.shipaddress;
                    purchaseRequestItemDetail.dropShipAdd = soShipTo;
                }
                purchaseRequestItemDetails.push(purchaseRequestItemDetail);
                return true;
            });

            var allPrItemData = [];
            var allPrItems = [];
            var filter2 = [['isinactive', 'is', 'F'], 'AND', ['custrecord315', 'is', 'F'], 'AND', [PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.FromSalesOrderProcess, 'is', 'F'], 'AND', [PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Date, 'onorbefore', 'today'], 'AND', [PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.ProcessingStatus, 'anyof', ['@NONE@','4']], 'AND', ['custrecord349', 'anyof', ['@NONE@','2']], 'AND', [PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Location, 'noneof', '@NONE@']];
            search.create({
                type: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.RECORD_TYPE,
                filters: filter2,
                columns: [
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Item }),
                    search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Location, sort: search.Sort.ASC }),
                ]
            }).run().each(function (result) {
                var itemId = parseInt(result.getValue(result.columns[0]));
                var locationId = +result.getValue(result.columns[1]);
                var allPRItemsIndex = allPrItems.indexOf(itemId);
                if (allPRItemsIndex == -1) {
                    allPrItems.push(itemId);
                    allPrItemData.push({
                        item: itemId,
                        locations: [locationId]
                    });
                } else {
                    var allPrItemsLocIndex = allPrItemData[allPRItemsIndex].locations.indexOf(locationId);
                    if (allPrItemsLocIndex == -1) {
                        allPrItemData[allPRItemsIndex].locations.push(locationId);
                    }
                }
                return true;
            });

            if (itemLocations.length > 0) {
                getItemsDetails(itemLocations);
            }
            var salesData = [];
            var salesDataItems = [];
            UniqueItemIds = itemIds.filter(uniqueItemIds);
            if (UniqueItemIds.length > 0) {
                getItemsAvailability(UniqueItemIds);

                search.create({
                    type: "salesorder",
                    filters:
                    [
                       ["type","anyof","SalesOrd"], 
                       "AND", 
                       ["status","noneof","SalesOrd:C","SalesOrd:H"], 
                       "AND", 
                       ["closed","is","F"], 
                       "AND", 
                       ["item","anyof",UniqueItemIds], 
                       "AND", 
                       ["trandate","within","monthsago3","daysago0"]
                    ],
                    columns:
                    [
                       search.createColumn({
                          name: "custitem35",
                          join: "item",
                          summary: "GROUP",
                          sort: search.Sort.ASC,
                          label: "AX 5 Code"
                       }),
                       search.createColumn({
                          name: "item",
                          summary: "GROUP",
                          label: "Item"
                       }),
                       search.createColumn({
                          name: "location",
                          summary: "GROUP",
                          label: "Location"
                       }),
                       search.createColumn({
                          name: "quantity",
                          summary: "SUM",
                          label: "Quantity"
                       })
                    ]
                 }).run().each(function (result) {
                    var itemId = parseInt(result.getValue(result.columns[1]));
                    var locationId = +result.getValue(result.columns[2]);
                    var itemQty = +result.getValue(result.columns[3]);
                    var salesDataItemsIndex = salesDataItems.indexOf(itemId);
                    if (salesDataItemsIndex == -1) {
                        salesDataItems.push(itemId);
                        salesData.push({
                            item: itemId,
                            locations: [{
                                loc: locationId,
                                qty: itemQty
                            }],
                            qty: itemQty
                        });
                    } else {
                        var salesDataItemsLocIndex = findWithAttr(salesData[salesDataItemsIndex].locations, 'loc', locationId);
                        if (salesDataItemsLocIndex == -1) {
                            salesData[salesDataItemsIndex].locations.push({
                                loc: locationId,
                                qty: itemQty
                            });
                            salesData[salesDataItemsIndex].qty += itemQty;
                        } 
                    }
                    return true;
                });    
            }

            purchaseRequestItemDetails.forEach(function (purchaseRequestItemDetail) {
                var itemDetail = itemDetails[purchaseRequestItemDetail.itemId + "_" + purchaseRequestItemDetail.locationId];
                if (itemDetail) {
                    purchaseRequestItemDetail.isStock = itemDetail.isStock;
                    purchaseRequestItemDetail.locationAvailable = itemDetail.locationAvailable;
                    purchaseRequestItemDetail.locationOnOrder = itemDetail.locationOnOrder;
                    purchaseRequestItemDetail.companyOnOrder = itemDetail.companyOnOrder;
                    purchaseRequestItemDetail.companyAvailable = itemDetail.companyAvailable;
                    purchaseRequestItemDetail.locationPreferredStockLevel = itemDetail.locationPreferredStockLevel;
                    purchaseRequestItemDetail.isAvailable = isItemAvailable[+purchaseRequestItemDetail.itemId];
                }
                //this is suggestion logic. parameters are fine for now
                if (purchaseRequestItemDetail.processingStatus == '') {
                    //automatically clears all lines, no suggestions applied
                    //if none available, set to PO
                    if (!purchaseRequestItemDetail.isAvailable && !(purchaseRequestItemDetail.fromLocationId > 0)) {
                        // purchaseRequestItemDetail.processingStatus = PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.PurchaseOrder;
                    }
                    //if some are available, eval further
                    else if (!(purchaseRequestItemDetail.fromLocationId > 0)) {
                        //if motnhs on hand is 0, set to PO
                        if (+purchaseRequestItemDetail.monthsOnHand === 0) {
                            // purchaseRequestItemDetail.processingStatus = PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.PurchaseOrder;
                        }
                        //else if available and months on hand greater than 0, eval further
                        else {
                            //determines value for From Location field. need to review logic that determines if a match is found. may just need to skip this defaulting
                            var fromLocationDetails = getFromLocation(purchaseRequestItemDetail.itemId, purchaseRequestItemDetail.quantity, purchaseRequestItemDetail.locationId);
                            //if transfer match is not found, set to PO
                            if (fromLocationDetails.fromLocation === -1) {
                                // purchaseRequestItemDetail.processingStatus = PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.PurchaseOrder;
                            }
                            //else if transfer match is found, set to TO
                            else {
                                purchaseRequestItemDetail.fromLocationId = fromLocationDetails.fromLocation;
                                // purchaseRequestItemDetail.processingStatus = PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.TransferOrder;
                            }
                        }
                    }
                }
                var allPrItemsIndex = allPrItems.indexOf(purchaseRequestItemDetail.itemId);
                var locationsArr = allPrItemData[allPrItemsIndex].locations;
                if (locationsArr.length > 1) { 
                    purchaseRequestItemDetail.multiitem = '*';
                } else {
                    purchaseRequestItemDetail.multiitem = '';
                }

                var salesDataItemsIndex = salesDataItems.indexOf(purchaseRequestItemDetail.itemId);
                //index may be -1 if we haven't sold it
                if (salesDataItemsIndex != -1) {
                    var companyQty = salesData[salesDataItemsIndex].qty;
                    var locationsArr = salesData[salesDataItemsIndex].locations;
                    var salesDataItemsLocIndex = findWithAttr(salesData[salesDataItemsIndex].locations, 'loc', purchaseRequestItemDetail.locationId);
                    if (salesDataItemsLocIndex != -1) {
                        var locQty = salesData[salesDataItemsIndex].locations[salesDataItemsLocIndex].qty;
                    } else {
                        var locQty = 0;
                    }
                    var runRate = locQty.toString().concat(' / ', companyQty);
                } else {
                    var runRate = '0 / 0'
                }
                purchaseRequestItemDetail.runrate = runRate;
                
            });
            return purchaseRequestItemDetails;
        };
        // region Form Elements
        var FORM_BUTTONS = [];
        FORM_BUTTONS.push({ id: 'custpage_reset', label: 'Reset', functionName: 'reset' });

        var STOCK_REQUEST_FIELDS = [];
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'line', type: serverWidget.FieldType.TEXT, label: 'Line ID'}, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'process', type: serverWidget.FieldType.CHECKBOX, label: 'Process'}, displayType: serverWidget.FieldDisplayType.ENTRY });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'id', type: serverWidget.FieldType.TEXTAREA, label: 'ID' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'sourcing', type: serverWidget.FieldType.CHECKBOX, label: 'Sourcing?'}, displayType: serverWidget.FieldDisplayType.ENTRY });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'status', type: serverWidget.FieldType.SELECT, label: 'Action'}, displayType: serverWidget.FieldDisplayType.ENTRY });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'prtype', type: serverWidget.FieldType.SELECT, label: 'Request Type', source: 'customlist1277' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'purchmethod', type: serverWidget.FieldType.SELECT, label: 'Purchase Method', source: 'customlist1276' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'created', type: serverWidget.FieldType.DATE, label: 'Date'}, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'locationid', type: serverWidget.FieldType.SELECT, label: 'Location', source: 'location'}, displayType: serverWidget.FieldDisplayType.ENTRY });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'fromlocationid', type: serverWidget.FieldType.SELECT, label: 'From Location', source: 'location'}, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'links', type: serverWidget.FieldType.TEXTAREA, label: 'Links' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'multiitem', type: serverWidget.FieldType.TEXT, label: 'Multi Location' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: DH_Library_1.FIELDS.ITEM.AX5Code, type: serverWidget.FieldType.TEXT, label: 'AX 5 Code' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'noalts', type: serverWidget.FieldType.CHECKBOX, label: 'Does Not Accept Alternates'}, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'itemid', type: serverWidget.FieldType.SELECT, label: 'Item', source: 'Item' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'itemtype', type: serverWidget.FieldType.TEXT, label: 'Item Type' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'itemclass', type: serverWidget.FieldType.TEXT, label: 'Item Stock Type' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'isstocked', type: serverWidget.FieldType.TEXT, label: 'Netstock Item' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'custbu', type: serverWidget.FieldType.TEXT, label: 'BU/Customer' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'estcost', type: serverWidget.FieldType.TEXT, label: 'Estimated Cost' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'avgcost', type: serverWidget.FieldType.TEXT, label: 'Item Unit Cost' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'vendor', type: serverWidget.FieldType.SELECT, label: 'Vendor', source: 'vendor' }, displayType: serverWidget.FieldDisplayType.ENTRY });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'iscustomprice', type: serverWidget.FieldType.CHECKBOX, label: 'iscustomprice' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'qty', type: serverWidget.FieldType.INTEGER, label: 'Qty' }, displayType: serverWidget.FieldDisplayType.ENTRY });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'rate', type: serverWidget.FieldType.FLOAT, label: 'Rate' }, displayType: serverWidget.FieldDisplayType.ENTRY });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'so', type: serverWidget.FieldType.TEXTAREA, label: 'Sales Order' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'soids', type: serverWidget.FieldType.TEXTAREA, label: 'Sales Order IDS' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'soqty', type: serverWidget.FieldType.INTEGER, label: 'SO QTY' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'moh', type: serverWidget.FieldType.TEXT, label: 'MOH' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        // STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'demandavgs', type: serverWidget.FieldType.TEXT, label: 'Local / Company Demand' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'customer', type: serverWidget.FieldType.SELECT, label: 'Customer', source: 'customer' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'loccompava', type: serverWidget.FieldType.TEXT, label: 'Local / Company Available' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'loccomponorder', type: serverWidget.FieldType.TEXT, label: 'Local / Company On Order' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'runrate', type: serverWidget.FieldType.TEXT, label: 'Local / Company 3 Month Run Rate' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'locad', type: serverWidget.FieldType.TEXT, label: 'Local Demand' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'compad', type: serverWidget.FieldType.TEXT, label: 'Company Demand' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'leadtime', type: serverWidget.FieldType.TEXT, label: 'Lead Time' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'lastnegotiationdate', type: serverWidget.FieldType.TEXTAREA, label: 'Last Negotiation Date' }, displayType: serverWidget.FieldDisplayType.HIDDEN }); // MH added
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'newstock', type: serverWidget.FieldType.CHECKBOX, label: 'Add Stock Level' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'forecastnotes', type: serverWidget.FieldType.TEXTAREA, label: 'Sales Notes' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'dropshipadd', type: serverWidget.FieldType.TEXTAREA, label: 'Drop Ship Address'}, displayType: serverWidget.FieldDisplayType.HIDDEN});
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'purchasingnotes', type: serverWidget.FieldType.TEXTAREA, label: 'Purchasing Notes' }, displayType: serverWidget.FieldDisplayType.ENTRY });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'solineid', type: serverWidget.FieldType.INTEGER, label: 'solineid' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'empemails', type: serverWidget.FieldType.EMAIL, label: 'email' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'potype', type: serverWidget.FieldType.INTEGER, label: 'potype' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'description', type: serverWidget.FieldType.TEXT, label: 'description' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'vendornotes', type: serverWidget.FieldType.TEXTAREA, label: 'vendornotes' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        
        // endregion
        // region Searches
        var getItemsDetails = function (itemLocations) {
            var filter = [];
            itemLocations.forEach(function (itemLocation) {
                var itemFilter = ['internalid', 'anyof'];
                itemFilter.push(itemLocation.internalId.toString());
                var locationFilter = ['inventorylocation', 'anyof'];
                locationFilter.push(itemLocation.loctionId.toString());
                var fullFilter = [];
                fullFilter.push(itemFilter);
                fullFilter.push('AND');
                fullFilter.push(locationFilter);
                filter.push(fullFilter);
                filter.push('OR');
            });
            filter.pop(); // Remove the last 'OR';
            search.create({
                type: 'item',
                filters: filter,
                columns: [
                    'inventorylocation',
                    search.createColumn({ name: 'formulanumeric', formula: 'CASE WHEN {locationquantitybackordered} > 0 THEN  {locationquantitybackordered}  *-1 ELSE {locationquantityavailable} END' }),
                    'locationquantityonorder',
                    'quantityonorder',
                    'quantityavailable',
                    'locationpreferredstocklevel',
                    'custitem111'
                ]
            }).run().each(function (result) {
                itemDetails[result.id + "_" + result.getValue(result.columns[0])] = {
                    internalid: +result.id,
                    isStock: +result.getValue(result.columns[6]) > 0,
                    locationAvailable: +result.getValue(result.columns[1]),
                    locationOnOrder: +result.getValue(result.columns[2]),
                    companyOnOrder: +result.getValue(result.columns[3]),
                    companyAvailable: +result.getValue(result.columns[4]),
                    locationPreferredStockLevel: +result.getValue(result.columns[5])
                };
                return true;
            });
        };
        var getItemsAvailability = function (itemIds) {
            var filter = ['internalid', 'anyof'], qtyAvail = -1, monthsOnHand = -1;
            search.create({
                type: search.Type.ITEM,
                filters: [filter.concat(itemIds.map(String))],
                columns: [
                    search.createColumn({ name: 'quantityavailable' }),
                    search.createColumn({ name: DH_Library_1.FIELDS.ITEM.MonthsOnHand })
                ]
            }).run().each(function (result) {
                isItemAvailable[+result.id] = false;
                qtyAvail = +result.getValue(result.columns[0]);
                monthsOnHand = +result.getValue(result.columns[1]);
                if (qtyAvail > 0 && monthsOnHand > 3) {
                    isItemAvailable[+result.id] = true;
                }
                return true;
            });
        };
        var getFromLocation = function (internalId, quantity, locationId) {
            var fromLocationDetails = {
                fromLocation: -1,
                localMonthsOnHand: -1
            };
            search.create({
                type: search.Type.ITEM,
                filters: [
                    ['locationquantityavailable', 'greaterthan', '0'],
                    'AND',
                    ['inventorylocation.custrecord17', 'is', 'T'],
                    'AND',
                    ['internalidnumber', 'equalto', internalId],
                    'AND',
                    ['inventorylocation.internalidnumber', 'notequalto', locationId]
                ],
                columns: [
                    search.createColumn({ name: 'locationquantityavailable', summary: search.Summary.AVG }),
                    search.createColumn({ name: 'internalid', join: 'inventoryLocation', summary: search.Summary.GROUP }),
                    search.createColumn({ name: 'formulanumeric', summary: search.Summary.SUM, sort: search.Sort.DESC, formula: "CASE WHEN ({transaction.type} = 'SalesOrd'  OR {transaction.type} =  'Build') AND ({transaction.location}={inventorylocation}) AND {transaction.trandate} > (sysdate-90) THEN ABS({transaction.quantity})/3 ELSE NULL END" }),
                ]
            }).run().each(function (result) {
                var avgLocationAvailable = +result.getValue(result.columns[0]);
                var inventoryLocation = +result.getValue(result.columns[1]);
                var averageDemand = +result.getValue(result.columns[2]);
                var localMonthOnHand = averageDemand === 0 ? 99 : avgLocationAvailable / averageDemand;
                if (localMonthOnHand > 4 && avgLocationAvailable > quantity) {
                    fromLocationDetails.fromLocation = inventoryLocation;
                    fromLocationDetails.localMonthsOnHand = localMonthOnHand;
                    return false;
                }
                return true;
            });
            return fromLocationDetails;
        };
        var consolidateRequests2 = function (purchaseRequestItemDetails) {
            var consolidatedReqs2 = [];
            for (var i = 0; i < purchaseRequestItemDetails.length; i++) {
                var localPurchReq = purchaseRequestItemDetails[i];
                var prId = localPurchReq.internalId;
                var soId = localPurchReq.salesOrderId;
                var soText = localPurchReq.salesOrderText;
                var soLine = localPurchReq.salesOrderLine;
                var soNotes = localPurchReq.forecastnotes;
                if (soText.indexOf('Sales Order') != -1) {
                    var tranType = 'salesorder';
                } else {
                    var tranType = 'workorder'
                }
                localPurchReq.prids = +prId;
                localPurchReq.soArr.push({
                    id: soId,
                    text: soText,
                    line: soLine,
                    type: tranType
                });
                localPurchReq.soIdArr.push({
                    id: soId,
                    text: soText,
                    line: soLine,
                    type: tranType
                });
                localPurchReq.soNotesConcat = soNotes;
                consolidatedReqs2.push(localPurchReq);
            }
            // log.debug({
            //     title: 'keys',
            //     details: keys.length + ' | ' + JSON.stringify(keys)
            // });
            // log.debug({
            //     title: 'items',
            //     details: items.length + ' | ' + JSON.stringify(items)
            // });
            // log.debug({
            //     title: 'itemLocJSON',
            //     details: itemLocJSON.length + ' | ' + JSON.stringify(itemLocJSON)
            // });
            return consolidatedReqs2;
        };
        var findWithAttr = function findWithAttr(array, attr, value) {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        };
    });
// endregion
