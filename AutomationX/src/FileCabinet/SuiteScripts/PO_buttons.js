function beforeLoadAddButton(type)
{
if (type == 'create' ||  type == 'edit' || type == 'copy')
{
	form.addButton('custpage_checkinventory', 'Unlink PO ', ' breakPOlink() ');  
   	form.setScript(' customscript357'); // sets the script on the client side
}}



