export function getUnique(array) {
  const ids = array?.map((o) => o.id);
  const filtered = array?.filter(
    ({ id }, index) => !ids.includes(id, index + 1)
  );
  return filtered;
}
export function getUniqueExtraGroupId(array) {
  const ids = array?.map((o) => o.extra_group_id);
  const filtered = array?.filter(
    ({ extra_group_id }, index) => !ids.includes(extra_group_id, index + 1)
  );
  return filtered;
}
