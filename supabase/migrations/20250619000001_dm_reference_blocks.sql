-- Expand DM reference tab: move resources into roll_results and add missing quick-reference blocks.

UPDATE public.rule_blocks
SET category = 'roll_results', sort_order = 10
WHERE title = 'Resolve por Tier' AND category = 'resources';

INSERT INTO public.rule_blocks (title, body, category, sort_order)
SELECT v.title, v.body, 'roll_results', v.sort_order
FROM (VALUES
  (
    'Consequências (Parcial/Falha)',
    E'**Efeito Reduzido:** A ação produz resultado piorado.\n\n**Harm:** Ferimento persistente — diminui dado de Atitude. Requer tratamento.\n\n**Complicação:** Compromete recursos ou avança trilha problemática.\n\n**Agravamento A:** PJ perde E^ ou uma proteção.\n\n**Oport. Perdida:** Circunstâncias mudam; nova abordagem necessária.',
    4
  ),
  (
    'Ameaça (A) em Combate',
    E'**Dano base do ataque:**\n- Parcial (4–5) → 1 dano\n- Sucesso (6) → 2 dano\n- Crítico (6,6) → 4 dano\n\n*Dano final = resultado − Defesa do alvo*\n\n**Fora de combate:** gravidade das Consequências\n\n**Saves:** para impor condição, supere Save do alvo em 1 pt. Valor extra = dano.',
    5
  ),
  (
    'Defesa e Dano',
    E'**1º Defesa passiva** — dano < Def. = ignorado\n\n**2º Marque Wear** — em item defensivo\n\n**3º Marque Atitude** — sem item disponível\n\n**Wear 1:** usa 1 habilidade do item\n\n**Wear 2:** combina 2 habilidades OU amplia 1 (alcance/área/duração)\n\nCada marca de Atitude reduz o bônus naquela Atitude. Todas marcadas → inconsciente / Death''s Door.',
    6
  ),
  (
    'Ações em Combate',
    E'**3 ações + 1 reação por turno**\n\n| Ação | Custo | Descrição |\n| --- | --- | --- |\n| Atacar | 1 ação | Atitude + Combat Skill. Ataque extra = Cut 1 adicional. Parcial = 1 dano; Sucesso = 2 dano. |\n| Conjurar Spell | 2 ações + 1 Mana | Spells não rolam dados. Se causa dano, role maior combinação Atitude+Perícia disponível. |\n| Mover | 1 ação | Velocidade base. Levantar = metade da velocidade. |\n| Manobra | 1 ação | **Agarrar:** Brawl vs. Save Físico. **Empurrar:** Arms Heavy/Brawl vs. Save Físico. |\n| Buscar | 1 ação | Atitude + Perícia adequada para encontrar algo oculto. |\n| Interação | 1 ação | Sem rolagem: recarregar, sacar/guardar arma, beber poção, ativar mecanismo. |\n| Reação | 1/turno · Cut 1 | Responde a eventos fora do seu turno. Cut 1 automático na rolagem. |\n| Ação Livre | Sem custo | Abrir porta, pegar cobertura, falar brevemente com alguém. |',
    7
  ),
  (
    'Ações Especiais (Resolve)',
    E'**Esforço:** Marque 1 Resolve: **+1 dado** OU **E^** no resultado.\n\n**Ajuda:** Marque 1 Resolve + aceite Consequências: **+1 dado** à ação de aliado. Apenas 1 PJ por jogada.\n\n**Preparo:** Role Jogada de Ação para conceder **E^** em próxima ação (sua ou de aliado).\n\n**Liderar Equipe:** Todos rolam, usa o **melhor resultado**. Líder marca Harm por cada Falha obtida pelo grupo.\n\n**Proteção:** Sofra/resista Consequência no lugar de aliado. Ela marca **metade do Resolve** (arred. para baixo) que você marcar.\n\n**Retrospecto:** Declare ação passada que impacta o presente. **1 Resolve** (plausível) ou **2+ Resolve** (plano elaborado).\n\n**Barganha do Outro Lado:** MJ oferece **+1 dado** em troca de consequência narrativa. Sempre opcional. Dado concedido independente do resultado.',
    8
  ),
  (
    'Mana e Spells',
    E'**Drive:** Sem custo + gera 1 Mana ao usar.\n\n**Spell Ativo:** custa 1 Mana. Pode combinar com Esforço (2 Resolve → +E).\n\n**Spellcasting não é Perícia** — não compõe pool normalmente. Se causa dano, role melhor Atitude+Perícia disponível.\n\n**Maldição:** a cada spell, MJ rola 1d6 por spell já castado (reseta em Long Rest). 4–5 = 1 pt; 6 = 2 pts na trilha. Trilha chega a 4 → *Cursed!* (rola 1d6 extra por curse a cada cast).\n\n| Tier | Mana Máx. | Início Sessão | Long Rest |\n| --- | --- | --- | --- |\n| 1 | 2 | 1 Mana | Reset → 1 |\n| 2 | 3 | 1 Mana | Reset → 1 |\n| 3 | 4 | 1 Mana | Reset → 1 |',
    9
  ),
  (
    'Resolve e Recuperação',
    E'| Tier | Resolve Máx. |\n| --- | --- |\n| 1 | 2 |\n| 2 | 4 |\n| 3 | 6 |\n\n**Recuperar o Fôlego** *(1× por Short Rest)*\nDescreva contato com o Aspect. Role Atitude + bônus de Drive.\n\n| Resultado | Efeito |\n| --- | --- |\n| 6,6 Crítico | Apague todo Resolve + 2 Mana |\n| 6 Sucesso | Apague 4 Resolve |\n| 4–5 Parcial | Apague 3 Resolve |\n| 1–3 Falha | Apague 2 Resolve |\n\nOpção: recupere 1 marca de Atitude no lugar de 2 Resolve.\n\n**Descanso Curto** *(8h)* — Desmarca ½ Resolve máx. + 1 Atitude. *Não restaura Mana.*\n\n**Descanso Longo** *(1 semana)* — Desmarca todo Resolve + todas Atitudes. Reseta Mana → 1.',
    11
  ),
  (
    'Condições',
    E'| Condição | Tipo | Efeito |\n| --- | --- | --- |\n| Inspirado | Geral | Add 1 com Atitude inspirada. Dura até falhar. |\n| Desmoralizado | Geral | Cut 1 com Atitude afetada. Dura até ter sucesso. |\n| Resistência | Geral | Dano acima da Defesa reduzido à metade. |\n| Inconsciente | Geral | Sem ações ou reações. Ataques contra: Add 2. |\n| Atordoado | Geral | Apenas 1 ação por turno; sem reações. |\n| Sentidos Bloqueados | Geral | Ações têm 1d2 de chance de falhar; fica desequilibrado. |\n| Cobertura Meia | Fís. | +1 Defesa. |\n| Cobertura Total | Fís. | +2 Defesa. |\n| Flanqueado | Fís. | Inimigos em lados opostos: atacantes corpo-a-corpo têm Add 1. |\n| Altura | Fís. | +1 para o atacante em posição alta. |\n| Impedido | Fís. | Penalidade acumulativa: Cut 1, depois Cut 2, depois Cut 3. |\n| Deitado (Prone) | Fís. | +1 corpo-a-corpo contra. Cut 1 distância contra. |\n| Oculto | Fís. | +1 em ataques contra alvos que não percebem. |\n| Preso/Agarrado | Fís. | Não pode mover; Impedido. Corpo-a-corpo contra: Add 1. |\n| Fatigado | Fís. | 1 ação a menos; Cut 1 em todas rolagens. |\n| Terreno Difícil | Fís. | Movimento reduzido à metade. Ataques dentro: Cut 1. |\n| Amedrontado | Men. | Não move em direção ao medo. Cut 1 contra ele; ele tem Add 1. Dura 1 turno. |\n| Provocado | Men. | Cut 1 ao atacar quem não seja o provocador. 1 turno. |\n| Encantado | Men. | Fica próximo da fonte; ela tem Add 1. Perde efeito ao tomar dano. |\n| Confuso | Men. | Ações têm 1d2 de chance de ir na direção errada ou falhar. |\n| Sangrando | Esp. | Metade do dano (Atitudes) ao fim de cada turno até curar/estabilizar. |\n| Marcado | Esp. | Criador conhece localização até marca expirar (1 turno) ou ser consumida. |\n| Pierce (Perfurante) | Esp. | Resistência vira ausente; Imunidade vira Resistência. |\n| Silenciado | Esp. | Sem habilidades mágicas do equipamento (exceto armor slots). 1 turno. |\n| Barreira | Esp. | Defesa extra. Não acumula — só o maior valor. |\n| Espinho (Thorn) | Esp. | 1 dano ao receber dano de outra fonte, até ser curado. |',
    12
  ),
  (
    'Tags de Magia e Equip.',
    E'| Tag | Efeito em Combate |\n| --- | --- |\n| Arcano | Ilumina alvo/área 1 turno (marcado). Penaliza esconder-se. |\n| Void | Reduz alcance dos sentidos precisos à metade por 1 turno. |\n| Terra | Dano duplo em estruturas. Área vira Terreno Difícil. |\n| Raio (Bolt) | Encadeia até 4,5m. Cada alvo: dano −1. |\n| Água/Gelo | Alvo fica Impedido por 1 turno. |\n| Vento | Empurra 4,5m em qualquer direção. |\n| Fogo | Queimadura: metade do dano inicial no fim do próximo turno. |',
    13
  ),
  (
    'Progressão',
    E'**Skills & Idiomas por Uso:** Falha (1–3) = 1 Marca. Com **3 Marcas** → +1 ponto naquela Perícia/Idioma. Combat Skills: 6 Marcas.\n\n**Atitudes:** Só sobem com **XP**. Máx. 2 dados por Atitude.\n\n**Gatilhos de XP** (fim de sessão / Long Rest): Marque 1 XP por gatilho (2 XP se ocorreu várias vezes):\n- Gatilho específico do playbook\n- Expressou crenças, motivações, herança ou histórico\n\n**Avanço** (trilha de XP completa): Escolha 2 entre: +1 Skill; +1 Idioma; +1 Atitude; +1 Spell; outros…',
    14
  )
) AS v(title, body, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.rule_blocks rb WHERE rb.title = v.title AND rb.category = 'roll_results'
);
