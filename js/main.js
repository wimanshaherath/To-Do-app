const today=document.getElementById("today");
const home=document.getElementById("home");
const howto=document.getElementById("Howto");
const datespan=document.getElementById("date");
const back=document.getElementsByClassName("back");

const TODAY=new Date();
const OPTIONS={weekday:"long",month:"short",day:"numeric",year:"numeric"};
datespan.innerHTML=TODAY.toLocaleDateString("en-US",OPTIONS);

function goToPage(element,element2)
{
    element.style.left=0+'%';
    element.classList.add("adding");
    
    
    console.log("done");

}

function returnBack(element)
{
    element.classList.remove("adding");
    element.style.left=100+"%";
}

document.getElementById("toToday").addEventListener("click",function(){
    goToPage(today,home);
});

document.getElementById("toHow").addEventListener("click",function(){
    goToPage(howto,home);
});

document.getElementById("todayBack").addEventListener("click",()=>{
    returnBack(today);
})


