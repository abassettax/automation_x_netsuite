function CustomerTopItemsListForm(request, response)
{

 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  var recId = request.getParameter('idd');
  if (request.getMethod() == 'GET' )
     {
     var recId = request.getParameter('idd');
     // create the form
       var form = nlapiCreateForm('Frequently Purchased Items', true);
       form.addField('custidd', 'text', 'Customer').setDisplayType('hidden');
       form.setFieldValues({custidd:recId});
      var cname = nlapiLookupField('customer', recId ,'companyname');
       form.addField('custname', 'text', 'Customer Name').setDisplayType('inline');
       form.setFieldValues({custname:cname});

 var custhistcolumns = new Array();
/* custhistcolumns[0] =  new nlobjSearchColumn("internalid",null, "GROUP");
 custhistcolumns[1] =  new nlobjSearchColumn("custitem35",null , "GROUP");
 custhistcolumns[2] =  new nlobjSearchColumn("formulanumeric",null,"COUNT").setFormula("{transaction.internalid}").setSort(true); //new nlobjSearchColumn("tranid","transaction", "COUNT").setSort(true);
 custhistcolumns[3] =  new nlobjSearchColumn("trandate","transaction",  "MAX");
custhistcolumns[4] =  new nlobjSearchColumn("itemid",null, "GROUP");
custhistcolumns[5] =  new nlobjSearchColumn("formulatext",null,"GROUP").setFormula("{name} || {displayname}");
custhistcolumns[6] =  new nlobjSearchColumn("manufacturer",null, "GROUP");
custhistcolumns[7] =  new nlobjSearchColumn("mpn",null, "GROUP");
custhistcolumns[8] =  new nlobjSearchColumn("salesdescription", null, "GROUP");*/
       
custhistcolumns[0] =  new nlobjSearchColumn("internalid","item", "GROUP");
 custhistcolumns[1] =  new nlobjSearchColumn("custitem35","item" , "GROUP");
 custhistcolumns[2] =  new nlobjSearchColumn("internalid",null,"COUNT").setSort(true); //  .setFormula("{transaction.internalid}").setSort(true); //new nlobjSearchColumn("tranid","transaction", "COUNT").setSort(true);
 custhistcolumns[3] =  new nlobjSearchColumn("trandate", null,  "MAX");
custhistcolumns[4] =  new nlobjSearchColumn("itemid","item", "GROUP");
custhistcolumns[5] =  new nlobjSearchColumn("formulatext",null,"GROUP").setFormula("{item.name} || {item.displayname}");
custhistcolumns[6] =  new nlobjSearchColumn("manufacturer","item", "GROUP");
custhistcolumns[7] =  new nlobjSearchColumn("mpn","item", "GROUP");
custhistcolumns[8] =  new nlobjSearchColumn("salesdescription", "item", "GROUP");

 //       var recId = request.getParameter('idd');
    //var invoiceSearch = nlapiSearchRecord("item",null,   
var invoiceSearch = nlapiSearchRecord("invoice",null,
[
  // ["isinactive","is","F"], 
//   "AND", 
//   ["transaction.name","anyof", cname],  //930 
 //  "AND", 
//   ["transaction.trandate","within","daysago365","daysago0"]
   ["trandate","onorafter","daysago180"], 
   "AND", 
   ["closed","is","F"], 
   "AND", 
   ["type","anyof","CustInvc"], 
   "AND", 
   ["mainline","is","F"], 
   "AND", 
   ["taxline","is","F"], 
   "AND", 
   ["shipping","is","F"], 
   "AND", 
   ["customer.internalidnumber","equalto",recId], 
   "AND", 
   ["item.isinactive","is","F"], 
   "AND", 
   ["item.custitem35","isnotempty",""], 
   "AND", 
   ["custcol38","doesnotstartwith","-01277"]
], 
custhistcolumns
);
  
     var itemList = form.addSubList('custpagesublist','inlineeditor','Items');  //inlineeditor
     //nlapiLogExecution('DEBUG', 'customer record created successfully', SL);

var carr = new Array();
       if(invoiceSearch){
  for(var i=0; i < invoiceSearch.length; i++)
  {
    var Listfivecode = invoiceSearch[i].getValue(custhistcolumns[1]);
    var ListItem = invoiceSearch[i].getValue(custhistcolumns[0]);
    var ListLastPurchase = invoiceSearch[i].getValue(custhistcolumns[3]);
    var ListDocCount = invoiceSearch[i].getValue(custhistcolumns[2]);
    var ListMPN = invoiceSearch[i].getValue(custhistcolumns[7]);
    var ListManufacture = invoiceSearch[i].getValue(custhistcolumns[6]);
    var Listitemname = invoiceSearch[i].getValue(custhistcolumns[5]);
    var ListitemSalesname = invoiceSearch[i].getValue(custhistcolumns[8]);
    
    var rowstring = {'custitem35':Listfivecode, 'itemids':ListItem,'trandate':ListLastPurchase, 'tranid':ListDocCount,  'mpn':ListMPN, 'manufacture':ListManufacture, 'salesname':ListitemSalesname };
    carr[i]= rowstring ;
  }
       }

       //create the Fields for the Sublist
itemList.addField('custitem35','text', 'AX 5 Code', null).setDisplayType('disabled'); 
itemList.addField('qty','integer', 'QTY', null).setDisplayType('entry');        

itemList.addField('itemids','select', 'Item', 'item').setDisplayType('entry');
itemList.addField('salesname','textarea', 'Description', 'Description').setDisplayType('normal');  

itemList.addField('mpn', 'text', 'MPN', null).setDisplayType('disabled');
itemList.addField('manufacture', 'text', 'Manufacture', null).setDisplayType('disabled');
       
itemList.addField('trandate','date', 'Last Purchased', null).setDisplayType('disabled'); 
itemList.addField('tranid', 'text', 'Count of Invoices', null).setDisplayType('disabled');
       
       itemList.setLineItemValues( carr);
       response.writePage( form );
    
   form.addButton('custpage_createQuote', 'Create Quote', 'submitbutton()');  
   	form.setScript('customscript479'); // sets the script on the client side
}

}