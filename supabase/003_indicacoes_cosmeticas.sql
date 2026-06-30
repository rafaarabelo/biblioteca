-- ============================================================
-- Seed 003: Indicações Cosméticas
-- Biblioteca Cosmetológica Rafa Rabelo
-- ============================================================

INSERT INTO public.indicacoes_cosmeticas (nome, descricao, categoria) VALUES
-- Pele
('Acne e oleosidade excessiva', 'Pele com produção aumentada de sebo, poros dilatados, comedões e/ou lesões inflamatórias acneicas.', 'pele'),
('Fotoenvelhecimento', 'Sinais do envelhecimento induzidos pela exposição solar: manchas, rugas, flacidez e alterações de textura.', 'pele'),
('Hiperpigmentação', 'Manchas escurecidas localizadas (melasma, lentigo, pós-inflamatória) causadas por excesso de melanina.', 'pele'),
('Ressecamento cutâneo', 'Pele com hidratação reduzida, sensação de tensão, aspereza ou descamação fina.', 'pele'),
('Rugas e linhas de expressão', 'Marcas cutâneas decorrentes do envelhecimento cronológico e actínico, expressões faciais repetitivas e perda de colágeno.', 'pele'),
('Pele sensível e reativa', 'Pele com limiar de tolerância reduzido, propensa a vermelhidão, coceira, ardor e reações a produtos.', 'pele'),
('Rosácea', 'Condição cutânea crônica com eritema facial persistente, telangiectasias e episódios de flushing.', 'pele'),
('Dermatite seborreica', 'Condição inflamatória crônica com descamação em áreas ricas em glândulas sebáceas (couro cabeludo, face, tórax).', 'pele'),
('Cicatrizes e marcas pós-acne', 'Sequelas de lesões acneicas: manchas escuras (PIH), manchas avermelhadas (PIE) e cicatrizes atróficas.', 'pele'),
('Firmeza e elasticidade', 'Perda de tônus e elasticidade cutânea associada ao envelhecimento e redução de colágeno e elastina.', 'pele'),
('Olheiras e bolsas', 'Escurecimento periorbital (pigmentar, vascular ou estrutural) e inchaço na região dos olhos.', 'pele'),
('Estrias', 'Marcas lineares na pele decorrentes de distensão rápida ou alterações hormonais.', 'pele'),
('Pele opaca e sem luminosidade', 'Pele sem brilho natural, com tom irregular e aparência cansada ou apagada.', 'pele'),
('Poros dilatados', 'Abertura visível dos poros, frequentemente associada a excesso de sebo e perda de elasticidade.', 'pele'),
('Desidratação cutânea', 'Estado de hidratação superficial reduzida, distinto de ressecamento: pele sente tensão mesmo sendo oleosa.', 'pele'),
('Pele madura', 'Pele com características do envelhecimento avançado: perda volumétrica, rugas, manchas, fragilidade.', 'pele'),
('Eritema e vermelhidão difusa', 'Rubor persistente sem diagnóstico específico, frequentemente ligado a reatividade ou barreira comprometida.', 'pele'),
('Pele com barreira comprometida', 'Função barreira prejudicada com aumento da PTEA, suscetibilidade a irritantes e infecções oportunistas.', 'pele'),
-- Cabelo
('Queda capilar', 'Eflúvio aumentado ou alopecia com redução da densidade capilar.', 'cabelo'),
('Cabelo ressecado e danificado', 'Fios com cutícula danificada, baixo brilho, fragilidade e dificuldade de penteabilidade.', 'cabelo'),
('Couro cabeludo oleoso', 'Produção excessiva de sebo no couro cabeludo, causando aspecto gorduroso rapidamente após lavar.', 'cabelo'),
('Caspa (dermatite seborreica capilar)', 'Descamação visível do couro cabeludo associada a inflamação crônica e Malassezia.', 'cabelo'),
('Frizz e volume excessivo', 'Fios que se expandem com umidade, com dificuldade de controle e alinhamento.', 'cabelo'),
('Quimicamente danificado', 'Cabelo com estrutura alterada por procedimentos químicos: coloração, descoloração, permanente.', 'cabelo'),
('Couro cabeludo sensível', 'Couro cabeludo com baixa tolerância a produtos, propenso a irritação, coceira e vermelhidão.', 'cabelo'),
-- Corporal
('Celulite (lipodistrofia ginoide)', 'Alteração morfológica do tecido adiposo subcutâneo com aspecto de casca de laranja.', 'corporal'),
('Flacidez corporal', 'Perda de firmeza e tônus da pele e tecidos corporais.', 'corporal'),
('Pele corporal ressecada', 'Ressecamento da pele do corpo, especialmente em extremidades e áreas de atrito.', 'corporal'),
-- Unhas
('Unhas quebradiças', 'Unhas frágeis, com tendência a quebrar, descamar ou apresentar estrias longitudinais.', 'unhas')
ON CONFLICT (nome) DO NOTHING;
