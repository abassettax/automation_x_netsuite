


function punchoutaddtocartbuttons(type, form, request){


var custid = nlapiGetFieldValue('entity');

var record=nlapiLoadRecord('customer',custid);

record.getFieldValue('custentity_hub_seller_punchout_user');




var punchoutquote =  "createOrder()";  // on click client function

form.addButton('custpage_create_order','punch oout', punchoutquote );
 form.setScript('customscript245');


}


