define(["require", "exports", "N/record", "./DH_Library"],
    function (require, exports, record, DH_Library_1) {
        Object.defineProperty(exports, "__esModule", { value: true });
        var PurchaseRequestItemDetail = /** @class */ (function () {
            function PurchaseRequestItemDetail(options) {
                if (options.id) {
                    this.recordObj = record.load({
                        type: PurchaseRequestItemDetail.RECORD_TYPE,
                        id: options.id,
                        isDynamic: true
                    });
                }
                else if (options.recordObject) {
                    this.recordObj = options.recordObject;
                }
                else {
                    this.recordObj = record.create({
                        type: PurchaseRequestItemDetail.RECORD_TYPE,
                        isDynamic: true
                    });
                    log.debug('OBJ',options.details);
                    this.recordObj.setValue({ fieldId: 'owner', value: options.owner !== DH_Library_1.VENDOR.DARREN_HILL ? options.owner : DH_Library_1.EMPLOYEE.MIKE_HARRIS });
                    this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.Item, value: options.details.itemId });
                    this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.Quantity, value: options.details.quantity });
                    log.debug('check', !isNaN(options.details.LocationPreferredStockLevel));
                    if (!isNaN(options.details.LocationPreferredStockLevel)) {
                        this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.LocationPreferredStockLevel, value: options.details.LocationPreferredStockLevel });  /// mh added
                    }
                    this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.SalesOrderQuantity, value: options.details.quantity }); // From the Sales Order
                    this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.Location, value: options.details.locationId });
                    this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.Vendor, value: options.details.vendorId });
                    this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.PurchaseNotes, value: options.details.purchasingNotes });
                    this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.SalesOrder, value: options.details.salesOrderId });
                    this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.SalesOrderLine, value: options.details.salesOrderLine });
                    this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.IsCustomPrice, value: options.details.isCustomPrice });
                    this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.Rate, value: options.details.rate });
                    // Allow this field to be overridden by incoming EstimateCost
                    if (options.details.estimatedCost !== -1) {
                        this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.EstimatedCost, value: options.details.estimatedCost }); // This is normally sourced in from the Item
                    }
                    if (options.details.description) {
                        this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.ItemDescription, value: options.details.description });
                    }
                    if (options.details.vendorNotes) {
                        this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.VendorNotes, value: options.details.vendorNotes });
                    }
                    this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.FromSalesOrderProcess, value: options.details.fromSalesOrderProcess });
                    if (options.details.purchaseOrderType) {
                        this.recordObj.setValue({ fieldId: PurchaseRequestItemDetail.FIELD.PurchaseOrderType, value: options.details.purchaseOrderType });
                    }
                    this.recordObj = record.load({
                        type: PurchaseRequestItemDetail.RECORD_TYPE,
                        id: this.recordObj.save(),
                        isDynamic: true
                    });
                }
            }
            Object.defineProperty(PurchaseRequestItemDetail.prototype, "Id", {
                get: function () {
                    return this.recordObj.id;
                },
                enumerable: true,
                configurable: true
            });
            PurchaseRequestItemDetail.RECORD_TYPE = 'customrecord463';
            PurchaseRequestItemDetail.FIELD = {
                Date: 'custrecord212',
                ProcessingStatus: 'custrecord214',
                FiveCode: 'custrecord188',
                Item: 'custrecord187',
                Quantity: 'custrecord189',
                Location: 'custrecord192',
                Vendor: 'custrecord197',
                AddLocalStockLevel: 'custrecord207',
                ForecastNotes: 'custrecord196',
                PurchaseNotes: 'custrecord213',
                RelatedTransaction: 'custrecord215',
                LocationAverageDemand: 'custrecord193',
                LocationAvailable: 'custrecord209',
                LocationOnOrder: 'custrecord217',
                LocationPreferredStockLevel: 'custrecord237',
                CompanyAverageDemand: 'custrecord191',
                CompanyAvailable: 'custrecord210',
                CompanyOnOrder: 'custrecord219',
                MonthsOnHand: 'custrecord216',
                LeadTime: 'custrecord195',
                BusinessUnit: 'custrecord203',
                Customer: 'custrecord202',
                CreatedBy: 'custrecord208',
                EstimatedCost: 'custrecord220',
                CreatedFrom: 'custrecord190',
                FromLocation: 'custrecord211',
                SalesOrder: 'custrecord221',
                SalesOrderQuantity: 'custrecord223',
                SalesOrderLine: 'custrecord224',
                FromSalesOrderProcess: 'custrecord239',
                PurchaseOrderType: 'custrecord238',
                ItemDescription: 'custrecord_item_description_dh',
                IsCustomPrice: 'custrecord_custom_item_price',
                VendorNotes: 'custrecord_vendor_notes_dh',
                LastNegotiationDate: 'custrecord276', //MH added
                Rate: 'custrecord_tjinc_sorate'
            };
            return PurchaseRequestItemDetail;
        }());
        exports.PurchaseRequestItemDetail = PurchaseRequestItemDetail;
        var PurchaseRequestProcessingStatus;
        (function (PurchaseRequestProcessingStatus) {
            PurchaseRequestProcessingStatus["PurchaseOrder"] = "1";
            PurchaseRequestProcessingStatus["TransferOrder"] = "2";
            PurchaseRequestProcessingStatus["Reject"] = "3";
            PurchaseRequestProcessingStatus["BLANK"] = "";
        })(PurchaseRequestProcessingStatus = exports.PurchaseRequestProcessingStatus || (exports.PurchaseRequestProcessingStatus = {}));
        var CreateType;
        (function (CreateType) {
            CreateType[CreateType["PurchaseOrder"] = 1] = "PurchaseOrder";
            CreateType[CreateType["ExpeditePO"] = 2] = "ExpeditePO";
            CreateType[CreateType["DropShipPO"] = 3] = "DropShipPO";
            CreateType[CreateType["WillCallPO"] = 4] = "WillCallPO";
            CreateType[CreateType["TransferOrder"] = 5] = "TransferOrder";
        })(CreateType = exports.CreateType || (exports.CreateType = {}));
    });
