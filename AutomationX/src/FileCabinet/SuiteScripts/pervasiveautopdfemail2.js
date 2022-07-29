function autosendpdf() {

    try {

        var searchresults = nlapiSearchRecord('transaction', 1111, null, null); // results from the Pervasive Auto Send PDF Email Report

    } catch (error) {
        var author = 3354;
        var recipienterror = "accounting@automation-x.com";
        var emailSubject = "Automation-X Invoice Email Error";
        var emailBody = "Error on Pervasive Auto Send PDF Email Report saved search for auto generated emails has occured.  Please Contact your administrator.  Saved Search ID 1111  Script ID  customscript163 " + error;  // Get the body for the email
        nlapiSendEmail(author, recipienterror, emailSubject, emailBody);
    }


    var mm = 0; // loop for saved search


    try {
        LOOPMARKER = nlapiGetContext().getSetting('SCRIPT', 'custscript_loop_marker');
        LOOPMARKER = (LOOPMARKER != null && LOOPMARKER != undefined) ? parseInt(LOOPMARKER) : 0;
        nlapiLogExecution('debug', 'Loopmarker start', 'Loopmarker');

        for (var mm = LOOPMARKER; searchresults != null && mm < searchresults.length; mm++) {

            var searchresult = searchresults[mm];
            var iid = searchresult.getId();
            var invoicingmethod = searchresult.getValue("custentity77", "customerMain", null);
            var recipient = searchresult.getValue("custbody199", null, null); //'mike.harris@automation-x.com';//
            var custid = searchresult.getValue("internalid", "customerMain", null);
            var recordid = searchresult.getValue("internalid", null, null);
            var CF = searchresult.getValue("createdfrom", null, null);
            var documentnumber = searchresult.getValue("tranid", null, null);
            var custName = searchresult.getText("entity", null, null);
            var InvoiceFileOnly = searchresult.getValue("custentity354", 'customer', null);
            nlapiLogExecution('debug', 'InvoiceFileOnly ', InvoiceFileOnly + ' ' + recordid);
            // start email customers

            if (invoicingmethod == 2 && recipient) {

                nlapiLogExecution('debug', 'if loop ', mm);
                nlapiLogExecution('debug', 'remaining usage ', nlapiGetContext().getRemainingUsage()); // gvo 12/28

                if (nlapiGetContext().getRemainingUsage() < 2000) {

                    var params = new Array();

                    params['custscript_loop_marker'] = parseInt(mm) + 1;

                    nlapiLogExecution('debug', 'params ', params); // gvo 12/28

                    var status = nlapiScheduleScript(nlapiGetContext().getScriptId(), nlapiGetContext().getDeploymentId(), params);

                    nlapiLogExecution('debug', 'status ', status); // gvo 12/28

                    if (status == 'QUEUED') {

                        nlapiLogExecution('debug', 'Finished Scheduling Script Due to Usage Limit ', mm);
                    }

                    break;
                }


                /////////////////////////////////////////////////////////////////////////////////////start merge PDF
                ///////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////////////////////////////////
                nlapiLogExecution('debug', '1 ', mm);

                //retrieve the record id passed to the Suitelet
                var recId = recordid;

                //var fileidRelated = "";
                var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n    ";
                xml += "<pdfset>";
                var filestoupdate = new Array();

                /////////////////////////////////////////////////////// save pfd of current invoice

                var invFile = nlapiPrintRecord('transaction', recId, 'DEFAULT', null); //

                nlapiLogExecution('debug', 'FileGenerated', 'invfile line 73');

                // nlapiPrintRecord('TRANSACTION', recordid, 'DEFAULT', null); // gvo 12/28

                //set target folder in file cabinet
                invFile.setFolder(2853332);

                //Set Available without login to true
                invFile.setIsOnline(true);

                //store file in cabinet
                var invfileID = nlapiSubmitFile(invFile);

                // load the file to get its URL
                var invfileURL = nlapiLoadFile(invfileID).getURL();

                var invpdf_fileURL = "https://system.na3.netsuite.com" + nlapiEscapeXML(invfileURL);

                xml += "<pdf src='" + invpdf_fileURL + "'/>";

                filestoupdate.push(invfileID);

                nlapiLogExecution('debug', 'files to update', filestoupdate);

                CF = Number(CF);

                nlapiLogExecution('debug', 'CF', typeof CF);

                /////////////////////////////////////////////////////// end save pfd of current invoice
                /////////////////////////////////////////////////////////////SAVE SO

                var SoFile = nlapiPrintRecord('TRANSACTION', CF, 'PDF', null);

                nlapiLogExecution('debug', 'so file', SoFile);
                //set target folder in file cabinet
                SoFile.setFolder(2853332);
                nlapiLogExecution('debug', 'so file set folder');
                //Set Available without login to true
                SoFile.setIsOnline(true);
                nlapiLogExecution('debug', 'so is online');
                //store file in cabinet
                var SoFileID = nlapiSubmitFile(SoFile);
                nlapiLogExecution('debug', 'so file  id', SoFileID);
                // load the file to get its URL
                var SoFileURL = nlapiLoadFile(SoFileID).getURL();
                nlapiLogExecution('debug', 'sofileurl', SoFileURL);

                var SoFile_fileURL = "https://system.na3.netsuite.com" + nlapiEscapeXML(SoFileURL);
                nlapiLogExecution('debug', 'so file_fileurl', SoFile_fileURL);
                xml += "<pdf src='" + SoFile_fileURL + "'/>";

                nlapiLogExecution('debug', 'xml', xml);

                filestoupdate.push(SoFileID);
                nlapiLogExecution('debug', 'filesto update', filestoupdate);
                /////////////////////////////////////////////////////////////END SO

                nlapiLogExecution('debug', '1.2 ', mm);
                /////////////////////////////////////////////////////// save FF

                var itemfulfillmentSearchs = nlapiSearchRecord("itemfulfillment", null,
                    [
                        ["type", "anyof", "ItemShip"],
                        "AND",
                        ["mainline", "is", "F"],
                        "AND",
                        ["createdfrom.internalidnumber", "equalto", CF],
                        "AND",
                        ["custbodycustbodysavedsignature_ff", "noneof", "44176"]
                    ],
                    [
                        new nlobjSearchColumn("internalid", null, "GROUP")
                    ]
                );

                for (g = 0; itemfulfillmentSearchs != null && g < itemfulfillmentSearchs.length; g++) {
                    var FFrelatedresults = itemfulfillmentSearchs[g];
                    var FFrelatedfileNameCF = FFrelatedresults.getValue("internalid", null, "GROUP");


                    var FFinvFile = nlapiPrintRecord('transaction', FFrelatedfileNameCF, 'PDF', null);
                    //set target folder in file cabinet
                    FFinvFile.setFolder(2853332);
                    //Set Available without login to true
                    FFinvFile.setIsOnline(true);
                    //store file in cabinet
                    var FFinvfileID = nlapiSubmitFile(FFinvFile);
                    // load the file to get its URL
                    var FFinvfileURL = nlapiLoadFile(FFinvfileID).getURL();
                    var FFinvpdf_fileURL = "https://system.na3.netsuite.com" + nlapiEscapeXML(FFinvfileURL);
                    xml += "<pdf src='" + FFinvpdf_fileURL + "'/>";

                    filestoupdate.push(FFinvfileID);

                }
                /////////////////////////////////////////////////////// end save FF

                nlapiLogExecution('debug', '2 ', mm);
                /////////////////////////////////////////////////////// save pfd of walkin order
                if (nlapiLookupField("transaction", CF, 'custbodysavedsignature') || nlapiLookupField("transaction", CF, 'custbodycustbodysavedsignature_ff')) {
                    var WISOFile = nlapiPrintRecord('transaction', CF, 'PDF', null);
                    //set target folder in file cabinet
                    WISOFile.setFolder(2853332);
                    //Set Available without login to true
                    WISOFile.setIsOnline(true);
                    //store file in cabinet
                    var WISOfileID = nlapiSubmitFile(WISOFile);
                    // load the file to get its URL
                    var WISOfileURL = nlapiLoadFile(WISOfileID).getURL();
                    var WISOpdf_fileURL = nlapiEscapeXML(WISOfileURL);
                    xml += "<pdf src='" + WISOpdf_fileURL + "'/>";

                    filestoupdate.push(WISOfileID);
                }
                /////////////////////////////////////////////////////// end save pfd of walkin

                /////////////////////////////////////////////////////// search related docs for files

                var relatedfilters = new Array();
                relatedfilters[0] = new nlobjSearchFilter("mainline", null, "is", "T");
                relatedfilters[1] = new nlobjSearchFilter("type", null, "anyof", ["SalesOrd", "ItemShip"]);
                relatedfilters[2] = new nlobjSearchFilter("type", "createdfrom", "anyof", "SalesOrd");
                relatedfilters[3] = new nlobjSearchFilter("internalid", "createdfrom", "anyof", CF);

                var relatedcolumns = new Array();
                relatedcolumns[0] = new nlobjSearchColumn("custbody75", null, null);
                relatedcolumns[1] = new nlobjSearchColumn("trandate", null, null);
                relatedcolumns[2] = new nlobjSearchColumn("tranid", null, null);
                relatedcolumns[3] = new nlobjSearchColumn("internalid", null, null);
                relatedcolumns[4] = new nlobjSearchColumn("custbody75", "createdFrom", null);
                relatedcolumns[5] = new nlobjSearchColumn("filetype", "file", null);

                var relatedtransactions = nlapiSearchRecord('transaction', null, relatedfilters, relatedcolumns);

                // search for files in files tab
                var filestabcolumns = new Array();
                filestabcolumns[0] = new nlobjSearchColumn("internalid", null, "GROUP");
                filestabcolumns[1] = new nlobjSearchColumn("tranid", null, "GROUP");
                filestabcolumns[2] = new nlobjSearchColumn("trandate", null, "GROUP").setSort(false);
                filestabcolumns[3] = new nlobjSearchColumn("internalid", "file", "GROUP");
                filestabcolumns[4] = new nlobjSearchColumn("name", "file", "GROUP");
                filestabcolumns[5] = new nlobjSearchColumn("filetype", "file", "GROUP");

                var filestab = nlapiSearchRecord("transaction", null,
                    [
                        ["createdfrom.type", "anyof", "SalesOrd"],
                        "AND",
                        ["createdfrom.internalidnumber", "equalto", CF],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["type", "anyof", "SalesOrd", "ItemShip"]
                    ],
                    filestabcolumns
                );

                /////// sales order files
                var filestabcolumnsSO = new Array();
                filestabcolumnsSO[0] = new nlobjSearchColumn("internalid", null, "GROUP");
                filestabcolumnsSO[1] = new nlobjSearchColumn("tranid", null, "GROUP");
                filestabcolumnsSO[2] = new nlobjSearchColumn("trandate", null, "GROUP").setSort(false);
                filestabcolumnsSO[3] = new nlobjSearchColumn("internalid", "file", "GROUP");
                filestabcolumnsSO[4] = new nlobjSearchColumn("name", "file", "GROUP");
                filestabcolumnsSO[5] = new nlobjSearchColumn("filetype", "file", "GROUP");
                //nlapiLogExecution('debug', '3 ', mm);
                var filestabSO = nlapiSearchRecord("transaction", null,
                    [
                        ["mainline", "is", "T"],
                        "AND",
                        ["type", "anyof", "SalesOrd", "ItemShip"],
                        "AND",
                        ["internalidnumber", "equalto", CF]
                    ],
                    filestabcolumnsSO
                );



                //////////// search for files in files tab create array

                var filesa = new Array();
                var filesName = new Array();
                for (i = 0; filestab != null && i < filestab.length; i++) {
                    var relatedresults = filestab[i];
                    var relatedfileNameTab = relatedresults.getValue("name", "file", "GROUP");
                    var relatedfileNameTabid = relatedresults.getValue("internalid", "file", "GROUP");
                    //nlapiLogExecution('debug','fileid', relatedfileNameTabid );
                    if (filesName.indexOf(relatedfileNameTab) == -1 && relatedfileNameTabid) {
                        filesa.push(relatedfileNameTabid);
                        filesName.push(relatedfileNameTab);
                    }
                }

                for (k = 0; filestabSO != null && k < filestabSO.length; k++) {
                    var relatedresultsSO = filestabSO[k];
                    var relatedfileNameTabSO = relatedresultsSO.getValue("name", "file", "GROUP");
                    var relatedfileNameTabSOid = relatedresultsSO.getValue("internalid", "file", "GROUP");

                    if (filesName.indexOf(relatedfileNameTabSO) == -1 && relatedfileNameTabSOid) { filesa.push(relatedfileNameTabSOid); filesName.push(relatedfileNameTabSO); }
                }

                for (l = 0; relatedtransactions != null && l < relatedtransactions.length; l++) {
                    var relatedresults = relatedtransactions[l];
                    var relatedfileNameCF = relatedresults.getText("custbody75", "createdFrom", null);
                    var relatedfileNameCFid = relatedresults.getValue("custbody75", "createdFrom", null);
                    var relatedfileName = relatedresults.getText("custbody75", null, null);
                    var relatedfileNameid = relatedresults.getValue("custbody75", null, null);

                    if (filesName.indexOf(relatedfileNameCF) == -1 && relatedfileNameCFid) {
                        filesa.push(relatedfileNameCFid); filesName.push(relatedfileNameCF);
                    }

                    if (filesName.indexOf(relatedfileName) == -1 && relatedfileNameid) {
                        filesa.push(relatedfileNameid); filesName.push(relatedfileName);
                    }
                }
                nlapiLogExecution('debug', 'SOfilestab', filestabSO.length);
                nlapiLogExecution('debug', 'fffilestab', filestab.length);
                nlapiLogExecution('debug', 'arraysize', filesa);
                /////////////// end create file array
                nlapiLogExecution('debug', '4 ', mm);
                for (y = 0; relatedtransactions != null && y < relatedtransactions.length; y++) {

                    var relatedresults = relatedtransactions[y];
                    var relatedId = relatedresults.getId();
                    /////////////////////////////////////////////////////// get echosign agreements related docs
                    var filters = new Array();
                    filters[0] = new nlobjSearchFilter("custrecord_echosign_parent_record", null, "startswith", relatedId);  //1243953
                    filters[1] = new nlobjSearchFilter("custrecord_echosign_date_signed", null, "isnotempty", "");
                    var columns = new Array();
                    columns[0] = new nlobjSearchColumn("formulatext", null, null).setFormula("{custrecord_echosign_signed_doc}");

                    var customrecord_echosign_signedSearch = null;
                }
                /////////////////////////////////////////////////////// end get echosign agreements related docs

                //// start array loop
                for (j = 0; filesa != null && j < filesa.length; j++) {
                    if (filesa[j]) {
                        var relatedfileName = filesa[j];//.getValue("custbody75",null,null);
                        var relatedfileNameCF = filesa[j];//.getValue("custbody75","createdFrom",null);
                        var relatedtype = nlapiLookupField("file", relatedfileName, "filetype", true);


                        var updatefilerelated = nlapiLoadFile(relatedfileName);
                        updatefilerelated.setIsOnline(true);
                        nlapiSubmitFile(updatefilerelated);
                        ////end set file to view online
                    }

                    /////////////////////////////////////////////////////// get other related docs


                    //-------------------------------------------------------------------Get image from doc


                    //-------------------------------------------------------------------Get image from doc
                    if (relatedtype != "PDF File" && relatedtype != "Plain Text File" && relatedfileName) {
                        xml += "<pdf>";
                        xml += "<body>";
                        var strName = "<table >";
                        strName += "<tr>";
                        strName += "<td>";
                        strName += "<img style=\"margin:auto\" height=\"700\" width=\"525\" src=\""; /////zzzzzzz
                        var path = "https://system.na3.netsuite.com" + nlapiLoadFile(relatedfileName).getURL();
                        strName += nlapiEscapeXML(path);
                        strName += "\"></img>";
                        strName += "</td></tr>";
                        strName += "</table>";
                        xml += strName;
                        xml += "</body>";
                        xml += "</pdf>";
                    }
                    //-------------------------------------------------------------------end Get image from doc

                    //-------------------------------------------------------------------Get PDF from doc
                    if (relatedtype == "PDF File" && relatedfileName) {
                        var pdfpath = "https://system.na3.netsuite.com" + nlapiLoadFile(relatedfileName).getURL();
                        var pdf_fileURL = nlapiEscapeXML(pdfpath);

                        xml += "<pdf src='" + pdf_fileURL + "'/>";
                    }
                    ///-------------------------------------------------------------------end Get PDF from doc


                }
                /////////////////////////////////////////////////////////////////////////////////////////// end get other related docs

                var CFrelateddoc = nlapiLookupField('salesorder', CF, 'custbody75');

                //nlapiLogExecution('debug','pdf_fileURL', pdf_fileURL );
                //nlapiLogExecution('debug','relatedfileName', relatedfileName );

                //////////////////////////////////////////////////////////////////////////////////

                xml += "</pdfset>";
                //nlapiLogExecution('debug','xml', xml );
                // run the BFO library to convert the xml document to a PDF

                var file = nlapiXMLToPDF(xml);
                file.setName(documentnumber + ".pdf");

                //file.setFolder(2853332);
                //var newFileID = nlapiCreateFile(  documentnumber +".pdf" , 'PDF', file); //nlapiSubmitFile(file);
                //nlapiLogExecution('debug','file', file );

                for (h = 0; filestoupdate != null && h < filestoupdate.length; h++) {
                    ////set file to not view online echosign agreements Sales Order
                    var fileid = filestoupdate[h]
                    var SOupdatefile = nlapiLoadFile(fileid)
                    SOupdatefile.setIsOnline(false);
                    nlapiSubmitFile(SOupdatefile);
                    ////end set file to not view online echosign agreements Sales Order
                }
                /////////////////////////////////////////////////////////////////////////////////////end merge PDF
                /////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////////////////////////////////
                nlapiLogExecution('debug', '6 ', mm);
                var fileinvoice = nlapiPrintRecord('TRANSACTION', recordid, 'DEFAULT', null);
                fileinvoice.setName(documentnumber + ".pdf");

                var sdate = new Array();
                sdate.openonly = 'T';

                var fileStatement = nlapiPrintRecord('STATEMENT', custid, 'DEFAULT', sdate);
                fileStatement.setName(custName + "_Statement.pdf");


                // template 113
                var author = 35803;

                var emailMerger = nlapiCreateEmailMerger('113'); // Initiate Email Merger
                emailMerger.setTransaction(recordid); // Set the ID of the transaction where you are going to fetch the values to populate the variables on the template
                var mergeResult = emailMerger.merge(); // Merge the template with the email


                var emailSubject = "Automation-X Invoice " + documentnumber; //mergeResult.getSubject(); // Get the subject for the email
                var emailBody = mergeResult.getBody(); // Get the body for the email

                nlapiLogExecution('debug', 'recordid being proccessed  ', recordid);
                var records = new Object();
                records['transaction'] = recordid;
                nlapiLogExecution('debug', 'recordid being proccessed  1', recordid);

                if (InvoiceFileOnly == 'T') {
                    nlapiSendEmail(author, recipient, emailSubject, emailBody, null, null, records, file, true);
                } else {
                    nlapiSendEmail(author, recipient, emailSubject, emailBody, null, null, records, [file, fileStatement], true);
                } // Send the email with merged template

                nlapiLogExecution('debug', 'recordid being proccessed 2 ', recordid);

                var newcount = parseInt(nlapiLookupField('invoice', iid, 'custbody120')) + 1; if (newcount > 0) { newcount = newcount; } else { newcount = 1; }

                var now = new Date();
                var dd = now.getDate();
                var month = now.getMonth() + 1;
                var y = now.getFullYear();
                var transmistiondate = month + '/' + dd + '/' + y;

                nlapiSubmitField('invoice', iid, ['custbody120', 'custbody119', 'custbody17', 'custbody170'], [newcount, 'F', 3, transmistiondate]);
            }
            //end email customers
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////
            //
            else if (invoicingmethod != 2) {  /// was = 15 changed 7-18-19
                nlapiLogExecution('debug', 'custName merge', custName);
                if (nlapiGetContext().getRemainingUsage() < 2500) {
                    var params = new Array();
                    params['custscript_loop_marker'] = parseInt(mm);

                    var status = nlapiScheduleScript(nlapiGetContext().getScriptId(), nlapiGetContext().getDeploymentId(), params);
                    if (status == 'QUEUED') { nlapiLogExecution('debug', 'Finished Scheduling Script Due to Usage Limit ', mm); }
                    break;
                }


                /////////////////////////////////////////////////////////////////////////////////////start merge PDF
                ///////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////////////////////////////////

                //retrieve the record id passed to the Suitelet
                var recId = recordid;

                //var fileidRelated = "";
                var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n    ";
                xml += "<pdfset>";
                var filestoupdate = new Array();
                /////////////////////////////////////////////////////// save pfd of current invoice

                var invFile = nlapiPrintRecord('transaction', recId, 'PDF', null);
                //set target folder in file cabinet
                invFile.setFolder(2853332);
                //Set Available without login to true
                invFile.setIsOnline(true);
                //store file in cabinet
                var invfileID = nlapiSubmitFile(invFile);
                // load the file to get its URL
                var invfileURL = nlapiLoadFile(invfileID).getURL();
                var invpdf_fileURL = "https://system.na3.netsuite.com" + nlapiEscapeXML(invfileURL);
                xml += "<pdf src='" + invpdf_fileURL + "'/>";

                filestoupdate.push(invfileID);

                /////////////////////////////////////////////////////// end save pfd of current invoice
                //
                /////////////////////////////////////////////////////////////SAVE SO
                var SoFile = nlapiPrintRecord('transaction', CF, 'PDF', null);
                //set target folder in file cabinet
                SoFile.setFolder(2853332);
                //Set Available without login to true
                SoFile.setIsOnline(true);
                //store file in cabinet
                var SoFileID = nlapiSubmitFile(SoFile);
                // load the file to get its URL
                var SoFileURL = nlapiLoadFile(SoFileID).getURL();
                var SoFile_fileURL = "https://system.na3.netsuite.com" + nlapiEscapeXML(SoFileURL);
                xml += "<pdf src='" + SoFile_fileURL + "'/>";

                filestoupdate.push(SoFileID);
                /////////////////////////////////////////////////////////////END SO


                /////////////////////////////////////////////////////// save FF

                var itemfulfillmentSearchs = nlapiSearchRecord("itemfulfillment", null,
                    [
                        ["type", "anyof", "ItemShip"],
                        "AND",
                        ["mainline", "is", "F"],
                        "AND",
                        ["createdfrom.internalidnumber", "equalto", CF],
                        "AND",
                        ["custbodycustbodysavedsignature_ff", "noneof", "44176"]
                    ],
                    [
                        new nlobjSearchColumn("internalid", null, "GROUP")
                    ]
                );
                for (g = 0; itemfulfillmentSearchs != null && g < itemfulfillmentSearchs.length; g++) {
                    var FFrelatedresults = itemfulfillmentSearchs[g];
                    var FFrelatedfileNameCF = FFrelatedresults.getValue("internalid", null, "GROUP");


                    var FFinvFile = nlapiPrintRecord('transaction', FFrelatedfileNameCF, 'PDF', null);
                    //set target folder in file cabinet
                    FFinvFile.setFolder(2853332);
                    //Set Available without login to true
                    FFinvFile.setIsOnline(true);
                    //store file in cabinet
                    var FFinvfileID = nlapiSubmitFile(FFinvFile);
                    // load the file to get its URL
                    var FFinvfileURL = nlapiLoadFile(FFinvfileID).getURL();
                    var FFinvpdf_fileURL = "https://system.na3.netsuite.com" + nlapiEscapeXML(FFinvfileURL);
                    xml += "<pdf src='" + FFinvpdf_fileURL + "'/>";

                    filestoupdate.push(FFinvfileID);

                }
                /////////////////////////////////////////////////////// end save FF


                /////////////////////////////////////////////////////// save pfd of walkin order
                if (nlapiLookupField("transaction", CF, 'custbodysavedsignature') || nlapiLookupField("transaction", CF, 'custbodycustbodysavedsignature_ff')) {
                    var WISOFile = nlapiPrintRecord('transaction', CF, 'PDF', null);
                    //set target folder in file cabinet
                    WISOFile.setFolder(2853332);
                    //Set Available without login to true
                    WISOFile.setIsOnline(true);
                    //store file in cabinet
                    var WISOfileID = nlapiSubmitFile(WISOFile);
                    // load the file to get its URL
                    var WISOfileURL = nlapiLoadFile(WISOfileID).getURL();
                    var WISOpdf_fileURL = nlapiEscapeXML(WISOfileURL);
                    xml += "<pdf src='" + WISOpdf_fileURL + "'/>";

                    filestoupdate.push(WISOfileID);
                }
                /////////////////////////////////////////////////////// end save pfd of walkin

                /////////////////////////////////////////////////////// search related docs for files

                var relatedfilters = new Array();
                relatedfilters[0] = new nlobjSearchFilter("mainline", null, "is", "T");
                relatedfilters[1] = new nlobjSearchFilter("type", null, "anyof", ["SalesOrd", "ItemShip"]);
                relatedfilters[2] = new nlobjSearchFilter("type", "createdfrom", "anyof", "SalesOrd");
                relatedfilters[3] = new nlobjSearchFilter("internalid", "createdfrom", "anyof", CF);

                var relatedcolumns = new Array();
                relatedcolumns[0] = new nlobjSearchColumn("custbody75", null, null);
                relatedcolumns[1] = new nlobjSearchColumn("trandate", null, null);
                relatedcolumns[2] = new nlobjSearchColumn("tranid", null, null);
                relatedcolumns[3] = new nlobjSearchColumn("internalid", null, null);
                relatedcolumns[4] = new nlobjSearchColumn("custbody75", "createdFrom", null);
                relatedcolumns[5] = new nlobjSearchColumn("filetype", "file", null);

                var relatedtransactions = nlapiSearchRecord('transaction', null, relatedfilters, relatedcolumns);

                // search for files in files tab
                var filestabcolumns = new Array();
                filestabcolumns[0] = new nlobjSearchColumn("internalid", null, "GROUP");
                filestabcolumns[1] = new nlobjSearchColumn("tranid", null, "GROUP");
                filestabcolumns[2] = new nlobjSearchColumn("trandate", null, "GROUP").setSort(false);
                filestabcolumns[3] = new nlobjSearchColumn("internalid", "file", "GROUP");
                filestabcolumns[4] = new nlobjSearchColumn("name", "file", "GROUP");
                filestabcolumns[5] = new nlobjSearchColumn("filetype", "file", "GROUP");

                var filestab = nlapiSearchRecord("transaction", null,
                    [
                        ["createdfrom.type", "anyof", "SalesOrd"],
                        "AND",
                        ["createdfrom.internalidnumber", "equalto", CF],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["type", "anyof", "SalesOrd", "ItemShip"]
                    ],
                    filestabcolumns
                );

                /////// sales order files
                var filestabcolumnsSO = new Array();
                filestabcolumnsSO[0] = new nlobjSearchColumn("internalid", null, "GROUP");
                filestabcolumnsSO[1] = new nlobjSearchColumn("tranid", null, "GROUP");
                filestabcolumnsSO[2] = new nlobjSearchColumn("trandate", null, "GROUP").setSort(false);
                filestabcolumnsSO[3] = new nlobjSearchColumn("internalid", "file", "GROUP");
                filestabcolumnsSO[4] = new nlobjSearchColumn("name", "file", "GROUP");
                filestabcolumnsSO[5] = new nlobjSearchColumn("filetype", "file", "GROUP");

                var filestabSO = nlapiSearchRecord("transaction", null,
                    [
                        ["mainline", "is", "T"],
                        "AND",
                        ["type", "anyof", "SalesOrd", "ItemShip"],
                        "AND",
                        ["internalidnumber", "equalto", CF]
                    ],
                    filestabcolumnsSO
                );



                //////////// search for files in files tab create array

                var filesa = new Array();
                var filesName = new Array();
                for (i = 0; filestab != null && i < filestab.length; i++) {
                    var relatedresults = filestab[i];
                    var relatedfileNameTab = relatedresults.getValue("name", "file", "GROUP");
                    var relatedfileNameTabid = relatedresults.getValue("internalid", "file", "GROUP");
                    //nlapiLogExecution('debug','fileid', relatedfileNameTabid );
                    if (filesName.indexOf(relatedfileNameTab) == -1 && relatedfileNameTabid) {
                        filesa.push(relatedfileNameTabid);
                        filesName.push(relatedfileNameTab);
                    }
                }

                for (k = 0; filestabSO != null && k < filestabSO.length; k++) {
                    var relatedresultsSO = filestabSO[k];
                    var relatedfileNameTabSO = relatedresultsSO.getValue("name", "file", "GROUP");
                    var relatedfileNameTabSOid = relatedresultsSO.getValue("internalid", "file", "GROUP");

                    if (filesName.indexOf(relatedfileNameTabSO) == -1 && relatedfileNameTabSOid) { filesa.push(relatedfileNameTabSOid); filesName.push(relatedfileNameTabSO); }
                }

                for (l = 0; relatedtransactions != null && l < relatedtransactions.length; l++) {
                    var relatedresults = relatedtransactions[l];
                    var relatedfileNameCF = relatedresults.getText("custbody75", "createdFrom", null);
                    var relatedfileNameCFid = relatedresults.getValue("custbody75", "createdFrom", null);
                    var relatedfileName = relatedresults.getText("custbody75", null, null);
                    var relatedfileNameid = relatedresults.getValue("custbody75", null, null);

                    if (filesName.indexOf(relatedfileNameCF) == -1 && relatedfileNameCFid) { filesa.push(relatedfileNameCFid); filesName.push(relatedfileNameCF); }

                    if (filesName.indexOf(relatedfileName) == -1 && relatedfileNameid) { filesa.push(relatedfileNameid); filesName.push(relatedfileName); }
                }
                //nlapiLogExecution('debug','SOfilestab', filestabSO.length );
                //nlapiLogExecution('debug','fffilestab', filestab.length );
                // nlapiLogExecution('debug','arraysize', filesa );
                /////////////// end create file array

                for (y = 0; relatedtransactions != null && y < relatedtransactions.length; y++) {

                    var relatedresults = relatedtransactions[y];
                    var relatedId = relatedresults.getId();
                    /////////////////////////////////////////////////////// get echosign agreements related docs
                    var filters = new Array();
                    filters[0] = new nlobjSearchFilter("custrecord_echosign_parent_record", null, "startswith", relatedId);  //1243953
                    filters[1] = new nlobjSearchFilter("custrecord_echosign_date_signed", null, "isnotempty", "");
                    var columns = new Array();
                    columns[0] = new nlobjSearchColumn("formulatext", null, null).setFormula("{custrecord_echosign_signed_doc}");

                    var customrecord_echosign_signedSearch = null;
                }
                /////////////////////////////////////////////////////// end get echosign agreements related docs

                //// start array loop
                for (j = 0; filesa != null && j < filesa.length; j++) {
                    if (filesa[j]) {
                        var relatedfileName = filesa[j];//.getValue("custbody75",null,null);
                        var relatedfileNameCF = filesa[j];//.getValue("custbody75","createdFrom",null);
                        var relatedtype = nlapiLookupField("file", relatedfileName, "filetype", true);


                        var updatefilerelated = nlapiLoadFile(relatedfileName);
                        updatefilerelated.setIsOnline(true);
                        nlapiSubmitFile(updatefilerelated);
                        ////end set file to view online
                    }

                    /////////////////////////////////////////////////////// get other related docs


                    //-------------------------------------------------------------------Get image from doc


                    //-------------------------------------------------------------------Get image from doc
                    if (relatedtype != "PDF File" && relatedtype != "Plain Text File" && relatedfileName) {
                        xml += "<pdf>";
                        xml += "<body>";
                        var strName = "<table >";
                        strName += "<tr>";
                        strName += "<td>";
                        strName += "<img style=\"margin:auto\" height=\"700\" width=\"525\" src=\""; /////zzzzzzz
                        var path = "https://system.na3.netsuite.com" + nlapiLoadFile(relatedfileName).getURL();
                        strName += nlapiEscapeXML(path);
                        strName += "\"></img>";
                        strName += "</td></tr>";
                        strName += "</table>";
                        xml += strName;
                        xml += "</body>";
                        xml += "</pdf>";
                    }
                    //-------------------------------------------------------------------end Get image from doc

                    //-------------------------------------------------------------------Get PDF from doc
                    if (relatedtype == "PDF File" && relatedfileName) {
                        var pdfpath = "https://system.na3.netsuite.com" + nlapiLoadFile(relatedfileName).getURL();
                        var pdf_fileURL = nlapiEscapeXML(pdfpath);

                        xml += "<pdf src='" + pdf_fileURL + "'/>";
                    }
                    ///-------------------------------------------------------------------end Get PDF from doc


                }
                /////////////////////////////////////////////////////////////////////////////////////////// end get other related docs

                var CFrelateddoc = nlapiLookupField('salesorder', CF, 'custbody75');

                //nlapiLogExecution('debug','pdf_fileURL', pdf_fileURL );
                //nlapiLogExecution('debug','relatedfileName', relatedfileName );

                //////////////////////////////////////////////////////////////////////////////////

                xml += "</pdfset>";
                //nlapiLogExecution('debug','xml', xml );
                // run the BFO library to convert the xml document to a PDF

                var file = nlapiXMLToPDF(xml);
                file.setName(documentnumber + ".pdf");

                //file.setFolder(2853332);
                //var newFileID = nlapiCreateFile(  documentnumber +".pdf" , 'PDF', file); //nlapiSubmitFile(file);
                //nlapiLogExecution('debug','file', file );

                for (h = 0; filestoupdate != null && h < filestoupdate.length; h++) {
                    ////set file to not view online echosign agreements Sales Order
                    var fileid = filestoupdate[h]
                    var SOupdatefile = nlapiLoadFile(fileid)
                    SOupdatefile.setIsOnline(false);
                    nlapiSubmitFile(SOupdatefile);
                    ////end set file to not view online echosign agreements Sales Order
                }


                /////////////////////////////////////////////////////////////////////////////////////end merge PDF
                /////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////////////////////////////////
                //
                ///////////////////////////////////////////////////start create csv
                function escapeCSV(val) {
                    if (!val) return '';
                    if (!(/[",\s]/).test(val)) return val;
                    val = val.replace(/"/g, '""').replace('undefined', '').replace(/\r?\n|\r/g, "");
                    return '"' + val + '"';
                }

                nlapiLogExecution('debug', 'recId 1', recordid);
                //var criteria = new Array();
                //criteria[0] = new nlobjSearchFilter("internalid", null, "anyof", recordid);
                //criteria[1] = new nlobjSearchFilter("trandate","onorafter","daysago500");

                //var invCsvFileSearchLoad = nlapiSearchRecord(null, 5631, criteria, null);
                var invCsvFileSearchLoad = nlapiSearchRecord("transaction", null,
                    [
                        ["internalid", "anyof", recordid], "AND",
                        ["type", "anyof", "CustInvc"], "AND",
                        ["quantity", "isnotempty", ""], "AND",
                        ["trandate", "onorafter", "daysago500"], "AND",
                        ["amount", "notequalto", "0.00"], "AND",
                        ["closed", "is", "F"], "AND",
                        ["taxline", "is", "F"], "AND",
                        ["item.name", "doesnotstartwith", "Tax"], "AND",
                        ["customermain.custentity77", "anyof", "17", "15"], "AND",
                        ["custbody156", "is", "F"], "AND",
                        ["custbody17", "noneof", "30"], "AND",
                        ["formulanumeric: case when {type}='Credit Memo' AND {quantity} >= 0 then 1 else 0 end", "equalto", "0"]

                    ],
                    [
                        new nlobjSearchColumn("internalid").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("'13-084-0148'").setSort(false),
                        new nlobjSearchColumn("custentity339", "customer", null),
                        new nlobjSearchColumn("custentity189", "customerMain", null),
                        new nlobjSearchColumn("custentity77", "customerMain", null),
                        new nlobjSearchColumn("entity"),
                        new nlobjSearchColumn("internalid", "customer", null),
                        new nlobjSearchColumn("formulatext").setFormula("CASE WHEN{customermain.custentity337} IS NOT NULL THEN   {customermain.custentity337} ELSE  {name} END").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula(" case when       {item.type} = 'Sales Tax Group' OR {name} =  'Avalara Inc.~'  OR {name} Like  '%Avalara%'   then 'Tax' else (    case when   {item.type} != 'Shipping Cost Item' then  'item'  else  'shipping' end            ) end    ").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("{customer.custentity82}").setSort(false),
                        new nlobjSearchColumn("tranid"),
                        new nlobjSearchColumn("trandate").setSort(false),
                        new nlobjSearchColumn("duedate"),
                        new nlobjSearchColumn("formulatext").setFormula("  REPLACE(REPLACE( {customer.custentity189}  , 'ID ' ,  '') ,'Routing ','')").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("'1.505.564.2059'").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("'P.O. BOX 17180 DEPT 1538'").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("'Denver'").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("'CO'").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("'80217-0180'").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("REPLACE({createdfrom.location} ,',' , ' ')").setSort(false),
                        new nlobjSearchColumn("shipaddress"),
                        new nlobjSearchColumn("formulatext").setFormula("  CONCAT({shipaddress1}  , {shipaddress2}  )").setSort(false),
                        new nlobjSearchColumn("shipcity"),
                        new nlobjSearchColumn("shipstate"),
                        new nlobjSearchColumn("shipzip"),
                        new nlobjSearchColumn("formulatext").setFormula("{otherrefnum}").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("   case when  {custcol105} IS NULL THEN       (case when {custbody10} ='Required' Then NULL Else {custbody10} END)  ELSE     (case when {custbody10} ='Required' Then NULL Else {custbody10} END)   || '  ' ||{custcol105} END").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("case when  {custcol103} IS NULL THEN  ( case when {custbody8} ='Required' Then NULL Else {custbody8}   END)  ELSE   ( case when {custbody8} ='Required' Then NULL Else {custbody8}   END)  || '  ' ||{custcol103} END").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("case when  {custcol104} IS NULL THEN  ( case when {custbody9} ='Required' Then NULL Else {custbody9}   END )  ELSE   ( case when {custbody9} ='Required' Then NULL Else {custbody9}   END)  || '  ' ||{custcol104} END").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("case when  {custcol106} IS NULL THEN  ( case when {custbody38} ='Required' Then NULL Else {custbody38}   END)  ELSE   (case when {custbody38} ='Required' Then NULL Else {custbody38}   END)  || '  ' ||{custcol106} END").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("   case when  {custcol105} IS NULL THEN       (case when {custbody10} ='Required' Then NULL Else {custbody10} END)  ELSE     (case when {custbody10} ='Required' Then NULL Else {custbody10} END)   || '  ' ||{custcol105} END").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("case when  {custcol106} IS NULL THEN  ( case when {custbody69} ='Required' Then NULL Else 	 REPLACE(REPLACE( {custbody69}  , 'ID ' ,  '') ,'Routing ','')    END)  ELSE   (case when {custbody69} ='Required' Then NULL Else 	 REPLACE(REPLACE( {custbody69}  , 'ID ' ,  '') ,'Routing ','')    END)  || '  ' ||{custcol106} END").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("case when  {custcol107} IS NULL THEN  ( case when {custbody73} ='Required' Then NULL Else {custbody73}   END)  ELSE   (  case when {custbody73} ='Required' Then NULL Else {custbody73}   END)  || '  ' ||{custcol107} END").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("case when  {custcol108} IS NULL THEN  (  case when {custbody11} ='Required' Then NULL Else {custbody11}   END )  ELSE   (  case when {custbody11} ='Required' Then NULL Else {custbody11}   END  )  || '  ' ||{custcol108} END").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("case when  {custcol109} IS NULL THEN  ( case when {custbody67} ='Required' Then NULL Else {custbody67}   END  )  ELSE   (  case when {custbody67} ='Required' Then NULL Else {custbody67}   END  )  || '  ' ||{custcol109} END").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("case when  {custcol110} IS NULL THEN  (  case when {custbody74} ='Required' Then NULL Else {custbody74}   END  )  ELSE   (  case when {custbody74} ='Required' Then NULL Else {custbody74}   END  )  || '  ' ||{custcol110} END").setSort(false),
                        new nlobjSearchColumn("formulatext").setFormula("case when  {custcol111} IS NULL THEN  ( case when {custbody87} ='Required' Then NULL Else {custbody87} END)  ELSE   ( case when {custbody87} ='Required' Then NULL Else {custbody87} END)  || '  ' ||{custcol111} END").setSort(false),
                        new nlobjSearchColumn("email", "CUSTBODY173", null),
                        new nlobjSearchColumn("formulatext").setFormula("{customer.custentity195}").setSort(false),
                        new nlobjSearchColumn("shipdate"),
                        new nlobjSearchColumn("taxtotal"),
                        new nlobjSearchColumn("taxamount"),
                        new nlobjSearchColumn("formulapercent").setFormula(" case when {taxamount} > 0 then ({taxamount}/ {amount})else  null end "),
                        new nlobjSearchColumn("shipmethod"),
                        new nlobjSearchColumn("trackingnumbers"),
                        new nlobjSearchColumn("shippingamount"),
                        new nlobjSearchColumn("billzip"),
                        new nlobjSearchColumn("formulatext").setFormula("'ar@automation-x.com'").setSort(false),
                        new nlobjSearchColumn("formulanumeric").setFormula("case when {custcol26}>=0 then {custcol26} else {linesequencenumber} end"),
                        new nlobjSearchColumn("formulatext").setFormula("{custcol95}").setSort(false),
                        new nlobjSearchColumn("internalid", "item", null),
                        new nlobjSearchColumn("custcol38"),
                        new nlobjSearchColumn("formulatext").setFormula("{custcol94}").setSort(false),
                        new nlobjSearchColumn("type", "item", null),
                        new nlobjSearchColumn("item"),
                        new nlobjSearchColumn("formulanumeric").setFormula("abs({quantity})"),
                        new nlobjSearchColumn("formulatext").setFormula("'Each'").setSort(false),
                        new nlobjSearchColumn("formulanumeric").setFormula("{rate}"),
                        new nlobjSearchColumn("formulanumeric").setFormula("ABS({amount})"),
                        new nlobjSearchColumn("formulanumeric").setFormula("abs({totalamount})"),
                        new nlobjSearchColumn("billcity"),
                        new nlobjSearchColumn("billstate"),
                        new nlobjSearchColumn("formulatext").setFormula("  CONCAT({billaddress1}  , {billaddress2}  )").setSort(false),
                        new nlobjSearchColumn("createdfrom")
                    ]
                );
                // nlapiLogExecution('debug','invCsvFileSearch ', invCsvFileSearchLoad.length);

                // Creating some array's that will be populated from the saved search results
                var content = new Array();
                var cells = new Array();
                var temp = new Array();
                var headerarray = new Array();
                var x = 0;
                var contents = "";

                // create header
                var basicColumns = invCsvFileSearchLoad[0].getAllColumns();
                for (var c = 0; basicColumns != null && c < basicColumns.length; c++) { headerarray[c] = escapeCSV(basicColumns[c].getLabel() || basicColumns[c].getLabel()); }
                //nlapiLogExecution('debug','Header ',  headerarray );
                content[x] += headerarray;
                x++

                // Looping through the search Results
                for (var i = 0; invCsvFileSearchLoad != null && i < invCsvFileSearchLoad.length; i++) {
                    var resultSet = invCsvFileSearchLoad[i];
                    // Returns an array of column internal Ids
                    var columns = resultSet.getAllColumns();

                    // Looping through each column and assign it to the temp array
                    for (var y = 0; columns != null && y <= columns.length; y++) {
                        if (resultSet.getValue(columns[y]) !== 'undefined') { temp[y] = escapeCSV(resultSet.getText(columns[y]) || resultSet.getValue(columns[y])) };
                    }
                    // Taking the content of the temp array and assigning it to the Content Array.
                    content[x] += temp;
                    // Incrementing the index of the content array
                    x++;
                }
                // Creating a string variable that will be used as the CSV Content
                // Looping through the content array and assigning it to the contents string variable.
                for (var z = 0; content != null && z < content.length; z++) { contents += content[z].replace('undefined', '').replace(/\r?\n|\r/g, "").toString() + '\n'; }

                var invCsvFile = nlapiCreateFile(documentnumber + '-Lines.csv', 'CSV', contents.replace('undefined', ''));
                nlapiLogExecution('debug', 'Done Creating CSV ', 'Done');
                //////////////////////////////////////////////////end create csv

                //create email Pervasvie
                var author = 17890;
                var recipient = 'webdi@actian.com'; // "webdi@pervasive.com";             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


                var emailSubject = "Automation X Invoice " + documentnumber; //mergeResult.getSubject(); // Get the subject for the email
                var emailBody = ""; // Get the body for the email

                // nlapiLogExecution('debug','recordid ', recordid);
                var records = new Object();
                records['transaction'] = recordid;


                var newcount = parseInt(nlapiLookupField('invoice', iid, 'custbody120')) + 1; if (newcount > 0) { newcount = newcount; } else { newcount = 1; }

                var now = new Date();
                var dd = now.getDate();
                var month = now.getMonth() + 1;
                var y = now.getFullYear();
                var transmistiondate = month + '/' + dd + '/' + y;

                nlapiSubmitField('invoice', iid, ['custbody120', 'custbody119', 'custbody17', 'custbody170'], [newcount, 'F', 28, transmistiondate]);

                nlapiLogExecution('debug', 'record before send  email ', iid);

                nlapiSendEmail(author, recipient, emailSubject, emailBody, null, null, records, [file, invCsvFile], true); // Send the email with merged template

                //end pervasive email
            }
        }
    }//endtry
    catch (error) {

        nlapiLogExecution('debug', 'error', error);

        var params = new Array();
        params['custscript_loop_marker'] = parseInt(mm) + 1;
        nlapiLogExecution('debug', 'params in catch', params);

        var status = nlapiScheduleScript(nlapiGetContext().getScriptId(), nlapiGetContext().getDeploymentId(), params);

        /*var author = 3354;
  //var recipient = "accounting@automation-x.com";
  var emailSubject = documentnumber + " Email Error";
  var emailBody = documentnumber + " Had an error during processing please process manually. ";
  nlapiSendEmail(author, recipient, emailSubject, emailBody);
  
         if(status == 'QUEUED')
         {
           nlapiLogExecution('debug', 'Finished Scheduling Script Due to error', mm + ' ' +recordid);
  
  var author = 3354;
  var recipienterror = "accounting@automation-x.com;mike.harris@automation-x.com";
  var emailSubject = "Automation-X Invoice Email Error " + documentnumber;
  var emailBody = "Error on Pervasive Auto Send PDF Email Report saved search for auto generated emails has occured.  Invoice "+documentnumber+ " .  Saved Search ID 1111  Script ID  customscript163 " +  mm + ' Recid: ' +recordid + "  " + error ;  // Get the body for the email
  
         }*/
        nlapiLogExecution('debug', 'Finished Scheduling Script Due to error', mm + ' ' + recordid);
    }
}



