function internationalvendorredirect()
{

//var  UserDepartment = nlapiGetDepartment(); 
var  IsInternational = nlapiGetFieldValue('custentity252');


if( IsInternational == "T"  )    //&& ( UserDepartment == 1 || UserDepartment ==9) )

{


nlapiSetRedirectURL('TASKLINK', 'CARD_-29');
  return true;

}}


