var taskInput=document.getElementById("new-task");//Add a new task.
var addButton=document.getElementById("justAdd");//Add Button
var incompleteTaskHolder=document.getElementById("incomplete-tasks");//ul of #incomplete-tasks
var value; //This makes the task globally available
var reminderTime;

//INDEXED DB 
var request = indexedDB.open("manager");
request.onupgradeneeded = function() {
  // The database did not previously exist, so create object stores and indexes.
  var db = request.result;
  var store = db.createObjectStore("tasks", {autoIncrement:true});
};

 // ADD TO INDEXED
var addTask = function(){
  if (taskInput.value == "") {
    window.alert("Sorry. You cannot add an empty task.");
  }else{
  db = request.result;
  var tx = db.transaction("tasks", "readwrite");
  var store = tx.objectStore("tasks");
  store.put(taskInput.value);
  taskInput.value = "";
  displayUI();
  }
}

//FUNCTION TO DISPLAY UI
var displayUI = function(){
  db = request.result;
  var tx = db.transaction("tasks", "readwrite");
  var store = tx.objectStore("tasks");

  incompleteTaskHolder.innerHTML = "";
  let dbTasks = store.openCursor();
  // called for each task found by the cursor
  dbTasks.onsuccess = function() {
    let cursor = dbTasks.result;
    if (cursor) {
      var key = cursor.key; // task key (id field)
      value = cursor.value; // task object
      //New task list item
      var createNewTaskElement=function(taskString){
        var listItem=document.createElement("li");
        //label
        var label=document.createElement("label");//label
        label.innerText=taskString;

        let reminder = document.createElement("label");
        reminder.innerText = "Reminder not set";
        let reminderButton = document.createElement("Button");
        reminderButton.className = "enable";
        reminderButton.textContent = "Enable";
        let reminderFunction;
                 
        reminderButton.onclick = function(){
          if(reminderButton.textContent == "Enable"){ 
            let promptReminderTime = prompt("Set the minutes for the reminder", "0");
            reminderTime = parseInt(promptReminderTime, "10");
            reminder.innerText = `Reminder set for ${reminderTime} Mins`;

            reminderFunction = window.setInterval(function(){
              reminderTime--;
              reminder.innerText = `Reminder set for ${reminderTime} Mins`;
              if(reminderTime <= 0){
                console.log("This is cool");
                window.clearInterval(reminderFunction);
                reminder.innerText = `Do this task now`;
                alert.play();
                window.alert("Hey, you've got important task to complete");
              }
            }, 60000);
            reminderButton.textContent = "Disable";
            
          }else{
            reminder.innerText = "Reminder not set";
            reminderButton.textContent = "Enable";
            window.clearInterval(reminderFunction);    
          }
        }

        var deleteButton=document.createElement("button");//delete button
        //Each elements, needs appending
        deleteButton.innerText="Delete";
        deleteButton.className="delete";
        deleteButton.id = key;
        deleteButton.onclick = function(){
          if (window.confirm("Are you sure you want to delete this task?")) {
            db = request.result;
            var tx = db.transaction("tasks", "readwrite");
            var store = tx.objectStore("tasks");
            var taskId = parseInt(deleteButton.id);
            store.delete(taskId);
            displayUI();
          }else{
            return;
          }
        }
        //and appending.
        listItem.appendChild(label);
        listItem.appendChild(deleteButton);
        listItem.appendChild(reminder);
        listItem.appendChild(reminderButton);
        return listItem;
      }

      //Create a new list item with the text from the #new-task:
      var listItem=createNewTaskElement(value);
      //Append listItem to incompleteTaskHolder
      incompleteTaskHolder.appendChild(listItem);
      cursor.continue();
    }else {
      tx.oncomplete = function() {
        return;
      };
    } 
  };
}

//Set the click handler to the addTask function.
addButton.addEventListener("click",addTask);
