function CategoriesforMenu() {

var cate= nlapiLoadSearch('sitecategory', '2092');   //load saved search-jf
var runcate =cate.runSearch();
//preserve previous loop value -jf

var counter=0;
var counter2=0;
var counter3=0;
var counter4=0;
var counter5=0;
var counter6=0;
var counter7=0;
var counter8=0;
var preserve=0;
var preserve1=0;
var preserve2=0;
var preserve3=0;
var preserve4=0;
var preserve5=0;
var preserve6=0;
var preserve7=0;
var preserve8=0;
var output="<div id=\"PLC-menu\">";

runcate .forEachResult(function(searchResult)
	{
	var name = searchResult.getValue( 'fullname' );
	var url= searchResult.getValue( 'urlcomponent' ); //get url value -jf
	var bananasplit= name.split(':'); //split full name by : -jf
	var firstlvl = bananasplit[0];
if (firstlvl!=undefined)
{
var stripper = firstlvl.replace(/\s+/g, ''); //remove zeros from name
if(stripper!=preserve)
{
if(counter==1){output=output+"</ul>";counter=0;}
if(counter2==1){output=output+"</ul>";counter2=0;}//checks if we have been to thirdlvl if so close
if(counter3==1){output=output+"</ul>";counter3=0;}//checks if we have been to forthlvl if so close
if(counter4==1){output=output+"</ul>";counter4=0;}//checks if we have been to fifthlvl if so close
if(counter5==1){output=output+"</ul>";counter5=0;}//checks if we have been to sixthlvl if so close
if(counter6==1){output=output+"</ul>";counter6=0;}//checks if we have been to seventhlvl if so close
if(counter7==1){output=output+"</ul>";counter7=0;}//checks if we have been to eighthlvl if so close

 output=output+"<li class=\"sub\"><a href=\"/"+url+"\">"+firstlvl+"</a>";
	preserve=stripper;
}
////////
var secondlvl = bananasplit[1];
if (secondlvl!=undefined)
{
var stripper1 = secondlvl.replace(/\s+/g, ''); //remove zeros from name
if(stripper1!=preserve1) //check to see if parse has already been written -jf
{
if(counter==1){output=output+"</ul>";counter=0;}
if(counter2==1){output=output+"</ul>";counter2=0;}//checks if we have been to thirdlvl if so close
if(counter3==1){output=output+"</ul>";counter3=0;}//checks if we have been to forthlvl if so close
if(counter4==1){output=output+"</ul>";counter4=0;}//checks if we have been to fifthlvl if so close
if(counter5==1){output=output+"</ul>";counter5=0;}//checks if we have been to sixthlvl if so close
if(counter6==1){output=output+"</ul>";counter6=0;}//checks if we have been to seventhlvl if so close
if(counter7==1){output=output+"</ul>";counter7=0;}//checks if we have been to eighthlvl if so close


	output=output+"<li><a href=\"/"+url+"\">"+secondlvl+"2ndlvl</a></li>"; //separate each menu item-jf
preserve1=stripper1;

if (counter==0) //checks to see if this is the first writing -jf
{output=output+"<ul>";counter=1; } //opens container -jf
}
////////
var thirdlvl = bananasplit[2];
if (thirdlvl!=undefined)
{
var stripper2 = thirdlvl.replace(/\s+/g, ''); //remove zeros from name
if(stripper2!=preserve2)
{
if(counter2==1){output=output+"</ul>";counter2=0;}//checks if we have been to thirdlvl if so close
if(counter3==1){output=output+"</ul>";counter3=0;}//checks if we have been to forthlvl if so close
if(counter4==1){output=output+"</ul>";counter4=0;}//checks if we have been to fifthlvl if so close
if(counter5==1){output=output+"</ul>";counter5=0;}//checks if we have been to sixthlvl if so close
if(counter6==1){output=output+"</ul>";counter6=0;}//checks if we have been to seventhlvl if so close
if(counter7==1){output=output+"</ul>";counter7=0;}//checks if we have been to eighthlvl if so close


	output=output+"<li><a href=\"/"+url+"\">"+thirdlvl+"3rdlvl</a></li>"; //separate each menu item-jf
preserve2=stripper2;
if (counter2==0) //checks to see if this is the first writing -jf
{output=output+"<ul>";counter2=1; } //opens container -jf
}
////////
var fourthlvl = bananasplit[3];
if (fourthlvl!=undefined)
{
var stripper3 = fourthlvl.replace(/\s+/g, ''); //remove zeros from name
if(stripper3!=preserve3)
{
if(counter3==1){output=output+"</ul>";counter3=0;}//checks if we have been to forthlvl if so close
if(counter4==1){output=output+"</ul>";counter4=0;}//checks if we have been to fifthlvl if so close
if(counter5==1){output=output+"</ul>";counter5=0;}//checks if we have been to sixthlvl if so close
if(counter6==1){output=output+"</ul>";counter6=0;}//checks if we have been to seventhlvl if so close
if(counter7==1){output=output+"</ul>";counter7=0;}//checks if we have been to eighthlvl if so close



	output=output+"<li><a href=\"/"+url+"\">"+fourthlvl+"4thlvl</a></li>"; //separate each menu item-jf
preserve3=stripper3;
//if (counter3==0) //checks to see if this is the first writing -jf
//{output=output+"<ul>";counter3=1; } //opens container -jf
}

////////
var fifthlvl = bananasplit[4];
if (fifthlvl!=undefined)
{
var stripper4 = fifthlvl.replace(/\s+/g, ''); //remove zeros from name
if(stripper4!=preserve4)
{
if(counter4==1){output=output+"</ul>";counter4=0;}//checks if we have been to fifthlvl if so close
if(counter5==1){output=output+"</ul>";counter5=0;}//checks if we have been to sixthlvl if so close
if(counter6==1){output=output+"</ul>";counter6=0;}//checks if we have been to seventhlvl if so close
if(counter7==1){output=output+"</ul>";counter7=0;}//checks if we have been to eighthlvl if so close

	output=output+"<li><a href=\"/"+url+"\">"+fifthlvl+"</a></li>"; //separate each menu item-jf
preserve4=stripper4;

if (counter4==0) //checks to see if this is the first writing -jf
{output=output+"<ul>";counter4=1; } //opens container -jf
}
////////
var sixthlvl = bananasplit[5];
if (sixthlvl!=undefined)
{
var stripper5 = sixthlvl.replace(/\s+/g, ''); //remove zeros from name
if(stripper5!=preserve5)
{
if(counter5==1){output=output+"</ul>";counter5=0;}//checks if we have been to sixthlvl if so close
if(counter6==1){output=output+"</ul>";counter6=0;}//checks if we have been to seventhlvl if so close
if(counter7==1){output=output+"</ul>";counter7=0;}//checks if we have been to eighthlvl if so close

	output=output+"<li><a href=\"/"+url+"\">"+sixthlvl+"</a></li>"; //separate each menu item-jf
preserve5=stripper5;

if (counter5==0) //checks to see if this is the first writing -jf
{output=output+"<ul>";counter5=1; } //opens container -jf
}
////////
var seventhlvl = bananasplit[6];
if (seventhlvl!=undefined)
{
var stripper6 = seventhlvl.replace(/\s+/g, ''); //remove zeros from name
if(stripper6!=preserve6)
{
if(counter6==1){output=output+"</ul>";counter6=0;}//checks if we have been to seventhlvl if so close
if(counter7==1){output=output+"</ul>";counter7=0;}//checks if we have been to eighthlvl if so close

	output=output+"<li><a href=\"/"+url+"\">"+seventhlvl+"</a></li>"; //separate each menu item-jf
preserve6=stripper6;

if (counter6==0) //checks to see if this is the first writing -jf
{output=output+"<ul>";counter6=1; } //opens container -jf
}
////////
var eighthlvl = bananasplit[7];
if (eighthlvl!=undefined)
{
var stripper7 = eighthlvl.replace(/\s+/g, ''); //remove zeros from name
if(stripper7!=preserve7)
{
if(counter7==1){output=output+"</ul>";counter7=0;}//checks if we have been to eighthlvl if so close

	output=output+"<li><a href=\"/"+url+"\">"+eighthlvl+"</a></li>"; //separate each menu item-jf
preserve7=stripper7;

if (counter7==0) //checks to see if this is the first writing -jf
{output=output+"<ul>";counter7=1; } //opens container -jf
}


}}}}}}}}
return true;
	});

output=output+"</div>";
response.write(output);

}