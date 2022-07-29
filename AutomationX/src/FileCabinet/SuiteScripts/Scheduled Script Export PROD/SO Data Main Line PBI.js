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
    		id: 'customsearch_ax_so_data_ml_pbi_2'
    	});
    	
		//Run saved search
    	var mySearchResults = mySearch.runPaged();
    	
		
		//Headers of CSV File separated by commas and ends with a new line (\r\n)
		var csvFile = 'Internal ID,Document Number,Date,Period,Order Type,Customer Entityid,Account,Account Type,Status,Business Unit,Location,Customer PO,Sales Rep,Subtotal,Total,Exclude Commissions \r\n';

		//Iterate through each result
    	mySearchResults.pageRanges.forEach(function(pageRange){
            var myPage = mySearchResults.fetch({index: pageRange.index});
            myPage.data.forEach(function(result){
            	
    			

            var internalid = result.getValue({
				name: 'internalid'
			})
			//Get value returned for Average Cost
            var date = result.getValue({
				name: 'trandate'
			})
			var period = result.getValue({
				name: 'postingperiod'
			})
			var tranType = result.getValue({
				name: 'type'
			})
			var custEntID = result.getValue({
				name: 'custbody_ava_customerentityid'
			})
			var account = result.getValue({
				name: 'account'
			})
			var accounttype = result.getValue({
				name: 'accounttype'
			})
			var statusref = result.getValue({
				name: 'statusref'
			})
			var classnohierarchy = result.getValue({
				name: 'classnohierarchy'
			})
			var location = result.getValue({
				name: 'location'
			})
			var custPO = result.getValue({
				name: 'custbody_lia_customerponumber'
			})
			var salesrep = result.getValue({
				name: 'salesrep'
			})
			var subtotal = result.getValue({
				name: 'netamountnotax'
			})
			var total = result.getValue({
				name: 'netamount'
			})
			var excludecommission = result.getValue({
				name: 'excludecommission'
			})
			
			

				
				//Add each result as a new line on CSV
			csvFile += internalid+','+date+','+period+','+tranType+','+custEntID+','+account+','+accounttype+','+statusref+','+classnohierarchy+','+location+','+custPO+','+salesrep+','+subtotal+','+total+','+excludecommission+'\r\n'
			return true;
				
			});
          
    		
        		//Variable for datetime
        		var date = new Date();
        		
        		//Creation of file
            		var fileObj = file.create({
        			//To make each file unique and avoid overwriting, append date on the title
        			name: 'SO Data Main Line PBI.csv',
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