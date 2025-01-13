import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MenulistComponent } from './pages/todolist/todolist.component'
import { CategoryManagerComponent } from './components/category-manager/category-manager.component';
import { CreateTaskComponent } from './components/task-manager/task-manager.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { LoginPage } from './pages/login/login.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginPage },
  {path: "menu", component: MenulistComponent, canActivate: [AuthGuard]},
  { path: 'categories', component: CategoryManagerComponent, canActivate: [AuthGuard] },
  { path: 'create-task', component: CreateTaskComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
