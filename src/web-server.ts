import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { PJEClient } from './pje-client.js';
import { extractProcessInfo } from './pdf-processor.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

// Configuração do Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rota principal
app.get('/', (req, res) => {
  res.render('index', {
    title: 'PJE MCP Server - Interface Web',
    tools: [
      { id: 'buscar-processo', name: 'Buscar Processo', icon: '🔍' },
      { id: 'peticionar', name: 'Petição Eletrônica', icon: '📝' },
      { id: 'peticionar-lote', name: 'Petição em Lote', icon: '📦' },
      { id: 'listar-processos', name: 'Listar Processos', icon: '📋' },
      { id: 'listar-orgaos', name: 'Órgãos Julgadores', icon: '🏛️' },
      { id: 'listar-classes', name: 'Classes Processuais', icon: '📚' },
      { id: 'listar-assuntos', name: 'Assuntos Processuais', icon: '📑' }
    ]
  });
});

// Rota para buscar processo
app.post('/buscar-processo', async (req, res) => {
  try {
    const numeroProcesso = req.body.numeroProcesso;
    
    if (!process.env.PJE_CERTIFICATE_THUMBPRINT || !process.env.PJE_CERTIFICATE_PASSWORD) {
      throw new Error('Configuração do certificado não encontrada');
    }

    // Configurar cliente PJE
    const pjeClient = new PJEClient({
      baseUrl: process.env.PJE_BASE_URL || 'https://pje.tjce.jus.br',
      appName: process.env.PJE_APP_NAME || 'pje-tjce-1g',
      certificate: {
        certificateThumbprint: process.env.PJE_CERTIFICATE_THUMBPRINT,
        certificatePassword: process.env.PJE_CERTIFICATE_PASSWORD
      }
    });

    // Inicializar certificado
    await pjeClient.initializeCertificate();
    await pjeClient.authenticateWithCertificate();

    // Buscar processo
    const processo = await pjeClient.buscarProcesso(numeroProcesso);

    res.json({
      success: true,
      processo
    });
  } catch (error) {
    console.error('Erro ao buscar processo:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar processo'
    });
  }
});

// Rota para upload de petições
app.post('/peticionar', upload.single('petition'), async (req, res) => {
  try {
    console.log('Recebendo petição...');
    
    if (!req.file) {
      console.log('Nenhum arquivo enviado');
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    console.log('Arquivo recebido:', req.file);

    if (!process.env.PJE_CERTIFICATE_THUMBPRINT || !process.env.PJE_CERTIFICATE_PASSWORD) {
      console.log('Configuração do certificado não encontrada');
      throw new Error('Configuração do certificado não encontrada');
    }

    console.log('Extraindo informações do PDF...');
    // Extrair informações do processo do PDF
    const processInfo = await extractProcessInfo(req.file.path);
    console.log('Informações extraídas:', processInfo);
    
    console.log('Configurando cliente PJE...');
    // Configurar cliente PJE
    const pjeClient = new PJEClient({
      baseUrl: process.env.PJE_BASE_URL || 'https://pje.tjce.jus.br',
      appName: process.env.PJE_APP_NAME || 'pje-tjce-1g',
      certificate: {
        certificateThumbprint: process.env.PJE_CERTIFICATE_THUMBPRINT,
        certificatePassword: process.env.PJE_CERTIFICATE_PASSWORD
      }
    });

    console.log('Inicializando certificado...');
    // Inicializar certificado
    await pjeClient.initializeCertificate();
    await pjeClient.authenticateWithCertificate();

    console.log('Realizando peticionamento...');
    // Fazer o peticionamento
    const protocol = await pjeClient.peticionar(processInfo);

    console.log('Petição protocolada com sucesso:', protocol);

    // Retornar recibo do protocolo
    res.json({
      success: true,
      protocol,
      processInfo
    });

  } catch (error) {
    console.error('Erro detalhado ao processar petição:', error);
    res.status(500).json({ 
      error: 'Erro ao processar petição',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Rota para upload de petições em lote
app.post('/peticionar-lote', upload.array('petitions', 10), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    if (!process.env.PJE_CERTIFICATE_THUMBPRINT || !process.env.PJE_CERTIFICATE_PASSWORD) {
      throw new Error('Configuração do certificado não encontrada');
    }

    const results = [];
    const pjeClient = new PJEClient({
      baseUrl: process.env.PJE_BASE_URL || 'https://pje.tjce.jus.br',
      appName: process.env.PJE_APP_NAME || 'pje-tjce-1g',
      certificate: {
        certificateThumbprint: process.env.PJE_CERTIFICATE_THUMBPRINT,
        certificatePassword: process.env.PJE_CERTIFICATE_PASSWORD
      }
    });

    await pjeClient.initializeCertificate();
    await pjeClient.authenticateWithCertificate();

    for (const file of req.files) {
      try {
        const processInfo = await extractProcessInfo(file.path);
        const protocol = await pjeClient.peticionar(processInfo);
        results.push({
          file: file.originalname,
          success: true,
          protocol,
          processInfo
        });
      } catch (error) {
        results.push({
          file: file.originalname,
          success: false,
          error: error instanceof Error ? error.message : 'Erro ao processar petição'
        });
      }
    }

    res.json({
      success: true,
      results
    });

  } catch (error) {
    console.error('Erro ao processar lote de petições:', error);
    res.status(500).json({ error: 'Erro ao processar lote de petições' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor web rodando na porta ${PORT}`);
}); 