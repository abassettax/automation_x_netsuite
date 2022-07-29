 


function CreateLabelsform(request,response)
{
   
    if (request.getMethod() == 'GET') {
//window.onbeforeunload = null; 
 var form = nlapiCreateForm('Print Labels', false);
     form.setTitle('Print Labels');
 form.setScript('customscript1230'); // sets the script on the client side
  
var locationid = request.getParameter('custpage_locationid');
var tranid = request.getParameter('custpage_tranid');
var instock = request.getParameter('custpage_instock');
var normallystocked = request.getParameter('custpage_normallystock');
var PrefVendor = request.getParameter('custpage_prefvendor');
var palletlabel  = request.getParameter('custpage_palletlabel'); 
var printCustomerPartNum  = request.getParameter('custpage_printcustpartnumber');
      
   if( !palletlabel){palletlabel = "F";}
   if(!locationid){ locationid = "@NONE@"; } 
   if(locationid != "@NONE@"  && instock=="F"  && normallystocked=="F"  && !tranid ){  normallystocked="T"; instock="T";  }else if (locationid == "@NONE@"  && instock=="T"  && normallystocked=="T" ){  normallystocked="F"; instock="F";  }
   if(tranid){   locationid ="";   instock="F";   normallystocked="F";  }
 form.addField('custpage_locationid','select','Location', 'location').setLayoutType('normal', 'startcol'  ).setDefaultValue(locationid);   
 form.addField('custpage_tranid','select','Transaction', 'transaction').setLayoutType('normal', 'startcol'  ).setDefaultValue(tranid);
 form.addField('custpage_prefvendor','text','Preferred Vendor Starts With').setLayoutType('normal', 'none'  ).setDefaultValue(PrefVendor);
 form.addField('custpage_instock','checkbox','In Stock Only').setLayoutType('normal', 'startcol'  ).setDefaultValue(instock);
 form.addField('custpage_normallystock','checkbox','Normally Stocked Item Only').setLayoutType('normal', 'none'  ).setDefaultValue(normallystocked);
 form.addField('custpage_palletlabel','checkbox','Print Pallet Labels').setLayoutType('normal', 'none'  ).setDefaultValue(palletlabel);
 form.addField('custpage_printcustpartnumber','checkbox','Print Customer Part #').setLayoutType('normal', 'none'  ).setDefaultValue(printCustomerPartNum);
      
  if(!PrefVendor){ PrefVendor = "%"; } 

  //////////////////////////////////////////////// filter options
  /////////////////////////default
   var filtersDefault =[
   [["locationpreferredstocklevel","greaterthan","0"],"OR",["locationquantityavailable","greaterthan","0"]], 
   "AND", 
   ["inventorylocation","anyof",locationid],
     "AND", 
  ["preferredvendor.entityid","startswith",PrefVendor]
   ];
  //end default
  //

/////////////////////////transaction picked
var filtersTransaction = [
    ["transaction.internalidnumber","equalto", tranid],
     "AND", 
  ["preferredvendor.entityid","startswith",PrefVendor]
                  ]
  ///////end

/////////////////////////on hand only 
var filtersOnHand = [
   ["locationquantityavailable","greaterthan","0"], 
   "AND", 
   ["inventorylocation","anyof",locationid] ,
     "AND", 
  ["preferredvendor.entityid","startswith",PrefVendor]
                  ]
   ///////end

/////////////////////////stocked only picked
  var filtersNormStock = [
   ["locationpreferredstocklevel","greaterthan","0"], 
   "AND", 
   ["inventorylocation","anyof",locationid],
     "AND", 
  ["preferredvendor.entityid","startswith",PrefVendor] 
                  ]
   ///////end
/////////////////////////vendor only 
  var filtersPrefVendorOnly = [
  ["preferredvendor.entityid","startswith",PrefVendor] 
                  ]
   ///////end
   
  //////////////////////////////////////////////////////////////////////////////
 var labelitems = new Array();
 labelitems[0] = new nlobjSearchColumn("custitem35"); 
 labelitems[1] = new nlobjSearchColumn("itemid").setSort(false); 
 labelitems[2] = new nlobjSearchColumn("displayname"); 
 labelitems[3] = new nlobjSearchColumn("formulatext").setFormula("CASE WHEN   LENGTH({mpn}) >70 THEN  '...' ||SUBSTR({mpn} , LENGTH({mpn}) -70, LENGTH({mpn})) ELSE {mpn} END"); 
 labelitems[4] = new nlobjSearchColumn("formulatext"); 
 labelitems[5] = new nlobjSearchColumn("upccode"); 
 labelitems[6] = new nlobjSearchColumn("internalid");  
 labelitems[7] = new nlobjSearchColumn("type"); 
 labelitems[8] = new nlobjSearchColumn("formulatext").setFormula("{name}");
  var useThisFilter = filtersDefault;

if( instock =="F"  && normallystocked=="F" && !tranid &&  locationid == "@NONE@" &&  PrefVendor != '%'){   useThisFilter = filtersPrefVendorOnly; }
  else if(tranid>1){  useThisFilter = filtersTransaction; }
      else if(instock  == "T"  && normallystocked== "F" ){ useThisFilter =   filtersOnHand; nlapiLogExecution('DEBUG', 'onhand', 1);}
            else if(instock  == "F"  &&  normallystocked== "T"   ){ useThisFilter =   filtersNormStock; nlapiLogExecution('DEBUG', 'normstock', 1); }
                else if(normallystocked    == "T" &&  instock  == "T" ){ useThisFilter = filtersDefault; nlapiLogExecution('DEBUG', 'bothtrue', 1); }
  
     var itemSearch = nlapiSearchRecord("item",null, useThisFilter, labelitems); 
  
   var itemList = form.addSubList('custpagesublist','inlineeditor','Items');  //inlineeditor
var carr = new Array();      
       if(itemSearch){
  for(var i=0; i < itemSearch.length; i++)
  {
    var Listfivecode = itemSearch[i].getValue(labelitems[0]);
    var ListItem = itemSearch[i].getValue(labelitems[6]);
    var ListItemText = itemSearch[i].getValue(labelitems[8]);
    var ListDisplayName = itemSearch[i].getValue(labelitems[2]);
    var ListMPN = itemSearch[i].getValue(labelitems[3]);
    var ListUPC = itemSearch[i].getValue(labelitems[5]);
    var ListType = itemSearch[i].getValue(labelitems[7]);

    
    
    var rowstring = {'custitem35':Listfivecode, 'itemids':ListItem , 'displayname':ListDisplayName, 'upccode':ListUPC,  'mpn':ListMPN, 'itemtype':ListType, 'itemnametext':ListItemText };
    carr[i]= rowstring ;
  }
       }

       //create the Fields for the Sublist
itemList.addField('print','checkbox', 'Print', null).setDisplayType('entry').setDefaultValue('T');  
itemList.addField('custitem35','text', 'AX 5 Code', null).setDisplayType('disabled'); 
itemList.addField('itemids','select', 'Item', 'item').setDisplayType('entry'); 
itemList.addField('displayname', 'text', 'Display Name', null).setDisplayType('disabled');
itemList.addField('mpn', 'text', 'MPN', null).setDisplayType('disabled');

itemList.addField('upccode', 'text', 'UPC', null).setDisplayType('disabled');
itemList.addField('itemtype', 'text', 'Item Type', 'itemtype').setDisplayType('disabled');
itemList.addField('itemnametext', 'text', 'Item Names', null).setDisplayType('hidden');

   itemList.setLineItemValues( carr);
   response.writePage( form );
  
   form.addSubmitButton('Print') ; 

   form.addButton('custpage_createQuote', 'Filter Results', 'filterresults()');
   form.addButton('custpage_createQuote', 'Reset', 'resetsuitlet()');
   form.addButton('custpage_createQuote', 'Remove All Lines', 'RemoveAll()'); 
   form.addButton('custpage_createQuote', 'Check All', 'checkall()');  
   form.addButton('custpage_createQuote', 'Uncheck All', 'Uncheckall()'); 
   response.writePage(form);
      

      
    }
///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////startcreate labels
///////////////////////////////////////////////////////////////////////////////////////////////
 else   
  {
if(request.getParameter('custpage_palletlabel')!="T")
   {
var  itemsToPrint = new Array();
  var lineCount = request.getLineItemCount('custpagesublist');
  for(j =1; j<=lineCount; j++)
    {
var fiveCode = request.getLineItemValue('custpagesublist', 'custitem35', j);
var itemName = request.getLineItemValue('custpagesublist', 'itemnametext', j); 
var itemId = request.getLineItemValue('custpagesublist', 'itemids', j);  
var displayName = request.getLineItemValue('custpagesublist', 'displayname', j);
var mpn = request.getLineItemValue('custpagesublist', 'mpn', j);
var upc = request.getLineItemValue('custpagesublist', 'upccode', j);
var Print =  request.getLineItemValue('custpagesublist', 'print', j);

   
  if(Print =='T' )  {
       itemsToPrint.push({
             fiveCode:fiveCode,
             itemName:itemName,
             displayName:displayName,
             mpn:mpn,
             upc:upc,
                   });
                      }
     }

    
 var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n    ";
  xml += "<pdfset>";
    //var renderer = nlapiCreateTemplateRenderer(); 
     for(q =0; q<itemsToPrint.length && itemsToPrint; q++)  
	{
 
var fiveCode = itemsToPrint[q].fiveCode;   
var itemName = itemsToPrint[q].itemName;
var displayName = itemsToPrint[q].displayName;
var mpn =  itemsToPrint[q].mpn; if(!mpn){mpn="";} 
var mpnshort = "" ;
    nlapiLogExecution('DEBUG', 'mpn', mpn);
   if(mpn.length >82){mpnshort = (mpn.substring(mpn.length-82)).toString(); }else{mpnshort = mpn;}
nlapiLogExecution('DEBUG', 'mpnshort', mpnshort);
var upc = itemsToPrint[q].upc;

 ////////////////////////////////////create XML
 xml +=	'	<pdf>';
 xml +=	'	<body padding=".05in .03in .03in .03in" width="380px" height="195px">	';
 xml +=	'	<table style="border-radius: 25px; overflow-wrap: break-word; width: 375px;  margin-left: auto; margin-right: auto;  margin-top: auto;  margin-bottom: auto;" border="2"><tr height="105px">	';
 
 xml +=	'	<td style="vertical-align: top; text-align: center; width: 366px;" colspan="2" align="center"><b><span style="font-size:18px;">'+  nlapiEscapeXML(itemName)   + '&nbsp;' +   nlapiEscapeXML(displayName)     +'</span></b>  </td>';
 xml +=	'	</tr>';

  xml +=	' <tr  width="375px" height="28px" ><td width="2.0in" style="vertical-align: middle; text-align: left;  font-size: 12px;  word-wrap: break-word; max-width:0;"><span>'+     nlapiEscapeXML(mpn) +' </span></td>    <td  style="vertical-align: middle; " align="right" ><span style="font-weight: bold; font-size:32px; text-align: right; ">'+     nlapiEscapeXML(fiveCode) +'</span></td></tr>	';
      
 xml +=	' <tr  width="375px" height="25px">';
 xml +=	'	<td style="vertical-align: middle; text-align: left; ">  <barcode bar-width="1.0" codetype="code128" showtext="false" value="'+     nlapiEscapeXML(upc) +'"/>  </td>	'; //fiveCode
 xml +=	'	<td  style="vertical-align: middle; text-align: left; ">   <img src="https://system.na3.netsuite.com/c.422523/images/autox-tricolor-whiteback-cmyk-3in-wide.jpg" style="width: 120px; height: 25px; vertical-align: middle; align: left;" />  </td></tr>	';

 
 xml +=	'	</table>	';
 xml +=	'	</body>	';
 xml +=	'	</pdf>';
    }
    xml += '</pdfset>';

    var file = nlapiXMLToPDF(xml); // Produces PDF output.
 file.setName( 'Labels' +".pdf");
    response.setContentType('PDF', 'Labels.pdf', 'inline');
    //  response.Write("window.open(file.getValue())");
    
    response.write(file.getValue());

  }
}
}


