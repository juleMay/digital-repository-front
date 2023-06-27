import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogEditComponent } from '../dialog-edit/dialog-edit.component';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractType } from 'src/app/class/models/ContractType';
import { Modality } from 'src/app/class/models/Modality';
import { ContractService } from 'src/app/services/contract.service';
import { Contract } from 'src/app/class/contract';
import { DatePipe } from '@angular/common';
import { modalityContractType } from 'src/app/class/models/ModalityContractType';
import { MatStepper } from '@angular/material/stepper';
import { PdfViewerDialogComponent } from '../pdf-viewer-dialog/pdf-viewer-dialog.component';
import { Fila } from 'src/app/class/models/Fila';
import { CheckList } from 'src/app/class/models/CheckList';
import { DocumentsService } from 'src/app/services/documents.service';
import { ToastrService } from 'ngx-toastr';
import { responseDocument } from 'src/app/class/models/responseDocument';

export class directorys {
  name!: string;
  subdirectory!: string;
}

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.css'],
})
export class CreateContractComponent implements OnInit {
  @ViewChild(MatStepper) stepper!: MatStepper;
  filas: any[] = [];
  doc: Fila = new Fila();
  checkList: CheckList[] = [];
  //acordeonAbierto = false;
  myForm: FormGroup = new FormGroup({});
  Spqr: string | undefined;
  radicado!: String;
  rad!: String;
  subs: directorys[] = [];
  // subdirectory1: CheckList[] = [];
  // subdirectory2: CheckList[] = [];
  // subdirectory3: CheckList[] = [];


  idContract: number = 1;

  pipe = new DatePipe('en-US');
  contractsType: ContractType[] = [];
  modalityContractType: modalityContractType[] = [];
  modalityType: Modality[] = [];
  contractType: ContractType = new ContractType();
  modality: Modality = new Modality();
  newContract: Contract = new Contract();
  response: responseDocument = new responseDocument();
  date: Date = new Date();
  initialDate: Date = new Date();
  textoDeInput!: string;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private contrSv: ContractService,
    private documentSv: DocumentsService,
    private elementRef: ElementRef,
    private toastrSvc: ToastrService
  ) {}

  ngOnInit() {
    this.loadContractType();
    this.loadModalityType();
    //this.loadCheckList();

    //this.loadRadicado()
    this.myForm = this.fb.group({
      //ncRadicado: ['', Validators.required],
      ncInitialDate: ['', Validators.required],
      //(/^\w+$/)             Expresion regular que permite numeros y letras sin espacios
      ncNroContract: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.max(9999),
          Validators.min(1),
        ]),
      ],
      ncContractType: ['', Validators.required],
      ncModalityType: ['', Validators.required],
      ncVendor: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      ncSubject: ['', Validators.required],
    });

    this.Spqr = this.myForm.value.traOficioNum;

    this.newContract = new Contract();
    //this.modality = new Modality();
    this.contrSv.cart$.subscribe((idContract) => {
      this.idContract = idContract;
    });
  }

  // method to preview pdf-----------------------
  pdfUrl = '';
  openPdfViewerDialog(i: number) {
    this.pdfUrl = this.filas[i].url;
    console.log(this.pdfUrl);
    const dialogRef = this.dialog.open(PdfViewerDialogComponent, {
      width: '800px',
      height: '600px',
      data: { pdfUrl: this.pdfUrl },
    });
  }

  //method return all checkList
  // async loadCheckList() {
  //   this.documentSv

  //     .getCheckList(1) // after to delete la linea anterior
  //     .subscribe((response) => {
  //       console.log('Del servicio ', response);

  //       this.checkList = response.data as CheckList[];
  //       console.log(this.checkList);
  //       this.LoadSubdirectorys();
  //     });
  //   await new Promise((f) => setTimeout(f, 1000));

  // }

  //method return 1 ModalityContractType
  public loadModalityContractType() {
    this.contrSv
      .getModalityContractType(
        this.newContract.contractTypeId,
        this.newContract.modalityId
      )
      .subscribe((response) => {
        console.log('Del servicio ', response);
        this.modalityContractType = response.data
          .data as modalityContractType[];
      });
  }
  //method return 1 Modality
  public loadModalityType() {
    this.contrSv.getModalityType().subscribe((response) => {
      console.log('Del servicio ', response);
      this.modalityType = response.data.data as Modality[];
    });
  }
  //method return 1 ContractType
  public loadContractType() {
    this.contrSv.getContractType().subscribe((response) => {
      console.log('Del servicio ', response);
      this.contractsType = response.data.data as ContractType[];
    });
  }

  public loadRadicado() {
    return (this.radicado =
      '5.5-31.' +
      this.myForm.value.ncContractType +
      '/' +
      this.myForm.value.ncNroContract);
    console.log('Numero de referencia ' + this.newContract.reference);
  }
  //Dialog delete document
  openDialog(i: number): void {
    const dialogRef = this.dialog.open(DialogAnimation, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Si') {
        const fila = this.filas[i];
        this.eliminarItem(fila);
      }
    });
  }

  // agregarFila() {
  //   const nuevaFila = {
  //     documento: 'Documento',
  //     invitacion: 'Invitación',
  //     fecha: 'Fecha',
  //   };
  //   this.filas.push(nuevaFila);
  //   this.acordeonAbierto = false;
  //   setTimeout(() => {
  //     this.acordeonAbierto = true;
  //   }, 0);
  // }

  eliminarItem(index: number): void {
    this.filas.splice(index, 1);
  }

  //dialog create document
  abrirVentanaEmergente() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '800px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Aquí puedes realizar acciones después de cerrar el diálogo, si es necesario
      //console.log('Diálogo cerrado',result);
      this.doc = result;
      this.filas.push(this.doc);
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

  //Form field validation create contract
  get ncNroContractInvalid() {
    return (
      this.myForm.get('ncNroContract')?.invalid &&
      this.myForm.get('ncNroContract')?.touched
    );
  }

  get ncInitialDateInvalid() {
    return (
      this.myForm.get('ncInitialDate')?.invalid &&
      this.myForm.get('ncInitialDate')?.touched
    );
  }

  get ncContractTypeInvalid() {
    return (
      this.myForm.get('ncContractType')?.invalid &&
      this.myForm.get('ncContractType')?.touched
    );
  }

  get ncModalityTypeInvalid() {
    return (
      this.myForm.get('ncModalityType')?.invalid &&
      this.myForm.get('ncModalityType')?.touched
    );
  }

  get ncVendorInvalid() {
    return (
      this.myForm.get('ncVendor')?.invalid &&
      this.myForm.get('ncVendor')?.touched
    );
  }

  get ncSubjectInvalid() {
    return (
      this.myForm.get('ncSubject')?.invalid &&
      this.myForm.get('ncSubject')?.touched
    );
  }


  // public LoadSubdirectorys() {
  //   for (const item of this.checkList) {
  //     const subdirectory = item.subdirectory;


  //     if (subdirectory === '0') {
  //       this.subdirectory1.push(item);
  //     } else if (subdirectory === '1') {
  //       this.subdirectory2.push(item);
  //     } else if (subdirectory === '2') {
  //       this.subdirectory3.push(item);
  //     }
  //   }

  // }


  //fill contract
  public fillContract() {
    this.date = new Date();
    this.initialDate = new Date(this.myForm.value.ncInitialDate);
    //console.log('Nuevo Signing date FIILLL CONTRACR' + this.initialDate);
    //this.newContract.id = this.myForm.value.id;
    this.newContract.reference = this.loadRadicado();
    //this.newContract.singinDate = this.date;
    this.newContract.singinDate = this.date;
    this.newContract.initialDate = this.initialDate;

    this.newContract.finalDate = null;
    this.newContract.status = 'ACTIVO';
    this.newContract.subject = this.myForm.value.ncSubject;
    this.newContract.vendor = this.myForm.value.ncVendor;
    console.log('Nuevo Contrato ModalityType' + this.newContract.modalityId);
    console.log(
      'Nuevo Contrato contractType' + this.newContract.contractTypeId
    );
    this.newContract.modalityId = this.myForm.value.ncModalityType;
    this.newContract.contractTypeId = this.myForm.value.ncContractType;
  }
  //Mostrar el siguiente formulario
  moveToNextStep() {
    this.stepper.next();
  }
  //send request create contract
  public async submitFormulario() {
    if (this.myForm.invalid) {
      this.toastError("Formulario de contrato Incompleto ")
      return Object.values(this.myForm.controls).forEach((control) => {
        control.markAllAsTouched();
      });

    }

    this.fillContract();

    this.contrSv.addContract(this.newContract).subscribe((res) => {
      console.log(res);
      this.response= res
      console.log(this.response.status);

    });



    console.log('ESTADO' + this.response.status);
    if (this.response.status == 200) {

      this.toastrSvc.success('Contrato agregado Correctamente', '');
      this.moveToNextStep();
    } else {
      this.toastrSvc.error(`Error al guardar en la base de datos ${this.response.data} `);

    }
  }

  toastError(mensaje:string){
    this.toastrSvc.error(mensaje);
  }


}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'dialog-animation.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogAnimation {
  constructor(public dialogRef: MatDialogRef<DialogAnimation>) {}
}
