function punchoutaddtocartbutton(type, form, request){



var punchoutuser =nlapiGetFieldValue('custbody137');

if(punchoutuser != "D"  )
	{
var punchoutquote =  "createOrder()";  // on click client function

form.addButton('custpage_create_order','Add To Cart', punchoutquote );
 form.setScript('customscript245');
}

}
