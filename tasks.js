var taskInput=document.getElementById("new-task");//Add a new task.
var addButton=document.getElementById("justAdd");//Add Button
var incompleteTaskHolder=document.getElementById("incomplete-tasks");//ul of #incomplete-tasks
var value; //This makes the task globally available

//INDEXED DB 
var request = indexedDB.open("manager");
request.onupgradeneeded = function() {
  // The database did not previously exist, so create object stores and indexes.
  var db = request.result;
  var store = db.createObjectStore("tasks", {autoIncrement:true});
};

 // ADD TO INDEXED
var addTask=function(){
  db = request.result;
  var tx = db.transaction("tasks", "readwrite");
  var store = tx.objectStore("tasks");
  store.put(taskInput.value);
  taskInput.value="";
  displayUI();
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
        //button.delete
        var deleteButton=document.createElement("button");//delete button
        label.innerText=taskString;
        //Each elements, needs appending
        deleteButton.innerText="Delete";
        deleteButton.className="delete";
        deleteButton.id = key;
        deleteButton.onclick = function(){
          db = request.result;
          var tx = db.transaction("tasks", "readwrite");
          var store = tx.objectStore("tasks");
          var taskId = parseInt(deleteButton.id);
          store.delete(taskId);
          displayUI();
        }
        //and appending.
        listItem.appendChild(label);
        listItem.appendChild(deleteButton);
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
