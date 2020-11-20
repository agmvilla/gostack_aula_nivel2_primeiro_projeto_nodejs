import handlebars from 'handlebars';
import fs from 'fs';
import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateProviderDTO from '../dtos/IParseMailTemplateProviderDTO';

export default class HandlebarsMailTemplateProvider
    implements IMailTemplateProvider {
    public async parse({
        file,
        variables,
    }: IParseMailTemplateProviderDTO): Promise<string> {
        const templateFileContent = await fs.promises.readFile(file, {
            encoding: 'utf-8',
        });

        const parseTemplate = handlebars.compile(templateFileContent);

        return parseTemplate(variables);
    }
}
