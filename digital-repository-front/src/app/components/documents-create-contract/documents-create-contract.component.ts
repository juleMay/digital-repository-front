import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CheckList } from 'src/app/class/models/CheckList';

import { DocumentsService } from 'src/app/services/documents.service';
import { ContractService } from 'src/app/services/contract.service';
import { ToastrService } from 'ngx-toastr';
import { responseDocument } from 'src/app/class/models/responseDocument';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogEditComponent } from '../dialog-edit/dialog-edit.component';
import { PdfViewerDialogComponent } from '../pdf-viewer-dialog/pdf-viewer-dialog.component';

import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Fila } from 'src/app/class/models/Fila';



@Component({
  selector: 'app-documents-create-contract',
  templateUrl: './documents-create-contract.component.html',
  styleUrls: ['./documents-create-contract.component.css']
})
export class DocumentsCreateContractComponent {

  acordeonAbierto = false;
  filas: any[] = [];
  doc: Fila = new Fila();
  checkList: CheckList[] = [];

  //cehcklist etapa precontractual
  subdirectory1: CheckList[] = [];
  subdirectory2: CheckList[] = [];
  subdirectory3: CheckList[] = [];
  pdfUrl = '';
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private contrSv: ContractService,
    private documentSv: DocumentsService,
    private elementRef: ElementRef,
    private toastrSvc: ToastrService
  ) {}




  ngOnInit() {

    this.loadCheckList();


  }
  async loadCheckList() {
    this.documentSv.getCheckList(1) // after to delete la linea anterior
      .subscribe((response) => {
        console.log('Del servicio ', response);

        this.checkList = response.data as CheckList[];
        console.log(this.checkList);
        this.LoadSubdirectorys();
      });


  }
  agregarFila() {
    const nuevaFila = {
      documento: 'Documento',
      invitacion: 'Invitación',
      fecha: 'Fecha',
    };
    this.filas.push(nuevaFila);
    this.acordeonAbierto = false;
    setTimeout(() => {
      this.acordeonAbierto = true;
    }, 0);
  }

  public LoadSubdirectorys() {
    for (const item of this.checkList) {
      const subdirectory = item.subdirectory;

      item.filas = [];
      if (subdirectory === '0') {
        this.subdirectory1.push(item);
      } else if (subdirectory === '1') {
        this.subdirectory2.push(item);
      } else if (subdirectory === '2') {
        this.subdirectory3.push(item);
      }
    }

    console.log(this.subdirectory1)
  }

  abrirVentanaEmergente(subdirectory:number,indice:number) {

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '800px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Aquí puedes realizar acciones después de cerrar el diálogo, si es necesario
      let elementoChecklist;
      this.doc = result;
      if (subdirectory === 0) {
        console.log("Añadiendo doc a ",this.subdirectory1[indice].contractualDocumentType.name)
        this.subdirectory1[indice].filas.push(this.doc);
      } else if (subdirectory === 1) {
        this.subdirectory2[indice].filas.push(this.doc);
      } else if (subdirectory === 2) {
        this.subdirectory3[indice].filas.push(this.doc);
      }


      //this.filas.push(this.doc);
      console.log('filas ', this.filas);
    });
  }

  //Dialog Edit Document
  abrirVentanaEmergenteEdit(i: number) {
    const dialogRef = this.dialog.open(DialogEditComponent, {
      width: '800px', // ancho deseado
      height: '600px', // altura deseada
      data: {
        Object: this.filas[i],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Diálogo cerrado');
    });
  }

  // openPdfViewerDialog(i: number) {
  openPdfViewerDialog(fila: Fila) {
    this.pdfUrl = fila.url;
    console.log(this.pdfUrl);
    const dialogRef = this.dialog.open(PdfViewerDialogComponent, {
      width: '800px',
      height: '600px',
      data: { pdfUrl: this.pdfUrl },
    });
  }

  openDialog(indice: number, filas:Fila[]): void {
    const dialogRef = this.dialog.open(DialogAnimation, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Si') {
        this.eliminarItem(indice, filas);

      }
    });
  }
  eliminarItem(index: any,filas:Fila[]): void {
    console.log(index)
    filas.splice(index, 1);
  }


}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: '../create-contract/dialog-animation.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogAnimation {
  constructor(public dialogRef: MatDialogRef<DialogAnimation>) {}
}
