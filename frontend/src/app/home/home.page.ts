import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  tasks: any = [];
  APIUrl = "http://localhost:3000"
  hasSubTasks: boolean = false;
  subTaskCount: number = 1;
  subTaskName: string = "";
  taskName: string = "";
  priority: string = "";
  isEditing: boolean = false;
  data: any
  subTaskNames: string[] = [];

  constructor(private http: HttpClient) { }

  showRecords() {
    this.http.get(this.APIUrl + "/showTodo").subscribe((data) => {
      this.tasks = data
    })
  }

  addRecord() {
    const formData = {
      name: this.taskName,
      priority: this.priority,
      subTasks: this.hasSubTasks ? this.subTaskNames : null
    }

    this.http.post(this.APIUrl + "/addTodo", formData).subscribe((data) => {
      alert(data)
      this.ngOnInit()
      this.taskName = ""
      this.priority = ""
      this.hasSubTasks = false
      this.subTaskCount = 1;
    })
  }

  deleteRecord(taskToDelete: any) {
    const options = {
      body: {
        name: taskToDelete
      }
    }
    this.http.delete(this.APIUrl + "/deleteTodo", options).subscribe((data) => {
      alert("One record Deleted")
      this.showRecords()
    })
  }


  editRecord(taskname: any) {


    this.http.get(this.APIUrl + "/getRecord/" + taskname).subscribe((data: any) => {
      this.taskName = data.name = data[0].name
      this.priority = data.priority = data[0].priority
      if (data[0].subTasks.length > 0) {
        this.subTaskCount = data[0].subTasks.length + 1
        this.hasSubTasks = true
        this.isEditing = true
      }
      this.subTaskNames = data.subTasks = data[0].subTasks
      console.log(data)
    })

  }

  updateRecord() {
    const formData = {
      name: this.taskName,
      priority: this.priority,
      subTasks: this.hasSubTasks ? this.subTaskNames : null
    };
  
    this.http.put(`${this.APIUrl}/updateTodo/`, formData).subscribe((data) => {
      alert(`Record updated successfully`);
      this.showRecords();
      this.resetForm();
    });
  }
   
  resetForm() {
    this.taskName = "";
    this.priority = "";
    this.hasSubTasks = false;
    this.subTaskCount = 1;
    this.subTaskNames = [];
    this.isEditing = false;
    this.data = null;
  }
  
  


  subTaskAdded() {
    this.subTaskCount++;
    this.subTaskNames.push(this.subTaskName);
    this.subTaskName = "";
  }

  ngOnInit() {
    this.showRecords()
  }

  checkFields() {
    return !this.taskName || !this.priority
  }
}
