# [Nome do Endpoint]

`METHOD /api/[endpoint]`

## Descrição

Breve descrição do que este endpoint faz.

## Autenticação

- [ ] Pública
- [ ] Requer autenticação
- [ ] Requer role específica: `[role]`

## Parâmetros

### Query Parameters

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| `param` | `string` | Não | `''` | Descrição |

### Path Parameters

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | `string` | Sim | Descrição |

### Request Body

```json
{
  "field": "value"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `field` | `string` | Sim | Descrição |

## Respostas

### Sucesso: `200 OK`

```json
{
  "field": "value"
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `field` | `string` | Descrição |

### Erro: `400 Bad Request`

```json
{
  "error": "Mensagem de erro"
}
```

### Erro: `401 Unauthorized`

### Erro: `404 Not Found`

### Erro: `500 Internal Server Error`

## Exemplos

### Requisição

```bash
curl -X GET "https://api.example.com/api/endpoint?param=value" \
  -H "Authorization: Bearer <token>"
```

### Resposta

```json
{
  "field": "value"
}
```

## Notas

- Informações adicionais
- Rate limits
- Paginação
- Versionamento