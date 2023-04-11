function salesLinksCard(request, response) {
  ////////////////////////sales search
  nlapiLogExecution('debug', 'entry', 'test');

  //New Opportunity, New Quote, New Sales Order
  var searchName21 = 'New Opportunity';
  var searchUrl21 = 'https://422523.app.netsuite.com/app/accounting/transactions/opprtnty.nl?whence=';
  var searchName22 = 'New Quote';
  var searchUrl22 = 'https://422523.app.netsuite.com/app/accounting/transactions/estimate.nl?whence=';
  var searchName23 = 'New Sales Order';
  var searchUrl23 = 'https://422523.app.netsuite.com/app/accounting/transactions/salesord.nl?whence=';

  var searchName1 = 'Pending Billing';
  var searchUrl1 = 'https://422523.app.netsuite.com/app/reporting/reportrunner.nl?cr=1711';
  var searchName2 = 'Fully Committed Pending FF';
  var searchUrl2 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7182&whence=';
  var searchName3 = 'Open Sales Orders';
  var searchUrl3 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=6963';
  var searchName4 = 'Committed/Backordered Summary';
  var searchUrl4 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7345&whence=';
  var searchName5 = 'Back Orders w no PO or PR';
  var searchUrl5 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7374&whence=';
  var searchName6 = 'Reallocate Items';
  var searchUrl6 = 'https://422523.app.netsuite.com/app/accounting/transactions/reallocitems.nl';

  //AX Leads & Prospects by Rep, SALES Open Opportunities, AX SALES Dashboard -- My Open Quotes
  var searchName24 = 'Leads & Prospects';
  var searchUrl24 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7412';
  var searchName25 = 'Open Opportunities';
  var searchUrl25 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7172';
  var searchName26 = 'Open Quotes';
  var searchUrl26 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=6537';
  var searchName30 = 'New Lead';
  var searchUrl30 = 'https://422523.app.netsuite.com/app/common/entity/custjob.nl?stage=lead&whence=';
  var searchName31 = 'New Prospect';
  var searchUrl31 = 'https://422523.app.netsuite.com/app/common/entity/custjob.nl?stage=prospect&whence=';
  var searchName32 = 'New Customer';
  var searchUrl32 = 'https://422523.app.netsuite.com/app/common/entity/custjob.nl?whence=';

  //AX Customers by Class/spend report, top items report, customer slip report
  var searchName27 = 'Customers by Class w Spend';
  var searchUrl27 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7187';
  var searchName28 = 'Top Items per Customer';
  var searchUrl28 = 'https://422523.app.netsuite.com/app/common/search/searchredirect.nl?id=7513';
  var searchName29 = 'Customer Slip Report';
  var searchUrl29 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7514';

  var searchName7 = 'Customers w Hold Status';
  var searchUrl7 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7385&whence=';
  var searchName8 = 'Customers Nearing Hold';
  var searchUrl8 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7421&whence=';
  var searchName9 = 'Open RMAs';
  var searchUrl9 = 'https://422523.app.netsuite.com/app/common/search/searchredirect.nl?id=435';
  var searchName10 = 'Item Lookup';
  var searchUrl10 = 'https://422523.app.netsuite.com/app/common/search/searchredirect.nl?id=7220';
  var searchName11 = 'Overstock Items';
  var searchUrl11 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7466&whence=';
  var searchName12 = 'Purchasing/Sourcing Inquiry';
  var searchUrl12 = 'https://422523.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2472&deploy=1&compid=422523';
  var searchName33 = 'My Pending RFQs';
  var searchUrl33 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7550';
  var searchName13 = 'Open Purchase Orders';
  var searchUrl13 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?&searchid=7465&whence=';
  var searchName14 = 'My BUs Purchase Requests';
  var searchUrl14 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7147&whence=';
  var searchName15 = 'Drop Ship Report';
  var searchUrl15 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=432';
  var searchName16 = 'New Transfer Order';
  var searchUrl16 = 'https://422523.app.netsuite.com/app/accounting/transactions/trnfrord.nl?whence=';
  var searchName17 = 'Open Transfer Orders';
  var searchUrl17 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=2261';
  var searchName18 = 'Item Receipts Last 7 Days';
  var searchUrl18 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=7405';
  var searchName19 = 'Sales Daily Transaction Summary V2';
  var searchUrl19 = 'https://422523.app.netsuite.com/app/common/search/searchredirect.nl?id=383';
  var searchName20 = 'Warehouse Picklist';
  var searchUrl20 = 'https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=828&whence=';

  var content = ''
  content += "<p>General</p><table font-family: \"Arial\"; style=\"font-size:18px; width: 100%;\" ><tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl21 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName21 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl22 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName22 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl23 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName23 +"</a></td></tr>";
  content += "<td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl16 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName16 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl10 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName10 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl11 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName11 +"</a></td></tr>";
  content += "<tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl19 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName19 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl20 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName20 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl12 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName12 +"</a></td></tr>";
  content += "<tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl33 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName33 +"</a></td></tr></table>";

  content += "<p>CRM</p><table font-family: \"Arial\"; style=\"font-size:18px; width: 100%;\" ><tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl30 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName30 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl31 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName31 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl32 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName32 +"</a></td></tr>";
  content += "<tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl24 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName24 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl25 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName25 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl26 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName26 +"</a></td></tr>";
  content += "<tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl27 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName27 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl28 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName28 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl29 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName29 +"</a></td></tr>";
  content += "<tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl7 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName7 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl8 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName8 +"</a></td></tr></table>";

  content += "<p>Transactions</p><table font-family: \"Arial\"; style=\"font-size:18px; width: 100%;\" ><tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl1 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName1 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl2 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName2 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl3 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName3 +"</a></td></tr>";
  content += "<tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl4 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName4 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl5 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName5 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl6 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName6 +"</a></td></tr>";
  content += "<tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl13 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName13 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl14 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName14 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl15 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName15 +"</a></td></tr>";
  content += "<tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl17 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName17 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl18 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName18 +"</a></td><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><a href=\"" + searchUrl9 + "\" target=\"_blank\" style=\"color:black; display:block; text-decoration: none\">" + searchName9 +"</a></td></tr></table>";

  //pending billing               | fully committed pending ff     | sales order report
  //committed/back ordered report | back order report              | reallocate items
  //customers on hold             | customers nearing hold         | rma
  //item lookup                   | top overstock items            | purchasing/sourcing inquiry
  //open po                       | my bu purchase requests        | drop ship report
  //new transfer order            | open transfers                 | item receipts last 7 days
  //sales daily summary v2        | warehouse picklist

  response.write(content);
}