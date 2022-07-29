/****************************************************
 * This scheduled script looks for customers that
 * have placed multiple orders in the last 30 days.
 * It will send a thank you email to these customers
 * on behalf of their sales reps.
 */
function findHotCustomerScheduled(type)
{
  //Invoke only when it is scheduled
  if(type == 'scheduled')
  {
    //Obtaining the context object and logging the remaining usage available
    var context = nlapiGetContext();
    nlapiLogExecution('DEBUG', 'Remaining usage at script beginning', context.getRemainingUsage());
		
    //Setting up filters to search for sales orders
    //with trandate of today.
    var todaySOFilters = new Array();
    todaySOFilters[0] = new nlobjSearchFilter('trandate', null, 'on', 'today');
 
    //Setting up the columns.  Note the join entity.salesrep column.
    var todaySOColumns = new Array();
    todaySOColumns[0] = new nlobjSearchColumn('tranid', null, null);
    todaySOColumns[1] = new nlobjSearchColumn('entity', null, null);
    todaySOColumns[2] = new nlobjSearchColumn('salesrep', 'entity', null);
		
    //Search for the sales orders with trandate of today
    var todaySO = nlapiSearchRecord('salesorder', null, todaySOFilters, todaySOColumns);
    nlapiLogExecution('DEBUG', 'Remaining usage after searching sales orders from today', context.getRemainingUsage());
		
    //Looping through each result found
    for(var i = 0; todaySO != null && i < todaySO.length; i++)
    {
      //obtain a result
      var so = todaySO[i];
			
      //Setting up the filters for another sales order search
      //that are of the same customer and have trandate within
      //the last 30 days
      var oldSOFilters = new Array();
      var thirtyDaysAgo = nlapiAddDays(new Date(), -30);
      oldSOFilters[0] = new nlobjSearchFilter('trandate', null, 'onorafter', thirtyDaysAgo);
      oldSOFilters[1] = new nlobjSearchFilter('entity', null, 'is', so.getValue('entity'));
      oldSOFilters[2] = new nlobjSearchFilter('tranid', null, 'isnot', so.getValue('tranid'));
			
      //Search for for the repeated sales in the last 30 days
      var oldSO = nlapiSearchRecord('salesorder', null, oldSOFilters, null);
      nlapiLogExecution('DEBUG', 'Remaining usage after in for loop, i=' + i, context.getRemainingUsage());
			
      //If results are found, send a thank you email
      if(oldSO != null)
      {
        //Setting up the subject and body of the email
        var subject = 'Thank you!';
        var body = 'Dear ' + so.getText('entity') + ', thank you for your repeated business in the last 30 days.';
				
        //Sending the thank you email to the customer on behalf of the sales rep
        //Note the code to obtain the join column entity.salesrep
        nlapiSendEmail(so.getValue('salesrep', 'entity'), so.getValue('entity'), subject, body);
        nlapiLogExecution('DEBUG', 'Remaining usage after sending thank you email', context.getRemainingUsage());
      }
    }
  }
}