# 🏛️ Tribunais Suportados

## Configurações por Tribunal

### Região Nordeste

#### TJCE - Tribunal de Justiça do Ceará
```env
PJE_BASE_URL=https://pje.tjce.jus.br
PJE_APP_NAME=pje-tjce-1g  # 1º grau
PJE_APP_NAME=pje-tjce-2g  # 2º grau
```

#### TJBA - Tribunal de Justiça da Bahia
```env
PJE_BASE_URL=https://pje.tjba.jus.br
PJE_APP_NAME=pje-tjba-1g
PJE_APP_NAME=pje-tjba-2g
```

#### TJPE - Tribunal de Justiça de Pernambuco
```env
PJE_BASE_URL=https://pje.tjpe.jus.br
PJE_APP_NAME=pje-tjpe-1g
PJE_APP_NAME=pje-tjpe-2g
```

### Região Sudeste

#### TJSP - Tribunal de Justiça de São Paulo
```env
PJE_BASE_URL=https://pje.tjsp.jus.br
PJE_APP_NAME=pje-tjsp-1g
PJE_APP_NAME=pje-tjsp-2g
```

#### TJMG - Tribunal de Justiça de Minas Gerais
```env
PJE_BASE_URL=https://pje.tjmg.jus.br
PJE_APP_NAME=pje-tjmg-1g
PJE_APP_NAME=pje-tjmg-2g
```

#### TJRJ - Tribunal de Justiça do Rio de Janeiro
```env
PJE_BASE_URL=https://pje.tjrj.jus.br
PJE_APP_NAME=pje-tjrj-1g
PJE_APP_NAME=pje-tjrj-2g
```

### Tribunais Regionais Federais

#### TRF1 - 1ª Região
```env
PJE_BASE_URL=https://pje1g.trf1.jus.br
PJE_APP_NAME=pje-trf1
```

#### TRF2 - 2ª Região
```env
PJE_BASE_URL=https://pje.trf2.jus.br
PJE_APP_NAME=pje-trf2
```

#### TRF3 - 3ª Região
```env
PJE_BASE_URL=https://pje.trf3.jus.br
PJE_APP_NAME=pje-trf3
```

#### TRF4 - 4ª Região
```env
PJE_BASE_URL=https://pje.trf4.jus.br
PJE_APP_NAME=pje-trf4
```

#### TRF5 - 5ª Região
```env
PJE_BASE_URL=https://pje.trf5.jus.br
PJE_APP_NAME=pje-trf5
```

#### TRF6 - 6ª Região
```env
PJE_BASE_URL=https://pje.trf6.jus.br
PJE_APP_NAME=pje-trf6
```

### Tribunais Superiores

#### STJ - Superior Tribunal de Justiça
```env
PJE_BASE_URL=https://pje.stj.jus.br
PJE_APP_NAME=pje-stj
```

#### TST - Tribunal Superior do Trabalho
```env
PJE_BASE_URL=https://pje.tst.jus.br
PJE_APP_NAME=pje-tst
```

## Particularidades por Tribunal

### TJSP
- Maior volume de processos
- Requer certificado ICP-Brasil
- APIs otimizadas para alto volume

### TJMG
- Integração com SINTER
- Suporte a peticionamento em lote
- APIs específicas para precatórios

### TRF5
- Abrange: PE, AL, SE, PB, RN, CE
- APIs unificadas para toda região
- Suporte a JEF (Juizado Especial Federal)

## Testando Conexão

### Comando Básico
```
Configure o PJE do [TRIBUNAL]
```

### Verificar Endpoints
```
Liste os órgãos julgadores
```

### Testar Autenticação
```
Liste meus processos
```

## URLs Alternativas

Alguns tribunais possuem URLs diferentes para:

### Produção
- URL principal do tribunal

### Homologação
- Geralmente: `https://pje-homo.tribunal.jus.br`
- Para testes antes da produção

### Treinamento
- Geralmente: `https://pje-treina.tribunal.jus.br`
- Para capacitação de usuários

## Suporte Específico

### Consulta Pública
Todos os tribunais suportam:
- Busca por número
- Consulta de movimentações
- Download de documentos públicos

### Funcionalidades Autenticadas
Com certificado digital:
- Peticionamento
- Consulta completa
- Download de documentos sigilosos
- Intimações

## Status de Implementação

| Tribunal | Consulta | Peticionamento | Observações |
|----------|----------|----------------|-------------|
| TJCE | ✅ | ✅ | Totalmente funcional |
| TRF5 | ✅ | ✅ | Totalmente funcional |
| TJMG | ✅ | ⚠️ | Em testes |
| TJSP | ✅ | 🔄 | Em desenvolvimento |
| Outros | ✅ | ❓ | Não testado |

Legenda:
- ✅ Funcionando
- ⚠️ Parcialmente
- 🔄 Em desenvolvimento
- ❓ Não testado 