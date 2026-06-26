# Security Policy

## Versões Suportadas

| Versão | Suportada |
|--------|-----------|
| 0.1.x | ✅ Sim |
| < 0.1.0 | ❌ Não |

## Reportar Vulnerabilidade

Levamos segurança a sério. Se você encontrou uma vulnerabilidade, por favor, reporte-a de forma responsável.

### Como Reportar

Envie um e-mail para:

**bibliotecaiecvb@gmail.com**

Com as seguintes informações:

1. **Tipo de vulnerabilidade** (ex: XSS, SQL injection, auth bypass, data leak)
2. **Descrição detalhada** do problema
3. **Passos para reproduzir** (POC, screenshots, logs)
4. **Impacto potencial** (baixo, médio, alto, crítico)
5. **Ambiente afetado** (versão, branch, URL)
6. **Sugestão de correção** (se aplicável)

### O que NÃO fazer

- ❌ Não abra uma issue pública com detalhes da vulnerabilidade
- ❌ Não explore além do necessário para demonstrar o problema
- ❌ Não acesse dados de outros usuários
- ❌ Não execute ataques de negação de serviço (DoS)
- ❌ Não compartilhe a vulnerabilidade publicamente antes da correção

## Tempo de Resposta

| Severidade | SLA de Resposta | SLA de Correção |
|------------|-----------------|-----------------|
| **Crítica** (RCE, data breach) | 24 horas | 7 dias |
| **Alta** (auth bypass, privilege escalation) | 48 horas | 14 dias |
| **Média** (XSS stored, IDOR) | 5 dias úteis | 30 dias |
| **Baixa** (info disclosure, best practice) | 10 dias úteis | 60 dias |

## Escopo

### Em Escopo

- Aplicação web em produção
- APIs (`/api/*`)
- Autenticação/autorização
- Dados sensíveis (tokens, credenciais, PII)
- Dependências de runtime

### Fora de Escopo

- Vulnerabilidades em dependências de desenvolvimento
- Ataques físicos
- Engenharia social
- Spam/abuso de rate limits (sem bypass)

## Processo

1. **Recebimento** — Confirmamos recebimento em até 24h (críticas) ou 5 dias (baixas)
2. **Triagem** — Validamos relatório e classificamos severidade
3. **Correção** — Desenvolvemos e testamos patch
4. **Release** — Publicamos versão corrigida
5. **Divulgação** — Atualizamos CHANGELOG e SECURITY.md
6. **Agradecimento** — Reconhecemos o pesquisador (se desejar)

## Boas Práticas Internas

- ✅ Nunca comitar secrets (`.env.local` está no `.gitignore`)
- ✅ Usar `.env.example` para template de variáveis
- ✅ Validar inputs em APIs
- ✅ Usar `rel="noopener noreferrer"` em links externos
- ✅ Rate limiting em endpoints sensíveis
- ✅ Dependências atualizadas (`pnpm audit`, Dependabot)
- ✅ Headers de segurança (CSP, HSTS, X-Frame-Options)
- ✅ Logs sem dados sensíveis

## Ferramentas de Segurança

```bash
# Auditoria de dependências
pnpm audit

# Verificar vulnerabilidades no lockfile
pnpm audit --audit-level=high

# Build de produção
pnpm build

# Lint
pnpm lint
```

## Reconhecimento

Agradecemos a todos os pesquisadores que reportam vulnerabilidades de forma responsável.

---

**Última atualização:** 2026-06-21