
class ListTodos {

  constructor() {
    let todos = data.read('todos');
    if (!todos) {
      todos = [];
      data.update('todos', JSON.stringify(todos));
    }

    events.subscribe('get-todos-list', () => {
      this.getList();
    });
  }

  getList() {
    const self = this;
    let todos = data.read('todos');
    todos = JSON.parse(todos);

    const todosEl = document.getElementById('todo_items');
    todosEl.innerHTML = '';

    const todosBodyEl = markup.create({
      tag: 'tbody',
      parent: todosEl
    });

    if (!todos.length) {
      return false
    }

    todos.forEach((todo, index) => {
      const todoEl = markup.create({
        tag: 'tr',
        parent: todosBodyEl,
        className: todo.checked ? 'success' : ''
      });

      const todoCellCheckboxEl = markup.create({
        tag: 'td',
        parent: todoEl,
        attrs: [
          { width: '30' }
        ]
      });

      const todoCellTextEl = markup.create({
        tag: 'td',
        parent: todoEl,
        content: todo.text,
        className: todo.checked ? 'checked' : ''
      });

      const todoCellActionsEl = markup.create({
        tag: 'td',
        parent: todoEl,
        attrs: [
          { width: '70' }
        ]
      });

      const todoCheckboxEl = markup.create({
        tag: 'span',
        className: 'glyphicon glyphicon-' + (todo.checked ? 'check' : 'unchecked'),
        parent: todoCellCheckboxEl
      });

      const todoActionEditEl = markup.create({
        tag: 'button',
        attrs: [
          { type: 'button' }
        ],
        className: 'btn btn-info btn-xs',
        content: '<span class="glyphicon glyphicon-pencil"></span>',
        parent: todoCellActionsEl
      });

      const todoActionDeleteEl = markup.create({
        tag: 'button',
        attrs: [
          { type: 'button' }
        ],
        className: 'btn btn-danger btn-xs',
        content: '<span class="glyphicon glyphicon-remove"></span>',
        parent: todoCellActionsEl
      });

      events.on(todoCellCheckboxEl, 'click', event => {
        event.preventDefault();
        self.doCheck(todoEl, todoCheckboxEl, todoCellTextEl, todos, todo, index);
      });

      events.on(todoCellTextEl, 'click', event => {
        event.preventDefault();
        self.doCheck(todoEl, todoCheckboxEl, todoCellTextEl, todos, todo, index);
      });

      events.on(todoActionDeleteEl, 'click', event => {
        self.delete(index, todos);
      });

      events.on(todoActionEditEl, 'click', event => {
        events.send('edit-todo-item', {
          todo: todo,
          index: index
        });
      });
    });
  };

  doCheck(todoEl, todoCheckboxEl, todoCellTextEl, todos, todo, index) {
    const isChecked = todoCheckboxEl.className === 'glyphicon glyphicon-check'

    if (isChecked) {
      todoEl.className = '';
      todoCheckboxEl.className = 'glyphicon glyphicon-unchecked';
      todoCellTextEl.className = '';
      todo.checked = false;
    } else {
      todoEl.className = 'success';
      todoCheckboxEl.className = 'glyphicon glyphicon-check';
      todoCellTextEl.className = 'checked';
      todo.checked = true;
    }

    todos[index] = todo;
    data.update('todos', JSON.stringify(todos));
    events.send('get-todos-list');
  }

  delete(index, todos) {
    todos.splice(index, 1);
    data.update('todos', JSON.stringify(todos));
    events.send('get-todos-list');
  }
}
