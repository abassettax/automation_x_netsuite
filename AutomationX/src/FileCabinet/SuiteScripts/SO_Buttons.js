function checkalts() {
    try {
        var thisLocation = nlapiGetCurrentLineItemValue('item', 'location');
        var thisLocationText = nlapiGetCurrentLineItemText('item', 'location');
        var thisitemid = nlapiGetCurrentLineItemValue('item', 'item');
        var itype = nlapiGetCurrentLineItemValue('item', 'itemtype'); // Get the item type
        var recordtype = '';
        var content = "";


        if (!thisitemid) { 
            alert("Please select an item to view alternates."); 
            return false; 
        }

        if (!thisLocation) { 
            alert("Please select a Location to view alternatives"); 
            return false; 
        }

        switch (itype) {  
            case 'InvtPart':
                recordtype = 'inventoryitem';
                break;
            case 'NonInvtPart':
                recordtype = 'noninventoryitem';
                break;
            case 'Service':
                recordtype = 'serviceitem';
                break;
            case 'Assembly':
                recordtype = 'assemblyitem';
                break;

            case 'GiftCert':
                recordtype = 'giftcertificateitem';
                break;
            default:
        }

        var altitemid = nlapiLookupField(recordtype, thisitemid, 'custitem108');

        var w = screen.width - 100;
        var h = screen.height - 200;

        //////////////////start pref alts
        var otherPrefAltSearchColumns = new Array();
        otherPrefAltSearchColumns[0] = new nlobjSearchColumn("custitem35", "CUSTRECORD302", "GROUP");
        otherPrefAltSearchColumns[1] = new nlobjSearchColumn("CUSTRECORD302", null, "GROUP");
        otherPrefAltSearchColumns[2] = new nlobjSearchColumn("salesdescription", "CUSTRECORD302", "GROUP");
        otherPrefAltSearchColumns[3] = new nlobjSearchColumn("locationquantityonhand", "CUSTRECORD302", "MAX");
        otherPrefAltSearchColumns[4] = new nlobjSearchColumn("locationquantityonorder", "CUSTRECORD302", "MAX");
        otherPrefAltSearchColumns[5] = new nlobjSearchColumn("locationquantityavailable", "CUSTRECORD302", "MAX");
        otherPrefAltSearchColumns[6] = new nlobjSearchColumn("quantityonhand", "CUSTRECORD302", "MAX");
        otherPrefAltSearchColumns[7] = new nlobjSearchColumn("quantityavailable", "CUSTRECORD302", "MAX");
        otherPrefAltSearchColumns[8] = new nlobjSearchColumn("formulanumeric", null, "MAX").setFormula("Case WHEN {CUSTRECORD302.custitem_tjinc_monthsonhand} IS NULL THEN 0 ELSE {CUSTRECORD302.custitem_tjinc_monthsonhand}  END");
        otherPrefAltSearchColumns[9] = new nlobjSearchColumn("custrecord303", null, "GROUP").setSort(false);
        otherPrefAltSearchColumns[10] = new nlobjSearchColumn("price", "CUSTRECORD302", "MAX");
        otherPrefAltSearchColumns[11] = new nlobjSearchColumn("cost", "CUSTRECORD302", "MAX");

        var otherPrefSearch = nlapiSearchRecord("customrecord672", null,
            [
                ["custrecord302.isinactive", "is", "F"],
                "AND",
                ["custrecord301.internalidnumber", "equalto", thisitemid],
                "AND",
                ["custrecord302.inventorylocation", "anyof", thisLocation]

            ],
            otherPrefAltSearchColumns
        );

        if (!otherPrefSearch) { alert("This item has no alternates. "); return false; }

        content += "<h2>Direct Alternatives</h2>Location: " + thisLocationText;
        content += "<table border=\"2\"><tr><th> &nbsp; &nbsp;5 Code &nbsp; &nbsp;</th><th>Item</th><th>Description </th>  <th>Location On Hand </th>   <th> Location On Order</th>  <th>Location Available</th>  <th>Company On Hand</th>  <th> Company Available</th>  <th> Months On Hand</th>  <th> Purchase Price</th> <th> Base Price</th></tr>";

        for (var i = 0; otherPrefSearch != null && i < otherPrefSearch.length; i++)  ///////start other alts
        {

            if (i % 2 == 0) {
                content += '<tr>';
            }
            else {
                content += "<tr style=\" background-color: #f2f4f7 \">"; //#f2f3f4
            }

            var fivecode = otherPrefSearch[i].getValue(otherPrefAltSearchColumns[0]);
            var items = otherPrefSearch[i].getText(otherPrefAltSearchColumns[1]);
            var desctription = otherPrefSearch[i].getValue(otherPrefAltSearchColumns[2]);
            var LOH = otherPrefSearch[i].getValue(otherPrefAltSearchColumns[3]);
            var LOO = otherPrefSearch[i].getValue(otherPrefAltSearchColumns[4]);
            var LocAVA = otherPrefSearch[i].getValue(otherPrefAltSearchColumns[5]);
            var CompOH = otherPrefSearch[i].getValue(otherPrefAltSearchColumns[6]);
            var CompAva = otherPrefSearch[i].getValue(otherPrefAltSearchColumns[7]);
            var MOH = otherPrefSearch[i].getValue(otherPrefAltSearchColumns[8]);
            var ispref = otherPrefSearch[i].getValue(otherPrefAltSearchColumns[9]); if (ispref == 'T') { ispref = '<b>Preferred</b>'; } else { ispref = ''; }

            var basePrice = '$' + parseFloat(otherPrefSearch[i].getValue(otherPrefAltSearchColumns[10])).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            var purchasePrice = '$' + parseFloat(otherPrefSearch[i].getValue(otherPrefAltSearchColumns[11])).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

            content += "<td style=\"padding-right: 12px;\">" + fivecode + "<br>" + ispref + "</td>";
            content += "<td style=\"padding-right: 12px;\">" + items + "</td>";
            content += "<td style=\"padding-right: 12px; width:30%; \"  >" + desctription + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + LOH + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + LOO + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + LocAVA + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + CompOH + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + CompAva + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + MOH + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + purchasePrice + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + basePrice + "</td>";
            content += "</tr>";


        }  ///////////////////////end other alts


        content += "</table></br></br>";
        //end pref alts

        //// start other alternates
        var otherAltsSearchColumns = new Array();
        otherAltsSearchColumns[0] = new nlobjSearchColumn("custitem35", "CUSTRECORD301", "GROUP");
        otherAltsSearchColumns[1] = new nlobjSearchColumn("custrecord301", null, "GROUP");
        otherAltsSearchColumns[2] = new nlobjSearchColumn("salesdescription", "CUSTRECORD301", "GROUP");
        otherAltsSearchColumns[3] = new nlobjSearchColumn("locationquantityonhand", "CUSTRECORD301", "MAX");
        otherAltsSearchColumns[4] = new nlobjSearchColumn("locationquantityonorder", "CUSTRECORD301", "MAX");
        otherAltsSearchColumns[5] = new nlobjSearchColumn("locationquantityavailable", "CUSTRECORD301", "MAX");
        otherAltsSearchColumns[6] = new nlobjSearchColumn("quantityonhand", "CUSTRECORD301", "MAX").setSort(false);
        otherAltsSearchColumns[7] = new nlobjSearchColumn("quantityavailable", "CUSTRECORD301", "MAX");
        otherAltsSearchColumns[8] = new nlobjSearchColumn("formulanumeric", null, "MAX").setFormula("Case WHEN {custrecord301.custitem_tjinc_monthsonhand} IS NULL THEN 0 ELSE {custrecord301.custitem_tjinc_monthsonhand}  END");

        otherAltsSearchColumns[9] = new nlobjSearchColumn("price", "CUSTRECORD301", "MAX");
        otherAltsSearchColumns[10] = new nlobjSearchColumn("cost", "CUSTRECORD301", "MAX");

        var otherAltsSearch = nlapiSearchRecord("customrecord672", null,
            [
                ["custrecord302.isinactive", "is", "F"],
                "AND",
                ["custrecord302.internalidnumber", "equalto", altitemid],
                "AND",
                ["custrecord301.inventorylocation", "anyof", thisLocation],
                "AND",
                ["custrecord301.quantityavailable", "greaterthan", "0"]
            ],
            otherAltsSearchColumns
        );


        content += "<h2>Other Possible Alternatives</h2>";
        content += "<table border=\"2\"><tr><th> &nbsp; &nbsp;5 Code &nbsp; &nbsp;</th><th>Item</th><th>Description </th>  <th>Location On Hand </th>   <th> Location On Order</th>  <th>Location Available</th>  <th>Company On Hand</th>  <th> Company Available</th>  <th> Months On Hand</th>  <th> Purchase Price</th> <th> Base Price</th></tr>";

        for (var i = 0; otherAltsSearch != null && i < otherAltsSearch.length; i++)  ///////start other alts
        {
            if (i % 2 == 0) {
                content += "<tr>";
            }
            else {
                content += "<tr style=\" background-color: #f2f4f7 \">"; //#f2f3f4
            }

            var fivecode = otherAltsSearch[i].getValue(otherAltsSearchColumns[0]);
            var items = otherAltsSearch[i].getText(otherAltsSearchColumns[1]);
            var desctription = otherAltsSearch[i].getValue(otherAltsSearchColumns[2]);
            var LOH = otherAltsSearch[i].getValue(otherAltsSearchColumns[3]);
            var LOO = otherAltsSearch[i].getValue(otherAltsSearchColumns[4]);
            var LocAVA = otherAltsSearch[i].getValue(otherAltsSearchColumns[5]);
            var CompOH = otherAltsSearch[i].getValue(otherAltsSearchColumns[6]);
            var CompAva = otherAltsSearch[i].getValue(otherAltsSearchColumns[7]);
            var MOH = otherAltsSearch[i].getValue(otherAltsSearchColumns[8]);
            var basePrices = '$' + parseFloat(otherAltsSearch[i].getValue(otherAltsSearchColumns[9])).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            var purchasePrices = '$' + parseFloat(otherAltsSearch[i].getValue(otherAltsSearchColumns[10])).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

            content += "<td style=\"padding-right: 12px;\">" + fivecode + "</td>";
            content += "<td style=\"padding-right: 12px;\">" + items + "</td>";
            content += "<td style=\"padding-right: 12px; width:30%; \"  >" + desctription + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + LOH + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + LOO + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + LocAVA + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + CompOH + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + CompAva + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + MOH + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + purchasePrices + "</td>";
            content += "<td style=\"padding-right: 12px; text-align: center;\">" + basePrices + "</td>";
            content += "</tr>";


        }  ///////////////////////end other alts


        content += "</table></br></br>";
        /////////////end html table

        var iframeOne = '<iframe  style="border: 2px none;  height:30%; margin-top: -0px; width:90%; vertical-align:top; " src=https://422523.app.netsuite.com/app/common/custom/custrecordentrylist.nl?rectype=672&searchtype=Custom&searchid=6017&ALC_Item_INTERNALID=' + altitemid + '></iframe>';
        var iframeTwo = '<iframe  style="border: 2px none;  height:50%; margin-top: -0px; width:90%; vertical-align:bottom; "  src=https://422523.app.netsuite.com/app/common/custom/custrecordentrylist.nl?rectype=672&searchtype=Custom&searchid=6009&ALC_Item_INTERNALID=' + altitemid + '></iframe>';

        var docwrite = '<div></div>';
        var win = window.open(docwrite, '_blank', "dependent = yes, height=" + h + ", width=" + w + ", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes");
        if (win == null) { alert("Your Browsers Popup Blocker has blocked this window.  Please allow Popups from Netsuite. "); return true; }
        win.document.write('<div>' + content + '<br></div>');


        return true;
        // var win = window.open(docwrite , '_blank', "dependent = yes, height="+h+", width=" + w +", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes");
        }catch(e){
            console.log('so_butons',e);
        }
    }

function adjustcostestimate() {

        var item_count = nlapiGetLineItemCount('item');
        for (var t = 1; item_count != null && t <= item_count; t++) {
            var lineEstType = nlapiGetLineItemValue('item', 'costestimatetype_display', t);

            nlapiSelectLineItem('item', t);
            nlapiSetCurrentLineItemValue('item', 'costestimatetype', 'PURCHPRICE', false, true);
            nlapiCommitLineItem('item');

            var getPurchaseCost = nlapiGetLineItemValue('item', 'costestimaterate', t);

            nlapiSelectLineItem('item', t);
            nlapiSetCurrentLineItemValue('item', 'costestimatetype', 'AVGCOST', false, true);
            nlapiCommitLineItem('item');

            var NewLineCost = nlapiGetLineItemValue('item', 'costestimaterate', t);

            if (parseInt(getPurchaseCost) > parseInt(NewLineCost))  ///if(parseInt(NewLineCost) ==0 )  //if(parseInt(getPurchaseCost) > parseInt(NewLineCost) )
            {
                nlapiSelectLineItem('item', t);
                nlapiSetCurrentLineItemValue('item', 'costestimatetype', 'PURCHPRICE', false, true);
                nlapiCommitLineItem('item');
            }

        }
    }

    //TODO: this may be redefining the same function set in the UE script for the main button
    function axClose() {
        var SOid = nlapiGetRecordId();
        var rec = nlapiLoadRecord(nlapiGetRecordType(), SOid);

        var salesorderSearch = nlapiSearchRecord("salesorder", null, [["type", "anyof", "SalesOrd"], "AND", ["mainline", "is", "F"], "AND", ["internalidnumber", "equalto", SOid]],
            [
                new nlobjSearchColumn("quantitypicked"),
                new nlobjSearchColumn("quantitypacked"),
                new nlobjSearchColumn("line")
            ]
        );


        var lineCount = parseInt(rec.getLineItemCount('item'));
        for (x = 1; x <= lineCount; x++) {
            var lineMatched = 'N';
            var SOline = rec.getLineItemValue('item', 'line', x);

            for (i = 0; i < salesorderSearch.length; i++) {
                var searchline = salesorderSearch[i].getValue('line');
                if (SOline == searchline) {
                    lineMatched = 'T';
                    var qtypicked = salesorderSearch[i].getValue('quantitypicked');
                    var qtyPacked = salesorderSearch[i].getValue('quantitypacked');
                    var qtybilled = rec.getLineItemValue('item', 'quantitybilled', x);
                    var qtyfulfilled = rec.getLineItemValue('item', 'quantityfulfilled', x);
                    var qty = rec.getLineItemValue('item', 'quantity', x);

                    var statusmessage = ' \n\n Quantity Pulled: ' + qtypicked + '\n Quantity PickPacked:  ' + qtyPacked + '\n Quantity Fulfilled:  ' + qtyfulfilled + '\n Quantity Invoiced:  ' + qtybilled;
                    //alert(statusmessage);
                    if (qtypicked > qtybilled) {
                        alert('Line # ' + SOline + ' has a quantity fulfilled greater than billed so cannot be closed.  Please finish processing the fulfillment before closing. ' + statusmessage);
                    }
                    else if (qty > 0) {
                        rec.selectLineItem('item', x);
                        rec.setCurrentLineItemValue('item', 'isclosed', "T");
                        rec.commitLineItem('item');
                    }
                }
            }
            if (lineMatched == 'N') {
                rec.selectLineItem('item', x);
                rec.setCurrentLineItemValue('item', 'isclosed', "T");
                rec.commitLineItem('item');
            }

        }
        nlapiSubmitRecord(rec, true);
        location.reload();
    }

    function printstaginglabel() {
        var docid = nlapiGetRecordId();

        //var printURL = 'https://system.na3.netsuite.com/app/common/custom/advancedprint/printsearchresults.nl?printType=SEARCH&l=T&e=T&id=5601&Transaction_INTERNALID='+docid+'&style=NORMAL&report=&grid=&searchid=5601&dle=T&sortcol=Transaction_TRANDATE_raw&sortdir=ASC&pdf=&size=1000&twbx=F&csv=Export&printtemplate=139&whence=';

        var printURL = 'https://422523.app.netsuite.com/app/common/custom/advancedprint/printsearchresults.nl?printType=SEARCH&l=T&e=T&id=5601&Transaction_INTERNALID=' + docid + '&style=NORMAL&report=&grid=&searchid=5601&dle=T&sortcol=Transaction_TRANDATE_raw&sortdir=ASC&pdf=&size=1000&twbx=F&csv=Export&printtemplate=139&whence=';

        var printURL = 'https://422523.app.netsuite.com/app/common/custom/advancedprint/printsearchresults.nl?printType=SEARCH&l=T&e=T&id=5601&Transaction_INTERNALID=' + docid + '&style=NORMAL&report=&grid=&searchid=5601&dle=T&sortcol=Transaction_TRANDATE_raw&sortdir=ASC&pdf=&size=1000&twbx=F&csv=Export&printtemplate=139&whence=';

        window.open(printURL, '_blank');
    }

    function mergecommittedpull() {

        var docid = nlapiGetRecordId();

        var columns = new Array();
        columns[0] = new nlobjSearchColumn("internalid", null, null);
        var transactionSearch = nlapiSearchRecord("itemfulfillment", null,
            [
                ["type", "anyof", "ItemShip"],
                "AND",
                ["mainline", "is", "T"],
                "AND",
                ["status", "anyof", "ItemShip:A"],
                "AND",
                ["formulanumeric: CASE WHEN {custbodycustbodysavedsignature_ff} IS NULL THEN 1 ELSE 0 END", "equalto", "1"],
                "AND",
                ["createdfrom.internalidnumber", "equalto", docid]
            ], columns
        );

        if (transactionSearch) {
            for (x = 0; x < transactionSearch.length && transactionSearch; x++) {
                var deFFid = transactionSearch[x].getValue(columns[0]);

                if (deFFid) {
                    nlapiDeleteRecord('itemfulfillment', deFFid);

                }
            }


            var itemFulfillment = nlapiTransformRecord('salesorder', docid, 'itemfulfillment');
            var fulfillmentId = nlapiSubmitRecord(itemFulfillment, true);
            nlapiSubmitField('itemfulfillment', fulfillmentId, 'shipstatus', 'A', false);
            /////

            var response = 'https://system.na3.netsuite.com/app/accounting/transactions/itemship.nl?whence=&id=' + fulfillmentId + '&e=T '; //nlapiSetRedirectURL( 'RECORD', 'itemfulfillment', fulfillmentId, true ); // nlapiResolveURL('RECORD', 'itemfulfillment',fulfillmentId, 'EDIT' );
            window.open(response, "_blank");

            window.location = window.location.href;
            location.reload();
            ////////
        }
    }

    function openitemss() {
        var uid = nlapiGetCurrentLineItemValue('item', 'item');

        if (!uid) { alert("Please select an item"); return true; }
        if (uid) {
            window.open("https://system.na3.netsuite.com/app/common/item/item.nl?id=" + uid, '_blank');
            return true;
        }
    }

    function viewpastdue() {
        var customerid = nlapiGetFieldValue('entity');
        if (customerid) {
            window.open('https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_NAME=' + customerid + '&style=NORMAL&report=&grid=&searchid=4901&sortcol=Transction_AMONING15_raw&sortdir=DESC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F ');
        }
    }

    function billSOs(frank) {
        //window.open('https://system.na3.netsuite.com/app/accounting/transactions/custinvc.nl?id='+  frank + '&e=T&transform=salesord&memdoc=0&whence=', '_blank');
        //used on Saved search https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=4008&whence=
        if (!nlapiLookupField('salesorder', frank, 'paymentmethod')) { window.open('https://system.na3.netsuite.com/app/accounting/transactions/custinvc.nl?id=' + frank + '&e=T&transform=salesord&memdoc=0&whence=', '_blank'); }  // invoice
        else { window.open('https://system.na3.netsuite.com/app/accounting/transactions/cashsale.nl?id=' + frank + '&e=T&transform=salesord&memdoc=0&whence=', '_blank'); } // credit card
        return true;

    }

    function SOcreateTO() {
        var Hloc = nlapiGetFieldValue('location');
        var TOlocCount = 0;
        var TOlocations = new Array();
        // var rectype = nlapiGetRecordType();
        // alert(rectype);
        if (Hloc) {
            if (nlapiGetCurrentLineItemValue('item', 'item')) {
                nlapiCommitLineItem('item');
            }
            //////loop to create array of all location to create transfer for
            var lineCount = parseInt(nlapiGetLineItemCount('item'));
            for (x = 1; x <= lineCount; x++) {
                var Lloc = nlapiGetLineItemValue('item', 'location', x);
                var createTO = "";
                if (nlapiGetLineItemValue('item', 'custcol90', x) == 5) { createTO = "T"; } else { createTO == nlapiGetLineItemValue('item', 'custcol76', x); }                          //to=2
                if (Lloc != Hloc && createTO) {
                    if (TOlocations.indexOf(Lloc) == -1 && TOlocations) { TOlocations.push(Lloc); }//alert("added " + Lloc); }
                    //else { alert("skipped " +Lloc);  }


                }
            }

            //alert(TOlocations);
            /////start loop to create TO
            for (y = 0; y < TOlocations.length && TOlocations; y++) {

                var currentToLocation = TOlocations[y];
                var Itemsperlocation = 0;

                ////start total line count per location
                var lineCount = parseInt(nlapiGetLineItemCount('item'));
                for (z = 1; z <= lineCount; z++) {
                    var CTOLlocation = nlapiGetLineItemValue('item', 'location', z);
                    var CTOLocationava = nlapiGetLineItemValue('item', 'quantityavailable', z);
                    var CTOcreateTO = ""; //nlapiGetLineItemValue('item', 'custcol76', z);
                    if (nlapiGetLineItemValue('item', 'custcol90', z) == 5) { CTOcreateTO = "T"; } else { CTOcreateTO == nlapiGetLineItemValue('item', 'custcol76', z); }


                    if (currentToLocation == CTOLlocation && CTOLocationava > 0 && CTOcreateTO == "T")// && Hloc != CTOLlocation)
                    {
                        Itemsperlocation = Itemsperlocation + 1;
                    }
                    //else if(currentToLocation == CTOLlocation && CTOcreateTO == "T" && (Hloc == CTOLlocation))
                    //{
                    //alert("The selected source location is the same as the destination location.  Line "+ z + " will not be added to a transfer order. ");
                    //}
                    else if (currentToLocation == CTOLlocation && CTOcreateTO == "T") {
                        alert("The selected location does not have stock avalible.  Line " + z + " will not be added to a transfer order. ");
                    }
                }
                ////end check total line count per locaion
                //alert(currentToLocation + " items " + Itemsperlocation);
                var LinesOnTo = new Array();

                if (Itemsperlocation > 0) {

                    //// start create new TO record.  
                    var newtransferorder = nlapiCreateRecord('transferorder');

                    //set header fields
                    newtransferorder.setFieldValue('location', currentToLocation);
                    newtransferorder.setFieldValue('transferlocation', Hloc);
                    newtransferorder.setFieldValue('employee', nlapiGetUser());
                    newtransferorder.setFieldValue('orderstatus', "B");

                    ////add line items to TO
                    var lineCount = parseInt(nlapiGetLineItemCount('item'));
                    for (m = 1; m <= lineCount; m++) {

                        var CTOLlocation = nlapiGetLineItemValue('item', 'location', m);
                        var CTOLocationava = parseInt(nlapiGetLineItemValue('item', 'quantityavailable', m));
                        //  alert(CTOLocationava);
                        var CTOcreateTO = ""; //nlapiGetLineItemValue('item', 'custcol76', m);
                        if (nlapiGetLineItemValue('item', 'custcol90', m) == 5) { CTOcreateTO = "T"; } else { CTOcreateTO == nlapiGetLineItemValue('item', 'custcol76', m); }
                        var lineQTY = parseInt(nlapiGetLineItemValue('item', 'quantity', m));
                        var itemid = nlapiGetLineItemValue('item', 'item', m);
                        var TOqty = 0;
                        var TOitemcost = 0;
                        if (currentToLocation == CTOLlocation && CTOLocationava > 0 && CTOcreateTO == "T") {

                            LinesOnTo.push(m);
                            //insert items
                            //alert("add line " +m)
                            newtransferorder.selectNewLineItem('item');
                            newtransferorder.setCurrentLineItemValue('item', 'item', itemid, true);
                            //alert("CTOLocationava " + CTOLocationava  +" lineqty " +lineQTY);
                            if (lineQTY <= CTOLocationava) { TOqty = lineQTY; } else if (lineQTY > CTOLocationava) { TOqty = CTOLocationava; }
                            // alert(TOqty); return false;
                            newtransferorder.setCurrentLineItemValue('item', 'quantity', TOqty, true);

                            //get avg cost
                            var itemType = nlapiGetLineItemValue('item', 'itemtype', m);
                            var itemLookupType = '';
                            switch (itemType) {
                                case 'InvtPart':
                                    itemLookupType = 'inventoryitem';
                                    break;
                                case 'NonInvtPart':
                                    itemLookupType = 'noninventoryitem';
                                    break;
                                case 'Assembly':
                                    itemLookupType = 'assemblyitem';
                                    break;
                                case 'Kit':
                                    itemLookupType = 'kititem';
                                    break;
                            }

                            var record = nlapiLoadRecord(itemLookupType, itemid);
                            //var newcost = record.getFieldValue( 'averagecost');

                            var itemlocation = record.getLineItemCount('locations');
                            for (t = 1; t <= itemlocation; t++) {
                                var invloc = record.getLineItemValue('locations', 'locationid', t);
                                if (CTOLlocation == invloc) {
                                    var invloccost = record.getLineItemValue('locations', 'averagecostmli', t);
                                    if (invloccost > 0) { TOitemcost = invloccost; }
                                    else if (newcost > 0) { invloccost = record.getFieldValue('averagecost'); }
                                    else { invloccost = record.getFieldValue('cost'); }

                                }

                                // end get avg cost
                            }
                            newtransferorder.setCurrentLineItemValue('item', 'rate', invloccost, true);
                            newtransferorder.commitLineItem('item');
                        }
                    }



                    var idd = nlapiSubmitRecord(newtransferorder, true); // newtransferorder.getFieldValue( 'tranid' );
                    var response = nlapiResolveURL('RECORD', 'transferorder', idd);

                    var locName = nlapiLookupField('location', currentToLocation, 'name');
                    alert("Transfer order submitted for " + locName + ".  Consisting of " + Itemsperlocation + " item(s). The transfer order has been automatically opened on another tab.  Please review and fulfill. \n \n Dont forget to save your Sales Order. ");

                    /////////////update line location and link TO

                    for (d = 0; d < LinesOnTo.length && LinesOnTo; d++) {
                        var LineToUpdate = LinesOnTo[d];
                        //  alert(LineToUpdate);
                        nlapiSelectLineItem('item', LineToUpdate);
                        nlapiSetCurrentLineItemValue('item', 'custcol74', idd, false);
                        nlapiSetCurrentLineItemValue('item', 'location', Hloc, false);
                        if (nlapiGetCurrentLineItemValue('item', 'custcol90') == 5) { nlapiSetCurrentLineItemValue('item', 'custcol90', '', false); }
                        nlapiCommitLineItem('item');
                        //  nlapiCancelLineItem("item"); 

                    }
                    ////////////////////
                    window.open(response);
                    //nlapiGetRecordId()
                }
                ////end add line items to TO


            }
            //return true;
        }

    }

    function tranHistory() {
        var uid = nlapiGetCurrentLineItemValue('item', 'item');
        var lineloc = nlapiGetCurrentLineItemValue('item', 'location');

        var sloc = "ALL";
        if (lineloc) { sloc = lineloc; }
        if (!uid && !lineloc) {
            alert("Please select a line to check inventory.");
            return true;
        }

        if (type == 'item' && uid == "") return true;
        {

            var w = screen.width - 50;
            var h = screen.height - 50;

            // window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_LOCATION="+  sloc   + "&Transaction_STATUS=%40ALL%40&CN_Entity_ENTITYID=&Transaction_TRANDATErange=LRY&Transaction_TRANDATEfrom=11%2F1%2F2016&Transaction_TRANDATEfromrel_formattedValue=&Transaction_TRANDATEfromrel=&Transaction_TRANDATEfromreltype=DAGO&Transaction_TRANDATEto=10%2F31%2F2017&Transaction_TRANDATEtorel_formattedValue=&Transaction_TRANDATEtorel=&Transaction_TRANDATEtoreltype=DAGO&Transaction_TYPE=Build%05PurchOrd%05Estimate%05CashRfnd%05RtnAuth%05CashSale%05SalesOrd%05WorkOrd%05InvAdjst%05InvCount%05InvTrnfr%05InvWksht%05CustInvc%05ItemShip%05ItemRcpt&IT_Item_INTERNALID="+ uid  + "&style=NORMAL&CN_Entity_ENTITYIDtype=CONTAINS&Transaction_TRANDATEmodi=WITHIN&Transaction_TRANDATE=LRY&report=&grid=&searchid=4847&dle=T&sortcol=Transaction_TRANDATE_raw&sortdir=DESC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F", "newwin", "dependent = yes, height=" + h + ", width=" + w +", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");


            window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_LOCATION=" + sloc + "&IT_Item_INTERNALID=" + uid + "&searchid=4847&whence=", "newwin", "dependent = yes, height=" + h + ", width=" + w + ", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");

            //window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_LOCATION=" + sloc   + "&Transaction_STATUS=47CN_Entity_ENTITYID=&Transaction_TRANDATEasof=RELATIVE&Transaction_TRANDATEfrom=&Transaction_TRANDATEfromrel_formattedValue=&Transaction_TRANDATEfromrel=&Transaction_TRANDATEfromreltype=DAGO&Transaction_TRANDATEto=DAGO365&Transaction_TRANDATEtorel_formattedValue=365&Transaction_TRANDATEtorel=365&Transaction_TRANDATEtoreltype=DAGO&Transaction_TYPE=%40ALL%40&IT_Item_INTERNALID="+uid +"&style=GRID&CN_Entity_ENTITYIDtype=CONTAINS&Transaction_TRANDATEmodi=ONORAFTER&Transaction_TRANDATE=RELATIVE&report=&grid=T&searchid=4847&sortcol=Transaction_TRANDATE_raw&sortdir=DESC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F", "newwin", "dependent = yes, height=" + h + ", width=" + w +", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");





            return true;
        }
        return true;
    }

    function itemLookup() {
        var w = screen.width - 50;
        var h = screen.height - 50;
        window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=7220&whence=", "newwin", "dependent = yes, height=" + h + ", width=" + w + ", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");
        return true;
    }

    function getinv(type) {
        /*
        var uid =nlapiGetCurrentLineItemValue('item', 'item');
        
          if  ( uid =="")
        {
        alert("Please select a line to check inventory.");
        return true;
        }
        
        if  (type == 'item'  && uid =="")return true;
        {
        
        window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INTERNALID="+uid+"&sortcol=Item_LOCATION_raw&sortdir=ASC&csv=HTML&OfficeXML=F&style=GRID&report=&grid=T&searchid=285", "newwin", "dependent = yes, height=900, width=1100, top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");
        
        
        return true;
        }
        return true;
        }
        */

        var uid = nlapiGetCurrentLineItemValue('item', 'item');

        if (uid == "") {
            alert("Please select a line to check inventory.");
            return true;
        }

        if (type == 'item' && uid == "") return true;
        {

            var invoiceSearch = nlapiSearchRecord("invoice", null,
                [
                    ["type", "anyof", "CustInvc"],
                    "AND",
                    ["mainline", "is", "F"],
                    "AND",
                    ["item.internalidnumber", "equalto", uid],
                    "AND",
                    ["trandate", "within", "daysago90", "daysago0"]
                ],
                [
                    new nlobjSearchColumn("tranid", null, null)
                ]
            );
            var w = screen.width - 50;

            if (!invoiceSearch) {
                window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INTERNALID=" + uid + "&style=NORMAL&report=&grid=&searchid=3995&sortcol=Item_INVENTOCATION17_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F", "newwin", "dependent = yes, height=800, width=" + w + ", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");


                //  window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INTERNALID="+uid+"&sortcol=Item_LOCATION_raw&sortdir=ASC&csv=HTML&OfficeXML=F&style=GRID&report=&grid=T&searchid=285", "newwin", "dependent = yes, height=900, width=1100, top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no"); //old
            }
            else {
                window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INTERNALID=" + uid + "&style=NORMAL&report=&grid=&searchid=3993&sortcol=Item_INVENTOCATION17_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F", "newwin", "dependent = yes, height=800, width=" + w + ", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");

                //    window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INTERNALID="+uid+"&sortcol=Item_LOCATION_raw&sortdir=ASC&csv=HTML&OfficeXML=F&style=GRID&report=&grid=T&searchid=285", "newwin", "dependent = yes, height=900, width=1100, top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no"); //old
            }




            return true;

        }
    }

    function gethist(type) {

        var uid = nlapiGetCurrentLineItemValue('item', 'item');
        var cust = nlapiGetFieldValue('entity');


        if (uid == "" || cust == "") {
            alert("Please select a line and make sure you have added a customer to view this customers purchasing history.");
            return true;
        }


        if (type == 'item' && (uid == "" || cust == "")) return true;
        {


            var custhistcolumns = new Array();
            custhistcolumns[0] = new nlobjSearchColumn("trandate", null, "GROUP").setSort(true);
            custhistcolumns[1] = new nlobjSearchColumn("item", null, "GROUP");
            custhistcolumns[2] = new nlobjSearchColumn("tranid", null, "GROUP");
            custhistcolumns[3] = new nlobjSearchColumn("rate", null, "GROUP");
            custhistcolumns[4] = new nlobjSearchColumn("baseprice", "item", "GROUP");
            custhistcolumns[5] = new nlobjSearchColumn("pricelevel", null, "GROUP");
            custhistcolumns[6] = new nlobjSearchColumn("internalid", null, "GROUP");
            custhistcolumns[7] = new nlobjSearchColumn("type", null, "GROUP");
            custhistcolumns[8] = new nlobjSearchColumn("entity", null, "GROUP");

            var custhisttransactionSearch = nlapiSearchRecord("transaction", null,
                [
                    ["type", "anyof", "CustInvc", "Estimate", "SalesOrd", "CashSale"],
                    "AND",
                    ["status", "anyof", "Estimate:C", "SalesOrd:A", "SalesOrd:B", "Estimate:X", "SalesOrd:D", "SalesOrd:E", "SalesOrd:F", "CashSale:A", "CashSale:B", "CashSale:C", "CustInvc:A", "CustInvc:B", "Estimate:A"],
                    "AND",
                    ["mainline", "is", "F"],
                    "AND",
                    ["quantity", "greaterthan", "0"],
                    "AND",
                    ["amount", "greaterthan", "0.00"],
                    "AND",
                    ["taxline", "is", "F"],
                    "AND",
                    ["shipping", "is", "F"],
                    "AND",
                    ["trandate", "onorafter", "daysago1000"],
                    "AND",
                    ["name", "anyof", cust],
                    "AND",
                    ["item.internalidnumber", "equalto", uid]

                ],
                custhistcolumns
            );
            if (custhisttransactionSearch != null) {
                var ItemName = custhisttransactionSearch[0].getText(custhistcolumns[1]);
                var custname = custhisttransactionSearch[0].getText(custhistcolumns[8]);
            }
            var customerhistoryN = "<table><tr><th style=\"padding-right: 12px;\"> Date </th><th style=\"padding-right: 20px;\">Type</th><th style=\"padding-right: 12px;\">Document #</th><th style=\"padding-right: 12px;\">Item Rate</th><th style=\"padding-right: 12px;\"> Base Price</th><th style=\"padding-right: 20px;\">Price Level</th></tr>";

            if (!custhisttransactionSearch) { customerhistoryN += "<TR><TD> NO RESULTS FOUND <TD></TR>" }
            else if (custhisttransactionSearch.length > 20) { var searchlength = 20; } else { var searchlength = custhisttransactionSearch.length; }

            for (var k = 0; custhisttransactionSearch != null && k < searchlength; k++) {
                if (k % 2 == 0) {
                    customerhistoryN += "<tr>";
                }
                else {
                    customerhistoryN += "<tr style=\" background-color: #f2f4f7 \">"; //#f2f3f4
                }
                var tranDate = custhisttransactionSearch[k].getValue(custhistcolumns[0]);
                var doctypes = custhisttransactionSearch[k].getText(custhistcolumns[7]);
                var docnumber = custhisttransactionSearch[k].getValue(custhistcolumns[2]);
                var itemrate = custhisttransactionSearch[k].getValue(custhistcolumns[3]);
                var Baseprice = custhisttransactionSearch[k].getValue(custhistcolumns[4]);
                var pricelevel = custhisttransactionSearch[k].getText(custhistcolumns[5]);
                var docinternalid = custhisttransactionSearch[k].getText(custhistcolumns[6]);

                var urltype = "";
                if (doctypes == "Sales Order") { urltype = "salesord"; }
                else if (doctypes == "Invoice") { urltype = "custinvc"; }
                else if (doctypes == "Quote") { urltype = "estimate"; }
                else { urltype = "cashsale"; }

                var response = "https://system.na3.netsuite.com/app/accounting/transactions/" + urltype + ".nl?id=" + docinternalid;

                var hreflink = "<a href=\"" + response + "\">" + docnumber + "</a>";
                customerhistoryN += "<td style=\"padding:0px 10px;\">" + tranDate + "</td><td style=\"padding:0px 10px;\">" + doctypes + "</td><td style=\"padding:0px 10px;\">" + hreflink + "</td><td style=\"padding:0px 10px;\">$" + itemrate + "</td><td style=\"padding:0px 10px;\">$" + Baseprice + "</td><td style=\"padding:0px 10px;\">" + pricelevel + "</td></tr>";
                //<td style=\"padding:0px 10px;\">"+ newdoct + "</td>
            }
            customerhistoryN += "</table></br></br>";




            //////////////////////////////////////////////////////////////////////


            var customerhistory = '<div> <b>Customer Purchasing History</B></div> <div style="overflow:hidden; "><iframe style="border: 0px none;  height:100%; margin-top: -250px; width:100%;  " src="https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_NAME=' + cust + '&IT_Item_INTERNALID=' + uid + '&sortcol=Transaction_TRANDATE_raw&sortdir=DESC&csv=HTML&OfficeXML=F&style=GRID&report=&grid=T&searchid=390"></iframe></div>';

            var allpricingcolums = new Array();
            allpricingcolums[0] = new nlobjSearchColumn("custcol38", null, "GROUP");
            allpricingcolums[1] = new nlobjSearchColumn("rate", null, "GROUP");
            allpricingcolums[2] = new nlobjSearchColumn("item", null, "GROUP");
            allpricingcolums[3] = new nlobjSearchColumn("pricelevel", null, "GROUP");
            allpricingcolums[4] = new nlobjSearchColumn("tranid", null, "COUNT").setSort(true);

            var AllpricingSearch = nlapiSearchRecord("transaction", null,
                [
                    ["type", "anyof", "Estimate", "SalesOrd", "CashSale"],
                    "AND",
                    ["mainline", "is", "F"],
                    "AND",
                    ["quantity", "greaterthan", "0"],
                    "AND",
                    ["amount", "greaterthan", "0.00"],
                    "AND",
                    ["taxline", "is", "F"],
                    "AND",
                    ["shipping", "is", "F"],
                    "AND",
                    ["trandate", "within", "lastrollingquarter"],
                    "AND",
                    ["name", "anyof", cust]


                ],
                allpricingcolums
            );

            var content = "<table><tr><th> &nbsp; &nbsp;5 Code &nbsp; &nbsp;</th><th>Item</th><th>Price Level</th><th>Unit Price</th></tr>";

            for (var i = 0; AllpricingSearch != null && i < AllpricingSearch.length; i++) {
                if (i % 2 == 0) {
                    content += "<tr>";
                }
                else {
                    content += "<tr style=\" background-color: #f2f4f7 \">"; //#f2f3f4
                }
                var fivecode = AllpricingSearch[i].getValue(allpricingcolums[0]);
                var price = AllpricingSearch[i].getValue(allpricingcolums[1]);
                var itemname = AllpricingSearch[i].getText(allpricingcolums[2]);
                var pricelevels = AllpricingSearch[i].getText(allpricingcolums[3]);

                content += "<td style=\"padding-right: 12px;\">" + fivecode + "</td><td style=\"padding-right: 12px;\">" + itemname + "</td><td style=\"padding-right: 12px;\">" + pricelevels + "</td><td style=\"padding-right: 12px;\">$" + price + "</td></tr>";

            }
            content += "</table></br></br>";




            //////////////////////////////////////////////////////////////////////

            var newfilter = new nlobjSearchFilter("internalid", "item", "anyof", uid);
            var salesorderSearch = nlapiSearchRecord('transaction', '2479', newfilter);

            var contentmargin = "<table><tr><th style=\"padding-right: 12px;\">Business Unit</th><th style=\"padding-right: 19px;\">Maximum Margin</th><th style=\"padding-right: 19px;\">Average Margin</th><th style=\"padding-right: 19px;\">  Minimum Margin</th></tr>";

            for (var i = 0; salesorderSearch != null && i < salesorderSearch.length; i++) {
                if (i % 2 == 0) {
                    contentmargin += "<tr>";
                }
                else {
                    contentmargin += "<tr style=\" background-color: #f2f4f7 \">"; //#f2f3f4
                }
                var salesorderSearchs = salesorderSearch[i];
                var sellingmargincolums = salesorderSearchs.getAllColumns();

                var bu = salesorderSearchs.getValue(sellingmargincolums[0]);
                var minM = salesorderSearchs.getValue(sellingmargincolums[3]);
                var avgM = salesorderSearchs.getValue(sellingmargincolums[2]);
                var maxM = salesorderSearchs.getValue(sellingmargincolums[1]);
                var w = screen.width - 100;
                var h = screen.height - 100;

                var custitemhistory = '<div style="overflow:hidden; "><iframe style="border: 0px none;  height:100%; margin-top: -220; width:100%;  " src="https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&CU_Entity_INTERNALID=' + cust + '&searchid=758"></iframe></div>';

                contentmargin += "<td style=\"padding-right: 19px;\">" + bu + "</td><td>" + maxM + "</td><td>" + avgM + "</td><td>" + minM + "</td></tr>";

            }
            contentmargin += "</table></br></br>";


            ///////////////////////////////////////////////////////////////////////////////////////////////

            var docwrite = '<div></div>';

            var win = window.open(docwrite, '_blank', "dependent = yes, height=" + h + ", width=" + w + ", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes");

            if (win == null) { alert("Your Browsers Popup Blocker has blocked this window.  Please allow Popups from Netsuite. "); return true; }
            win.document.write('<div><b>History For: ' + custname + '  ---  Item: ' + ItemName + '</b></br></div><div style=" width:100%;  ">' + customerhistoryN + '</div>  <div><b>AX Margin Summary</b></br></div><div style=" width:100%;  ">' + contentmargin + '</div>   <div><b>Customer Item History</b></br></div><div >' + custitemhistory + '</div>'); //+ content +'</div>');


            return true;
        }

        return true;
    }

    // function itemprice() {

    //     //TODO: need to move this function to before submit. No longer need a button, need to move this logic to TJINC UE Main
    //     alert("Starting price update.  This may take several minutes.  You will be prompted when completed.");

    //     cust = nlapiGetFieldValue('entity');
    //     var ischild = nlapiLookupField('customer', cust, 'parent');


    //     //check to see if there is a parent customer if so update that customer
    //     if (ischild) {
    //         if (nlapiLookupField('customer', ischild, 'custentity333') == "T") { cust = ischild; }
    //     }
    //     ///end customer check
    //     var record = nlapiLoadRecord('customer', cust);
    //     if (nlapiGetCurrentLineItemValue('item', 'item')) {
    //         nlapiCommitLineItem('item');
    //     }
    //     for (x = 1; x <= nlapiGetLineItemCount('item'); x++) {
    //         if (nlapiGetLineItemValue('item', 'custcol_custpriceupdate', x) == "T") {

    //             var uid = nlapiGetLineItemValue('item', 'item', x);
    //             var SOPrice = nlapiGetLineItemValue('item', 'price', x);

    //             //----------------------------------------------------------

    //             for (i = 1; i <= record.getLineItemCount('itempricing'); i++) {

    //                 var thisitemid = record.getLineItemValue('itempricing', 'item', i);
    //                 if (uid == thisitemid && SOPrice) {
    //                     record.setLineItemValue('itempricing', 'level', i, SOPrice);
    //                     //alert("Customer Price Record Updated");
    //                     break;
    //                 }
    //             }

    //             //-----------------------------------------------------------------------

    //             if (uid != thisitemid && SOPrice) {
    //                 record.selectNewLineItem('itempricing');
    //                 record.setCurrentLineItemValue('itempricing', 'item', uid);
    //                 record.setCurrentLineItemValue('itempricing', 'level', SOPrice);
    //                 record.commitLineItem('itempricing');
    //                 //alert("Customer Price Record Updated 1");
    //             }
    //         }
    //     }

    //     nlapiSubmitRecord(record, false, true);
    //     alert("Customer pricing has been updated for selected items");
    // }

    function updateprice() {
        alert("Starting price sync. This may take several minutes. You will be notified when it is completed.");

        //TODO: iterate through all lines to get item ids. loop through item ids. see if customer has defined pricing for each item. if yes, set custom rate. else, set current base rate for item
        var cust = nlapiGetFieldValue('entity');
        var pricingSearch = nlapiSearchRecord("pricing",null,
            [
            ["pricelevel","noneof","@NONE@","1"], 
            "AND", 
            ["customer","anyof",cust]
            ], 
            [
            new nlobjSearchColumn("iteminternalid",null,"GROUP"), 
            new nlobjSearchColumn("pricelevel",null,"GROUP"), 
            new nlobjSearchColumn("unitprice",null,"AVG")
            ]
        );
        var priceLevelIds = [157,150,98,151,99,152,100,153,101,154,102,155,103,156,105,122,106,123,107,120,108,121,114,119,113,124,109,125,115,126,116,127,117,128,118,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,159,110,1,111,5];
        var priceLevelNames = ['0-LAP - Lowest Allowable Price','01% Off Base Price','02% Off Base Price','03% Off Base Price','04% Off Base Price','05% Off Base Price','06% Off Base Price','07% Off Base Price','08% Off Base Price','09% Off Base Price','10% Off Base Price','11% Off Base Price','12% Off Base Price','13% Off Base Price','14% Off Base Price','15% Off Base Price','16% Off Base Price','17% Off Base Price','18% Off Base Price','19% off base price','20% Off Base Price','21% off base price','22% Off Base Price','23% Off Base Price','24% Off Base Price','25% Off Base Price','26% Off Base Price','27% Off Base Price','28% Off Base Price','29% Off Base Price','30% Off Base Price','31% Off Base Price','32% Off Base Price','33% Off Base Price','34% Off Base Price','35% Off Base Price','36% Off Base Price','37% Off Base Price','38% Off Base Price','39% Off Base Price','40% Off Base Price','42% Off Base Price','44% Off Base Price','46% Off Base Price','48% Off Base Price','50% Off Base Price','52% Off Base Price','54% Off Base Price','56% Off Base Price','58% Off Base Price','60% Off Base Price','62% Off Base Price','64% Off Base Price','66% Off Base Price','68% Off Base Price','70% Off Base Price','AMAZON','Archive Base Price','Base Price','MSRP','Online Price'];
        var customerPrices = [];
        var items = [];
        // alert('pricing results: ' + pricingSearch.length);
        for (var i = 0; pricingSearch != null && i < pricingSearch.length; i++) {
            var pricingSearches = pricingSearch[i];
            var cols = pricingSearches.getAllColumns();
            var item = pricingSearches.getValue(cols[0]);
            var price = pricingSearches.getValue(cols[1]);
            var rate = pricingSearches.getValue(cols[2]);
            customerPrices.push({
                item: item,
                price: price,
                rate: rate
            });
            items.push(item);
        }
        // alert(JSON.stringify(items));
        for (x = 1; x <= nlapiGetLineItemCount('item'); x++) {
            var lineItem = nlapiGetLineItemValue('item', 'item', x);
            // alert(lineItem);
            var priceIndex = findWithAttr(customerPrices, 'item', lineItem);
            // alert("priceIndex " + priceIndex);
            if (priceIndex != -1) {
                var priceLevelIndex = priceLevelNames.indexOf(price);
                // alert("priceLevelIndex " + priceLevelIndex);
                if (priceLevelIndex != -1) {
                    // alert("priceLevelIds[priceLevelIndex] " + priceLevelIds[priceLevelIndex]);
                    //set to defined customer price level for given item
                    nlapiSelectLineItem('item', x)
                    nlapiSetCurrentLineItemValue('item', 'price', priceLevelIds[priceLevelIndex], false, false);
                    nlapiCommitLineItem('item');
                } else {
                    // alert("customerPrices[priceIndex].rate " + customerPrices[priceIndex].rate);
                    //set to custom, set rate to customer defined rate
                    nlapiSelectLineItem('item', x)
                    nlapiSetCurrentLineItemValue('item', 'price', '-1', false, false);
                    nlapiSetCurrentLineItemValue('item', 'rate', customerPrices[priceIndex].rate, false, false);
                    nlapiCommitLineItem('item');
                }
            } else {
                //set to base price level
                nlapiSelectLineItem('item', x)
                nlapiSetCurrentLineItemValue('item', 'price', '1', false);
                nlapiCommitLineItem('item');
            }
        }
        alert("Pricing has been synced for all items.");
    }

    function makecopies() {
        var orderid = nlapiGetRecordId();
        //alert(orderid);
        var numc = nlapiGetFieldValue('custbody94');
        var idstring = '';
        if (numc > 1) {
            alert("Please wait while your Sales Order is Copied, process may take several minutes. You will be notified When Complete");
            if (orderid == '' || orderid == null) {
                alert("Please save the Sales Order Before Making Copies");
                return false;
            }


            for (x = 1; x <= numc; x++) {
                var neworder = nlapiCopyRecord('salesorder', orderid)
                neworder.setFieldValue('custbody94', '')
                neworder.setFieldValue('createdfrom', orderid)
                var newid = nlapiSubmitRecord(neworder, true);
                //alert( x + " of " + numc + " Copied");


                var idstring = newid + "&Transaction_INTERNALID=" + idstring;

            }
            var uidstrig = idstring + orderid;  //+ "&Transaction_INTERNALID=" 

            alert("Finished copy process. Please update customer codes in the new window.");

            window.open("https://system.na3.netsuite.com/app/accounting/transactions/transactionlist.nl?searchtype=Transaction&Transaction_TYPE=SalesOrd&Transaction_EMPLOYEE=@ALL@&Transaction_INTERNALID=" + uidstrig + "&Transaction_LISTSTATUS=ALL&sortcol=Transaction_TRANDATE_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&style=GRID&report=&grid=T&searchid=676&quicksort=&dle=T", "newwin", "dependent = yes,    toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");  //height=100%, width=100%, top=100, left=200,
        }


    }

    function beforeLoadAddButton(type, form) {
        form.addButton('custpage_buttoncopylocation', 'Copy Locations', 'setpolocationvlgx()');
        form.setScript('customscript_add_button'); // sets the script on the client side
    }

    function setpolocationvlgx() {



        var locHead = nlapiGetFieldValue('location');
        if (nlapiGetFieldValue('source') != "Web Services") {

            var item_count = nlapiGetLineItemCount('item');
            var isTrueFalse = true; if (nlapiGetFieldValue('source') != 'CSV') { isTrueFalse = false; }
            for (var t = 1; item_count != null && t <= item_count; t++) {

                //var itemloc = nlapiGetLineItemValue('item', 'location', t);

                nlapiSelectLineItem('item', t);
                nlapiSetCurrentLineItemValue('item', 'location', locHead, isTrueFalse, isTrueFalse);
                nlapiCommitLineItem('item');
                //alert(t);
            }

        }
    }

    function findWithAttr(array, attr, value) {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }