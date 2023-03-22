function beforeLoadAddButton(type)
{
if (type == 'view')
{
	form.addButton('custpage_ffpickslip', 'Print Warehouse Picking Slip', 'printPickingSlip()');
	form.setScript('customscript2483'); // sets the script on the client side
}}



