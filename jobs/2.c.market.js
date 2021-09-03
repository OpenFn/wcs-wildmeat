fn(state => {
  const studyIDMap = {
    'Urban Consumption': 1000,
    'Rural Consumption': 1002,
    Market: 1004,
    Offtake: 1006,
  };

  return combine(
    upsert('tbl_study', 'study_id', {
      study_id: studyIDMap[state.data.formType],
    }),

    upsert('tbl_sample_market', 'sample_id', {
      sample_id: `${state.data._id}${state.data._xform_id_string}`,
      date_start: state.data.body.today,
      date_end: state.data.body.today,
    }),

    // upsert('swm_species', 'study_id', {
    // taxonID: '',
    // vernacularName: '',
    // }),

    upsert('tbl_site', 'study_id', {
      admin_level_3: state.data.body.district,
      site_name: state.data.body.village,
    }),

    upsert('tbl_market', 'study_id', {
      external_id: state.data.body.market,
      number_tables_surveyed: state.data.body.total_surveyed,
    }),

    fn(state => {
      const vendors = state.data.body['vendor'];

      return each(vendors, state => {
        const sales = state.data['vendor/sales'];
        return upsertMany('tbl_wildmeat_market', 'study_id', state => {
          sales.map(sale => {
            return {
              wildmeat_category_1: sale['vendor/sales/category1'],
              wildmeat_category_2: sale['vendor/sales/category2'],
              wildmeat_group: sale['vendor/sales/group'],
              vernacular_name: sale['vendor/sales/species'],
              vernacular_name_other: sale['vendor/sales/othe_species'],
              condition: sale['vendor/sales/condition'],
              unit: sale['vendor/sales/unit'],
              unit_other: sale['vendor/sales/other_unit'],
              harvest_method: sale['vendor/sales/technique'],
              price: sale['vendor/sales/price'],
            };
          });
        })(state);
      });
    })
  )(state);
});
