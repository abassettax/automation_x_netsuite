/******************************************************************************************************
	Script Name - AVA_Library.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
* @NApiVersion 2.0
* @NModuleScope Public
*/

define(['N/record', 'N/search', 'N/runtime', 'N/https', 'N/format', 'N/url', '../AVA_Signature2_0'],
    function (record, search, runtime, https, format, url, ava_signature) {
        var mainReturnObj, addressRecord;
        var AVA_ClientAtt = 'NetSuite Basic 8.0';
        function executeLibraryFunction(functionName, JSONObj){
			switch(functionName){
				case 'AVA_CheckCountryName':
					mainReturnObj = AVA_CheckCountryName(JSONObj);
					break;
					
				case 'AVA_LoadValuesToGlobals':
					mainReturnObj = AVA_LoadValuesToGlobals(JSONObj);
					break;
						
				case 'AVA_ReadConfig':
					mainReturnObj = AVA_ReadConfig(JSONObj);
					break;
						
				case 'AVA_CheckService':
					mainReturnObj = AVA_CheckService(JSONObj);
					break;
						
				case 'AVA_CheckSecurity':
					mainReturnObj = AVA_CheckSecurity(JSONObj);
					break;
						
				case 'AVA_GetSuiteletParameter':
					mainReturnObj = AVA_GetSuiteletParameter(JSONObj);
					break;
						
				case 'Trim':
					mainReturnObj = Trim(JSONObj);
					break;
						
				case 'AVA_NoticePage':
					mainReturnObj = AVA_NoticePage(JSONObj);
					break;
						
				case 'AVA_InitSignatureObject':
					mainReturnObj = AVA_InitSignatureObject(JSONObj);
					break;
						
				case 'AVA_Logs':
					mainReturnObj = AVA_Logs(JSONObj);
					break;
						
				case 'AVA_CompanyFetch':
					mainReturnObj = AVA_CompanyFetch(JSONObj);
					break;
						
				case 'AVA_ClientAtt':
					mainReturnObj = AVA_ClientAtt;
					break;
						
						
				case 'AVA_GetMonthName':
					mainReturnObj = AVA_GetMonthName(JSONObj);
					break;
						
				case 'AVA_ConvertDate':
					mainReturnObj = AVA_ConvertDate(JSONObj);
					break;
						
				case 'AVA_DateFormat':
					mainReturnObj = AVA_DateFormat(JSONObj);
					break;
						
				case 'AVA_ErrorCodeDesc':
					mainReturnObj = AVA_ErrorCodeDesc(JSONObj);
					break;
						
				case 'AVA_CheckVatCountries': 
					mainReturnObj = AVA_CheckVatCountries(JSONObj);
					break;
						
				default:
					break;
			}

            return mainReturnObj;
        }
        
        function AVA_InitSignatureObject(serviceUrl){
    	 	var AvaTax = {};
        	AvaTax = ava_signature.initAvaTax();
        	AvaTax.environment = (serviceUrl == '1') ? 'Sandbox' : 'Production';
        	AvaTax.clientProfile.Name = runtime.getCurrentUser().name;
        	AvaTax.clientProfile.Client = 'NetSuite Basic ' + runtime.version + ' || ' + AVA_ClientAtt.substr(15);
        	return AvaTax;
        }
        
        function AVA_CheckService(ServiceType){
            var avaConfigObjRecvd;
            var AVA_Message = 'This service is not enabled in your AvaTax account. Please contact Avalara support.';
            var AVA_Notice = 0;
            try{
                avaConfigObjRecvd = AVA_LoadValuesToGlobals();
                if(avaConfigObjRecvd["AVA_ServiceTypes"] == null || avaConfigObjRecvd["AVA_ServiceTypes"].search(ServiceType) == -1){
                    AVA_Notice = AVA_NoticePage(AVA_Message);
                }
            }
            catch(err){
                AVA_Notice = AVA_NoticePage(AVA_Message);
            }
            return AVA_Notice;
        }

        function AVA_CheckSecurity(SuiteletNumber) {
            var AVA_Message = 'You do not have access to this functionality. Contact the system administrator';

            try {
                var RoleId = runtime.getCurrentUser().role;
                if (RoleId != 3) {
                    var AssignedRoleID = AVA_GetSuiteletParameter(SuiteletNumber);

                    var RoleExists = 'F';

                    for (var i = 0; AssignedRoleID != null && AssignedRoleID != 'Error' && i < AssignedRoleID.length; i++) {
                        if (AssignedRoleID[i] == RoleId) {
                            RoleExists = 'T';
                            break;
                        }
                    }

                    if (RoleExists == 'F') {
                        return AVA_NoticePage(AVA_Message);
                    }
                    else {
                        return 0;
                    }
                }
                else {
                    return 0;
                }

            }
            catch (err) {
            	return AVA_NoticePage(AVA_Message);
            }

        }
        
		function AVA_Logs(logDetails){
			var cliAppVersion = 'a0o5a000007SyMPAA0';
			logDetails = logDetails.split('~~');
			var logArray = {};
			
			logArray.CallerAccuNum     = logDetails[0];
			logArray.LogType           = logDetails[8];
			logArray.LogLevel          = logDetails[9];
			logArray.ConnectorName     = 'NetSuite Basic ' + runtime.version + ' || ' + AVA_ClientAtt.substr(15) + 'v2; ' + cliAppVersion;
			logArray.ConnectorVersion  = AVA_ClientAtt;
			logArray.ERPName           = 'NetSuite Basic';
			logArray.ERPversion        = runtime.version;
			logArray.ClientString      = AVA_ClientAtt;
			logArray.Operation         = logDetails[7];
			logArray.AvaTaxEnvironment = (logDetails[1] == '0' ? 'Production' : 'Sandbox');
			logArray.Source            = logDetails[10];
			logArray.FunctionName      = logDetails[11];
			logArray.Message           = logDetails[12];
			
			if(logDetails[14] == 0){
				logArray.DocCode          = (logDetails[4] != null && logDetails[4].length > 0) ? logDetails[4] : '';
				logArray.LineCount        = logDetails[2];
				logArray.EventBlock       = logDetails[3];
				logArray.DocType          = logDetails[16];
				logArray.ConnectorTime 	  = logDetails[5];
				logArray.ConnectorLatency = logDetails[6];
			}
			
			if(logDetails[9] == 'Exception'){
				logArray.LogMessageType = logDetails[13];
			}
			
			var loggerUrl = (logDetails[1] == '0') ? 'https://ceplogger.avalara.com/api/logger/a0n4000000CiXBWAA3' : 'https://ceplogger.sbx.avalara.com/api/logger/a0n4000000CiXBWAA3';
			logArray = JSON.stringify(logArray);
			
			var header = {};
			header['Authorization'] = 'Basic ' + logDetails[17];
			header['Content-Type'] = 'application/json';
			header['X-Avalara-client'] = AVA_ClientAtt + 'v2; ' + cliAppVersion;
			
			try{
				if(logDetails[15] == 0){
					https.post.promise({
						url: loggerUrl,
						body: logArray,
						headers: header
					});
				}
				else{
					https.post({
						url: loggerUrl,
						body: logArray,
						headers: header
					});
				}
			}
			catch(err){
				log.debug('AVA_Logs err code', err.code);
				log.debug('AVA_Logs err message', err.message);
			}
			
			return '';
		}
		
		function AVA_CompanyFetch(details){
			var nextLink = '', j = 0;
			details = details.split('~~');
			var AvaTax = AVA_InitSignatureObject(details[1]);
			var AVA_CompanyInfo = new Array();
			var company = new AvaTax.company();
			
			try{
				do{
					var fetchAll = company.fetchAll(details[0], nextLink);
					var response = https.get({
						url: fetchAll.url,
						headers: fetchAll.headers
					});
					
					if(response.code == 200){
						var responseBody = JSON.parse(response.body);
						var values = responseBody.value;
						
						for(var i = 0; values != null && i < values.length; i++){
							AVA_CompanyInfo[j] = new Array();
							AVA_CompanyInfo[j][0] = values[i].companyCode;
							AVA_CompanyInfo[j][1] = values[i].name;
							AVA_CompanyInfo[j][2] = values[i].id;
							j++;
						}
						
						nextLink = responseBody['@nextLink'];
					}
					else{
						var responseBody = JSON.parse(response.body);
						log.debug({
							title: 'AVA_CompanyFetch error response code',
							details: response.code
						});
						log.debug({
							title: 'AVA_CompanyFetch error',
							details: responseBody.error.details[0].description
						});
					}
				}
				while(nextLink != null && nextLink.length > 0);
			}
			catch(err){
				log.debug({
					title: 'AVA_CompanyFetch Try/Catch',
					details: err.message
				});
			}
			
			return AVA_CompanyInfo;
		}

		function AVA_GetSuiteletParameter(SuiteletNumber){
		    var RoleIds = new Array()
		    var scriptObj = runtime.getCurrentScript();
		    try{
		        switch (SuiteletNumber){
		            case 1:
		                //AVA_CommittedList_Suitlet 
		            	RoleIds = scriptObj.getParameter({ name: 'custscript_committedlistroleid' }).split(',');
					    break;
					
					case 2:
					    //AVA_Config_Suitlet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_configroleid' }).split(',');
					    break;
					
					case 3:
					    //AVA_CustomerList_Suitlet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_customerlistroleid' }).split(',');
					    break;
					
					case 4:
					    //AVA_EntityUseForm_Suitlet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_entityuseformroleid' }).split(',');
					    break;
					
					case 5:
					    //AVA_EntityUseList_Suitlet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_entityuselistroleid' }).split(',');
					    break;
					
					case 6:
					    //AVA_GetTaxHistory_Suitelet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_gettaxhistoryroleid' }).split(',');
					    break;
					
					case 7:
					    //AVA_ReconcileResultList_Suitelet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_reconcilelistroleid' }).split(',');
					    break;
					
					case 8:
					    //AVA_ReconciliationResult_Suitelet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_reconciliationresultroleid' }).split(',');
					    break;
					
					case 9:
					    //AVA_Reconciliation_Suitelet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_reconciliationroleid' }).split(',');
					    break;
					
					case 10:
					    //AVA_ShippingCodeForm_Suitlet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_shippingcoderoleid' }).split(',');
					    break;
					
					case 11:
					    //AVA_ShippingCodeList_Suitlet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_shippinglistroleid' }).split(',');
					    break;
					
					case 12:
					    //AVA_TransactionList_Suitelet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_transactionlistroleid' }).split(',');
					    break;
					
					case 13:
					    //AVA_VoidedList_Suitelet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_voidedlistroleid' }).split(',');
					    break;
					
					case 14:
					    //AVA_EntityMap_Suitlet
						RoleIds = scriptObj.getParameter({ name: 'custscript_entitymaproleid' }).split(',');
					    break;
					
					case 15:
					    //AVA_TransactionLog_Suitelet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_logroleid' }).split(',');
					    break;
					
					case 16:
					    //AVA_AddressValidation_Suitlet
						RoleIds = scriptObj.getParameter({ name: 'custscript_addressassistantroleid' }).split(',');
					    break;
					
					case 17:
					    //AVA_AddressValidationResult_Suitelet
						RoleIds = scriptObj.getParameter({ name: 'custscript_addressresultsroleid' }).split(',');
					    break;
					
					case 18:
					    //AVA_AddressValidationResultList_Suitelet
						RoleIds = scriptObj.getParameter({ name: 'custscript_addressresultslistroleid' }).split(',');
					    break;
					
					case 19:
					    //AVA_QuickAddressValidation_Suitlet
						RoleIds = scriptObj.getParameter({ name: 'custscript_addressquickvalidateroleid' }).split(',');
					    break;
					
					case 20:
					    //AVA_RecalculateUtility_Suitelet 
						RoleIds = scriptObj.getParameter({ name: 'custscript_recalcroleid' }).split(',');
					    break;
					
					case 21:
					    //AVA_ViewRecalculationBatches_Suitelet  
						RoleIds = scriptObj.getParameter({ name: 'custscript_viewbatchesroleid' }).split(',');
					    break;
					    
					case 22:
					    break;
					
					case 23:
					    break;
					
					case 24:
					    //AVA_GetCertificates_Suitlet  
						RoleIds = scriptObj.getParameter({ name: 'custscript_getcertificatesroleid' }).split(',');
					    break;
					
					case 25:
					    //AVA_GetCertImage_SuiteLet  
						RoleIds = scriptObj.getParameter({ name: 'custscript_certimageroleid' }).split(',');
					    break;
					
					case 26:
					    //AVA_Certificates_Suitelet  
						RoleIds = scriptObj.getParameter({ name: 'custscript_certificatesroleid' }).split(',');
					    break;
					
					case 27:
					    //AVA_GetCertificatesStatus_Suitelet  
						RoleIds = scriptObj.getParameter({ name: 'custscript_certificatestatusroleid' }).split(',');
					    break;
					
					case 28:
					    //AVA_CreateCompany_Suitelet  
						RoleIds = scriptObj.getParameter({ name: 'custscript_createcomproleid' }).split(',');
					    break;
					
					default:
					    RoleIds = 'Error';
			    	break;
			
			    }
			}
			catch(err){
			    RoleIds = 'Error';
			}
		
		    return RoleIds;
		}

        function Trim(str) {
            return LTrim(RTrim(str));
        }
        
        function LTrim(str) {
            for (var i = 0; ((str.charAt(i) <= " ") && (str.charAt(i) != "")); i++);
            return str.substring(i, str.length);
        }
        
        function RTrim(str) {
            for (var i = str.length - 1; ((str.charAt(i) <= " ") && (str.charAt(i) != "")); i--);
            return str.substring(0, i + 1);
        }
        
        function AVA_ReadConfig(type) {
            var avaConfigObjRecvd;
            avaConfigObjRecvd = AVA_LoadValuesToGlobals();

            // Above commented code needs to be revisited while working on User Event Scripts.

            return avaConfigObjRecvd;
        }

        function AVA_NoticePage(AVA_Message) {
            var redirecttype = 'history.back()';
            var AVA_NoticeError = '<html><link rel="stylesheet" href="/core/styles/pagestyles.nl?ct=-142&bglt=EEEEEE&bgmd=FFEBC2&bgdk=787878&bgon=211F5E&bgoff=FFCC66&bgbar=211F5E&tasktitletext=FFCC66&crumbtext=FFD88A&headertext=B39163&ontab=FFFFFF&offtab=000033&text=000000&link=000000&bgbody=FFFFFF&bghead=FFFFFF&portlet=D3D2DF&portletlabel=000000&bgbutton=FFE599&bgrequiredfld=FFFFE5&font=Verdana%2CHelvetica%2Csans-serif&size_site_content=8pt&size_site_title=8pt&size=1.0&nlinputstyles=T&NS_VER=2007.0.5">' +
                '<body bgcolor="#FFFFFF" link="#000000" vlink="#000000" alink="#330099" text="#000000" topmargin=0 marginheight=1>' +
                '<img src="/images/nav/stretch.gif" width="10">' +
                '<img src="/images/logos/netsuite30.gif" border=0>' +
                '<TABLE border=0 cellPadding=0 cellSpacing=0 width=100%>' +
                '<tr><td class=bglt>' +
                '<table border=0 cellspacing=0 cellpadding=5 width=100%>' +
                '<tr><td class=textboldnolink>Notice</td></tr>' +
                '<tr><td vAlign=top><table border=0 cellspacing=0 cellpadding=0 width=100%>' +
                '<TR><TD class=text>&nbsp;</TD></TR>' +
                '<tr><td class=text><img src="/images/5square.gif" width=5 height=5>\t' + AVA_Message + '</td></tr>' +
                '<TR><TD class=text>&nbsp;</TD></TR>' +
                '</table></td>' +
                '</tr>' +
                '</TABLE></TD>' +
                '<tr><TD style="" >' +
                '<table id="tbl_goback" cellpadding=0 cellspacing=0 border=0 style="cursor:hand;">' +
                '<TR><TD class=text>&nbsp;</TD></TR>' +
                '<tr>' +
                '<td nowrap class="rndbuttoncaps" background="/images/buttons/upper_left_cap.gif"><img src="/images/nav/stretch.gif" border=0 width=4></td>' +
                '<TD height=20 valign="bottom" nowrap class="rndbuttonbody" background="/images/buttons/upper_body.gif" style="padding-top:2">' +
                '<INPUT type="button" style="vertical-align:middle; " class="rndbuttoninpt" value="Go Back" id="goback" name="goback" onclick="' + redirecttype + ';return false;" ></TD>' +
                '<td nowrap class="rndbuttoncaps" background="/images/buttons/upper_right_cap.gif"><img src="/images/nav/stretch.gif" border=0 width=4></td>' +
                '</tr>' +
                '</table></TD>' +
                '</tr>' +
                '</TABLE></HTML>';
            return AVA_NoticeError;
        }

        function AVA_LoadValuesToGlobals() {
            var avaConfigObj = {};
            var search_AvaConfig = search.create({
                type: 'customrecord_avaconfig',
                filters: ['isinactive', 'is', 'F'],
                columns:
                    [
                        "custrecord_ava_accountvalue",
                        "custrecord_ava_url",
                        "custrecord_ava_expirydate",
                        "custrecord_ava_servicetypes",
                        "custrecord_ava_defcompanycode",
                        "custrecord_ava_compid",
                        "custrecord_ava_configflag",
                        "custrecord_ava_udf1",
                        "custrecord_ava_udf2",
                        "custrecord_ava_entityusecode",
                        "custrecord_ava_itemaccount",
                        "custrecord_ava_enablelogentries",
                        "custrecord_ava_taxcodemapping",
                        "custrecord_ava_taxcodepreced",
                        "custrecord_ava_defshipcode",
                        "custrecord_ava_customercode",
                        "custrecord_ava_markcusttaxable",
                        "custrecord_ava_defaultcustomer",
                        "custrecord_ava_billtimename",
                        "custrecord_ava_showmessages",
                        "custrecord_ava_disabletax",
                        "custrecord_ava_disabletaxquotes",
                        "custrecord_ava_disabletaxsalesorder",
                        "custrecord_ava_disableline",
                        "custrecord_ava_taxondemand",
                        "custrecord_ava_deftaxcode",
                        "custrecord_ava_enablelogging",
                        "custrecord_ava_decimalplaces",
                        "custrecord_ava_taxrate",
                        "custrecord_ava_usepostingdate",
                        "custrecord_ava_taxinclude",
                        "custrecord_ava_enablediscount",
                        "custrecord_ava_discountmapping",
                        "custrecord_ava_discounttaxcode",
                        "custrecord_ava_disableloccode",
                        "custrecord_ava_enableupccode",
                        "custrecord_ava_useinvoiceaddress",
                        "custrecord_ava_committrans",
                        "custrecord_ava_abortbulkbilling",
                        "custrecord_ava_abortuserinterfaces",
                        "custrecord_ava_abortwebservices",
                        "custrecord_ava_abortcsvimports",
                        "custrecord_ava_abortscheduledscripts",
                        "custrecord_ava_abortsuitelets",
                        "custrecord_ava_abortworkflowscripts",
                        "custrecord_ava_enableusetax",
                        "custrecord_ava_vendorcode",
                        "custrecord_ava_glaccounts",
                        "custrecord_ava_usetaxcredit",
                        "custrecord_ava_usetaxdebit",
                        "custrecord_ava_billapproved",
                        "custrecord_ava_autoassessbill",
                        "custrecord_ava_vendortaxitem",
                        "custrecord_ava_taxaccrualdate",
                        "custrecord_ava_enablevatin",
                        "custrecord_ava_addressee",
                        "custrecord_ava_address1",
                        "custrecord_ava_address2",
                        "custrecord_ava_city",
                        "custrecord_ava_state",
                        "custrecord_ava_zip",
                        "custrecord_ava_country",
                        "custrecord_ava_disableaddvalidation",
                        "custrecord_ava_adduppercase",
                        "custrecord_ava_addbatchprocessing",
                        "custrecord_ava_enableaddvalontran",
                        "custrecord_ava_enableaddvalflag",
                        "custrecord_ava_additionalinfo",
                        "custrecord_ava_additionalinfo1",
                        "custrecord_ava_additionalinfo2"
                    ]
            });
			
			var searchResult = search_AvaConfig.run();
            searchResult.each(function (result) {
                avaConfigObj["AVA_AccountValue"] = result.getValue('custrecord_ava_accountvalue');
                avaConfigObj["AVA_ServiceUrl"] = result.getValue('custrecord_ava_url');
                avaConfigObj["AVA_ExpiryDate"] = result.getValue('custrecord_ava_expirydate');
                avaConfigObj["AVA_ServiceTypes"] = result.getValue('custrecord_ava_servicetypes');
                avaConfigObj["AVA_DefCompanyCode"] = result.getValue('custrecord_ava_defcompanycode');
                avaConfigObj["AVA_DefCompanyId"] = result.getValue('custrecord_ava_compid');
                avaConfigObj["AVA_ConfigFlag"] = result.getValue('custrecord_ava_configflag');

                avaConfigObj["AVA_UDF1"] = result.getValue('custrecord_ava_udf1');
                avaConfigObj["AVA_UDF2"] = result.getValue('custrecord_ava_udf2');
                avaConfigObj["AVA_EntityUseCode"] = result.getValue('custrecord_ava_entityusecode');
                avaConfigObj["AVA_ItemAccount"] = result.getValue('custrecord_ava_itemaccount');
                avaConfigObj["AVA_EnableLogEntries"] = result.getValue('custrecord_ava_enablelogentries');
                avaConfigObj["AVA_TaxCodeMapping"] = result.getValue('custrecord_ava_taxcodemapping');
                avaConfigObj["AVA_TaxCodePrecedence"] = result.getValue('custrecord_ava_taxcodepreced');
                avaConfigObj["AVA_DefaultShippingCode"] = result.getValue('custrecord_ava_defshipcode');
                avaConfigObj["AVA_CustomerCode"] = result.getValue('custrecord_ava_customercode');
                avaConfigObj["AVA_MarkCustTaxable"] = result.getValue('custrecord_ava_markcusttaxable');
                avaConfigObj["AVA_DefaultCustomerTaxcode"] = result.getValue('custrecord_ava_defaultcustomer');
                avaConfigObj["AVA_BillableTimeName"] = result.getValue('custrecord_ava_billtimename');
                avaConfigObj["AVA_ShowMessages"] = result.getValue('custrecord_ava_showmessages');

                avaConfigObj["AVA_DisableTax"] = result.getValue('custrecord_ava_disabletax');
                avaConfigObj["AVA_DisableTaxQuote"] = result.getValue('custrecord_ava_disabletaxquotes');
                avaConfigObj["AVA_DisableTaxSalesOrder"] = result.getValue('custrecord_ava_disabletaxsalesorder');
                avaConfigObj["AVA_DisableLine"] = result.getValue('custrecord_ava_disableline');
                avaConfigObj["AVA_CalculateonDemand"] = result.getValue('custrecord_ava_taxondemand');
                avaConfigObj["AVA_DefaultTaxCode"] = result.getValue('custrecord_ava_deftaxcode');
                avaConfigObj["AVA_EnableLogging"] = result.getValue('custrecord_ava_enablelogging');
                avaConfigObj["AVA_DecimalPlaces"] = result.getValue('custrecord_ava_decimalplaces');
                avaConfigObj["AVA_TaxRate"] = result.getValue('custrecord_ava_taxrate');
                avaConfigObj["AVA_UsePostingPeriod"] = result.getValue('custrecord_ava_usepostingdate');
                avaConfigObj["AVA_CommitTransaction"] = result.getValue('custrecord_ava_committrans');
                avaConfigObj["AVA_TaxInclude"] = result.getValue('custrecord_ava_taxinclude');
                avaConfigObj["AVA_EnableDiscount"] = result.getValue('custrecord_ava_enablediscount');
                avaConfigObj["AVA_DiscountMapping"] = result.getValue('custrecord_ava_discountmapping');
                avaConfigObj["AVA_DiscountTaxCode"] = result.getValue('custrecord_ava_discounttaxcode');
                avaConfigObj["AVA_DisableLocationCode"] = result.getValue('custrecord_ava_disableloccode');
                avaConfigObj["AVA_EnableUpcCode"] = result.getValue('custrecord_ava_enableupccode');
                avaConfigObj["AVA_UseInvoiceAddress"] = result.getValue('custrecord_ava_useinvoiceaddress');

                avaConfigObj["AVA_AbortBulkBilling"] = result.getValue('custrecord_ava_abortbulkbilling');
                avaConfigObj["AVA_AbortUserInterfaces"] = result.getValue('custrecord_ava_abortuserinterfaces');
                avaConfigObj["AVA_AbortWebServices"] = result.getValue('custrecord_ava_abortwebservices');
                avaConfigObj["AVA_AbortCSVImports"] = result.getValue('custrecord_ava_abortcsvimports');
                avaConfigObj["AVA_AbortScheduledScripts"] = result.getValue('custrecord_ava_abortscheduledscripts');
                avaConfigObj["AVA_AbortSuitelets"] = result.getValue('custrecord_ava_abortsuitelets');
                avaConfigObj["AVA_AbortWorkflowActionScripts"] = result.getValue('custrecord_ava_abortworkflowscripts');

                avaConfigObj["AVA_EnableUseTax"] = result.getValue('custrecord_ava_enableusetax');
                avaConfigObj["AVA_VendorCode"] = result.getValue('custrecord_ava_vendorcode');
                avaConfigObj["AVA_GlAccounts"] = result.getValue('custrecord_ava_glaccounts');
                avaConfigObj["AVA_UseTaxCredit"] = result.getValue('custrecord_ava_usetaxcredit');
                avaConfigObj["AVA_UseTaxDebit"] = result.getValue('custrecord_ava_usetaxdebit');
                avaConfigObj["AVA_BillApproved"] = result.getValue('custrecord_ava_billapproved');
                avaConfigObj["AVA_AutoAssessImportBill"] = result.getValue('custrecord_ava_autoassessbill');
                avaConfigObj["AVA_VendorTaxItem"] = result.getValue('custrecord_ava_vendortaxitem');
                avaConfigObj["AVA_TaxAccrualDate"] = result.getValue('custrecord_ava_taxaccrualdate');
                avaConfigObj["AVA_EnableVatIn"] = result.getValue('custrecord_ava_enablevatin');

                avaConfigObj["AVA_Def_Addressee"] = result.getValue('custrecord_ava_addressee');
                avaConfigObj["AVA_Def_Addr1"] = result.getValue('custrecord_ava_address1');
                avaConfigObj["AVA_Def_Addr2"] = result.getValue('custrecord_ava_address2');
                avaConfigObj["AVA_Def_City"] = result.getValue('custrecord_ava_city');
                avaConfigObj["AVA_Def_State"] = result.getValue('custrecord_ava_state');
                avaConfigObj["AVA_Def_Zip"] = result.getValue('custrecord_ava_zip');
                var ReturnCountryName = AVA_CheckCountryName(result.getValue('custrecord_ava_country'));
                avaConfigObj["AVA_Def_Country"] = ReturnCountryName[1];

                avaConfigObj["AVA_DisableAddValidation"] = result.getValue('custrecord_ava_disableaddvalidation');
                avaConfigObj["AVA_AddUpperCase"] = result.getValue('custrecord_ava_adduppercase');
                avaConfigObj["AVA_AddBatchProcessing"] = result.getValue('custrecord_ava_addbatchprocessing');
                avaConfigObj["AVA_EnableAddValonTran"] = result.getValue('custrecord_ava_enableaddvalontran');
                avaConfigObj["AVA_EnableAddValFlag"] = result.getValue('custrecord_ava_enableaddvalflag');
                avaConfigObj["AVA_AdditionalInfo"] = result.getValue('custrecord_ava_additionalinfo');
                avaConfigObj["AVA_AdditionalInfo1"] = result.getValue('custrecord_ava_additionalinfo1');
                avaConfigObj["AVA_AdditionalInfo2"] = result.getValue('custrecord_ava_additionalinfo2');

            });
            return avaConfigObj;
        }
        function AVA_CheckCountryName(countryName) {
            var returnCountryName = new Array();
            switch (countryName) {
                case 'AS':
                case 'FM':
                case 'GU':
                case 'MH':
                case 'MP':
                case 'PW':
                case 'PR':
                case 'UM':
                case 'VI':
                    returnCountryName[0] = 0;
                    returnCountryName[1] = 'US';
                    break;

                default:
                    returnCountryName[0] = 1;
                    returnCountryName[1] = countryName;
                    break;
            }
            
            return returnCountryName;
        }
        
		function AVA_CheckVatCountries(countryName){
			var vatCountry = 0;
			
			if(countryName != null){
				countryName = countryName.toUpperCase();
			}
			
			switch(countryName){
				case 'UNITED KINGDOM':
				case 'GB':
				case 'UNITED KINGDOM (NORTHERN IRELAND)':
				case 'XI':
				case 'AUSTRIA':
				case 'AT':
				case 'BELGIUM':
				case 'BE':
				case 'BULGARIA':
				case 'BG':
				case "CAMPIONE D'ITALIA":
				case 'CP':
				case 'CYPRUS':
				case 'CY':
				case 'CZECH REPUBLIC':
				case 'CZ':
				case 'GERMANY':
				case 'DE':
				case 'DENMARK':
				case 'DK':
				case 'CEUTA':
				case 'EA':
				case 'ESTONIA':
				case 'EE':
				case 'MELILLA':
				case 'EI':
				case 'SPAIN':
				case 'ES':
				case 'CORSICA':
				case 'FC':
				case 'FINLAND':
				case 'FI':
				case 'FRANCE':
				case 'FR':
				case 'GREECE':
				case 'GR':
				case 'HELIGOLAND':
				case 'HE':
				case 'CROATIA':
				case 'HR':
				case 'HUNGARY':
				case 'HU':
				case 'IRELAND':
				case 'IE':
				case 'ITALY':
				case 'IT':
				case 'LAKE LUGANO, TERRITORIAL WATERS OF':
				case 'LL':
				case 'LIVIGNO':
				case 'LO':
				case 'LITHUANIA':
				case 'LT':
				case 'LUXEMBOURG':
				case 'LU':
				case 'LATVIA':
				case 'LV':
				case 'MONACO':
				case 'MC':
				case 'MADEIRA':
				case 'MI':
				case 'MALTA':
				case 'MT':
				case 'NETHERLANDS':
				case 'NL':
				case 'POLAND':
				case 'PL':
				case 'PORTUGAL':
				case 'PT':
				case 'ROMANIA':
				case 'RO':
				case 'SWEDEN':
				case 'SE':
				case 'SLOVENIA':
				case 'SI':
				case 'SLOVAKIA':
				case 'SK':
				case 'AZORES':
				case 'ZO':
				case 'CEUTA AND MELILLA':
				case 'EA':
				case 'SWITZERLAND':
				case 'CH':
				case 'NORWAY':
				case 'NO':
					vatCountry = 1;
					break;
			}
			
			return vatCountry;
		}
		
        function AVA_FormatDate(date){
        	var dateFormat = runtime.getCurrentUser().getPreference('DATEFORMAT');
        	var formattedDate = new Date();
        	
        	if(dateFormat == 'MM/DD/YYYY' || dateFormat == 'fmMM/DDfm/YYYY' || dateFormat == 'M/D/YYYY'){
        		var splitDate = date.split('/');
        		var year = splitDate[2];
        		var month = splitDate[0] - 1;
        		var day = splitDate[1];
        		
        		formattedDate.setFullYear(year,month,day);
        	}
        	else if(dateFormat == 'DD/MM/YYYY' || dateFormat == 'fmDD/MMfm/YYYY' || dateFormat == 'D/M/YYYY'){
        		var splitDate = date.split('/');
        		var year = splitDate[2];
        		var month = splitDate[1] - 1;
        		var day = splitDate[0];
        		
        		formattedDate.setFullYear(year,month,day);
        	}
        	else if(dateFormat == 'DD-Mon-YYYY' || dateFormat == 'DD-MONTH-YYYY' || dateFormat == 'fmDD-Monfm-YYYY' || dateFormat == 'fmDD-MONTHfm-YYYY' || dateFormat == 'D-Mon-YYYY' || dateFormat == 'D-MONTH-YYYY'){ 
        		var splitDate = date.split('-');
        		var year = splitDate[2];
        		var month = AVA_GetMonthName(splitDate[1]) - 1;
        		var day = splitDate[0];
        		
        		formattedDate.setFullYear(year,month,day);
        	}
        	else if(dateFormat == 'DD.MM.YYYY' || dateFormat == 'fmDD.MMfm.YYYY' || dateFormat == 'D.M.YYYY'){
        		var splitDate = date.split('.');
        		var year = splitDate[2];
        		var month = splitDate[1] - 1;
        		var day = splitDate[0];
        		
        		formattedDate.setFullYear(year,month,day);
        	}
        	else if(dateFormat == 'DD MONTH, YYYY' || dateFormat == 'fmDD MONTHfm, YYYY' || dateFormat == 'D MONTH, YYYY'){
        		var splitDate = date.split(' ');
        		var year = splitDate[2];
        		var month = AVA_GetMonthName(splitDate[1].substring(0, splitDate[1].length - 1)) - 1;
        		var day = splitDate[0];
        		
        		formattedDate.setFullYear(year,month,day);
        	}
        	else if(dateFormat === 'YYYY/MM/DD' || dateFormat == 'YYYY/fmMM/DDfm' || dateFormat === 'YYYY/M/D'){
        		var splitDate = date.split('/');
        		var year = splitDate[0];
        		var month = splitDate[1] - 1;
        		var day = splitDate[2];
        		
        		formattedDate.setFullYear(year,month,day);
        	}
        	else if(dateFormat == 'YYYY-MM-DD' || dateFormat == 'YYYY-fmMM-DDfm' || dateFormat == 'YYYY-M-D'){
        		var splitDate =date.split('-');
        		var year = splitDate[0];
        		var month = splitDate[1] - 1;
        		var day = splitDate[2];
        		
        		formattedDate.setFullYear(year,month,day);
        	}
        	
        	return formattedDate;
        }
        
        function AVA_GetMonthName(monthName){
        	var month;
        	
        	switch(monthName)
        	{
        		case 1:
        			month = 'January';
        			break;
        			
        		case 'JANUARY':
        		case 'January':
        		case 'JAN':
        		case 'Jan':
        			month = '01';
        			break;
        			
        		case 2:
        			month = 'February';
        			break;

        		case 'FEBRUARY':
        		case 'February':
        		case 'FEB':
        		case 'Feb':
        			month = '02';
        			break;

        		case 3:
        			month = 'March';
        			break;

        		case 'MARCH':
        		case 'March':
        		case 'MAR':
        		case 'Mar':
        			month = '03';
        			break;

        		case 4:
        			month = 'April';
        			break;

        		case 'APRIL':
        		case 'April':
        		case 'APR':
        		case 'Apr':
        			month = '04';
        			break;

        		case 5:
        			month = 'May';
        			break;

        		case 'MAY':
        		case 'May':
        			month = '05';
        			break;

        		case 6:
        			month = 'June';
        			break;

        		case 'JUNE':
        		case 'June':
        		case 'JUN':
        		case 'Jun':
        			month = '06';
        			break;

        		case 7:
        			month = 'July';
        			break;

        		case 'JULY':
        		case 'July':
        		case 'JUL':
        		case 'Jul':
        			month = '07';
        			break;

        		case 8:
        			month = 'August';
        			break;

        		case 'AUGUST':
        		case 'August':
        		case 'AUG':
        		case 'Aug':
        			month = '08';
        			break;

        		case 9:
        			month = 'September';
        			break;

        		case 'SEPTEMBER':
        		case 'September':
        		case 'SEP':
        		case 'Sep':
        			month = '09';
        			break;

        		case 10:
        			month = 'October';
        			break;

        		case 'OCTOBER':
        		case 'October':
        		case 'OCT':
        		case 'Oct':
        			month = '10';
        			break;

        		case 11:
        			month = 'November';
        			break;

        		case 'NOVEMBER':
        		case 'November':
        		case 'NOV':
        		case 'Nov':
        			month = '11';
        			break;

        		case 12:
        			month = 'December';
        			break;

        		case 'DECEMBER':
        		case 'December':
        		case 'DEC':
        		case 'Dec':
        			month = '12';
        			break;

        		default:
        			break;
        	}
        	
        	return month; 
        }
        
        function AVA_ConvertDate(transDate){
        	var avaDate, month, day, year;
        	
        	avaDate = format.parse({
        		value: transDate,
        		type: format.Type.DATE
        	});
        	month = parseInt(avaDate.getMonth() + 1);
        	day = avaDate.getDate();
        	year = avaDate.getFullYear();
        	
        	month = month.toString();
        	day = day.toString();
        	
        	if(month.length == 1){
        		month = '0' + month;
        	}
        	
        	if(day.length == 1){
        		day = '0' + day;
        	}
        	
        	avaDate = year + '-' + month + '-' + day;
        	return avaDate;
        }
        
        function AVA_DateFormat(avaDate){
        	var dateFormat = runtime.getCurrentUser().getPreference('DATEFORMAT');
        	var year = avaDate.substring(0, 4);
        	var month = avaDate.substring(5, 7);
        	var day = avaDate.substring(8, 10);
        	
        	if(dateFormat == 'MM/DD/YYYY' || dateFormat == 'fmMM/DDfm/YYYY' || dateFormat == 'M/D/YYYY'){
        		avaDate = month + '/' + day + '/' + year;
        	}
        	else if(dateFormat == 'DD/MM/YYYY' || dateFormat == 'fmDD/MMfm/YYYY' || dateFormat == 'D/M/YYYY'){
        		avaDate = day + '/' + month + '/' + year;
        	}
        	else if(dateFormat == 'DD-Mon-YYYY' || dateFormat == 'DD-MON-YYYY' || dateFormat == 'fmDD-Monfm-YYYY' || dateFormat == 'D-Mon-YYYY'){
        		var monthname = AVA_GetMonthName(parseInt(month, 10));
        		avaDate = day + '-' + monthname.substring(0,3) + '-' + year;
        	}
        	else if(dateFormat == 'DD.MM.YYYY' || dateFormat == 'fmDD.MMfm.YYYY' || dateFormat == 'D.M.YYYY'){
        		avaDate = day + '.' + month + '.' + year;
        	}
        	else if(dateFormat == 'DD-MONTH-YYYY' || dateFormat == 'fmDD-MONTHfm-YYYY' || dateFormat == 'D-MONTH-YYYY'){
        		var monthname = AVA_GetMonthName(parseInt(month, 10));
        		avaDate = day + '-' + monthname + '-' + year;
        	}
        	else if(dateFormat == 'DD MONTH, YYYY' || dateFormat == 'fmDD MONTHfm, YYYY' || dateFormat == 'D MONTH, YYYY'){
        		var monthname = AVA_GetMonthName(parseInt(month, 10));
        		avaDate = day + ' ' + monthname + ', ' + year;
        	}
        	else if(dateFormat === 'YYYY/MM/DD' || dateFormat == 'YYYY/fmMM/DDfm' || dateFormat === 'YYYY/M/D'){
        		avaDate = year + '/' + month + '/' + day;
        	}
        	else if(dateFormat == 'YYYY-MM-DD' || dateFormat == 'YYYY-fmMM-DDfm' || dateFormat == 'YYYY-M-D')
        	{
        		avaDate = year + '-' + month + '-' + day;
        	}
        	
        	return avaDate;
        }
        
		function AVA_ErrorCodeDesc(error){
			var errorText;
			switch(error){
				case 1:
						errorText = 'AvaTax Calculation is disabled in Configuration Settings.';
						break;
				case 2:
						errorText = 'No Line Item added.';
						break;
				case 3:
						errorText = 'No Customer selected.';
						break;
				case 4:
						errorText = 'Transaction Date Missing.';
						break;
				case 5:
						errorText = 'Taxcode missing at Header Level.';
						break;
				case 6:
						errorText = 'Taxcode selected is not an AVATAX Taxcode.';
						break;
				case 7:
						errorText = 'Location selected at Header is not a United States or Canadian Location.';
						break;
				case 8:
						errorText = 'Location selected for one of the Line Items is not a United States or Canadian Location.';
						break;
				case 9:
						errorText = 'Taxcode is not set to AVATAX or the Tax rates are not equal to zero for all the line items.';
						break;
				case 10:
						errorText = 'Ship Method not selected, Shipping Taxcode is not an AVATAX Taxcode or the Shipping Tax rate is not equal to zero.';
						break;
				case 11:
						errorText = 'Ship Method not selected, Handling Taxcode is not set to AVATAX or the Handling Tax rate is not equal to zero.';
						break;
				case 12:
						errorText = 'Shipping/Billing Address or Latitude & Longitude co-ordinates are missing.';
						break;
				case 13:
						errorText = 'Billing Address is Missing.';
						break;
				case 14:
						errorText = 'Invalid Billing or Shipping Address.';
						break;
				case 15:
						errorText = 'None of the items selected is an Inventory, Non-inventory or Download Item.';
						break;
				case 17:
						errorText = 'Default Taxcode not assigned in the Configurations settings.';
						break;
				case 18:
						errorText = 'Item Description missing for the item(s).';
						break;
				case 19:
						errorText = 'AvaTax Production credentials cannot be used in test environment(s). Transaction was not posted.';
						break;
				case 20:
						errorText = 'Billable Item\'s Discount Taxcode is not set to an AVATAX Taxcode.';
						break;
				case 21:
						errorText = 'Billable Expenses Discount Taxcode is not set to an AVATAX Taxcode.';
						break;
				case 22:
						errorText = 'Billable Time Discount Taxcode is not set to an AVATAX Taxcode.';
						break;
				case 23:
						errorText = 'Invalid DocType for AvaTax services.';
						break;
				case 24:
						errorText = "Invalid value set for CustomerCode in AVACONFIG customrecord.";
						break;
				case 25:
						errorText = "No Vendor selected.";
						break;
				case 26:
						errorText = "Invalid value set for VendorCode in AVACONFIG customrecord.";
						break;
				case 27:
						errorText = "Vendor tax not entered.";
						break;
				case 28:
						errorText = 'UseTax Assessment is disabled in Configuration Settings.';
						break;
				case 29:
						errorText = 'UseTax Assessment is disabled for Vendor.';
						break;
				case 30:
						errorText = 'AvaTax Calculation is disabled in Configuration Settings for Quotes.';
						break;
				case 31:
						errorText = 'AvaTax Calculation is disabled in Configuration Settings for Sales Order.';
						break;
				case 32:
						errorText = 'Input VAT Verification is disabled in Configuration Settings.';
						break;
				case 33:
						errorText = 'Advanced Taxes feature should be enabled to use UseTax Assessment/Input VAT Verfication feature.';
						break;
				case 34:
						errorText = 'Multiple \'Sales Tax Adjustment\' line not allowed.';
						break;
				case 35:
						errorText = 'Item line for tax paid to vendor should be the last line.';
						break;
				case 36:
						errorText = 'Item line for tax paid to vendor should not be more than one.';
						break;
				case 37:
						errorText = 'Please add at least one item line.';
						break;
				case 38:
						errorText = 'MIDDLE-MAN VAT ID is required when EU Triangulation checkbox is checked.';
						break;
				default:
						errorText = error;
						break;
			}
			
			return errorText;
		}
		
		function AVA_ValidateAddress(cRecord, configCache, mode){
			if(configCache.AVA_DisableAddValidation == true){
				alert('Address Validation cannot be done. Address Validation is disabled in Configuration Settings.');
				return;
			}
			
			if(AVA_EvaluateAddress(cRecord, mode) == 1){
				alert('Address Validation cannot be done. [Line1/Line2 and ZipCode] or [Line1/Line2, City, and State] is required.');
				return;
			}
			
			var Url = url.resolveScript({
				scriptId: 'customscript_ava_general_restlet',
				deploymentId: 'customdeploy_ava_general_restlet'
			});
			Url = Url + '&type=dosomethingelse' + '&accountValue=' + configCache.AVA_AccountValue + '&ava_lickey=' + configCache.AVA_AdditionalInfo + '&ava_additionalinfo1=' + configCache.AVA_AdditionalInfo1+ '&ava_additionalinfo2=' + configCache.AVA_AdditionalInfo2;
			var resp = https.get({
				url: Url
			});
			
			var AvaTax = AVA_InitSignatureObject(configCache.AVA_ServiceUrl);
			var address = AVA_ValidateAddressBody(cRecord, configCache, mode, AvaTax);
			var validate = address.validate(resp.body);
			
			try{
				var response = https.post({
					url: validate.url,
					body: validate.data,
					headers: validate.headers
				});
				
				if(response.code == 200){
					var responseBody = JSON.parse(response.body);
					var messages = responseBody.messages;
					
					if(messages == null || messages.length == 0){
						var validatedAddress = responseBody.validatedAddresses[0];
						
						var line1 		= validatedAddress.line1;
						var line2 		= validatedAddress.line2;
						var city  		= validatedAddress.city;
						var region  	= validatedAddress.region;
						var postalCode  = validatedAddress.postalCode;
						var country  	= validatedAddress.country;
						
						var stateCheck = AVA_CheckCountryName(region);
						country = (stateCheck[0] == 0 ? region : country);
						
						var confirmMsg = 'The Validated Address is: \n';
						confirmMsg += '\n' + line1;
						confirmMsg += ((line2[0] != null && line2[0].length > 0) ? ('\n' + line2) : line2);
						confirmMsg += '\n' + city;
						confirmMsg += '\n' + region;
						confirmMsg += '\n' + postalCode;
						confirmMsg += '\n' + country + '\n';
						confirmMsg += '\n Accept Validated Address?';
						
						if(confirm(confirmMsg)){
							if(mode == 0){
								var addressee = addressRecord.getValue('addressee');
								var attention = addressRecord.getValue('attention');
								var phone = addressRecord.getValue('addrphone');
								
								nlapiSetCurrentLineItemValue('addressbook', 'country', country.toString());
								nlapiSetCurrentLineItemValue('addressbook', 'addressee', addressee);
								nlapiSetCurrentLineItemValue('addressbook', 'attention', attention);
								nlapiSetCurrentLineItemValue('addressbook', 'phone', phone);
								nlapiSetCurrentLineItemValue('addressbook', 'addr1', line1.toString());
								nlapiSetCurrentLineItemValue('addressbook', 'addr2', line2.toString());
								nlapiSetCurrentLineItemValue('addressbook', 'city', city.toString());
								nlapiSetCurrentLineItemValue('addressbook', 'zip', postalCode.toString());
								nlapiSetCurrentLineItemValue('addressbook', 'state', region.toString());
								if(configCache.AVA_EnableAddValFlag == true){
									nlapiSetCurrentLineItemValue('addressbook', 'custpage_ava_addval', 'T');
								}
							}
							else if(mode == 2){
								if(cRecord.getValue('billaddresslist') != null && cRecord.getValue('billaddresslist') > 0){
									var response = https.get({
										url: url.resolveScript({
											scriptId: 'customscript_ava_recordload_suitelet',
											deploymentId: 'customdeploy_ava_recordload',
											params:
												{
													'type': 'customeraddr',
													'id': cRecord.getValue('entity'),
													'addid': cRecord.getValue('billaddresslist'),
													'line1': line1,
													'line2': line2,
													'city': city,
													'zipcode': postalCode,
													'state': region,
													'country': country
												}
										})
									});
									cRecord.setValue({
										fieldId: 'billaddresslist',
										value: cRecord.getValue('billaddresslist')
									});
									
									if(cRecord.getValue('shipaddresslist') == cRecord.getValue('billaddresslist')){
										cRecord.setValue({
											fieldId: 'shipaddresslist',
											value: cRecord.getValue('shipaddresslist')
										});
									}
								}
								else{
									//For Custom Address
									var customAddrSubRecord = cRecord.getSubrecord({
										fieldId: 'billingaddress'
									});
									customAddrSubRecord.setValue({
										fieldId: 'country',
										value: country,
										ignoreFieldChange: true
									});
									customAddrSubRecord.setValue({
										fieldId: 'addr1',
										value: line1,
										ignoreFieldChange: true
									});
									customAddrSubRecord.setValue({
										fieldId: 'addr2',
										value: line2,
										ignoreFieldChange: true
									});
									customAddrSubRecord.setValue({
										fieldId: 'city',
										value: city,
										ignoreFieldChange: true
									});
									customAddrSubRecord.setValue({
										fieldId: 'state',
										value: region,
										ignoreFieldChange: true
									});
									customAddrSubRecord.setValue({
										fieldId: 'zip',
										value: postalCode,
										ignoreFieldChange: true
									});
									
									var sbilladdress = (addressRecord.getValue('attention') != null && addressRecord.getValue('attention').length > 0) ? addressRecord.getValue('attention') : '';
									sbilladdress += (addressRecord.getValue('addressee') != null && addressRecord.getValue('addressee').length > 0) ? (sbilladdress.length > 0) ? ('\n' + addressRecord.getValue('addressee')) : addressRecord.getValue('addressee') : '';
									sbilladdress += (sbilladdress.length > 0) ? ('\n' + line1) : line1;
									sbilladdress += ((line2[0] != null && line2[0].length > 0) ? ('\n' + line2) : line2);
									sbilladdress += '\n' + city + ' ' + region + ' ' + postalCode;
									sbilladdress += '\n' + country;
									cRecord.setValue({
										fieldId: 'billaddress',
										value: sbilladdress,
										ignoreFieldChange: true
									});
								}
							}
							else if(mode == 3){
								if(cRecord.getValue('shipaddresslist') != null && cRecord.getValue('shipaddresslist') > 0){
									var response = https.get({
										url: url.resolveScript({
											scriptId: 'customscript_ava_recordload_suitelet',
											deploymentId: 'customdeploy_ava_recordload',
											params:
												{
													'type': 'customeraddr',
													'id': cRecord.getValue('entity'),
													'addid': cRecord.getValue('shipaddresslist'),
													'line1': line1,
													'line2': line2,
													'city': city,
													'zipcode': postalCode,
													'state': region,
													'country': country
												}
										})
									});
									cRecord.setValue({
										fieldId: 'shipaddresslist',
										value: cRecord.getValue('shipaddresslist')
									});
									
									if(cRecord.getValue('billaddresslist') == cRecord.getValue('shipaddresslist')){
										cRecord.setValue({
											fieldId: 'billaddresslist',
											value: cRecord.getValue('billaddresslist')
										});
									}
								}
								else{
									//For Custom Address
									var customAddrSubRecord = cRecord.getSubrecord({
										fieldId: 'shippingaddress'
									});
									customAddrSubRecord.setValue({
										fieldId: 'country',
										value: country,
										ignoreFieldChange: true
									});
									customAddrSubRecord.setValue({
										fieldId: 'addr1',
										value: line1,
										ignoreFieldChange: true
									});
									customAddrSubRecord.setValue({
										fieldId: 'addr2',
										value: line2,
										ignoreFieldChange: true
									});
									customAddrSubRecord.setValue({
										fieldId: 'city',
										value: city,
										ignoreFieldChange: true
									});
									customAddrSubRecord.setValue({
										fieldId: 'state',
										value: region,
										ignoreFieldChange: true
									});
									customAddrSubRecord.setValue({
										fieldId: 'zip',
										value: postalCode,
										ignoreFieldChange: true
									});
									
									var sshipaddress = (addressRecord.getValue('attention') != null && addressRecord.getValue('attention').length > 0) ? addressRecord.getValue('attention') : '';
									sshipaddress += (addressRecord.getValue('addressee') != null && addressRecord.getValue('addressee').length > 0) ? (sshipaddress.length > 0) ? ('\n' + addressRecord.getValue('addressee')) : addressRecord.getValue('addressee') : '';
									sshipaddress += (sshipaddress.length > 0) ? ('\n' + line1) : line1;
									sshipaddress += ((line2[0] != null && line2[0].length > 0) ? ('\n' + line2) : line2);
									sshipaddress += '\n' + city + ' ' + region + ' ' + postalCode;
									sshipaddress += '\n' + country;
									cRecord.setValue({
										fieldId: 'shipaddress',
										value: sshipaddress,
										ignoreFieldChange: true
									});
								}
							}
						}
						else{
							if(configCache.AVA_EnableAddValFlag == true){
								if(mode == 0){
									cRecord.setCurrentSublistValue({
										sublistId: 'addressbook',
										fieldId: 'custpage_ava_addval',
										value: false
									});
								}
							}
						}
					}
					else{
						if(messages.length > 0){
							if(messages[0].details != null && (messages[0].details).length > 0){
								alert(messages[0].details);
							}
							else{
								alert(messages[0].summary);
							}
						}
						
						if(configCache.AVA_EnableAddValFlag == true){
							if(mode == 0){
								cRecord.setCurrentSublistValue({
									sublistId: 'addressbook',
									fieldId: 'custpage_ava_addval',
									value: false
								});
							}
						}
					}
				}
				else{
					var responseBody = JSON.parse(response.body);
					alert(responseBody.error.message);
				}
			}
			catch(err){
				alert('Address Validation was not Successful. ' + err.message);
			}
		}
		
		function AVA_EvaluateAddress(cRecord, mode){
			var line1, line2, city, state, zip, country;
			
			if(mode == 0){
				addressRecord = cRecord.getCurrentSublistSubrecord({
	                sublistId: 'addressbook',
	                fieldId: 'addressbookaddress'
	            });
			}
			else{
				//Mode - 2 - Transaction Bill-To Address
				//Mode - 3 - Transaction Ship-To Address
				addressRecord = (mode == 2) ? cRecord.getSubrecord('billingaddress') : cRecord.getSubrecord('shippingaddress');
			}
			
			if(addressRecord != null){
				line1	= addressRecord.getValue('addr1');
				line2	= addressRecord.getValue('addr2');
				city	= addressRecord.getValue('city');
				state	= addressRecord.getValue('state');
				zip		= addressRecord.getValue('zip');
				country = addressRecord.getValue('country');
			}
			
			if(country != null && country.length > 0 && (country == 'US' || country == 'CA')){
				var bOption1 = (((line1 != null && line1.length > 0) || (line2 != null && line2.length > 0)) && (zip != null && zip.length > 0)) ? true : false;
				var bOption2 = (((line1 != null && line1.length > 0) || (line2 != null && line2.length > 0)) && (city != null && city.length > 0) && (state != null && state.length > 0)) ? true : false;
				
				if(bOption1 || bOption2){
					return 0;
				}
				else{
					return 1;
				}
			}
			else{
				if(country == null || country == '' || country == 'US' || country == 'CA'){
					return 1;
				}
				else{
					return 0;
				}
			}
		}
		
		function AVA_ValidateAddressBody(cRecord, configCache, mode, AvaTax){
			var address = new AvaTax.address();
		 	address.textCase = (configCache.AVA_AddUpperCase == true) ? 'Upper' : 'Mixed';
		 	
			if(addressRecord != null){
				address.line1	   = addressRecord.getValue('addr1');
				address.line2	   = addressRecord.getValue('addr2');
				address.city	   = addressRecord.getValue('city');
				address.region	   = addressRecord.getValue('state');
				address.postalCode = addressRecord.getValue('zip');
				
				var returnCountryName = AVA_CheckCountryName(addressRecord.getValue('country'));
				address.country = returnCountryName[1];
			}
		 	
		 	return address;
		}
		
		return{
			mainFunction: executeLibraryFunction,
			AVA_LoadValuesToGlobals: AVA_LoadValuesToGlobals,
			AVA_FormatDate: AVA_FormatDate,
			AVA_ValidateAddress: AVA_ValidateAddress
		};
	}
);