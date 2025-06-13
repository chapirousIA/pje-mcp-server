import fs from 'fs/promises';
// @ts-ignore
const pdfParse = require('pdf-parse');

export interface ProcessInfo {
    numeroProcesso: string;
    tipoPeticao: string;
    classeProcessual: string;
    orgaoJulgador: string;
    assunto: string;
}

export async function extractProcessInfo(pdfPath: string): Promise<ProcessInfo> {
    try {
        console.log('Lendo arquivo PDF:', pdfPath);
        // Ler o arquivo PDF
        const pdfBuffer = await fs.readFile(pdfPath);
        
        console.log('Extraindo texto do PDF...');
        // Extrair texto do PDF
        const data = await pdfParse(pdfBuffer);
        const fullText = data.text;
        
        console.log('Texto extraído do PDF:', fullText.substring(0, 500) + '...');

        // Extrair número do processo usando regex
        const processoMatch = fullText.match(/\d{20}/);
        if (!processoMatch) {
            console.log('Número do processo não encontrado. Tentando outros formatos...');
            // Tentar outros formatos comuns de número de processo
            const formatos = [
                /\d{7}-\d{2}\.\d{4}\.\d{1,2}\.\d{2}\.\d{4}/, // 0000000-00.0000.0.00.0000
                /\d{20}/, // 00000000000000000000
                /\d{7}-\d{2}\.\d{4}\.\d{1,2}\.\d{2}\.\d{4}\.\d{4}/ // 0000000-00.0000.0.00.0000.0000
            ];
            
            for (const formato of formatos) {
                const match = fullText.match(formato);
                if (match) {
                    console.log('Número do processo encontrado com formato alternativo:', match[0]);
                    return {
                        numeroProcesso: match[0],
                        tipoPeticao: 'Petição Intermediária',
                        classeProcessual: '',
                        orgaoJulgador: '',
                        assunto: ''
                    };
                }
            }
            
            throw new Error('Número do processo não encontrado no PDF');
        }

        console.log('Número do processo encontrado:', processoMatch[0]);

        // Extrair tipo de petição (assumindo que é sempre "Petição Intermediária")
        const tipoPeticao = 'Petição Intermediária';

        // Extrair classe processual (assumindo que está após "Classe:")
        const classeMatch = fullText.match(/Classe:\s*([^\n]+)/i);
        const classeProcessual = classeMatch ? classeMatch[1].trim() : '';

        // Extrair órgão julgador (assumindo que está após "Órgão Julgador:")
        const orgaoMatch = fullText.match(/Órgão Julgador:\s*([^\n]+)/i);
        const orgaoJulgador = orgaoMatch ? orgaoMatch[1].trim() : '';

        // Extrair assunto (assumindo que está após "Assunto:")
        const assuntoMatch = fullText.match(/Assunto:\s*([^\n]+)/i);
        const assunto = assuntoMatch ? assuntoMatch[1].trim() : '';

        return {
            numeroProcesso: processoMatch[0],
            tipoPeticao,
            classeProcessual,
            orgaoJulgador,
            assunto
        };
    } catch (error) {
        console.error('Erro ao processar PDF:', error);
        throw new Error('Erro ao processar o arquivo PDF');
    }
} 