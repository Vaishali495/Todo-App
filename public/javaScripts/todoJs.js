const newTaskArea = document.getElementById("new-task-area");
const addBtn = document.getElementById("add-btn");
const editBtn = document.getElementById("edit-btn");
const toDoList = document.getElementById("to-do-list");
const tasks=[]

addBtn.addEventListener("click", (e) => {
  createNewTask(e);
});

function createNewTask(event) {
  if (!isEmpty()) {
    const newTaskObj = {
      task: newTaskArea.value,
      id: Date.now(),
      isCompleted: false,
    };

    fetch("/addtask", {
      //send the newTask to backend
      method: "POST",
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body:JSON.stringify(newTaskObj)
    })
    .then((response)=>{
        return response.json()      //or res.send(JSON.stringify(data));
      }).then((data)=>{
        toDoList.innerHTML += data.htmlData;    //+= operator appends data.htmlData to the existing HTML content inside toDoList
        newTaskArea.value = "";
    })
    .catch(error => {
      console.error("Error: ",error);
    })
  } else {
    alert("Add New task");
  }
}

function isEmpty() {
  if (newTaskArea.value.trim(" ") != "") return 0;
  return 1;
}


toDoList.addEventListener("click",(e) => {
  let target = e.target;
  if(target.classList.contains("task-edit-icon")){
    handleEditIcon(target);
  }
  else if(target.classList.contains("task-delete-icon")){
    handleDeleteIcon(target);
  }
  else if(target.classList.contains("complete-task")){
    handleCheckBox(target);
  }
})

function handleCheckBox(target){
    const task = target.parentElement;
    let taskId = task.id;
    let status = task.getAttribute("status");
    // const isCompleted = target.checked;  //  or use this true if checkbox is checked, false otherwise  

    let div = task.querySelector('.task');
    if(target.checked){
      // console.log("checked");
      div.classList.add("strike-through");
      // toDoList.append(task);
      status = true;
    }
    else{
      // console.log("unchecked");
      div.classList.remove("strike-through");
      status = false;
    }
    task.setAttribute("status", status);

    fetch("/checkBox/"+ taskId,{
      method:"PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({isCompleted:status})
    })
    .then((response)=>{
      return response.json();
    })  
    .then(data => {
      if (data.success) {
        console.log("success");
      }
    })
    .catch(error => {
      console.error("Error: ",error);
    })
}

function handleDeleteIcon(target){
  const task = target.parentElement;
  task.remove();
  newTaskArea.value = "";
  let taskId = task.id;
  fetch("/deleteTask/"+ taskId,{
    method: "DELETE",
    headers: {
        'Content-Type': 'application/json',
      },
  })
  .then((response)=>{
    return response.json();
  })  
  .then(data => {
    if (data.success) {
      console.log("success");
    }
  })
  .catch(error => {
    console.error("Error: ",error);
  })
}

function handleEditIcon(target){
    const task = target.parentElement;
    let taskId = task.id;
    let div = task.querySelector('.task');

    newTaskArea.value = div.textContent;
    addBtn.style.display = "none";
    editBtn.classList.remove("hidden");
    editBtn.addEventListener("click",(e) => {
        editTask(e,div,taskId);
    });
}

function editTask(event,div,taskId){
  div.textContent = newTaskArea.value;
  addBtn.style.display = "inline";
  editBtn.classList.add("hidden");
  newTaskArea.value = "";
  fetch("/editTask/"+ taskId,{
    method: "PATCH",
    headers: {
        'Content-Type': 'application/json',
      },
    body: JSON.stringify({task: div.textContent})
  })
  .then((response)=>{
    return response.json();
  })  
  .then(data => {
    if (data.success) {
      console.log("success");
    }
  })
  .catch(error => {
    console.error("Error: ",error);
  })
}

// const len=toDoList.getElementsByClassName("task-item").length;
// for(let i=0; i<len; i++){
//   console.log();
//   toDoList.getElementsByClassName("task-item")[i].querySelector(".task-edit-icon").addEventListener("click",(event)=>{
//     console.log(event.target.parentNode.remove());
//   })
// }

 // .then((res) => {
    //       //request for add data to dom
    //       console.log("second fetch req. gone");
    //       fetch("/newtask", {
    //         method: "GET",
    //         headers: {
    //           'Content-Type': 'application/json', // Specify the content type as JSON
    //         },
    //         body:JSON.stringify(newTaskObj),
    //       })
    //       newTaskArea.value = "";
    //       // .then((response)=>{
    //       //   response.json()      
    //       // })
    //       // .then((res) => {
    //       //   newTaskArea.value = "";
    //       // })
    //       // tasks.push(newTaskObj);
    //       // createTaskElement(newTaskObj);
    //   });