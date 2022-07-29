function schParentCHildPriceupdate(pID , Ctype, s_type)
{
var  context = nlapiGetContext();
 var  pID = context.getSetting('SCRIPT', 'custscript5');
var   Ctype = context.getSetting('SCRIPT', 'custscript6');
  
nlapiLogExecution('DEBUG', 'parent',  "p"+ pID + " " + Ctype +" "  );
TJINC_ATXNED_UpdateSubCustomers(pID , Ctype, s_type);

}