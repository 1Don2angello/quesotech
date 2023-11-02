import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import id from 'date-fns/locale/id';
import { getApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { IonModal } from '@ionic/angular';
import { PDFDocument, rgb } from 'pdf-lib';
import JsBarcode from 'jsbarcode';
// import { File } from '@ionic-native/file';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {

  public async generateBarcode(queso: Queso): Promise<void> {
    
    // Genera un código de barras único basado en los datos del queso
    const barcodeData = `${queso.name}-${queso.datest}-${queso.lote}`;
    // Crea un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 150]);
    const { width, height } = page.getSize();
  
    // Agrega el código de barras al PDF
    JsBarcode(page, barcodeData, {
      format: 'CODE128',
      width: 2,
      height: 60,
      displayValue: false,
      margin: 0,
    });
  
    // Guarda el PDF
    const pdfBytes = await pdfDoc.save();
  
    // Crea una URL para mostrar el PDF en un visor
    const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
  
    // Abre el PDF en una nueva ventana o pestaña
    window.open(pdfUrl);
  }


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
        console.log('Registro seleccionado:', this.selectedQueso);
      });
    });    
  }
}

interface Queso{
  id: string;
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

