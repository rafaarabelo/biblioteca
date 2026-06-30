-- ============================================================
-- Seed 004: Contraindicações Cosméticas
-- Biblioteca Cosmetológica Rafa Rabelo
-- ============================================================

INSERT INTO public.contraindicacoes_cosmeticas (nome, descricao, severidade) VALUES
('Gestação', 'Período gestacional. Vários ativos com potencial teratogênico ou de absorção sistêmica são contraindicados. Avaliar risco-benefício com médico.', 'moderada'),
('Amamentação', 'Período de lactação. Ativos com potencial de excreção no leite materno ou absorção sistêmica requerem cautela.', 'moderada'),
('Hipersensibilidade ao componente', 'Histórico de reação alérgica (imediata ou tardia) ao ativo ou a compostos estruturalmente similares.', 'severa'),
('Pele lesionada ou inflamada', 'Feridas abertas, erosões, pele com inflamação ativa ou barreira gravemente comprometida. Risco de absorção aumentada e irritação.', 'severa'),
('Dermatite de contato ativa', 'Processo de dermatite de contato em atividade. Evitar qualquer novo ativo até resolução.', 'severa'),
('Uso sobre mucosas', 'Não aplicar em mucosas (lábios, vaginal, anal, ocular, nasal) salvo formulação especificamente desenvolvida para esta via.', 'moderada'),
('Região periocular (sem formulação específica)', 'Área próxima aos olhos requer formulações de pH e perfil específicos. Ingredientes para pele facial podem causar irritação ocular severa.', 'moderada'),
('Exposição solar imediata pós-aplicação', 'Fotossensibilizantes que aumentam a suscetibilidade da pele à radiação UV. Usar à noite ou com proteção solar adequada.', 'moderada'),
('Fototipo I e II sem proteção solar', 'Fototipos muito claros têm maior risco de danos actínicos. Fotossensibilizantes requerem proteção solar rigorosa.', 'leve'),
('Pele com feridas abertas', 'Soluções de continuidade na pele (cortes, abrasões, escoriações) contraindica uso local por risco de infecção e absorção aumentada.', 'severa'),
('Criança menor de 3 anos', 'Sistema enzimático imaturo e relação superfície/volume elevada aumentam risco de toxicidade sistêmica em crianças pequenas.', 'severa'),
('Criança menor de 12 anos', 'Alguns ingredientes contraindicados por razões regulatórias ou de segurança até os 12 anos.', 'moderada'),
('Período pós-procedimento imediato', 'Primeiros dias após procedimentos estéticos (peeling, laser, microagulhamento, depilação). Barreira comprometida aumenta risco de reação.', 'moderada'),
('Uso simultâneo de retinóides prescritos', 'Potencialização de irritação e fotossensibilidade ao combinar com ácido retinoico ou adapaleno prescritos por dermatologista.', 'moderada'),
('Doença renal', 'Ingredientes com potencial de acúmulo ou toxicidade renal em aplicações extensas ou de alta concentração.', 'moderada'),
('Epilepsia (óleos essenciais específicos)', 'Alguns óleos essenciais (eucalipto, cânfora, hortelã em altas doses) podem baixar limiar de convulsão.', 'severa'),
('Pele atópica grave em crise', 'Dermatite atópica em exacerbação grave. Aguardar estabilização antes de introduzir novos ativos.', 'moderada'),
('Uso com quelantes em pele sensível', 'Combinação de quelantes fortes com outros ácidos pode comprometer a barreira em peles reativas.', 'leve'),
('Hiperpigmentação por uso inadequado', 'Paradoxo: uso incorreto de despigmentantes (concentração inadequada, sem fotoproteção) pode piorar a hiperpigmentação.', 'moderada'),
('Alergia conhecida a Asteraceae (Compostas)', 'Família botânica que inclui camomila, calêndula, arnica, equinácea. Reatividade cruzada frequente.', 'severa'),
('Alergia a proteínas do leite (caseína)', 'Produtos contendo derivados lácteos podem causar reação em indivíduos com alergia à proteína do leite.', 'severa'),
('Sensibilidade à fragrância', 'Histórico de reações a perfumes e componentes aromáticos. Priorizar formulações fragrance-free.', 'moderada'),
('Uso concomitante com medicamentos tópicos', 'Interação potencial com medicamentos tópicos prescritos. Avaliar intervalo de aplicação e compatibilidade.', 'leve'),
('Rosacea estágio avançado', 'Certos ativos ácidos ou com potencial vasoativo podem agravar a rosácea em estágios avançados.', 'moderada')
ON CONFLICT (nome) DO NOTHING;
