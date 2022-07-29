function Itempopup(params)
{


			var idItem = params.getParameter('idItem');
			
			var item = 4281;
			var itemRecord;
			
			try
			{
				itemRecord = nlapiLoadRecord('inventoryitem', item);
			}
			catch(SSS_RECORD_TYPE_MISMATCH)
			{
                try
                {
                    itemRecord = nlapiLoadRecord('noninventoryitem', item);
                }
                catch(SSS_RECORD_TYPE_MISMATCH)
                {
                    try
                    {
                        itemRecord = nlapiLoadRecord('assemblyitem', item);
                    }
                    catch(SSS_RECORD_TYPE_MISMATCH)
                    {
                        try
                        {
                            itemRecord = nlapiLoadRecord('kititem', item);
                        }
                        catch(SSS_RECORD_TYPE_MISMATCH)
                        {
                            error = true;
                        }
                    }
                }
			}
		
			


//http://www.automation-x.com/core/media/media.nl?id= 6940 &c=422523&h=8ebe822c6804961e11dc

			
var itemImage = itemRecord.getFieldValue('storedisplayimage');

var itemDescription = itemRecord.getFieldValue('storedetaileddescription');


var specsheettext="";
var specsheet = itemRecord.getFieldValue('custitem16');
if(specsheet!= "")
{
specsheettext = "Spec Sheet";
}


var html = "<html>";

	html = html + "<head>";
        html = html + '<style media="all" type="text/css">@import "http://www.automation-x.com/site/ax-files/ax-templates.css";</style>';
        html = html + "</head>";

html =  html +"<table frame=box  width=600 ><tr><td  rowspan='2' width=300 ><img src=http://www.automation-x.com/core/media/media.nl?id="+ itemImage   + "&c=422523&h=8ebe822c6804961e11dc></td><td width=10 rowspan=2 frame=box></td><td  > <b>Description</b></td></TR><tr>";
html =  html + "";
html = html + "<td width=300 class='item_tabs_bg' >" + itemDescription +" <br><br></td>";
html = html + "</tr></table></html>";
 
response.write( html );
}
