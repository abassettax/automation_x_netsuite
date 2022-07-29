function lockAnonymous(form,type)
{
if(nlapiGetRecordId())
{   nlapiSetRedirectURL('TASKLINK', 'CARD_-29');
  return true;      }
   
}