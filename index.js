//    select element
const incometotalEl = document.querySelector(".income-total");
const outcometotalEl = document.querySelector(".outcome-total");
const balanceEl = document.querySelector(".balance  .value");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all ");

//   select buttons
const expenseBtn = document.querySelector(".tab2");
const incomeBtn = document.querySelector(".tab1");
const allBtn = document.querySelector(".tab3");
const expenseTitle = document.querySelector("#expense-title-input");
const expenseAmount= document.querySelector("#expense-amount-input");
const addExpense = document.querySelector(".add-expense")
//   select list
const incomeList= document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");
//  select input
const addIncome = document.querySelector(".add-income");
const incomeTitle = document.querySelector("#income-title-input");
const incomeAmount= document.querySelector("#income-amount-input");

// select chart element
const chartEl = document.querySelector(".chart");
 // create canvas element
 const canvas = document.createElement("canvas");
 canvas.width = 50;
 canvas.height = 50;
 // append canvas to chart element
 chartEl.appendChild(canvas);
 // to draw on canvas we need to get context of canvas
 const ctx = canvas.getContext("2d");
 // change the line width
 ctx.lineWidth = 8;
 // circle radius 
 const R = 20;
 function drawCircle(color,ratio,anticlockwise){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, R, 0, ratio * 2 * Math.PI, anticlockwise);
    ctx.stroke();
}
function updatechart(income,outcome){
    ctx.clearRect(0, 0, canvas.width ,canvas.height)
    let ratio = income/(income + outcome)
    drawCircle("#ffffff" ,-ratio ,true)
    drawCircle("orange" ,1 - ratio,false)
 }
 // show entry
function showEntry(list,type,title,amount,id){
    const entry = `<li id="${id}" class="${type} grid-container">
                     <div class="entry grid-item">${title}: ${amount} </div>
                     <div id="edit" class="grid-item">Edit</div>
                     <div id="delete" class="grid-item">Delete</div>
                   </li> `;
      const position = "afterbegin" ;
   list.insertAdjacentHTML(position,entry);
};
function updateuI(){

    income = calculatetotal("income",Entry_list)
    outcome = calculatetotal("expense",Entry_list)
    balance =  Math.abs(  calculatebalance(income,outcome));
    
    //determine sign of balance
    let sign = (income >= outcome) ? "$" : "-$"
    
   //update uI
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`
    incometotalEl.innerHTML = `<small>$</small>${income}`
    outcometotalEl.innerHTML = `<small>$</small>${outcome}`

    clearElement([incomeList,expenseList,allList]);
    Entry_list.forEach((entry,index) => {
        if(entry.type == "income"){
        showEntry(incomeList,entry.type,entry.title,entry.amount,index)
        }
        else if(entry.type == "expense"){
        showEntry(expenseList,entry.type,entry.title,entry.amount,index)
        }
        showEntry(allList,entry.type,entry.title,entry.amount,index)
    });

        updatechart(income,outcome);
        //localstorage
        localStorage.setItem("entrylist", JSON.stringify(Entry_list));
    } 
 //Entry list
 let Entry_list;
 let balance = 0, income = 0, outcome = 0 ;
 const EDIT = 'edit' , DELETE = "delete"
 // look if there is saved data in local storage
 Entry_list = JSON.parse(localStorage.getItem("entrylist") ) || [];
 updateuI();
 // event listeners
 expenseBtn.addEventListener("click",function(){
    active(expenseBtn)
    inactive([incomeBtn,allBtn])
    show(expenseEl)
    hide([incomeEl,allEl])
})
incomeBtn.addEventListener("click",function(){
    active(incomeBtn)
    inactive([expenseBtn,allBtn])
    show(incomeEl)
    hide([expenseEl,allEl])
})
allBtn.addEventListener("click",function(){
    active(allBtn);
    inactive([incomeBtn,expenseBtn]);
    show(allEl);
    hide([incomeEl,expenseEl]);
});
addIncome.addEventListener("click", function(){
    //if just one of the entry is empty => exit
    if( !incomeTitle.value || !incomeAmount.value )return;
    // save the entry to the Entrylist as an object
    let income =  {
       type : "income",
       title :  incomeTitle.value,
       amount: parseFloat(incomeAmount.value),
    }
    Entry_list.push(income);
    updateuI();
    clearInputs([incomeTitle,incomeAmount]);
});
addExpense.addEventListener("click", function(){
    // if just one of the input is empty=>
    if( !expenseTitle.value || !expenseAmount.value )return;
    // save the entry to entry list
    let expense =  {
       type : "expense",
       title :  expenseTitle.value,
       amount: parseFloat(expenseAmount.value),
    }
    Entry_list.push(expense);
    updateuI();
    clearInputs([expenseTitle,expenseAmount]);
});
incomeList.addEventListener("click",deleteOrEdit)
expenseList.addEventListener("click" , deleteOrEdit);
allList.addEventListener("click",deleteOrEdit)
//  functions
function show(element){
    element.classList.remove("hide");
}
function hide(elements){
    elements.forEach(element => {
      element.classList.add("hide");
    }); 
}
function active(element){
    element.classList.add("active");
}
function inactive(elements){
    elements.forEach(element => {
      element.classList.remove("active");
    }); 
}
function clearInputs(inputsArray){
    inputsArray.forEach(input => {
        input.value = "";
    });
}
function clearElement(elements){
    elements.forEach(element => {
        element.innerHTML = "";
    })
}
function calculatetotal(type,Entry_list){
    let sum = 0;   
    Entry_list.forEach( entry => {
        if(entry.type == type) {
            sum += entry.amount
        }
    });
    return sum;
}
function calculatebalance(income,outcome){
    return income - outcome;
};
 //balance sheet
 income = calculatetotal("income",Entry_list)
 outcome = calculatetotal("outcome",Entry_list)
 balance = calculatebalance(income,outcome)

  // deleteoredit
  function deleteOrEdit(event){
    const targetBtn = event.target;
    const entry = targetBtn.parentNode;

    if(targetBtn.id === DELETE){
        deleteEntry(entry)
    }else if(targetBtn.id ===EDIT){
        editEntry(entry)
    }
  };
   //delete entry
  function deleteEntry(entry){
    Entry_list.splice(entry.id,1);
    updateuI();
  };

  //edit entry
    function editEntry(entry){
        let Entry = Entry_list[entry.id];
        if(Entry.type === "income"){
            incomeAmount.value = Entry.amount;
            incomeTitle.value = Entry.title;
        }
        else if(Entry.type === "expense"){
            expenseAmount.value = Entry.amount;
            expenseTitle.value = Entry.title;
        }
        deleteEntry(entry);
    };
 


