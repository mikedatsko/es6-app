
class App {
  constructor() {
    window.parent.postMessage('FRAME_LOADED', (new URL(document.location.href)).searchParams.get('host_url') || 'http://jsmeasure.surge.sh');
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
  }
}
