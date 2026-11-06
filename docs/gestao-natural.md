# Gestão Natural: a Biblioteca virando sistema de clínica

## Por que mudou

A Biblioteca nasceu como espaço de pesquisa: caderno de campo, acervo, fórmulas
com cada ativo cadastrado, casos clínicos anonimizados. Bonito no papel, pesado no
dia a dia. Na prática o pedido de manipulado acontecia no WhatsApp e nunca chegava
ao sistema, e quando o histórico do WhatsApp Business se perdeu, as fórmulas das
pacientes foram junto.

A Gestão Natural inverte esse fluxo: **o registro nasce aqui e o WhatsApp vira só o
meio de envio.** A Biblioteca continua existindo, como seção secundária do menu.

## O que tem agora

| Tela | Para quê |
| --- | --- |
| **Hoje** (`/hoje`) | Porta de entrada. Agenda do dia, atendimentos que ficaram sem prontuário, pedidos parados com a próxima ação de cada um, próximas sessões de programas e tarefas. |
| **Agenda** (`/agenda`) | Semana com navegação, novo horário, botão de lembrete no WhatsApp com texto pronto, "confirmou", "cancelar" e "registrar" depois do atendimento. |
| **Pacientes** (`/pacientes`) | Busca por nome, telefone ou e-mail. Ficha com abas: Resumo, Prontuário, Fórmulas e pedidos, Programas, Antes e depois. Alertas clínicos (gestante, alergias, medicamentos) sempre visíveis no topo. |
| **Pedidos manipulados** (`/pedidos`) | Quadro por etapa. Cada etapa diz qual é a tarefa ("cobrar orçamento", "avisar a paciente"). Pedido parado além do prazo fica destacado. Busca dentro das composições ("quem usou ácido azelaico?"). |
| **Programa de tratamento** (`/programas/[id]`) | Sessões com checklist e travas. |

### Pedidos como tarefas

Fluxo: rascunho → enviado à farmácia → orçamento recebido → aprovado → em
manipulação → pronto → entregue. Cada status tem uma próxima ação e um prazo de
alerta (em `PROXIMA_ACAO_PEDIDO` e `PRAZO_ALERTA_PEDIDO`, em
`src/features/clinica/dominio.ts`). Um botão "Feito, avançar" move o pedido e o
banco registra a linha do tempo sozinho.

Na tela do pedido há dois textos prontos: um para a farmácia (com a composição
completa) e outro para a paciente (só nome do produto e modo de uso), com botão de
copiar e de abrir direto no WhatsApp.

**Repetir pedido** copia todas as fórmulas para um pedido novo.
**Registrar fórmula antiga** serve para recuperar o que está nas mensagens antigas:
cola o texto, coloca a data original e ele entra no histórico sem virar tarefa.

### Travas dos programas

Cada sessão nasce com um checklist. Itens obrigatórios travam a conclusão, e a trava
mora no banco (trigger `fn_gn_sessao_travas`), não só na tela:

- 1ª sessão: termo de consentimento, anamnese revisada, foto ANTES
- todas: procedimento registrado no prontuário, orientações de home care
- última: foto DEPOIS, reavaliação e próximo passo
- a cada 4 sessões: foto de acompanhamento (opcional)
- nenhuma sessão é concluída antes da anterior

Algumas tarefas se marcam sozinhas: subir a foto antes/depois pela sessão marca o
item da foto; registrar o prontuário vinculado à sessão marca "prontuário". Quando a
última sessão é concluída o programa vira "concluído".

Para mudar o checklist padrão: função `checklistDaSessao` em `dominio.ts`.

### Prontuário

Registros não se editam nem se apagam (o banco só aceita INSERT). Correção ou
complemento entra como **adendo**, ligado ao registro original. Isso é o que se
espera de prontuário e protege você.

### Fotos

Bucket privado `fotos-clinicas` no Supabase Storage, separado por clínica. As fotos
são reduzidas no próprio celular antes de subir (~1600 px) e exibidas com link
temporário de 1 hora.

## Como ativar

1. No painel do Supabase, o projeto **Biblioteca** está pausado. Reative.
2. Abra **SQL Editor** e rode o conteúdo de `supabase/017_gestao_natural.sql`.
   Pode rodar mais de uma vez sem problema.
3. (Opcional) Regere os tipos: `npm run types:gen`.
4. Faça o deploy. Ao entrar, o sistema abre direto em **Hoje**.

A migration foi testada num Postgres 16 local: aplica do zero, reaplica sem erro, e
as travas, a numeração dos pedidos e a linha do tempo funcionam como descrito.
O que **não** foi testado ainda é a interface contra o banco real (ele estava
pausado), então vale um primeiro uso com uma paciente de teste.

## Próximos passos sugeridos

- **Equipe na mesma clínica.** Hoje cada cadastro novo cria uma clínica separada
  (trigger `on_auth_user_created`). Para outra pessoa usar o *mesmo* sistema é
  preciso um fluxo de convite que coloque o usuário no tenant existente.
- **Assinatura do termo de consentimento** dentro do sistema (a tabela
  `consentimentos` já existe).
- **Lembretes automáticos** de retorno e de pedido parado.
- **Ligar fórmula do pedido à Biblioteca**: quando uma composição se repete muito,
  transformar em fórmula da Biblioteca com um clique.

## Onde está o código

```
supabase/017_gestao_natural.sql        tabelas, travas, RLS e storage
src/features/clinica/dominio.ts        regras puras: status, próximas ações, checklist, textos de WhatsApp
src/features/clinica/dados.ts          leituras (server-only)
src/features/clinica/acoes.ts          server actions
src/features/clinica/ui/               formulários e componentes
src/app/(protected)/(clinica)/         as telas: hoje, agenda, pacientes, pedidos, programas
src/components/ui/MobileNav.tsx        barra inferior no celular
```
