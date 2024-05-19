import { HasMany, BelongsTo, Column, PrimaryKey, Table, Model, HasOne } from "sequelize-typescript";
import AddressModel from "./invoice-address.model";
import InvoiceItemModel from "./invoice-item.model";

@Table({
    tableName: "invoices",
    timestamps: false
})
export default class InvoiceModel extends Model{

    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    document: string;

    @HasOne(()=> AddressModel)
    address: AddressModel;

    @HasMany(() => InvoiceItemModel)
    items: InvoiceItemModel[];
    
    @Column({ allowNull: false })
    createdAt: Date;
  
    @Column({ allowNull: false })
    updatedAt: Date;

}