function beforeLoadAddButton(type)
{
if (type == 'view')
{
	form.addButton('custpage_oppquote', 'New Quote', 'transformToQuote()');
	form.setScript('customscript2480'); // sets the script on the client side
}}



