# 🔐 PJE MCP Server

Servidor MCP (Model Context Protocol) para integração com o sistema PJE (Processo Judicial Eletrônico) brasileiro, com suporte completo a certificados digitais A1 e A3.

## 🚀 Características

- ✅ **Integração completa com PJE** - Acesso total à API do PJE
- 🔐 **Certificados Digitais** - Suporte A1 (arquivo) e A3 (token/smartcard)
- 📋 **Gestão de Processos** - Liste, busque e acompanhe processos
- 🏛️ **Dados Judiciais** - Órgãos julgadores, classes e assuntos
- 🔍 **Filtros Avançados** - Busca com múltiplos critérios
- 🌐 **Multi-tribunal** - Funciona com qualquer tribunal PJE
- 🤖 **Claude Desktop** - Integração nativa com IA

## 📦 Instalação Rápida

```bash
git clone https://github.com/seu-usuario/pje-mcp-server.git
cd pje-mcp-server
npm install
cp .env.example .env
# Edite o arquivo .env com suas configurações
npm run build
```

## ⚙️ Configuração

### 1. Configuração Básica (.env)

```env
# URL do seu tribunal
PJE_BASE_URL=https://pje.tjce.jus.br
PJE_APP_NAME=pje-tjce-1g

# Certificado Digital (escolha uma opção)
# Opção 1: Arquivo PFX
PJE_CERTIFICATE_PFX_PATH=C:\certificado.pfx
PJE_CERTIFICATE_PFX_PASSWORD=senha123

# Opção 2: Windows Store
PJE_CERTIFICATE_THUMBPRINT=abc123...
```

### 2. Claude Desktop (Windows)

Adicione ao arquivo `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pje": {
      "command": "node",
      "args": ["C:\\caminho\\para\\pje-mcp-server\\build\\index.js"]
    }
  }
}
```

### 3. Claude Desktop (Mac/Linux)

Adicione ao arquivo `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pje": {
      "command": "node",
      "args": ["/caminho/para/pje-mcp-server/build/index.js"]
    }
  }
}
```

## 🎯 Uso com Claude

Após configurar, reinicie o Claude Desktop e use comandos naturais:

```
"Configure o PJE do TJCE"
"Liste meus processos"
"Busque o processo 1234567-89.2024.8.06.0001"
"Mostre os órgãos julgadores"
"Quais são minhas audiências esta semana?"
```

## 🔐 Certificados Digitais

### Identificar seu Certificado (Windows)

```cmd
certutil -store My
```

### Tipos Suportados

| Tipo | Descrição | Configuração |
|------|-----------|--------------|
| A1 | Arquivo .pfx/.p12 | `PJE_CERTIFICATE_PFX_PATH` |
| A3 | Token/Smartcard | `PJE_CERTIFICATE_THUMBPRINT` |

### Certificadoras Homologadas

- SERPRO
- Certisign
- Serasa Experian
- Valid
- Soluti
- AC Caixa

## 🏛️ Tribunais Testados

- **TJCE** - Tribunal de Justiça do Ceará
- **TRF5** - Tribunal Regional Federal da 5ª Região
- **TJMG** - Tribunal de Justiça de Minas Gerais
- **TJSP** - Tribunal de Justiça de São Paulo
- **TJRJ** - Tribunal de Justiça do Rio de Janeiro

## 📝 Comandos Disponíveis

### Configuração
- `pje_configurar` - Configura conexão com o tribunal
- `pje_configurar_certificado` - Configura certificado digital
- `pje_listar_certificados` - Lista certificados instalados
- `pje_info_certificado` - Informações do certificado atual
- `pje_status` - Status da configuração

### Consultas
- `pje_listar_processos` - Lista processos com filtros
- `pje_buscar_processo` - Busca processo por número
- `pje_listar_orgaos_julgadores` - Lista órgãos
- `pje_listar_classes` - Classes processuais
- `pje_listar_assuntos` - Assuntos disponíveis

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
pje-mcp-server/
├── src/                    # Código fonte TypeScript
│   ├── index.ts           # Servidor principal
│   ├── certificate-manager.ts  # Gerenciamento de certificados
│   └── types.ts           # Tipos e interfaces
├── build/                 # Código compilado (gerado)
├── docs/                  # Documentação adicional
├── examples/              # Exemplos de configuração
└── package.json          # Configuração do projeto
```

### Scripts Disponíveis

```bash
npm run build    # Compila o TypeScript
npm run start    # Inicia o servidor
npm run dev      # Compila e inicia
npm run clean    # Limpa arquivos compilados
```

## 🐛 Solução de Problemas

### Erro: "Certificado não encontrado"
```bash
# Liste certificados disponíveis
certutil -store My
# Copie o thumbprint correto para o .env
```

### Erro: "Comando não encontrado"
- Reinicie o Claude Desktop completamente
- Verifique o caminho no claude_desktop_config.json

### Erro: "Autenticação falhou"
- Verifique a validade do certificado
- Confirme a URL do tribunal
- Teste com outro certificado

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie sua Feature Branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: Nova funcionalidade'`)
4. Push para a Branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links Úteis

- [Documentação do MCP](https://modelcontextprotocol.io)
- [Claude Desktop](https://claude.ai/download)
- [Documentação do PJE](https://www.pje.jus.br/wiki)

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/pje-mcp-server/issues)
- **Discussões**: [GitHub Discussions](https://github.com/seu-usuario/pje-mcp-server/discussions)
- **Email**: seu-email@exemplo.com

---

Desenvolvido com ❤️ para a comunidade jurídica brasileira 