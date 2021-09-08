// Your job goes here.
fn(state => {
  state.studyIDMap = {
    'Urban Consumption': 1000,
    'Rural Consumption': 1002,
    Market: 1004,
    Offtake: 1006,
  };
  return { ...state, formType: state.data.formType };
});

upsert('tbl_study', 'study_id', {
  study_id: state => state.studyIDMap[state.formType],
});

upsert('tbl_sample_market', 'ON CONSTRAINT tbl_sample_market_pkey', {
  sample_id: `${state.data._id}${state.data._xform_id_string}`,
  date_start: state.data.body.today,
  date_end: state.data.body.today,
  study_id: state => state.studyIDMap[state.formType], //ad
  site_id: state => state.studyIDMap[state.formType], //ad
  market_id: '1', //AD
  number_tables_surveyed: state.data.body.total_surveyed,
});

// upsert('swm_species', 'study_id', {
// taxonID: '',
// vernacularName: '',
// }),

upsert('tbl_site', 'ON CONSTRAINT tbl_site_pkey', {
  admin_level_3: state.data.body.district,
  site_name: state.data.body.village,
  site_id: state => state.studyIDMap[state.formType],
  study_id: state => state.studyIDMap[state.formType], //ad
});

// upsert('tbl_market', 'ON CONSTRAINT tbl_market_pkey', {
//   external_id: state.data.body.market,
//   site_id: state => state.studyIDMap[state.formType],
//   study_id: state => state.studyIDMap[state.formType], //ad

// });

fn(state => {
  const vendors = state.data.body['vendor'];

  return each(vendors, state => {
    const sales = state.data['vendor/sales'];
    return upsertMany(
      'tbl_wildmeat_market',
      'ON CONSTRAINT tbl_wildmeat_market_pkey',
      state =>
        sales.map(sale => {
          return {
            sample_id: `${state.data._id}${state.data._xform_id_string}`,
            study_id: state.studyIDMap[state.formType], //ad
            site_id: state.studyIDMap[state.formType], //ad
            wildmeat_id: sale['vendor/sales/species'],
            amount: 1,
            wildmeat_category_1: sale['vendor/sales/category1'],
            wildmeat_category_2: sale['vendor/sales/category2'],
            wildmeat_group: sale['vendor/sales/group'],
            vernacular_name: sale['vendor/sales/species'],
            vernacular_name_other: sale['vendor/sales/othe_species'],
            condition: sale['vendor/sales/condition'],
            unit: sale['vendor/sales/unit'],
            other_unit: sale['vendor/sales/other_unit'],
            harvest_method: sale['vendor/sales/technique'],
            price: sale['vendor/sales/price'],
          };
        })
    )(state);
  })(state);
});
