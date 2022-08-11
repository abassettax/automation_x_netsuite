/******************************************************************************************************
	Script Name - 	AVA_CLI_AddressValidationAssistant.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/url', 'N/https'],
	function(url, https){
		function AVA_PageInit(context){
			var cRecord = context.currentRecord;
			var locType = cRecord.getValue({
				fieldId: 'ava_loctype'
			});
			
			if(locType != null && locType == 'a'){
				var locationList = cRecord.getField({
					fieldId: 'ava_locationlist'
				});
				var subLocation = cRecord.getField({
					fieldId: 'ava_subloc'
				});
				locationList.isDisabled = true;
				subLocation.isDisabled = true;
			}
		}
		
		function AVA_FieldChange(context){
			if(context.fieldId == 'ava_loctype'){
				var cRecord = context.currentRecord;
				var locType = cRecord.getValue({
					fieldId: 'ava_loctype'
				});
				var locationList = cRecord.getField({
					fieldId: 'ava_locationlist'
				});
				var subLocation = cRecord.getField({
					fieldId: 'ava_subloc'
				});
				
				if(locType == 'a'){
					locationList.isDisabled = true;
					subLocation.isDisabled = true;
				}
				else if(locType == 'p'){
					locationList.isDisabled = false;
					subLocation.isDisabled = false;
				}
			}
		}
		
		function AVA_SaveRecord(context){
			var cRecord = context.currentRecord;
			var recordType = cRecord.getValue({
				fieldId: 'ava_recordtype'
			});
			var locType = cRecord.getValue({
				fieldId: 'ava_loctype'
			});
			var locationList = cRecord.getValue({
				fieldId: 'ava_locationlist'
			});
			var batchName = cRecord.getValue({
				fieldId: 'ava_batchname'
			});
			
			//When particular location(s) needs to be validated then check if Location(s) have been selected or not
			if(recordType == 'l' && locType != null && locType == 'p' && (locationList != null && locationList[0].length <= 0)){
				alert('Please select Location(s).');
				return false;
			}
			
			if(locationList != null && locationList.length > 0){
				var locationValues = '';
				for(var i = 0; i < locationList.length; i++){
					locationValues += locationList[i] + '+';
				}
				
				locationValues = locationValues.substring(0, locationValues.lastIndexOf('+'))
				cRecord.setValue({
					fieldId: 'ava_locationlistvalues',
					value: locationValues
				});
			}
			
			if(batchName != null){
				var response = https.request({
					method: https.Method.GET,
					url: url.resolveScript({
						scriptId: 'customscript_ava_recordload_suitelet',
						deploymentId: 'customdeploy_ava_recordload',
						params: {'type': 'customrecord_avaaddressvalidationbatch', 'batchname': batchName}
					})
				});
				
				if(response.body == '0'){ // Batch name already exists
					alert('Batch Name already Exists. Enter a new Batch Name');
					document.forms['main_form'].ava_batchname.focus();
					return false;
				}
			}
			
			return true;
		}
		
		return{
			pageInit: AVA_PageInit,
			fieldChanged: AVA_FieldChange,
			saveRecord: AVA_SaveRecord
		};
	}
);