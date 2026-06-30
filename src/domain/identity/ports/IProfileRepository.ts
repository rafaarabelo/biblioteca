// ============================================================
// IProfileRepository — Port (Interface)
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Port do domínio: o domínio define a interface, a infraestrutura implementa.
// A camada de aplicação usa IProfileRepository sem saber como ele é implementado.
// Implementação: src/infrastructure/identity/SupabaseProfileRepository.ts
// ============================================================

import type { Profile } from '../entities/Profile'

export interface IProfileRepository {
  /**
   * Busca profile pelo ID do usuário (auth.users.id)
   * Retorna null se não encontrado
   */
  findById(userId: string): Promise<Profile | null>

  /**
   * Busca profile pelo ID do tenant
   * Usado para verificações de ownership e admin ops
   */
  findByTenantId(tenantId: string): Promise<Profile[]>

  /**
   * Salva as alterações de um profile existente
   * Não cria novos profiles — isso é responsabilidade do trigger on_auth_user_created
   */
  save(profile: Profile): Promise<Profile>

  /**
   * Atualiza o timestamp de último acesso
   * Chamado a cada sign-in (UserSignedInEvent)
   */
  touchLastAccess(userId: string): Promise<void>

  /**
   * Verifica se um usuário tem determinado role
   * Conveniência para guards de aplicação
   */
  hasRole(userId: string, role: string): Promise<boolean>
}
