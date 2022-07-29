function xmltoPDF_pdfSet(request, response) {
  try{
    var s_dom = 'https://422523.app.netsuite.com';
    nlapiLogExecution('DEBUG', 'in');
    //retrieve the record id passed to the Suitelet
    var recId = request.getParameter('id');
    var CF = request.getParameter('cf');
    //var fileidRelated = "";
    var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n    ";
    xml += "<pdfset>";
    var filestoupdate = new Array();
    /////////////////////////////////////////////////////// save pfd of current invoice
    nlapiLogExecution('DEBUG', 'in 2');
    nlapiLogExecution('DEBUG', 'Step 2.0',recId);
    var invFile = nlapiPrintRecord('transaction', recId, 'PDF');
    nlapiLogExecution('DEBUG', 'Step 2.1',invFile);
    //set target folder in file cabinet
    invFile.setFolder(2853332);
    //Set Available without login to true
    invFile.setIsOnline(true);
    //store file in cabinet
    var invfileID = nlapiSubmitFile(invFile);
    // load the file to get its URL
    var invfileURL = nlapiLoadFile(invfileID).getURL();
    var invpdf_fileURL = s_dom + nlapiEscapeXML(invfileURL);
    xml += "<pdf src='" + invpdf_fileURL + "'/>";

    filestoupdate.push(invfileID);

    /////////////////////////////////////////////////////// end save pfd of current invoice
    nlapiLogExecution('DEBUG', 'in 3');
    /////////////////////////////////////////////////////////////SAVE SO
    nlapiLogExecution('DEBUG', 'Step 3.0',CF);
    var SoFile = nlapiPrintRecord('transaction', CF, 'PDF');
    //set target folder in file cabinet
    nlapiLogExecution('DEBUG', 'Step 3.1',SoFile);
    SoFile.setFolder(2853332);
    //Set Available without login to true
    nlapiLogExecution('DEBUG', 'Step 3.2',SoFile);
    SoFile.setIsOnline(true);
    //store file in cabinet
    nlapiLogExecution('DEBUG', 'Step 3.3',SoFile);
    var SoFileID = nlapiSubmitFile(SoFile);
    // load the file to get its URL
    nlapiLogExecution('DEBUG', 'Step 3.4', SoFileID);
    var SoFileURL = nlapiLoadFile(SoFileID).getURL();
    nlapiLogExecution('DEBUG', 'Step 3.5', SoFileURL);
    var SoFile_fileURL = s_dom + nlapiEscapeXML(SoFileURL);
    nlapiLogExecution('DEBUG', 'Step 3.6',SoFile_fileURL);
    xml += "<pdf src='" + SoFile_fileURL + "'/>";
    nlapiLogExecution('DEBUG', 'Step 3.7',xml);
    filestoupdate.push(SoFileID);
    /////////////////////////////////////////////////////////////END SO
    nlapiLogExecution('DEBUG', 'in 4');

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


      var FFinvFile = nlapiPrintRecord('transaction', FFrelatedfileNameCF, 'PDF');
      //set target folder in file cabinet
      FFinvFile.setFolder(2853332);
      //Set Available without login to true
      FFinvFile.setIsOnline(true);
      //store file in cabinet
      var FFinvfileID = nlapiSubmitFile(FFinvFile);
      // load the file to get its URL
      var FFinvfileURL = nlapiLoadFile(FFinvfileID).getURL();
      var FFinvpdf_fileURL = s_dom + nlapiEscapeXML(FFinvfileURL);
      xml += "<pdf src='" + FFinvpdf_fileURL + "'/>";

      filestoupdate.push(FFinvfileID);

    }
    /////////////////////////////////////////////////////// end save FF
    nlapiLogExecution('DEBUG', 'in 5');

    /////////////////////////////////////////////////////// save pfd of walkin order
    if (nlapiLookupField("transaction", CF, 'custbodysavedsignature') || nlapiLookupField("transaction", CF, 'custbodycustbodysavedsignature_ff')) {
      var WISOFile = nlapiPrintRecord('transaction', CF, 'PDF');
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
    nlapiLogExecution('DEBUG', 'in 6');
    /*////////////////////////////////////////////////////// get echosign agreements Sales order
  var filters = new Array();
    filters[0] = new nlobjSearchFilter("custrecord_echosign_parent_record",null,"startswith",CF);  //1243953
    filters[1] = new nlobjSearchFilter("custrecord_echosign_date_signed",null, "isnotempty","");
    var columns = new Array();
      columns[0] = new nlobjSearchColumn("formulatext",null,null).setFormula("{custrecord_echosign_signed_doc}");
      
    var customrecord_echosign_signedSearch = nlapiSearchRecord( 'customrecord_echosign_agreement', null, filters, columns );
    for(x =0; customrecord_echosign_signedSearch != null && x < customrecord_echosign_signedSearch.length; x++)
        {
            var echopage = customrecord_echosign_signedSearch[x];
            var filename = echopage.getValue(columns[x]);
    if( filename )
    { 
    var filefilters = new Array();
    filefilters[0] = new nlobjSearchFilter("name","file","contains", filename);
    filefilters[1] =  new nlobjSearchFilter("name",null,"startswith","echo");
      var filecolumns = new Array();
      filecolumns[0] = new nlobjSearchColumn("internalid","file",null);
      var folderSearch = nlapiSearchRecord( 'folder', null, filefilters, filecolumns );
            
                if( nlapiSearchRecord != null )
      {
            var folderSearchR = folderSearch[0];

            ////set file to view online 
            var SOfileid = folderSearchR.getValue("internalid","file",null);
        filestoupdate.push(SOfileid);
            var SOupdatefile = nlapiLoadFile(SOfileid);
            SOupdatefile.setIsOnline(true);
            nlapiSubmitFile(SOupdatefile);
            ////end set file to view online
      }    
    var echofileID = SOfileid;//3726114;
  var echofileURL = nlapiLoadFile(echofileID).getURL();
    var echopdf_fileURL = nlapiEscapeXML(echofileURL);
  xml += "<pdf src='"+ echopdf_fileURL +"'/>";

    }}
  */////////////////////////////////////////////////////// end get echosign agreements Sales Order  



    //////////////////////////////////////////////////////// search related docs for files

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


    nlapiLogExecution('DEBUG', 'in 7');
    //////////// search for files in files tab create array

    var filesa = new Array();
    var filesName = new Array();
    for (i = 0; filestab != null && i < filestab.length; i++) {
      var relatedresults = filestab[i];
      var relatedfileNameTab = relatedresults.getValue("name", "file", "GROUP");
      var relatedfileNameTabid = relatedresults.getValue("internalid", "file", "GROUP");
      nlapiLogExecution('debug', 'fileid', relatedfileNameTabid);
      if (filesName.indexOf(relatedfileNameTab) == -1 && relatedfileNameTabid) {
        filesa.push(relatedfileNameTabid);
        filesName.push(relatedfileNameTab);
      }
    }
    nlapiLogExecution('DEBUG', 'in 8');
    for (k = 0; filestabSO != null && k < filestabSO.length; k++) {
      var relatedresultsSO = filestabSO[k];
      var relatedfileNameTabSO = relatedresultsSO.getValue("name", "file", "GROUP");
      var relatedfileNameTabSOid = relatedresultsSO.getValue("internalid", "file", "GROUP");

      if (filesName.indexOf(relatedfileNameTabSO) == -1 && relatedfileNameTabSOid) { filesa.push(relatedfileNameTabSOid); filesName.push(relatedfileNameTabSO); }
    }
    nlapiLogExecution('DEBUG', 'in 9');
    for (l = 0; relatedtransactions != null && l < relatedtransactions.length; l++) {
      var relatedresults = relatedtransactions[l];
      var relatedfileNameCF = relatedresults.getText("custbody75", "createdFrom", null);
      var relatedfileNameCFid = relatedresults.getValue("custbody75", "createdFrom", null);
      var relatedfileName = relatedresults.getText("custbody75", null, null);
      var relatedfileNameid = relatedresults.getValue("custbody75", null, null);

      if (filesName.indexOf(relatedfileNameCF) == -1 && relatedfileNameCFid) { filesa.push(relatedfileNameCFid); filesName.push(relatedfileNameCF); }

      if (filesName.indexOf(relatedfileName) == -1 && relatedfileNameid) { filesa.push(relatedfileNameid); filesName.push(relatedfileName); }
    }
    nlapiLogExecution('debug', 'SOfilestab', filestabSO.length);
    nlapiLogExecution('debug', 'fffilestab', filestab.length);
    nlapiLogExecution('debug', 'arraysize', filesa);
    /////////////// end create file array 
    //  var filesa =  [4982842];

    for (y = 0; relatedtransactions != null && y < relatedtransactions.length; y++) {

      var relatedresults = relatedtransactions[y];
      var relatedId = relatedresults.getId();
      // var relatedfileNameecho =relatedresults.getValue("custbody75",null,null);
      // var relatedfileNameCFecho =relatedresults.getValue("custbody75","createdFrom",null);

      /////////////////////////////////////////////////////// get echosign agreements related docs
      var filters = new Array();
      filters[0] = new nlobjSearchFilter("custrecord_echosign_parent_record", null, "startswith", relatedId);  //1243953
      filters[1] = new nlobjSearchFilter("custrecord_echosign_date_signed", null, "isnotempty", "");
      var columns = new Array();
      columns[0] = new nlobjSearchColumn("formulatext", null, null).setFormula("{custrecord_echosign_signed_doc}");

      var customrecord_echosign_signedSearch = null; /* nlapiSearchRecord( 'customrecord_echosign_agreement', null, filters, columns );
    for(x=0; customrecord_echosign_signedSearch != null && x < customrecord_echosign_signedSearch.length; x++)
      {
            var echopage = customrecord_echosign_signedSearch[x];
            var filename = echopage.getValue(columns[x]);
    if( filename)
    { 
    var filefilters = new Array();
    filefilters[0] = new nlobjSearchFilter("name","file","contains", filename);
    filefilters[1] =  new nlobjSearchFilter("name",null,"startswith","echo");
      var filecolumns = new Array();
      filecolumns[0] = new nlobjSearchColumn("internalid","file",null);
      var folderSearch = nlapiSearchRecord( 'folder', null, filefilters, filecolumns );
      if( folderSearch != null )
      {
      var folderSearchR = folderSearch[0];
            
            ////set file to view online
            var fileid = folderSearchR.getValue("internalid","file",null);
          filestoupdate.push(fileid);
            var updatefile = nlapiLoadFile(fileid);
            updatefile.setIsOnline(true);
            nlapiSubmitFile(updatefile);
            ////end set file to view online
      }     
    var echofileID = fileid;
  var echofileURL = nlapiLoadFile(echofileID).getURL();
    var echopdf_fileURL = nlapiEscapeXML(echofileURL);
    xml += "<pdf src='"+ echopdf_fileURL +"'/>";

    }}*/}
    /////////////////////////////////////////////////////// end get echosign agreements related docs

    //// start array loop 
    for (j = 0; filesa != null && j < filesa.length; j++) {
      if (filesa[j]) {
        var relatedfileName = filesa[j];//.getValue("custbody75",null,null);
        var relatedfileNameCF = filesa[j];//.getValue("custbody75","createdFrom",null);
        var relatedtype = nlapiLookupField("file", relatedfileName, "filetype", true);

        //// set file to view online
        //filestoupdate.push(relatedfileName);
        var updatefilerelated = nlapiLoadFile(relatedfileName);
        updatefilerelated.setIsOnline(true);
        nlapiSubmitFile(updatefilerelated);
        ////end set file to view online
      }




      /////////////////////////////////////////////////////// get other related docs


      //----------------------dddddddddddddddddddd---------------------------------------------Get image from doc
      if (relatedtype == "Plain Text File" && relatedfileName) {

      }
      /*
      {
      xml += "<pdf>";
    xml += "<body>";
  var strName = "<table >";
    strName += "<tr>";
        strName += "<td>";
  
    var path = s_dom +nlapiLoadFile(relatedfileName).getURL();
  //  strName +=   "<object  width=\"1000\" height=\"1000\" scrolling=\"no\" src=\"";
    // strName += nlapiEscapeXML(path);
    // strName +=    "\"></object >";
        
  var path = s_dom +nlapiLoadFile(relatedfileName).getURL();
    var path_fileURL = nlapiEscapeXML(pdfpath); 
    xml += "<pdf src='"+ path_fileURL +"'/>";
  /*     
    strName += "<object  width=\"210\" height=\"540\"  data=\""; 
        
      var path = s_dom + nlapiLoadFile(relatedfileName).getURL();
        nlapiLogExecution('debug','path', path );
        // var file = nlapiLoadFile(relatedfileName);
      //var contents = file.getValue();
        <object  width=\"1000" height=\"1000\" scrolling=\"no\" src=\""   \"></iframe>"
          strName += "   \"></object>";
        //////////////
        strName += "<iframe   src=\"";   
        var file = nlapiLoadFile(relatedfileName)
  
                var path = s_dom +nlapiLoadFile(relatedfileName).getURL(); //s_dom +nlapiLoadFile(relatedfileName).getURL();  //file.getValue();// nlapiLoadFile(relatedfileName).getValue();  //      // nlapiLogExecution('debug','path', path );     //file.setEncoding('UTF-8');
              strName += nlapiEscapeXML(path);
  
                strName += "\">" ; 
      // response.write(file);
                  strName +="</iframe>";  ///changed 5-11
      ////////////////////
        
        
        strName += "</td></tr>";
  strName += "</table>";
    xml += strName;
      xml += "</body>";
    xml += "</pdf>";
      }*/
      ///--------------------------------------ddddddddddddddddddddddddddddddddd-----------------------------end Get image from doc


      //-------------------------------------------------------------------Get image from doc
      if (relatedtype != "PDF File" && relatedtype != "Plain Text File" && relatedfileName) {
        xml += "<pdf>";
        xml += "<body>";
        var strName = "<table >";
        strName += "<tr>";
        strName += "<td>";
        strName += "<img style=\"margin:auto\" height=\"700\" width=\"525\" src=\""; /////zzzzzzz
        var path = s_dom + nlapiLoadFile(relatedfileName).getURL();
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
        var pdfpath = s_dom + nlapiLoadFile(relatedfileName).getURL();
        var pdf_fileURL = nlapiEscapeXML(pdfpath);

        xml += "<pdf src='" + pdf_fileURL + "'/>";
      }
      ///-------------------------------------------------------------------end Get PDF from doc


    }
    //aaaaaa///////////////////////////////////////////////////// end get other related docs

    var CFrelateddoc = nlapiLookupField('salesorder', CF, 'custbody75');

    nlapiLogExecution('debug', 'pdf_fileURL', pdf_fileURL);
    nlapiLogExecution('debug', 'relatedfileName', relatedfileName);
    /*
  if(CFrelateddoc != relatedfileName && CFrelateddoc  )
    {
      
      var CFrelateddoctype = nlapiLookupField("file", CFrelateddoc, "filetype",true);

            //// set file to view online
      filestoupdate.push(CFrelateddoc);
            var updatefilerelated = nlapiLoadFile(CFrelateddoc);
            updatefilerelated.setIsOnline(true);
          nlapiSubmitFile(updatefilerelated);
            ////end set file to view online  
  ///-------------------------------------------------------------------Get image from created from
      
  if( CFrelateddoctype != "PDF File" && CFrelateddoc)
    {
    xml += "<pdf>";
    xml += "<body>";
  var strName = "<table >";
  strName += "<tr>";
      strName += "<td>";
              strName += "<img   width=\"100\%\"  src=\"";
              var path = s_dom +nlapiLoadFile(CFrelateddoc).getURL();
              strName += nlapiEscapeXML(path);
              strName += "\"></img>";
      strName += "</td></tr>";
  strName += "</table>";
    xml += strName;
      xml += "</body>";
    xml += "</pdf>";
    }
  //-------------------------------------------------------------------end Get image from created from

  //-------------------------------------------------------------------Get PDF from created from
  if( CFrelateddoctype == "PDF File" )//&& CFrelateddoc != "")
    {
  var pdfpath = s_dom +nlapiLoadFile(CFrelateddoc).getURL();
  var pdf_fileURL = nlapiEscapeXML(pdfpath); 
  xml += "<pdf src='"+ pdf_fileURL +"'/>";
    }
    ///-------------------------------------------------------------------end Get PDF from created from
      }
  */
    //////////////////////////////////////////////////////////////////////////////////

    xml += "</pdfset>";
    nlapiLogExecution('debug', 'xml', xml);
    // run the BFO library to convert the xml document to a PDF 
    // aaaaaa

    //  xml ='<?xml version="1.0"?> <!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd"> <pdfset><pdf src="https://system.na3.netsuite.com/core/media/media.nl?id=5169092&c=422523&h=6471fb90d4bca1c22dea&_xt=.pdf"/><pdf src="https://system.na3.netsuite.com/core/media/media.nl?id=5146386&c=422523&h=92d34e18d8fbcf7fffa3&_xt=.pdf"/><pdf src="https://system.na3.netsuite.com/core/media/media.nl?id=5199812&c=422523&h=f8eefce27a2959265210&_xt=.pdf"/><pdf src="https://system.na3.netsuite.com/core/media/media.nl?id=5199813&c=422523&h=6faf62c915d6c1f21403&_xt=.pdf"/></pdfset>';
    var file = nlapiXMLToPDF(xml);


    // write response to the client
    response.setContentType('PDF', 'Print.pdf ', 'inline');

    response.write(file.getValue());



    for (h = 0; filestoupdate != null && h < filestoupdate.length; h++) {
      ////set file to not view online echosign agreements Sales Order 
      var fileid = filestoupdate[h]
      var SOupdatefile = nlapiLoadFile(fileid)
      SOupdatefile.setIsOnline(false);
      nlapiSubmitFile(SOupdatefile);
      ////end set file to not view online echosign agreements Sales Order 
    }
  }catch(e){
    nlapiLogExecution('ERROR', 'error', e);
  }
}

