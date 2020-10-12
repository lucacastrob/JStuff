const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const taskContainer = document.getElementById("tasks-container");

const saveTask = (title, description) =>
    db.collection("tasks").doc().set({
        title,
        description
    });

const getTasks = () => db.collection('tasks').get();

const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);

const deleteTasks = id => db.collection('tasks').doc(id).delete();

window.addEventListener('DOMContentLoaded' , async(e) => {
    onGetTasks(querySnapshot => {
        taskContainer.innerHTML = "";
        querySnapshot.forEach(doc =>{
            console.log(doc.data());

            const task = doc.data();
            task.id = doc.id;
            taskContainer.innerHTML += 
            `<div class="card card-body mt-2 border-primary">
                <h3 class="h5">${task.title}</h3>
                <p>${task.description}</p>
                <div>   
                    <button class="btn btn-primary btn-delete" data-id="${task.id}">Delete</button>
                    <button class="btn btn-secondary">Edit</button>        
                </div>
            </div>`;
            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    await deleteTasks(e.target.dataset.id);
                });
            });
        });
    });
});

taskForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const title = taskForm["task-title"];
    const description = taskForm["task-description"];

    await saveTask(title.value, description.value);
    
    await getTasks();
    taskForm.reset();
    title.focus();
});

