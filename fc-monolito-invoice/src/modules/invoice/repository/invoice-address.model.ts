import { Model, Column, ForeignKey, PrimaryKey, Table, BelongsTo } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
    tableName: "invoice_address",
    timestamps: false,
})
export default class AddressModel extends Model{

    @PrimaryKey
    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    invoiceId:string;

    @BelongsTo(() => InvoiceModel)
    invoice: InvoiceModel;

    @Column({ allowNull: false })
    street: string;
    
    @Column({ allowNull: false })
    number: string;
    
    @Column({ allowNull: true })
    complement: string;
    
    @Column({ allowNull: false })
    city: string;
    
    @Column({ allowNull: false })
    state: string;
    
    @Column({ allowNull: false })
    zipCode: string;

}