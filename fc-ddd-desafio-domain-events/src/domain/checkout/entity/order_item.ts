export default class OrderItem {
  private _id: string;
  private _productId: string;
  private _name: string;
  private _price: number;
  private _quantity: number;
  private _total: number;

  constructor(
    id: string,
    name: string,
    price: number,
    productId: string,
    quantity: number
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._productId = productId;
    this._quantity = quantity;
    this._total = this.total();
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get productId(): string {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): number {
    return this._price;
  }

  total(): number {
    return this._price * this._quantity
  }

  validate(){
    if (this.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
  }

  //Adiciona a quantidade ao item
  changeQuantity(newQty: number){
    //Valida o parametro de entrada antes de alterar o estado do objeto
    if( newQty <= 0){
      throw new Error("New quantity must be greater than 0");
    }
    this._quantity = newQty;
  }
}
