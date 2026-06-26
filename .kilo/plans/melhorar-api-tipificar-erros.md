# Plano: Melhorar API - Tipificar Erros

## Objetivo
Transformar a resposta de erro genérica (500 + "Erro ao buscar livros") em respostas tipadas que diferenciem tipos de erro e permitem melhor tratamento no frontend.

## Arquivo Alvo
`app/api/books/route.ts`

## Alterações Propostas

### 1. Adicionar Interface de Erro Tipada

```typescript
interface ErrorResponse {
  error: string          // Mensagem amigável para usuário
  code: 'UPSTASH_UNAVAILABLE' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'INTERNAL_ERROR'
  retryable: boolean     // Indica se usuário pode tentar novamente
  items: never[]         // Sempre array vazio em erros
  total: 0
  page: 1
  hasMore: false
}
```

### 2. Criar Função `handleSearchError`

Função pura que classifica erros por tipo:
- **UPSTASH_UNAVAILABLE**: Credenciais faltando, índice não existe
- **RATE_LIMITED**: HTTP 429, limite excedido
- **NETWORK_ERROR**: Timeout, DNS, conexão recusada
- **INTERNAL_ERROR**: Qualquer outro erro inesperado

### 3. Modificar Status HTTP

| Código | Status | Retryable |
|--------|--------|-----------|
| UPSTASH_UNAVAILABLE | 503 | ✅ |
| RATE_LIMITED | 503 | ✅ |
| NETWORK_ERROR | 503 | ✅ |
| INTERNAL_ERROR | 500 | ⚠️ |

### 4. Atualizar `catch` Block

```typescript
catch (error) {
  console.error('[API /books] Erro:', error)
  const errorResponse = handleSearchError(error)
  return NextResponse.json(
    errorResponse,
    { status: errorResponse.retryable ? 503 : 500 }
  )
}
```

## Arquivos a Modificar
- `app/api/books/route.ts` - Arquivo principal (único arquivo a editar)

## Benefícios
1. Frontend pode mostrar mensagens específicas
2. Usuário entende o que aconteceu
3. Botão "Tentar Novamente" aparece apenas quando útil
4. Log mais claro para debugging

## Testes a Adicionar
- Teste unitário para `handleSearchError` com cada tipo de erro
- Teste de integração verificando status codes corretos

## Implementação
1. Adicionar `ErrorResponse` interface
2. Adicionar `handleSearchError` function
3. Substituir catch block atual
4. Atualizar imports (manter apenas `searchBooks` do `@/lib/search`)