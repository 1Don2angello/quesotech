import { Component, NgZone, OnInit } from '@angular/core';
import id from 'date-fns/locale/id';
import { getApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  selectedQueso: Queso | null = null;
    isModalOpen = false;

  setOpen(queso: Queso) {
    this.selectedQueso = queso;
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  
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
        console.log(this.selectedQueso)
      });
    });    
  }
}

interface Queso{
  name: string;
  datest: string;
  dateen: string;
  lote: number;
  datep: string;
  peso: number;
  status: string;
  sale: number;
  ubi: string;
}
