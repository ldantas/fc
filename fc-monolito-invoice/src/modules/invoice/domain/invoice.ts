import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity"
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "./invoice-address";
import InvoiceItem from "./invoice-item";

type InvoiceProps = {
    id?: Id ;
    name: string;
    document: string;
    address: Address; 
    items: InvoiceItem[]; 
    createdAt?: Date;
    updatedAt?: Date;
}

export default class Invoice extends BaseEntity implements AggregateRoot{
    private _name: string
    private _document: string
    private _address: Address 
    private _items: InvoiceItem[]

    constructor(props: InvoiceProps){
        super(props.id, props.createdAt, props.updatedAt);
        this._name = props.name;
        this._document = props.document;
        this._address = props.address;
        this._items = props.items;
        this.validate();
    }

    validate():void{
        if (this._items.length === 0){
            throw new Error("At least one Invoice Item is required.");
        }
    }

    total(): number{
        return this._items.reduce((sum, current) => sum + current.price, 0); 
    }

    get name(): string{
        return this._name;
    }

    get document(): string{
        return this._document;
    }

    get items(): InvoiceItem[]{
        return Object.assign([], this._items);
    }

    get address(): Address{
        return this._address;
    }
}