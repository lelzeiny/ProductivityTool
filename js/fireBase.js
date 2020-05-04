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

function save_data() {
  var workspace_key = find_workspace();
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
	var updates = {};
	updates[task_url + task_id] = data;
	firebase.database().ref().update(updates);
}

function find_workspace(){
  var title = document.getElementById('task_workspace').value;
  return title;
}

// create the task cards by reading the database
function print_data() {
  var user_ref = firebase.database().ref('/users/'+ localStorage.getItem("uid") +'/workspaces/');
  var container = document.getElementById("task-list");
  user_ref.once('value', function (workspace_snapshot) {
    workspace_snapshot.forEach(function (child_workspace_snapshot) {
      var workspace_key = child_workspace_snapshot.key;
      var workspace_data = child_workspace_snapshot.val();

      var workspace_head = document.createElement("h3");
      workspace_head.innerText = workspace_data.title;
      container.appendChild(workspace_head);
      workspace_head.className = "workspace-head";
      var color = workspace_data.color;
      
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
      toggle_footer(num_active);
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