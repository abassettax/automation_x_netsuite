function createpdfbutton()

{
 
var adobebutton = form.getButton('custpage_send_button'); 
var defaultechosignb = form.getButton('custpage_button_docusign_custom2');  
   
    if( adobebutton  ){   adobebutton.setVisible(false);       }
    if( defaultechosignb  ){ defaultechosignb.setVisible(false);     }
  
form.addButton('custpage_MergePDFbutton', 'Generate File', 'CreatePDFandSendClient() ');  
form.setScript('customscript778'); // sets the script on the client side

}




