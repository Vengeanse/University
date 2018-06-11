var request = "";
const youtubePrefix = "https://www.youtube.com/watch?v="
var key = 'AIzaSyDZvWpH4NBvelc9FzOAMnTTGUG005pCCus';
var itemArr = []; 
var adress = '';
var CurrentCount = 0;
var ItemCount = 20;
const maxSize = 310;
var elementwidth = 310;

var xcoorTo,xcoorFrom,speed;
var Trigger = false;
const slow = 1;
var End = false;
document.addEventListener('mousedown', mousedown, false);
document.addEventListener('mouseup', mouseup, false);
document.addEventListener('mousemove', mousemove, false);



/////////////////////////////////////////////////////////
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad() {
    gapi.client.setApiKey(key);
}
///////////////////////////////////////////////////
 
function BClick() {
    request = document.getElementById('request').value;
    if(request.length == 0)
    {
        alert('Пусто');
    }
    else
    {   
        adress = gapi.client.youtube.search.list(
        {
            part: 'snippet',
            q:request,
            maxResults: ItemCount
        }
        );
        adress.execute(Search);
    }
}

function Search(response) {
    itemsBlock = document.getElementById('item');
    itemContainer = document.getElementById('container');
    for (var i = CurrentCount; i < ItemCount; i++)
    {
        var element = document.createElement('div');
        element.className = 'block';
        itemsBlock.appendChild(element);
        itemArr.push(element);                  //element   

        var a = document.createElement('a');        
        a.setAttribute("href", youtubePrefix +response.result.items[i].id.videoId);
        a.setAttribute("target", "_blank");
        element.appendChild(a);                 //thref


        var img = document.createElement('img');    
        img.setAttribute("src",response.result.items[i].snippet.thumbnails.high.url);
        img.draggable = false;
        a.appendChild(img);                    //img to thref

        var h1 = document.createElement('h1');      
        var t = document.createTextNode(response.result.items[i].snippet.title);
        h1.appendChild(t);
        element.appendChild(h1);              //video name                   

        var h2 = document.createElement('h2');      
        var t = document.createTextNode(response.result.items[i].snippet.channelTitle);
        h2.appendChild(t);
        element.appendChild(h2);              //chanel name

        var p = document.createElement('p');        
        var t = document.createTextNode(response.result.items[i].snippet.description);
        p.appendChild(t);
        element.appendChild(p);              //description
    }
    GetNewSize();
}

/////////////////////////////////////////////////////////////////////////////////////////

function mousedown(evt)
{
    Trigger = true;
}

function mousemove(evt)
{
    xcoorTo =  evt.screenX;
    if (Trigger)
    {
        itemContainer.scrollLeft += xcoorFrom-xcoorTo;
        speed = xcoorFrom-xcoorTo;
    }
    xcoorFrom =  evt.screenX;
}

function mouseup(evt)
{
    Trigger = false;
    CalcSpeed();
}

////////////////////////////////////////////////////////

function GetNewSize()
{
    var scrollpoint = itemContainer.scrollLeft;                 
    var curretSeen = Math.floor((scrollpoint+2)/elementwidth);       
    var newWindowSize = document.getElementById('body').clientWidth;
    var targetOnScreen = Math.floor(newWindowSize/maxSize) + 1;      
    var targetBlockArraySize = targetOnScreen*maxSize;              
    var targetAndWindowDif = newWindowSize - targetBlockArraySize;
    var sizeCurrection = targetAndWindowDif / targetOnScreen;       
    var currectedSize = (maxSize + sizeCurrection -40)+'px';
    End = false;      
    for (var i = 0; i < itemArr.length; i++)                       
    {
        itemArr[i].style.width = currectedSize;
    }
    elementwidth = maxSize + sizeCurrection;
    itemContainer.scrollLeft = curretSeen*elementwidth;
}

function CalcSpeed()
{
    if ((!(Trigger))&&(Math.abs(speed) > 1))
    {
        itemContainer.scrollLeft += speed;
        if (speed > 0)
        {
            speed -= slow;
        }
        else 
        {
            speed += slow;
        }
        setTimeout(function() {CalcSpeed();}, 10)
    }
    else
    {
        if (Math.abs(speed) <= 1)
        {
           fixer();
        }
    }
    var scrollpoint = itemContainer.scrollLeft;
    var WindowSize = document.getElementById('body').clientWidth;
    if ((scrollpoint+WindowSize+50 > itemsBlock.clientWidth) && !(End))
    {
        End = true;
        CurrentCount = ItemCount;
        ItemCount = ItemCount + 10;
        BClick();
        alert("Загружаем новую 10-ку");
    }
}


function fixer() 
{
    var startX = itemContainer.scrollLeft % elementwidth 
    if(startX > (elementwidth / 2))                  
    {
        var targetX = elementwidth - startX;
    }
    else
    {
        var targetX = -startX;
    }
    var sqrTime2 = 2*targetX*slow;
    time = Math.sqrt(Math.abs(sqrTime2));
    tempSpeed = slow*time;
    if (targetX < 0)
    {
        speed = tempSpeed/(-1);
    }
    else
    {
        speed = tempSpeed;
    }
    setTimeout(function() {CalcSpeed();}, 10)
}

///////////////////////////////////////////////////////////
 
