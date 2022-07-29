function itemsublistscroll()
{
  

    var screenHeight = screen.height -440;//-255
// alert(screenHeight);
  if(screenHeight<400){screenHeight = 400;}
document.getElementById("item_splits").parentElement.style.overflow= "auto"; 
document.getElementById("item_splits").parentElement.style.height= screenHeight+"px";
document.getElementById("item_splits").parentElement.addEventListener("scroll",function(){
   var translate = "translate(0,"+this.scrollTop+"px)";
   
   const allTh = this.querySelectorAll("tr#item_headerrow.uir-machine-headerrow");
   for( var i=0; i < allTh.length; i++ ) {
     allTh[i].style.transform = translate;
   }
});

}

function fixWO()
{
     var lineCount = parseInt( nlapiGetLineItemCount('item'));
       for(x =1; x<=lineCount; x++)
	{
var iswoT = nlapiGetLineItemValue('item','createwo',x);
   if(iswoT == "T"){ nlapiSelectLineItem('item', x);  nlapiSetCurrentLineItemValue('item','createwo', 'F'); nlapiCommitLineItem('item'); alert(nlapiGetLineItemValue('item','createwo',x)); }
    }
}