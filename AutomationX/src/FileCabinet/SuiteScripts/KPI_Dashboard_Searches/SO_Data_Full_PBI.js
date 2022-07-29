/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/task'],
/**
 * @param {task} task
 */
function(task) {
	
	
	var SEARCH_ID = 'customsearch_ax_so_data_pbi';
	var FILE_ID = '8774733';
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
    function execute(scriptContext) {
    	
    	var searchTask = task.create({

    		taskType: task.TaskType.SEARCH

    		});
    	
    	searchTask.savedSearchId = SEARCH_ID;

    	searchTask.fileId = FILE_ID;

    	var searchTaskId = searchTask.submit();
    	
    	var stopper = 0;
    	
    	}
    
    
    

    	return {

    	execute: execute

    	};
 
    
});
