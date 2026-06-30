// ============================================================
// Identity Domain Events — Factories
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Funções factory para criar eventos do contexto Identity.
// Cada evento é imutável e tem um eventId único (UUID).
// ============================================================

import crypto from 'crypto'
import type {
  UserSignedInEvent,
  UserSignedOutEvent,
  ProfileUpdatedEvent,
} from '@/infrastructure/eventBus/types'

export function createUserSignedInEvent(payload: {
  userId: string
  email: string
  tenantId: string
  userRole: string
}): UserSignedInEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType: 'identity.UserSignedIn',
    tenantId: payload.tenantId,
    occurredAt: new Date(),
    version: 1,
    payload,
  }
}

export function createUserSignedOutEvent(payload: {
  userId: string
  tenantId: string
}): UserSignedOutEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType: 'identity.UserSignedOut',
    tenantId: payload.tenantId,
    occurredAt: new Date(),
    version: 1,
    payload,
  }
}

export function createProfileUpdatedEvent(payload: {
  userId: string
  tenantId: string
  fields: string[]
}): ProfileUpdatedEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType: 'identity.ProfileUpdated',
    tenantId: payload.tenantId,
    occurredAt: new Date(),
    version: 1,
    payload,
  }
}
