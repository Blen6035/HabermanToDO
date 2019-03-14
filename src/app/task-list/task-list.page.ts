import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, NavController, IonItemSliding } from '@ionic/angular';
import { Task } from './task';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {

  taskList: AngularFireList<Task>;
  tasks: Observable<any[ ]>;
  
  constructor(
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public af: AngularFireDatabase) { 
      this.taskList = this.af.list('/tasks');
      this.tasks = this.taskList.valueChanges();

  }


  async addItem(){
    let addItem = await this.alertCtrl.create({
      header: 'Add a Task',
      message: 'Please enter a Task',
      inputs: [{
         name: 'title',
         type: 'text'
      }],
      buttons:[{
        text: 'Cancel',
        role: 'cancel'
      },{
        text: 'Add Task',
        handler: data => {
          let newTaskRef = this.taskList.push(
            { id: '', title: data.title, status: 'open' }
            );
            newTaskRef.update( { id: newTaskRef.key } );
            toast.present();
          
        }
      }]
    })

    let toast = await this.toastCtrl.create({
      message: "Task Added!",
      duration: 2000,
      showCloseButton: false,
      color: 'dark'
    });

    await addItem.present();
  }

  markAsDone(task: Task) {
    task.status= "done",
    this.taskList.update( task.id, task );
  }

  removeTask(slidingItem: IonItemSliding, task: Task) {
    this.taskList.remove( task.id );
  }

  ngOnInit() {
  }

}


