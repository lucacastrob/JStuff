const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const taskContainer = document.getElementById("tasks-container");

let editStatus = false;

let idTask = '';

const saveTask = (title, description) =>
    db.collection("tasks").doc().set({
        title,
        description
    });

const getTasks = () => db.collection('tasks').get();

const updateTask = (id, updateTask) => db.collection('tasks').doc(id).update(updateTask);    

const getTask = (id) => db.collection('tasks').doc(id).get();

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
                    <button class="btn btn-secondary btn-edit" data-id="${task.id}">Edit</button>        
                </div>
            </div>`;
            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    await deleteTasks(e.target.dataset.id);
                });
            });
            
            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    const doc = await getTask(e.target.dataset.id);
                    console.log(doc.data());
                    idTask = doc.id;
                    editStatus = true;
                    const task = doc.data();
                    taskForm['task-title'].value = task.title;
                    taskForm['task-description'].value = task.description;
                    taskForm['btn-task-form'].innerText = 'Update'

                })
            })
        });
    });
});

taskForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const title = taskForm["task-title"];
    const description = taskForm["task-description"];
    if(!editStatus)
    {
        await saveTask(title.value, description.value);
    }
    else
    {
       await updateTask(idTask, {
           title: title.value,
           description: description.value
       });
       taskForm['btn-task-form'].innerText = 'Save'
       editStatus = false;
    }
    await getTasks();
    taskForm.reset();
    title.focus();
});

