import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";

export default interface InvoiceGateway{
    find(id:string):Promise<Invoice>;
    generate(invoice:Invoice):Promise<void>;
}