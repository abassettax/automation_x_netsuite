/******************************************************************************************************
	Script Name - 	AVA_WFA_CommitApprovedTransaction.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType WorkflowActionScript
*/

define(['N/config', 'N/record', 'N/log', './utility/AVA_Library'],
	function(config, record, log, ava_library){
		function onAction(context){
			try{
				var nRecord = context.newRecord;
				var loadConfig = config.load({
					type: config.Type.ACCOUNTING_PREFERENCES
				});
				var avaConfigObjRec = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
				
				if(loadConfig.getValue('CUSTOMAPPROVALCUSTINVC') == true && avaConfigObjRec['AVA_CommitTransaction'] == true){
					var rec = record.load({
						type: nRecord.type,
						id: nRecord.id
					});
					rec.save();
				}
			}
			catch(err){
				log.debug({
					title: 'Try/Catch',
					details: err.message
				});
			}
		}
		
		return{
			onAction: onAction
		};
	}
);