import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import EnviaConsoleLog2Handler from "../event/handler/envia-console-log-2.handler";
import EnviaConsoleLog1Handler from "../event/handler/envia-console-log-1.handler";
import EnviaConsoleLogHandler from "../event/handler/envia-console-log.handler";
import Address from "../value-object/address";

describe("CustomerEvents unit tests", () => {

it("should notify a CustomerCreated event for configured handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    
    const eventHandler2 = new EnviaConsoleLog2Handler();
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    const customer = Customer.create("1", "Customer 1");

    expect(customer.events.length).toBe(1);
    
    eventDispatcher.notifyAll(customer.events);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();

  });

  it("should notify a CustomerAddressChanged event for configured handlers", () => {
    
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.changeAddress(address);

    expect(customer.events.length).toBe(1);

    eventDispatcher.notifyAll(customer.events);

    expect(spyEventHandler).toHaveBeenCalled();

  });

  it("should notify all events for configured handlers", () => {
    
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    
    const eventHandler2 = new EnviaConsoleLog2Handler();
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    const eventHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    const customer = Customer.create("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.changeAddress(address);

    expect(customer.events.length).toBe(2);

    eventDispatcher.notifyAll(customer.events);

    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();

  });


});
