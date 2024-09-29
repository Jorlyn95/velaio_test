import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  
  constructor() { }
  
  private globalState = new BehaviorSubject<Array<any>>([]);

  getState() {
    return this.globalState
  }

  // Método para actualizar el estado
  setState(newState: any) {
    this.globalState.next(newState);
    localStorage.setItem("data", JSON.stringify(newState))
  }

}
