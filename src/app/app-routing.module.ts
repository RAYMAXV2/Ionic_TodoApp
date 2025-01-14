import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TodolistComponent } from './pages/todolist/todolist.component';
import { CategoryManagerComponent } from './components/category-manager/category-manager.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { LoginPage } from './pages/login/login.component';
import { HomePage } from './pages/home/home.page';
import { CategoryGuard } from './guards/category-guard.guard';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { RegisterPage } from './pages/register/register.page';


export const routes: Routes = [
  { path: '', component: HomePage }, 
  { path: 'login', component: LoginPage }, 
  {
    path: 'todolist',
    component: TodolistComponent,
    canActivate: [AuthGuard], 
  },
  {
    path: 'categories',
    component: CategoryManagerComponent,
    canActivate: [AuthGuard], 
  },
  {
    path: 'create-task',
    component: CreateTaskComponent,
    canActivate: [AuthGuard, CategoryGuard], 
  },
  { path: 'register', component: RegisterPage }, 
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
