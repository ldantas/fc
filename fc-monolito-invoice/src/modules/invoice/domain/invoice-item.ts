import Id from "../../@shared/domain/value-object/id.value-object";
import ValueObject from "../../@shared/domain/value-object/value-object.interface";


type InvoiceItemProps = {
    id?: Id;
    name: string;
    price: number;
}

export default class InvoiceItem implements ValueObject{
    private _id: Id;
    private _name: string;
    private _price: number;

    constructor(props: InvoiceItemProps){
        this._id = props.id || new Id();
        this._name = props.name;
        this._price = props.price;
        this.validate();
    }

    validate():void{
        if (this._name.length === 0){
            throw new Error("Item Name is required")
        }
        if (this._price <= 0){
            throw new Error("Price must be greater than zero")
        }
    }

    get id():Id{
        return this._id;
    }

    get name(): string{
        return this._name;
    }

    get price(): number{
        return this._price;
    }
}