/*
* Type : Schedule
*/

function createJSON() {
	var categories = ['21601463','21635050','21635051','14555485','16840643','22453919'];  ///////parent level category list /////////////////////////////////////////////////////
	//var categories = ['14555485']
	nlapiLogExecution('Debug','categories length:',categories.length);
  var products = [];
	for(var i=0;i<categories.length;i++) {
		checkGovernance();
		var categoryTree = processCategoryRec(categories[i],i+1);
		nlapiLogExecution('Debug','i for Main:'+i,categories[i]);
    if(categoryTree)
    products.push(categoryTree);
	}



  var data = {
   "data":[
   {
   "internalid":"27",
   "name":"Products",
   "urlcomponent":"Products",
   "subcategories":products
   }]
  }

  nlapiLogExecution('Debug','Text::',JSON.stringify(data));

  var fileJSON = nlapiCreateFile('handlebar_site_category.json','JSON',JSON.stringify({data:products}));
  fileJSON.setFolder('5491094');
  var fileID = nlapiSubmitFile(fileJSON);
  nlapiLogExecution('Debug','fileID',fileID);
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


function processCategoryRec(id,mainOrder) {
  var category = id;//'14555485';
  var firstLevelCategoryRec = nlapiLoadRecord('sitecategory',category);
  var firstLevelCat = firstLevelCategoryRec.getFieldValue('itemid');
  var firstLevelUrlCom = firstLevelCategoryRec.getFieldValue('urlcomponent') || "";
  var firstLevelInactive = firstLevelCategoryRec.getFieldValue('isinactive');


  var subCategoriesCount = firstLevelCategoryRec.getLineItemCount('prescats');
  nlapiLogExecution('Debug','1 level:',subCategoriesCount);

  var mainOrder = getCategoryOrder(category);
  var ParentCategory = {"internalid":category,"order":mainOrder,"name":firstLevelCat,"urlcomponent":firstLevelUrlCom,"subcategories":[]};


  if(subCategoriesCount >= 1) {
    for(var i =1;i<=subCategoriesCount;i++) {


      //Second level subcategory starts
      var subCategoryId = firstLevelCategoryRec.getLineItemValue('prescats','kitem',i);
      var subCategoryRec = nlapiLoadRecord('sitecategory',subCategoryId);
      var childSubcategoryName = subCategoryRec.getFieldValue('itemid');
      var childUrlCom = subCategoryRec.getFieldValue('urlcomponent') || "";
      var childSubcategoryInactive = subCategoryRec.getFieldValue('isinactive');

      var order2 = getCategoryOrder(subCategoryId);
      var FirstCategory = {"internalid":subCategoryId,"order":order2,"name":childSubcategoryName,"urlcomponent":childUrlCom,"subcategories":[]};
      //getCategoryOrder(subCategoryId,i);
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
          var thirdSubcategoryInactive = secndSubCategoryRec.getFieldValue('isinactive');

          var order3 = getCategoryOrder(thirdSubCategoryId);
          var SecondCategory = {"internalid":thirdSubCategoryId,"order":order3,"name":thirdSubcategoryName,"urlcomponent":thirdSubUrlCom,"subcategories":[]};
          //getCategoryOrder(thirdSubCategoryId,j);
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
              var fourthSubcategoryInactive = thirdSubCategoryRec.getFieldValue('isinactive');

              var order4 = getCategoryOrder(fourthSubCategoryId);
              var ThirdCategory = {"internalid":fourthSubCategoryId,"order":order4,"name":fourthSubcategoryName,"urlcomponent":fourthSubUrlCom,"subcategories":[]};
              //getCategoryOrder(fourthSubCategoryId,k);
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
              var fifthSubcategoryInactive = fourthSubCategoryRec.getFieldValue('isinactive');

              var order5 = getCategoryOrder(fiftSubCategoryId);
              var FourthCategory = {"internalid":fiftSubCategoryId,"order":order5,"name":fiftSubcategoryName,"urlcomponent":fiftSubUrlCom,"subcategories":[]};
              //getCategoryOrder(fiftSubCategoryId,l);

              if(fifthSubcategoryInactive == 'F')
              ThirdCategory['subcategories'].push(FourthCategory);
            }
          }
          if(fourthSubcategoryInactive == 'F')
          SecondCategory['subcategories'].push(ThirdCategory);
          }
          }
          if(thirdSubcategoryInactive == 'F')
          FirstCategory['subcategories'].push(SecondCategory);
        }
        //

      }
      if(childSubcategoryInactive == 'F')
      ParentCategory['subcategories'].push(FirstCategory);
    }
  }

  if(firstLevelInactive == 'T') {
    return null
  }
  return ParentCategory;

}


function updateCustRecCat(siteCategory,order) {
  var search = nlapiSearchRecord('customrecord_dynamic_navigation',null,nlobjSearchFilter('custrecord_internal_id',null,'is',siteCategory),null);
  if(search) {
    var recId = search[0].getId();
    nlapiSubmitField('customrecord_dynamic_navigation',recId,'custrecord_category_sort_order',Number(order));
    nlapiLogExecution('Debug','Updated:',recId);
  }
}

function getCategoryOrder(siteCategory,order) {
  var col = [new nlobjSearchColumn('custrecord_category_sort_order')];
  var search = nlapiSearchRecord('customrecord_dynamic_navigation',null,nlobjSearchFilter('custrecord_internal_id',null,'is',siteCategory),col);
  if(search) {
    var catOrder = search[0].getValue(col[0]);
    return catOrder;
  }
  return null
}
