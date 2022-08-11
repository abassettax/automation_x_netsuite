/******************************************************************************************************
	Script Name - 	AVA_SUT_ViewTransactionLog.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/record', './utility/AVA_Library'],
	function(ui, record, ava_library){
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'TaxSvc');
			if(checkServiceSecurity == 0){
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 15);
			}
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET'){
					var AVA_TransactionLogForm = ui.createForm({
						title: 'AvaTax Transaction Log'
					});
					
					var rec = record.load({
						type: 'customrecord_avatransactionlogs',
						id: context.request.parameters.noteid
					});
					
					var transaction = AVA_TransactionLogForm.addField({
						id: 'ava_transaction',
						label: 'Transaction',
						type: ui.FieldType.SELECT,
						source: 'transaction'
					});
					transaction.defaultValue = rec.getValue({
						fieldId: 'custrecord_ava_transaction'
					});
					transaction.updateDisplayType({
						displayType: ui.FieldDisplayType.INLINE
					});
					transaction.updateLayoutType({
						layoutType: ui.FieldLayoutType.STARTROW
					});
					transaction.updateBreakType({
						breakType: ui.FieldBreakType.STARTCOL
					});
					
					var title = AVA_TransactionLogForm.addField({
						id: 'ava_title',
						label: 'Title',
						type: ui.FieldType.TEXT
					});
					title.defaultValue = rec.getValue({
						fieldId: 'custrecord_ava_title'
					});
					title.updateDisplayType({
						displayType: ui.FieldDisplayType.INLINE
					});
					
					var creationDate = AVA_TransactionLogForm.addField({
						id: 'ava_creationdate',
						label: 'Creation Date',
						type: ui.FieldType.TEXT
					});
					creationDate.defaultValue = rec.getValue({
						fieldId: 'custrecord_ava_creationdatetime'
					});
					creationDate.updateDisplayType({
						displayType: ui.FieldDisplayType.INLINE
					});
					creationDate.updateLayoutType({
						layoutType: ui.FieldLayoutType.ENDROW
					});
					creationDate.updateBreakType({
						breakType: ui.FieldBreakType.STARTCOL
					});
					
					var author = AVA_TransactionLogForm.addField({
						id: 'ava_author',
						label: 'Author',
						type: ui.FieldType.SELECT,
						source: 'employee'
					});
					author.defaultValue = rec.getValue({
						fieldId: 'custrecord_ava_author'
					});
					author.updateDisplayType({
						displayType: ui.FieldDisplayType.INLINE
					});
					
					var memo = AVA_TransactionLogForm.addField({
						id: 'ava_note',
						label: 'Memo',
						type: ui.FieldType.TEXTAREA
					});
					memo.defaultValue = rec.getValue({
						fieldId: 'custrecord_ava_note'
					});
					memo.updateDisplayType({
						displayType: ui.FieldDisplayType.INLINE
					});
					memo.updateLayoutType({
						layoutType: ui.FieldLayoutType.OUTSIDEBELOW
					});
					memo.updateBreakType({
						breakType: ui.FieldBreakType.STARTROW
					});
					
					context.response.writePage({
						pageObject: AVA_TransactionLogForm
					});
				}
			}
			else{
				context.response.write({
					output: checkServiceSecurity
				});
			}
		}
		
		return{
        	onRequest: onRequest
        };
	}
);