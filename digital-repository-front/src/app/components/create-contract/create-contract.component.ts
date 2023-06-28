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
  //precontractualCollection :Collection = new Collection();
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

    this.buildForm();

    this.Spqr = this.myForm.value.traOficioNum;

    this.newContract = new Contract();
    //this.modality = new Modality();
    this.contrSv.cart$.subscribe((idContract) => {
      this.idContract = idContract;
    });

  }

  buildForm(){
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


  }



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
      console.log('Del servicio tipos modalidad ', response);
      this.modalityType = response.data.data as Modality[];
    });
  }
  //method return 1 ContractType
  public loadContractType() {
    this.contrSv.getContractType().subscribe((response) => {
      console.log('Del servicio tipos contracto', response);
      this.contractsType = response.data.data as ContractType[];
    });
  }

  public loadRadicado() {
    return (this.radicado =
      '5.5-31.' +
      this.myForm.value.ncContractType +
      '/' +
      this.myForm.value.ncNroContract);
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
