const byId = function( id ) { return document.getElementById( id ); };
const dbc = byId('dialpad-btn-container');
 
byId("dialpad-box").style.bottom = "0px";
byId("dialpad-box").style.right = "30px";

let arr =[
    {title:"1",subtitle:"_"},{title:"2",subtitle:"ABC"},{title:"3",subtitle:"DEF"},{title:"4",subtitle:"GHI"},{title:"5",subtitle:"JKL"},{title:"6",subtitle:"MNO"},{title:"7",subtitle:"PQRS"},{title:"8",subtitle:"TUV"},{title:"9",subtitle:"WXYZ"},{title:"*",subtitle:"-"},{title:"0",subtitle:"+"},{title:"#",subtitle:"-"},
];

let cursorLocation=0,ind=-1;

arr.forEach(item => {
    ind++;
    dbc.innerHTML += 
    `<div class="dialbtn-wrapper">
        <div class="dialpad-btn flexCol centerRow centerCol" id="dialpad${ind}">
            <p class="title-text removeDefaultPara fontColor">${item.title}</p>
            <p class="subline-text removeDefaultPara fontColor">${item.subtitle}</p>
        </div>
    </div>`;
});

ind=-1;
setTimeout(()=>{
arr.forEach(item => {
   ind++;
    let current = byId("dialpad"+ind);
    current.onclick = function () {
        let di = byId('dialpad-input'),val = di.value;
        di.selectionStart = cursorLocation;
        di.value = val.slice(0, cursorLocation) + item.title + val.slice(cursorLocation,val.length);
        cursorLocation++;
        handleFocus(di.value.slice(0,cursorLocation));
        handleUpdateFocusDialer()

    }
});
},500);


dbc.innerHTML += 
    `<div class="dialbtn-wrapper">
        <div class="dialpad-btn dialpad-btn-empty flexCol centerRow centerCol">
            <p class="title-text removeDefaultPara fontColor"></p>
            <p class="subline-text removeDefaultPara fontColor"></p>
        </div>
    </div>`;

dbc.innerHTML += 
    `<div class="dialbtn-wrapper">
        <div class="dialpad-btn-caller backgroundGreen flexCol centerRow centerCol" id="dialpad-caller-btn">
            <img class='dialpad-btn-caller-icon' src="./media/phone.png"/>
        </div>
    </div>`;

byId('dialpad-input').addEventListener('click',function(event){
    cursorLocation = byId('dialpad-input').selectionStart;
})

byId('dialpad-input-btn-backspace').addEventListener('click',function (event){
    event.preventDefault();
    if(cursorLocation<=0)
        return;
    let di = byId('dialpad-input');
    let val = di.value;
    di.selectionStart = cursorLocation;
    let begin = val.slice(0,cursorLocation-1);
    let end = val.slice(cursorLocation,val.length);
    di.value = begin + end;
    if(cursorLocation>0)
        cursorLocation--;
    handleFocus(di.value.slice(0,cursorLocation));
    handleUpdateFocusDialer();
});


function handleFocus(str){
    let focusWidth = getWidthOfText(str,'Courier New',"25px");
    byId('dialpad-input').scrollLeft = focusWidth;
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

byId('dialpad-input').addEventListener('input',()=>{ 
    handleUpdateFocusDialer();
})

byId('number-area').addEventListener('input',()=>{ 
    handleUpdateFocusParent();
})

function handleUpdateFocusDialer(){
    byId('number-area').value = byId('dialpad-input').value;
}

function handleUpdateFocusParent(){
    byId('dialpad-input').value = byId('number-area').value;
}

dragElement(byId("dialpad-box"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (byId(elmnt.id + "-header")) {
    byId(elmnt.id + "-header").onmousedown = dragMouseDown;
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


