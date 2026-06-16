-- Rich content schema + Sven seed data

-- aspect_templates: description + oath
alter table public.aspect_templates
  add column if not exists description text not null default '',
  add column if not exists oath text not null default '';

-- equipment_templates: charges + range
alter table public.equipment_templates
  add column if not exists charges int not null default 0,
  add column if not exists range text not null default '';

-- game_options: add supply category
alter table public.game_options drop constraint if exists game_options_category_check;
alter table public.game_options add constraint game_options_category_check check (category in (
  'ancestry', 'background', 'career', 'skill', 'combat_skill',
  'language', 'condition', 'tag', 'tier_stat', 'approach', 'supply'
));

-- ---------------------------------------------------------------------------
-- Sven identity options (ancestry / background / career with abilities)
-- ---------------------------------------------------------------------------
insert into public.game_options (category, slug, label, data, sort_order) values
  (
    'ancestry',
    'human_hofn',
    'Human — Hofn',
    '{"description": "Humano nascido em Hofn.", "abilities": [{"name": "Citizen of Worlds", "cost": "A", "description": "Marque 1 Resolve: +1 dado em rolagens de Atitude+Idioma para conversas com culturas não familiares."}]}'::jsonb,
    1
  ),
  (
    'background',
    'gauntlet_knight',
    'Gauntlet Knight',
    '{"description": "Cavaleiro do Manopla.", "abilities": [{"name": "Defend the Innocent", "cost": "1", "description": "Reação: proteja uma criatura adjacente. Ela usa sua Defesa no lugar da dela; o dano é dividido."}, {"name": "Words of the Righteous", "cost": "1", "description": "Sucesso com Iron ou Finesse + idioma contra alvo A igual ou maior: E^ + escolha: desviar culpa · demonstração de honra · acusar alguém."}]}'::jsonb,
    1
  ),
  (
    'career',
    'rogue_pilot',
    'Rogue Pilot',
    '{"description": "Piloto rogue.", "abilities": [{"name": "Tenacious", "cost": "1", "description": "Ignore 1 de dano que seria aplicado em Atitudes."}, {"name": "Leaf on the Wind", "cost": "2", "description": "Ao se esforçar (Push), gaste +1 Resolve (total 2) para ganhar +1 efeito E +1 dado ao mesmo tempo, em vez de apenas um."}]}'::jsonb,
    1
  )
on conflict (category, slug) do update set
  label = excluded.label,
  data = excluded.data,
  sort_order = excluded.sort_order;

-- Supply catalog (Sven ficha)
insert into public.game_options (category, slug, label, data, sort_order) values
  ('supply', 'thieves_tools', 'Ferramentas de Ladrão', '{}', 1),
  ('supply', 'climbing_gear', 'Equipamento de Escalada', '{}', 2),
  ('supply', 'documents', 'Documentos (3)', '{}', 3),
  ('supply', 'subterfuge_supplies', 'Suprimentos de Subterfúgio (dados viciados, baralho trucado)', '{}', 4),
  ('supply', 'navigator_supplies', 'Suprimentos de Navegador', '{}', 5),
  ('supply', 'lantern', 'Lanterna', '{}', 6),
  ('supply', 'spyglass', 'Luneta', '{}', 7),
  ('supply', 'gadget', 'Gadget ×2', '{}', 8),
  ('supply', 'bomb', 'Bomba ×2 (2)', '{}', 9),
  ('supply', 'medicine_kit', 'Kit Médico', '{}', 10),
  ('supply', 'extra_charge', 'Carga Extra', '{}', 11),
  ('supply', 'extra_ammunition', 'Munição Extra', '{}', 12),
  ('supply', 'rations', 'Rações ×2 (3)', '{}', 13),
  ('supply', 'camping_kit', 'Kit de Acampamento', '{}', 14),
  ('supply', 'misc_item', 'Item Diverso', '{}', 15)
on conflict (category, slug) do update set
  label = excluded.label,
  sort_order = excluded.sort_order;

-- Aspect template: Arcane & Void
delete from public.aspect_templates where name = 'Oath of the Forward Knight';

insert into public.aspect_templates (name, aspect_type, description, oath, drive, spells) values
  (
    'Arcane & Void',
    'oath',
    'No body is visible, just layers of jewelled silk and a glittering eye.',
    'Oath of the Eternal Horizon',
    'Wants to seek and see unknown places.',
    '[
      {"name": "Descanso Curto", "type": "passive", "description": "Ao descansar em lugar desconhecido, você fica oculto e indetectável por meios não-mágicos. O lugar se torna familiar depois.", "cost": "Passivo 1"},
      {"name": "Teleporte", "type": "active", "description": "Você e até 5 criaturas voluntárias para um lugar à vista que nunca visitaram.", "cost": "1 Mana · 2 ações"},
      {"name": "Direção Intuitiva", "type": "passive", "description": "Você intuitivamente conhece a direção da comunidade mais próxima que nunca visitou. Ao chegar, começa a sentir a próxima.", "cost": "Passivo 2"},
      {"name": "Leitura de histórico", "type": "active", "description": "Veja todo o histórico de viagens de um objeto/veículo/criatura e seu destino atual — se você já esteve no local de origem ou criação.", "cost": "1 Mana · 2 ações"},
      {"name": "Caminho Desconhecido", "type": "passive", "description": "Ao trilhar um caminho desconhecido: +1 ao primeiro roll de exploração/movimento + vantagem (^E). Ao chegar no objetivo: +1 ao próximo roll.", "cost": "Passivo 3"}
    ]'::jsonb
  );

-- Equipment templates (Sven gear)
delete from public.equipment_templates where name in ('Steel Breastplate', 'Officer''s Pistol');

insert into public.equipment_templates (name, tier, tags, defense, wear_max, charges, range, abilities) values
  (
    'Horizon Blaster',
    1,
    array['Arcano', 'Void'],
    0,
    6,
    3,
    'Alcance Longo',
    '[
      {"name": "Arcane Scope", "cost": "1", "description": "Mirá um alvo a longa distância sem Cut 1."},
      {"name": "Ricochet Shot", "cost": "1", "description": "Ricocheteie o tiro para acertar alvo oculto que você conhece a posição; ignora cobertura e oculto."},
      {"name": "Bolt Shot", "cost": "1", "description": "O tiro ricocheteia para alvos próximos adicionais de sua escolha, causando dano −1 cada."},
      {"name": "Blink Shot", "cost": "1", "description": "Atira um alvo e você se teleporta a um alcance próximo que pode ver."},
      {"name": "Blink Recharge", "cost": "2", "description": "Teleporte a alcance médio que pode ver e recarregue as cargas."}
    ]'::jsonb
  ),
  (
    'Helmet of Daol Grenn',
    1,
    array['Armor'],
    1,
    5,
    0,
    '',
    '[
      {"name": "Blindsight", "cost": "1", "description": "Veja em escuridão total por 1 hora."},
      {"name": "Lock In", "cost": "1", "description": "Marque todos os inimigos em visão."},
      {"name": "Iron Eye", "cost": "1", "description": "+1 (ou +2 com 2 Wear) em saves contra medo e encantamento."},
      {"name": "All-Seeing", "cost": "2", "description": "Marque todos os inimigos em alcance médio ao redor, mesmo por obstrução parcial ou invisibilidade."}
    ]'::jsonb
  ),
  (
    'Shielded Half-Plate',
    1,
    array['Armor'],
    2,
    3,
    0,
    '',
    '[
      {"name": "Posição Vantajosa", "cost": "1", "description": "Mova metade extra da velocidade como parte de uma ação de Mover para tomar posição vantajosa (altitude ou flanco)."},
      {"name": "Terreno Difícil", "cost": "2", "description": "Mova por terreno difícil como terreno normal, com resistência a dano causado por ele até o fim do próximo turno."}
    ]'::jsonb
  ),
  (
    'Dagger',
    1,
    array['Melee'],
    0,
    3,
    0,
    'Alcance Médio',
    '[
      {"name": "Ataque Extra", "cost": "1", "description": "Faça um ataque extra como parte da mesma ação, causando dano −1."},
      {"name": "Teleporte", "cost": "1", "description": "Jogue a dagger a alcance médio e teleporte até ela."},
      {"name": "Ricochete", "cost": "1", "description": "Ricocheteie em superfície para acertar alvo fora de visão; causa dano e marca. A dagger retorna."}
    ]'::jsonb
  );
