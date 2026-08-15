# Lotrack - Frontend

Sistema de gestão de estoque com controle de lotes, validades e movimentações. O Lotrack permite gerenciar produtos, categorias, fornecedores e lotes, além de registrar entradas, saídas, descartes e ajustes de estoque com rastreabilidade completa.

## 🚀 Funcionalidades

- **Autenticação JWT** com refresh token e controle de sessão
- **Controle de acesso por perfil** (ADMIN, OPERATOR, VIEWER)
- **Gestão de produtos** com SKU, código de barras e estoque mínimo
- **Gestão de categorias e fornecedores**
- **Controle de lotes** com data de validade e rastreabilidade
- **Movimentações de estoque**:
  - Entrada de mercadorias
  - Saída de produtos
  - Ajustes de inventário
  - Descarte de lotes
- **Alertas de lotes vencendo** e produtos com estoque baixo
- **Geração de recibos** de movimentação em PDF
- **Interface responsiva** com tema claro/escuro
- **Aplicação desktop** via Electron

## 🛠️ Tecnologias

- [React 19](https://react.dev/) - Biblioteca de interface
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Vite 8](https://vitejs.dev/) - Build tool
- [Refine](https://refine.dev/) - Framework de CRUD e providers
- [Tailwind CSS 4](https://tailwindcss.com/) - Estilização
- [shadcn/ui](https://ui.shadcn.com/) - Componentes de interface
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Formulários e validação
- [TanStack Table](https://tanstack.com/table) - Tabelas
- [React Router 7](https://reactrouter.com/) - Roteamento
- [i18next](https://www.i18next.com/) - Internacionalização
- [Electron](https://www.electronjs.org/) - Aplicação desktop

## 📋 Pré-requisitos

- Node.js 20 ou superior
- npm ou yarn
- Backend da aplicação em execução (API REST)

## 🔧 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd frontend

# Instale as dependências
npm install
```

## ⚙️ Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_API_URL` | URL base da API | `http://localhost:3000/api` |

## 🚀 Executando o projeto

### Ambiente de desenvolvimento

```bash
# Inicia o servidor de desenvolvimento
npm run dev
```

### Build de produção

```bash
# Gera a build de produção
npm run build
```

### Aplicação desktop (Electron)

```bash
# Executa em modo desenvolvimento
npm run dev

# Gera o executável desktop
npm run build
```

## 📁 Estrutura do projeto

```
src/
├── assets/          # Recursos estáticos (imagens, ícones)
├── components/      # Componentes reutilizáveis
│   └── ui/         # Componentes de UI (shadcn/ui)
├── config/         # Configurações da aplicação
├── context/        # Contextos do React
├── hooks/          # Hooks personalizados
├── layout/         # Layouts da aplicação
├── lib/            # Utilitários
├── pages/          # Páginas da aplicação
│   ├── categories/     # CRUD de categorias
│   ├── login/          # Página de login
│   ├── lots/           # CRUD de lotes
│   ├── products/       # CRUD de produtos
│   ├── stockMovements/ # Movimentações de estoque
│   └── suppliers/      # CRUD de fornecedores
├── providers/      # Providers do Refine
├── services/       # Serviços de API
├── types/          # Tipos TypeScript
├── App.tsx         # Componente raiz
└── main.tsx        # Ponto de entrada
```

## 👥 Perfis de usuário

| Recurso | ADMIN | OPERATOR | VIEWER |
|---------|-------|----------|--------|
| Produtos | CRUD | Leitura | Leitura |
| Categorias | CRUD | Leitura | Leitura |
| Fornecedores | CRUD | Leitura | Leitura |
| Movimentações | Completo | Completo | Leitura |
| Recibos | ✔️ | ✔️ | ❌ |

## 📦 Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção |
| `npm run preview` | Visualiza a build de produção |

## 🗄️ Modelo de dados

O modelo de dados completo está documentado no arquivo [modelagem-de-dados-mvp.md](modelagem-de-dados-mvp.md).

## 📄 Licença

Este projeto é privado e de uso exclusivo.