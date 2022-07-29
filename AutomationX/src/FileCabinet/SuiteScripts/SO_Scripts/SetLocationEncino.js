/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record'],
/**
 * @param {record} record
 */
function(record) {
    debugger;
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(context) {

    	var soRecord = context.currentRecord;
        if (soRecord.getValue({fieldId: 'customform'}) !== '356')
        {
                        return;
        }
    	
    	
    	var recId = soRecord.getValue({ fieldId : 'customform'});
    	var locationId = soRecord.getValue({fieldId : 'location'});
    	var customerID = soRecord.getValue({fieldId : 'entity'});
    	
    	
    	if (recId == '356' || customerID == '31270'){
    		
    		soRecord.setValue({ fieldId : 'location', value : '201'});
        	log.debug({
        	    title: 'Location Check	',
        	    details: 'Location ID: '+ locationId
        	});
        	if(recId == '356' && customerID !== '31270' ){
        		soRecord.setValue({fieldId: 'entity' , value: '31270'});
        	}
        	soRecord.setValue({
        		fieldId: 'custbody125',
        		value: '3' //online order
        	});

    	}
//    	alert(locationId);
    	
    	
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {

    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(context) {
    	var soForm = context.currentRecord;
    	var customForm = soForm.getValue({
    		fieldId: 'customform'
    	});
//    	if(customForm == '356'){
//		    soForm.setCurrentSublistValue({
//		    	sublistId: 'item',
//		    	fieldId: 'location',
//		    	value: '201'
//		    });
//		    return true;
    	
//		soForm.setCurrentSublistValue({
//			sublistId: 'item',
//			fieldId: 'taxcode',
//			value: '9162'
//			
//		});
		
//		soForm.setCurrentSublistValue({
//			sublistId: 'item',
//			fieldId: 'shipmethod',
//			value: '4605'
//		});

    	var quantityLOH = soForm.getCurrentSublistValue({
    		
    		sublistId: 'item',
    		fieldId: 'quantityavailable'
    	});
    	
    	if(quantityLOH <= 0){
		    soForm.setCurrentSublistValue({
		    	sublistId: 'item',
		    	fieldId: 'location',
		    	value: '17'
		    });
    		
    	}
//    	var lineQty = soForm.getCurrentSublistValue({
//    		
//    		sublistId: 'item',
//    		fieldId: 'quantity'
//    	});
//
//	    	if(quantityLOH < lineQty){
//	    		alert('There is not enough stock available to complete this order. Please contact Automation-X for assistance.');
//	    		return false;
//	    	}else{
//    	return true;
//	    	}
	    	
return true;
    	
    }
    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(context) {
    	

    }//end lineInit

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(context) {
    	var soRecord = context.currentRecord;
    	var recId = soRecord.getValue({fieldId : 'customform'});
    	var customerID = soRecord.getValue({fieldId : 'entity'});
    	var afeCode = soRecord.getValue({fieldId : 'custbody_aa_encino_afe'});
		
    		
		if(recId == '356' || customerID == '31270'){
	    	if (!afeCode){
				alert('Please Supply an AFE Code');
	
					return false
				
			}
	    	
	    }
		return
    }

    return {
        pageInit: pageInit,
//        fieldChanged: fieldChanged,
//        postSourcing: postSourcing,
        sublistChanged: sublistChanged,
//        lineInit: lineInit,
//        validateField: validateField,
//        validateLine: validateLine,
//        validateInsert: validateInsert,
//        validateDelete: validateDelete,
//        saveRecord: saveRecord
    };
    
});
