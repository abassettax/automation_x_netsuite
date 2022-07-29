/**THIS IS  AN UNFINISHED SCRIPT TO MEANT TO SAVE INVOICES TO A FILE IN MASS.  
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/file','N/render','N/search'],
function (file,render,search) { 
        function execute(context) {
		
            var mySearch = search.load({
                id: '2369'
            });
			var entity='';
            mySearch.run().each(function(result) {
                entity = result.getValue({
                    name: 'entity'
                });
                return true;
            });

		var transactionFile = render.transaction({
    entityId: 1234260,
    printMode: render.PrintMode.PDF
    });
		
	

            var fileObj = file.create({
                name: 'test1.pdf',
                fileType: file.Type.PDF,
                contents: transactionFile
            });
            fileObj.folder = 2771293;
            var id = fileObj.save();
        }
        return {
            execute: execute
        };
	
});