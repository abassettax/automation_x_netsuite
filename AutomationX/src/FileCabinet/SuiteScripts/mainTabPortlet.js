function buildPortlet(portlet, column)
{		
    portlet.setTitle('DocuPeak');		
    
    var url = nlapiOutboundSSO('customssodocupeak');
    var content = '<iframe src="'+url+'" align="center" style="width: 100%; height: 600px; margin:0; border:0; padding:0"></iframe>';		
    portlet.setHtml( content ); 
}