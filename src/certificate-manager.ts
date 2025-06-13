import { Agent } from 'https';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export interface CertificateConfig {
  certificateThumbprint: string;
  certificatePath?: string;
  certificatePassword: string;
  pfxPath?: string;
  pfxPassword?: string;
  certificateSubject?: string;
}

interface TokenCertificate {
  thumbprint: string;
  provider: string;
}

interface TokenKey {
  password: string;
  provider: string;
}

export class CertificateManager {
  private config: CertificateConfig;
  private agent: Agent | null = null;

  constructor(config: CertificateConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    console.log('Iniciando CertificateManager com config:', {
      ...this.config,
      certificatePassword: '***' // Ocultar senha nos logs
    });
    
    if (!this.config.certificateThumbprint) {
      throw new Error('Thumbprint do certificado não fornecido');
    }

    try {
      // Verificar se o certificado está disponível
      console.log('Verificando certificado no repositório...');
      const { stdout, stderr } = await execAsync(`certutil -user -store My "${this.config.certificateThumbprint}"`);
      
      if (stderr) {
        console.error('Erro ao verificar certificado:', stderr);
      }
      
      console.log('Resposta do certutil:', stdout);
      
      if (!stdout.includes(this.config.certificateThumbprint)) {
        throw new Error('Certificado não encontrado no repositório');
      }

      // Verificar se o token está conectado
      console.log('Verificando status do token...');
      const { stdout: tokenStatus } = await execAsync('certutil -user -csp "SafeSign IC Standard Windows Cryptographic Service Provider" -key');
      console.log('Status do token:', tokenStatus);

      // Configurar o agente HTTPS com o certificado do token
      console.log('Configurando agente HTTPS com certificado do token...');
      const cert: TokenCertificate = {
        thumbprint: this.config.certificateThumbprint,
        provider: 'SafeSign IC Standard Windows Cryptographic Service Provider'
      };

      const key: TokenKey = {
        password: this.config.certificatePassword,
        provider: 'SafeSign IC Standard Windows Cryptographic Service Provider'
      };

      this.agent = new Agent({
        rejectUnauthorized: false,
        cert: cert as any,
        key: key as any,
        ciphers: 'HIGH:!aNULL:!MD5:!RC4',
        minVersion: 'TLSv1.2',
        secureOptions: 0x00000001 // SSL_OP_NO_SSLv2
      });

      console.log('Certificado inicializado com sucesso');
    } catch (error) {
      console.error('Erro detalhado ao inicializar certificado:', error);
      if (error instanceof Error) {
        throw new Error(`Falha ao inicializar certificado: ${error.message}`);
      }
      throw new Error('Falha ao inicializar certificado');
    }
  }

  getAgent(): Agent {
    if (!this.agent) {
      throw new Error('Certificado não inicializado');
    }
    return this.agent;
  }

  getHttpsAgent(): Agent {
    if (!this.agent) {
      throw new Error('Certificado não inicializado');
    }
    return this.agent;
  }

  getCertificate(): any {
    if (!this.agent) {
      throw new Error('Certificado não inicializado');
    }
    return this.agent.options.cert || this.agent.options.pfx;
  }

  getCertificateInfo(): any {
    return {
      thumbprint: this.config.certificateThumbprint,
      path: this.config.certificatePath,
      hasPassword: !!this.config.certificatePassword,
      provider: 'SafeSign IC Standard Windows Cryptographic Service Provider'
    };
  }
} 