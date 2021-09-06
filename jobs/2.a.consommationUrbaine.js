fn(state => {
  state.studyIDMap = {
    'Urban Consumption': 1000,
    'Rural Consumption': 1002,
    Market: 1004,
    Offtake: 1006,
  };

  return state;
});

upsert('tbl_study', 'study_id', {
  study_id: state => state.studyIDMap[state.data.formType],
});

fn(state => {
  const wildmeatIDs =
    state.data.body['domeat_consumption/domeat_species'].split(' ');
  return upsertMany(
    'tbl_wildmeat_urban',
    'ON CONSTRAINT tbl_wildmeat_urban_pkey',
    state =>
      wildmeatIDs.map(wildmeat => {
        return {
          study_id: state => state.studyIDMap[state.data.formType],
          site_id: state => state.studyIDMap[state.data.formType],
          wildmeat_id: wildmeat,
          sample_id: `${state.data._id}${state.data._xform_id_string}`,
          amount: state.data.body[`domeat_consumption/quantity_${wildmeat}`],
          condition: state.data.body[`domeat_consumption/state_${wildmeat}`],
          wildmeat_group: state.data.body['domeat_consumption/domeat_species'],
          unit: state.data.body['domeat_consumption/qty_measure_type_dm'],
          vernacular_name: state.data.body['bm_consumption/bm_species'],
        };
      })
  )(state);
});

upsert('tbl_site', 'site_id', {
  study_id: state => state.studyIDMap[state.data.formType],
  admin_level_2: state.data.body['introduction_gp/other_town'],
  site_id: state => state.studyIDMap[state.data.formType],
});

upsert('tbl_sample_urban', 'sample_id', {
  sample_id: `${state.data._id}${state.data._xform_id_string}`,
  date_start: state.data.body['introduction_gp/date'],
  date_end: state.data.body['introduction_gp/date'],
  preferences: state.data.body['prot_preference/why_like_bm'],
});

// upsert('swm_species', 'study_id', {
// taxonID: '',
// vernacularName: '',
// })

upsert('tbl_individual_urban', 'individual_id', {
  gender: state.data.body['introduction_gp/gender'],
  local_origin: state.data.body['subject_info/home'],
  origin_type: state.data.body['subject_info/other_home'],
  age: state.data.body['subject_info/age'],
  education_years: state.data.body['subject_info/education_yrs'],
  religion: state.data.body['other_questions/religion'],
  individual_id: state.data._id,
});
