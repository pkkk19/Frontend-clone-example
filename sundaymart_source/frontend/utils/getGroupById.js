export const getGroupByExtraGroupId = (flattenExtras = []) => {
  let result = [];
  flattenExtras.forEach((r) => {
    if (!result[r.extra_group_id]) {
      result[r.extra_group_id] = [];
    }
    result[r.extra_group_id].push(r);
  });
  return result;
};
