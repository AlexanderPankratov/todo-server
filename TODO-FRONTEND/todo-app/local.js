export function getTodoListLocal(owner) {
   const todoListString =  localStorage.getItem(owner);
    const todoList = JSON.parse(todoListString);
    return todoList;
} 

export function setTodoListLocal(owner) {
    
}