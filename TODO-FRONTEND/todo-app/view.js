
//  создаем и возвращаем заголовок приложения
function createAppTitle(title) {
    const appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
}

//  создаем и возвращаем форму для создания дела
function createTodoItemForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const buttonWrapper = document.createElement('div');
    const button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
        form,
        input,
        button
    }
}

//  создаем и возвращаем элементов
function createTodoList() {
    const list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
}

function createTodoItemElement(todoItem, { onDoneClick, onDeleteClick }) {
    const doneClass = 'list-group-item-success';

    const item = document.createElement('li');
    //  кнопки помещаем в элемент, который красиво покажет их в одной группе
    const buttonGroup = document.createElement('div');
    const doneButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    if (todoItem.done) {
        item.classList.add(doneClass);
    }
    item.textContent = todoItem.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    doneButton.addEventListener('click', () => {
        onDoneClick({ todoItem, element: item });
        item.classList.toggle(doneClass, todoItem.done);
    })
    deleteButton.addEventListener('click', () => {
        onDeleteClick({ todoItem, element: item });
    })

    return item;

}

async function createTodoApp(container, 
    { title, 
    owner,
    todoItemList = [],
    onCreateFormSubmit,
    onDoneClick,
    onDeleteClick,
 }) {
    const todoAppTitle = createAppTitle(title);
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList();
    const handlers = { onDoneClick, onDeleteClick };

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoItemList.forEach(todoItem => {
        const todoItemElement = createTodoItemElement(todoItem, handlers)
        todoList.append(todoItemElement);
    })

    todoItemForm.form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!todoItemForm.input.value) {
            return;
        }

        const todoItem = await onCreateFormSubmit({
            owner,
            name: todoItemForm.input.value.trim(),
        });

        const todoItemElement = createTodoItemElement(todoItem, handlers);
        console.log(todoItem);

        todoList.append(todoItemElement);

        todoItemForm.input.value = '';
    })
}

export { createTodoApp };