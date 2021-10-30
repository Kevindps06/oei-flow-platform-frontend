import { FilesFields } from "./files-fields";

export interface FormsJuridicaContratacionConvenioRequest {
    id: string,
    operation: string,
    username: string,
    password: string,
    number: string,
    name: string,  
    filesFields: FilesFields[],
    additionalInfo: string,
    keys: string[]
}
