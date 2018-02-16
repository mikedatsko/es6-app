"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),Data=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"create",value:function(e,t){return e=e||prompt("Key:"),t=t||prompt("Data:"),void 0===e?(console.error("No key"),!1):void 0===t?(console.error("No data"),!1):void localStorage.setItem(e,t)}},{key:"read",value:function(e){return void 0===e?(console.error("No data"),!1):localStorage.getItem(e)||(console.error("No data"),!1)}},{key:"update",value:function(e,t){return e=e||prompt("Key:"),t=t||prompt("Data:"),void 0===e?(console.error("No key"),!1):void 0===t?(console.error("No data"),!1):localStorage.getItem(e)?void localStorage.setItem(e,t):(console.error("No data found"),!1)}},{key:"delete",value:function(e){return void 0===(e=e||prompt("Key:"))?(console.error("No key"),!1):localStorage.getItem(e)?void localStorage.removeItem(e):(console.error("No data found"),!1)}}]),e}(),data=new Data,Events=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"on",value:function(e,t,a){e.addEventListener(t,a,!1)}},{key:"subscribe",value:function(e,t){document.addEventListener(e,t,!1)}},{key:"send",value:function(e,t){t=t||{};var a=new CustomEvent(e,{detail:t});document.dispatchEvent(a)}},{key:"deleteEvent",value:function(){document.removeEventListener(eventName,callback,!1)}}]),e}(),events=new Events,Markup=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"create",value:function(e){var t={tag:"div",content:"",parent:"body",className:"",id:"",callback:void 0,attrs:[]};e=e||{};for(var a in t)e.hasOwnProperty(a)||(e[a]=t[a]);var n=void 0;if("input#checkbox"===e.tag?(n=document.createElement("input"),n.type="checkbox",n.value=1):n=document.createElement(e.tag),n.innerHTML=e.content,e.className&&(n.className+=e.className),e.id&&(n.id=e.id),"form"===e.tag&&(n.action="javascript:void(0)",n.method="post"),e.attrs.length&&e.attrs.forEach(function(e){for(var t in e)n[t]=e[t]}),e.parent){var o="string"==typeof e.parent?document.querySelector(e.parent):e.parent;if(!o)return console.error("No element found"),!1;o.appendChild(n)}else document.body.appendChild(n);return n}},{key:"update",value:function(e,t){this.find(e)[0].innerHTML=t}},{key:"delete",value:function(e){this.find(e)[0].remove()}},{key:"find",value:function(e){return document.querySelectorAll(e)}}]),e}(),markup=new Markup,Utils=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"getId",value:function(){for(var e="",t=0;t<6;t++)e+="abcdefghijklmnopqrstuvwxyz"[Math.floor(26*Math.random())];return e}}]),e}(),utils=new Utils,AddTodo=function(){function e(){var t=this;_classCallCheck(this,e);var a=markup.create({className:"row",parent:"#todo_add"}),n=markup.create({className:"col-lg-12",parent:a}),o=markup.create({tag:"form",attrs:[{action:"javascript:void(0)"},{method:"POST"}],parent:n}),r=markup.create({className:"input-group",parent:o}),c=markup.create({tag:"input",attrs:[{type:"text"},{placeholder:"Todo text..."}],className:"form-control",parent:r}),s=markup.create({tag:"span",className:"input-group-btn",parent:r}),i=markup.create({tag:"button",attrs:[{type:"submit"}],content:"Add",className:"btn btn-primary",parent:s});events.on(o,"submit",function(e){e.preventDefault(),t.add(o,c)}),events.subscribe("edit-todo-item",function(e){var a=e.detail;a.todo&&t.edit(o,c,i,a)})}return _createClass(e,[{key:"add",value:function(e,t){var a=data.read("todos");a?a=JSON.parse(a):(a=[],data.create("todos",JSON.stringify([]))),e.type&&"save"===e.type.value&&e.index?(a[+e.index.value].text=t.value,e.type.remove(),e.index.remove()):a.push({text:t.value,checked:!1}),data.update("todos",JSON.stringify(a)),e.reset(),events.send("get-todos-list")}},{key:"edit",value:function(e,t,a,n){e.type?e.type.value="save":markup.create({tag:"input",attrs:[{type:"hidden"},{name:"type"},{value:"save"}],className:"form-control",parent:e}),e.index?e.index.value=n.index:markup.create({tag:"input",attrs:[{type:"hidden"},{name:"index"},{value:n.index}],className:"form-control",parent:e}),a.innerHTML="Save",t.value=n.todo.text}}]),e}(),ListTodos=function(){function e(){var t=this;_classCallCheck(this,e);var a=data.read("todos");a||(a=[],data.update("todos",JSON.stringify(a))),events.subscribe("get-todos-list",function(){t.getList()})}return _createClass(e,[{key:"getList",value:function(){var e=this,t=data.read("todos");t=JSON.parse(t);var a=document.getElementById("todo_items");a.innerHTML="";var n=markup.create({tag:"tbody",parent:a});if(!t.length)return!1;t.forEach(function(a,o){var r=markup.create({tag:"tr",parent:n,className:a.checked?"success":""}),c=markup.create({tag:"td",parent:r,attrs:[{width:"30"}]}),s=markup.create({tag:"td",parent:r,content:a.text,className:a.checked?"checked":""}),i=markup.create({tag:"td",parent:r,attrs:[{width:"70"}]}),l=markup.create({tag:"span",className:"glyphicon glyphicon-"+(a.checked?"check":"unchecked"),parent:c}),u=markup.create({tag:"button",attrs:[{type:"button"}],className:"btn btn-info btn-xs",content:'<span class="glyphicon glyphicon-pencil"></span>',parent:i}),d=markup.create({tag:"button",attrs:[{type:"button"}],className:"btn btn-danger btn-xs",content:'<span class="glyphicon glyphicon-remove"></span>',parent:i});events.on(c,"click",function(n){n.preventDefault(),e.doCheck(r,l,s,t,a,o)}),events.on(s,"click",function(n){n.preventDefault(),e.doCheck(r,l,s,t,a,o)}),events.on(d,"click",function(a){e.delete(o,t)}),events.on(u,"click",function(e){events.send("edit-todo-item",{todo:a,index:o})})})}},{key:"doCheck",value:function(e,t,a,n,o,r){"glyphicon glyphicon-check"===t.className?(e.className="",t.className="glyphicon glyphicon-unchecked",a.className="",o.checked=!1):(e.className="success",t.className="glyphicon glyphicon-check",a.className="checked",o.checked=!0),n[r]=o,data.update("todos",JSON.stringify(n)),events.send("get-todos-list")}},{key:"delete",value:function(e,t){t.splice(e,1),data.update("todos",JSON.stringify(t)),events.send("get-todos-list")}}]),e}(),App=function e(){_classCallCheck(this,e),window.parent.postMessage("FRAME_LOADED",new URL(document.location.href).searchParams.get("host_url")||"http://jsmeasure.surge.sh");for(var t=[],a=0;a<1e3;a++)t.push({text:"Test",checked:!1});data.update("todos",JSON.stringify(t)),new AddTodo,(new ListTodos).getList()},app=new App;
//# sourceMappingURL=app-min.js.map
