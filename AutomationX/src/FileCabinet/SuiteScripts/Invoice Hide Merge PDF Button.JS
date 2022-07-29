function hideMergePDFbutton(type)
{

if (type == 'view');/// ||  type == 'edit' || type == 'copy')
{

  form.addButton('custpage_MergePDFbutton', 'Print Merged PDF', 'fxn_generatePDF() ');  
   	form.setScript('customscript391'); // sets the script on the client side
  
  
  
//var button = form.getButton('custformbutton_customscript391_1');
//Hide the button in the UI
//button.setVisible(false); 

}
}