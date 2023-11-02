import { Component, NgZone, OnInit } from '@angular/core';
import { getApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  public eventList: Queso[] = [];
  constructor(private zone: NgZone) { }

  ngOnInit() {
    const firebaseApp = getApp();
    const db = getFirestore(firebaseApp);
    const quesoCollection = collection(db, 'Inventario')

    onSnapshot(quesoCollection,snapshot => {
      this.zone.run(()=>{
        this.eventList = snapshot.docs.map((d: { data: () => any; }) => d.data());
        console.log(this.eventList);
      });
    });    
  }
}

interface Queso{
  name: string;
  datest: string;
  dateen: string;
}
