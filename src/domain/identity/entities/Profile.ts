// ============================================================
// Profile — Entidade de Domínio
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Domínio: Identity
// Entidade com identidade (id = auth.users.id do Supabase)
// 1:1 com auth.users — criado pelo trigger on_auth_user_created
// ============================================================

import type { UserRole } from '@/types/database'

// ─────────────────────────────────────────────
// Value Objects
// ─────────────────────────────────────────────

export class TenantId {
  private readonly value: string

  constructor(id: string) {
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      throw new Error(`TenantId inválido: "${id}"`)
    }
    this.value = id
  }

  toString(): string {
    return this.value
  }

  equals(other: TenantId): boolean {
    return this.value === other.value
  }
}

export class UserId {
  private readonly value: string

  constructor(id: string) {
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      throw new Error(`UserId inválido: "${id}"`)
    }
    this.value = id
  }

  toString(): string {
    return this.value
  }

  equals(other: UserId): boolean {
    return this.value === other.value
  }
}

// ─────────────────────────────────────────────
// Profile Props (estado interno imutável)
// ─────────────────────────────────────────────
export interface ProfileProps {
  readonly id: UserId
  readonly tenantId: TenantId
  readonly userRole: UserRole
  readonly nomeCompleto: string | null
  readonly avatarUrl: string | null
  readonly bio: string | null
  readonly preferencias: Record<string, unknown>
  readonly ultimoAcessoEm: Date | null
  readonly criadoEm: Date
  readonly atualizadoEm: Date
}

// ─────────────────────────────────────────────
// Profile Entity
// ─────────────────────────────────────────────
export class Profile {
  private readonly props: ProfileProps

  private constructor(props: ProfileProps) {
    this.props = props
  }

  // ─── Getters ───────────────────────────────
  get id(): string { return this.props.id.toString() }
  get tenantId(): string { return this.props.tenantId.toString() }
  get userRole(): UserRole { return this.props.userRole }
  get nomeCompleto(): string | null { return this.props.nomeCompleto }
  get avatarUrl(): string | null { return this.props.avatarUrl }
  get bio(): string | null { return this.props.bio }
  get preferencias(): Record<string, unknown> { return this.props.preferencias }
  get ultimoAcessoEm(): Date | null { return this.props.ultimoAcessoEm }
  get criadoEm(): Date { return this.props.criadoEm }

  // ─── Business Rules ────────────────────────

  isOwner(): boolean {
    return this.props.userRole === 'owner'
  }

  isOwnerOrAdmin(): boolean {
    return this.props.userRole === 'owner' || this.props.userRole === 'admin'
  }

  canAccessClinicalData(): boolean {
    return ['owner', 'admin', 'clinician'].includes(this.props.userRole)
  }

  canManageTenant(): boolean {
    return this.props.userRole === 'owner'
  }

  canViewMrrContent(): boolean {
    return ['owner', 'admin', 'clinician', 'researcher', 'mrr_student'].includes(this.props.userRole)
  }

  // ─── Mutations (retornam nova instância — imutabilidade) ──

  withNomeCompleto(nome: string | null): Profile {
    return new Profile({ ...this.props, nomeCompleto: nome })
  }

  withBio(bio: string | null): Profile {
    return new Profile({ ...this.props, bio })
  }

  withAvatarUrl(url: string | null): Profile {
    return new Profile({ ...this.props, avatarUrl: url })
  }

  withUltimoAcesso(at: Date): Profile {
    return new Profile({ ...this.props, ultimoAcessoEm: at })
  }

  // ─── Factory Methods ───────────────────────

  static create(props: {
    id: string
    tenantId: string
    userRole: UserRole
    nomeCompleto?: string | null
    avatarUrl?: string | null
    bio?: string | null
    preferencias?: Record<string, unknown>
    ultimoAcessoEm?: Date | null
    criadoEm?: Date
    atualizadoEm?: Date
  }): Profile {
    return new Profile({
      id: new UserId(props.id),
      tenantId: new TenantId(props.tenantId),
      userRole: props.userRole,
      nomeCompleto: props.nomeCompleto ?? null,
      avatarUrl: props.avatarUrl ?? null,
      bio: props.bio ?? null,
      preferencias: props.preferencias ?? {},
      ultimoAcessoEm: props.ultimoAcessoEm ?? null,
      criadoEm: props.criadoEm ?? new Date(),
      atualizadoEm: props.atualizadoEm ?? new Date(),
    })
  }

  // Serialização para camada de infraestrutura
  toPlainObject(): Omit<ProfileProps, 'id' | 'tenantId'> & { id: string; tenantId: string } {
    return {
      ...this.props,
      id: this.id,
      tenantId: this.tenantId,
    }
  }
}
