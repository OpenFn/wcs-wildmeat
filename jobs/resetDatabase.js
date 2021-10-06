fn(state => {
  const tablesToReset = [
    'tbl_site',
    'tbl_sample',
    'tbl_study',
    'swm_transaction',
    'tbl_individual',
    'tbl_individual_char',
    'tbl_household',
    'tbl_household_char',
    'tbl_wildmeat',
    'tbl_market',
    'tbl_wildmeat_market',
    'tbl_sample_market',
    'tbl_hunter_monitoring',
    'tbl_wildmeat_hunter',
    'bl_sample_hunter',
    'tbl_wildmeat_urban',
    'tbl_individual_urban',
    'tbl_sample_urban',
  ];

  return each(
    tablesToReset,
    sql(state => `DELETE FROM ${state.data};`, { writeSql: true })
  )(state);
});
