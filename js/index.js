function toggle_add_task(is_open){
    if(is_open){
        document.getElementById("add-task").style.display = "block";
        console.log(document.getElementById("add-task"));
    }
    else{
        document.getElementById("add-task").style.display = "none";
    }
}