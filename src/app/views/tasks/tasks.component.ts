import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  constructor(
    private readonly formBuilder:FormBuilder,
    private readonly taskService:TasksService
  ){

   

  }

  formSearch=this.formBuilder.group({
    search:['', [Validators.required]]
  })

  arrayCols:Array<String>=['Item', 'Tarea', 'Fecha Limite','Total Peronas', 'Estado', 'Acciones']
  arrayData:Array<any>=[]
  tmpData:Array<any>=[]

  loadData(){
    this.taskService.getState().subscribe((e)=>{
      this.arrayData=e
      this.tmpData=e
      if(e.length==0){
        let local=localStorage.getItem('data')
        if(local!=null){
          this.arrayData=JSON.parse(local)
          this.tmpData=JSON.parse(local)
        }
      }
    })
  }

  changeStatus(index:number, event:any){
    let status=event.target.value
    this.arrayData[index].status=status
    this.taskService.setState(this.arrayData)
    alert("Tarea actualizada")
  }

  deleteTask(index:number){
    let data=this.arrayData.filter((item:any)=>item.id!=index)
    
    this.taskService.setState(data)
    alert("Tarea eliminada")
    this.loadData()
    this.formSearch.get("search")?.setValue('')
  }

  search(){
    let value=this.formSearch.get('search')?.value
    let data=this.arrayData.filter((item:any)=>{
      return String(item.name).toLowerCase().includes(String(value).toLowerCase())
    })

    if(value=="")data=this.arrayData

    this.tmpData=data

  }

  ngOnInit(): void {
    this.loadData()
  }
}
