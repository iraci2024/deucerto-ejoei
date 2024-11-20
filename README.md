# Deucerto Enjoei - Sistema de Rastreamento de Usuários

Este projeto é um sistema de rastreamento de ações de usuários para o site Enjoei, incluindo um painel de administração em tempo real.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em seu computador Windows:

1. [Node.js](https://nodejs.org/) (versão 14.x ou superior)
2. [Git](https://git-scm.com/download/win)

## Instalação

**Nota importante:** Se você já clonou o repositório anteriormente, certifique-se de atualizar seu repositório local antes de instalar as dependências:
```
git pull origin main
```


Siga estes passos para instalar e configurar o projeto:

1. Abra o Prompt de Comando como administrador:
   - Pressione Win + X e selecione "Prompt de Comando (Admin)"

2. Clone o repositório:
   ```
   git clone https://github.com/iraci2024/deucerto-ejoei.git
   ```

3. Entre na pasta do projeto:
   ```
   cd deucerto-ejoei
   ```

4. Instale as dependências:
   ```
   npm install
   ```

## Executando o Sistema

Para iniciar o servidor e o sistema de rastreamento:

1. No Prompt de Comando, dentro da pasta do projeto, execute:
   ```
   node server.js
   ```

2. Você verá a mensagem "Server running on port 3000" quando o servidor estiver pronto.

3. Abra seu navegador e acesse:
   - http://localhost:3000 (para ver o site principal)
   - http://localhost:3000/admin (para acessar o painel de administração)

## Usando o Sistema

1. Site Principal (http://localhost:3000):
   - Navegue pelas diferentes páginas do site.
   - Preencha os formulários (não é necessário usar dados reais).

2. Painel de Administração (http://localhost:3000/admin):
   - Veja em tempo real as ações dos usuários no site.
   - Observe o número de usuários online.

## Encerrando o Sistema

Para parar o servidor:

1. Volte ao Prompt de Comando onde o servidor está rodando.
2. Pressione Ctrl + C.
3. Confirme a ação pressionando 'S' e Enter, se solicitado.

## Suporte

Se encontrar problemas ou tiver dúvidas, por favor, abra uma issue no GitHub:
https://github.com/iraci2024/deucerto-ejoei/issues

