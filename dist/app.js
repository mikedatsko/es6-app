
class Data {

  create(key, data) {
    key = key || prompt('Key:');
    data = data || prompt('Data:');

    if (typeof key === 'undefined') {
      console.error('No key');
      return false;
    }

    if (typeof data === 'undefined') {
      console.error('No data');
      return false;
    }

    localStorage.setItem(key, data);
  }

  read(key) {
    if (typeof key === 'undefined') {
      console.error('No data');
      return false;
    }

    const data = localStorage.getItem(key);

    if (!data) {
      console.error('No data');
      return false;
    }

    return data;
  }

  update(key, data) {
    key = key || prompt('Key:');
    data = data || prompt('Data:');

    if (typeof key === 'undefined') {
      console.error('No key');
      return false;
    }

    if (typeof data === 'undefined') {
      console.error('No data');
      return false;
    }

    if (!localStorage.getItem(key)) {
      console.error('No data found');
      return false;
    }

    localStorage.setItem(key, data);
  }

  delete(key) {
    key = key || prompt('Key:');

    if (typeof key === 'undefined') {
      console.error('No key');
      return false;
    }

    if (!localStorage.getItem(key)) {
      console.error('No data found');
      return false;
    }

    localStorage.removeItem(key);
  }
}

const data = new Data();

class Events {

  on(element, eventName, callback) {
    element.addEventListener(eventName, callback, false);
  }

  subscribe(eventName, callback) {
    document.addEventListener(eventName, callback, false);
  }

  send(eventName, details) {
    details = details || {};

    const event = new CustomEvent(eventName, {
      detail: details
    });

    document.dispatchEvent(event);
  }

  deleteEvent() {
    document.removeEventListener(eventName, callback, false);
  }
}

const events = new Events();

class Markup {

  create(options) {
    // tag
    // content
    // parent
    // className
    // id
    // callback

    const optionsDefault = {
      tag: 'div',
      content: '',
      parent: 'body',
      className: '',
      id: '',
      callback: undefined,
      attrs: []
    };

    options = options || {};

    for(let i in optionsDefault) {
      if (!options.hasOwnProperty(i)) {
        options[i] = optionsDefault[i];
      }
    }

    let element;

    if (options.tag === 'input#checkbox') {
      element = document.createElement('input');
      element.type = 'checkbox';
      element.value = 1;
    } else {
      element = document.createElement(options.tag);
    }

    element.innerHTML = options.content;

    if (options.className) {
      element.className += options.className;
    }

    if (options.id) {
      element.id = options.id;
    }

    if (options.tag === 'form') {
      element.action = 'javascript:void(0)';
      element.method = 'post';
    }

    if (options.attrs.length) {
      options.attrs.forEach(attr => {
        for (const name in attr) {
          switch (name) {
            default:
              element[name] = attr[name];
              break;
          }
        }
      });
    }

    if (options.parent) {
      const prnt = typeof options.parent === 'string'
        ? document.querySelector(options.parent)
        : options.parent;

      if (!prnt) {
        console.error('No element found');
        return false;
      }
      prnt.appendChild(element);
    } else {
      document.body.appendChild(element);
    }
    return element;
  }

  update(query, content) {
    const elements = this.find(query);
    elements[0].innerHTML = content;
  }

  delete(query) {
    const elements = this.find(query);
    elements[0].remove();
  }

  find(query) {
    const elements = document.querySelectorAll(query);
    return elements;
  }
}

const markup = new Markup();


class Utils {

  getId() {
    let letters = 'abcdefghijklmnopqrstuvwxyz';
    let id = '';
    for (let i = 0; i < 6; i++ ) {
      id += letters[Math.floor(Math.random() * 26)];
    }
    return id;
  }
}

const utils = new Utils();

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


class App {
  constructor() {
    // var todos = data.read('todos');
    const todos = [];

    for (let i = 0; i < 1000; i++) {
      todos.push({
        text: 'Test',
        checked: false
      });
    }

    data.update('todos', JSON.stringify(todos));

    const addTodo = new AddTodo();
    const listTodos = new ListTodos();
    listTodos.getList();
    window.parent.postMessage('FRAME_LOADED','http://localhost:3000');
  }
}


const app = new App();
