export class Contract {
    id!: number;
    reference!: String;
    singinDate!: Date | null;
    initialDate!: Date | null;
    finalDate!: Date | null;
    status!: String;
    subject !: String;
    vendor: String = "";
    modalityId !: number;
    contractTypeId !: number;

    constructor(idContract :number){
      this.id=idContract;
    }
    
}
