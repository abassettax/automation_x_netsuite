function BUPROFITCLIENT(name,type)
{
 
if(name = 'custpage_periodselect'  &&  nlapiGetFieldValue('custpage_periodselect') == 'LP' )
  {
var accountingperiodSearch = nlapiSearchRecord("accountingperiod",null,
[
   ["enddate","within","lastmonth"], 
   "AND", 
   ["alllocked","is","T"]
], 
[
   new nlobjSearchColumn("periodname").setSort(false)
]
);
 var isDefaultLP = true;
   
  if(!accountingperiodSearch){   isDefaultLP =false;}
    
    if(isDefaultLP ==false ){ alert('The selected Income Statement is still being reviewed & is pending publication.  Please check back later.'); nlapiSetFieldValue('custpage_periodselect', 'PBL');}


  }
return true;
}