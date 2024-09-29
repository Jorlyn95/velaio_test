import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly taskService: TasksService,
    private readonly router: Router,
    private readonly activeRouter: ActivatedRoute
  ) {

    this.taskService.getState().subscribe((e) => {
      this.allTask = e
      if (e.length == 0) {
        let local = localStorage.getItem('data')
        if (local != null) {
          this.allTask = JSON.parse(local)
        }
      }
    })

  }

  allTask: Array<any> = []
  tmpPerson: Array<any> = []
  showAddPerson: Boolean = false

  editing: Boolean = false
  idEditing: number = 0
  idTask: number = 0

  formPerson = this.formBuilder.group({
    name: ['', [Validators.required]],
    age: [0, [Validators.required]],
    habil: [''],
    arrayHabili: this.formBuilder.array([], [Validators.required])
  })

  formTask = this.formBuilder.group({
    name: ['', [Validators.required]],
    limite: ['', [Validators.required]],
    status: ['', [Validators.required]]
  })

  public showModalPerson() {
    this.showAddPerson = !this.showAddPerson
    this.formPerson.reset()
  }

  public addSkill(event: any) {

    if (event.key != "Enter") return;

    let { habil } = this.formPerson.getRawValue();

    if (String(habil).trim() == "" || habil == null) {
      return;
    };

    (this.formPerson.get('arrayHabili')?.value as Array<any>).push(this.formPerson.get('habil')?.value);

    this.formPerson.get('habil')?.setValue('');
  }

  public deleteSkill(index: number) {
    (this.formPerson.get('arrayHabili')?.value as Array<any>).splice(index, 1);
  }

  private validationAddPerson() {
    let { name, age } = this.formPerson.getRawValue()
    let array = this.formPerson.get('arrayHabili')?.value as Array<any>

    if (array.length == 0) {
      alert("Ingrese las habilidades para poder continuar")
      return false
    }

    if (String(name).trim().length <= 5) {
      alert("Ingrese el nombre comleto de la persona responsable para poder continuar")
      return false
    }

    if (String(age).trim() == "") {
      alert("Ingrese la edad responsable para poder continuar")
      return false
    }

    if (String(age).trim() == "") {
      alert("Ingrese la edad responsable para poder continuar")
      return false
    }

    if (Number(age) <= 18) {
      alert("La edad permitida para las actividades tienen que ser mayor a 18 años")
      return false
    }

    let valid=this.tmpPerson.filter((item:any)=>String(item.name).toLowerCase().includes(String(this.formPerson.get('name')?.value).trim()))

    if(valid.length>0){
      alert("Ya existe una persona con el mismo nombre")
      return false
    }

    return true
  }

  public addPerson() {

    if (!this.validationAddPerson()) {
      return
    }

    let { name, age } = this.formPerson.getRawValue()

    if (this.editing) this.tmpPerson.splice(this.idEditing, 1)

    let array = this.formPerson.get('arrayHabili')?.value as Array<any>

    this.tmpPerson.push({
      name,
      age,
      hability: array
    })

    this.formPerson.reset()
    alert("Persona agregada")
  }

  private validTask() {
    let { name, limite, status } = this.formTask.getRawValue()

    if (String(name).trim() == "") {
      alert("Ingrese el nombre de la tarea para poder continuar")
      return false
    }

    if (String(limite) == "") {
      alert("Ingrese la fecha limite de la tarea para poder continuar")
      return false
    }

    if (String(status) == "") {
      alert("Seleccione el estado para poder continuar")
      return false
    }

    if (this.tmpPerson.length == 0) {
      alert("Debe tener una persona asignada al menos para poder continuar")
      return false
    }

    return true

  }

  public saveTask() {

    if (!this.validTask()) return

    if (this.idTask > 0) {
      let newData = this.allTask.filter((item: any) => item.id != this.idTask)
      this.allTask = newData
    }

    let { name, limite, status } = this.formTask.getRawValue()

    this.allTask.push({
      id: this.allTask.length + 1,
      name,
      limite,
      status,
      persons: this.tmpPerson
    })
    this.taskService.setState(this.allTask)
    this.editing = false
    alert(this.idTask == 0 ? "Tarea creada" : "Tarea actualizada")
    this.router.navigate(['/task'])
  }

  public editPerson(item: any, index: number) {
    this.showAddPerson = true
    this.idEditing = index
    this.editing = true
    setTimeout(() => {
      let { name, age, hability } = item
      this.formPerson.get("name")?.setValue(name)
      this.formPerson.get("age")?.setValue(age);

      hability?.map((data: any) => {
        (this.formPerson.get('arrayHabili')?.value as Array<any>).push(data);
      })

    }, 200);
  }

  public closeModalPerson() {
    this.showAddPerson = !this.showAddPerson
    this.editing = false
  }

  public deletePerson(index: number) {
    this.tmpPerson.splice(index, 1)
  }

  ngOnInit(): void {
    this.idTask = Number(this.activeRouter.snapshot.paramMap.get('id'))
    if (this.idTask > 0) {
      let data = this.allTask.filter((item: any) => item.id == this.idTask)
      this.formTask.get("name")?.setValue(data[0].name);
      this.formTask.get("limite")?.setValue(data[0].limite);
      this.formTask.get("status")?.setValue(data[0].status);

      this.tmpPerson = data[0].persons
    }

  }

}
