var app_fireBase = {};
(function () {
  // The web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAjsNe5ZFPKZwoQ-a86b62ed4leWql_9EQ",
    authDomain: "productivitytool-1fa16.firebaseapp.com",
    databaseURL: "https://productivitytool-1fa16.firebaseio.com",
    projectId: "productivitytool-1fa16",
    storageBucket: "productivitytool-1fa16.appspot.com",
    messagingSenderId: "255873667718",
    appId: "1:255873667718:web:84f8b3f33672a0f69f7707",
    measurementId: "G-H1WBKP9M53"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  localStorage.setItem("uid", "qqEQk2eyrM0Xzxhx2JSX");

  app_fireBase = firebase;
})()

// creates the options for the workspaces in the add task drop down
function create_options(){
  var workspace_ref = firebase.database().ref('/users/'+ localStorage.getItem("uid") +'/workspaces/');
  var container = document.getElementById("task_workspace");
  //if this function is being called for the second time
  if(container.childNodes.length > 5){
    container.removeChild(document.getElementsByClassName("workspace-option"));
  }

  // for each workspace, create an option to select in the dropdown
  workspace_ref.once('value', function (workspace_snapshot) {
    workspace_snapshot.forEach(function (child_workspace_snapshot) {
      var workspace_key = child_workspace_snapshot.key;
      var workspace_data = child_workspace_snapshot.val();

      var workspace_option = document.createElement("option");
      workspace_option.value = workspace_data.title;
      workspace_option.innerText = workspace_data.title;
      workspace_option.className = "workspace-option";
      container.appendChild(workspace_option);
    });
  });
}

// inside add task popup, called when user wants to create a new workspace
function create_workspace(){
  var container = document.getElementById("workspace-div");

  var workspace_new_name = document.createElement("input");
  workspace_new_name.placeholder = "Workplace Name";
  workspace_new_name.className = "workspace_new";
  container.appendChild(workspace_new_name);

  var workspace_new_color = document.createElement("select");
  var color_array = ["aquamarine", "bisque", "darkgray", "darkkhaki", "darkseagreen", "lavender", "lavenderblush", "lemonchiffon", "lightcyan", "lightblue", "lightgrey", "lightgreen", "lightsalmon", "lightpink", "lightsteelblue", "lightskyblue", "pink", "plum", "powderblue", "peachpuff", "palegreen", "paleturquoise"];
  for(i in color_array){
    var color_option = document.createElement("option");
    color_option.innerText = color_array[i];
    workspace_new_color.appendChild(color_option);
    color_option.style.backgroundColor = color_array[i];
    workspace_new_name.className = "workspace_new";
  }
  workspace_new_color.className = "workspace_new";
  container.appendChild(workspace_new_color);
}

// called by submit button by add task div
function save_data() {
  var workspace_key = document.getElementById('task_workspace').value;
  // create and define new workspace, pushes to Firebase
  if(workspace_key == "new"){
    workspace_key = document.getElementsByClassName("workspace_new")[0].value;
    var workspace_url = '/users/'+ localStorage.getItem("uid") +'/workspaces/' + workspace_key;
    var new_workspace = {
      title: document.getElementsByClassName("workspace_new")[0].value,
      color: document.getElementsByClassName("workspace_new")[1].value,
      tasks: {}
    }
    let updates = {};
    updates[workspace_url] = new_workspace;
    firebase.database().ref().update(updates);
  }
  var task_url = '/users/'+ localStorage.getItem("uid") +'/workspaces/' + workspace_key + '/tasks/';
  var task_id = firebase.database().ref(task_url).push().key;
  
	// creates and defines data object which will be pushed to Firebase
	var data = {
		title: document.getElementById('task_title').value,
		deadline: document.getElementById('task_deadline').value,
		category: document.getElementById('task_category').value,
		status: "inactive",
		runtime: 0,
    dailygoal: 0,
    id: task_id
	}
	// push to firebase
	let updates = {};
	updates[task_url + task_id] = data;
  firebase.database().ref().update(updates);
  toggle_add_task(false);
}

function toggle_add_task(is_open){
  if(is_open){
      document.getElementById("add-task").style.display = "block";
  }
  else{
      document.getElementById("add-task").style.display = "none";
  }
}

// create the task cards by reading the database
function print_data() {
  var user_ref = firebase.database().ref('/users/'+ localStorage.getItem("uid") +'/workspaces/');
  var container = document.getElementById("task-list");
  user_ref.once('value', function (workspace_snapshot) {
    workspace_snapshot.forEach(function (child_workspace_snapshot) {
      var workspace_key = child_workspace_snapshot.key;
      var workspace_data = child_workspace_snapshot.val();

      //create workspace titles for each workspace
      var workspace_head = document.createElement("h3");
      workspace_head.innerText = workspace_data.title;
      container.appendChild(workspace_head);
      workspace_head.className = "workspace-head";
      var color = workspace_data.color;
      
      // for each task that is not complete, create a card
      var task_ref = firebase.database().ref('/users/'+ localStorage.getItem("uid") +'/workspaces/' + workspace_key + '/tasks/');
      task_ref.on('value', function(task_snapshot) {
        task_snapshot.forEach(function (child_task_snapshot){
          var task_key = child_task_snapshot.key;
          var task_data = child_task_snapshot.val();
          var task_card;
          if(task_data.status != "completed"){
            task_card = create_card(task_data);
            container.appendChild(task_card);
            task_card.className = "task-card";
            task_card.style.backgroundColor = color;
          }
        });
      });
    });
  });
}

// Create HTML Elements
function create_card(task_data_){
  var task_card_ = document.createElement("div");

  var card_left = document.createElement("div");
  var task_category = document.createElement("h4");
  task_category.innerText = task_data_.category;
  card_left.appendChild(task_category);


  var task_title = document.createElement("h3");
  task_title.innerText = task_data_.title;
  card_left.appendChild(task_title);
  
  var task_deadline = document.createElement("h4");
  task_deadline.innerText = task_data_.deadline;
  card_left.appendChild(task_deadline);
  task_card_.appendChild(card_left);
  card_left.className = "task-card-left";

  var card_right = document.createElement("div");
  
  var checkbox = document.createElement("i");
  if (task_data_.status == "inactive"){
    //<i class="fas fa-square"></i>
    checkbox.className = "far fa-square";
  }
  else{
    //active
    checkbox.className = "fas fa-square";
  }
  //toggle the checkmark
  var task_footer = document.getElementById("task-footer");
  var num_active = 0;
  card_right.addEventListener("click", function () {
    if (task_data_.status == "active"){
      checkbox.className = "far fa-square";
      task_data_.status = "inactive";
      num_active--;
      toggle_footer(num_active); //toggling footer is old. will be changed to daily goals
    }
    else if(task_data_.status == "inactive"){
      task_data_.status = "active";
      checkbox.className = "far fa-check-square";
      num_active++;
      toggle_footer(num_active);
    }
  });
  card_right.className = "task-card-right";
  card_right.appendChild(checkbox);
  task_card_.appendChild(card_right);
  

  return task_card_;
}

function toggle_footer(num_active_){
  var footer = document.getElementById("task-footer");
  if(num_active_ > 0){
    footer.style.display = "flex";
    document.getElementById("num-checked").innerText = num_active_ + " tasks selected";
  }
  else{
    footer.style.display = "none";
  }
}

//add a daily goal old way
function toggle_goals(){
  var user_ref = firebase.database().ref('/users/'+ localStorage.getItem("uid") +'/workspaces/');
  var container = document.getElementById("active-tasks");
  user_ref.once('value', function (workspace_snapshot) {
    workspace_snapshot.forEach(function (child_workspace_snapshot) {
      // for each task that is now active, create a box, input with a number
      var task_ref = firebase.database().ref('/users/'+ localStorage.getItem("uid") +'/workspaces/' + child_workspace_snapshot.key + '/tasks/');
      task_ref.on('value', function(task_snapshot) {
        task_snapshot.forEach(function (child_task_snapshot){
          var task_key = child_task_snapshot.key;
          var task_data = child_task_snapshot.val();
          var set_active_task;
          if(task_data.status == "active"){
            set_active_task = document.createElement("div");
            var active_title = document.createElement("p");
            active_title.innerText = task_data.title;
            set_active_task.appendChild(active_title);
            var active_goal = document.createElement("select");
            active_goal.innerHTML = "<option value='0.25'>15 min</option><option value='0.5'>30 min</option><option value='0.75'>45 min</option><option value='1'>1 hr</option><option value='1.5'>1 hr 30 min</option><option value='2'>2 hr</option><option value='3'>3 hr</option><option value='4'>4 hr</option>";
            set_active_task.appendChild(active_goal);
            container.appendChild(set_active_task);
          }
        });
      });
    });
  });
  document.getElementById("add-daily-goal").style.display = "inline";
}

//Agenda:
// - same nav bar
// - list all active tasks
// - title, get current day of week and use as index in weeklygoals
// - play button on each task