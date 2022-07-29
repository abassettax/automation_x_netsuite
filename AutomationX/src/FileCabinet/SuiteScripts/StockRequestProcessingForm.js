/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function stockrequestform() {


  var form = nlapiCreateForm('Process Purchase Requests', false);

  var carr = new Array();

  ////search for pending stock requests
  var stockrequestdetailcolumns = new Array();
  stockrequestdetailcolumns[0] = new nlobjSearchColumn("custrecord212", null, null); // date
  stockrequestdetailcolumns[1] = new nlobjSearchColumn("custrecord188", null, null); //five code
  stockrequestdetailcolumns[2] = new nlobjSearchColumn("custrecord187", null, null); // item
  stockrequestdetailcolumns[3] = new nlobjSearchColumn("custrecord189", null, null);// qty
  stockrequestdetailcolumns[4] = new nlobjSearchColumn("custrecord192", null, null).setSort(false);// location
  stockrequestdetailcolumns[5] = new nlobjSearchColumn("custrecord193", null, null);// Location average demand
  stockrequestdetailcolumns[6] = new nlobjSearchColumn("custrecord209", null, null);// location ava
  stockrequestdetailcolumns[7] = new nlobjSearchColumn("custrecord210", null, null);// ava
  stockrequestdetailcolumns[8] = new nlobjSearchColumn("custrecord197", null, null).setSort(true);//vendor
  stockrequestdetailcolumns[9] = new nlobjSearchColumn("custrecord207", null, null);// new stock item
  stockrequestdetailcolumns[10] = new nlobjSearchColumn("custrecord196", null, null);//notes sales rep
  stockrequestdetailcolumns[11] = new nlobjSearchColumn("custrecord191", null, null);//company average demand
  stockrequestdetailcolumns[12] = new nlobjSearchColumn("custrecord195", null, null);//lead time
  stockrequestdetailcolumns[13] = new nlobjSearchColumn("custrecord203", null, null);// bu
  stockrequestdetailcolumns[14] = new nlobjSearchColumn("custrecord202", null, null);//customer
  stockrequestdetailcolumns[15] = new nlobjSearchColumn("custrecord211", null, null);//from location
  stockrequestdetailcolumns[16] = new nlobjSearchColumn("custrecord214", null, null);//status
  stockrequestdetailcolumns[17] = new nlobjSearchColumn("internalid", null, null);//id  
  stockrequestdetailcolumns[18] = new nlobjSearchColumn("custrecord216", null, null);//MOH 
  stockrequestdetailcolumns[19] = new nlobjSearchColumn("custrecord219", null, null);//componorder
  stockrequestdetailcolumns[20] = new nlobjSearchColumn("custrecord217", null, null);//loc on order 
  stockrequestdetailcolumns[21] = new nlobjSearchColumn("custrecord220", null, null);//est cost 
  stockrequestdetailcolumns[22] = new nlobjSearchColumn("custrecord221", null, null);//sales order
  stockrequestdetailcolumns[23] = new nlobjSearchColumn("custrecord223", null, null);//SO qty 
  stockrequestdetailcolumns[24] = new nlobjSearchColumn("email", "owner", null);//email
  stockrequestdetailcolumns[25] = new nlobjSearchColumn("custrecord224", null, null);//SO line id 



  var stockdetailsearch = nlapiSearchRecord("customrecord463", null,
    [
      ["isinactive", "is", "F"],
      "AND",
      ["custrecord212", "onorbefore", "today"],
      "AND",
      ["custrecord214", "anyof", "@NONE@"]
    ],

    stockrequestdetailcolumns
  );

  //////end search

  var itemList = form.addSubList('custpagesublist', 'inlineeditor', 'Items');

  var carr = new Array();

  if (stockdetailsearch) {
    for (var i = 0; i < stockdetailsearch.length; i++) {
      var Listdates = stockdetailsearch[i].getValue(stockrequestdetailcolumns[0]);
      var Listfivecode = stockdetailsearch[i].getValue(stockrequestdetailcolumns[1]);   //{'custitem35':59,'itemid':59, 'trandate':'12/2/15','tranid':5 };
      var ListItem = stockdetailsearch[i].getValue(stockrequestdetailcolumns[2]);
      var ListQTY = stockdetailsearch[i].getValue(stockrequestdetailcolumns[3]);
      var Listlocation = stockdetailsearch[i].getValue(stockrequestdetailcolumns[4]);
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////run item search for local inventory information
      var itemscolumns = new Array();
      itemscolumns[0] = new nlobjSearchColumn("formulanumeric", null, null).setFormula("CASE WHEN {locationquantitybackordered} > 0 THEN  {locationquantitybackordered}  *-1 ELSE {locationquantityavailable} END"); //locava
      itemscolumns[1] = new nlobjSearchColumn("locationquantityonorder", null, null); // loc on order
      itemscolumns[2] = new nlobjSearchColumn("quantityonorder", null, null); // comp on order
      itemscolumns[3] = new nlobjSearchColumn("quantityavailable", null, null); // comp ava 
      itemscolumns[4] = new nlobjSearchColumn("locationpreferredstocklevel", null, null); //locationpreferredstocklevel
      var itemSearch = nlapiSearchRecord("item", null,
        [
          ["internalidnumber", "equalto", ListItem],
          "AND",
          ["inventorylocation", "anyof", Listlocation]
        ],
        itemscolumns
      );

      var Listlocationava = 0;
      var ListcompAva = 0;
      var ListcompOnOrder = 0;
      var ListlocOnOrder = 0;
      var ListIsStock = 'N';
      var ListLocalPerfStockLevel = 'N';
      if (itemSearch) {
        var Listlocationava = itemSearch[0].getValue(itemscolumns[0]); ///// lookup
        var ListcompAva = itemSearch[0].getValue(itemscolumns[3]);  // lookup
        var ListcompOnOrder = itemSearch[0].getValue(itemscolumns[2]);  // lookup
        var ListlocOnOrder = itemSearch[0].getValue(itemscolumns[1]);  // lookup
        var ListIsStock = 'N';
        var ListLocalPerfStockLevel = itemSearch[0].getValue(itemscolumns[4]);
        if (ListLocalPerfStockLevel > 0) { ListIsStock = 'Y'; }
      }
      //// end item search

      var Listlocavgdeman = stockdetailsearch[i].getValue(stockrequestdetailcolumns[5]);

      var Listvendor = stockdetailsearch[i].getValue(stockrequestdetailcolumns[8]);
      var Listnewstockitem = stockdetailsearch[i].getValue(stockrequestdetailcolumns[9]);
      var Listnotesrep = stockdetailsearch[i].getValue(stockrequestdetailcolumns[10]);
      var ListcompavgDemand = stockdetailsearch[i].getValue(stockrequestdetailcolumns[11]);
      var Listleadtime = stockdetailsearch[i].getValue(stockrequestdetailcolumns[12]);
      var ListBU = stockdetailsearch[i].getText(stockrequestdetailcolumns[13]);
      var Listcustomer = stockdetailsearch[i].getText(stockrequestdetailcolumns[14]);
      var Listfromlocation = stockdetailsearch[i].getValue(stockrequestdetailcolumns[15]);
      //var Liststatus =  stockdetailsearch[i].getValue(stockrequestdetailcolumns[16  ]);
      var Listid = stockdetailsearch[i].getValue(stockrequestdetailcolumns[17]);
      var MOH = stockdetailsearch[i].getValue(stockrequestdetailcolumns[18]);

      var listestCost = ((stockdetailsearch[i].getValue(stockrequestdetailcolumns[21])) * ListQTY).toFixed(2);
      var itemcost = stockdetailsearch[i].getValue(stockrequestdetailcolumns[21]);
      var listeSO = (stockdetailsearch[i].getValue(stockrequestdetailcolumns[22]));
      var listSOQTY = (stockdetailsearch[i].getValue(stockrequestdetailcolumns[23]));
      var ListSOlineID = (stockdetailsearch[i].getValue(stockrequestdetailcolumns[25]));
      var listeSOText = (stockdetailsearch[i].getText(stockrequestdetailcolumns[22]));
      var listempemail = stockdetailsearch[i].getValue(stockrequestdetailcolumns[24]);
      var Liststatus = '';
      var listtestCostformated = '$' + parseFloat(listestCost).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      var LOCMOH = 0;

      ////////////////////////////////////////////////////////start default status select choose PO, TO 
      var CheckitemAVA = nlapiSearchRecord("item", null,
        [
          ["internalidnumber", "equalto", ListItem],
          "AND",
          ["quantityavailable", "greaterthan", "0"],
          "AND",
          ["custitem_tjinc_monthsonhand", "greaterthan", "3"]
        ],
        [new nlobjSearchColumn("itemid").setSort(false)]
      );
      nlapiLogExecution('DEBUG', 'ListItem', ListItem);
      nlapiLogExecution('DEBUG', 'CheckitemAVA', CheckitemAVA);
      if (!CheckitemAVA && !Listfromlocation) { Liststatus = '1'; }
      else if (!Listfromlocation) {
        nlapiLogExecution('DEBUG', 'inElse', 'inElse');
        var LocADcolumns = new Array();
        LocADcolumns[0] = new nlobjSearchColumn("internalid", "inventoryLocation", "GROUP");
        LocADcolumns[1] = new nlobjSearchColumn("formulanumeric", null, "SUM").setFormula("  CASE WHEN ({transaction.location}= {inventorylocation} ) THEN  ABS({transaction.quantity})/3 ELSE NULL END");
        LocADcolumns[2] = new nlobjSearchColumn("locationquantityavailable", null, "MAX")
        var itemSearchAD = nlapiSearchRecord("item", null,
          [
            [["locationquantityonhand", "greaterthan", "0"], "OR", ["locationpreferredstocklevel", "greaterthan", "0"], "OR", ["locationquantityonorder", "greaterthan", "0"]],
            "AND",
            ["inventorylocation.custrecord17", "is", "T"],
            "AND",
            [["transaction.type", "anyof", "SalesOrd", "Build"], "AND", ["transaction.mainline", "is", "F"], "AND", ["transaction.trandate", "within", "daysago90", "daysfromnow1"]],
            "AND",
            ["internalidnumber", "equalto", ListItem]
          ],
          LocADcolumns
        );

        if (itemSearchAD) {
          for (var k = 0; k < itemSearchAD.length; k++) {
            var tmp = 0;
            var inventorylocationAD = itemSearchAD[k].getValue(LocADcolumns[0]);
            var averagedemandAD = parseInt(itemSearchAD[k].getValue(LocADcolumns[1]));
            var LocAVAad = parseInt(itemSearchAD[k].getValue(LocADcolumns[2]));

            if ((averagedemandAD < 1 || !averagedemandAD) && LocAVAad > ListQTY) { tmp = 99; } else if (averagedemandAD > 0 && LocAVAad > ListQTY) { tmp = LocAVAad / averagedemandAD; }
            if (tmp > LOCMOH) { Listfromlocation = inventorylocationAD, LOCMOH = tmp; }

            Liststatus = '2';
          }

          Liststatus = '2';

        }
      } else { Liststatus = ''; }

      ////////////////////////////////////  Purchase order=1 Transfer Order=2 rejected=3

      /////////////////////////////////////////////////////////end default status select
      var demandavg = Listlocavgdeman + " / " + ListcompavgDemand;
      var ListcustBU = ListBU + " / " + Listcustomer;
      if (!Listlocationava) { Listlocationava = 0; } if (!ListcompAva) { ListcompAva = 0; }
      var locCompava = Listlocationava + ' / ' + ListcompAva;
      if (!ListlocOnOrder) { ListlocOnOrder = 0; } if (!ListcompOnOrder) { ListcompOnOrder = 0; }
      var loccomponorder = ListlocOnOrder + ' / ' + ListcompOnOrder;
      if (listSOQTY > 0) { var asdf = 0; } else { listeSOText = ""; }

      var rowstring = { 'avgcost': itemcost, 'custitem35': Listfivecode, 'itemid': ListItem, 'locationid': Listlocation, 'fromlocationid': Listfromlocation, 'qty': ListQTY, 'status': Liststatus, 'forecastnotes': Listnotesrep, 'custbu': ListcustBU, 'loccompava': locCompava, 'loccomponorder': loccomponorder, 'locad': Listlocavgdeman, 'empemails': listempemail, 'moh': MOH, 'compad': ListcompavgDemand, 'newstock': Listnewstockitem, 'leadtime': Listleadtime, 'vendor': Listvendor, 'id': Listid, 'customer': Listcustomer, 'estcost': listtestCostformated, 'so': listeSO, 'soqty': listSOQTY, 'solineid': ListSOlineID, 'sotext': listeSOText, 'demandavgs': demandavg, 'isstocked': ListIsStock, }; //
      carr[i] = rowstring;
    }
  }

  //create the Fields for the Sublist 

  itemList.addField('status', 'select', 'Status', 'customlist465').setDisplayType('entry');
  itemList.addField('isstocked', 'text', 'Stocked Item', null).setDisplayType('disabled');
  itemList.addField('custitem35', 'text', 'AX 5 Code', null).setDisplayType('disabled');
  itemList.addField('itemid', 'select', 'Item', 'item').setDisplayType('entry');
  itemList.addField('qty', 'integer', 'QTY', null).setDisplayType('entry');
  itemList.addField('soqty', 'integer', 'SO QTY', null).setDisplayType('disabled');

  itemList.addField('locationid', 'select', 'Location', 'location').setDisplayType('entry');
  itemList.addField('fromlocationid', 'select', 'From Location', 'location').setDisplayType('entry');
  itemList.addField('moh', 'text', 'MOH', null).setDisplayType('disabled');
  itemList.addField('demandavgs', 'text', 'Local / Company Demand', null).setDisplayType('disabled');
  itemList.addField('customer', 'text', 'customer', 'customer').setDisplayType('hidden');

  itemList.addField('loccompava', 'text', 'Local / Company Avalible', null).setDisplayType('disabled');

  itemList.addField('loccomponorder', 'text', 'Local / Company On Order', null).setDisplayType('disabled');

  itemList.addField('locad', 'text', 'Local Demand', null).setDisplayType('hidden');
  itemList.addField('compad', 'text', 'Company Demand', null).setDisplayType('hidden');

  itemList.addField('leadtime', 'text', 'Lead Time', null).setDisplayType('disabled');
  itemList.addField('vendor', 'select', 'Vendor', 'vendor').setDisplayType('entry');
  itemList.addField('newstock', 'checkbox', 'Add Stock Level', null).setDisplayType('entry');
  itemList.addField('forecastnotes', 'text', 'Forecast/Notes', null).setDisplayType('disabled');
  itemList.addField('purchasingnotes', 'textarea', 'Purchasing Notes', null).setDisplayType('entry');
  itemList.addField('so', 'text', 'Sales Order id', null).setDisplayType('hidden');
  itemList.addField('avgcost', 'text', 'cost', null).setDisplayType('hidden');
  itemList.addField('sotext', 'text', 'Sales Order', null).setDisplayType('entry');
  itemList.addField('custbu', 'text', 'BU/Customer', null).setDisplayType('disabled');
  itemList.addField('estcost', 'text', 'Estimated Cost', null).setDisplayType('disabled');
  itemList.addField('id', 'integer', 'ID', null).setDisplayType('disabled');
  //itemList.addField('trandate','date', 'Last Purchased', null).setDisplayType('disabled'); 
  //itemList.addField('qty','integer', 'QTY', null).setDisplayType('entry');
  itemList.addField('solineid', 'integer', 'solineid', null).setDisplayType('hidden');
  itemList.addField('empemails', 'email', 'email', null).setDisplayType('hidden');

  itemList.setLineItemValues(carr);
  response.writePage(form);

  // form.addButton('custpage_process', 'Create Transactions Test', 'stockrequestbuttontest()');
  form.addButton('custpage_process', 'Create Transactions', 'stockrequestbutton()');
  form.addButton('custpage_process', 'Open Item', 'openitem()');
  form.addButton('custpage_process', 'Clear All Lines', 'clearalllines()');
  form.addButton('custpage_process', 'Open Stock Request', 'openrequest()');
  form.addButton('custpage_process', 'Check Inventory', 'getinv()');
  form.addButton('custpage_process', 'Transaction History', 'tranHistory()');
  form.addButton('custpage_process', 'Customer History', 'gethist()');

  form.setScript('customscript897'); // sets the script on the client side
}