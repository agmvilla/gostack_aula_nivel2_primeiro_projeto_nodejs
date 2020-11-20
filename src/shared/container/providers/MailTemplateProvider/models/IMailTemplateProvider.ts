import IParseMailTemplateProviderDTO from '../dtos/IParseMailTemplateProviderDTO';

export default interface IMailTemplateProvider {
    parse(data: IParseMailTemplateProviderDTO): Promise<string>;
}
