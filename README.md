# Vector Learn - Plataforma Educacional de Vetores

Uma plataforma educacional revolucionária para aprender os fundamentos dos vetores através de visualizações interativas e simuladores 2D/3D.

## 📚 Sobre Este Projeto

**Vector Learn** foi desenvolvida como projeto de graduação em **Engenharia da Computação** pela **Universidade Jorge Amado (Unijorge)** com o objetivo de facilitar o aprendizado de **Vetores** - um conceito fundamental da disciplina de **Análise Espacial**.

Este projeto foi criado para auxiliar estudantes da Unijorge a compreenderem de forma visual e interativa os conceitos de vetores, operações vetoriais e suas aplicações práticas em engenharia e ciência da computação.

## 🚀 Tecnologias

- **React 18** - Interface moderna e reativa
- **Vite** - Build tool otimizado
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Design system customizado
- **Framer Motion** - Animações fluidas
- **Three.js & React Three Fiber** - Visualizações 3D
- **KaTeX** - Renderização de fórmulas matemáticas
- **Lucide React** - Ícones modernos

## 🎯 Funcionalidades

### 📚 Conteúdo Educacional

- **Fundamentos**: Conceitos básicos de vetores, notação, magnitude e componentes
- **Operações**: Soma, subtração, produto escalar e produto vetorial
- **Exemplos Práticos**: Aplicações em física, matemática e engenharia

### 🎮 Simuladores Interativos

- **Simulador 2D**: Visualização em tempo real com controles deslizantes
- **Operações Visuais**: Soma, subtração, projeção e produtos
- **Componentes Dinâmicos**: Visualização de componentes X e Y
- **Preparado para 3D**: Estrutura pronta para visualizações tridimensionais

### 🏆 Sistema de Desafios

- **Quiz Interativo**: 15+ questões com diferentes níveis
- **Feedback Imediato**: Explicações detalhadas para cada resposta
- **Dicas Contextuais**: Ajuda progressiva para o aprendizado
- **Sistema de Pontuação**: Acompanhamento do progresso

### 🎨 Design e Acessibilidade

- **Design System Completo**: Tokens semânticos para cores e espaçamento
- **Modo Claro/Escuro**: Alternância automática com persistência
- **Responsivo**: Otimizado para desktop, tablet e mobile
- **WCAG 2.2 AA**: Conformidade com padrões de acessibilidade
- **Animações Reduzidas**: Respeita preferências do usuário

## 🛠️ Instalação e Uso

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd vector-learn

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── Navigation.tsx   # Navegação principal
│   ├── Layout.tsx       # Layout base
│   ├── HeroVector.tsx   # Visualização hero interativa
│   ├── MathFormula.tsx  # Renderização de fórmulas
│   ├── ThemeToggle.tsx  # Alternador de tema
│   └── Vector2DSimulator.tsx # Simulador 2D completo
├── pages/               # Páginas da aplicação
│   ├── Home.tsx         # Página inicial
│   ├── Fundamentos.tsx  # Conceitos básicos
│   ├── Operacoes.tsx    # Operações com vetores
│   ├── Simulador.tsx    # Simuladores interativos
│   └── Desafios.tsx     # Quiz e exercícios
├── lib/                 # Utilitários e lógica
│   ├── utils.ts         # Utilidades gerais
│   └── vector-math.ts   # Operações matemáticas
├── hooks/               # React hooks customizados
└── index.css           # Estilos globais e design tokens
```

## 🎨 Design System

### Paleta de Cores

- **Primary (Vector Blue)**: #5B8CFF - Cor principal dos vetores
- **Secondary (Vector Teal)**: #00D1B2 - Operações secundárias  
- **Accent (Vector Orange)**: #FF7A59 - Destaques e acentos
- **Vector Purple**: #8B7CF6 - Visualizações 3D
- **Vector Green**: #4ADE80 - Estados de sucesso
- **Vector Red**: #F87171 - Estados de erro

### Componentes Visuais

- **Gradientes**: Transições suaves entre cores principais
- **Sombras**: Sistema de elevação com cores temáticas
- **Animações**: Transições fluidas com Framer Motion
- **Grid Responsivo**: Layout adaptativo para todos os dispositivos

## 🔧 Funcionalidades Técnicas

### Matemática dos Vetores

- **Operações 2D/3D**: Implementação completa de funções vetoriais
- **Magnitude**: Cálculo de módulo usando teorema de Pitágoras
- **Produto Escalar**: Implementação com interpretação geométrica
- **Produto Vetorial**: Preparado para visualizações 3D
- **Projeções**: Cálculo de projeção de um vetor sobre outro

### Renderização de Fórmulas

- **KaTeX**: Renderização matemática de alta qualidade
- **LaTeX Support**: Suporte completo para notação matemática
- **Inline/Block**: Fórmulas inline e em blocos
- **Fallback**: Tratamento gracioso de erros de sintaxe

### Simuladores

- **Tempo Real**: Atualizações instantâneas baseadas em entrada do usuário
- **SVG Vectorial**: Gráficos escaláveis e nítidos
- **Coordenadas Matemáticas**: Sistema de coordenadas padrão
- **Operações Visuais**: Visualização das operações em tempo real

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm run build
# Deploy via Vercel CLI ou GitHub integration
```

### Netlify

```bash
npm run build
# Upload da pasta dist/ ou conectar via Git
```

### GitHub Pages

```bash
npm run build
# Configure base path no vite.config.ts se necessário
```

## 🧪 Testes

```bash
# Testes unitários (configurar)
npm run test

# Testes E2E (configurar)
npm run test:e2e

# Cobertura
npm run test:coverage
```

## 📊 Performance

### Métricas Alvo

- **Lighthouse Performance**: ≥ 95
- **Acessibilidade**: ≥ 95  
- **Melhores Práticas**: ≥ 95
- **SEO**: ≥ 95

### Otimizações

- **Code Splitting**: Carregamento lazy de rotas
- **Tree Shaking**: Importação seletiva de componentes
- **Asset Optimization**: Imagens e SVGs otimizados
- **Bundle Analysis**: Análise de tamanho de bundle

## 🎓 Conteúdo Pedagógico

### Fundamentos

- Definição de vetor vs escalar
- Notação matemática padrão
- Componentes e decomposição
- Magnitude e vetores unitários

### Operações

- Soma (regra do paralelogramo)
- Subtração (vetores opostos)
- Produto escalar (projeção e ângulo)
- Produto vetorial (3D, preparado)

### Aplicações

- Física: força, velocidade, aceleração
- Computação gráfica: transformações
- Engenharia: análise estrutural
- Navegação: GPS e direcionamento

## 👥 Créditos

- **Curso**: Engenharia da Computação
- **Disciplina**: Análise Espacial
- **Desenvolvido com**: React, TypeScript, Tailwind CSS
- **Matemática**: Implementação baseada em princípios de álgebra linear
- **Design**: Inspirado em plataformas educacionais modernas
- **Acessibilidade**: Seguindo diretrizes WCAG 2.2

## 🎯 Objetivo Educacional

Este projeto foi desenvolvido para servir como ferramenta de apoio pedagógico, permitindo que os estudantes da Unijorge possam:

- ✅ Visualizar conceitos abstratos de vetores de forma concreta
- ✅ Experimentar interativamente com operações vetoriais
- ✅ Exercitar conhecimentos através de desafios práticos
- ✅ Compreender aplicações reais de vetores em engenharia
- ✅ Fortalecer fundamentos de análise espacial

---

**Vector Learn** - Transformando o aprendizado de matemática através da tecnologia 🚀
