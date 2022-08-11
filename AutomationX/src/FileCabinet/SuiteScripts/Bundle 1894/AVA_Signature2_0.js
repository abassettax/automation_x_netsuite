/******************************************************************************************************
	Script Name - AVA_Signature2_0.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
* @NApiVersion 2.0
* @NModuleScope Public
*/

define(['N/record'],
	function (record) {

		var initAvaTax;
		+function () {
			//###### Metadata ######
			var AVA_Transaction_Type = new function () {
				this.SalesOrder = "SalesOrder"
					, this.SalesInvoice = "SalesInvoice"
					, this.PurchaseOrder = "PurchaseOrder"
					, this.purchaseInvoice = "purchaseInvoice"
					, this.ReturnOrder = "ReturnOrder"
					, this.ReturnInvoice = "ReturnInvoice"
					, this.InentoryTransferOrder = "InentoryTransferOrder"
					, this.InentoryTransferInvoice = "InentoryTransferInvoice"
					, this.ReverseChargeOrder = "ReverseChargeOrder"
					, this.ReverseChargeInvoice = "ReverseChargeInvoice"
					, this.Any = "Any"
			};
			var AVA_Adjustment_Reason = new function () {
				this.NotAdjusted = "NotAdjusted"
					, this.SourcingIssue = "SourcingIssue"
					, this.ReconciledWithGeneralLedger = "ReconciledWithGeneralLedger"
					, this.ExemptCertApplied = "ExemptCertApplied"
					, this.PriceAdjusted = "PriceAdjusted"
					, this.ProductReturned = "ProductReturned"
					, this.ProductExchanged = "ProductExchanged"
					, this.BadDebt = "BadDebt"
					, this.Other = "Other"
					, this.Offline = "Offline"
			};
			var AVA_TaxOverride_Types = new function () {
				this.none = "None"
					, this.taxAmount = "TaxAmount"
					, this.exemption = "Excemption"
					, this.taxDate = "TaxDate"
					, this.accruedTaxAmount = "AccruedTaxAmount"
					, this.deriveTaxable = "DeriveTaxable"
			};
			//AvaTax environment to post transaction against.
			var AVA_AvaTaxEnvironment = new function () {
				this.production = "Production"
					, this.sandbox = "Sandbox"
			};

			var AVA_Client_Profile = new function () {
				this.Name = "AvaTax jQuery SDK"
					, this.Client = "V1.0.0"
					, this.Adapter = ""
					, this.Machine = ""
			};

			var httpMethods = new function () {
				this.POST = "POST"
					, this.GET = "GET"
					, this.PUT = "PUT"
			}
			//###### End Metadata ######

			var settings = {};

			initAvaTax = function () {
				settings = {
					environment: AVA_AvaTaxEnvironment.sandbox
					, transaction: AVA_Transaction //object
					, address: AVA_Address //object
					, ping: AVA_Ping // method
					, getTaxHistory: AVA_GetTaxHistory // method
					, reconcileTax: AVA_ReconcileTaxRequest //object
					, clientProfile: AVA_Client_Profile //object
					, subscriptions: AVA_List_Subscriptions // method
					, certCapture: AVA_Cert_Capture // object
					, fetchUser: AVA_Fetch_User // method
					, company: AVA_Company // object
					, nexus: AVA_Nexus // object
					, getEntityUseCodes: AVA_ListEntityUseCodes // method
					, metadata: {
						environments: AVA_AvaTaxEnvironment
						, transactionTypes: AVA_Transaction_Type
						, taxOverrideTypes: AVA_TaxOverride_Types
						, taxAdjustmentReasons: AVA_Adjustment_Reason
					}
				}
				return settings;
			};

			// Transaction request (GetTax Request)
			var AVA_Transaction = function () {
				this.type = undefined
					, this.code = undefined
					, this.companyCode = undefined
					, this.date = undefined
					, this.salespersonCode = undefined
					, this.customerCode = undefined
					, this.entityUseCode = undefined
					, this.discount = undefined
					, this.purchaseOrderNo = undefined
					, this.exemptionNo = undefined
					, this.referenceCode = undefined
					, this.reportingLocationCode = undefined
					, this.commit = 0
					, this.batchCode = undefined
					, this.taxDate = undefined
					, this.currencyCode = undefined
					, this.serviceMode = undefined
					, this.exchangeRate = undefined
					, this.exchangeRateEffectiveDate = undefined
					, this.posLaneCode = undefined
					, this.businessIdentificationNo = undefined
					, this.isSellerImporterOfRecord = undefined
					, this.description = undefined
					, this.email = undefined
					, this.debugLevel = "Normal"
					, this.addresses = new AVA_Addresses()
					, this.Lines = []
					, this.parameters = []
					, this.taxOverride = new AVA_TaxOverride()
					, this.getNewTransactionLine = function () { return new AVA_Line(); }
					, this.getNewTransactionParameters = function () { return new AVA_Parameters(); }
					, this.post = AVA_Post_Transaction
					, this.createoradjust = AVA_CreateOrAdjust_Transaction
					, this.voided = AVA_Void_Transaction
			};

			var AVA_Line = function () {
				this.number = Math.floor(100000 + Math.random() * 900000)
					, this.quantity = undefined
					, this.amount = undefined
					, this.taxCode = undefined
					, this.entityUseCode = undefined
					, this.itemCode = undefined
					, this.exemptionCode = undefined
					, this.discounted = undefined
					, this.taxIncluded = undefined
					, this.revenueAccount = undefined
					, this.ref1 = undefined
					, this.ref2 = undefined
					, this.description = undefined
					, this.businessIdentificationNo = undefined
					, this.addresses = new AVA_Addresses()
					, this.taxOverride = AVA_TaxOverride
					, this.parameters = []
					, this.getNewTransactionLineParameters = function () { return new AVA_Parameters(); }
			};

			var AVA_Parameters = function () {
				this.name = undefined
				, this.value = undefined
				, this.unit = undefined
			};
			
			//Contains all addresses for transaction request
			var AVA_Addresses = function () {
				this.ShipFrom = AVA_Address
				, this.ShipTo = AVA_Address
				, this.PointOfOrderAcceptance = AVA_Address
				, this.PointOfOrderOrigin = AVA_Address
				, this.SingleLocation = AVA_Address
				, this.goodsPlaceOrServiceRendered = AVA_Address
				, this.import = AVA_Address
			};

			var AVA_Address = function () {
				this.locationCode = undefined
					, this.textCase = undefined
					, this.line1 = undefined
					, this.line2 = undefined
					, this.line3 = undefined
					, this.city = undefined
					, this.region = undefined
					, this.country = undefined
					, this.postalCode = undefined
					, this.latitude = undefined
					, this.longitude = undefined
					, this.validate = AVA_ValidateAddress
			};

			//private class for Tax override parameters
			var AVA_TaxOverride = function () {
				this.type = undefined
					, this.taxAmount = undefined
					, this.taxDate = undefined
					, this.reason = undefined
			};

			var AVA_ReconcileTaxRequest = function () {
				this.docStatus = undefined
					, this.companyCode = undefined
					, this.startDate = undefined
					, this.endDate = undefined
					, this.lastDocCode = 0
					, this.reconcile = AVA_ReconcileTax
			};

			var AVA_Cert_Capture = function () {
				this.customerSave = AVA_Cert_CustomerSave
					, this.customerUpdate = AVA_Cert_CustomerUpdate
					, this.certificateRequestInitiate = AVA_Cert_Request_Initiate
					, this.certificateRequestGet = AVA_Cert_Request_Get
					, this.certificateGet = AVA_Cert_Get
					, this.certificateImageGet = AVA_Cert_Image_Get
					, this.customer = AVA_Cert_Customer
					, this.invitation = AVA_Create_CertInvitation
			};
			var AVA_Cert_Customer = function () {
				this.companyId = 0
					, this.customerCode = undefined
					, this.name = undefined
					, this.attnName = undefined
					, this.line1 = undefined
					, this.line2 = undefined
					, this.city = undefined
					, this.postalCode = undefined
					, this.phoneNumber = undefined
					, this.faxNumber = undefined
					, this.emailAddress = undefined
					, this.contactName = undefined
					, this.country = undefined
					, this.region = undefined
			};
			var AVA_Create_CertInvitation = function () {
				this.recipient = undefined
					, this.coverLetterTitle = undefined
					, this.deliveryMethod = undefined
			};

			var AVA_Company = function () {
				this.id = undefined
					, this.accountId = undefined
					, this.companyCode = undefined
					, this.name = undefined
					, this.isDefault = undefined
					, this.defaultLocationId = undefined
					, this.isActive = undefined
					, this.taxpayerIdNumber = undefined
					, this.hasProfile = undefined
					, this.isReportingEntity = undefined
					, this.defaultCountry = undefined
					, this.baseCurrencyCode = undefined
					, this.roundingLevelId = undefined
					, this.warningsEnabled = undefined
					, this.isTest = undefined
					, this.taxDependencyLevevlId = undefined
					, this.inProgress = undefined
					, this.businessIdentificationNo = undefined
					, this.contacts = []
					, this.newContact = function () { return new AVA_Contact(); }
					, this.create = AVA_Create_Company
					, this.fetchAll = AVA_Fetch_Companies
			};
			var AVA_Contact = function () {
				this.contactCode = undefined
					, this.firstName = undefined
					, this.middleName = undefined
					, this.lastName = undefined
					, this.title = undefined
					, this.line1 = undefined
					, this.line2 = undefined
					, this.line3 = undefined
					, this.city = undefined
					, this.region = undefined
					, this.postalCode = undefined
					, this.country = undefined
					, this.email = undefined
					, this.phone = undefined
					, this.mobile = undefined
					, this.fax = undefined
			};
			var AVA_Nexus = function () {
				this.fetchRequestObject = function () { return new AVA_Nexus_Fetch_Request(); }
					, this.fetchRequest = []
					, this.fetchFiltered = AVA_Fetch_Nexus
					, this.post = AVA_Post_Nexus
			}
			var AVA_Nexus_Fetch_Request = function () {
				this.country = undefined
					, this.states = []
			}
			// ###### Core Methods ######
			var AVA_Post_Transaction = function (accountDetails) {
				var data = JSON.stringify(this, null, 4);
				var apiUrl = "/api/v2/transactions/create";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.POST, apiUrl, data);
				return requestSettings;
			};
			var AVA_ReconcileTax = function (accountDetails) {
				var data = undefined;
				var apiUrl = "/api/v2/companies/" + this.companyCode + "/transactions?$filter=status eq " + this.docStatus + " and Date ge " + this.startDate + " and Date le " + this.endDate + (this.lastDocCode ? " and code gt '" + this.lastDocCode + "'" : '') + "&$orderBy=code";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.GET, apiUrl, data);
				return requestSettings;
			};
			var AVA_GetTaxHistory = function (accountDetails, docType, docCode, companyCode) {
				var data = undefined;
				var apiUrl = "/api/v2/companies/" + companyCode + "/transactions/" + docCode + "?documentType=" + docType + "&$include=details";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.GET, apiUrl, data);
				return requestSettings;
			};
			var AVA_ValidateAddress = function (accountDetails) {
				var data = JSON.stringify(this, replacer);
				var apiUrl = "/api/v2/addresses/resolve";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.POST, apiUrl, data);
				return requestSettings;
			};
			var AVA_Ping = function (accountDetails) {
				var data = undefined;
				var apiUrl = "/api/v2/utilities/ping";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.GET, apiUrl, data);
				return requestSettings;
			};
			var AVA_Authenticate = function (accountDetails) {
				var data = undefined;
				var apiUrl = "/api/v2/utilities/ping";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.GET, apiUrl, data);
				return requestSettings;
			};
			var AVA_List_Subscriptions = function (accountDetails) {
				var data = undefined;
				var apiUrl = "/api/v2/utilities/subscriptions";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.GET, apiUrl, data);
				return requestSettings;
			};
			var AVA_CreateOrAdjust_Transaction = function (accountDetails) {
				var apiUrl = "/api/v2/transactions/createoradjust";
				var data = JSON.stringify({
					createTransactionModel: this
				}, null, 4);
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.POST, apiUrl, data);
				return requestSettings;
			};
			var AVA_Void_Transaction = function (accountDetails, companyCode, transactionCode, voidReason) {
				var apiUrl = "/api/v2/companies/" + companyCode + "/transactions/" + transactionCode + "/void";
				var data = JSON.stringify({ code: voidReason }, null, 4);
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.POST, apiUrl, data);
				return requestSettings;
			};
			var AVA_Cert_CustomerSave = function (accountDetails, companyId, customers) {
				var data = JSON.stringify(customers, replacer);
				var apiUrl = "/api/v2/companies/" + companyId + "/customers";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.POST, apiUrl, data);
				return requestSettings;
			};
			var AVA_Cert_CustomerUpdate = function(accountDetails, companyId, customerCode, customers) {
				var data = JSON.stringify(customers, replacer);
				var apiUrl = "/api/v2/companies/" + companyId + "/customers/" + customerCode;
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.PUT, apiUrl, data);
				return requestSettings;
			};
			var AVA_Cert_Request_Initiate = function (accountDetails, companyId, customerCode, invitations) {
				var data = JSON.stringify(invitations, replacer);
				var apiUrl = "/api/v2/companies/" + companyId + "/customers/" + customerCode + "/certexpressinvites";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.POST, apiUrl, data);
				return requestSettings;
			};
			var AVA_Cert_Request_Get = function (accountDetails, companyId, customerCode) {
				var data = undefined;
				var apiUrl = "/api/v2/companies/" + companyId + "/certexpressinvites?$filter=customerCode eq " + customerCode;
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.GET, apiUrl, data);
				return requestSettings;
			};
			var AVA_Cert_Get = function (accountDetails, companyId, customerCode) {
				var data = undefined;
				var apiUrl = "/api/v2/companies/" + companyId + "/customers/" + customerCode + "/certificates";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.GET, apiUrl, data);
				return requestSettings;
			};
			var AVA_Cert_Image_Get = function (accountDetails, companyId, certId, type, page) {
				var data = undefined;
				var apiUrl = "/api/v2/companies/" + companyId + "/certificates/" + certId + "/attachment?$type=" + type;
				if (page) {
					apiUrl += "&$page=" + page;
				}
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.GET, apiUrl, data);
				return requestSettings;
			};
			var AVA_Fetch_User = function (avaTaxUserName, avaTaxPassword, accountId) {
				var data = undefined;
				var apiUrl = "/api/v2/users?$filter=userName eq " + avaTaxUserName;
				var requestSettings = AVA_Get_Request_Settings(avaTaxUserName, avaTaxPassword, httpMethods.GET, apiUrl, data);
				return requestSettings;
			};
			var AVA_Fetch_Nexus = function (accountDetails, nexusFilter) {
				var data = undefined;
				var apiUrl = "/api/v2/definitions/nexus?$filter=" + mapFilter(nexusFilter);
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.GET, apiUrl, data);
				return requestSettings;
			};
			var AVA_Post_Nexus = function (accountDetails, companyId, nexusList) {
				var data = JSON.stringify(nexusList, replacer);;
				var apiUrl = "/api/v2/companies/" + companyId + "/nexus";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.POST, apiUrl, data);
				return requestSettings;
			};
			var AVA_Create_Company = function (accountDetails) {
				var data = JSON.stringify(this, replacer);
				var apiUrl = "/api/v2/companies";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.POST, apiUrl, data);
				return requestSettings;
			};
			var AVA_Fetch_Companies = function (accountDetails, nextLink) {
				var data = undefined;
				var apiUrl = (nextLink != null && nextLink.length > 0) ? nextLink : "/api/v2/companies";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.GET, apiUrl, data);
				return requestSettings;
			};
			var AVA_ListEntityUseCodes = function (accountDetails) {
				var data = undefined;
				var apiUrl = "/api/v2/definitions/entityusecodes";
				var requestSettings = AVA_Get_Request_Settings(accountDetails, httpMethods.GET, apiUrl, data);
				return requestSettings;
			};
			// ###### End Core Methods ######

			var AVA_Get_Request_Settings = function (accountDetails, verb, apiUrl, data) {
				var url = Get_AVA_Environment_URL(settings.environment);
				var header = {};
				url = url + apiUrl;
				header["Authorization"] = "Basic " + accountDetails;
				header["content-type"] = "application/json";
				header["X-Avalara-client"] = AVA_Client_Profile.Client + 'v2; a0o5a000007SyMPAA0';

				return {
					async: true,
					method: verb,
					url: url,
					crossDomain: true,
					headers: header,
					data: verb != "GET" ? data : undefined
				};
			};
			var Get_AVA_Environment_URL = function (environment) {
				switch (environment.toUpperCase()) {
					case "PRODUCTION": { return "https://rest.avatax.com"; }
					case "SANDBOX": { return "https://sandbox-rest.avatax.com"; }
					default: {
						if (!environment)
							throw new Error('AvaTax Environment should be \'Production\' or \'Sandbox\'');
						throw new Error('AvaTax environment is not defined.');
					}
				}
			};

			function LTrim(str) {
				for (var i = 0; ((str.charAt(i) <= " ") && (str.charAt(i) != "")); i++);
				return str.substring(i, str.length);
			};
			function RTrim(str) {
				for (var i = str.length - 1; ((str.charAt(i) <= " ") && (str.charAt(i) != "")); i--);
				return str.substring(0, i + 1);
			};
			function Trim(str) {
				return LTrim(RTrim(str));
			};
			function replacer(key, value) {
				if (typeof value == "number" && !isFinite(value)) {
					return String(value);
				}
				return value;
			}
			function mapFilter(nexusFilter) {
				var filter = "(((country = " + nexusFilter.map(function (q) { return q.country; }).join(' or country = ') + ") and jurisTypeId = CNT) or ((";
				for (var i in nexusFilter) {
					if (i > 0)
						filter += ' or ';
					filter += "(country= " + nexusFilter[i].country + " and (region = " + nexusFilter[i].states.join(" or region = ") + "))";
				}
				filter += ") and jurisTypeId= STA)) and (nexusTaxTypeGroup=SalesAndUse or nexusTaxTypeGroup=InputAndOutput)";
				return filter;
			}
		}();

		return {
			initAvaTax: initAvaTax
		}
	});