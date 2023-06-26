import { Component, OnInit } from '@angular/core';
import {Employee} from './employee';
import {EmployeeService} from './services/employee.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Array<Employee> = []
  public emp!: Employee;
  public editEmployee?: Employee;
  public deleteEmployee?: Employee;

  public constructor(public employeeService: EmployeeService){}

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
     this.employeeService.getEmployees().subscribe({
      next: (data: Array<Employee>) =>{
        this.employees = data;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    })
  }

  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    button.type= "button";
    button.style.display="none";
    button.setAttribute("data-toggle", "modal");
    if(mode === "add"){
      this.emp = employee
      button.setAttribute("data-target", "#addEmployeeModal");
    }
    if(mode === "edit"){
      this.editEmployee = employee;
      button.setAttribute("data-target", "#updateEmployeeModal");
    }
    if(mode === "delete"){
      this.deleteEmployee = employee;
      button.setAttribute("data-target", "#deleteEmployeeModal");
    }
    container?.appendChild(button);
    button.click();
  }

  public onAddEmployee(addForm: NgForm): void {
    document.getElementById("add-employee-form")?.click();
    this.employeeService.addEmployee(addForm.value).subscribe({
      next: (data: Employee) => {
        console.log(data);
        this.getEmployees();
        addForm.reset();
      },
      error: (error: HttpErrorResponse)=>{
        alert(error.message);
        addForm.reset();
      }
    })
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe({
      next: (data: Employee) => {
        console.log(data);
        this.getEmployees();
      },
      error: (error: HttpErrorResponse)=>{
        alert(error.message);
      }
    })
  }


  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (data: void) => {
        console.log(data);
        this.getEmployees();
      },
      error: (error: HttpErrorResponse)=>{
        alert(error.message);
      }
    })
  }

  public searchEmployees(key: string): void {
    const results: Array<Employee> = [];
    for (const employee of this.employees) {
       if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
          employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
          employee.phoneNumber.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
          employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
    if(results.length === 0 || !key) {
      this.getEmployees()
    }
  }
}
