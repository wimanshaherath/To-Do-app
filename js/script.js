const INPUT=document.getElementById("input");
var tasks=document.getElementById("tasks");
var task=document.getElementsByClassName("task");

var LIST=[];

function addTasks(todo,id,isdone)
{
    var text=`<li class="task ${isdone}" id=${id}>${todo}</li>`;

    tasks.insertAdjacentHTML("beforeend",text);
}

/***********************************
 * *********swip event**********
 ******************************* */
function deleteFormList(elementid)
{
    for(let i=0;i<LIST.length;i++)
    {
        if(LIST[i].id==elementid)
        {
            if(i==0)
            {
                LIST.shift();
            }
            LIST.splice(i,i);
            break;
        }
    }
    localStorage.clear();
    localStorage.setItem("ToDo",JSON.stringify(LIST));
    document.getElementById(elementid).remove();
}
function getCurrentMargin(element)
{
    var currentMargin=element.style.marginLeft;
    if(currentMargin.indexOf("px")>-1)
    {
        currentMargin=currentMargin.split("px")[0];
        currentMarginPresentage=(currentMargin/element.offsetWidth)*100;
        currentMargin=currentMarginPresentage;
    }
    else if(currentMargin.indexOf("%"))
    {
        currentMargin=currentMargin.split("%")[0];
    }
    else{
        currentMargin=0;
    }

    return parseInt(currentMargin);
}

function swiping(elementId,swipeRight,swipeIn)
{
    var element=document.getElementById(elementId);
    function swipeElementRight()
    {
        var currentMargin=getCurrentMargin(element);
        currentMargin=swipeRight?currentMargin+=1:currentMargin-=1;

        element.style.marginLeft=currentMargin+"%";
        if(currentMargin==100|currentMargin==-100)
        {
            clearInterval(interval);

            swipeRight?addToCompletedItems(element):deleteFormList(elementId);
        }

    }
    function swipeElementIn()
    {
        var currentMargin=getCurrentMargin(element);
        currentMargin-=1;

        element.style.marginLeft=currentMargin+"%";
        
        if(currentMargin==margin.split('%')[0]){clearInterval(interval);}
    }

    var interval=swipeIn?setInterval(swipeElementIn,5):setInterval(swipeElementRight,5);
}

function addToCompletedItems(element)
{
    element.classList.remove("completing");
    element.classList.add("completed");

    LIST.forEach(function(item)
    {
        if(item.id==element.id)
        {
            
            item.isDone=true;
            
        }
        
    });
    localStorage.clear();
    localStorage.setItem("ToDo",JSON.stringify(LIST));
    swiping(element.id,false,true);
}

var handleMouseMove=function(event){
    if(cursorXPosition===0){cursorXPosition=event.x;}

    cursorXPositionDiff=event.x-cursorXPosition;
    event.target.style.marginLeft=cursorXPositionDiff+"px";

    var istaskCompleted=!(event.target.className.indexOf("completed")>-1);

    if(cursorXPositionDiff>40 && istaskCompleted)
    {
        event.target.classList.add("completing");
    }
    else if(cursorXPositionDiff<-40)
    {
        event.target.classList.add("deleting");
    }
    else{
        event.target.classList.remove("completing");
        event.target.classList.remove("deleting");
    }
}

var handleTouchMove=function(event)
{
    if(cursorXPosition===0){cursorXPosition=event.touches[0].clientX;}

    cursorXPositionDiff=event.touches[0].clientX-cursorXPosition;
    event.target.style.marginLeft=cursorXPositionDiff+"px";
    var istaskCompleted=!(event.target.className.indexOf("completed")>-1);

    if(cursorXPositionDiff>40 && istaskCompleted)
    {
        event.target.classList.add("completing");
    }
    else if(cursorXPositionDiff<-40)
    {
        event.target.classList.add("deleting");
    }
    else{
        event.target.classList.remove("completing");
        event.target.classList.remove("deleting");
    }
}


var handleMouseUp=function(event)
{
    var className=event.target.className;
    if(className.indexOf("completing")>-1)
    {
        swiping(event.target.id,true);
    }
    else if(className.indexOf("deleting")>-1)
    {
        swiping(event.target.id,false);
    }
    else
    {
        event.target.style.marginLeft = "";
    }

    
    this.removeEventListener("mousemove", handleMouseMove, false);
	addMouseDownEventListner();
}

var handleTouchEnd=function(event)
{
    var className=event.target.className;
    if(className.indexOf("completing")>-1)
    {
        swiping(event.target.id,true);
    }
    else if(className.indexOf("deleting")>-1)
    {
        swiping(event.target.id,false);
    }
    else
    {
        event.target.style.marginLeft = "";
    }
    this.removeEventListener("touchmove", handleTouchMove, false);
    addTouchStartEventListener();
    
}

function addMouseDownEventListner()
{
    cursorXPosition=0;
    cursorXPositionDiff=0;
    
    for(let i=0;i<task.length;i++)
    {
        task[i].addEventListener("mousedown",function(event){
            this.addEventListener("mousemove",handleMouseMove);
            this.addEventListener("mouseup",handleMouseUp);
        });
    }
}


function addTouchStartEventListener()
{
    cursorXPosition=0;
    cursorXPositionDiff=0;

    for(let i=0;i<task.length;i++)
    {
        task[i].addEventListener("touchstart",function(event){
            this.addEventListener("touchmove",handleTouchMove,false);
            this.addEventListener("touchend",handleTouchEnd,false);
        });
    }
}



/******************************
 ******INIT FUNCTION***********
 ***************************** */
let id=LIST.length;
let margin=2+'%';

let data=localStorage.getItem("ToDo");


if(data)
{
    LIST=JSON.parse(data);
    id=LIST.length;
    LIST.forEach(function(item)
    {
        (item.isDone==true)?addTasks(item.name,item.id,"completed"):addTasks(item.name,item.id,'');
    });
}
else
{
    LIST=[];
    id=LIST.length;
}
addMouseDownEventListner();
addTouchStartEventListener();

document.getElementById("clearbtn").addEventListener("click",function()
{
    localStorage.clear();
    location.reload();
});

document.getElementById("btn").addEventListener("click",function()
{
    
    var todo=INPUT.value;
    if(todo){
        addTasks(todo,id,false);

        LIST.push(
            {
                name:todo,
                id:id,
                isDone:false
            }
        );

        id++;
        localStorage.setItem("ToDo",JSON.stringify(LIST));
    }
    
    INPUT.value="";
    addTouchStartEventListener();
    addMouseDownEventListner();
});


 document.addEventListener("keyup",function(event)
 {
    if(event.keyCode==13)
    {        
        var todo=INPUT.value;
        if(todo)
        {
            addTasks(todo,id,false);

            LIST.push(
                {
                    name:todo,
                    id:id,
                    isDone:false
                }
            );
            id++;
            localStorage.setItem("ToDo",JSON.stringify(LIST));
        }
       
        
        INPUT.value="";
        addTouchStartEventListener();
        addMouseDownEventListner();
    }
    
 });


 var cursorXPosition=0;
var cursorXPositionDiff=0;