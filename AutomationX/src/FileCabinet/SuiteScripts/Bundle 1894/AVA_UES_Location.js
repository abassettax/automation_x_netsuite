/******************************************************************************************************
	Script Name - 	AVA_UES_Location.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
*/

define(['N/ui/serverWidget', './utility/AVA_Library'],
	function(ui, ava_library){
		function AVA_LocationBeforeLoad(context){
			var avaConfigObjRec = ava_library.mainFunction('AVA_ReadConfig', '0');
			
			if(avaConfigObjRec['AVA_ServiceTypes'] == null || (avaConfigObjRec['AVA_ServiceTypes'] != null && avaConfigObjRec['AVA_ServiceTypes'].search('TaxSvc') == -1) || avaConfigObjRec['AVA_DisableTax'] == true){
				var pos = context.form.getField({
					id: 'custrecord_ava_ispos'
				});
				pos.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
			}
		}
		
		return{
			beforeLoad: AVA_LocationBeforeLoad
        };
	}
);