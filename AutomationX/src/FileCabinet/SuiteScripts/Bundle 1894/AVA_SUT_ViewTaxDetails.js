/******************************************************************************************************
	Script Name - AVA_SUT_ViewTaxDetails.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/runtime', 'N/https', 'N/log', 'N/format', './utility/AVA_Library', './utility/AVA_CommonServerFunctions'],
	function(ui, runtime, https, log, format, ava_library, ava_commonFunction){
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'TaxSvc');
			if(checkServiceSecurity == 0){
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 6);
			}
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET'){
					var form = ui.createForm({
						title: 'AvaTax Transaction Details'
					});
					var avaConfigObjRec = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
					
					if(avaConfigObjRec.AVA_AdditionalInfo != null && avaConfigObjRec.AVA_AdditionalInfo.length > 0){
						try{
							var AvaTax = ava_library.mainFunction('AVA_InitSignatureObject', avaConfigObjRec.AVA_ServiceUrl);
							var defCompanyCode = (avaConfigObjRec.AVA_DefCompanyCode != null && avaConfigObjRec.AVA_DefCompanyCode.length > 0) ? avaConfigObjRec.AVA_DefCompanyCode : runtime.accountId;
							var details = ava_commonFunction.mainFunction('AVA_General', (avaConfigObjRec.AVA_AccountValue + '+' + avaConfigObjRec.AVA_AdditionalInfo + '+' + avaConfigObjRec.AVA_AdditionalInfo1 + '+' + avaConfigObjRec.AVA_AdditionalInfo2));
							var getTaxHistory = AvaTax.getTaxHistory(details, context.request.parameters.doctype, context.request.parameters.doccode, defCompanyCode);
							
							var response = https.get({
								url: getTaxHistory.url,
								headers: getTaxHistory.headers
							});
							
							if(response.code == 200){
								var responseBody = JSON.parse(response.body);
								
								var nsTransNo = form.addField({
									id: 'ava_nstransno',
									label: 'NetSuite Transaction No',
									type: ui.FieldType.TEXT
								});
								nsTransNo.updateDisplayType({
									displayType: ui.FieldDisplayType.INLINE
								});
								nsTransNo.defaultValue = context.request.parameters.ns_transid;
								
								var docNo = form.addField({
									id: 'ava_docno',
									label: 'AvaTax Document No',
									type: ui.FieldType.TEXT
								});
								docNo.updateDisplayType({
									displayType: ui.FieldDisplayType.INLINE
								});
								docNo.defaultValue = responseBody.code;
								
								var customer = form.addField({
									id: 'ava_customer',
									label: 'Customer',
									type: ui.FieldType.TEXT
								});
								customer.updateDisplayType({
									displayType: ui.FieldDisplayType.INLINE
								});
								customer.defaultValue = responseBody.customerCode;
								
								var docDate = form.addField({
									id: 'ava_docdate',
									label: 'Document Date',
									type: ui.FieldType.TEXT
								});
								docDate.updateDisplayType({
									displayType: ui.FieldDisplayType.INLINE
								});
								docDate.defaultValue = ava_library.mainFunction('AVA_DateFormat', responseBody.date);
								
								var docStatus = form.addField({
									id: 'ava_docstatus',
									label: 'Document Status',
									type: ui.FieldType.TEXT
								});
								docStatus.updateDisplayType({
									displayType: ui.FieldDisplayType.INLINE
								});
								docStatus.defaultValue = responseBody.status;
								
								var taxDate = form.addField({
									id: 'ava_calcdate',
									label: 'Tax Calculation Date',
									type: ui.FieldType.TEXT
								});
								taxDate.updateDisplayType({
									displayType: ui.FieldDisplayType.INLINE
								});
								taxDate.defaultValue = ava_library.mainFunction('AVA_DateFormat', responseBody.taxDate);
								
								var docType = form.addField({
									id: 'ava_doctype',
									label: 'Document Type',
									type: ui.FieldType.TEXT
								});
								docType.updateDisplayType({
									displayType: ui.FieldDisplayType.INLINE
								});
								docType.defaultValue = responseBody.type;
								
								form.addTab({
									id: 'custpage_avatab',
									label: 'AvaTax Transaction Details'
								});
								
								form = AVA_GetHistoryTab(form, responseBody, 'custpage_avatab', context);
								
								context.response.writePage({
									pageObject: form
								});
							}
							else{
								var message;
								var errorBody = JSON.parse(response.body)
								var errorDetails = errorBody.error.details;
								
								for(var i = 0; errorDetails != null && i < errorDetails.length; i++){
									message = errorDetails[i].message;
									break;
								}
								
								context.response.write({
									output: ava_library.mainFunction('AVA_NoticePage', message)
								});
							}
						}
						catch(err){
							log.debug({
								title: 'GetTaxHistory Try/Catch',
								details: err.message
							});
						}
					}
					else{
						context.response.write({
							output: ava_library.mainFunction('AVA_NoticePage', "Please re-run the AvaTax configuration at 'Avalara > Setup > Configure Avalara' to proceed further with AvaTax services.")
						});
					}
				}
			}
			else{
				context.response.write({
					output: checkServiceSecurity
				});
			}
			
		}
		
		function AVA_GetHistoryTab(form, responseBody, tab, context){
			var taxSummary = responseBody.summary;
			var totalAmount = form.addField({
				id: 'ava_totalamount',
				label: 'Total Amount',
				type: ui.FieldType.CURRENCY,
				container: tab
			});
			totalAmount.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			totalAmount.defaultValue = format.parse({
				value: responseBody.totalAmount,
				type: format.Type.CURRENCY
			});
			
			var totalDiscount = form.addField({
				id: 'ava_totaldiscount',
				label: 'Total Discount',
				type: ui.FieldType.CURRENCY,
				container: tab
			});
			totalDiscount.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			totalDiscount.defaultValue = format.parse({
				value: responseBody.totalDiscount,
				type: format.Type.CURRENCY
			});
			
			var nonTaxableAmount = form.addField({
				id: 'ava_nontaxable',
				label: 'Total Non-Taxable',
				type: ui.FieldType.CURRENCY,
				container: tab
			});
			nonTaxableAmount.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			nonTaxableAmount.defaultValue = format.parse({
				value: responseBody.totalExempt,
				type: format.Type.CURRENCY
			});
			
			var taxableAmount = form.addField({
				id: 'ava_taxable',
				label: 'Total Taxable',
				type: ui.FieldType.CURRENCY,
				container: tab
			});
			taxableAmount.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			taxableAmount.defaultValue = format.parse({
				value: responseBody.totalTaxable,
				type: format.Type.CURRENCY
			});
			
			var totalTax = form.addField({
				id: 'ava_totaltax',
				label: 'Total Tax',
				type: ui.FieldType.CURRENCY,
				container: tab
			});
			totalTax.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			totalTax.defaultValue = format.parse({
				value: responseBody.totalTax,
				type: format.Type.CURRENCY
			});
			
			for(var i = 0; taxSummary != null && i < taxSummary.length; i++){
				if(taxSummary[i].taxType == 'LandedCost'){
					var customDuty = form.addField({
						id: 'ava_customduty',
						label: 'CUSTOM DUTY & IMPORT FEES',
						type: ui.FieldType.CURRENCY,
						container: tab
					});
					customDuty.updateDisplayType({
						displayType: ui.FieldDisplayType.INLINE
					});
					customDuty.defaultValue = format.parse({
						value: taxSummary[i].tax,
						type: format.Type.CURRENCY
					});
					break;
				}
			}
			
			var taxLines = responseBody.lines;
			
			var html;
			if(context.request.parameters.AVA_FoundVatCountry == 1){
				html = '<table cellpadding=2 align=center><caption><font size=2><b>Tax Details</b></font></caption><tr><td bgcolor=#CCCCCC><font size=2><b>No</b></font></td><td bgcolor=#CCCCCC align=center height=40px><font size=2><b>Item</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Taxcode</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Use Code</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Discount</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Exemption</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Taxable</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Rate</b></font></td><td bgcolor=#CCCCCC align=center colspan=2><font size=2><b>Tax</b></font></td><td bgcolor=#CCCCCC align=center colspan=2><font size=2><b>Tax Included</b></font></td><td bgcolor=#CCCCCC align=center colspan=2><font size=2><b>VAT Code</b></font></td><td bgcolor=#CCCCCC align=center colspan=10><font size=2><b></b></font></td></tr>';
			}
			else{
				html = '<table cellpadding=2 align=center><caption><font size=2><b>Tax Details</b></font></caption><tr><td bgcolor=#CCCCCC><font size=2><b>No</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Item</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Taxcode</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Use Code</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Discount</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Exemption</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Taxable</b></font></td><td bgcolor=#CCCCCC align=center><font size=2><b>Rate</b></font></td><td bgcolor=#CCCCCC align=center colspan=2><font size=2><b>Tax</b></font></td><td bgcolor=#CCCCCC align=center colspan=2><font size=2><b>Tax Included</b></font><td bgcolor=#CCCCCC align=center colspan=2><font size=2><b>VAT Code</b></font></td></tr>';
			}
			
			for(var j = 0; j < taxLines.length; j++){
				html += '<tr>';
				html += '<td align=center><font size=2>' + taxLines[j].lineNumber + '</font></td>';//item number
				html += '<td align=center><font size=2>' + taxLines[j].itemCode   + '</font></td>';//item name
				html += '<td align=center><font size=2>' + taxLines[j].taxCode  + '</font></td>';//Taxcode
				html += '<td align=center><font size=2>' + taxLines[j].entityUseCode + '</font></td>';//UseCode
				html += '<td align=center><font size=2>' + format.parse(taxLines[j].discountAmount, format.Type.CURRENCY)  + '</font></td>';//discount
				html += '<td align=center><font size=2>' + format.parse(taxLines[j].exemptAmount, format.Type.CURRENCY) + '</font></td>';//Exemption
				html += '<td align=center><font size=2>' + format.parse(taxLines[j].taxableAmount, format.Type.CURRENCY) + '</font></td>';//Taxable
				
				var taxRate = 0, html1 = '';
				var taxDetail = taxLines[j].details;
				
				for(var k = 0; k < taxDetail.length; k++){
					html1 += '<tr>';
					html1 += '<td></td>';
					
					if(context.request.parameters.AVA_FoundVatCountry == 1){
						html1 += '<td align=center><font size=2>' + taxDetail[k].jurisType + '</font></td>';//JurisType
					}
					else{
						html1 += '<td colspan="3" align=center><font size="2">' + taxDetail[k].jurisType + '</font></td>';//JurisType
					}
					
					html1 += '<td align=center><font size=2>' + taxDetail[k].jurisName + '</font></td>';//JurisName
					html1 += '<td align=center><font size=2>' + taxDetail[k].taxName + '</font></td>';//TaxName
					html1 += '<td align=center><font size=2>' + String(parseFloat(taxDetail[k].rate)  * 100).substring(0, 4) + '%</font></td>';//Rate
					html1 += '<td align=center><font size=2>' + format.parse(taxDetail[k].exemptAmount, format.Type.CURRENCY) + '</font></td>';//Exemption
					html1 += '<td align=center><font size=2>' + format.parse(taxDetail[k].nonTaxableAmount, format.Type.CURRENCY) + '</font></td>';//NonTaxable
					html1 += '<td align=center><font size=2>' + format.parse(taxDetail[k].taxableAmount, format.Type.CURRENCY) + '</font></td>';//Taxable
					
					if(context.request.parameters.AVA_FoundVatCountry == 1){
						html1 += '<td align=center colspan=2><font size=2>' + format.parse(taxDetail[k].tax, format.Type.CURRENCY) + '</font></td>';//Tax
						html1 += '<td align=center colspan=2><font size=2>' + format.parse(taxDetail[k].reportingTaxableUnits, format.Type.CURRENCY) + '</font></td>';//REPORTING TAXABLE UNITS
						html1 += '<td align=center colspan=3><font size=2>' + format.parse(taxDetail[k].reportingNonTaxableUnits, format.Type.CURRENCY) + '</font></td>';//REPORTING NON-TAXABLE UNITS
						html1 += '<td align=center colspan=3><font size=2>' + format.parse(taxDetail[k].reportingExemptUnits, format.Type.CURRENCY) + '</font></td>';//REPORTING EXEMPT UNITS
						html1 += '<td align=center colspan=3><font size=2>' + format.parse(taxDetail[k].reportingTax, format.Type.CURRENCY) + '</font></td>';//REPORTING TAX
						html1 += '<td align=center colspan=3><font size=2>' + format.parse(taxDetail[k].reportingTaxCalculated, format.Type.CURRENCY) + '</font></td>';//REPORTING TAX CALCULATED
					}
					else{
						html1 += '<td align=center colspan=3><font size=2>' + format.parse(taxDetail[k].tax, format.Type.CURRENCY) + '</font></td>';//Tax
					}
					
					html1 += '</tr>';
					taxRate += taxDetail[k].rate;
				}
				
				html += '<td align=center><font size=2>' + (taxRate * 100).toFixed(2) + '%</font></td>';//Rate
				html += '<td align=center colspan=2><font size=2>' + format.parse(taxLines[j].tax, format.Type.CURRENCY) + '</font></td>';//Tax
				html += '<td align=center colspan=2><font size=2>' + ((taxLines[j].taxIncluded == true) ? 'Yes' : 'No') + '</font></td>';//TaxIncluded
				html += '<td align=center colspan=2><font size=2>' + taxLines[j].vatCode + '</font></td>';//vatcode
				
				if(context.request.parameters.AVA_FoundVatCountry == 1){
					html += '</tr>';
					html += '<tr><th></th><td bgcolor=#CCCCCC align=center><font size=2>Jurisdiction Type</font></td><td bgcolor=#CCCCCC align=center><font size=2>Jurisdiction</font></td><td bgcolor=#CCCCCC align=center><font size=2>Tax Name</font></td><td align=center bgcolor=#CCCCCC><font size=2>Rate</font></td><td align=center bgcolor=#CCCCCC><font size=2>Exempt</font></td><td align=center bgcolor=#CCCCCC><font size=2>Non-Taxable</font></td><td align=center bgcolor=#CCCCCC><font size=2>Taxable</font></td><td align=center bgcolor=#CCCCCC colspan=2><font size=2>Tax</font></td><td align=center bgcolor=#CCCCCC colspan=2><font size=2>Reporting Taxable Units</font></td><td align=center bgcolor=#CCCCCC colspan=3><font size=2>Reporting Non Taxable Units</font></td><td align=center bgcolor=#CCCCCC colspan=3><font size=2>Reporting Exempt Units</font></td><td align=center bgcolor=#CCCCCC colspan=3><font size=2>Reporting Tax</font></td><td align=center bgcolor=#CCCCCC colspan=3><font size=2>Reporting Tax Calculated</font></td></tr>';
				}
				else{
					html += '</tr>';
					html += '<tr><th></th><td bgcolor=#CCCCCC align=center colspan=3><font size=2>Jurisdiction Type</font></td><td bgcolor=#CCCCCC align=center><font size=2>Jurisdiction</font></td><td bgcolor=#CCCCCC align=center><font size=2>Tax Name</font></td><td align=center bgcolor=#CCCCCC><font size=2>Rate</font></td><td align=center bgcolor=#CCCCCC><font size=2>Exempt</font></td><td align=center bgcolor=#CCCCCC><font size=2>Non-Taxable</font></td><td align=center bgcolor=#CCCCCC><font size=2>Taxable</font></td><td align=center bgcolor=#CCCCCC colspan=10><font size=2>Tax</font></td></tr>';
				}
				
				html += html1;
				
				if(context.request.parameters.AVA_FoundVatCountry == 1){
					html += '<tr><td colspan=30><hr/></td></tr>';
				}
				else{
					html += '<tr><td colspan=15><hr/></td></tr>';
				}
			}
			
			html += '</table>';
			
			var taxDetailHtml = form.addField({
				id: 'ava_linedetails',
				label: html,
				type: ui.FieldType.HELP,
				container: tab
			});
			taxDetailHtml.updateLayoutType({
				layoutType: ui.FieldLayoutType.OUTSIDEBELOW
			});
			taxDetailHtml.updateBreakType({
				breakType: ui.FieldBreakType.STARTROW
			});
			
			return form;
		}
		
		return{
			onRequest: onRequest
		};
	}
);