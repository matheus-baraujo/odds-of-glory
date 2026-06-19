-- Move combat quick-reference blocks from roll_results to combat category.

UPDATE public.rule_blocks
SET category = 'combat', sort_order = 2
WHERE title = 'Ameaça (A) em Combate' AND category = 'roll_results';

UPDATE public.rule_blocks
SET category = 'combat', sort_order = 3
WHERE title = 'Defesa e Dano' AND category = 'roll_results';

UPDATE public.rule_blocks
SET category = 'combat', sort_order = 4
WHERE title = 'Ações em Combate' AND category = 'roll_results';
