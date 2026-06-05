-- Seed game options and rule blocks from Core Rules references

-- Approaches (Atitudes)
insert into public.game_options (category, slug, label, data, sort_order) values
  ('approach', 'wrath', 'Wrath', '{"keywords": ["Destruction", "savagery", "rebellion"]}', 1),
  ('approach', 'iron', 'Iron', '{"keywords": ["Force", "determination", "discipline"]}', 2),
  ('approach', 'finesse', 'Finesse', '{"keywords": ["Elegance", "precision", "balance"]}', 3),
  ('approach', 'honor', 'Honor', '{"keywords": ["Integrity", "justice", "loyalty"]}', 4),
  ('approach', 'wits', 'Wits', '{"keywords": ["Smarts", "learning", "logic"]}', 5),
  ('approach', 'heart', 'Heart', '{"keywords": ["Empathy", "emotion", "charm"]}', 6),
  ('approach', 'instinct', 'Instinct', '{"keywords": ["Survival", "reflexes", "intuition"]}', 7),
  ('approach', 'veils', 'Veils', '{"keywords": ["Cunning", "secrecy", "manipulation"]}', 8)
on conflict (category, slug) do nothing;

-- Skills (Perícias)
insert into public.game_options (category, slug, label, data, sort_order) values
  ('skill', 'alchemy', 'Alchemy', '{"description": "Preparar e identificar substâncias, venenos e compostos."}', 1),
  ('skill', 'arts', 'Arts', '{"description": "Criar, executar ou analisar obras artísticas e performances."}', 2),
  ('skill', 'athletics', 'Athletics', '{"description": "Correr, saltar, escalar, nadar e resistência física geral."}', 3),
  ('skill', 'crafting', 'Crafting', '{"description": "Construir, reparar ou modificar objetos e equipamentos."}', 4),
  ('skill', 'pilot', 'Pilot', '{"description": "Operar veículos e mechas."}', 5),
  ('skill', 'survival', 'Survival', '{"description": "Montarias, rastrear, se orientar e sobreviver em ambientes hostis."}', 6),
  ('skill', 'thievery', 'Thievery', '{"description": "Furtar, sabotar e agir nas sombras."}', 7)
on conflict (category, slug) do nothing;

-- Combat skills
insert into public.game_options (category, slug, label, data, sort_order) values
  ('combat_skill', 'archery', 'Archery', '{"description": "Arcos, bestas e projéteis de propulsão por corda."}', 1),
  ('combat_skill', 'artillery', 'Artillery', '{"description": "Armas de fogo, canhões e disparo por explosão."}', 2),
  ('combat_skill', 'arms_heavy', 'Arms Heavy', '{"description": "Armas de duas mãos, maças e lâminas grandes."}', 3),
  ('combat_skill', 'arms_light', 'Arms Light', '{"description": "Espadas de uma mão, facas e armas rápidas."}', 4),
  ('combat_skill', 'brawl', 'Brawl', '{"description": "Combate desarmado, agarrões e grappling."}', 5),
  ('combat_skill', 'theurgy', 'Theurgy', '{"description": "Ataques mágicos que causam dano direto."}', 6)
on conflict (category, slug) do nothing;

-- Languages — common
insert into public.game_options (category, slug, label, data, sort_order) values
  ('language', 'fjorgyn', 'Fjorgyn', '{"group": "common"}', 1),
  ('language', 'aesduhn', 'Aesduhn', '{"group": "common"}', 2),
  ('language', 'gwench', 'Gwench', '{"group": "common"}', 3),
  ('language', 'dul_fain', 'Dul Fain', '{"group": "uncommon", "notes": "Aes Sidhe"}', 4),
  ('language', 'rimalfar', 'Rímalfar', '{"group": "uncommon", "notes": "Valkyries"}', 5),
  ('language', 'trolen', 'Tro''len', '{"group": "uncommon", "notes": "Trolls"}', 6),
  ('language', 'run', 'Rún', '{"group": "uncommon", "notes": "Drún/Drúnir"}', 7),
  ('language', 'murrugach', 'Murrúghach', '{"group": "enemy"}', 8),
  ('language', 'jotun', 'Jotun', '{"group": "enemy", "notes": "Fala e sinais."}', 9),
  ('language', 'wyrmr', 'Wyrmr', '{"group": "enemy", "notes": "Rosnados e rugidos."}', 10),
  ('language', 'faehric', 'Faehric', '{"group": "primordial", "notes": "Comunicado em rimas."}', 11),
  ('language', 'primordial', 'Primordial', '{"group": "primordial", "notes": "Comunicado em sons."}', 12),
  ('language', 'empireo', 'Empíreo', '{"group": "primordial", "notes": "Comunicado em pensamentos."}', 13)
on conflict (category, slug) do nothing;

-- Conditions (subset from Core Rules)
insert into public.game_options (category, slug, label, data, sort_order) values
  ('condition', 'inspired', 'Inspirado', '{"group": "general", "effect": "Add 1 nas rolagens com a Atitude inspirada."}', 1),
  ('condition', 'demoralized', 'Desmoralizado', '{"group": "general", "effect": "Cut 1 com a Atitude afetada."}', 2),
  ('condition', 'blocked_senses', 'Sentidos Bloqueados', '{"group": "general", "effect": "Ações têm 1d2 de chance de falhar."}', 3),
  ('condition', 'resistance', 'Resistência', '{"group": "general", "effect": "Reduz à metade o dano acima da Defesa."}', 4),
  ('condition', 'immunity', 'Imunidade', '{"group": "general", "effect": "Nenhum dano ou efeito daquele tipo."}', 5),
  ('condition', 'unconscious', 'Inconsciente', '{"group": "general", "effect": "Sem ações ou reações."}', 6),
  ('condition', 'stunned', 'Atordoado', '{"group": "general", "effect": "Apenas 1 ação por turno; sem reações."}', 7),
  ('condition', 'cover_half', 'Cobertura (Meia)', '{"group": "physical", "effect": "+1 Defesa."}', 8),
  ('condition', 'cover_full', 'Cobertura (Total)', '{"group": "physical", "effect": "+2 Defesa."}', 9),
  ('condition', 'prone', 'Deitado', '{"group": "physical", "effect": "+1 corpo-a-corpo; Cut 1 distância."}', 10),
  ('condition', 'fatigued', 'Fatigado', '{"group": "physical", "effect": "1 ação a menos; Cut 1 em rolagens."}', 11),
  ('condition', 'frightened', 'Amedrontado', '{"group": "mental", "effect": "Não pode mover em direção ao medo."}', 12),
  ('condition', 'bleeding', 'Sangrando', '{"group": "specific", "effect": "Metade do dano ao fim de cada turno."}', 13)
on conflict (category, slug) do nothing;

-- Magic / equipment tags
insert into public.game_options (category, slug, label, data, sort_order) values
  ('tag', 'arcane', 'Arcano', '{"effect": "Ilumina alvo/área por 1 turno."}', 1),
  ('tag', 'void', 'Vazio', '{"effect": "Reduz alcance dos sentidos precisos à metade."}', 2),
  ('tag', 'earth', 'Terra', '{"effect": "Dano duplo em estruturas; Terreno Difícil."}', 3),
  ('tag', 'bolt', 'Raio', '{"effect": "Encadeia até 4,5 m."}', 4),
  ('tag', 'water_ice', 'Água/Gelo', '{"effect": "Alvo fica Impedido por 1 turno."}', 5),
  ('tag', 'wind', 'Vento', '{"effect": "Empurra 4,5 m."}', 6),
  ('tag', 'fire', 'Fogo', '{"effect": "Queimadura: metade do dano no próximo turno."}', 7)
on conflict (category, slug) do nothing;

-- Tier stats
insert into public.game_options (category, slug, label, data, sort_order) values
  ('tier_stat', 'tier_1', 'Tier 1', '{"approach_marks": 2, "approach_marks_per": 1, "resolve": 2, "saves_max": 2, "saves_cap": 2, "skill_points": 8, "skill_cap": 2, "mana_max": 2, "defense": [0, 1, 2]}', 1),
  ('tier_stat', 'tier_2', 'Tier 2', '{"approach_marks": 4, "approach_marks_per": 2, "resolve": 4, "saves_max": 4, "saves_cap": 3, "skill_points": 12, "skill_cap": 3, "mana_max": 3, "defense": [1, 2, 3]}', 2),
  ('tier_stat', 'tier_3', 'Tier 3', '{"approach_marks": 6, "approach_marks_per": 2, "resolve": 6, "saves_max": 6, "saves_cap": 4, "skill_points": 16, "skill_cap": 3, "mana_max": 4, "defense": [2, 3, 4]}', 3)
on conflict (category, slug) do nothing;

-- Placeholder ancestries / backgrounds / careers (expand via admin CMS)
insert into public.game_options (category, slug, label, data, sort_order) values
  ('ancestry', 'human', 'Human', '{"description": "Placeholder — expand via admin."}', 1),
  ('ancestry', 'aes_sidhe', 'Aes Sidhe', '{"description": "Placeholder — expand via admin."}', 2),
  ('background', 'soldier', 'Soldier', '{"description": "Military background."}', 1),
  ('background', 'scholar', 'Scholar', '{"description": "Academic background."}', 2),
  ('career', 'knight', 'Knight', '{"description": "Forward knight path."}', 1),
  ('career', 'artificer', 'Artificer', '{"description": "Magitek crafter."}', 2)
on conflict (category, slug) do nothing;

-- Rule blocks (quick reference)
insert into public.rule_blocks (title, body, category, sort_order) values
  (
    'Resultados de Rolagem',
    E'| Resultado | Efeito |\n| --- | --- |\n| **6, 6 — Crítico** | Sucesso total + benefício extra |\n| **6 — Sucesso** | Tudo nos conformes |\n| **4–5 — Parcial** | Sucesso com Consequência |\n| **1–3 — Falha** | Falha + Consequência |',
    'roll_results',
    1
  ),
  (
    'Cut e Add',
    E'**Cut (X):** ignore os X dados mais altos.\n\n**Add (X):** adicione X dados e use o maior.',
    'roll_results',
    2
  ),
  (
    'Pool de Dados',
    E'Monte o pool: Atitude + Perícia + Esforço/Ajuda. Se zero ou menos: role 2d6 e use o **menor**.',
    'roll_results',
    3
  ),
  (
    'Resolve por Tier',
    E'| Tier | Resolve |\n| --- | --- |\n| 1 | 2 |\n| 2 | 4 |\n| 3 | 6 |',
    'resources',
    1
  ),
  (
    'Defesa por Tier',
    E'| Tier | Defesa (sem / médio / pesado) |\n| --- | --- |\n| 1 | 0 / 1 / 2 |\n| 2 | 1 / 2 / 3 |\n| 3 | 2 / 3 / 4 |',
    'combat',
    1
  )
on conflict do nothing;

-- Sample equipment template
insert into public.equipment_templates (name, tier, tags, defense, wear_max, abilities) values
  (
    'Steel Breastplate',
    1,
    array['armor', 'heavy'],
    2,
    3,
    '[{"name": "Ward", "description": "Absorve dano via Wear."}]'::jsonb
  ),
  (
    'Officer''s Pistol',
    1,
    array['firearm', 'artillery'],
    0,
    2,
    '[{"name": "Volley", "description": "Disparo à distância média."}]'::jsonb
  )
on conflict do nothing;

-- Sample aspect template
insert into public.aspect_templates (name, aspect_type, drive, spells) values
  (
    'Oath of the Forward Knight',
    'oath',
    'Protect the weak and advance without retreat.',
    '[{"name": "Banner of Resolve", "type": "active"}, {"name": "Steadfast Guard", "type": "passive"}]'::jsonb
  )
on conflict do nothing;
