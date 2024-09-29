import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './views/tasks/tasks.component';
import { CreateTaskComponent } from './views/create-task/create-task.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "task",
    pathMatch: "full"
  },
  {
    path:"task",
    component:TasksComponent
  },
  {
    path:"add",
    component:CreateTaskComponent
  },
  {
    path:"add/:id",
    component:CreateTaskComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
