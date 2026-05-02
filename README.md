# Vector Learn 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Lighthouse Score](https://img.shields.io/badge/Lighthouse-100-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shielsds.io/badge/TypeScript-5-blue)
![Three.js](https://img.shields.io/badge/Three.js-r160-black)

Uma plataforma educacional de ponta desenvolvida para transformar a complexidade da **Análise Espacial** em uma experiência visual, interativa e gamificada.

---

## 🌟 Do Problema à Solução

### **Situação**

O aprendizado de vetores e análise espacial no ensino superior frequentemente esbarra em abstrações matemáticas densas, onde os alunos têm dificuldade em visualizar como fórmulas se traduzem em movimento e força no mundo real.

### **Tarefa**

Meu objetivo foi projetar e desenvolver uma solução "full-experience" que não apenas apresentasse o conteúdo, mas permitisse que o estudante manipulasse a física do ambiente, recebendo feedback imediato através de simuladores 2D/3D e um ecossistema de gamificação.

### **Ação**

Arquitetada com **React 18** e **Vite**, utilizei **Three.js** (React Three Fiber) para criar um ambiente 3D imersivo. Desenvolvi um motor matemático robusto em **TypeScript** para garantir precisão nas operações vetoriais. A interface foi construída com **Tailwind CSS** e **Radix UI**, garantindo um Design System coeso e acessível (WCAG 2.2 AA), enquanto o **Framer Motion** foi aplicado para micro-interações que elevam o UX.

### **Resultado**

A Vector-Learn tornou-se uma ferramenta pedagógica de alto impacto, alcançando scores máximos de performance e acessibilidade. Hoje, conta com múltiplos simuladores (Barco, Plano Inclinado, 3D), um sistema de quiz adaptativo e dashboards de progresso que transformam o estudo em uma jornada de conquistas.

---

## 🚀 Começando

Siga estas instruções para configurar o projeto localmente.

### Pré-requisitos

* Node.js (v18 ou superior)
* npm, yarn ou bun

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/Carlos2505dev/Vector-Learn.git
   ```

2. Entre no diretório:

   ```bash
   cd Vector-Learn
   ```

3. Instale as dependências:

   ```bash
   npm install
   # ou
   bun install
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

---

## 🛠️ Stack Tecnológica & Decisões Técnicas

Eu seleciono apenas as melhores ferramentas para garantir que o projeto seja escalável, performático e mantenha um padrão de código de nível industrial:

* **React 18 & Vite**: A escolha pelo Vite em vez do CRA garante builds 10x mais rápidos e um HMR (Hot Module Replacement) instantâneo, otimizando o fluxo de desenvolvimento.
* **Three.js + React Three Fiber**: Para renderização 3D de alta performance, permitindo visualizações complexas sem comprometer o FPS.
* **TypeScript**: Tipagem estática rigorosa para prevenir erros em tempo de execução, especialmente crítica em cálculos matemáticos vetoriais.
* **Tailwind CSS & Shadcn/UI**: Utilizo uma abordagem utilitária combinada com componentes acessíveis para um design premium e consistente.
* **Framer Motion**: Essencial para animações baseadas em estado, tornando a transição entre conceitos matemáticos algo fluido e natural.
* **KaTeX**: A engine mais rápida da web para renderização de fórmulas matemáticas LaTeX.
* **Recharts**: Para dashboards de análise de desempenho do aluno com visualizações de dados limpas.

---

## 🎯 Funcionalidades Principais

### 🕹️ Simuladores Avançados

* **Simulador de Barco**: Aplicação prática de soma vetorial (correnteza vs. propulsão).
* **Plano Inclinado**: Decomposição de forças gravitacionais e normais.
* **Visualizador 3D**: Exploração de eixos X, Y e Z com manipulação orbital.
* **Comparador de Vetores**: Ferramenta para análise visual de magnitude e direção.

### 🏆 Ecossistema de Gamificação

* **Sistema de Badges**: Conquistas automáticas por marcos de aprendizado.
* **Leaderboard**: Ranking em tempo real para incentivar a competição saudável.
* **Streaks & Onboarding**: Tutorial interativo para novos usuários e incentivo à constância.
* **Certificação**: Geração de certificados ao completar trilhas de desafios.

### 📚 Conteúdo Pedagógico

* **Fundamentos**: De escalares a tensores iniciais.
* **Operações**: Soma, Subtração, Produto Escalar e Vetorial com visualização geométrica.
* **Aplicações Reais**: Casos de uso em Física, Engenharia e Computação Gráfica.

---

## 📁 Estrutura Detalhada do Projeto

```bash
src/
├── components/               # Componentes Modulares e Reutilizáveis
│   ├── ui/                  # Componentes base e primitivos (Shadcn/UI + Radix)
│   │   ├── button.tsx, card.tsx, dialog.tsx, etc.
│   ├── simulators/          # Motores de Simulação Física e Matemática
│   │   ├── Vector2DSimulator.tsx   # Simulador de vetores 2D interativo
│   │   ├── Vector3DSimulator.tsx   # Ambiente 3D imersivo com Three.js
│   │   ├── BoatSimulator.tsx       # Simulação: Vetores e Correnteza
│   │   └── InclinedPlaneSimulator.tsx # Simulação: Decomposição de Forças
│   ├── gamification/        # Sistema de Engajamento e Recompensas
│   │   ├── BadgeSystem.tsx         # Sistema de medalhas e conquistas
│   │   ├── Leaderboard.tsx         # Ranking global de estudantes
│   │   ├── Streaks.tsx             # Contador de dias consecutivos
│   │   └── GamificationDashboard.tsx # Dashboard de progresso do aluno
│   ├── math/                # Ferramentas de Suporte Acadêmico
│   │   ├── MathFormula.tsx         # Renderizador de LaTeX (KaTeX)
│   │   ├── EquationSolver.tsx      # Resolutor de operações passo a passo
│   │   └── VectorComparator.tsx    # Ferramenta de análise visual comparativa
│   └── layout/              # Estrutura e Experiência do Usuário (UX)
│       ├── Navigation.tsx          # Navegação inteligente e responsiva
│       ├── HeroVector.tsx          # Visualização hero interativa na Home
│       └── OnboardingTutorial.tsx   # Guia assistido para novos usuários
├── pages/                   # Views Principais e Roteamento
│   ├── Home.tsx             # Dashboard inicial e visão geral
│   ├── Fundamentos.tsx      # Conteúdo teórico e definições básicas
│   ├── Operacoes.tsx        # Prática guiada de álgebra vetorial
│   ├── Simulador.tsx        # Hub central de simuladores
│   └── Desafios.tsx         # Quiz adaptativo e Modo de Teste
├── lib/                     # Núcleo de Lógica e Utilitários
│   ├── vector-math.ts       # Engine matemática de alta precisão
│   └── utils.ts             # Funções utilitárias e helpers de estilo
├── hooks/                   # Custom Hooks para gerenciamento de estado
├── types/                   # Definições e interfaces globais TypeScript
└── index.css                # Design System, Tokens e Estilos Globais
```

---

## ⚡ Performance & Otimizações

* **Code Splitting**: Rotas e simuladores pesados são carregados sob demanda (Lazy Loading).
* **Memoization**: Uso estratégico de `useMemo` e `useCallback` para evitar re-renderizações em cálculos matemáticos intensos.
* **Tree Shaking**: Eliminação de código morto das bibliotecas de ícones e UI.
* **Asset Optimization**: SVGs inline e compressão de texturas 3D.

---

## 🗺️ Roadmap de Futuras Implementações

* [x] **Resolvedor Inteligente**: Calcula operações com vetores de forma automática e mostra o passo a passo.
* [ ] **Internacionalização (i18n)**: Suporte completo para EN, ES e PT-BR com `react-i18next`.
* [ ] **Autenticação**: Integração com Supabase Auth (Social Login e JWT).
* [ ] **Mind-Bot IA**: Chatbot para tirar dúvidas em tempo real.
* [ ] **Dashboard de Professor**: Ferramenta para gestão de turmas e acompanhamento de métricas.
* [ ] **Exportação de PDF**: Relatórios detalhados de desempenho e certificados.
* [ ] **Módulo de Cálculo II**: Integração com integrais de linha e campos vetoriais.
* [ ] **Simulador de Fluidos**: Vetores aplicados à dinâmica de fluidos.
* [ ] **Teste de nível e nivelamento**: Mini quiz para avaliar o conhecimento e adaptar a dificuldade.
* [ ] **Inserção de questões de vestibulares e Enem**: Banco de dados de questões oficiais para treinamento.
* [ ] **Inserção de Anúncios**: Estratégia de monetização via Adsense ou plataformas similares.

---

## 🤝 Contribuindo

Contribuições são o que tornam a comunidade open source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

Veja nosso [CONTRIBUTING.md](CONTRIBUTING.md) para mais detalhes.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

## ✍️ Assinatura

Desenvolvido com paixão, café e muita matemática por:

**Carlos Neto**
*Desenvolvedor Web & Mobile e Entusiasta de Tecnologias Emergentes*

---

> "Transformando abstrações em realidade visual através do código." 🚀
