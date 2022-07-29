/**
 * Module Description...
 *
 * @file DH_PurchaseRequest_SU.js
 * @copyright 2018 Darren Hill Consulting Inc.
 * @author Darren Hill darren@darrenhillconsulting.ca
 *
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType Suitelet
 */
define(["require", "exports", "N/https", "N/search", "N/format", "N/runtime", "N/task", "N/ui/serverWidget", "./DH_Library", "./PurchaseRequestItemDetail", "./DH_ProcessManager"], function (require, exports, https, search, format, runtime, task, serverWidget, DH_Library_1, PurchaseRequestItemDetail_1, DH_ProcessManager_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var FORM = {
        title: 'Process Purchase Requests'
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
    // region Form Creation/Events
    //noinspection JSUnusedGlobalSymbols
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
        var clearAll = false, locationId = -1, isNormallyStocked =-1;
        if (context.request.parameters.clearAll) {
            clearAll = context.request.parameters.clearAll === 'T';
        }
        if (context.request.parameters.locationFilter) {
            locationId = +context.request.parameters.locationFilter;
        }
        if (context.request.parameters.normallystocked) {
            isNormallyStocked = context.request.parameters.normallystocked;
        }      
       
       // var stockRequests = !DH_ProcessManager_1.isProcessing() ? getStockRequests(clearAll, isNormallyStocked) : []; 
        var stockRequests = !DH_ProcessManager_1.isProcessing() ? getStockRequests(clearAll, locationId, isNormallyStocked ) : []; 
        var form = serverWidget.createForm({ title: FORM.title });  
        // region Item List 
        var itemList = form.addSublist({ id: ITEMSUBLIST.id, label: stockRequests.length + " " + ITEMSUBLIST.label, type: serverWidget.SublistType.INLINEEDITOR });
        STOCK_REQUEST_FIELDS.forEach(function (stockRequestField) {
            itemList.addField(stockRequestField.config).updateDisplayType({ displayType: stockRequestField.displayType });
        });
        // endregion
        // region Buttons
        FORM_BUTTONS.forEach(function (formButton) {
            form.addButton(formButton);
        });
        // endregion

        // region Location Filer
        form.addField({ id: 'custpage_filterlocationid', type: serverWidget.FieldType.SELECT, label: 'Filter By Location', source: 'location' });
     
        // endregion
        ///stock  filter region

      var NormallyStocked =  form.addField({ id: 'custpage_nonstockonly', type: serverWidget.FieldType.SELECT, label: 'Normally Stocked', });
                   NormallyStocked.addSelectOption({
                    value: '',
                    text: 'All'
                });
             NormallyStocked.addSelectOption({
                    value: 'Y',
                    text: 'Yes'
                });
                NormallyStocked.addSelectOption({
                    value: 'N',
                    text: 'No'
                });
      //End stocked filter
        form.addSubmitButton({
            label: 'Create Transactions'
        });
        form.clientScriptModulePath = './DH_PurchaseRequest_SU_CS.js';
        stockRequests.forEach(function (stockRequest, index) {
            stockRequest.values.forEach(function (stockRequest) {
                if (stockRequest.value) {
                    itemList.setSublistValue({ id: stockRequest.config.id, value: stockRequest.value, line: index });
                }
            });
        });
        return form;
    };
    var postHandler = function (context) {
        var purchaseRequests = [];
        for (var i = 0, lineCount = +context.request.getLineCount({ group: ITEMSUBLIST.id }); i < lineCount; i = i + 1) {
            var status_1 = +context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'status', line: i });
            if (status_1 > 0) {
                purchaseRequests.push({
                    processingStatus: context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'status', line: i }),
                    salesOrderLine: +context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'solineid', line: i }),
                    itemId: +context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'itemid', line: i }),
                    quantity: +context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'qty', line: i }),
                    locationId: +context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'locationid', line: i }),
                    vendorId: +context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'vendor', line: i }),
                    purchasingNotes: context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'purchasingnotes', line: i }),
                    estimatedCost: +context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'avgcost', line: i }),
                    fromLocationId: +context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'fromlocationid', line: i }),
                    salesOrderId: +context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'so', line: i }),
                    internalId: context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'id', line: i }),
                    email: context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'empemails', line: i }),
                    rate: context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'rate', line: i }),
                    fromSalesOrderProcess: false,
                    purchaseOrderType: +context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'potype', line: i }),
                    description: context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'description', line: i }),
                    isCustomPrice: context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'iscustomprice', line: i }) === 'T',
                    vendorNotes: context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'vendornotes', line: i }),
                    LastNegotiationDate: context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'lastnegotiationdate', line: i }), //MH added
                    LocationPreferredStockLevel: context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'LocationPreferredStockLevel', line: i }), //MH added
                    AddLocalStockLevel: context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'AddLocalStockLevel', line: i }), //MH added
                });
            }
        }
        if (purchaseRequests.length > 0) {
            var purchaseRequestProcessor = task.create({
                taskType: task.TaskType.MAP_REDUCE
            });
            purchaseRequestProcessor.scriptId = 'customscript_dh_purchase_request_mr';
            purchaseRequestProcessor.deploymentId = null; // Setting this to null forces Netsuite to select the next available 'idle' deployment
            purchaseRequestProcessor.params = {
                custscript_dh_employee: runtime.getCurrentUser().id,
                custscript_dh_purchaserequests: JSON.stringify(purchaseRequests)
            };
            purchaseRequestProcessor.submit();
            DH_ProcessManager_1.processingStart();
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
   
    var getStockRequests = function (clearAll, locationId, isNormallyStocked) {
        var stockRequests = [], purchaseRequestItemDetails = getPurchaseRequestItemDetails(clearAll, locationId, isNormallyStocked);
        purchaseRequestItemDetails.forEach(function (purchaseRequestItemDetail) {
            var stockRequest = { values: JSON.parse(JSON.stringify(STOCK_REQUEST_FIELDS)) };
            stockRequest.values.forEach(function (itemListField) {
                switch (itemListField.config.id) {
                    case 'status':
                        itemListField.value = purchaseRequestItemDetail.processingStatus;
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
                        itemListField.value = purchaseRequestItemDetail.salesOrderId;
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
                }
            });
            stockRequests.push(stockRequest);
        });
        return stockRequests;
    };
    var getPurchaseRequestItemDetails = function (clearAll, locationId, isStock, AddLocalStockLevel, isNormallyStocked) {
        var itemIds = [], itemLocationIds = [], purchaseRequestItemDetails = [];
        var filter = [['isinactive', 'is', 'F'], 'AND', [PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.FromSalesOrderProcess, 'is', 'F'], 'AND', [PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Date, 'onorbefore', 'today'], 'AND', [PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.ProcessingStatus, 'anyof', '@NONE@']];
        if (locationId > 0) {
            filter.push('AND');
            filter.push([PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Location, 'anyof', locationId]);
        }
        else {
            filter.push('AND');
            filter.push([PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Location, 'noneof', '@NONE@']);
        }
      //add normally stocked filter
              if (isStock == 'Y') {
            filter.push('AND');
            //filter.push([PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.LocationPreferredStockLevel, "greaterthan","0"]);  
                filter.push([[PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.LocationPreferredStockLevel, "greaterthan","0"],"OR",[ PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.AddLocalStockLevel ,"is","T"]]);
        }
        else if(isStock == 'N') {
            filter.push('AND');
            filter.push([PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.LocationPreferredStockLevel, "notgreaterthan","0"]);
        }
      
      //End Normally Stocked Filter
        search.create({
            type: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.RECORD_TYPE,
            filters: filter,
            columns: [
                search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Date }),
                search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.FiveCode }),
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
                search.createColumn({ name: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.Rate })//31 SO rate added            
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
                processingStatus: PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.BLANK,
                monthsOnHand: +result.getValue(result.columns[17]),
                companyOnOrder: +result.getValue(result.columns[18]),
                locationOnOrder: +result.getValue(result.columns[19]),
                estimatedCost: +result.getValue(result.columns[20]),
                salesOrderId: +result.getValue(result.columns[21]),
                salesOrderQuantity: +result.getValue(result.columns[22]),
                email: result.getValue(result.columns[23]),
                salesOrderLine: +result.getValue(result.columns[24]),
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
                locationPreferredStockLevel: -1,
                fromSalesOrderProcess: false,
                rate: result.getValue(result.columns[31])
            };
            itemIds.push(purchaseRequestItemDetail.itemId);
            // Ensure we only keep the unique Item / Location combinations
            if (itemLocationIds.indexOf(purchaseRequestItemDetail.itemId + "_" + purchaseRequestItemDetail.locationId) === -1) {
                itemLocationIds.push(purchaseRequestItemDetail.itemId + "_" + purchaseRequestItemDetail.locationId);
                itemLocations.push({
                    internalId: purchaseRequestItemDetail.itemId,
                    loctionId: purchaseRequestItemDetail.locationId
                });
            }
            purchaseRequestItemDetails.push(purchaseRequestItemDetail);
            return true;
        });
        if (itemLocations.length > 0) {
            getItemsDetails(itemLocations);
        }
        UniqueItemIds = itemIds.filter(uniqueItemIds);
        if (UniqueItemIds.length > 0) {
            getItemsAvailability(UniqueItemIds);
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
            if (clearAll) {
                purchaseRequestItemDetail.processingStatus = PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.BLANK;
            }
            else {
                if (!purchaseRequestItemDetail.isAvailable && !(purchaseRequestItemDetail.fromLocationId > 0)) {
                    purchaseRequestItemDetail.processingStatus = PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.PurchaseOrder;
                }
                else if (!(purchaseRequestItemDetail.fromLocationId > 0)) {
                    if (+purchaseRequestItemDetail.monthsOnHand === 0) {
                        purchaseRequestItemDetail.processingStatus = PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.PurchaseOrder;
                    }
                    else {
                        var fromLocationDetails = getFromLocation(purchaseRequestItemDetail.itemId, purchaseRequestItemDetail.quantity, purchaseRequestItemDetail.locationId);
                        if (fromLocationDetails.fromLocation === -1) {
                            purchaseRequestItemDetail.processingStatus = PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.PurchaseOrder;
                        }
                        else {
                            purchaseRequestItemDetail.fromLocationId = fromLocationDetails.fromLocation;
                            purchaseRequestItemDetail.processingStatus = PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.TransferOrder;
                        }
                    }
                }
            }
        });
        return purchaseRequestItemDetails;
    };
    // region Form Elements
    var FORM_BUTTONS = [];
    FORM_BUTTONS.push({ id: 'custpage_openitem_btn', label: 'Open Item', functionName: 'openitem' });
    FORM_BUTTONS.push({ id: 'custpage_clear_btn', label: 'Clear All Lines', functionName: 'clearalllines' });
    FORM_BUTTONS.push({ id: 'custpage_openstckreq_btn', label: 'Open Stock Request', functionName: 'openrequest' });
    FORM_BUTTONS.push({ id: 'custpage_checkinv_btn', label: 'Check Inventory', functionName: 'getinv' });
    FORM_BUTTONS.push({ id: 'custpage_tran_hist_btn', label: 'Transaction History', functionName: 'tranHistory' });
    FORM_BUTTONS.push({ id: 'custpage_cust_hist_btn', label: 'Customer History', functionName: 'gethist' });
    FORM_BUTTONS.push({ id: 'custpage_reset', label: 'Reset', functionName: 'reset' });
    var STOCK_REQUEST_FIELDS = [];
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'status', type: serverWidget.FieldType.SELECT, label: 'Status', source: 'customlist465' }, displayType: serverWidget.FieldDisplayType.ENTRY });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'isstocked', type: serverWidget.FieldType.TEXT, label: 'Stocked Item' }, displayType: serverWidget.FieldDisplayType.DISABLED });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: DH_Library_1.FIELDS.ITEM.AX5Code, type: serverWidget.FieldType.TEXT, label: 'AX 5 Code' }, displayType: serverWidget.FieldDisplayType.DISABLED });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'itemid', type: serverWidget.FieldType.SELECT, label: 'Item', source: 'item' }, displayType: serverWidget.FieldDisplayType.ENTRY });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'qty', type: serverWidget.FieldType.INTEGER, label: 'QTY' }, displayType: serverWidget.FieldDisplayType.ENTRY });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'soqty', type: serverWidget.FieldType.INTEGER, label: 'SO QTY' }, displayType: serverWidget.FieldDisplayType.DISABLED });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'loccompava', type: serverWidget.FieldType.TEXT, label: 'Local / Company Avalible' }, displayType: serverWidget.FieldDisplayType.DISABLED });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'locationid', type: serverWidget.FieldType.SELECT, label: 'Location', source: 'location' }, displayType: serverWidget.FieldDisplayType.ENTRY });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'fromlocationid', type: serverWidget.FieldType.SELECT, label: 'From Location', source: 'location' }, displayType: serverWidget.FieldDisplayType.ENTRY });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'moh', type: serverWidget.FieldType.TEXT, label: 'MOH' }, displayType: serverWidget.FieldDisplayType.DISABLED });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'demandavgs', type: serverWidget.FieldType.TEXT, label: 'Local / Company Demand' }, displayType: serverWidget.FieldDisplayType.DISABLED });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'customer', type: serverWidget.FieldType.SELECT, label: 'Customer', source: 'customer' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'loccomponorder', type: serverWidget.FieldType.TEXT, label: 'Local / Company On Order' }, displayType: serverWidget.FieldDisplayType.DISABLED });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'locad', type: serverWidget.FieldType.TEXT, label: 'Local Demand' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'compad', type: serverWidget.FieldType.TEXT, label: 'Company Demand' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'leadtime', type: serverWidget.FieldType.TEXT, label: 'Lead Time' }, displayType: serverWidget.FieldDisplayType.DISABLED });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'lastnegotiationdate', type: serverWidget.FieldType.TEXTAREA, label: 'Last Negotiation Date' }, displayType: serverWidget.FieldDisplayType.DISABLED }); // MH added
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'vendor', type: serverWidget.FieldType.SELECT, label: 'Vendor', source: 'vendor' }, displayType: serverWidget.FieldDisplayType.ENTRY });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'newstock', type: serverWidget.FieldType.CHECKBOX, label: 'Add Stock Level' }, displayType: serverWidget.FieldDisplayType.ENTRY });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'forecastnotes', type: serverWidget.FieldType.TEXT, label: 'Forecast/Notes' }, displayType: serverWidget.FieldDisplayType.DISABLED });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'purchasingnotes', type: serverWidget.FieldType.TEXTAREA, label: 'Purchasing Notes' }, displayType: serverWidget.FieldDisplayType.ENTRY });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'avgcost', type: serverWidget.FieldType.TEXT, label: 'cost' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'so', type: serverWidget.FieldType.SELECT, label: 'Sales Order', source: 'salesorder' }, displayType: serverWidget.FieldDisplayType.ENTRY });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'custbu', type: serverWidget.FieldType.TEXT, label: 'BU/Customer' }, displayType: serverWidget.FieldDisplayType.DISABLED });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'estcost', type: serverWidget.FieldType.TEXT, label: 'Estimated Cost' }, displayType: serverWidget.FieldDisplayType.DISABLED });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'id', type: serverWidget.FieldType.TEXT, label: 'ID' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'solineid', type: serverWidget.FieldType.INTEGER, label: 'solineid' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'empemails', type: serverWidget.FieldType.EMAIL, label: 'email' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'potype', type: serverWidget.FieldType.INTEGER, label: 'potype' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'description', type: serverWidget.FieldType.TEXT, label: 'description' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'iscustomprice', type: serverWidget.FieldType.CHECKBOX, label: 'iscustomprice' }, displayType: serverWidget.FieldDisplayType.DISABLED });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'vendornotes', type: serverWidget.FieldType.TEXTAREA, label: 'vendornotes' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
    STOCK_REQUEST_FIELDS.push({ value: '', config: { id: 'rate', type: serverWidget.FieldType.TEXT, label: 'rate' }, displayType: serverWidget.FieldDisplayType.DISABLED });
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
                'locationpreferredstocklevel'
            ]
        }).run().each(function (result) {
            itemDetails[result.id + "_" + result.getValue(result.columns[0])] = {
                internalid: +result.id,
                isStock: +result.getValue(result.columns[5]) > 0,
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
});
// endregion
