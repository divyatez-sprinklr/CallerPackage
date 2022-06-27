

let dialpadBtnContainer = document.getElementById('dialpad-btn-container');


document.getElementById("dialpad-box").style.bottom = "0px";
document.getElementById("dialpad-box").style.right = "30px";



//console.log('Me runnig');
let arr =[
    {title:"1",subtitle:"_"},
    {title:"2",subtitle:"ABC"},
    {title:"3",subtitle:"DEF"},
    {title:"4",subtitle:"GHI"},
    {title:"5",subtitle:"JKL"},
    {title:"6",subtitle:"MNO"},
    {title:"7",subtitle:"PQRS"},
    {title:"8",subtitle:"TUV"},
    {title:"9",subtitle:"WXYZ"},
    {title:"*",subtitle:"-"},
    {title:"0",subtitle:"+"},
    {title:"#",subtitle:"-"},
];

let cursorLocation=0;
//console.log(arr);
let ind=-1;
arr.forEach(item => {
    ind++;
    dialpadBtnContainer.innerHTML += 
    `<div class="dialbtn-wrapper">
        <div class="dialpad-btn flexCol centerRow centerCol" id="dialpad${ind}">
            <p class="title-text removeDefaultPara fontColor">${item.title}</p>
            <p class="subline-text removeDefaultPara fontColor">${item.subtitle}</p>
        </div>
    </div>`;
    //console.log(ind);
});

ind=-1;
setTimeout(()=>{
arr.forEach(item => {
   ind++;
    let current = document.getElementById("dialpad"+ind);
    //console.log(current);
    current.onclick = function () {
        //console.log('clicked');
        let dialpadInput = document.getElementById('dialpad-input');
        let val = dialpadInput.value;
        //console.log("BEFORE "+dialpadInput.selectionStart);
        dialpadInput.selectionStart = cursorLocation;
        dialpadInput.value = val.slice(0, cursorLocation) + item.title + val.slice(cursorLocation,val.length);
        cursorLocation++;
        // if(dialpadInput.value.length===dialpadInput.selectionStart)
        // {
        //     dialpadInput.scrollLeft = dialpadInput.scrollWidth;
        // }
        handleFocus(dialpadInput.value.slice(0,cursorLocation));
        handleUpdateFocusDialer()

    }

    //console.log(ind);

});
},500);


dialpadBtnContainer.innerHTML += 
    `<div class="dialbtn-wrapper">
        <div class="dialpad-btn dialpad-btn-empty flexCol centerRow centerCol">
            <p class="title-text removeDefaultPara fontColor"></p>
            <p class="subline-text removeDefaultPara fontColor"></p>
        </div>
    </div>`;

dialpadBtnContainer.innerHTML += 
    `<div class="dialbtn-wrapper">
        <div class="dialpad-btn-caller backgroundGreen flexCol centerRow centerCol" id="dialpad-caller-btn">
            <img class='dialpad-btn-caller-icon' src="./media/phone.png"/>
        </div>
    </div>`;

document.getElementById('dialpad-input').addEventListener('click',function(event){
    let dialpadInput = document.getElementById('dialpad-input');
    console.log('updated cursoor location from '+cursorLocation + "to "+ dialpadInput.selectionStart );
    cursorLocation = dialpadInput.selectionStart;
})
document.getElementById('dialpad-input-btn-backspace').addEventListener('click',function (event){
    event.preventDefault();
    if(cursorLocation<=0)
        return;
    console.log('backspace');
    let dialpadInput = document.getElementById('dialpad-input');
    let val = dialpadInput.value;
    dialpadInput.selectionStart = cursorLocation;
    let begin = val.slice(0,cursorLocation-1);
    let end = val.slice(cursorLocation,val.length);
    dialpadInput.value = begin + end;
    if(cursorLocation>0)
        cursorLocation--;
    handleFocus(dialpadInput.value.slice(0,cursorLocation));
    handleUpdateFocusDialer();
});


function handleFocus(str){
    let focusWidth = getWidthOfText(str,'Courier New',"25px");
    console.log(focusWidth);
    let dialpadInput = document.getElementById('dialpad-input');
    dialpadInput.scrollLeft = focusWidth;
}

function getWidthOfText(txt, fontname, fontsize){
    if(getWidthOfText.c === undefined){
        getWidthOfText.c=document.createElement('canvas');
        getWidthOfText.ctx=getWidthOfText.c.getContext('2d');
    }
    var fontspec = fontsize + ' ' + fontname;
    if(getWidthOfText.ctx.font !== fontspec)
        getWidthOfText.ctx.font = fontspec;
    return getWidthOfText.ctx.measureText(txt).width;
}

document.getElementById('dialpad-input').addEventListener('input',()=>{ 
    handleUpdateFocusDialer();
})

document.getElementById('number-area').addEventListener('input',()=>{ 
    handleUpdateFocusParent();
})

function handleUpdateFocusDialer(){
    document.getElementById('number-area').value = document.getElementById('dialpad-input').value;
}

function handleUpdateFocusParent(){
    document.getElementById('dialpad-input').value = document.getElementById('number-area').value;
}

/////////Drag

dragElement(document.getElementById("dialpad-box"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "-header")) {
    document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    //console.log(window.innerWidth,elmnt.offsetLeft - pos1);
    elmnt.style.bottom = '0px';
    if(elmnt.offsetLeft - pos1<0)
        elmnt.style.left=0;
    else if(elmnt.offsetLeft - pos1>window.innerWidth-300)
        elmnt.style.right=0;
    else
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}