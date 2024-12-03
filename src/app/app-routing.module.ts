import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MenulistComponent } from './menulist/menulist.component';
import { CategoryManagerComponent } from './category-manager/category-manager.component';
import { CreateTaskComponent } from './task-manager/task-manager.component';

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
  {path: "menu", component: MenulistComponent},
  { path: 'categories', component: CategoryManagerComponent },
  { path: 'create-task', component: CreateTaskComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
