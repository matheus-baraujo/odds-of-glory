-- Allow players to join a room by code without broadening game_rooms SELECT RLS.
-- joinRoom() calls this RPC instead of selecting game_rooms directly.

create or replace function public.join_room_by_code(p_code text)
returns public.game_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_room public.game_rooms;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_room
  from public.game_rooms
  where code = upper(trim(p_code));

  if not found then
    raise exception 'Sala não encontrada.';
  end if;

  if v_room.status = 'closed' then
    raise exception 'Esta sala está fechada.';
  end if;

  insert into public.room_participants (room_id, user_id, session_role)
  values (
    v_room.id,
    v_user_id,
    case when v_room.master_id = v_user_id then 'master' else 'player' end
  )
  on conflict (room_id, user_id) do nothing;

  return v_room;
end;
$$;

grant execute on function public.join_room_by_code(text) to authenticated;
