-- Cover the RH task -> role foreign key and avoid scans when filtering tasks by role.
create index if not exists rh_tasks_role_key_idx
  on adonai_trade.rh_tasks (role_key);
