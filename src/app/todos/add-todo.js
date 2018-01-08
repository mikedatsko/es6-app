
class AddTodo {

  constructor() {
    const row = markup.create({
      className: 'row',
      parent: '#todo_add'
    });

    const cell = markup.create({
      className: 'col-lg-12',
      parent: row
    });
    
    const form = markup.create({
      tag: 'form',
      attrs: [
        { action: 'javascript:void(0)' },
        { method: 'POST' }
      ],
      parent: cell
    });
    
    const inputGroup = markup.create({
      className: 'input-group',
      parent: form
    });

    const addField = markup.create({
      tag: 'input',
      attrs: [
        { type: 'text' },
        { placeholder: 'Todo text...' }
      ],
      className: 'form-control',
      parent: inputGroup
    });

    const buttonGroup = markup.create({
      tag: 'span',
      className: 'input-group-btn',
      parent: inputGroup
    });

    const addButton = markup.create({
      tag: 'button',
      attrs: [
        { type: 'submit' }
      ],
      content: 'Add',
      className: 'btn btn-primary',
      parent: buttonGroup
    });

    events.on(form, 'submit', event => {
      event.preventDefault();
      this.add(form, addField);
    });

    events.subscribe('edit-todo-item', event => {
      var details = event.detail;

      if (!details.todo) { return }

      this.edit(form, addField, addButton, details);
    });
  }

  add(form, addField) {
    let todos = data.read('todos');

    if (!todos) {
      todos = [];
      data.create('todos', JSON.stringify([]));
    } else {
      todos = JSON.parse(todos);
    }

    if (form.type && form.type.value === 'save' && form.index) {
      todos[+form.index.value].text = addField.value;
      form.type.remove();
      form.index.remove();
    } else {
      todos.push({
        text: addField.value,
        checked: false
      });
    }

    data.update('todos', JSON.stringify(todos));

    form.reset();

    events.send('get-todos-list');
  }

  edit(form, addField, addButton, details) {
    if (!form.type) {
      var typeField = markup.create({
        tag: 'input',
        attrs: [
          { type: 'hidden' },
          { name: 'type' },
          { value: 'save' }
        ],
        className: 'form-control',
        parent: form
      });
    } else {
      form.type.value = 'save';
    }

    if (!form.index) {
      var indexField = markup.create({
        tag: 'input',
        attrs: [
          { type: 'hidden' },
          { name: 'index' },
          { value: details.index }
        ],
        className: 'form-control',
        parent: form
      });
    } else {
      form.index.value = details.index;
    }

    addButton.innerHTML = 'Save';
    addField.value = details.todo.text;
  }
}
