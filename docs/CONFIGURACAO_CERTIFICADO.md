# 🔐 Configuração de Certificado Digital

## Tipos de Certificado

### Certificado A1 (Arquivo)

- **Formato**: .pfx ou .p12
- **Validade**: 1 ano
- **Armazenamento**: Arquivo no computador
- **Mobilidade**: Pode ser copiado

### Certificado A3 (Token/Smartcard)

- **Formato**: Hardware (token USB ou cartão)
- **Validade**: 3 anos
- **Armazenamento**: Dispositivo criptográfico
- **Mobilidade**: Precisa do dispositivo físico

## Configuração por Tipo

### 1. Certificado A1 (Arquivo PFX)

#### Passo 1: Localize seu arquivo
```bash
# Geralmente em:
C:\Users\seu-usuario\Documents\certificados\
C:\certificados\
```

#### Passo 2: Configure no .env
```env
PJE_CERTIFICATE_PFX_PATH=C:\caminho\para\seu\certificado.pfx
PJE_CERTIFICATE_PFX_PASSWORD=senha-do-certificado
```

#### Passo 3: Teste
```bash
node build/index.js
```

### 2. Certificado A3 (Windows Store)

#### Passo 1: Instale o driver do token
- Safenet (tokens brancos)
- eToken (tokens azuis)
- Outros conforme fabricante

#### Passo 2: Liste os certificados
```cmd
certutil -store My
```

Saída esperada:
```
================ Certificate 0 ================
Serial Number: 1234567890abcdef
Issuer: CN=AC SOLUTI Multipla v5, O=ICP-Brasil
Subject: CN=SEU NOME:12345678900
Cert Hash(sha1): a1b2c3d4e5f6789012345678901234567890abcd
```

#### Passo 3: Configure no .env

Por thumbprint:
```env
PJE_CERTIFICATE_THUMBPRINT=a1b2c3d4e5f6789012345678901234567890abcd
```

Por subject:
```env
PJE_CERTIFICATE_SUBJECT=CN=SEU NOME:12345678900
```

## Identificando seu Certificado

### No Windows

1. Abra o Gerenciador de Certificados:
```cmd
certmgr.msc
```

2. Navegue para:
   - Pessoal > Certificados

3. Procure por certificados com:
   - Seu nome
   - CPF ou CNPJ
   - Válidos (não expirados)

### Verificando Validade

```powershell
# PowerShell
Get-ChildItem Cert:\CurrentUser\My | Select Subject, NotAfter
```

## Problemas Comuns

### "Certificado não encontrado"

1. Verifique se está instalado:
```cmd
certutil -store My | findstr "Subject"
```

2. Confirme o thumbprint:
```cmd
certutil -store My | findstr "Cert Hash"
```

### "Senha incorreta"

Para A1:
- Verifique a senha do arquivo PFX
- Tente abrir com outro programa
- Solicite nova senha ao emissor

### "Token não reconhecido"

Para A3:
1. Instale o driver do fabricante
2. Reinicie o computador
3. Verifique no Gerenciador de Dispositivos
4. Teste com o software do fabricante

## Certificadoras Homologadas

### SERPRO
- Site: https://certificados.serpro.gov.br
- Suporte: 0800 728 0323
- Driver: Fornecido na compra

### Certisign
- Site: https://www.certisign.com.br
- Suporte: 0800 701 1799
- Driver: https://drivers.certisign.com.br

### Serasa Experian
- Site: https://serasa.certificadodigital.com.br
- Suporte: 0800 773 7272
- Driver: No site de suporte

### Valid
- Site: https://www.validcertificadora.com.br
- Suporte: 0800 774 4414
- Driver: Central de downloads

## Melhores Práticas

1. **Backup do A1**
   - Guarde cópia em local seguro
   - Use senha forte
   - Não compartilhe

2. **Cuidados com A3**
   - Não remova durante uso
   - Mantenha drivers atualizados
   - Teste periodicamente

3. **Renovação**
   - A1: Anualmente
   - A3: A cada 3 anos
   - Agende com antecedência

4. **Segurança**
   - Nunca envie por email
   - Não salve senha em texto
   - Use gerenciador de senhas

## Comandos Úteis

### Testar certificado
```bash
# No Claude Desktop
"Liste os certificados digitais"
"Mostre informações do meu certificado"
"Verifique a validade do certificado"
```

### Exportar certificado (backup A1)
```cmd
certutil -exportPFX -p "senha" My "thumbprint" "backup.pfx"
```

### Importar certificado
```cmd
certutil -importPFX "arquivo.pfx"
``` 