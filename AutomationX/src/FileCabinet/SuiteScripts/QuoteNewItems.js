///////////////////////////////////////////////////////////////
function itemsublistscroll() {

    var cust = nlapiGetFieldValue('entity');
    if (cust) {

        if (nlapiLookupField('customer', cust, 'credithold') == "ON") { alert("Customer On Hold"); }

    }
    var screenHeight = screen.height - 250;
    // alert(screenHeight);
    if (screenHeight < 400) { screenHeight = 400; }
    document.getElementById("item_splits").parentElement.style.overflow = "auto";
    document.getElementById("item_splits").parentElement.style.height = screenHeight + "px";
    document.getElementById("item_splits").parentElement.addEventListener("scroll", function () {
        var translate = "translate(0," + this.scrollTop + "px)";

        const allTh = this.querySelectorAll("tr#item_headerrow.uir-machine-headerrow");
        for (var i = 0; i < allTh.length; i++) {
            allTh[i].style.transform = translate;
        }
    });

}

//////////////////////////////////
function additem(type, name) {
    var itemid = nlapiGetCurrentLineItemValue("item", "item");
    var venrate = nlapiGetCurrentLineItemValue("item", "custcol81");

    /////////////update vendor
    if (nlapiGetCurrentLineItemValue("item", "custcol79") && name == "custcol79") {

        var rec = nlapiLoadRecord('inventoryitem', itemid);

        var newitemvendor = nlapiGetCurrentLineItemValue("item", "custcol79");
        var newitemvendorpurchaseprice = nlapiGetCurrentLineItemValue("item", "custcol81");
        var newitemvendorpartnumber = nlapiGetCurrentLineItemValue("item", "custcol80");
        var hasVendor = parseInt(rec.getLineItemCount('itemvendor'));


        //if(hasVendor >= 1)
        {
            for (var i = hasVendor; i >= 1; i--)   // remove vendors from item
            {
                rec.removeLineItem('itemvendor', i);
            }
        }

        if (newitemvendor && newitemvendorpurchaseprice && newitemvendorpartnumber) {
            alert('update vendor');
            rec.selectNewLineItem('itemvendor');
            //  rec.insertLineItem('itemvendor', parseInt(hasVendor) +1);
            rec.setCurrentLineItemValue('itemvendor', 'vendor', newitemvendor, true);
            rec.setCurrentLineItemValue('itemvendor', 'purchaseprice', newitemvendorpurchaseprice, true);
            rec.setCurrentLineItemValue('itemvendor', 'preferredvendor', "F", true);
            rec.setCurrentLineItemValue('itemvendor', 'vendorcode', newitemvendorpartnumber, true);
            rec.commitLineItem('itemvendor');
            nlapiSubmitRecord(rec, true);
        }
    }
    ////////////////end update vendor

    if (name == 'custcol81') {
        var newitemvendorpurchaseprice = nlapiGetCurrentLineItemValue("item", "custcol81");
        var newItemPurchasePriceAdjusted = parseInt(newitemvendorpurchaseprice * 1.02).toFixed(2);
        var newrate = (nlapiGetCurrentLineItemValue("item", "custcol81") / .68).toFixed(2);
        var newname = nlapiGetCurrentLineItemValue("item", "custcol86"); nlapiSetCurrentLineItemValue('item', 'rate', newrate);
        nlapiSubmitField('inventoryitem', itemid, ['custitem98', 'cost', 'costestimate'], [newname, newItemPurchasePriceAdjusted, newitemvendorpurchaseprice]);

        var newbaseprice = (parseInt(newitemvendorpurchaseprice) / .68).toFixed(2);
        var rec = nlapiLoadRecord('inventoryitem', itemid);

        var hasCat = parseInt(rec.getLineItemCount('sitecategory'));

        rec.setLineItemValue('price', 'price_1_', 1, newbaseprice);
        if (venrate > 0 && parseInt(rec.getLineItemCount('itemvendor')) > 0) { rec.setLineItemValue('itemvendor', 'purchaseprice', 1, newitemvendorpurchaseprice); }

        if (!hasCat) {
            // alert(hasCat)
            rec.insertLineItem('sitecategory', 1);
            rec.setCurrentLineItemValue('sitecategory', 'category', 17263707, true);
            rec.setCurrentLineItemValue('sitecategory', 'website', 2, true);
            rec.commitLineItem('sitecategory');
        }

        nlapiSubmitRecord(rec, true);
    }

    if (name == 'item') {
        if (nlapiGetCurrentLineItemText("item", "item").indexOf("IN USE - SOLD") !== -1 || nlapiGetCurrentLineItemText("item", "item").indexOf("-I.U-S") !== -1) { alert("5 Code in use.  Please choose another item. "); return false; }  //AXNI108

        if (nlapiGetCurrentLineItemText("item", "item").indexOf("NEW ITEM") !== -1) {


            ///// add five code
            var prefix = "000";
            var longfivecode = prefix + itemid;
            var fivelong = longfivecode.substr(-5, longfivecode.length - 0);
            var new5code = "-" + fivelong;
            var newname = nlapiGetCurrentLineItemValue("item", "custcol86");
            ///// end add five code


            nlapiSubmitField('inventoryitem', itemid, ['custitem98', 'custitem35', 'displayname'], [newname, new5code, "IN USE"]);  //"IN USE"
            nlapiSetCurrentLineItemValue('item', 'custcol38', new5code);
        }


        return true;
    }

    return true;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function newitemvalidateline() {
    if (nlapiGetCurrentLineItemText("item", "item").indexOf("Sold") !== -1 && nlapiGetCurrentLineItemText("item", "item").indexOf("Solder") == -1) { nlapiCancelLineItem("item"); return false; }  //AXNI108

    if (nlapiGetCurrentLineItemText("item", "item").indexOf("NEW ITEM") !== -1) {
        var itemid = nlapiGetCurrentLineItemValue("item", "item");
        var prefix = "000";
        var longfivecode = prefix + itemid;
        var fivelong = longfivecode.substr(-5, longfivecode.length - 0);
        var new5code = "-" + fivelong;
        nlapiSetCurrentLineItemValue('item', 'custcol38', new5code);
    }
    /////////////////////////////////////////////////////////////////////////////////


    if (nlapiGetCurrentLineItemText("item", "item").indexOf("NEW ITEM") !== -1 && (!nlapiGetCurrentLineItemValue("item", "custcol78") || !nlapiGetCurrentLineItemValue("item", "custcol79") || !nlapiGetCurrentLineItemValue("item", "custcol80") || !nlapiGetCurrentLineItemValue("item", "custcol81"))) {
        alert("You are atempting to add a new item.  Please make sure the following fields are complete.  \n \n MANUFACTURE NAME/PART # \n VENDOR   \n VENDOR PART #  \n VENDOR PURCHASE PRICE");
        return false;
    }

    if (nlapiGetCurrentLineItemText("item", "item").indexOf("NEW ITEM") !== -1) {

        var rec = nlapiLoadRecord('inventoryitem', itemid);

        var newitemvendor = nlapiGetCurrentLineItemValue("item", "custcol79");
        var newitemvendorpurchaseprice = nlapiGetCurrentLineItemValue("item", "custcol81");
        var newitemvendorpartnumber = nlapiGetCurrentLineItemValue("item", "custcol80");
        var hasVendor = parseInt(rec.getLineItemCount('itemvendor'));

        ////set field values
        // rec.setFieldValue('custitem35', new5code);
        //  rec.setFieldValue('displayname', "IN USE" );
        if (hasVendor >= 1) {
            for (var i = hasVendor; i >= 1; i--)   // remove vendors from item
            {
                rec.removeLineItem('itemvendor', i);
            }
        }

        rec.insertLineItem('itemvendor', 1);
        rec.setCurrentLineItemValue('itemvendor', 'vendor', newitemvendor, true);
        rec.setCurrentLineItemValue('itemvendor', 'purchaseprice', newitemvendorpurchaseprice, true);
        rec.setCurrentLineItemValue('itemvendor', 'preferredvendor', "T", true);
        rec.setCurrentLineItemValue('itemvendor', 'vendorcode', newitemvendorpartnumber, true);
        rec.commitLineItem('itemvendor');


        nlapiSubmitRecord(rec, true);
        //// end set field values

    }

    return true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function aftersavenewitem() {
    var newiteminfo = "";
    var newtext = "";
    var newitemquoteinfo = "";
    var qtnumber = nlapiGetFieldValue("tranid");
    for (var i = 1; i <= parseInt(nlapiGetLineItemCount('item')); i++) {

        if (nlapiGetLineItemText("item", "item", i).indexOf("AXNI") !== -1) {
            var newtext = "";
            var newmanufactureandpartnumber = nlapiGetLineItemValue("item", "custcol78", i);
            var newitemdescription = nlapiGetLineItemValue("item", "custcol60", i);
            var newitemvendor = nlapiGetLineItemText("item", "custcol79", i);
            var newitemvendorpartnumber = nlapiGetLineItemValue("item", "custcol80", i);
            var newitemvendorpurchaseprice = nlapiGetLineItemValue("item", "custcol81", i);
            var quotelinenumber = nlapiGetLineItemValue("item", "line", i);
            var linenotes = nlapiGetLineItemValue("item", "custcol41", i);
            var newbaseprice = (parseInt(newitemvendorpurchaseprice) / .68).toFixed(2);

            ///////////
            var newitemid = nlapiGetLineItemValue("item", "item", i);
            var salesd = nlapiGetLineItemValue("item", "description", i);
            var shortwebdesc = salesd.substring(0, 50);

            //var rec = nlapiLoadRecord('inventoryitem',newitemid);
            //      var hasCat =parseInt(rec.getLineItemCount('sitecategory'));

            //      rec.setLineItemValue('price', 'price_1_', 1, newbaseprice)

            //if(!hasCat)
            //  {
            // alert(hasCat)
            //           rec.insertLineItem('sitecategory',1);
            //                rec.setCurrentLineItemValue('sitecategory','category',17263707 ,true);
            //                rec.setCurrentLineItemValue('sitecategory','website',2, true  );
            //           rec.commitLineItem('sitecategory');
            //  }

            //nlapiSubmitRecord(rec,true);

            var newitemquoteinfo = qtnumber + " - line: " + quotelinenumber + "\n-------------\nManufacture-Part number: " + newmanufactureandpartnumber + "\nVendor: " + newitemvendor + " - Vendor Part Number: " + newitemvendorpartnumber + "\nItem Description" + newitemdescription + "\nLine Notes: " + linenotes;
            if (!nlapiLookupField('item', newitemid, 'custitem1')) {
                nlapiSubmitField('inventoryitem', newitemid, ['isonline', 'custitem71', 'storedisplayname', 'salesdescription', "custitem1", 'cost'], ['T', "T", shortwebdesc, salesd, newitemquoteinfo, newitemvendorpurchaseprice]);
            }

            ////////////

            var newtext = "\n-------------\n" + newmanufactureandpartnumber + "\n" + newitemvendor + ": " + newitemvendorpartnumber + "\n" + newitemdescription;
        }

        newiteminfo += newtext;
    }

    var cleannewiteminfo = newiteminfo.replace(/(\r\n|\n|\r)/gm, "\n ");

    nlapiSetFieldValue('custbody159', cleannewiteminfo, false);



    return true;
}

