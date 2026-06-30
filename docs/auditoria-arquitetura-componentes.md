# Auditoria de Arquitetura de Componentes

**Projeto:** A Biblioteca  
**Data:** 29/06/2026  
**Critério:** Domínio vs. Padrão Visual  
**Regra:** Componentes de domínio NUNCA se unificam. Componentes de padrão visual se tornam base do DS.

---

## Classificação: 102 Componentes → 4 Níveis

---

## NÍVEL 1 — Primitive

Blocos atômicos. Não têm semântica de layout nem de domínio. Apenas expressam uma propriedade visual (superfície, cor, sombra, tipografia, ícone).

| Componente | Localização | Tipo | Observação |
|---|---|---|---|
| Surface | `ds/` | Padrão visual | Container genérico (elevação, borda, bg) |
| Paper | `ds/` | Padrão visual | Superfície papel (algodão, velho, caderno, cartão) |
| WoodSurface | `ds/` | Padrão visual | Superfície madeira (5 tons) |
| Notebook | `ds/` | Padrão visual | Superfície caderno (pautado, sem espiral, liso) |
| Envelope | `ds/` | Padrão visual | Superfície carta (fechado, sem dobra, aberto) |
| Shadow | `ds/` | Padrão visual | Wrapper de sombra (6 níveis) |
| Ribbon | `ds/` | Padrão visual | Faixa decorativa (6 cores × 3 variantes) |
| DDivider | `ds/` | Padrão visual | Divisor (5 variantes × 4 spacings) |
| IconContainer | `ds/` | Padrão visual | Container de ícone (sizes, shapes, colors) |
| BotanicalDecoration | `ds/` | Padrão visual | Ornamento SVG decorativo |
| Badge | `ui/` | Padrão visual | Pill display (size + variant) |
| ConnectionChip | `ui/` | Padrão visual | Pill interativa (emoji + label) |
| Typography | `ui/` | Padrão visual | Primitivo tipográfico |
| GlassCard | `ui/` | Padrão visual | Wrapper glassmorphism |

**Total Nível 1: 14 componentes**

---

## NÍVEL 2 — Layout

Compõem primitivos para formar padrões de interface reutilizáveis. Não sabem nada sobre fórmulas, casos ou protocolos — apenas sobre disposição de informação.

| Componente | Localização | Tipo | Existe? | Ação |
|---|---|---|---|---|
| EditorialCard | `ds/` | Padrão visual | ✅ Existe | Já é base — expandir slots |
| DSectionTitle | `ds/` | Padrão visual | ✅ Existe | Manter |
| **PageHeader** | — | Padrão visual | ❌ Criar | H1 + count + action slot |
| **FeatureLayout** | — | Padrão visual | ❌ Criar | Header + sidebar grid + content |
| **FeatureSidebar** | — | Padrão visual | ❌ Criar | Container sticky com scroll |
| **SearchInput** | — | Padrão visual | ❌ Criar | Icon + input + clear (2 modes) |
| **FilterPanel** | — | Padrão visual | ❌ Criar | Sections + toggles + clear |
| **TimelineBase** | — | Padrão visual | ❌ Criar | Dot + wire + renderItem slot |
| **VersionList** | — | Padrão visual | ❌ Criar | Trail + selectable items |
| **FormLayout** | — | Padrão visual | ❌ Criar | Sections + fields + button bar |
| **LoadingSkeleton** | — | Padrão visual | ❌ Criar | Shimmer animation + shapes |
| EmptyState | `ui/` | Padrão visual | ✅ Existe | Manter como base |
| Sidebar (global nav) | `ui/` | Padrão visual | ✅ Existe | Manter (é navegação global) |
| TopBar | `ui/` | Padrão visual | ✅ Existe | Manter |

**Total Nível 2: 14 (4 existem, 10 a criar)**

---

## NÍVEL 3 — Domain Generic

Compõem layouts com semântica de domínio genérica. Sabem que existe uma "entidade" com título, status, metadata, conexões — mas não sabem qual entidade é.

| Componente | Compõe (Nível 2) | Existe? | Ação |
|---|---|---|---|
| **EntityCard** | EditorialCard | ✅ Existe (`ui/`) | Refatorar sobre EditorialCard |
| **EntityHeader** | PageHeader | ❌ Criar | Título + status + ações da entidade |
| **EntityMetadata** | — | ❌ Criar | Definition list + chips + links |
| **EntityTimeline** | TimelineBase | ❌ Criar | Timeline com status + autor + data |
| **EntityConnections** | — | ❌ Criar | Lista de conexões entre entidades |
| **EntityStatus** | Badge | ❌ Criar | Status badge genérico (cor + label) |
| **EntityFilters** | FilterPanel | ❌ Criar | Status + tipo + tag filters |
| **EntitySearch** | SearchInput | ❌ Criar | Search bound a listagem de entidades |
| **EntityLoading** | LoadingSkeleton | ❌ Criar | Skeleton com shape de card |
| **EntityEmptyState** | EmptyState | ❌ Criar | Empty com CTA de criação |
| **EntityEditor** | FormLayout | ❌ Criar | Form padrão de CRUD |
| **EntityVersionHistory** | VersionList | ❌ Criar | Histórico versionado genérico |

**Total Nível 3: 12 (1 existe, 11 a criar)**

---

## NÍVEL 4 — Domain Specific

Compõem genéricos com lógica e dados de um domínio específico. Representam conceitos do negócio. **NUNCA se unificam entre si.**

### Fórmulas (15 componentes)

| Componente | Nível 3 que compõe | Domínio-específico porque... |
|---|---|---|
| FormulaCard | EntityCard | Acento gradiente, ingredient count, version |
| FormulaHeader | EntityHeader/PageHeader | — (eliminável) |
| FormulaStatus | EntityStatus | Estados: rascunho/ativa/arquivada/obsoleta |
| FormulaSearch | EntitySearch | — (eliminável) |
| FormulaFilters | EntityFilters | Filtros: categoria, fase, ingrediente ativo |
| FormulaSidebar | FeatureSidebar | — (eliminável) |
| FormulaLoading | EntityLoading | — (eliminável) |
| FormulaTimeline | EntityTimeline | Evolução cronológica ascendente |
| FormulaVersionHistory | EntityVersionHistory | Seleção + comparação interativa |
| FormulaEditor | EntityEditor | Ingredient list, asset search, phase system |
| FormulaConnections | EntityConnections | — (thin wrapper, possivelmente eliminável) |
| FormulaLayout | FeatureLayout | — (eliminável) |
| FormulaIngredient | — | ✅ 100% domínio (INCI, concentração, fase) |
| FormulaComposition | — | ✅ 100% domínio (gráfico de composição) |
| FormulaComparison | — | ✅ 100% domínio (diff entre versões) |

### Casos Clínicos (15 componentes)

| Componente | Nível 3 que compõe | Domínio-específico porque... |
|---|---|---|
| CaseCard | EntityCard | Acento neutro, evolution/photo counts |
| CaseHeader | EntityHeader/PageHeader | — (eliminável) |
| CaseStatus | EntityStatus | Estados: ativo/concluído/acompanhamento |
| CaseSearch | EntitySearch | — (eliminável) |
| CaseFilters | EntityFilters | Filtros: tipo pele, queixa, evolução |
| CaseSidebar | FeatureSidebar | — (eliminável) |
| CaseLoading | EntityLoading | — (eliminável) |
| CaseTimeline | EntityTimeline | Consultas + evoluções |
| CaseHistory | EntityVersionHistory | Histórico clínico |
| CaseEditor | EntityEditor | 2-column grid, tag suggestions |
| CaseConnections | EntityConnections | — (thin wrapper, possivelmente eliminável) |
| ClinicalLayout | FeatureLayout | — (eliminável) |
| CaseSummary | — | ✅ 100% domínio (resumo clínico) |
| EvolutionCard | — | ✅ 100% domínio (evolução fotográfica) |
| ClinicalPhotoGallery | — | ✅ 100% domínio (galeria antes/depois) |

### Acervo / Referências (12 componentes)

| Componente | Nível 3 que compõe | Domínio-específico porque... |
|---|---|---|
| ReferenceCard | EntityCard | Acento por nível de evidência, DOI/PMID |
| ReferenceHeader | EntityHeader/PageHeader | — (eliminável) |
| ReferenceSearch | EntitySearch | — (eliminável) |
| ReferenceFilters | EntityFilters | Filtros: tipo publicação, nível evidência, ano |
| ReferenceLoading | EntityLoading | — (eliminável) |
| ReferenceTimeline | EntityTimeline | Histórico de leitura/anotações |
| ReferenceEditor | EntityEditor | Chip variants, wrap-based chips |
| ReferenceConnections | EntityConnections | — (thin wrapper, possivelmente eliminável) |
| ScientificLibraryLayout | FeatureLayout | — (eliminável) |
| ReferenceEmptyState | EntityEmptyState | — (eliminável, copy-only) |
| ReferenceMetadata | EntityMetadata | ✅ Domínio (DOI, PMID, journal, IF, evidence level) |
| ReferenceEvidence | — | ✅ 100% domínio (pirâmide de evidência) |

### Protocolos (15 componentes)

| Componente | Nível 3 que compõe | Domínio-específico porque... |
|---|---|---|
| ProtocolCard | EntityCard | Acento por maturidade, ProtocolEvidence |
| ProtocolHeader | EntityHeader/PageHeader | — (eliminável) |
| ProtocolSearch | EntitySearch | — (eliminável) |
| ProtocolFilters | EntityFilters | Filtros: maturidade, indicação, fase |
| ProtocolSidebar | FeatureSidebar | — (eliminável) |
| ProtocolLoading | EntityLoading | — (eliminável) |
| ProtocolTimeline | EntityTimeline | Revisões com autor + maturidade |
| ProtocolVersionHistory | EntityVersionHistory | Informativo (não interativo) |
| ProtocolEditor | EntityEditor | Maturity radio, phase editor com move/delete |
| ProtocolConnections | EntityConnections | — (thin wrapper, possivelmente eliminável) |
| ProtocolLayout | FeatureLayout | — (eliminável) |
| ProtocolEmptyState | EntityEmptyState | — (eliminável, copy-only) |
| ProtocolEvidence | — | ✅ 100% domínio (nível de evidência protocolar) |
| ProtocolSequence | — | ✅ 100% domínio (sequência de etapas) |
| ProtocolContraindications | — | ✅ 100% domínio (contraindicações) |

### Caderno de Observações (13 componentes)

| Componente | Nível 3 que compõe | Domínio-específico porque... |
|---|---|---|
| ObservationCard | EntityCard | Type-variant system (7 tipos com textura) |
| NotebookHeader | EntityHeader/PageHeader | — (eliminável) |
| NotebookSearch | EntitySearch | — (eliminável) |
| NotebookSidebar | FeatureSidebar | — (eliminável) |
| NotebookLoading | EntityLoading | — (eliminável) |
| ObservationStatus | EntityStatus | Pontos de maturidade epistêmica (qualitativo) |
| ObservationTimeline | EntityTimeline | Épocas de edição epistêmica |
| ObservationHistory | EntityVersionHistory | Histórico de observação |
| ObservationEditor | EntityEditor | Type selector, review mode |
| ObservationConnections | EntityConnections | — (thin wrapper, possivelmente eliminável) |
| NotebookLayout | FeatureLayout | — (eliminável) |
| NotebookEmptyState | EntityEmptyState | — (eliminável, copy-only) |
| ObservationToolbar | — | ✅ 100% domínio (ações de observação) |

### Mesa (4 componentes)

| Componente | Nível 3 que compõe | Domínio-específico porque... |
|---|---|---|
| LoadingPaper | LoadingSkeleton | Shape BilheteAurora |
| LoadingCard | LoadingSkeleton | Shape card genérico |
| LoadingShelf | LoadingSkeleton | Shape full-page |
| MesaSessionManager | — | ✅ 100% domínio (gestão de sessão) |

### UI Legacy (parcialmente redundantes)

| Componente | Destino | Ação |
|---|---|---|
| Divider | DDivider (Nível 1) | Eliminar — superset existe |
| SectionTitle | DSectionTitle (Nível 2) | Eliminar — superset existe |
| SearchBar | SearchInput (Nível 2) | Eliminar — será criado |
| PaperCard | EntityCard (Nível 3) | Avaliar — layout editorial único, pode permanecer |
| EntityCard | EntityCard (Nível 3) | Refatorar sobre EditorialCard |
| AssinaturaAurora | — | ✅ Domínio (manter) |
| BilheteAurora | — | ✅ Domínio (manter) |
| BilheteAuroraFechado | — | ✅ Domínio (manter) |
| BilheteAuroraAberto | — | ✅ Domínio (manter) |

---

## ÁRVORE HIERÁRQUICA COMPLETA

```
NÍVEL 1 — Primitive
│
├── Surface
├── Paper
├── WoodSurface
├── Notebook
├── Envelope
├── Shadow
├── Ribbon
├── DDivider
├── IconContainer
├── BotanicalDecoration
├── Badge
├── ConnectionChip
├── Typography
└── GlassCard
     │
     ▼
NÍVEL 2 — Layout
│
├── EditorialCard ─────────────────────┐
├── DSectionTitle                      │
├── PageHeader (CRIAR)                 │
├── FeatureLayout (CRIAR)              │
├── FeatureSidebar (CRIAR)             │
├── SearchInput (CRIAR)                │
├── FilterPanel (CRIAR)                │
├── TimelineBase (CRIAR)               │
├── VersionList (CRIAR)                │
├── FormLayout (CRIAR)                 │
├── LoadingSkeleton (CRIAR)            │
├── EmptyState                         │
├── Sidebar (nav global)               │
└── TopBar                             │
     │                                 │
     ▼                                 │
NÍVEL 3 — Domain Generic               │
│                                      │
├── EntityCard ◄───────────────────────┘
├── EntityHeader (CRIAR)
├── EntityMetadata (CRIAR)
├── EntityTimeline (CRIAR)
├── EntityConnections (CRIAR)
├── EntityStatus (CRIAR)
├── EntityFilters (CRIAR)
├── EntitySearch (CRIAR)
├── EntityLoading (CRIAR)
├── EntityEmptyState (CRIAR)
├── EntityEditor (CRIAR)
└── EntityVersionHistory (CRIAR)
     │
     ▼
NÍVEL 4 — Domain Specific
│
├── 📦 Fórmulas
│   ├── FormulaCard (thin: EntityCard + acento gradiente)
│   ├── FormulaStatus (thin: EntityStatus + estados fórmula)
│   ├── FormulaTimeline (thin: EntityTimeline + evolução ascendente)
│   ├── FormulaVersionHistory (thin: EntityVersionHistory + comparação)
│   ├── FormulaEditor (thin: EntityEditor + ingredients + phases)
│   ├── FormulaIngredient ← 100% DOMÍNIO
│   ├── FormulaComposition ← 100% DOMÍNIO
│   └── FormulaComparison ← 100% DOMÍNIO
│
├── 📦 Casos Clínicos
│   ├── CaseCard (thin: EntityCard + acento neutro)
│   ├── CaseStatus (thin: EntityStatus + estados clínicos)
│   ├── CaseTimeline (thin: EntityTimeline + consultas)
│   ├── CaseHistory (thin: EntityVersionHistory + histórico)
│   ├── CaseEditor (thin: EntityEditor + 2-col grid)
│   ├── CaseSummary ← 100% DOMÍNIO
│   ├── EvolutionCard ← 100% DOMÍNIO
│   └── ClinicalPhotoGallery ← 100% DOMÍNIO
│
├── 📦 Acervo (Referências)
│   ├── ReferenceCard (thin: EntityCard + evidence level accent)
│   ├── ReferenceTimeline (thin: EntityTimeline + anotações)
│   ├── ReferenceEditor (thin: EntityEditor + chip variants)
│   ├── ReferenceMetadata ← 100% DOMÍNIO (DOI, PMID, IF)
│   └── ReferenceEvidence ← 100% DOMÍNIO
│
├── 📦 Protocolos
│   ├── ProtocolCard (thin: EntityCard + maturidade accent)
│   ├── ProtocolTimeline (thin: EntityTimeline + revisões)
│   ├── ProtocolVersionHistory (thin: EntityVersionHistory + read-only)
│   ├── ProtocolEditor (thin: EntityEditor + maturity + phases)
│   ├── ProtocolEvidence ← 100% DOMÍNIO
│   ├── ProtocolSequence ← 100% DOMÍNIO
│   └── ProtocolContraindications ← 100% DOMÍNIO
│
├── 📦 Caderno de Observações
│   ├── ObservationCard (thin: EntityCard + type-variant textures)
│   ├── ObservationStatus (thin: EntityStatus + pontos epistêmicos)
│   ├── ObservationTimeline (thin: EntityTimeline + épocas)
│   ├── ObservationHistory (thin: EntityVersionHistory)
│   ├── ObservationEditor (thin: EntityEditor + type selector + review)
│   └── ObservationToolbar ← 100% DOMÍNIO
│
├── 📦 Mesa
│   └── MesaSessionManager ← 100% DOMÍNIO
│
└── 📦 Bilhetes Aurora (Domínio)
    ├── AssinaturaAurora
    ├── BilheteAurora
    ├── BilheteAuroraFechado
    └── BilheteAuroraAberto
```

---

## COMPONENTES A ELIMINAR APÓS REFATORAÇÃO

### Eliminação imediata (redundância pura)

| Componente atual | Substituído por | Razão |
|---|---|---|
| `ui/Divider` | `ds/DDivider` | Superset já existe |
| `ui/SectionTitle` | `ds/DSectionTitle` | Superset já existe |
| `ui/SearchBar` | `SearchInput` (Nível 2) | Será substituído |

### Eliminação por absorção no Nível 2

| Componente atual | Absorvido por | Razão |
|---|---|---|
| `FormulaLayout` | `FeatureLayout` | Padrão visual idêntico |
| `ClinicalLayout` | `FeatureLayout` | Padrão visual idêntico |
| `ScientificLibraryLayout` | `FeatureLayout` | Padrão visual idêntico |
| `ProtocolLayout` | `FeatureLayout` | Padrão visual idêntico |
| `NotebookLayout` | `FeatureLayout` | Padrão visual idêntico |
| `FormulaHeader` | `PageHeader` | Padrão visual idêntico |
| `CaseHeader` | `PageHeader` | Padrão visual idêntico |
| `ReferenceHeader` | `PageHeader` | Padrão visual idêntico |
| `ProtocolHeader` | `PageHeader` | Padrão visual idêntico |
| `NotebookHeader` | `PageHeader` | Padrão visual idêntico |
| `FormulaSearch` | `SearchInput` | Padrão visual idêntico |
| `CaseSearch` | `SearchInput` | Padrão visual idêntico |
| `ReferenceSearch` | `SearchInput` | Padrão visual idêntico |
| `ProtocolSearch` | `SearchInput` | Padrão visual idêntico |
| `NotebookSearch` | `SearchInput` | Padrão visual idêntico |
| `FormulaSidebar` | `FeatureSidebar` | Padrão visual idêntico |
| `CaseSidebar` | `FeatureSidebar` | Padrão visual idêntico |
| `ProtocolSidebar` | `FeatureSidebar` | Padrão visual idêntico |
| `NotebookSidebar` | `FeatureSidebar` | Padrão visual idêntico |
| `FormulaLoading` | `LoadingSkeleton` | Padrão visual |
| `CaseLoading` | `LoadingSkeleton`/`EntityLoading` | Padrão visual |
| `ReferenceLoading` | `LoadingSkeleton`/`EntityLoading` | Padrão visual |
| `ProtocolLoading` | `LoadingSkeleton`/`EntityLoading` | Padrão visual |
| `NotebookLoading` | `LoadingSkeleton`/`EntityLoading` | Padrão visual |
| `LoadingPaper` | `LoadingSkeleton` | Shape específico, não componente |
| `LoadingCard` | `LoadingSkeleton` | Shape específico, não componente |
| `LoadingShelf` | `LoadingSkeleton` | Shape específico, não componente |

### Eliminação por absorção no Nível 3

| Componente atual | Absorvido por | Razão |
|---|---|---|
| `FormulaFilters` | `EntityFilters` + config | Padrão com dados de domínio |
| `CaseFilters` | `EntityFilters` + config | Padrão com dados de domínio |
| `ReferenceFilters` | `EntityFilters` + config | Padrão com dados de domínio |
| `ProtocolFilters` | `EntityFilters` + config | Padrão com dados de domínio |
| `FormulaConnections` | `EntityConnections` | Thin wrapper |
| `CaseConnections` | `EntityConnections` | Thin wrapper |
| `ReferenceConnections` | `EntityConnections` | Thin wrapper |
| `ProtocolConnections` | `EntityConnections` | Thin wrapper |
| `ObservationConnections` | `EntityConnections` | Thin wrapper |
| `ReferenceEmptyState` | `EntityEmptyState` + copy | Apenas copy diferente |
| `ProtocolEmptyState` | `EntityEmptyState` + copy | Apenas copy diferente |
| `NotebookEmptyState` | `EntityEmptyState` + copy | Apenas copy diferente |

---

## CONTAGEM FINAL

| Métrica | Antes | Depois |
|---|---|---|
| Total de componentes | 102 | 63 |
| Componentes eliminados | — | **39** |
| Nível 1 (Primitive) | 14 | 14 (sem mudança) |
| Nível 2 (Layout) | 4 existentes | 14 (10 criados) |
| Nível 3 (Domain Generic) | 1 existente | 12 (11 criados) |
| Nível 4 (Domain Specific) | 74 | 37 (37 eliminados por absorção) |
| Componentes de UI legacy eliminados | — | 3 |

### Resultado líquido: +21 novos componentes base, −39 componentes redundantes = **−18 net**

A biblioteca passa de **102 componentes sem hierarquia clara** para **63 componentes em 4 níveis rigorosos**, onde cada nível só depende do anterior e nunca inverte a hierarquia.

---

*Relatório gerado automaticamente. Nenhum arquivo foi alterado.*
