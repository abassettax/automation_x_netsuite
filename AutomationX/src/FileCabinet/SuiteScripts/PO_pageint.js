// function PO_buttonActions() {

//     var uid = nlapiGetCurrentLineItemValue('item', 'item');

//     if (uid == "") {
//         alert("Please select a line to check inventory.");
//         return true;
//     }

//     if (type == 'item' && uid == "") return true;
//     {

//         var invoiceSearch = nlapiSearchRecord("invoice", null,
//             [
//                 ["type", "anyof", "CustInvc"],
//                 "AND",
//                 ["mainline", "is", "F"],
//                 "AND",
//                 ["item.internalidnumber", "equalto", uid],
//                 "AND",
//                 ["trandate", "within", "daysago90", "daysago0"]
//             ],
//             [
//                 new nlobjSearchColumn("tranid", null, null)
//             ]
//         );
//         var w = screen.width - 50;

//         if (!invoiceSearch) {
//             window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INTERNALID=" + uid + "&style=NORMAL&report=&grid=&searchid=3995&sortcol=Item_INVENTOCATION17_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F", "newwin", "dependent = yes, height=800, width=" + w + ", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");
//         }
//         else {
//             window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INTERNALID=" + uid + "&style=NORMAL&report=&grid=&searchid=3993&sortcol=Item_INVENTOCATION17_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F", "newwin", "dependent = yes, height=800, width=" + w + ", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");
//         }




//         return true;

//     }
// }
////////////////////////////////////////
////////////////////////////////////////
/////////////////////////////////////////

function PO_PageInt(type) {

    // if (!localStorage.boochiefs) { localStorage.boochiefs = 0; };
    // var goraiders = localStorage.boochiefs;
    // var w = screen.width - 50;
    // var h = screen.hiegth - 50;

    //if((nlapiGetUser() ==7270 || nlapiGetUser() == 3354 ||nlapiGetUser() ==  8069)  && goraiders.length <2 && 1==2)
    //  {
    //alert("They Say turnabout is fair play.");
    //alert("  ");
    //window.open(" https://www.youtube.com/watch?v=ue54mh8b7JE ", "newwin", "dependent = yes, height="+h+", width=" + w +", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");
    //localStorage.boochiefs = localStorage.boochiefs + 1;
    //https://www.youtube.com/watch?v=tVugVQsjyaI   
    //https://www.youtube.com/watch?v=og-Euqdn4sM   
    //  }


    var dropc = 0;
    // var loc = nlapiGetFieldValue('location');
    for (x = 1; x <= nlapiGetLineItemCount('item'); x++) {


        // var itemloc = nlapiGetLineItemValue('item', 'location', x);
        var drop = nlapiGetLineItemValue('item', 'custcol4', x, x);
        if (drop == "T") { dropc++ }



    }

    var headerdrop = nlapiGetFieldValue('custbody147');


    if (dropc > 0 && headerdrop == "F") {
        //alert("Drop Ship");
        nlapiSetFieldValue('custbody147', "T");
    }


    var soid = nlapiGetFieldValue('createdfrom');

    if (dropc > 0 && headerdrop == "F" && (soid == null || soid == "")) {
        alert("Drop Ship Not Linked To Sales Order. Please manually enter a shipping address.");

    }

    if (type == 'create') {
        var userRole = nlapiGetRole();
        // alert(userRole);
        var allowedRoles = [3,1052,1115,1003,1060,1054];
        // alert(allowedRoles.indexOf(parseInt(userRole)));
        if (allowedRoles.indexOf(parseInt(userRole)) == -1) {
          //show alert and redirect
          alert("Your role does not have permission to create purchase orders directly. Please create POs using Purchase Requests from Sales Order lines or standalone Purchase Requests for Stock Requests. Redirecting you to the home page.");
          var homeUrl = "https://422523.app.netsuite.com/app/center/card.nl?sc=-29&whence=";
          window.open(homeUrl , "_self");
        }
      }
    if (type == 'edit') {
        var poId = nlapiGetRecordId();
        var vendor = nlapiGetFieldValue('entity');
        // alert(vendor);
        var userRole = nlapiGetRole();
        // alert(userRole);
        var allowedRoles = [3,1052,1115,1003,1060,1054];
        // alert(vendor != '2491');
        // alert(allowedRoles.indexOf(parseInt(userRole)));
        if (vendor != '2491' && allowedRoles.indexOf(parseInt(userRole)) == -1) {
            alert("Your role does not have permission to edit purchase orders other than those for Credit Card Purchase Tracker %. If you need something added or changed on this PO, please reach out to Purchasing. Redirecting you to View mode.");
            var poViewUrl = nlapiResolveURL('RECORD', 'purchaseorder', poId );
            window.open(poViewUrl , "_self");
        }
    }
}