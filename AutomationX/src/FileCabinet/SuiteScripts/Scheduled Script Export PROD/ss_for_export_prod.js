/**
* @NApiVersion 2.0
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search','N/file'],

function(search,file) {
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
	 
	//Load saved search
    function execute(scriptContext) {
    	var mySearch = search.load({
    		id: 'customsearch5898'
    	})
    	
		//Run saved search
    	var mySearchResultSet = mySearch.run();
    	log.debug('Results...',mySearchResultSet)
		
		//Headers of CSV File separated by commas and ends with a new line (\r\n)
		var csvFile = 'Name,Department,Hire Date,Termination/Release Date,Job Title\r\n';

		//Iterate through each result
		mySearchResultSet.each(iterator);
			
			function iterator(resultObject){
				
				//Get value returned for Internal ID
				/*var internalid = resultObject.getValue({
					name: 'internalid'
				})*/
				//Get value returned for Item ID
                		var name = resultObject.getValue({
					name: 'entityid'
				})
				//Get value returned for Average Cost
                		var department = resultObject.getValue({
					name: 'department'
				})
						var hireDate = resultObject.getValue({
					name: 'hiredate'
				})
						var termDate = resultObject.getValue({
					name: 'releasedate'
				})
				var title = resultObject.getValue({
					name: 'title'
				})
				
				//Add each result as a new line on CSV
				csvFile += '"'+name+'"'+','+department+','+hireDate+','+termDate+','+title+'\r\n'
				return true;
				
			}
		
		//Variable for datetime
		var date = new Date();
		
		//Creation of file
    		var fileObj = file.create({
			//To make each file unique and avoid overwriting, append date on the title
			name: 'EmpReleaseAuditSS.csv',
			fileType: file.Type.CSV,
			contents: csvFile,
			description: 'This is a CSV file.',
			encoding: file.Encoding.UTF8,
			folder: 7232933,
			isOnline : true
    		});
		
		//Save the CSV file
		var fileId = fileObj.save()
    		log.debug('File ID...',fileId)
    }

    return {
        execute: execute
    };
    
});