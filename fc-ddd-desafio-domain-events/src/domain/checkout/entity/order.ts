import OrderItem from "./order_item";
export default class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[];
  private _total: number;

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._total = this.total();
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  validate(): boolean {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._customerId.length === 0) {
      throw new Error("CustomerId is required");
    }
    if (this._items.length === 0) {
      throw new Error("Items are required");
    }
    
    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error("Quantity must be greater than 0");
    }

    return true;
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.total(), 0);
  }

  addItem(newItem: OrderItem){
    //Valida os parametros antes de alterar o estado do objeto
    if (newItem == undefined){
      throw new Error("Item is required")
    }
    if (newItem.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    //Se já exisitr um item com o mesmo productId com o mesmo preço
    const foundItem = this._items.find((item) => item.productId == newItem.productId && item.price == newItem.price);
    if (foundItem != undefined){
      //Mescla as quantidades
      foundItem.changeQuantity(foundItem.quantity + newItem.quantity);
    }else{
      //Senão adiciona um novo no array
      this._items.push(newItem);
    }
 }
}
