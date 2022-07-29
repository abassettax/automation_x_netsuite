/*
* Type : Schedule
*/

function createCustomCategoryRec() {
	var categories = ['21601463','21635050','21635051','14555485','16840643', '17357887', '17398285', '17950878'];
	nlapiLogExecution('Debug','categories length:',categories.length);
	for(var i=0;i<categories.length;i++) {
		checkGovernance();
		processCategoryRec(categories[i]);
		nlapiLogExecution('Debug','i for Main:'+i,categories[i]);
	}
}

function checkGovernance() {
  var context = nlapiGetContext();
  if (context.getRemainingUsage() <= 100){
            var stateMain = nlapiYieldScript();
            if( stateMain.status == 'FAILURE'){
                  nlapiLogExecution("debug","Failed to yield script (do-while), exiting: Reason = "+ stateMain.reason + " / Size = "+ stateMain.size);
                  throw "Failed to yield script";
            }
            else if ( stateMain.status == 'RESUME' ){
                  nlapiLogExecution("debug", "Resuming script (do-while) because of " + stateMain.reason+". Size = "+ stateMain.size);
            }
      }
}


function processCategoryRec(id) {
  var category = id;//'14555485';
  var firstLevelCategoryRec = nlapiLoadRecord('sitecategory',category);
  var firstLevelCat = firstLevelCategoryRec.getFieldValue('itemid');
  var firstLevelUrlCom = firstLevelCategoryRec.getFieldValue('urlcomponent') || "";

  //create First level Category custrecord here.
  var custFirstRecId = createCustomRec('1',category,firstLevelCat,firstLevelUrlCom);
  //

  var subCategoriesCount = firstLevelCategoryRec.getLineItemCount('prescats');
  nlapiLogExecution('Debug','1 level:',subCategoriesCount);

  var parentCategory = {"internalid":category,"name":firstLevelCat,"urlcomponent":firstLevelUrlCom,"subcategories":[]};

  if(subCategoriesCount >= 1) {
    for(var i =1;i<=subCategoriesCount;i++) {
		
	  
      //Second level subcategory starts
      var subCategoryId = firstLevelCategoryRec.getLineItemValue('prescats','kitem',i);
      var subCategoryRec = nlapiLoadRecord('sitecategory',subCategoryId);
      var childSubcategoryName = subCategoryRec.getFieldValue('itemid');
      var childUrlCom = subCategoryRec.getFieldValue('urlcomponent') || "";/**/


      //create all Second level subcategory custrecord here.
      var custSecondRecId = createCustomRec(custFirstRecId,subCategoryId,childSubcategoryName,childUrlCom);
      //
      //Second level subcategory ends
      var secndSubCategoryItemCount = subCategoryRec.getLineItemCount('prescats');
      nlapiLogExecution('Debug','2 level : i :' + i,secndSubCategoryItemCount);

      if(secndSubCategoryItemCount >= 1) {
        for(var j =1;j<=secndSubCategoryItemCount;j++) {
          var thirdSubCategoryId = subCategoryRec.getLineItemValue('prescats','kitem',j);
          //
          var secndSubCategoryRec = nlapiLoadRecord('sitecategory',thirdSubCategoryId);
          var thirdSubcategoryName = secndSubCategoryRec.getFieldValue('itemid');
          var thirdSubUrlCom = secndSubCategoryRec.getFieldValue('urlcomponent') || "";

          //create all Third level subcategory custrecord here.
          var custThirdRecId = createCustomRec(custSecondRecId,thirdSubCategoryId,thirdSubcategoryName,thirdSubUrlCom);
          //
          //Third level subcategory ends
          var thirdSubCategoryItemCount = secndSubCategoryRec.getLineItemCount('prescats');
          nlapiLogExecution('Debug','3 level : j :' + j,thirdSubCategoryItemCount);
          if(thirdSubCategoryItemCount >=1) {
            for(var k =1;k<=thirdSubCategoryItemCount;k++) {
              var fourthSubCategoryId = secndSubCategoryRec.getLineItemValue('prescats','kitem',k);
              //
              var thirdSubCategoryRec = nlapiLoadRecord('sitecategory',fourthSubCategoryId);
              var fourthSubcategoryName = thirdSubCategoryRec.getFieldValue('itemid');
              var fourthSubUrlCom = thirdSubCategoryRec.getFieldValue('urlcomponent') || "";

              //create all Third level subcategory custrecord here.
              var custFourthRecId = createCustomRec(custThirdRecId,fourthSubCategoryId,fourthSubcategoryName,fourthSubUrlCom);
			  //
			  var fourthSubCategoryItemCount = thirdSubCategoryRec.getLineItemCount('prescats');
          nlapiLogExecution('Debug','4 level : k :' + k,fourthSubCategoryItemCount);
          if(fourthSubCategoryItemCount >=1) {
            for(var l =1;l<=fourthSubCategoryItemCount;l++) {
              var fiftSubCategoryId = thirdSubCategoryRec.getLineItemValue('prescats','kitem',l);
              //
              var fourthSubCategoryRec = nlapiLoadRecord('sitecategory',fiftSubCategoryId);
              var fiftSubcategoryName = fourthSubCategoryRec.getFieldValue('itemid');
              var fiftSubUrlCom = fourthSubCategoryRec.getFieldValue('urlcomponent') || "";

              //create all Third level subcategory custrecord here.
              var custFiftRecId = createCustomRec(custFourthRecId,fiftSubCategoryId,fiftSubcategoryName,fiftSubUrlCom);
            }
          }
            }
          }

        }
        //

      }

    }
  }

}


function createCustomRec(parent,internalid,name,urlcomponent) {

   var custRec = nlapiCreateRecord('customrecord_dynamic_navigation');//recordid
   if(parent) {
     custRec.setFieldValue('custrecord_subcategory_of',parent);
   }
   custRec.setFieldValue('custrecord_internal_id',internalid);
   custRec.setFieldValue('custrecord_category',name);
   custRec.setFieldValue('name',name);
   custRec.setFieldValue('custrecord_url_component',urlcomponent);
   custRec.setFieldValue('custrecord_is_online','T');

   var id = nlapiSubmitRecord(custRec);
   nlapiLogExecution("Debug","Rec Id : ",id)
   return id;
   //use try catch here

}
