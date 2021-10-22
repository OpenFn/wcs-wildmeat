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

upsert('tbl_sample', 'ON CONSTRAINT tbl_sample_pkey', {
  study_id: state => state.studyIDMap[state.formType],
  sample_id: `${state.data.body._id}${state.data.body._xform_id_string}`,
  household_char_id: state.data.body._id,
  date_start: state.data.body['survey_info/info_recall_date'],
  sample_unit: state.data.defaultUnit || 'kilograms',
  number_sample_units: '24',
  sampling_effortin_days: '2',
  site_id: state => state.studyIDMap[state.formType],
  household_id: state.data.body['survey_info/household_id'] || state.data.body._id,
});

//AD added everything except uuid & submission_time
upsert('swm_transaction', 'ON CONSTRAINT swm_data_pkey', {
  uuid: `${state.data.body._id}${state.data.body._xform_id_string}`,
  submission_time: state.data.body['_submission_time'],
  date: state.data.body['_submission_time'],
  status: 'new',
  modified_by: 'open_fn',
  inserted_by: 'open_fn',
  data_type: 'consumption', //other types: hunter, market
  instances: state => {
    if (state.data.body.consent_checklist == 'yes')
      return JSON.stringify(state.data);
    else {
      let instance = { uuid: state.data.body._uuid, consent: 'no' };
      return instance;
    }
  },
});

upsert('tbl_site', 'ON CONSTRAINT tbl_site_pkey', {
  admin_level_3: state.data.body['survey_info/district'],
  site_name: state.data.body['survey_info/village'],
  site_id: state => state.studyIDMap[state.formType],
  study_id: state => state.studyIDMap[state.formType],
});

// upsert('swm_species', 'study_id', {
// taxonID: '',
// vernacularName: '',
// })

upsert('tbl_individual', 'ON CONSTRAINT tbl_individual_pkey', {
  household_id: state.data.body['survey_info/household_id'] || state.data.body._id,
  individual_id: state.data.body._id,
  site_id: state => state.studyIDMap[state.formType], //AD
  study_id: state => state.studyIDMap[state.formType], //AD
  external_id: state.data.body['survey_info/identity'], //AD
});

upsert('tbl_individual_char', 'ON CONSTRAINT tbl_individual_char_pkey', {
  household_id: state.data.body['survey_info/household_id'] || state.data.body._id,
  site_id: state => state.studyIDMap[state.formType], //AD
  study_id: state => state.studyIDMap[state.formType], //AD
  individual_id: state.data.body._id,
  individual_char_id: state.data.body._id,
});

//AD everything except household id and external_id
upsert('tbl_household', 'ON CONSTRAINT tbl_household_pkey', {
  household_id: state.data.body['survey_info/household_id'] || state.data.body._id,
  external_id: state.data.body['survey_info/household_id'] || state.data.body._id,
  site_id: state => state.studyIDMap[state.formType], //AD
  study_id: state => state.studyIDMap[state.formType], //AD
});

upsert('tbl_household_char', 'ON CONSTRAINT tbl_household_char_pkey', {
  household_char_id: state.data.body._id, //ad
  household_id: state.data.body['survey_info/household_id'] || state.data.body._id,
  num_occupants: state.data.body['group_begin/group_people/nb_people'],
  num_babies: state.data.body['group_begin/group_people/nb_babies'],
  num_children: state.data.body['group_begin/group_people/nb_children'],
  num_young_men: state.data.body['group_begin/group_people/nb_youngmen'],
  num_adult_men: state.data.body['group_begin/group_people/nb_men'],
  num_old_men: state.data.body['group_begin/group_people/nb_oldmen'],
  num_adult_women: state.data.body['group_begin/group_people/nb_women'],
  num_pregnant_women: state.data.body['group_begin/group_people/nb_pregnant'],
  num_breastfeeding_women:
    state.data.body['group_begin/group_people/nb_brestfeeding'],
  site_id: state => state.studyIDMap[state.formType], //AD
  study_id: state => state.studyIDMap[state.formType], //AD
});

fn(state => {
  const repeatGroup = state.data.body['group_begin/group_food'];
  if (repeatGroup) {
    return upsertMany(
      'tbl_wildmeat',
      'ON CONSTRAINT tbl_wildmeat_pkey',
      state =>
        repeatGroup.map(foodItem => {
          const unit =
            foodItem['group_begin/group_food/quantity_technique'] ===
            'known_technique'
              ? 'kilogram'
              : '-8';

          return {
            site_id: state => state.studyIDMap[state.formType], //AD
            study_id: state => state.studyIDMap[state.formType], //AD
            sample_id: `${state.data.body._id}${state.data.body._xform_id_string}`,
            wildmeat_id: foodItem['group_begin/group_food/species'], //AD
            wildmeat_category_1: foodItem['group_begin/group_food/category1'],
            wildmeat_category_2: foodItem['group_begin/group_food/category2'],
            wildmeat_group: foodItem['group_begin/group_food/group'],
            vernacular_name: foodItem['group_begin/group_food/species'],
            unit,
            massin_grams: foodItem['group_begin/group_food/quantity'] * 1000,
            price: foodItem['group_begin/group_food/Cost'],
            aquisition: foodItem['group_begin/group_food/obtention'],
            amount: foodItem['group_begin/group_food/amount'],
            acquisition_other:
              foodItem['group_begin/group_food/other_obtention'],
            origin_of_wildmeat:
              foodItem['group_begin/group_food/origin_wildmeat'],
            condition: foodItem['group_begin/group_food/state'],
            consumption_frequency_unit:
              foodItem['group_begin/group_food/frequency'],
          };
        })
    )(state);
  }
  console.log('There is no wildmeat array. Skipping upsertMany(...)');
  return state;
});
