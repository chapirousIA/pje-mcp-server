# 📦 Guia de Instalação Completo

## Pré-requisitos

- Node.js 18 ou superior
- NPM ou Yarn
- Git
- Certificado Digital (A1 ou A3)
- Claude Desktop instalado

## Instalação Passo a Passo

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/pje-mcp-server.git
cd pje-mcp-server
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure o Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas configurações
notepad .env  # Windows
nano .env     # Linux/Mac
```

### 4. Configure seu Tribunal

Edite o arquivo `.env`:

```env
# TJCE - Ceará
PJE_BASE_URL=https://pje.tjce.jus.br
PJE_APP_NAME=pje-tjce-1g

# TRF5 - 5ª Região
# PJE_BASE_URL=https://pje.trf5.jus.br
# PJE_APP_NAME=pje-trf5

# TJMG - Minas Gerais
# PJE_BASE_URL=https://pje.tjmg.jus.br
# PJE_APP_NAME=pje-tjmg-1g
```

### 5. Configure o Certificado Digital

#### Opção A: Arquivo PFX (A1)

```env
PJE_CERTIFICATE_PFX_PATH=C:\Users\seu-usuario\certificado.pfx
PJE_CERTIFICATE_PFX_PASSWORD=sua-senha
```

#### Opção B: Windows Store (A3)

1. Liste os certificados:
```cmd
certutil -store My
```

2. Copie o thumbprint:
```env
PJE_CERTIFICATE_THUMBPRINT=1234567890abcdef...
```

### 6. Compile o Projeto

```bash
npm run build
```

### 7. Configure o Claude Desktop

#### Windows

1. Abra o arquivo:
```
%APPDATA%\Claude\claude_desktop_config.json
```

2. Adicione a configuração:
```json
{
  "mcpServers": {
    "pje": {
      "command": "node",
      "args": ["C:\\Users\\seu-usuario\\pje-mcp-server\\build\\index.js"]
    }
  }
}
```

#### Mac/Linux

1. Abra o arquivo:
```
~/.config/claude/claude_desktop_config.json
```

2. Adicione a configuração:
```json
{
  "mcpServers": {
    "pje": {
      "command": "node",
      "args": ["/home/seu-usuario/pje-mcp-server/build/index.js"]
    }
  }
}
```

### 8. Reinicie o Claude Desktop

- Feche completamente (Ctrl+Q ou Cmd+Q)
- Aguarde 5 segundos
- Abra novamente

### 9. Teste a Instalação

No Claude, digite:
```
Verifique o status do PJE
```

Se tudo estiver correto, você verá as informações de configuração.

## Instalação Global (Opcional)

Para usar em qualquer lugar:

```bash
# Instale globalmente
npm install -g .

# Configure no Claude Desktop
{
  "mcpServers": {
    "pje": {
      "command": "pje-mcp-server"
    }
  }
}
```

## Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
npm run build
```

### Erro: "Permission denied"
- Windows: Execute como Administrador
- Linux/Mac: Use `sudo` se necessário

### Erro: "Tool not found"
- Verifique se o caminho no claude_desktop_config.json está correto
- Certifique-se de que o Claude foi reiniciado 