# Adicionar Livros ao Catálogo

> **Pré-requisitos:** Acesso ao repositório ou credenciais Upstash
> **Tempo estimado:** 10 minutos por livro
> **Nível:** Intermediário

Este guia mostra como adicionar novos livros ao catálogo.

## Opção 1: Edição Direta no JSON (Desenvolvimento)

### 1. Localize o arquivo

```bash
data/books.json
```

### 2. Adicione um novo livro

Siga o formato:

```json
{
  "id": "123",
  "titulo": "Título do Livro",
  "autor": "Nome do Autor",
  "resumo": "Descrição completa do conteúdo, foco pedagógico, público-alvo, etc.",
  "principais_topicos": "Tópico 1, Tópico 2, Tópico 3",
  "link": "https://drive.google.com/file/d/ID_DO_ARQUIVO/view?usp=drivesdk"
}
```

### 3. Formatação

- **ID:** Único e sequencial (verifique o maior ID existente)
- **Título:** Sem abreviações
- **Autor:** Nome completo
- **Resumo:** 2-3 parágrafos descrevendo conteúdo e relevância pedagógica
- **Tópicos:** Separados por vírgula, sem abreviações
- **Link:** URL do Google Drive (arquivo compartilhado)

### 4. Valide o JSON

```bash
# No VS Code: extensão "JSON" ou
node -e "JSON.parse(require('fs').readFileSync('data/books.json'))"
```

### 5. Atualize o índice Upstash

```bash
pnpm seed:search
```

## Opção 2: API de Administração (Produção)

### Endpoint: `POST /api/admin/books`

> **Atenção:** Este endpoint precisa ser implementado e protegido.

```json
{
  "titulo": "Título do Livro",
  "autor": "Nome do Autor",
  "resumo": "...",
  "principais_topicos": "...",
  "link": "..."
}
```

Resposta 201:

```json
{
  "id": "124",
  "message": "Livro adicionado com sucesso"
}
```

## Validação de Dados

### Schema Recomendado (Zod)

Quando implementado:

```typescript
import { z } from 'zod'

const BookSchema = z.object({
  id: z.string().regex(/^\d+$/),
  titulo: z.string().min(1).max(200),
  autor: z.string().min(1).max(100),
  resumo: z.string().min(50),
  principais_topicos: z.string(),
  link: z.string().url().refine(url => url.includes('drive.google.com')),
})
```

## Checklist

- [ ] ID único e sequencial
- [ ] Título completo (sem abreviações)
- [ ] Autor identificado corretamente
- [ ] Resumo descreve conteúdo + relevância pedagógica
- [ ] Tópicos separados por vírgula
- [ ] Link do Google Drive compartilhado
- [ ] JSON válido (sem vírgulas extras)
- [ ] Índice Upstash atualizado (produção)

## Próximos Passos

- [Popular Upstash](seeding-upstash.md) — Atualize o índice de busca
- [API Reference](../reference/api/books.md) — Entenda a busca