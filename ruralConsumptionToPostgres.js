upsert('tbl_study', 'study_id', {
  study_id: 1000,
});

/*upsert('tbl_site', 'site_id', {
  site_id: 1001,
  admin_level_3: state.data['survey_info/district'],
  site_name: state.data['survey_info/village'],
});

upsert('tbl_household', 'external_id', {
  study_id: 1000,
  site_id: 1001,
  household_id: state.data['survey_info/household_id'],
  external_id: state.data['survey_info/household_id'],
}); */

/* insert('tbl_household_char', {
  site_id: 1001,
  study_id: 1000,
  household_id: state.data['survey_info/household_id'],
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
}); */

/* upsert('tbl_sample', 'sample_id', {
  study_id: 1000,
  site_id: 1001,
  household_id: state.data['survey_info/household_id'],
  household_char_id: state.data['survey_info/household_id'],
  date_start: state.data['survey_info/info_recall_date'],
  sample_id:
    state.data._id + state.data._submission_time + state.data._xform_id_string,
  sample_unit: 'kilograms',
  number_sample_units: '24',
  sampling_effortin_days: '2',
});

insertMany('tbl_wildmeat', state =>
  state.data['group_begin/group_food'].map(foodItem => {
    return {
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
); */

insert('tbl_individual', {
  site_id: 1001,
  study_id: 1000,
  household_id: state.data['survey_info/household_id'],
  external_id: state.data['survey_info/identity'],
});

/* upsert('swm_transaction', 'uuid', {
  uuid:
    state.data._id + state.data._submission_time + state.data._xform_id_string,
  date: Date.now(),
  status: 'new',
  submission_time: state.data._submission_time,
  modified_by: 'open_fn',
  inserted_by: 'open_fn',
  data_type: 'consumption',
  instances: state.data,
}); */
