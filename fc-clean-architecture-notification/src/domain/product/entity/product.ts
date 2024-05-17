import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import ProductInterface from "./product.interface";

export default class Product extends Entity implements ProductInterface {
  private _name: string;
  private _price: number;

  constructor(id: string, name: string, price: number) {
    super();
    this._id = id;
    this._name = name;
    this._price = price;
    this.validate();
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  changeName(name: string): void {
    //guarda o estado do atributo
    const currentName = this._name;
    try{
      this._name = name;
      this.validate();
    } catch (err) {
      //restaura em caso de erro
      this._name = currentName;
      throw err;
    }
  }

  changePrice(price: number): void {
    //guarda o estado do atributo
    const currentPrice = this._price;
    try{
      this._price = price;
      this.validate();
    }catch(err){
      //restaura em caso de erro
      this._price = currentPrice;
      throw err;
    }
  }

  validate() {
    if (this._id.length === 0) {
      this.notification.addError({
        context: "product",
        message: "Id is required"
      });
    }
    if (this._name.length === 0) {
      this.notification.addError({
        context: "product",
        message: "Name is required"
      });
    }
    if (this._price < 0) {
      this.notification.addError({
        context: "product",
        message: "Price must be greater than zero"
      });
    }
    //Deve lançar os erros nas chamadas de changeXXXX
    if(this.notification.hasErrors()){
      throw new NotificationError(this.notification.getErrors());
    }
  }
}
