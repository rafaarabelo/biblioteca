export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  lgpd: {
    Tables: {
      consentimentos: {
        Row: {
          consentido: boolean
          consentido_em: string
          id: string
          ip_registro: unknown
          motivo_revogacao: string | null
          paciente_id: string
          registrado_por: string | null
          revogado_em: string | null
          tenant_id: string
          tipo_consentimento: string
          versao_documento: string
        }
        Insert: {
          consentido: boolean
          consentido_em?: string
          id?: string
          ip_registro?: unknown
          motivo_revogacao?: string | null
          paciente_id: string
          registrado_por?: string | null
          revogado_em?: string | null
          tenant_id: string
          tipo_consentimento: string
          versao_documento: string
        }
        Update: {
          consentido?: boolean
          consentido_em?: string
          id?: string
          ip_registro?: unknown
          motivo_revogacao?: string | null
          paciente_id?: string
          registrado_por?: string | null
          revogado_em?: string | null
          tenant_id?: string
          tipo_consentimento?: string
          versao_documento?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      arquivos_midia: {
        Row: {
          altura_px: number | null
          bucket: string
          classificacao: Database["public"]["Enums"]["classificacao_seguranca"]
          criado_em: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id: string
          largura_px: number | null
          metadados: Json | null
          nome_original: string
          storage_path: string
          tamanho_bytes: number | null
          tenant_id: string
          tipo_mime: string
          uploaded_por: string | null
        }
        Insert: {
          altura_px?: number | null
          bucket: string
          classificacao?: Database["public"]["Enums"]["classificacao_seguranca"]
          criado_em?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          largura_px?: number | null
          metadados?: Json | null
          nome_original: string
          storage_path: string
          tamanho_bytes?: number | null
          tenant_id: string
          tipo_mime: string
          uploaded_por?: string | null
        }
        Update: {
          altura_px?: number | null
          bucket?: string
          classificacao?: Database["public"]["Enums"]["classificacao_seguranca"]
          criado_em?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          largura_px?: number | null
          metadados?: Json | null
          nome_original?: string
          storage_path?: string
          tamanho_bytes?: number | null
          tenant_id?: string
          tipo_mime?: string
          uploaded_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arquivos_midia_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ativo_contraindicacoes: {
        Row: {
          ativo_id: string
          contraindicacao_id: string
        }
        Insert: {
          ativo_id: string
          contraindicacao_id: string
        }
        Update: {
          ativo_id?: string
          contraindicacao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ativo_contraindicacoes_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_contraindicacoes_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_contraindicacoes_contraindicacao_id_fkey"
            columns: ["contraindicacao_id"]
            isOneToOne: false
            referencedRelation: "contraindicacoes_cosmeticas"
            referencedColumns: ["id"]
          },
        ]
      }
      ativo_funcoes: {
        Row: {
          ativo_id: string
          funcao_id: string
        }
        Insert: {
          ativo_id: string
          funcao_id: string
        }
        Update: {
          ativo_id?: string
          funcao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ativo_funcoes_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_funcoes_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_funcoes_funcao_id_fkey"
            columns: ["funcao_id"]
            isOneToOne: false
            referencedRelation: "funcoes_cosmeticas"
            referencedColumns: ["id"]
          },
        ]
      }
      ativo_incompativeis: {
        Row: {
          adicionado_em: string
          ativo_id: string
          ativo_incompativel_id: string
          motivo: string | null
          severidade: string | null
        }
        Insert: {
          adicionado_em?: string
          ativo_id: string
          ativo_incompativel_id: string
          motivo?: string | null
          severidade?: string | null
        }
        Update: {
          adicionado_em?: string
          ativo_id?: string
          ativo_incompativel_id?: string
          motivo?: string | null
          severidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ativo_incompativeis_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_incompativeis_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_incompativeis_ativo_incompativel_id_fkey"
            columns: ["ativo_incompativel_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_incompativeis_ativo_incompativel_id_fkey"
            columns: ["ativo_incompativel_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
        ]
      }
      ativo_indicacoes: {
        Row: {
          ativo_id: string
          indicacao_id: string
        }
        Insert: {
          ativo_id: string
          indicacao_id: string
        }
        Update: {
          ativo_id?: string
          indicacao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ativo_indicacoes_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_indicacoes_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_indicacoes_indicacao_id_fkey"
            columns: ["indicacao_id"]
            isOneToOne: false
            referencedRelation: "indicacoes_cosmeticas"
            referencedColumns: ["id"]
          },
        ]
      }
      ativo_referencias: {
        Row: {
          adicionado_em: string
          ativo_id: string
          referencia_id: string
          relevancia: string | null
        }
        Insert: {
          adicionado_em?: string
          ativo_id: string
          referencia_id: string
          relevancia?: string | null
        }
        Update: {
          adicionado_em?: string
          ativo_id?: string
          referencia_id?: string
          relevancia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ativo_referencias_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_referencias_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_referencias_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "referencias_cientificas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_referencias_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "v_referencias_sem_embedding"
            referencedColumns: ["id"]
          },
        ]
      }
      ativo_sinergicos: {
        Row: {
          adicionado_em: string
          ativo_id: string
          ativo_sinergico_id: string
          descricao: string | null
        }
        Insert: {
          adicionado_em?: string
          ativo_id: string
          ativo_sinergico_id: string
          descricao?: string | null
        }
        Update: {
          adicionado_em?: string
          ativo_id?: string
          ativo_sinergico_id?: string
          descricao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ativo_sinergicos_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_sinergicos_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_sinergicos_ativo_sinergico_id_fkey"
            columns: ["ativo_sinergico_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativo_sinergicos_ativo_sinergico_id_fkey"
            columns: ["ativo_sinergico_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
        ]
      }
      ativos_cosmeticos: {
        Row: {
          aparencia: string | null
          archived_at: string | null
          atualizado_em: string
          concentracao_maxima: number | null
          concentracao_minima: number | null
          concentracao_usual: number | null
          cor: string | null
          criado_em: string
          descricao: string | null
          familia_quimica_id: string | null
          fontes_naturais: string[] | null
          fts_document: unknown
          id: string
          mecanismo_acao: string | null
          metadados: Json | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"]
          nome: string
          nome_inci: string | null
          odor: string | null
          outros_nomes: string[] | null
          ph_maximo: number | null
          ph_minimo: number | null
          restricoes_regulatorias: string | null
          solubilidade: string | null
          status_epistemico: Database["public"]["Enums"]["status_epistemico"]
          tenant_id: string
          unidade_concentracao: string | null
        }
        Insert: {
          aparencia?: string | null
          archived_at?: string | null
          atualizado_em?: string
          concentracao_maxima?: number | null
          concentracao_minima?: number | null
          concentracao_usual?: number | null
          cor?: string | null
          criado_em?: string
          descricao?: string | null
          familia_quimica_id?: string | null
          fontes_naturais?: string[] | null
          fts_document?: unknown
          id?: string
          mecanismo_acao?: string | null
          metadados?: Json | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          nome: string
          nome_inci?: string | null
          odor?: string | null
          outros_nomes?: string[] | null
          ph_maximo?: number | null
          ph_minimo?: number | null
          restricoes_regulatorias?: string | null
          solubilidade?: string | null
          status_epistemico?: Database["public"]["Enums"]["status_epistemico"]
          tenant_id: string
          unidade_concentracao?: string | null
        }
        Update: {
          aparencia?: string | null
          archived_at?: string | null
          atualizado_em?: string
          concentracao_maxima?: number | null
          concentracao_minima?: number | null
          concentracao_usual?: number | null
          cor?: string | null
          criado_em?: string
          descricao?: string | null
          familia_quimica_id?: string | null
          fontes_naturais?: string[] | null
          fts_document?: unknown
          id?: string
          mecanismo_acao?: string | null
          metadados?: Json | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          nome?: string
          nome_inci?: string | null
          odor?: string | null
          outros_nomes?: string[] | null
          ph_maximo?: number | null
          ph_minimo?: number | null
          restricoes_regulatorias?: string | null
          solubilidade?: string | null
          status_epistemico?: Database["public"]["Enums"]["status_epistemico"]
          tenant_id?: string
          unidade_concentracao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ativos_cosmeticos_familia_quimica_id_fkey"
            columns: ["familia_quimica_id"]
            isOneToOne: false
            referencedRelation: "familias_quimicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativos_cosmeticos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          criado_em: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["tipo_entidade"] | null
          id: string
          ip_address: unknown
          metadados: Json | null
          origin: string
          tenant_id: string | null
          tipo: Database["public"]["Enums"]["tipo_audit"]
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          criado_em?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["tipo_entidade"] | null
          id?: string
          ip_address?: unknown
          metadados?: Json | null
          origin?: string
          tenant_id?: string | null
          tipo: Database["public"]["Enums"]["tipo_audit"]
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          criado_em?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["tipo_entidade"] | null
          id?: string
          ip_address?: unknown
          metadados?: Json | null
          origin?: string
          tenant_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_audit"]
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log_archive: {
        Row: {
          criado_em: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["tipo_entidade"] | null
          id: string
          ip_address: unknown
          metadados: Json | null
          origin: string
          tenant_id: string | null
          tipo: Database["public"]["Enums"]["tipo_audit"]
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          criado_em?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["tipo_entidade"] | null
          id?: string
          ip_address?: unknown
          metadados?: Json | null
          origin?: string
          tenant_id?: string | null
          tipo: Database["public"]["Enums"]["tipo_audit"]
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          criado_em?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["tipo_entidade"] | null
          id?: string
          ip_address?: unknown
          metadados?: Json | null
          origin?: string
          tenant_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_audit"]
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: []
      }
      aurora_context: {
        Row: {
          chave: string
          criado_em: string
          entidades_envolvidas: Json
          id: string
          metadados: Json
          proxima_vez_disponivel: string | null
          tenant_id: string
          tipo_contexto: string
          ultima_vez_em: string
          vezes_ativado: number
        }
        Insert: {
          chave: string
          criado_em?: string
          entidades_envolvidas?: Json
          id?: string
          metadados?: Json
          proxima_vez_disponivel?: string | null
          tenant_id: string
          tipo_contexto: string
          ultima_vez_em?: string
          vezes_ativado?: number
        }
        Update: {
          chave?: string
          criado_em?: string
          entidades_envolvidas?: Json
          id?: string
          metadados?: Json
          proxima_vez_disponivel?: string | null
          tenant_id?: string
          tipo_contexto?: string
          ultima_vez_em?: string
          vezes_ativado?: number
        }
        Relationships: [
          {
            foreignKeyName: "aurora_context_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      biblioteca_metadata: {
        Row: {
          ambiente: string
          atualizado_em: string
          constitution_version: string | null
          design_system_version: string | null
          first_open_at: string
          last_backup_at: string | null
          manifest_version: string | null
          metadados: Json
          schema_version: string | null
          singleton: boolean
          total_migrations_applied: number
          version: string
        }
        Insert: {
          ambiente?: string
          atualizado_em?: string
          constitution_version?: string | null
          design_system_version?: string | null
          first_open_at?: string
          last_backup_at?: string | null
          manifest_version?: string | null
          metadados?: Json
          schema_version?: string | null
          singleton?: boolean
          total_migrations_applied?: number
          version?: string
        }
        Update: {
          ambiente?: string
          atualizado_em?: string
          constitution_version?: string | null
          design_system_version?: string | null
          first_open_at?: string
          last_backup_at?: string | null
          manifest_version?: string | null
          metadados?: Json
          schema_version?: string | null
          singleton?: boolean
          total_migrations_applied?: number
          version?: string
        }
        Relationships: []
      }
      bilhetes_aurora: {
        Row: {
          arquivado: boolean
          assinatura: string
          conteudo: string
          criado_em: string
          entidades_relacionadas: Json | null
          fixado: boolean
          id: string
          lido_em: string | null
          padrao_id: string | null
          preview: string | null
          tenant_id: string
          tipo: Database["public"]["Enums"]["tipo_bilhete"]
          titulo: string
        }
        Insert: {
          arquivado?: boolean
          assinatura?: string
          conteudo: string
          criado_em?: string
          entidades_relacionadas?: Json | null
          fixado?: boolean
          id?: string
          lido_em?: string | null
          padrao_id?: string | null
          preview?: string | null
          tenant_id: string
          tipo: Database["public"]["Enums"]["tipo_bilhete"]
          titulo: string
        }
        Update: {
          arquivado?: boolean
          assinatura?: string
          conteudo?: string
          criado_em?: string
          entidades_relacionadas?: Json | null
          fixado?: boolean
          id?: string
          lido_em?: string | null
          padrao_id?: string | null
          preview?: string | null
          tenant_id?: string
          tipo?: Database["public"]["Enums"]["tipo_bilhete"]
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "bilhetes_aurora_padrao_id_fkey"
            columns: ["padrao_id"]
            isOneToOne: false
            referencedRelation: "padroes_aurora"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bilhetes_aurora_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      canais_producao: {
        Row: {
          ativo: boolean
          criado_em: string
          descricao: string | null
          id: string
          nome: string
          url_base: string | null
        }
        Insert: {
          ativo?: boolean
          criado_em?: string
          descricao?: string | null
          id?: string
          nome: string
          url_base?: string | null
        }
        Update: {
          ativo?: boolean
          criado_em?: string
          descricao?: string | null
          id?: string
          nome?: string
          url_base?: string | null
        }
        Relationships: []
      }
      caso_ativos: {
        Row: {
          adicionado_em: string
          ativo_id: string
          caso_id: string
          tenant_id: string
        }
        Insert: {
          adicionado_em?: string
          ativo_id: string
          caso_id: string
          tenant_id: string
        }
        Update: {
          adicionado_em?: string
          ativo_id?: string
          caso_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "caso_ativos_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caso_ativos_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caso_ativos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_clinicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caso_ativos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_casos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caso_ativos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      casos_clinicos: {
        Row: {
          aberto_em: string
          archived_at: string | null
          atualizado_em: string
          codigo_anonimizado: string | null
          criado_em: string
          encerrado_em: string | null
          favorito: boolean
          hipoteses: string | null
          id: string
          metadados: Json | null
          motivo_encerramento: string | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"]
          objetivo_principal: string | null
          objetivos: string[] | null
          observacoes_iniciais: string | null
          paciente_id: string | null
          queixa_principal: string | null
          resultado_geral: string | null
          resumo_clinico: string | null
          status: Database["public"]["Enums"]["status_caso"]
          tags: string[]
          tenant_id: string
          versao_protocolo_id: string | null
        }
        Insert: {
          aberto_em?: string
          archived_at?: string | null
          atualizado_em?: string
          codigo_anonimizado?: string | null
          criado_em?: string
          encerrado_em?: string | null
          favorito?: boolean
          hipoteses?: string | null
          id?: string
          metadados?: Json | null
          motivo_encerramento?: string | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          objetivo_principal?: string | null
          objetivos?: string[] | null
          observacoes_iniciais?: string | null
          paciente_id?: string | null
          queixa_principal?: string | null
          resultado_geral?: string | null
          resumo_clinico?: string | null
          status?: Database["public"]["Enums"]["status_caso"]
          tags?: string[]
          tenant_id: string
          versao_protocolo_id?: string | null
        }
        Update: {
          aberto_em?: string
          archived_at?: string | null
          atualizado_em?: string
          codigo_anonimizado?: string | null
          criado_em?: string
          encerrado_em?: string | null
          favorito?: boolean
          hipoteses?: string | null
          id?: string
          metadados?: Json | null
          motivo_encerramento?: string | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          objetivo_principal?: string | null
          objetivos?: string[] | null
          observacoes_iniciais?: string | null
          paciente_id?: string | null
          queixa_principal?: string | null
          resultado_geral?: string | null
          resumo_clinico?: string | null
          status?: Database["public"]["Enums"]["status_caso"]
          tags?: string[]
          tenant_id?: string
          versao_protocolo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "casos_clinicos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "casos_clinicos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "casos_clinicos_versao_protocolo_id_fkey"
            columns: ["versao_protocolo_id"]
            isOneToOne: false
            referencedRelation: "v_protocolos_ativos"
            referencedColumns: ["versao_id"]
          },
          {
            foreignKeyName: "casos_clinicos_versao_protocolo_id_fkey"
            columns: ["versao_protocolo_id"]
            isOneToOne: false
            referencedRelation: "versoes_protocolo"
            referencedColumns: ["id"]
          },
        ]
      }
      colecoes: {
        Row: {
          archived_at: string | null
          atualizado_em: string
          cor: string | null
          criado_em: string
          descricao: string | null
          id: string
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"]
          tenant_id: string
          titulo: string
          usuario_id: string
        }
        Insert: {
          archived_at?: string | null
          atualizado_em?: string
          cor?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          tenant_id: string
          titulo: string
          usuario_id: string
        }
        Update: {
          archived_at?: string | null
          atualizado_em?: string
          cor?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          tenant_id?: string
          titulo?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "colecoes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      composicoes_formula: {
        Row: {
          ativo_id: string
          concentracao: number
          fase: Database["public"]["Enums"]["fase_incorporacao"]
          funcao_na_formula: string | null
          id: string
          observacoes: string | null
          ordem: number
          tenant_id: string
          unidade: string
          versao_formula_id: string
        }
        Insert: {
          ativo_id: string
          concentracao: number
          fase: Database["public"]["Enums"]["fase_incorporacao"]
          funcao_na_formula?: string | null
          id?: string
          observacoes?: string | null
          ordem?: number
          tenant_id: string
          unidade?: string
          versao_formula_id: string
        }
        Update: {
          ativo_id?: string
          concentracao?: number
          fase?: Database["public"]["Enums"]["fase_incorporacao"]
          funcao_na_formula?: string | null
          id?: string
          observacoes?: string | null
          ordem?: number
          tenant_id?: string
          unidade?: string
          versao_formula_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "composicoes_formula_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "composicoes_formula_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "composicoes_formula_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "composicoes_formula_versao_formula_id_fkey"
            columns: ["versao_formula_id"]
            isOneToOne: false
            referencedRelation: "v_formulas_ativas"
            referencedColumns: ["versao_id"]
          },
          {
            foreignKeyName: "composicoes_formula_versao_formula_id_fkey"
            columns: ["versao_formula_id"]
            isOneToOne: false
            referencedRelation: "versoes_formula"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_tenant: {
        Row: {
          atualizado_em: string
          chave: string
          criado_em: string
          descricao: string | null
          id: string
          tenant_id: string
          valor: Json
        }
        Insert: {
          atualizado_em?: string
          chave: string
          criado_em?: string
          descricao?: string | null
          id?: string
          tenant_id: string
          valor: Json
        }
        Update: {
          atualizado_em?: string
          chave?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          tenant_id?: string
          valor?: Json
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_tenant_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contraindicacoes_cosmeticas: {
        Row: {
          atualizado_em: string
          criado_em: string
          descricao: string | null
          id: string
          nome: string
          severidade: string | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          nome: string
          severidade?: string | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          nome?: string
          severidade?: string | null
        }
        Relationships: []
      }
      cron_executions: {
        Row: {
          encerrada_em: string | null
          erro_mensagem: string | null
          id: string
          iniciada_em: string
          itens_processados: number | null
          job_name: string
          metadados: Json | null
          status: string
        }
        Insert: {
          encerrada_em?: string | null
          erro_mensagem?: string | null
          id?: string
          iniciada_em?: string
          itens_processados?: number | null
          job_name: string
          metadados?: Json | null
          status?: string
        }
        Update: {
          encerrada_em?: string | null
          erro_mensagem?: string | null
          id?: string
          iniciada_em?: string
          itens_processados?: number | null
          job_name?: string
          metadados?: Json | null
          status?: string
        }
        Relationships: []
      }
      edge_function_errors: {
        Row: {
          erro_mensagem: string
          function_name: string
          id: string
          input_sanitizado: Json | null
          ocorrido_em: string
          resolvido: boolean
          resolvido_em: string | null
          resolvido_por: string | null
          stack_trace: string | null
        }
        Insert: {
          erro_mensagem: string
          function_name: string
          id?: string
          input_sanitizado?: Json | null
          ocorrido_em?: string
          resolvido?: boolean
          resolvido_em?: string | null
          resolvido_por?: string | null
          stack_trace?: string | null
        }
        Update: {
          erro_mensagem?: string
          function_name?: string
          id?: string
          input_sanitizado?: Json | null
          ocorrido_em?: string
          resolvido?: boolean
          resolvido_em?: string | null
          resolvido_por?: string | null
          stack_trace?: string | null
        }
        Relationships: []
      }
      embeddings: {
        Row: {
          atualizado_em: string
          criado_em: string
          embedding: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id: string
          modelo: string
          tenant_id: string
          versao_conteudo: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          embedding?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          modelo?: string
          tenant_id: string
          versao_conteudo: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          embedding?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          modelo?: string
          tenant_id?: string
          versao_conteudo?: string
        }
        Relationships: [
          {
            foreignKeyName: "embeddings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_visual: {
        Row: {
          arquivo_midia_id: string | null
          atualizado_em: string
          categoria_visual: string | null
          cor_primaria: string | null
          cor_secundaria: string | null
          criado_em: string
          emoji: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          tenant_id: string
        }
        Insert: {
          arquivo_midia_id?: string | null
          atualizado_em?: string
          categoria_visual?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          criado_em?: string
          emoji?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          tenant_id: string
        }
        Update: {
          arquivo_midia_id?: string | null
          atualizado_em?: string
          categoria_visual?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          criado_em?: string
          emoji?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["tipo_entidade"]
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_visual_arquivo_midia_id_fkey"
            columns: ["arquivo_midia_id"]
            isOneToOne: false
            referencedRelation: "arquivos_midia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_visual_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_aurora: {
        Row: {
          criado_em: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id: string
          metadados: Json | null
          processado_em: string | null
          processado_por_aurora: boolean
          tenant_id: string
          tipo_evento: string
        }
        Insert: {
          criado_em?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          metadados?: Json | null
          processado_em?: string | null
          processado_por_aurora?: boolean
          tenant_id: string
          tipo_evento: string
        }
        Update: {
          criado_em?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          metadados?: Json | null
          processado_em?: string | null
          processado_por_aurora?: boolean
          tenant_id?: string
          tipo_evento?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventos_aurora_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      evolucoes_caso: {
        Row: {
          caso_id: string
          criado_em: string
          data_atendimento: string
          descricao: string
          id: string
          metadados: Json | null
          observacoes_clinicas: string | null
          reacoes_adversas: string | null
          registrado_por: string | null
          resultados: string | null
          satisfacao_paciente: number | null
          tenant_id: string
          tipo: Database["public"]["Enums"]["tipo_evolucao_caso"]
          versao_protocolo_id: string | null
        }
        Insert: {
          caso_id: string
          criado_em?: string
          data_atendimento: string
          descricao: string
          id?: string
          metadados?: Json | null
          observacoes_clinicas?: string | null
          reacoes_adversas?: string | null
          registrado_por?: string | null
          resultados?: string | null
          satisfacao_paciente?: number | null
          tenant_id: string
          tipo: Database["public"]["Enums"]["tipo_evolucao_caso"]
          versao_protocolo_id?: string | null
        }
        Update: {
          caso_id?: string
          criado_em?: string
          data_atendimento?: string
          descricao?: string
          id?: string
          metadados?: Json | null
          observacoes_clinicas?: string | null
          reacoes_adversas?: string | null
          registrado_por?: string | null
          resultados?: string | null
          satisfacao_paciente?: number | null
          tenant_id?: string
          tipo?: Database["public"]["Enums"]["tipo_evolucao_caso"]
          versao_protocolo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evolucoes_caso_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_clinicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolucoes_caso_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_casos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolucoes_caso_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolucoes_caso_versao_protocolo_id_fkey"
            columns: ["versao_protocolo_id"]
            isOneToOne: false
            referencedRelation: "v_protocolos_ativos"
            referencedColumns: ["versao_id"]
          },
          {
            foreignKeyName: "evolucoes_caso_versao_protocolo_id_fkey"
            columns: ["versao_protocolo_id"]
            isOneToOne: false
            referencedRelation: "versoes_protocolo"
            referencedColumns: ["id"]
          },
        ]
      }
      familias_quimicas: {
        Row: {
          atualizado_em: string
          criado_em: string
          descricao: string | null
          exemplos: string[] | null
          id: string
          nome: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          exemplos?: string[] | null
          id?: string
          nome: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          exemplos?: string[] | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      fases_protocolo: {
        Row: {
          descricao: string | null
          duracao_semanas: number | null
          formulas_indicadas: string[] | null
          id: string
          instrucoes: string | null
          metadados: Json | null
          nome: string
          ordem: number
          tenant_id: string
          versao_protocolo_id: string
        }
        Insert: {
          descricao?: string | null
          duracao_semanas?: number | null
          formulas_indicadas?: string[] | null
          id?: string
          instrucoes?: string | null
          metadados?: Json | null
          nome: string
          ordem?: number
          tenant_id: string
          versao_protocolo_id: string
        }
        Update: {
          descricao?: string | null
          duracao_semanas?: number | null
          formulas_indicadas?: string[] | null
          id?: string
          instrucoes?: string | null
          metadados?: Json | null
          nome?: string
          ordem?: number
          tenant_id?: string
          versao_protocolo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fases_protocolo_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fases_protocolo_versao_protocolo_id_fkey"
            columns: ["versao_protocolo_id"]
            isOneToOne: false
            referencedRelation: "v_protocolos_ativos"
            referencedColumns: ["versao_id"]
          },
          {
            foreignKeyName: "fases_protocolo_versao_protocolo_id_fkey"
            columns: ["versao_protocolo_id"]
            isOneToOne: false
            referencedRelation: "versoes_protocolo"
            referencedColumns: ["id"]
          },
        ]
      }
      favoritos: {
        Row: {
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          favoritado_em: string
          id: string
          tenant_id: string
          usuario_id: string
        }
        Insert: {
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          favoritado_em?: string
          id?: string
          tenant_id: string
          usuario_id: string
        }
        Update: {
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["tipo_entidade"]
          favoritado_em?: string
          id?: string
          tenant_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      formatos_producao: {
        Row: {
          ativo: boolean
          criado_em: string
          descricao: string | null
          icone: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          criado_em?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          criado_em?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      formulas: {
        Row: {
          archived_at: string | null
          atualizado_em: string
          codigo_interno: string | null
          criado_em: string
          favorito: boolean
          id: string
          metadados: Json | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"]
          tags: string[]
          tenant_id: string
        }
        Insert: {
          archived_at?: string | null
          atualizado_em?: string
          codigo_interno?: string | null
          criado_em?: string
          favorito?: boolean
          id?: string
          metadados?: Json | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          tags?: string[]
          tenant_id: string
        }
        Update: {
          archived_at?: string | null
          atualizado_em?: string
          codigo_interno?: string | null
          criado_em?: string
          favorito?: boolean
          id?: string
          metadados?: Json | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          tags?: string[]
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "formulas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      fotos_caso: {
        Row: {
          angulo: string | null
          arquivo_midia_id: string
          caso_id: string
          criado_em: string
          data_foto: string | null
          id: string
          iluminacao: string | null
          notas: string | null
          tenant_id: string
          tipo: string
        }
        Insert: {
          angulo?: string | null
          arquivo_midia_id: string
          caso_id: string
          criado_em?: string
          data_foto?: string | null
          id?: string
          iluminacao?: string | null
          notas?: string | null
          tenant_id: string
          tipo: string
        }
        Update: {
          angulo?: string | null
          arquivo_midia_id?: string
          caso_id?: string
          criado_em?: string
          data_foto?: string | null
          id?: string
          iluminacao?: string | null
          notas?: string | null
          tenant_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_fotos_caso_arquivo_midia"
            columns: ["arquivo_midia_id"]
            isOneToOne: false
            referencedRelation: "arquivos_midia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fotos_caso_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_clinicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fotos_caso_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_casos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fotos_caso_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      funcoes_cosmeticas: {
        Row: {
          atualizado_em: string
          categoria: string | null
          criado_em: string
          descricao: string | null
          id: string
          nome: string
          nome_inci: string | null
        }
        Insert: {
          atualizado_em?: string
          categoria?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          nome: string
          nome_inci?: string | null
        }
        Update: {
          atualizado_em?: string
          categoria?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          nome?: string
          nome_inci?: string | null
        }
        Relationships: []
      }
      historico_entidades: {
        Row: {
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id: string
          sessao_id: string | null
          tenant_id: string
          usuario_id: string
          visitado_em: string
        }
        Insert: {
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          sessao_id?: string | null
          tenant_id: string
          usuario_id: string
          visitado_em?: string
        }
        Update: {
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          sessao_id?: string | null
          tenant_id?: string
          usuario_id?: string
          visitado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_entidades_sessao_id_fkey"
            columns: ["sessao_id"]
            isOneToOne: false
            referencedRelation: "sessoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_entidades_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      indicacoes_cosmeticas: {
        Row: {
          atualizado_em: string
          categoria: string | null
          criado_em: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          atualizado_em?: string
          categoria?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          atualizado_em?: string
          categoria?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      itens_colecao: {
        Row: {
          adicionado_em: string
          colecao_id: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id: string
          nota: string | null
          ordem: number
          tenant_id: string
        }
        Insert: {
          adicionado_em?: string
          colecao_id: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          nota?: string | null
          ordem?: number
          tenant_id: string
        }
        Update: {
          adicionado_em?: string
          colecao_id?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          nota?: string | null
          ordem?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_colecao_colecao_id_fkey"
            columns: ["colecao_id"]
            isOneToOne: false
            referencedRelation: "colecoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_colecao_colecao_id_fkey"
            columns: ["colecao_id"]
            isOneToOne: false
            referencedRelation: "v_colecoes_com_contagem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_colecao_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_projeto: {
        Row: {
          adicionado_em: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id: string
          nota: string | null
          ordem: number
          projeto_id: string
          tenant_id: string
        }
        Insert: {
          adicionado_em?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          nota?: string | null
          ordem?: number
          projeto_id: string
          tenant_id: string
        }
        Update: {
          adicionado_em?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          nota?: string | null
          ordem?: number
          projeto_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_projeto_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_projeto_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_connections: {
        Row: {
          atualizado_em: string
          confidence: number | null
          connection_type: string
          criado_em: string
          generated_by: string
          id: string
          metadados: Json
          notas: string | null
          source_id: string
          source_type: Database["public"]["Enums"]["tipo_entidade"]
          target_id: string
          target_type: Database["public"]["Enums"]["tipo_entidade"]
          tenant_id: string
        }
        Insert: {
          atualizado_em?: string
          confidence?: number | null
          connection_type: string
          criado_em?: string
          generated_by?: string
          id?: string
          metadados?: Json
          notas?: string | null
          source_id: string
          source_type: Database["public"]["Enums"]["tipo_entidade"]
          target_id: string
          target_type: Database["public"]["Enums"]["tipo_entidade"]
          tenant_id: string
        }
        Update: {
          atualizado_em?: string
          confidence?: number | null
          connection_type?: string
          criado_em?: string
          generated_by?: string
          id?: string
          metadados?: Json
          notas?: string | null
          source_id?: string
          source_type?: Database["public"]["Enums"]["tipo_entidade"]
          target_id?: string
          target_type?: Database["public"]["Enums"]["tipo_entidade"]
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_connections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      linhas_pesquisa: {
        Row: {
          archived_at: string | null
          ativa: boolean
          atualizado_em: string
          confianca: number | null
          criado_em: string
          descricao: string | null
          entidades_vinculadas: Json | null
          id: string
          inferida_automaticamente: boolean
          tenant_id: string
          titulo: string
          usuario_id: string
        }
        Insert: {
          archived_at?: string | null
          ativa?: boolean
          atualizado_em?: string
          confianca?: number | null
          criado_em?: string
          descricao?: string | null
          entidades_vinculadas?: Json | null
          id?: string
          inferida_automaticamente?: boolean
          tenant_id: string
          titulo: string
          usuario_id: string
        }
        Update: {
          archived_at?: string | null
          ativa?: boolean
          atualizado_em?: string
          confianca?: number | null
          criado_em?: string
          descricao?: string | null
          entidades_vinculadas?: Json | null
          id?: string
          inferida_automaticamente?: boolean
          tenant_id?: string
          titulo?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "linhas_pesquisa_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      observacao_ativos: {
        Row: {
          ativo_id: string
          observacao_id: string
          tenant_id: string
        }
        Insert: {
          ativo_id: string
          observacao_id: string
          tenant_id: string
        }
        Update: {
          ativo_id?: string
          observacao_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "observacao_ativos_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_ativos_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_ativos_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "observacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_ativos_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "v_observacoes_atuais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_ativos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      observacao_casos: {
        Row: {
          caso_id: string
          criado_em: string
          nota: string | null
          observacao_id: string
          tenant_id: string
        }
        Insert: {
          caso_id: string
          criado_em?: string
          nota?: string | null
          observacao_id: string
          tenant_id: string
        }
        Update: {
          caso_id?: string
          criado_em?: string
          nota?: string | null
          observacao_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "observacao_casos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_clinicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_casos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_casos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_casos_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "observacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_casos_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "v_observacoes_atuais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_casos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      observacao_colecoes: {
        Row: {
          colecao_id: string
          criado_em: string
          observacao_id: string
          tenant_id: string
        }
        Insert: {
          colecao_id: string
          criado_em?: string
          observacao_id: string
          tenant_id: string
        }
        Update: {
          colecao_id?: string
          criado_em?: string
          observacao_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "observacao_colecoes_colecao_id_fkey"
            columns: ["colecao_id"]
            isOneToOne: false
            referencedRelation: "colecoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_colecoes_colecao_id_fkey"
            columns: ["colecao_id"]
            isOneToOne: false
            referencedRelation: "v_colecoes_com_contagem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_colecoes_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "observacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_colecoes_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "v_observacoes_atuais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_colecoes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      observacao_formulas: {
        Row: {
          criado_em: string
          formula_id: string
          nota: string | null
          observacao_id: string
          tenant_id: string
        }
        Insert: {
          criado_em?: string
          formula_id: string
          nota?: string | null
          observacao_id: string
          tenant_id: string
        }
        Update: {
          criado_em?: string
          formula_id?: string
          nota?: string | null
          observacao_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "observacao_formulas_formula_id_fkey"
            columns: ["formula_id"]
            isOneToOne: false
            referencedRelation: "formulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_formulas_formula_id_fkey"
            columns: ["formula_id"]
            isOneToOne: false
            referencedRelation: "v_formulas_ativas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_formulas_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "observacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_formulas_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "v_observacoes_atuais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_formulas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      observacao_protocolos: {
        Row: {
          criado_em: string
          nota: string | null
          observacao_id: string
          protocolo_id: string
          tenant_id: string
        }
        Insert: {
          criado_em?: string
          nota?: string | null
          observacao_id: string
          protocolo_id: string
          tenant_id: string
        }
        Update: {
          criado_em?: string
          nota?: string | null
          observacao_id?: string
          protocolo_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "observacao_protocolos_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "observacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_protocolos_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "v_observacoes_atuais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_protocolos_protocolo_id_fkey"
            columns: ["protocolo_id"]
            isOneToOne: false
            referencedRelation: "protocolos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_protocolos_protocolo_id_fkey"
            columns: ["protocolo_id"]
            isOneToOne: false
            referencedRelation: "v_protocolos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_protocolos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      observacao_referencias: {
        Row: {
          observacao_id: string
          referencia_id: string
          tenant_id: string
        }
        Insert: {
          observacao_id: string
          referencia_id: string
          tenant_id: string
        }
        Update: {
          observacao_id?: string
          referencia_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "observacao_referencias_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "observacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_referencias_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "v_observacoes_atuais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_referencias_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "referencias_cientificas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_referencias_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "v_referencias_sem_embedding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacao_referencias_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      observacoes: {
        Row: {
          archived_at: string | null
          atualizado_em: string
          criado_em: string
          favorito: boolean
          id: string
          metadados: Json | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"]
          status_epistemico: Database["public"]["Enums"]["status_epistemico"]
          tags: string[]
          tenant_id: string
          tipo: Database["public"]["Enums"]["tipo_observacao"]
          titulo: string
        }
        Insert: {
          archived_at?: string | null
          atualizado_em?: string
          criado_em?: string
          favorito?: boolean
          id?: string
          metadados?: Json | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          status_epistemico?: Database["public"]["Enums"]["status_epistemico"]
          tags?: string[]
          tenant_id: string
          tipo?: Database["public"]["Enums"]["tipo_observacao"]
          titulo: string
        }
        Update: {
          archived_at?: string | null
          atualizado_em?: string
          criado_em?: string
          favorito?: boolean
          id?: string
          metadados?: Json | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          status_epistemico?: Database["public"]["Enums"]["status_epistemico"]
          tags?: string[]
          tenant_id?: string
          tipo?: Database["public"]["Enums"]["tipo_observacao"]
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "observacoes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          alergias_conhecidas: string[] | null
          amamentando: boolean
          archived_at: string | null
          atualizado_em: string
          codigo_interno: string
          condicoes_relevantes: string[] | null
          criado_em: string
          data_nascimento: string | null
          email: string | null
          fototipo: string | null
          gestante: boolean
          id: string
          medicamentos_uso_continuo: string[] | null
          metadados: Json | null
          nome: string | null
          observacoes: string | null
          sexo: string | null
          telefone: string | null
          tenant_id: string
          tipo_pele: string | null
        }
        Insert: {
          alergias_conhecidas?: string[] | null
          amamentando?: boolean
          archived_at?: string | null
          atualizado_em?: string
          codigo_interno: string
          condicoes_relevantes?: string[] | null
          criado_em?: string
          data_nascimento?: string | null
          email?: string | null
          fototipo?: string | null
          gestante?: boolean
          id?: string
          medicamentos_uso_continuo?: string[] | null
          metadados?: Json | null
          nome?: string | null
          observacoes?: string | null
          sexo?: string | null
          telefone?: string | null
          tenant_id: string
          tipo_pele?: string | null
        }
        Update: {
          alergias_conhecidas?: string[] | null
          amamentando?: boolean
          archived_at?: string | null
          atualizado_em?: string
          codigo_interno?: string
          condicoes_relevantes?: string[] | null
          criado_em?: string
          data_nascimento?: string | null
          email?: string | null
          fototipo?: string | null
          gestante?: boolean
          id?: string
          medicamentos_uso_continuo?: string[] | null
          metadados?: Json | null
          nome?: string | null
          observacoes?: string | null
          sexo?: string | null
          telefone?: string | null
          tenant_id?: string
          tipo_pele?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      padroes_aurora: {
        Row: {
          bilhete_gerado_id: string | null
          confianca: number
          criado_em: string
          descricao_padrao: string
          entidades_envolvidas: Json
          id: string
          metadados: Json | null
          processado: boolean
          tenant_id: string
          tipo_padrao: Database["public"]["Enums"]["tipo_padrao_aurora"]
        }
        Insert: {
          bilhete_gerado_id?: string | null
          confianca: number
          criado_em?: string
          descricao_padrao: string
          entidades_envolvidas?: Json
          id?: string
          metadados?: Json | null
          processado?: boolean
          tenant_id: string
          tipo_padrao: Database["public"]["Enums"]["tipo_padrao_aurora"]
        }
        Update: {
          bilhete_gerado_id?: string | null
          confianca?: number
          criado_em?: string
          descricao_padrao?: string
          entidades_envolvidas?: Json
          id?: string
          metadados?: Json | null
          processado?: boolean
          tenant_id?: string
          tipo_padrao?: Database["public"]["Enums"]["tipo_padrao_aurora"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_padroes_bilhete_gerado"
            columns: ["bilhete_gerado_id"]
            isOneToOne: false
            referencedRelation: "bilhetes_aurora"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_padroes_bilhete_gerado"
            columns: ["bilhete_gerado_id"]
            isOneToOne: false
            referencedRelation: "v_bilhetes_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "padroes_aurora_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      perguntas_clinicas: {
        Row: {
          archived_at: string | null
          atualizado_em: string
          criado_em: string
          descricao: string | null
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["tipo_entidade"] | null
          id: string
          metadados: Json | null
          status: string
          tenant_id: string
          titulo: string
        }
        Insert: {
          archived_at?: string | null
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["tipo_entidade"] | null
          id?: string
          metadados?: Json | null
          status?: string
          tenant_id: string
          titulo: string
        }
        Update: {
          archived_at?: string | null
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["tipo_entidade"] | null
          id?: string
          metadados?: Json | null
          status?: string
          tenant_id?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "perguntas_clinicas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      prescricoes_caso: {
        Row: {
          atualizado_em: string
          caso_id: string
          criado_em: string
          data_prescricao: string
          duracao_dias: number | null
          id: string
          instrucoes_uso: string | null
          metadados: Json | null
          motivo_suspensao: string | null
          observacoes: string | null
          prescrito_por: string | null
          status: string
          tenant_id: string
          versao_formula_id: string
        }
        Insert: {
          atualizado_em?: string
          caso_id: string
          criado_em?: string
          data_prescricao?: string
          duracao_dias?: number | null
          id?: string
          instrucoes_uso?: string | null
          metadados?: Json | null
          motivo_suspensao?: string | null
          observacoes?: string | null
          prescrito_por?: string | null
          status?: string
          tenant_id: string
          versao_formula_id: string
        }
        Update: {
          atualizado_em?: string
          caso_id?: string
          criado_em?: string
          data_prescricao?: string
          duracao_dias?: number | null
          id?: string
          instrucoes_uso?: string | null
          metadados?: Json | null
          motivo_suspensao?: string | null
          observacoes?: string | null
          prescrito_por?: string | null
          status?: string
          tenant_id?: string
          versao_formula_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescricoes_caso_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_clinicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescricoes_caso_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_casos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescricoes_caso_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescricoes_caso_versao_formula_id_fkey"
            columns: ["versao_formula_id"]
            isOneToOne: false
            referencedRelation: "v_formulas_ativas"
            referencedColumns: ["versao_id"]
          },
          {
            foreignKeyName: "prescricoes_caso_versao_formula_id_fkey"
            columns: ["versao_formula_id"]
            isOneToOne: false
            referencedRelation: "versoes_formula"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          atualizado_em: string
          avatar_url: string | null
          bio: string | null
          criado_em: string
          id: string
          nome_completo: string | null
          preferencias: Json
          tenant_id: string
          ultimo_acesso_em: string | null
          user_role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          atualizado_em?: string
          avatar_url?: string | null
          bio?: string | null
          criado_em?: string
          id: string
          nome_completo?: string | null
          preferencias?: Json
          tenant_id: string
          ultimo_acesso_em?: string | null
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          atualizado_em?: string
          avatar_url?: string | null
          bio?: string | null
          criado_em?: string
          id?: string
          nome_completo?: string | null
          preferencias?: Json
          tenant_id?: string
          ultimo_acesso_em?: string | null
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      projetos: {
        Row: {
          archived_at: string | null
          atualizado_em: string
          cor: string | null
          criado_em: string
          descricao: string | null
          id: string
          metadados: Json | null
          status: string
          tenant_id: string
          titulo: string
          usuario_id: string
        }
        Insert: {
          archived_at?: string | null
          atualizado_em?: string
          cor?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          metadados?: Json | null
          status?: string
          tenant_id: string
          titulo: string
          usuario_id: string
        }
        Update: {
          archived_at?: string | null
          atualizado_em?: string
          cor?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          metadados?: Json | null
          status?: string
          tenant_id?: string
          titulo?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projetos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      protocolo_ativos: {
        Row: {
          adicionado_em: string
          ativo_id: string
          funcao: string | null
          protocolo_id: string
          tenant_id: string
        }
        Insert: {
          adicionado_em?: string
          ativo_id: string
          funcao?: string | null
          protocolo_id: string
          tenant_id: string
        }
        Update: {
          adicionado_em?: string
          ativo_id?: string
          funcao?: string | null
          protocolo_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocolo_ativos_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocolo_ativos_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocolo_ativos_protocolo_id_fkey"
            columns: ["protocolo_id"]
            isOneToOne: false
            referencedRelation: "protocolos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocolo_ativos_protocolo_id_fkey"
            columns: ["protocolo_id"]
            isOneToOne: false
            referencedRelation: "v_protocolos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocolo_ativos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      protocolos: {
        Row: {
          archived_at: string | null
          atualizado_em: string
          codigo_interno: string | null
          criado_em: string
          favorito: boolean
          id: string
          maturidade: Database["public"]["Enums"]["maturidade_protocolo"] | null
          metadados: Json | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"]
          tags: string[]
          tenant_id: string
        }
        Insert: {
          archived_at?: string | null
          atualizado_em?: string
          codigo_interno?: string | null
          criado_em?: string
          favorito?: boolean
          id?: string
          maturidade?:
            | Database["public"]["Enums"]["maturidade_protocolo"]
            | null
          metadados?: Json | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          tags?: string[]
          tenant_id: string
        }
        Update: {
          archived_at?: string | null
          atualizado_em?: string
          codigo_interno?: string | null
          criado_em?: string
          favorito?: boolean
          id?: string
          maturidade?:
            | Database["public"]["Enums"]["maturidade_protocolo"]
            | null
          metadados?: Json | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          tags?: string[]
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocolos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_progress: {
        Row: {
          concluido_em: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id: string
          iniciado_em: string
          notas_marginais: Json
          percentual_lido: number
          posicao_scroll: number | null
          tempo_total_segundos: number
          tenant_id: string
          ultima_leitura_em: string
          usuario_id: string
        }
        Insert: {
          concluido_em?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          iniciado_em?: string
          notas_marginais?: Json
          percentual_lido?: number
          posicao_scroll?: number | null
          tempo_total_segundos?: number
          tenant_id: string
          ultima_leitura_em?: string
          usuario_id: string
        }
        Update: {
          concluido_em?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["tipo_entidade"]
          id?: string
          iniciado_em?: string
          notas_marginais?: Json
          percentual_lido?: number
          posicao_scroll?: number | null
          tempo_total_segundos?: number
          tenant_id?: string
          ultima_leitura_em?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      referencia_casos: {
        Row: {
          adicionado_em: string
          caso_id: string
          referencia_id: string
          tenant_id: string
        }
        Insert: {
          adicionado_em?: string
          caso_id: string
          referencia_id: string
          tenant_id: string
        }
        Update: {
          adicionado_em?: string
          caso_id?: string
          referencia_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referencia_casos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_clinicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencia_casos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_casos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencia_casos_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "referencias_cientificas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencia_casos_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "v_referencias_sem_embedding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencia_casos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      referencia_formulas: {
        Row: {
          adicionado_em: string
          formula_id: string
          referencia_id: string
          relevancia: string | null
          tenant_id: string
        }
        Insert: {
          adicionado_em?: string
          formula_id: string
          referencia_id: string
          relevancia?: string | null
          tenant_id: string
        }
        Update: {
          adicionado_em?: string
          formula_id?: string
          referencia_id?: string
          relevancia?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referencia_formulas_formula_id_fkey"
            columns: ["formula_id"]
            isOneToOne: false
            referencedRelation: "formulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencia_formulas_formula_id_fkey"
            columns: ["formula_id"]
            isOneToOne: false
            referencedRelation: "v_formulas_ativas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencia_formulas_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "referencias_cientificas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencia_formulas_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "v_referencias_sem_embedding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencia_formulas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      referencia_protocolos: {
        Row: {
          adicionado_em: string
          protocolo_id: string
          referencia_id: string
          tenant_id: string
        }
        Insert: {
          adicionado_em?: string
          protocolo_id: string
          referencia_id: string
          tenant_id: string
        }
        Update: {
          adicionado_em?: string
          protocolo_id?: string
          referencia_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referencia_protocolos_protocolo_id_fkey"
            columns: ["protocolo_id"]
            isOneToOne: false
            referencedRelation: "protocolos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencia_protocolos_protocolo_id_fkey"
            columns: ["protocolo_id"]
            isOneToOne: false
            referencedRelation: "v_protocolos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencia_protocolos_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "referencias_cientificas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencia_protocolos_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "v_referencias_sem_embedding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencia_protocolos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      referencias_cientificas: {
        Row: {
          abstract: string | null
          acessado_em: string | null
          ano_publicacao: number | null
          archived_at: string | null
          atualizado_em: string
          autores: string[] | null
          conclusoes_principais: string | null
          conflito_interesses: boolean | null
          criado_em: string
          doi: string | null
          favorito: boolean
          fts_document: unknown
          id: string
          isbn: string | null
          journal: string | null
          limitacoes: string | null
          metadados: Json | null
          n_amostras: number | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"]
          nivel_evidencia: Database["public"]["Enums"]["nivel_evidencia"] | null
          notas_pessoais: string | null
          pmid: string | null
          populacao_estudo: string | null
          status_extracao:
            | Database["public"]["Enums"]["status_extracao_texto"]
            | null
          tags: string[]
          tenant_id: string
          texto_extraido: string | null
          tipo_estudo: Database["public"]["Enums"]["tipo_estudo"] | null
          titulo: string
          url: string | null
        }
        Insert: {
          abstract?: string | null
          acessado_em?: string | null
          ano_publicacao?: number | null
          archived_at?: string | null
          atualizado_em?: string
          autores?: string[] | null
          conclusoes_principais?: string | null
          conflito_interesses?: boolean | null
          criado_em?: string
          doi?: string | null
          favorito?: boolean
          fts_document?: unknown
          id?: string
          isbn?: string | null
          journal?: string | null
          limitacoes?: string | null
          metadados?: Json | null
          n_amostras?: number | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          nivel_evidencia?:
            | Database["public"]["Enums"]["nivel_evidencia"]
            | null
          notas_pessoais?: string | null
          pmid?: string | null
          populacao_estudo?: string | null
          status_extracao?:
            | Database["public"]["Enums"]["status_extracao_texto"]
            | null
          tags?: string[]
          tenant_id: string
          texto_extraido?: string | null
          tipo_estudo?: Database["public"]["Enums"]["tipo_estudo"] | null
          titulo: string
          url?: string | null
        }
        Update: {
          abstract?: string | null
          acessado_em?: string | null
          ano_publicacao?: number | null
          archived_at?: string | null
          atualizado_em?: string
          autores?: string[] | null
          conclusoes_principais?: string | null
          conflito_interesses?: boolean | null
          criado_em?: string
          doi?: string | null
          favorito?: boolean
          fts_document?: unknown
          id?: string
          isbn?: string | null
          journal?: string | null
          limitacoes?: string | null
          metadados?: Json | null
          n_amostras?: number | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"]
          nivel_evidencia?:
            | Database["public"]["Enums"]["nivel_evidencia"]
            | null
          notas_pessoais?: string | null
          pmid?: string | null
          populacao_estudo?: string | null
          status_extracao?:
            | Database["public"]["Enums"]["status_extracao_texto"]
            | null
          tags?: string[]
          tenant_id?: string
          texto_extraido?: string | null
          tipo_estudo?: Database["public"]["Enums"]["tipo_estudo"] | null
          titulo?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referencias_cientificas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sessoes: {
        Row: {
          dispositivo: string | null
          duracao_segundos: number | null
          encerrada_em: string | null
          entidades_visitadas: Json | null
          id: string
          iniciada_em: string
          metadados: Json | null
          tenant_id: string
          usuario_id: string
        }
        Insert: {
          dispositivo?: string | null
          duracao_segundos?: number | null
          encerrada_em?: string | null
          entidades_visitadas?: Json | null
          id?: string
          iniciada_em?: string
          metadados?: Json | null
          tenant_id: string
          usuario_id: string
        }
        Update: {
          dispositivo?: string | null
          duracao_segundos?: number | null
          encerrada_em?: string | null
          entidades_visitadas?: Json | null
          id?: string
          iniciada_em?: string
          metadados?: Json | null
          tenant_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessoes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sinonimos_ativo: {
        Row: {
          adicionado_em: string
          ativo_id: string
          id: string
          sinonimo: string
          tipo_sinonimo: Database["public"]["Enums"]["tipo_sinonimo"] | null
        }
        Insert: {
          adicionado_em?: string
          ativo_id: string
          id?: string
          sinonimo: string
          tipo_sinonimo?: Database["public"]["Enums"]["tipo_sinonimo"] | null
        }
        Update: {
          adicionado_em?: string
          ativo_id?: string
          id?: string
          sinonimo?: string
          tipo_sinonimo?: Database["public"]["Enums"]["tipo_sinonimo"] | null
        }
        Relationships: [
          {
            foreignKeyName: "sinonimos_ativo_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "ativos_cosmeticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinonimos_ativo_ativo_id_fkey"
            columns: ["ativo_id"]
            isOneToOne: false
            referencedRelation: "v_ativos_com_contexto"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          archived_at: string | null
          ativo: boolean
          atualizado_em: string
          configuracoes: Json
          criado_em: string
          id: string
          nome: string
          plano: string
          slug: string
        }
        Insert: {
          archived_at?: string | null
          ativo?: boolean
          atualizado_em?: string
          configuracoes?: Json
          criado_em?: string
          id?: string
          nome: string
          plano?: string
          slug: string
        }
        Update: {
          archived_at?: string | null
          ativo?: boolean
          atualizado_em?: string
          configuracoes?: Json
          criado_em?: string
          id?: string
          nome?: string
          plano?: string
          slug?: string
        }
        Relationships: []
      }
      versoes_formula: {
        Row: {
          atualizado_em: string
          contraindicacoes: string | null
          criado_em: string
          descricao: string | null
          formula_id: string
          fts_document: unknown
          id: string
          indicacoes: string | null
          instrucoes: string | null
          modo_preparo: string | null
          modo_uso: string | null
          motivo_alteracao: string | null
          numero_versao: number
          objetivo: string | null
          status: Database["public"]["Enums"]["status_versao"]
          tenant_id: string
          titulo: string
          validade_dias: number | null
          veiculo: string | null
        }
        Insert: {
          atualizado_em?: string
          contraindicacoes?: string | null
          criado_em?: string
          descricao?: string | null
          formula_id: string
          fts_document?: unknown
          id?: string
          indicacoes?: string | null
          instrucoes?: string | null
          modo_preparo?: string | null
          modo_uso?: string | null
          motivo_alteracao?: string | null
          numero_versao: number
          objetivo?: string | null
          status?: Database["public"]["Enums"]["status_versao"]
          tenant_id: string
          titulo: string
          validade_dias?: number | null
          veiculo?: string | null
        }
        Update: {
          atualizado_em?: string
          contraindicacoes?: string | null
          criado_em?: string
          descricao?: string | null
          formula_id?: string
          fts_document?: unknown
          id?: string
          indicacoes?: string | null
          instrucoes?: string | null
          modo_preparo?: string | null
          modo_uso?: string | null
          motivo_alteracao?: string | null
          numero_versao?: number
          objetivo?: string | null
          status?: Database["public"]["Enums"]["status_versao"]
          tenant_id?: string
          titulo?: string
          validade_dias?: number | null
          veiculo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "versoes_formula_formula_id_fkey"
            columns: ["formula_id"]
            isOneToOne: false
            referencedRelation: "formulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "versoes_formula_formula_id_fkey"
            columns: ["formula_id"]
            isOneToOne: false
            referencedRelation: "v_formulas_ativas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "versoes_formula_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      versoes_observacao: {
        Row: {
          conteudo: string
          criado_em: string
          fts_document: unknown
          id: string
          is_versao_atual: boolean
          justificativa: string | null
          numero_versao: number
          observacao_id: string
          status_epistemico: Database["public"]["Enums"]["status_epistemico"]
          tenant_id: string
        }
        Insert: {
          conteudo: string
          criado_em?: string
          fts_document?: unknown
          id?: string
          is_versao_atual?: boolean
          justificativa?: string | null
          numero_versao: number
          observacao_id: string
          status_epistemico: Database["public"]["Enums"]["status_epistemico"]
          tenant_id: string
        }
        Update: {
          conteudo?: string
          criado_em?: string
          fts_document?: unknown
          id?: string
          is_versao_atual?: boolean
          justificativa?: string | null
          numero_versao?: number
          observacao_id?: string
          status_epistemico?: Database["public"]["Enums"]["status_epistemico"]
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "versoes_observacao_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "observacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "versoes_observacao_observacao_id_fkey"
            columns: ["observacao_id"]
            isOneToOne: false
            referencedRelation: "v_observacoes_atuais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "versoes_observacao_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      versoes_protocolo: {
        Row: {
          atualizado_em: string
          autor: string | null
          contraindicacoes: string | null
          criado_em: string
          descricao: string | null
          duracao_semanas: number | null
          frequencia_sessoes: string | null
          fts_document: unknown
          id: string
          indicacoes: string | null
          maturidade: Database["public"]["Enums"]["maturidade_protocolo"]
          motivo_alteracao: string | null
          numero_versao: number
          objetivo: string | null
          observacoes_importantes: string | null
          protocolo_id: string
          status: Database["public"]["Enums"]["status_versao"]
          tenant_id: string
          titulo: string
        }
        Insert: {
          atualizado_em?: string
          autor?: string | null
          contraindicacoes?: string | null
          criado_em?: string
          descricao?: string | null
          duracao_semanas?: number | null
          frequencia_sessoes?: string | null
          fts_document?: unknown
          id?: string
          indicacoes?: string | null
          maturidade?: Database["public"]["Enums"]["maturidade_protocolo"]
          motivo_alteracao?: string | null
          numero_versao: number
          objetivo?: string | null
          observacoes_importantes?: string | null
          protocolo_id: string
          status?: Database["public"]["Enums"]["status_versao"]
          tenant_id: string
          titulo: string
        }
        Update: {
          atualizado_em?: string
          autor?: string | null
          contraindicacoes?: string | null
          criado_em?: string
          descricao?: string | null
          duracao_semanas?: number | null
          frequencia_sessoes?: string | null
          fts_document?: unknown
          id?: string
          indicacoes?: string | null
          maturidade?: Database["public"]["Enums"]["maturidade_protocolo"]
          motivo_alteracao?: string | null
          numero_versao?: number
          objetivo?: string | null
          observacoes_importantes?: string | null
          protocolo_id?: string
          status?: Database["public"]["Enums"]["status_versao"]
          tenant_id?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "versoes_protocolo_protocolo_id_fkey"
            columns: ["protocolo_id"]
            isOneToOne: false
            referencedRelation: "protocolos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "versoes_protocolo_protocolo_id_fkey"
            columns: ["protocolo_id"]
            isOneToOne: false
            referencedRelation: "v_protocolos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "versoes_protocolo_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_ativos_com_contexto: {
        Row: {
          archived_at: string | null
          atualizado_em: string | null
          concentracao_usual: number | null
          count_formulas_ativas: number | null
          count_observacoes: number | null
          count_referencias: number | null
          criado_em: string | null
          descricao: string | null
          familia_quimica_id: string | null
          familia_quimica_nome: string | null
          funcoes: string[] | null
          id: string | null
          indicacoes: string[] | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"] | null
          nome: string | null
          nome_inci: string | null
          outros_nomes: string[] | null
          ph_maximo: number | null
          ph_minimo: number | null
          status_epistemico:
            | Database["public"]["Enums"]["status_epistemico"]
            | null
          tenant_id: string | null
          unidade_concentracao: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ativos_cosmeticos_familia_quimica_id_fkey"
            columns: ["familia_quimica_id"]
            isOneToOne: false
            referencedRelation: "familias_quimicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ativos_cosmeticos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      v_bilhetes_pendentes: {
        Row: {
          conteudo: string | null
          criado_em: string | null
          entidades_relacionadas: Json | null
          horas_pendente: number | null
          id: string | null
          padrao_id: string | null
          tenant_id: string | null
          tipo: Database["public"]["Enums"]["tipo_bilhete"] | null
          titulo: string | null
        }
        Insert: {
          conteudo?: string | null
          criado_em?: string | null
          entidades_relacionadas?: Json | null
          horas_pendente?: never
          id?: string | null
          padrao_id?: string | null
          tenant_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_bilhete"] | null
          titulo?: string | null
        }
        Update: {
          conteudo?: string | null
          criado_em?: string | null
          entidades_relacionadas?: Json | null
          horas_pendente?: never
          id?: string | null
          padrao_id?: string | null
          tenant_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_bilhete"] | null
          titulo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bilhetes_aurora_padrao_id_fkey"
            columns: ["padrao_id"]
            isOneToOne: false
            referencedRelation: "padroes_aurora"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bilhetes_aurora_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      v_casos_ativos: {
        Row: {
          aberto_em: string | null
          atualizado_em: string | null
          criado_em: string | null
          id: string | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"] | null
          objetivos: string[] | null
          paciente_id: string | null
          queixa_principal: string | null
          status: Database["public"]["Enums"]["status_caso"] | null
          tenant_id: string | null
          total_evolucoes: number | null
          ultimo_atendimento_em: string | null
          versao_protocolo_id: string | null
        }
        Insert: {
          aberto_em?: string | null
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"] | null
          objetivos?: string[] | null
          paciente_id?: string | null
          queixa_principal?: string | null
          status?: Database["public"]["Enums"]["status_caso"] | null
          tenant_id?: string | null
          total_evolucoes?: never
          ultimo_atendimento_em?: never
          versao_protocolo_id?: string | null
        }
        Update: {
          aberto_em?: string | null
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"] | null
          objetivos?: string[] | null
          paciente_id?: string | null
          queixa_principal?: string | null
          status?: Database["public"]["Enums"]["status_caso"] | null
          tenant_id?: string | null
          total_evolucoes?: never
          ultimo_atendimento_em?: never
          versao_protocolo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "casos_clinicos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "casos_clinicos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "casos_clinicos_versao_protocolo_id_fkey"
            columns: ["versao_protocolo_id"]
            isOneToOne: false
            referencedRelation: "v_protocolos_ativos"
            referencedColumns: ["versao_id"]
          },
          {
            foreignKeyName: "casos_clinicos_versao_protocolo_id_fkey"
            columns: ["versao_protocolo_id"]
            isOneToOne: false
            referencedRelation: "versoes_protocolo"
            referencedColumns: ["id"]
          },
        ]
      }
      v_colecoes_com_contagem: {
        Row: {
          atualizado_em: string | null
          cor: string | null
          criado_em: string | null
          descricao: string | null
          id: string | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"] | null
          tenant_id: string | null
          titulo: string | null
          total_itens: number | null
          usuario_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          cor?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"] | null
          tenant_id?: string | null
          titulo?: string | null
          total_itens?: never
          usuario_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          cor?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso"] | null
          tenant_id?: string | null
          titulo?: string | null
          total_itens?: never
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "colecoes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      v_formulas_ativas: {
        Row: {
          atualizado_em: string | null
          codigo_interno: string | null
          contraindicacoes: string | null
          criado_em: string | null
          descricao: string | null
          id: string | null
          indicacoes: string | null
          instrucoes: string | null
          modo_uso: string | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"] | null
          numero_versao: number | null
          tenant_id: string | null
          titulo: string | null
          total_ativos: number | null
          validade_dias: number | null
          versao_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "formulas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      v_observacoes_atuais: {
        Row: {
          atualizado_em: string | null
          conteudo: string | null
          criado_em: string | null
          id: string | null
          justificativa: string | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"] | null
          numero_versao: number | null
          status_epistemico:
            | Database["public"]["Enums"]["status_epistemico"]
            | null
          tenant_id: string | null
          titulo: string | null
          total_ativos_vinculados: number | null
          total_referencias_vinculadas: number | null
          versao_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "observacoes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      v_protocolos_ativos: {
        Row: {
          atualizado_em: string | null
          codigo_interno: string | null
          contraindicacoes: string | null
          criado_em: string | null
          descricao: string | null
          duracao_semanas: number | null
          frequencia_sessoes: string | null
          id: string | null
          indicacoes: string | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso"] | null
          numero_versao: number | null
          tenant_id: string | null
          titulo: string | null
          total_fases: number | null
          versao_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "protocolos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      v_referencias_sem_embedding: {
        Row: {
          abstract: string | null
          id: string | null
          tenant_id: string | null
          texto_extraido: string | null
          titulo: string | null
        }
        Insert: {
          abstract?: string | null
          id?: string | null
          tenant_id?: string | null
          texto_extraido?: string | null
          titulo?: string | null
        }
        Update: {
          abstract?: string | null
          id?: string | null
          tenant_id?: string | null
          texto_extraido?: string | null
          titulo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referencias_cientificas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      arquivar_entidade: {
        Args: {
          p_entity_id: string
          p_entity_type: Database["public"]["Enums"]["tipo_entidade"]
          p_motivo?: string
        }
        Returns: boolean
      }
      busca_universal: {
        Args: {
          p_entity_types?: Database["public"]["Enums"]["tipo_entidade"][]
          p_limit?: number
          p_offset?: number
          p_query: string
        }
        Returns: {
          archived_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          relevancia: number
          resumo: string
          titulo: string
        }[]
      }
      criar_versao_formula: {
        Args: {
          p_composicao?: Json
          p_contraindicacoes?: string
          p_descricao?: string
          p_formula_id: string
          p_indicacoes?: string
          p_instrucoes?: string
          p_modo_uso?: string
          p_motivo_alteracao?: string
          p_titulo: string
          p_validade_dias?: number
        }
        Returns: Json
      }
      fn_aurora_ja_processou: {
        Args: { p_chave: string; p_tenant_id: string; p_tipo_contexto: string }
        Returns: boolean
      }
      fn_aurora_registrar_contexto: {
        Args: {
          p_chave: string
          p_cooling_down_dias?: number
          p_entidades_envolvidas?: Json
          p_metadados?: Json
          p_tenant_id: string
          p_tipo_contexto: string
        }
        Returns: Json
      }
      fn_current_tenant_id: { Args: never; Returns: string }
      fn_current_user_id: { Args: never; Returns: string }
      fn_current_user_role: { Args: never; Returns: string }
      fn_custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      fn_is_clinical_role: { Args: never; Returns: boolean }
      fn_is_owner_or_admin: { Args: never; Returns: boolean }
      get_contexto_ativo: { Args: { p_ativo_id: string }; Returns: Json }
      get_contexto_caso: { Args: { p_caso_id: string }; Returns: Json }
      get_mesa_pesquisa: { Args: never; Returns: Json }
      kc_connect: {
        Args: {
          p_confidence?: number
          p_connection_type: string
          p_generated_by?: string
          p_notas?: string
          p_source_id: string
          p_source_type: Database["public"]["Enums"]["tipo_entidade"]
          p_target_id: string
          p_target_type: Database["public"]["Enums"]["tipo_entidade"]
        }
        Returns: Json
      }
      kc_neighbors: {
        Args: {
          p_connection_type?: string
          p_entity_id: string
          p_entity_type: Database["public"]["Enums"]["tipo_entidade"]
          p_limit?: number
          p_min_confidence?: number
        }
        Returns: {
          confidence: number
          connection_type: string
          criado_em: string
          direction: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["tipo_entidade"]
          generated_by: string
        }[]
      }
      lgpd_check_patient: { Args: { p_paciente_id: string }; Returns: Json }
      marcar_bilhete_lido: { Args: { p_bilhete_id: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      unaccent: { Args: { "": string }; Returns: string }
      validar_observacao: {
        Args: {
          p_conteudo?: string
          p_justificativa: string
          p_novo_status: Database["public"]["Enums"]["status_epistemico"]
          p_observacao_id: string
          p_referencias_ids?: string[]
        }
        Returns: Json
      }
    }
    Enums: {
      classificacao_seguranca:
        | "publica"
        | "privada"
        | "clinica"
        | "confidencial"
        | "interna"
      fase_incorporacao:
        | "fase_aquosa"
        | "fase_oleosa"
        | "fase_emulsificante"
        | "fase_final"
        | "ativo_principal"
        | "preservante"
        | "ajuste_ph"
        | "outro"
      maturidade_protocolo:
        | "hipotese"
        | "em_validacao"
        | "validado_internamente"
        | "consolidado"
        | "referencia_biblioteca"
      nivel_acesso:
        | "publico"
        | "privado"
        | "mrr"
        | "toda_natural"
        | "interno"
        | "confidencial"
        | "clinica"
      nivel_evidencia: "ia" | "ib" | "iia" | "iib" | "iii" | "iv" | "v"
      status_caso:
        | "aberto"
        | "em_acompanhamento"
        | "encerrado"
        | "arquivado"
        | "em_avaliacao"
        | "em_tratamento"
        | "alta_clinica"
      status_epistemico:
        | "hipotese"
        | "observacao"
        | "validada"
        | "refutada"
        | "arquivada"
        | "em_observacao"
        | "parcialmente_validada"
      status_extracao_texto:
        | "pendente"
        | "processando"
        | "concluido"
        | "falhou"
        | "manual"
      status_producao:
        | "ideia"
        | "rascunho"
        | "revisao"
        | "aprovado"
        | "publicado"
        | "arquivado"
      status_versao: "rascunho" | "ativa" | "substituida" | "arquivada"
      tipo_audit:
        | "insert"
        | "update"
        | "delete"
        | "archive"
        | "restore"
        | "login"
        | "logout"
        | "lgpd_exclusao"
        | "lgpd_acesso"
        | "export"
        | "import"
        | "permission_change"
        | "system"
      tipo_bilhete:
        | "conexao"
        | "padrao"
        | "lembrete"
        | "descoberta"
        | "reflexao"
        | "marco"
      tipo_entidade:
        | "ativo_cosmetico"
        | "referencia_cientifica"
        | "formula"
        | "protocolo"
        | "caso_clinico"
        | "observacao"
        | "producao"
        | "colecao"
        | "projeto"
        | "pergunta_clinica"
        | "paciente"
        | "bilhete_aurora"
      tipo_estudo:
        | "ensaio_clinico_randomizado"
        | "revisao_sistematica"
        | "meta_analise"
        | "estudo_observacional"
        | "relato_caso"
        | "revisao_narrativa"
        | "estudo_in_vitro"
        | "estudo_in_vivo"
        | "diretriz"
        | "consenso"
        | "outro"
        | "estudo_clinico"
        | "coorte"
        | "caso_controle"
        | "estudo_transversal"
        | "estudo_em_animais"
        | "artigo_opiniao"
      tipo_evolucao_caso:
        | "consulta"
        | "retorno"
        | "avaliacao_resultado"
        | "intercorrencia"
        | "encerramento"
        | "outro"
      tipo_observacao:
        | "observacao"
        | "hipotese"
        | "pergunta_clinica"
        | "insight"
        | "lembrete"
        | "ideia"
        | "descoberta"
      tipo_padrao_aurora:
        | "conexao"
        | "hipotese_madura"
        | "lacuna"
        | "padrao_de_uso"
        | "marco"
      tipo_sinonimo:
        | "nome_comercial"
        | "nome_popular"
        | "nome_cientifico"
        | "nome_inci_alternativo"
        | "abreviacao"
        | "outro"
      user_role:
        | "owner"
        | "admin"
        | "clinician"
        | "mrr_student"
        | "mrr_tutor"
        | "toda_natural_team"
        | "external_reviewer"
        | "guest"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  lgpd: {
    Enums: {},
  },
  public: {
    Enums: {
      classificacao_seguranca: [
        "publica",
        "privada",
        "clinica",
        "confidencial",
        "interna",
      ],
      fase_incorporacao: [
        "fase_aquosa",
        "fase_oleosa",
        "fase_emulsificante",
        "fase_final",
        "ativo_principal",
        "preservante",
        "ajuste_ph",
        "outro",
      ],
      maturidade_protocolo: [
        "hipotese",
        "em_validacao",
        "validado_internamente",
        "consolidado",
        "referencia_biblioteca",
      ],
      nivel_acesso: [
        "publico",
        "privado",
        "mrr",
        "toda_natural",
        "interno",
        "confidencial",
        "clinica",
      ],
      nivel_evidencia: ["ia", "ib", "iia", "iib", "iii", "iv", "v"],
      status_caso: [
        "aberto",
        "em_acompanhamento",
        "encerrado",
        "arquivado",
        "em_avaliacao",
        "em_tratamento",
        "alta_clinica",
      ],
      status_epistemico: [
        "hipotese",
        "observacao",
        "validada",
        "refutada",
        "arquivada",
        "em_observacao",
        "parcialmente_validada",
      ],
      status_extracao_texto: [
        "pendente",
        "processando",
        "concluido",
        "falhou",
        "manual",
      ],
      status_producao: [
        "ideia",
        "rascunho",
        "revisao",
        "aprovado",
        "publicado",
        "arquivado",
      ],
      status_versao: ["rascunho", "ativa", "substituida", "arquivada"],
      tipo_audit: [
        "insert",
        "update",
        "delete",
        "archive",
        "restore",
        "login",
        "logout",
        "lgpd_exclusao",
        "lgpd_acesso",
        "export",
        "import",
        "permission_change",
        "system",
      ],
      tipo_bilhete: [
        "conexao",
        "padrao",
        "lembrete",
        "descoberta",
        "reflexao",
        "marco",
      ],
      tipo_entidade: [
        "ativo_cosmetico",
        "referencia_cientifica",
        "formula",
        "protocolo",
        "caso_clinico",
        "observacao",
        "producao",
        "colecao",
        "projeto",
        "pergunta_clinica",
        "paciente",
        "bilhete_aurora",
      ],
      tipo_estudo: [
        "ensaio_clinico_randomizado",
        "revisao_sistematica",
        "meta_analise",
        "estudo_observacional",
        "relato_caso",
        "revisao_narrativa",
        "estudo_in_vitro",
        "estudo_in_vivo",
        "diretriz",
        "consenso",
        "outro",
        "estudo_clinico",
        "coorte",
        "caso_controle",
        "estudo_transversal",
        "estudo_em_animais",
        "artigo_opiniao",
      ],
      tipo_evolucao_caso: [
        "consulta",
        "retorno",
        "avaliacao_resultado",
        "intercorrencia",
        "encerramento",
        "outro",
      ],
      tipo_observacao: [
        "observacao",
        "hipotese",
        "pergunta_clinica",
        "insight",
        "lembrete",
        "ideia",
        "descoberta",
      ],
      tipo_padrao_aurora: [
        "conexao",
        "hipotese_madura",
        "lacuna",
        "padrao_de_uso",
        "marco",
      ],
      tipo_sinonimo: [
        "nome_comercial",
        "nome_popular",
        "nome_cientifico",
        "nome_inci_alternativo",
        "abreviacao",
        "outro",
      ],
      user_role: [
        "owner",
        "admin",
        "clinician",
        "mrr_student",
        "mrr_tutor",
        "toda_natural_team",
        "external_reviewer",
        "guest",
      ],
    },
  },
} as const
