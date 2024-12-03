import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Todo } from '../modele/todo';

@Component({
  selector: 'app-menulist',
  templateUrl: './menulist.component.html',
  styleUrls: ['./menulist.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  standalone: true,

})
export class MenulistComponent  implements OnInit {

  constructor() { }

  

  ngOnInit() {
    this.loadTodos(); 
  }
  todos: Todo[] = []; 
  newTodoName: string = ''; 
  nextId: number = 1; 


  // dans le localstorage, temporairement on met les données 
  loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      this.todos = JSON.parse(storedTodos); 
    }
  }

  // Sauvegarder les to-dos dans Local Storage
  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
 

  // Ajouter une tâche
  addTodo() {
    if (this.newTodoName.trim()) {
      const newTodo: Todo = {
        id: this.nextId++,
        name: this.newTodoName.trim(),
        completed: false,
        createdAt: new Date(), 
      };

      this.todos.push(newTodo);
      this.newTodoName = ''; 
      this.saveTodos(); 

    }
  }

  // Supprimer une tâche
  deleteTodo(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.saveTodos(); 
  }

  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    this.saveTodos(); 
  }
}
