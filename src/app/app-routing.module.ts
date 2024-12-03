import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MenulistComponent } from './menulist/menulist.component';
import { CategoryManagerComponent } from './category-manager/category-manager.component';
import { CreateTaskComponent } from './task-manager/task-manager.component';
import { AuthGuard } from './auth-guard.guard';
import { LoginPage } from './login/login.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
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
