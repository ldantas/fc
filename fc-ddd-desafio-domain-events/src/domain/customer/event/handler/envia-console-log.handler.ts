import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import Customer from "../../entity/customer";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle(event: CustomerAddressChangedEvent): void {
    if (event.eventData instanceof Customer){
      const customer:Customer = event.eventData;  
      console.log(`Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.Address.toString()}.`); 
    }else{
      throw Error("Unexpected data type")
    }
  }
}
