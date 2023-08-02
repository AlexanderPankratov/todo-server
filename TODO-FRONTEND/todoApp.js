
(function () {
    async function markTodoAsDone(id) {
        const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ done: true })
        });
        const data = await response.json();
        console.log(data);
    }

    async function createTodoItem() {
        const response = await fetch('http://localhost:3000/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Сходить за хлебом',
                owner: 'Тимофей'
            })
        });
        const data = await response.json();
        return data;
    }

    function createAppTitle(title) {
        let appTitle = document.createElement("h2");
        appTitle.textContent = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement("form");
        let input = document.createElement("input");
        let buttonWrapper = document.createElement("div");
        let button = document.createElement("button");
        button.disabled = true;

        input.addEventListener("input", function () {
            button.disabled = false;
        });

        form.classList.add("input-group", "mb-3");
        input.classList.add("form-control");
        input.placeholder = "Введите название нового дела";
        buttonWrapper.classList.add("input-group-append");
        button.classList.add("btn", "btn-primary");
        button.textContent = "Добавить дело";

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button
        };
    }

    function createTodoList() {
        let list = document.createElement("ul");
        list.classList.add("list-group");
        return list;
    }

    function createTodoItemElement(todoItem, { onDone, onDelete }) {
        const doneClass = 'list-group-item-success';

        const item = document.createElement("li");
        const buttonGroup = document.createElement("div");
        const doneButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        item.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center"
        );
        if (todoItem.done) {
            item.classList.add(doneClass)
        }
        item.textContent = todoItem.name;

        buttonGroup.classList.add("btn-group", "btn-group-sm");
        doneButton.classList.add("btn", "btn-success");
        doneButton.textContent = "Готово";
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.textContent = "Удалить";

        doneButton.addEventListener("click", function () {
            onDone( { todoItem, element: item } );
            item.classList.toggle(doneClass, todoItem.done);
           
        });

        deleteButton.addEventListener("click", function () {
                onDelete( { todoItem, element: item } );
        });

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return item;
    }

    async function createTodoApp(container, title = "Список дел", owner) {
        const todoAppTitle = createAppTitle(title);
        const todoItemForm = createTodoItemForm();
        const todoList = createTodoList();
        const handlers = {
            onDone({todoItem}) {
                todoItem.done = !todoItem.done;
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({done: todoItem.done}),
                    headers: {
                        'Content-type': 'application/json',
                    }
                })
            },
            onDelete( { todoItem, element } ) {
                if (!confirm('Вы уверены?')) {
                    return;
                }
                element.remove();
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'DELETE',
                })
            }
        }
       

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
        const todoItemList = await response.json();

        // let todoItemListFilter = todoItemList.filter(todo => todo.owner === owner);

        todoItemList.forEach(todoItem => {
            const todoItemElement = createTodoItemElement(todoItem, handlers);
            todoList.append(todoItemElement)
        });

        todoItemForm.form.addEventListener("submit",  async e => {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            const response = await fetch('http://localhost:3000/api/todos', {
                method: 'POST',
                body: JSON.stringify({
                    name: todoItemForm.input.value.trim(),
                    owner,
                }),
                headers: {
                    'Content-type': 'application/json',
                }
            });
            const todoItem = await response.json();
            console.log(todoItem)

            const todoItemElement = createTodoItemElement(todoItem, handlers);

            todoList.append(todoItemElement);

            todoItemForm.input.value = "";
        });
    }


    function startingLoad() {
        let currentPage = window.location.pathname;
        if (currentPage === '/index.html') {
            createTodoApp(document.getElementById("todo-app"), 'Мои дела', 'my');
        }

        if (currentPage === '/mom.html') {
            createTodoApp(document.getElementById("todo-app"), 'Дела мамы', 'mom');
        }

        if (currentPage === '/dad.html') {
            createTodoApp(document.getElementById("todo-app"), 'Дела папы', 'dad');
        }
    }

    startingLoad()

})();
