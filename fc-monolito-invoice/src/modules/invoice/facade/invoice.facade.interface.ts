import { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.dto";

export default interface InvoiceFacadeInterface{
    find(id:FindInvoiceFacadeInputDTO):Promise<FindInvoiceFacadeOutputDTO>;
    generate(invoice:GenerateInvoiceFacadeInputDto):Promise<GenerateInvoiceFacadeOutputDto>;
}