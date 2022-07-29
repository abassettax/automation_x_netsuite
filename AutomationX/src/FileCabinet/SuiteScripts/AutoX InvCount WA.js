/**
 *@NApiVersion 2.0
 *@NScriptType WorkflowActionScript
 *@NModuleScope SameAccount
*/

define([], function () {
	return {
		onAction: function(context) {
			var form = context.form;
			// // Set the module path to the client script
            form.clientScriptFileId = 15615011;

            // // Add custom button to the form
            form.addButton({
                id: 'custpage_ax_countreject',
                label: 'Reject Count',
                functionName: 'sendCountRejectEmail'
            });
		}
	};
}
);