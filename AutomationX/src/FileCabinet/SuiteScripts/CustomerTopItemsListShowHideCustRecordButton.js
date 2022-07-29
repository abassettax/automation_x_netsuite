function HideshowCustomerTopItemsButton(type)
{

if (type == 'view' ||  type == 'edit')// || type == 'copy')
{

  form.addButton('custpage_custtopitems', 'Frequently Purchased Items', 'createfavoritesquoteClient() ');  
  form.setScript('customscript480'); // sets the script on the client side
  
  //sales order
  form.addButton('custpage_custtopitems', 'Create Sales Order', 'createso() '); 
  
  //quote
  form.addButton('custpage_custtopitems', 'Create Quote', 'createquote() '); 
  
 //forecast
  form.addButton('custpage_custforecast', 'Submit Forecast', 'SubmitForecast() '); 

   //lost item sales
  form.addButton('custpage_custforecast', 'Submit Lost Item Demand', 'RecordLostCustomerItem() '); 
}
}