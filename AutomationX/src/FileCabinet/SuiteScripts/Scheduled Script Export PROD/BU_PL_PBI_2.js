/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/file','N/search'],
/**
 * @param {file} file
 * @param {search} search
 */
function(file, search) {
   
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
    		id: 'customsearch_ax_bu_pl_pbi_2'
    	});
    	
		//Run saved search
    	var mySearchResults = mySearch.runPaged();
    	
		
		//Headers of CSV File separated by commas and ends with a new line (\r\n)
		var csvFile = 'Document Number,Date,Period,Transaction Type,Posting,Account Type,Class (no hierarchy),Created From,Amount (Gross),Account\r\n';

		//Iterate through each result
    	mySearchResults.pageRanges.forEach(function(pageRange){
            var myPage = mySearchResults.fetch({index: pageRange.index});
            myPage.data.forEach(function(result){
            	
    			

            var docNumber = result.getValue({
				name: 'tranid'
			})
			//Get value returned for Average Cost
            var date = result.getValue({
				name: 'trandate'
			})
			var period = result.getValue({
				name: 'formuladate'
			})
			var tranType = result.getValue({
				name: 'type'
			})
			var isPosting = result.getValue({
				name: 'posting'
			})
			var accountType = result.getValue({
				name: 'accounttype'
			})
			var classBU = result.getValue({
				name: 'classnohierarchy'
			})
			var createdFrom = result.getValue({
				name: 'createdfrom'
			})
			var grossAmount = result.getValue({
				name: 'grossamount'
			})
			var account = result.getValue({
				name: 'account'
			})
			

				
				//Add each result as a new line on CSV
			csvFile += docNumber+','+date+','+period+','+tranType+','+isPosting+','+accountType+','+classBU+','+createdFrom+','+grossAmount+','+account+'\r\n'
			return true;
				
			});
            
    		var fileObj = file.create({
    			//To make each file unique and avoid overwriting, append date on the title
    			name: 'BU_PL_PBI.csv',
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
            
		});
    	
    	

    	}
		
    return {
        execute: execute
    };
    
});