// ============================================================
// EventBus — Tipos de Domain Events
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Bounded contexts comunicam-se EXCLUSIVAMENTE via eventos.
// Nenhum serviço chama diretamente o repositório de outro contexto.
// (Backend Architecture — Regras de comunicação entre contextos)
//
// Evento = o que aconteceu, não o que fazer.
// O consumidor decide o que fazer com o evento.
// ============================================================

// ─────────────────────────────────────────────
// Interface base de Domain Event
// ─────────────────────────────────────────────
export interface DomainEvent {
  /** Identificador único do evento (UUID) */
  readonly eventId: string
  /** Tipo do evento — usado para roteamento no EventBus */
  readonly eventType: string
  /** Tenant ao qual o evento pertence */
  readonly tenantId: string
  /** Timestamp de ocorrência */
  readonly occurredAt: Date
  /** Versão do payload (para evolução sem quebrar consumidores) */
  readonly version: number
}

// ─────────────────────────────────────────────
// Handler de eventos
// ─────────────────────────────────────────────
export type DomainEventHandler<T extends DomainEvent = DomainEvent> = (
  event: T,
) => Promise<void>

// ─────────────────────────────────────────────
// Identity Events
// ─────────────────────────────────────────────
export interface UserSignedInEvent extends DomainEvent {
  eventType: 'identity.UserSignedIn'
  payload: {
    userId: string
    email: string
    tenantId: string
    userRole: string
  }
}

export interface UserSignedOutEvent extends DomainEvent {
  eventType: 'identity.UserSignedOut'
  payload: {
    userId: string
    tenantId: string
  }
}

export interface ProfileUpdatedEvent extends DomainEvent {
  eventType: 'identity.ProfileUpdated'
  payload: {
    userId: string
    tenantId: string
    fields: string[]
  }
}

// ─────────────────────────────────────────────
// Scientific Events (Sprint 3 — preview)
// ─────────────────────────────────────────────
export interface AtivoCreatedEvent extends DomainEvent {
  eventType: 'scientific.AtivoCreated'
  payload: {
    ativoId: string
    nome: string
    tenantId: string
  }
}

export interface AtivoStatusChangedEvent extends DomainEvent {
  eventType: 'scientific.AtivoStatusChanged'
  payload: {
    ativoId: string
    statusAnterior: string
    statusNovo: string
    tenantId: string
  }
}

export interface ReferenciaCreatedEvent extends DomainEvent {
  eventType: 'scientific.ReferenciaCreated'
  payload: {
    referenciaId: string
    titulo: string
    doi: string | null
    tenantId: string
  }
}

// ─────────────────────────────────────────────
// Formulation Events (Sprint 4 — preview)
// ─────────────────────────────────────────────
export interface FormulaVersionCreatedEvent extends DomainEvent {
  eventType: 'formulation.FormulaVersionCreated'
  payload: {
    formulaId: string
    versaoId: string
    numeroVersao: number
    tenantId: string
  }
}

// ─────────────────────────────────────────────
// Clinical Events (Sprint 5 — preview)
// ─────────────────────────────────────────────
export interface CasoOpenedEvent extends DomainEvent {
  eventType: 'clinical.CasoOpened'
  payload: {
    casoId: string
    tenantId: string
    // NUNCA incluir paciente_id ou dados do paciente (ADR-007)
  }
}

export interface EvolucaoRegisteredEvent extends DomainEvent {
  eventType: 'clinical.EvolucaoRegistered'
  payload: {
    casoId: string
    evolucaoId: string
    tenantId: string
    // NUNCA incluir dados clínicos individuais (ADR-007)
  }
}

// ─────────────────────────────────────────────
// Observation Events (Sprint 6 — preview)
// ─────────────────────────────────────────────
export interface ObservationValidatedEvent extends DomainEvent {
  eventType: 'observation.ObservationValidated'
  payload: {
    observacaoId: string
    versaoId: string
    tenantId: string
  }
}

// ─────────────────────────────────────────────
// Aurora Events (Sprint 11 — preview)
// ─────────────────────────────────────────────
export interface AuroraPatternDetectedEvent extends DomainEvent {
  eventType: 'aurora.PatternDetected'
  payload: {
    padraoId: string
    confianca: number
    tenantId: string
  }
}

export interface AuroraBilheteGeneratedEvent extends DomainEvent {
  eventType: 'aurora.BilheteGenerated'
  payload: {
    bilheteId: string
    tipo: string
    tenantId: string
  }
}

// ─────────────────────────────────────────────
// Union type de todos os eventos
// ─────────────────────────────────────────────
export type BibliotecaDomainEvent =
  | UserSignedInEvent
  | UserSignedOutEvent
  | ProfileUpdatedEvent
  | AtivoCreatedEvent
  | AtivoStatusChangedEvent
  | ReferenciaCreatedEvent
  | FormulaVersionCreatedEvent
  | CasoOpenedEvent
  | EvolucaoRegisteredEvent
  | ObservationValidatedEvent
  | AuroraPatternDetectedEvent
  | AuroraBilheteGeneratedEvent

export type BibliotecaEventType = BibliotecaDomainEvent['eventType']
