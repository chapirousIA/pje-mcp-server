import { readFileSync } from 'fs';
import https from 'https';
import forge from 'node-forge';
import { execSync } from 'child_process';
import path from 'path';

export interface CertificateConfig {
  pfxPath?: string;
  pfxPassword?: string;
  certificateThumbprint?: string;
  certificateSubject?: string;
  tokenProvider?: string;
  tokenPin?: string;
}

export class CertificateManager {
  private certificate?: string;
  private privateKey?: string;
  private httpsAgent?: https.Agent;

  constructor(private config: CertificateConfig) {}

  async initialize(): Promise<void> {
    if (this.config.pfxPath && this.config.pfxPassword) {
      await this.loadFromPfx();
    } else if (this.config.certificateThumbprint || this.config.certificateSubject) {
      await this.loadFromWindowsStore();
    } else if (this.config.tokenProvider) {
      await this.loadFromToken();
    } else {
      throw new Error('Nenhuma configuração de certificado válida fornecida');
    }
  }

  private async loadFromPfx(): Promise<void> {
    try {
      const pfxBuffer = readFileSync(this.config.pfxPath!);
      const p12Asn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'));
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, this.config.pfxPassword || '');

      const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
      const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });

      const certBag = certBags[forge.pki.oids.certBag]?.[0];
      const keyBag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0];

      if (!certBag || !keyBag) {
        throw new Error('Certificado ou chave privada não encontrados no arquivo PFX');
      }

      this.certificate = forge.pki.certificateToPem(certBag.cert!);
      this.privateKey = forge.pki.privateKeyToPem(keyBag.key!);

      this.httpsAgent = new https.Agent({
        cert: this.certificate,
        key: this.privateKey,
        rejectUnauthorized: false
      });

    } catch (error) {
      throw new Error(`Erro ao carregar certificado PFX: ${error}`);
    }
  }

  private async loadFromWindowsStore(): Promise<void> {
    try {
      const tempDir = process.env.TEMP || 'C:\\temp';
      const tempPfxPath = path.join(tempDir, 'temp_cert.pfx');
      const tempPassword = 'temp123';

      let certutilCommand = 'certutil -store My';
      
      if (this.config.certificateThumbprint) {
        certutilCommand = `certutil -exportPFX -p "${tempPassword}" My "${this.config.certificateThumbprint}" "${tempPfxPath}"`;
      } else if (this.config.certificateSubject) {
        certutilCommand = `certutil -exportPFX -p "${tempPassword}" My "${this.config.certificateSubject}" "${tempPfxPath}"`;
      }

      execSync(certutilCommand, { encoding: 'utf8' });

      this.config.pfxPath = tempPfxPath;
      this.config.pfxPassword = tempPassword;
      await this.loadFromPfx();

      execSync(`del "${tempPfxPath}"`);

    } catch (error) {
      throw new Error(`Erro ao carregar certificado do Windows Store: ${error}`);
    }
  }

  private async loadFromToken(): Promise<void> {
    throw new Error('Suporte para token/smartcard ainda não implementado. Use arquivo PFX ou certificado do Windows.');
  }

  getHttpsAgent(): https.Agent {
    if (!this.httpsAgent) {
      throw new Error('Certificado não inicializado. Execute initialize() primeiro.');
    }
    return this.httpsAgent;
  }

  getCertificate(): string {
    if (!this.certificate) {
      throw new Error('Certificado não carregado');
    }
    return this.certificate;
  }

  getCertificateInfo(): any {
    if (!this.certificate) {
      throw new Error('Certificado não carregado');
    }

    try {
      const cert = forge.pki.certificateFromPem(this.certificate);
      return {
        subject: cert.subject.attributes.map(attr => ({
          name: attr.name,
          value: attr.value
        })),
        issuer: cert.issuer.attributes.map(attr => ({
          name: attr.name,
          value: attr.value
        })),
        serialNumber: cert.serialNumber,
        notBefore: cert.validity.notBefore,
        notAfter: cert.validity.notAfter,
        thumbprint: forge.md.sha1.create().update(
          forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes()
        ).digest().toHex()
      };
    } catch (error) {
      throw new Error(`Erro ao obter informações do certificado: ${error}`);
    }
  }

  static async listWindowsCertificates(): Promise<any[]> {
    try {
      const output = execSync('certutil -store My', { encoding: 'utf8' });
      const certificates = [];
      
      const lines = output.split('\n');
      let currentCert: any = {};
      
      for (const line of lines) {
        if (line.includes('Serial Number:')) {
          if (currentCert.serialNumber) {
            certificates.push(currentCert);
            currentCert = {};
          }
          currentCert.serialNumber = line.split(':')[1].trim();
        } else if (line.includes('Subject:')) {
          currentCert.subject = line.split(':')[1].trim();
        } else if (line.includes('Cert Hash(sha1):')) {
          currentCert.thumbprint = line.split(':')[1].trim().replace(/\s/g, '');
        }
      }
      
      if (currentCert.serialNumber) {
        certificates.push(currentCert);
      }
      
      return certificates;
    } catch (error) {
      throw new Error(`Erro ao listar certificados: ${error}`);
    }
  }
} 