import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory{

    static create(){
        const repo = new InvoiceRepository();
        return new InvoiceFacade({
            findInvoiceUseCase: new FindInvoiceUseCase(repo),
            generateInvoiceUseCase: new GenerateInvoiceUseCase(repo),
        });
    }

}