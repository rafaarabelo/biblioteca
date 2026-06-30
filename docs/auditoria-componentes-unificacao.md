# Auditoria de Componentes — Unificação Visual

**Projeto:** A Biblioteca  
**Data:** 29/06/2026  
**Escopo:** `src/components/ui/`, `src/components/ds/`, `src/features/*/components/`  
**Objetivo:** Identificar componentes visualmente equivalentes que podem ser unificados  
**Regra:** Nenhuma alteração realizada — apenas relatório

---

## 1. CARDS

### Componentes envolvidos

| Componente | Localização | Wrapper |
|---|---|---|
| PaperCard | `components/ui/` | `<article>` |
| EntityCard | `components/ui/` | `<article>` / `<a>` |
| GlassCard | `components/ui/` | `<div>` (children only) |
| ReferenceCard | `features/acervo/` | `<Link>` |
| FormulaCard | `features/formulas/` | `<Link>` |
| CaseCard | `features/casos/` | `<Link>` |
| ProtocolCard | `features/protocolos/` | `<Link>` |
| ObservationCard | `features/caderno/` | `<Link>` |
| EditorialCard | `components/ds/` | polimórfico (`as`) |

### Subgrupo A — Cards de Entidade (layout horizontal flex)

**Componentes:** ReferenceCard, FormulaCard, CaseCard, ProtocolCard, EntityCard  
**Similaridade:** 78%

Padrão comum:
- Display flex row
- Barra de acento lateral esquerda (4px, cor variável)
- Body: flex-column com gap spacing-2
- Header: código/tipo + título + favorito
- Footer: status badge + metadata + tags
- Hover: border-color shift + shadow + translateY(-2px)

Diferenças:
- ReferenceCard: cor do acento por nível de evidência, DOI/PMID labels
- FormulaCard: acento gradiente, version number + ingredient count
- CaseCard: acento estático neutro, evolution/photo counts
- ProtocolCard: acento dinâmico por maturidade, ProtocolEvidence component
- EntityCard: ícone à direita (não barra esquerda), Badge variant mapping

**Recomendação:** Unificar em `EditorialCard` (já existe no DS) como base. Os 4 feature cards passam a compor `EditorialCard` com slots (accentColor, headerLeft, title, subtitle, footer, tags). CSS duplicado cai ~40%.

### Subgrupo B — PaperCard

**Similaridade com Subgrupo A:** 45%  
**Recomendação:** Manter específico. Layout top-line accent sem barra lateral, metadata inline com separadores (·), uso exclusivo para artigos científicos.

### Subgrupo C — ObservationCard

**Similaridade com Subgrupo A:** 35%  
**Recomendação:** Manter específico. Sistema de type-variant (7 tipos com textura + cor + ícone) é ortogonal aos demais. Background tinting por tipo, posicionamento absoluto do favorito.

### Subgrupo D — GlassCard

**Similaridade:** N/A (wrapper puro)  
**Recomendação:** Manter como utility. Apenas aplica glassmorphism a children.

---

## 2. HEADERS / SECTION TITLES

### Componentes envolvidos

| Componente | Localização | Similaridade |
|---|---|---|
| SectionTitle | `components/ui/` | Legacy |
| DSectionTitle | `components/ds/` | DS (superset) |
| FormulaHeader | `features/formulas/` | 90% entre si |
| CaseHeader | `features/casos/` | 90% entre si |
| ProtocolHeader | `features/protocolos/` | 90% entre si |
| NotebookHeader | `features/caderno/` | 85% (tem tagline) |
| ReferenceHeader | `features/acervo/` | 90% entre si |

### Similaridade geral: 85%

Padrão comum dos 5 feature headers:
```
[Left: H1 + optional count badge] [Right: botão "Novo/Registrar"]
```

Diferenças menores: padding, font vars, badge vs plain count, NotebookHeader tem description/tagline.

**Recomendação:**
- Deprecar `SectionTitle` (legacy) → migrar para `DSectionTitle`
- Criar `PageHeader` genérico que unifica os 5 headers de feature
- Props: `title`, `count?`, `action?`, `tagline?`
- Redução: 5 implementações → 1

---

## 3. SIDEBARS

### Componentes envolvidos

| Componente | Localização |
|---|---|
| Sidebar (global) | `components/ui/` |
| NotebookSidebar | `features/caderno/` |
| Feature layout sidebars | `features/*/` (inline nos layouts) |

### Similaridade: 40%

A sidebar global é navegação (árvore de nav, perfil, logout). As sidebars de feature são filtros domain-specific com lógica própria.

**Recomendação:** Manter separados. Cada feature tem filtros específicos de domínio incompatíveis entre si. Não há ganho real na unificação.

---

## 4. SEARCH BARS

### Componentes envolvidos

| Componente | Localização |
|---|---|
| SearchBar | `components/ui/` |
| CaseSearch | `features/casos/` |
| FormulaSearch | `features/formulas/` |
| ProtocolSearch | `features/protocolos/` |
| ReferenceSearch | `features/acervo/` |

### Similaridade: 92%

Padrão idêntico:
- Wrapper flex
- Ícone à esquerda (absoluto ou flex)
- Input full-width, background transparente
- Botão clear condicional à direita
- Focus state com cor terracota
- Border-radius 6-7px, border 1px solid var(--borda-sutil)
- Transition 0.15s ease

Única diferença: `SearchBar` usa form submit, feature searches usam onChange (filter-as-you-type).

**Recomendação:** Consolidar em `<SearchInput>` único com prop `mode: 'submit' | 'filter'`. Elimina 4 implementações duplicadas.

---

## 5. FILTERS

### Componentes envolvidos

| Componente | Localização |
|---|---|
| CaseFilters | `features/casos/` |
| FormulaFilters | `features/formulas/` |
| ReferenceFilters | `features/acervo/` |
| ProtocolFilters | `features/protocolos/` |

### Similaridade: 78%

Arquitetura comum:
- Container vertical flex (gap spacing-5)
- Seções agrupadas com labels (uppercase, texto-xs)
- Opções toggleáveis (button ou list)
- Estado ativo: color-mix com accent (8-12% opacidade)
- Botão "limpar filtros" condicional
- Tags: 11px padding, border-radius 10px

Diferenças:
- ReferenceFilters usa `<ul>/<li>` semântico com ícones
- ProtocolFilters mistura buttons e listas
- Padding de tags varia 1-2px entre features

**Recomendação:** Criar `<FilterSection>` composável com partes (header, list, tags, clear). Diferenças são data-driven, não estruturais.

---

## 6. EMPTY STATES

### Componentes envolvidos

| Componente | Localização |
|---|---|
| EmptyState | `components/ui/` |
| ReferenceEmptyState | `features/acervo/` |
| ProtocolEmptyState | `features/protocolos/` |
| NotebookEmptyState | `features/caderno/` |

### Similaridade: 88%

Padrão:
- Container centrado (flex, column, center)
- Ícone (emoji ou SVG)
- Título + descrição
- Ação opcional (botão/link)

Diferenças: border (dashed no genérico, nenhum nos custom), padding varia, text-sizing inconsistente (0.9375rem vs 0.875rem).

**Recomendação:** Manter `EmptyState` genérico como base. Features só adicionam copy e ação específica — o que é correto. Harmonizar CSS minor (padding, border).

---

## 7. LOADING STATES

### Componentes envolvidos

| Componente | Localização | Contexto visual |
|---|---|---|
| LoadingCard | `features/mesa/` | Card placeholder |
| LoadingPaper | `features/mesa/` | BilheteAurora skeleton |
| LoadingShelf | `features/mesa/` | Full-page hero |
| CaseLoading | `features/casos/` | List skeleton |

### Similaridade: 72%

Shimmer animation unificada:
```css
@keyframes shimmer { 0% { opacity: 0.3 } 50% { opacity: 0.55 } 100% { opacity: 0.3 } }
```
Tokens consistentes: `var(--muted-fg)`, `var(--card-bg)`, duração 1.8-2s, delays staggered.

Diferença: CaseLoading usa gradient shimmer (background-position), demais usam opacity.

**Recomendação:** Criar `<LoadingSkeleton>` base com animação shimmer e timing. Cada domínio compõe com shapes próprios. Diversidade estrutural é intencional e correta.

---

## 8. DIVIDERS

### Componentes envolvidos

| Componente | Localização |
|---|---|
| Divider | `components/ui/` |
| DDivider | `components/ds/` |

### Similaridade: 95%

`DDivider` é superset completo de `Divider`:
- Divider: `<hr>` com spacing prop (sm/md/lg)
- DDivider: 5 variantes (linha/dupla/pontilhada/ornamento/gradiente) × 4 spacings

**Recomendação:** Deprecar `Divider`, migrar todos os usos para `DDivider`. Quick win imediato.

---

## 9. TIMELINES

### Componentes envolvidos

| Componente | Localização |
|---|---|
| ObservationTimeline | `features/caderno/` |
| FormulaTimeline | `features/formulas/` |
| ProtocolTimeline | `features/protocolos/` |
| FormulaVersionHistory | `features/formulas/` |
| ProtocolVersionHistory | `features/protocolos/` |

### Similaridade (Timelines): 70%

Padrão compartilhado: marcador (ponto/bola) + fio + layout flex, cor ativa terracota-500, min-height 20-24px para linhas.

Diferenças semânticas:
- ObservationTimeline: épocas de edição, confiabilidade epistêmica
- FormulaTimeline: evolução cronológica ascendente
- ProtocolTimeline: revisões com autor, descendente

### Similaridade (Version History): 65%

FormulaVersionHistory é interativo (seleção + comparação), ProtocolVersionHistory é apenas informativo.

**Recomendação:** Criar `<Timeline>` genérico com slots para renderização de item. Base compartilha marcador, fio, gaps. Features mantêm semântica própria via renderProps.

---

## 10. STATUS / BADGES / CHIPS

### Componentes envolvidos

| Componente | Localização | Tipo |
|---|---|---|
| Badge | `components/ui/` | Display (span) |
| ConnectionChip | `components/ui/` | Interativo (button) |
| ObservationStatus | `features/caderno/` | Pontos de maturidade |
| FormulaStatus | `features/formulas/` | Pill categórico |

### Similaridade Badge ↔ ConnectionChip: 75%

Ambos: border-radius-full, inline-flex. Badge é display puro, ConnectionChip é clicável com emoji.

### Similaridade ObservationStatus ↔ FormulaStatus: 30%

Domínios semânticos completamente distintos:
- ObservationStatus: pontos preenchidos = nível de confiança (qualitativo)
- FormulaStatus: pill com cor = estado de versão (categórico)

**Recomendação:**
- Badge + ConnectionChip podem compartilhar base pill (`<BadgePill as="button|span">`), prioridade baixa
- ObservationStatus e FormulaStatus: manter separados — semântica incompatível

---

## 11. METADATA

### Componentes envolvidos

| Componente | Localização |
|---|---|
| ReferenceMetadata | `features/acervo/` |

### Similaridade: N/A (único)

Componente singular que combina seções rotuladas, chips com ícone, definition lists, tags e links. Sem duplicatas, mas serve como padrão de referência para futuras sidebars de metadata.

**Recomendação:** Manter. Considerar como template quando outras features precisarem de metadata sidebar.

---

## 12. EDITORS (Form Pages)

### Componentes envolvidos

| Componente | Localização |
|---|---|
| FormulaEditor | `features/formulas/` |
| CaseEditor | `features/casos/` |
| ProtocolEditor | `features/protocolos/` |
| ReferenceEditor | `features/acervo/` |
| ObservationEditor | `features/caderno/` |

### Similaridade: 62%

Baseline comum (~65% do código):
- Layout coluna (max-width 680-780px)
- Seções com label + input
- Tag/chip inputs
- Botões Submit/Cancel com border-top
- Error messages
- Focus states terracota-500

Diferenças:
- ObservationEditor: type selector + review mode
- CaseEditor: 2-column grid + tag suggestions
- FormulaEditor: ingredient list + asset search + phase system
- ProtocolEditor: maturity radio + phase editor com move/delete

**Recomendação:** Criar `<FormLayout>` com seções, field wrapper, button bar, error display. Features compõem com lógica domain-specific.

---

## 13. LAYOUTS (Page Containers)

### Componentes envolvidos

Todos os 5 feature layouts seguem estrutura idêntica:

```
.layout
├─ .header (border-bottom)
└─ .corpo (grid: 220px | 1fr)
   ├─ .sidebar (sticky, bg secundária)
   └─ .conteudo (flex-1, padding)
```

### Similaridade: 75%

Variações: padding do header (5-8 spacing), sidebar sticky vs static, max-width inconsistente, breakpoint uniforme (768px).

**Recomendação:** Criar `<FeatureLayout header sidebar sidebarWidth={220} sidebarSticky>`. Consolida 5 layouts quase idênticos.

---

## 14. PAPER / NOTEBOOK / SURFACES (DS)

### Componentes envolvidos

| Componente | Localização |
|---|---|
| Paper | `components/ds/` |
| WoodSurface | `components/ds/` |
| Notebook | `components/ds/` |
| Envelope | `components/ds/` |
| Surface | `components/ds/` |

### Similaridade: N/A (Distintos por design)

Cada um representa uma metáfora material única:
- Paper: algodão, velho, caderno, cartão
- WoodSurface: tons de madeira (nogueira→profunda)
- Notebook: caderno de campo (pautado, sem espiral, liso)
- Envelope: carta (fechado, sem dobra, aberto)
- Surface: container genérico (elevação, borda, background)

**Recomendação:** Manter todos. São a fundação do Design System editorial. Nenhuma sobreposição semântica.

---

## Resumo Executivo

### Prioridade ALTA (Quick Wins)

| Ação | Componentes | Redução |
|---|---|---|
| Deprecar Divider → DDivider | 2 → 1 | 100% duplicação eliminada |
| Unificar SearchBars | 5 → 1 | ~90% código duplicado |
| Criar PageHeader | 5 → 1 | ~85% código duplicado |
| Criar FeatureLayout | 5 → 1 | ~75% CSS duplicado |

### Prioridade MÉDIA

| Ação | Componentes | Redução |
|---|---|---|
| Feature Cards → EditorialCard base | 4 → 1 base + 4 thin wrappers | ~40% CSS |
| Criar FilterSection composável | 4 → 1 base | ~60% estrutura |
| Criar Timeline genérico | 3 → 1 base + 3 renderers | ~55% layout |
| Criar FormLayout | 5 → 1 base + 5 composições | ~40% boilerplate |

### Prioridade BAIXA

| Ação | Componentes | Redução |
|---|---|---|
| Badge + ConnectionChip → BadgePill | 2 → 1 base | ~30% |
| LoadingSkeleton base | 4 → 1 base + 4 shapes | ~25% animação |
| EmptyState harmonização CSS | 4 (já ok) | Minor |

### Manter Específicos (NÃO unificar)

- ObservationCard (type-variant system ortogonal)
- PaperCard (layout editorial único)
- GlassCard (utility wrapper)
- ObservationStatus / FormulaStatus (semântica incompatível)
- Sidebar global vs feature sidebars (funções completamente distintas)
- Paper / Notebook / WoodSurface / Envelope / Surface (metáforas materiais do DS)
- ReferenceMetadata (singular, sem duplicata)

---

## Estimativa de Esforço Total

| Prioridade | Horas estimadas |
|---|---|
| Alta (quick wins) | 8-10h |
| Média | 16-20h |
| Baixa | 6-8h |
| **Total** | **30-38h** |

---

*Relatório gerado automaticamente. Nenhum arquivo foi alterado.*
