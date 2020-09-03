upsert('tbl_study', 'study_id', {
  study_id: 1000,
});

upsert('tbl_site', 'ON CONSTRAINT tbl_site_pkey', {
  study_id: 1000,
  site_id: 1001,
  admin_level_3: state.data['survey_info/district'],
  site_name: state.data['survey_info/village'],
});

upsert('tbl_household', 'ON CONSTRAINT tbl_household_pkey', {
  study_id: 1000,
  site_id: 1001,
  household_id: state.data['survey_info/household_id'],
  external_id: state.data['survey_info/household_id'],
});

upsert('tbl_household_char', 'ON CONSTRAINT tbl_household_char_pkey', {
  site_id: 1001,
  study_id: 1000,
  household_id: state.data['survey_info/household_id'],
  // TODO: decide on how to handle household_char_id
  household_char_id: 1001,
  num_occupants: state.data['group_begin/group_people/nb_people'],
  num_babies: state.data['group_begin/group_people/nb_babies'],
  num_children: state.data['group_begin/group_people/nb_children'],
  num_young_men: state.data['group_begin/group_people/nb_youngmen'],
  num_adult_men: state.data['group_begin/group_people/nb_men'],
  num_old_men: state.data['group_begin/group_people/nb_oldmen'],
  num_adult_women: state.data['group_begin/group_people/nb_women'],
  num_pregnant_women: state.data['group_begin/group_people/nb_pregnant'],
  num_breastfeeding_women:
    state.data['group_begin/group_people/nb_brestfeeding'],
});

upsert('tbl_sample', 'ON CONSTRAINT tbl_sample_pkey', {
  study_id: 1000,
  site_id: 1001,
  household_id: state.data['survey_info/household_id'],
  // TODO: What's this doing here? Need to talk to WCS.
  // household_char_id: state.data['survey_info/household_id'],
  date_start: state.data['survey_info/info_recall_date'],
  sample_id:
    state.data._id + state.data._submission_time + state.data._xform_id_string,
  sample_unit: 'kilograms',
  number_sample_units: '24',
  sampling_effortin_days: '2',
});

sql(
  state =>
    `DELETE FROM tbl_wildmeat where kobo_submission_id = '${state.data['meta/instanceID']}'`
);

insertMany('tbl_wildmeat', state =>
  state.data['group_begin/group_food'].map(foodItem => {
    return {
      kobo_submission_id: state.data['meta/instanceID'],
      site_id: 1001,
      study_id: 1000,
      sample_id:
        state.data._id +
        state.data._submission_time +
        state.data._xform_id_string,
      vernacular_name: foodItem['group_begin/group_food/species'],
      wildmeat_category_1: foodItem['group_begin/group_food/category1'],
      wildmeat_category_2: foodItem['group_begin/group_food/category2'],
      wildmeat_group: foodItem['group_begin/group_food/group'],
      unit:
        foodItem['group_begin/group_food/quantity_technique'] ===
        'known_technique'
          ? 'kilogram'
          : '-8',
      amount: foodItem['group_begin/group_food/amount'],
      massin_grams: foodItem['group_begin/group_food/quantity'],
      price: foodItem['group_begin/group_food/Cost'],
      aquisition: foodItem['group_begin/group_food/obtention'],
      acquisition_other: foodItem['group_begin/group_food/other_obtention'],
      origin_of_wildmeat: foodItem['group_begin/group_food/origin_wildmeat'],
      condition: foodItem['group_begin/group_food/state'],
      consumption_frequency_unit: foodItem['group_begin/group_food/frequency'],
    };
  })
);

upsert('tbl_individual', 'ON CONSTRAINT tbl_individual_pkey', {
  site_id: 1001,
  study_id: 1000,
  household_id: state.data['survey_info/household_id'],
  external_id: state.data['survey_info/identity'],
  // TODO: Autonumber comment in postgres, but NOT getting generated. Intent?
  individual_id: 1001,
});

upsert('swm_transaction', 'ON CONSTRAINT swm_data_pkey', {
  // TODO: determine how to use this _id (see https://github.com/kobotoolbox/kobocat/issues/572#issuecomment-685923946)
  // uuid: state.data._id + state.data._submission_time + state.data._xform_id_string,
  uuid: state.data._id,
  // TODO: Figure out what they're trying to do with date here. It's part of the UUID?
  date: state.data._submission_time,
  status: 'new',
  submission_time: state.data._submission_time,
  modified_by: 'open_fn',
  inserted_by: 'open_fn',
  data_type: 'consumption',
  // TODO: What does WCS want in here? It's a JSONB column.
  instances: JSON.stringify(state.data),
});