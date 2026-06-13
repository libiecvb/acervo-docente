# Regras do Agente Claude Code
Este projeto é um Catálogo de livros construído com React 19, Next 16, Tailwind v4. Suas decisões devem focar em performance e segurança

## Gerenciamento de Memória e Sessão
Sempre que o usuário disser "salve a sessão" ou "pausa", você DEVE:
1. Ler o histórico recente da nossa conversa atual.
2. Atualizar ou criar o arquivo `.claude_memory.md` na raiz do projeto.
3. Registrar de forma concisa as alterações de código feitas, bugs resolvidos e o estado atual do raciocínio.
4. Listar claramente as tarefas pendentes para a próxima sessão.

## Atualização Contínua da Arquitetura
Sempre que houver modificações estruturais no projeto — como alteração na árvore de diretórios, adição de novas dependências de peso, criação de novos serviços, componentes centrais ou novos servidores MCP —, você DEVE:
1. Mapear o impacto dessas alterações na visão macro do sistema.
2. Atualizar automaticamente o arquivo `analise_arquitetura.md` na raiz do workspace.
3. Garantir que o documento contenha divisões claras sobre:
   - **Estrutura do Repositório:** Árvore de pastas atualizada se houver mudanças significativas.
   - **Fluxo de Dados/Componentes:** Como os módulos interagem entre si.
   - **Pilha Tecnológica:** Ferramentas, bibliotecas e integrações ativas (ex: Upstash, bancos de dados, etc.).
4. Realizar essa atualização de forma proativa ao finalizar uma tarefa de refatoração ou implementação que altere o design do software.