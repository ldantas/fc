import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.dto";
import InvoiceFacadeInterface from "./invoice.facade.interface";

type InvoiceFacadeProps = {
    findInvoiceUseCase: UseCaseInterface;
    generateInvoiceUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface{
    private _findInvoiceUseCase: UseCaseInterface;
    private _generateInvoiceFacade: UseCaseInterface;

    constructor(props:InvoiceFacadeProps){
        this._findInvoiceUseCase = props.findInvoiceUseCase;
        this._generateInvoiceFacade = props.generateInvoiceUseCase;
    }
    
    find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
        return this._findInvoiceUseCase.execute(input);
    }
    generate(invoice: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return this._generateInvoiceFacade.execute(invoice);
    }

}