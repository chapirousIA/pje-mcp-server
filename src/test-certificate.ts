import * as dotenv from 'dotenv';
import { CertificateManager } from './certificate-manager.js';

// Carregar variáveis de ambiente
dotenv.config();

async function testCertificate() {
    try {
        console.log('Variáveis de ambiente carregadas:');
        console.log('PJE_CERTIFICATE_THUMBPRINT:', process.env.PJE_CERTIFICATE_THUMBPRINT);
        console.log('PJE_CERTIFICATE_PASSWORD:', process.env.PJE_CERTIFICATE_PASSWORD);

        if (!process.env.PJE_CERTIFICATE_THUMBPRINT || !process.env.PJE_CERTIFICATE_PASSWORD) {
            throw new Error('Configuração do certificado não encontrada');
        }

        const config = {
            certificateThumbprint: process.env.PJE_CERTIFICATE_THUMBPRINT,
            certificatePassword: process.env.PJE_CERTIFICATE_PASSWORD
        };

        console.log('Configuração do certificado:', config);

        const certificateManager = new CertificateManager(config);
        await certificateManager.initialize();

        console.log('Certificado inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao testar certificado:', error);
        process.exit(1);
    }
}

testCertificate(); 