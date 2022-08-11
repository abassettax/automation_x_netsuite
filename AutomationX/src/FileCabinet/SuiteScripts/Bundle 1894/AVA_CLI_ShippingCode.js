/******************************************************************************************************
	Script Name - 	AVA_CLI_ShippingCode.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/url', 'N/search', 'N/currentRecord', 'N/record'],
	function(url, search, currentRecord, record){
		function initTest(){
		}
		
		function AVA_NewShippingCode(){
			window.location = url.resolveScript({
				scriptId: 'customscript_avashippingcodeform_suitlet',
				deploymentId: 'customdeploy_shippingcode'
			});
		}
		
		function AVA_DeleteShippingCode(){
			if(confirm("Are you sure you want to delete the record?") == true){
				/* Check if the Shipping Code is assigned in the Config Window */
				var Shipcode;
				var searchRecord = search.create({
					type: 'customrecord_avaconfig',
					columns: ['custrecord_ava_defshipcode']
				});
				var searchresult = searchRecord.run();
				
				searchresult.each(function(result){
					Shipcode = result.getValue({
						name: 'custrecord_ava_defshipcode'
					});
				});
				
				var crecord = currentRecord.get();
				var sCode = crecord.getValue({
					fieldId: 'ava_shippingcode'
				});
				
				if(Shipcode == sCode){
					alert('The Shipping code cannot be deleted as child records exist');
				}
				else{
					try{
						record.delete({
							type: 'customrecord_avashippingcodes',
							id: crecord.getValue({
								fieldId: 'ava_shippinginternalid'
							})
						});
					}
					catch(error){
						alert(error.name);
					}
					
					window.location = crecord.getValue({
						fieldId: 'ava_shiplisturl'
					});
				}
			}
		}
		
		return{
			pageInit: initTest,
			AVA_NewShippingCode: AVA_NewShippingCode,
			AVA_DeleteShippingCode: AVA_DeleteShippingCode
		};
	}
);