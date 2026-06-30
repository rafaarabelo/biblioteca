// ============================================================
// EventBus — Implementação
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Barramento de eventos para comunicação entre bounded contexts.
// Garante desacoplamento: o emissor não conhece os consumidores.
//
// Implementação atual: in-process, síncrono em Promise.allSettled.
// - Erro em um handler não cancela os demais (resiliência)
// - Handlers da Aurora são sempre envolvidos em try/catch (ADR-007)
//
// Evolução futura (Sprint 11):
//   - Persistir eventos em `eventos_aurora` antes de processar
//   - Retry com backoff exponencial para handlers que falham
//   - Dead Letter Queue para eventos não processados
// ============================================================

import crypto from 'crypto'
import type {
  DomainEvent,
  DomainEventHandler,
  BibliotecaDomainEvent,
  BibliotecaEventType,
} from './types'

// ─────────────────────────────────────────────
// Interface do EventBus
// ─────────────────────────────────────────────
export interface IEventBus {
  /** Publicar um evento para todos os handlers registrados */
  publish<T extends DomainEvent>(event: T): Promise<void>

  /** Registrar um handler para um tipo de evento */
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: DomainEventHandler<T>,
  ): () => void  // Retorna função de unsubscribe

  /** Publicar múltiplos eventos em lote */
  publishAll(events: DomainEvent[]): Promise<void>
}

// ─────────────────────────────────────────────
// Implementação in-process
// ─────────────────────────────────────────────
class InProcessEventBus implements IEventBus {
  private handlers = new Map<string, DomainEventHandler[]>()

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventType) ?? []

    if (eventHandlers.length === 0) return

    // Promise.allSettled: todos os handlers executam mesmo que um falhe
    const results = await Promise.allSettled(
      eventHandlers.map((handler) => {
        // Aurora handlers são sempre tolerantes a falha (ADR-007)
        if (event.eventType.startsWith('aurora.')) {
          return this.safeExecute(handler, event)
        }
        return handler(event)
      }),
    )

    // Log de handlers que falharam (sem interromper o fluxo)
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(
          `[EventBus] Handler ${index} falhou para evento ${event.eventType}:`,
          result.reason,
        )
        // TODO Sprint 5: registrar em edge_function_errors
      }
    })
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    // Processar eventos em sequência para manter ordem causal
    for (const event of events) {
      await this.publish(event)
    }
  }

  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: DomainEventHandler<T>,
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }

    const handlers = this.handlers.get(eventType)!
    handlers.push(handler as DomainEventHandler)

    // Retornar função de unsubscribe
    return () => {
      const idx = handlers.indexOf(handler as DomainEventHandler)
      if (idx > -1) handlers.splice(idx, 1)
    }
  }

  private async safeExecute(
    handler: DomainEventHandler,
    event: DomainEvent,
  ): Promise<void> {
    try {
      await handler(event)
    } catch (error) {
      // Aurora handlers nunca propagam erros (ADR-007)
      console.error(`[EventBus][Aurora] Handler silenciado:`, error)
    }
  }
}

// ─────────────────────────────────────────────
// Factory de eventos (helper)
// ─────────────────────────────────────────────
export function createEvent<T extends Omit<BibliotecaDomainEvent, 'eventId' | 'occurredAt' | 'version'>>(
  eventData: T,
): T & { eventId: string; occurredAt: Date; version: number } {
  return {
    ...eventData,
    eventId: crypto.randomUUID(),
    occurredAt: new Date(),
    version: 1,
  }
}

// ─────────────────────────────────────────────
// Singleton do EventBus (server-side)
// ─────────────────────────────────────────────
// Em Next.js, o servidor pode reinicializar entre requests.
// O singleton é mantido no escopo do módulo, que persiste
// durante a vida do processo Node.js (dev + prod).
// Para hot reload em dev, o EventBus é re-criado automaticamente.

declare global {
  // eslint-disable-next-line no-var
  var __eventBus: IEventBus | undefined
}

export const eventBus: IEventBus = global.__eventBus ?? new InProcessEventBus()

if (process.env.NODE_ENV !== 'production') {
  global.__eventBus = eventBus
}

export type { BibliotecaEventType, BibliotecaDomainEvent }
