function ffresetcost()
{

var toRec = nlapiLoadRecord('transferorder',nlapiGetRecordId());

nlapiSubmitRecord(toRec);

var ffbutton = document.getElementById("process");
ffbutton.click();
}