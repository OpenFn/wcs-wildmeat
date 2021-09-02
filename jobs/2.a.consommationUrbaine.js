fn(state => {
  return combine(
    upsert('tbl_study', 'study_id', {
      study_id: 1000,
    }),

    // to check
    upsert('tbl_wildmeat_urban', 'study_id', {
      study_id: 1000,
      sample_id: `${state.data._id}${state.data._xform_id_string}`,
      unit: '',
      vernacular_name: '',
    }),

    upsert('tbl_site', 'study_id', {
      study_id: 1000,
      admin_level_2: state.data.body['introduction_gp/other_town'],
    }),

    upsert('tbl_sample_urban', 'study_id', {
      sample_id: `${state.data._id}${state.data._xform_id_string}`,
      date_start: state.data.body['introduction_gp/date'],
      date_end: state.data.body['introduction_gp/date'],
      preferences: '',
    }),

    upsert('swm_species', 'study_id', {
      study_id: 1000,
    }),

    upsert('tbl_individual_urban', 'study_id', {
      study_id: 1000,
      gender: state.data.body['introduction_gp/gender'],
      local_origin: state.data.body['subject_info/home'],
      origin_type: '',
      age: state.data.body['subject_info/age'],
      education_years: state.data.body['subject_info/education_yrs'],
      religion: state.data.body['other_questions/religion'],
    })
  );
});
