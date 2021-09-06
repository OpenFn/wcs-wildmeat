// Your job goes here.
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

    upsert('tbl_sample', 'sample_id', {
      sample_id: `${state.data._id}${state.data._xform_id_string}`,
      date_start: state.data.body['survey_info/info_recall_date'],
      household_id: state.data.body['survey_info/household_id'],
    }),

    upsert('swm_transaction', 'uuid', {
      uuid: `${state.data._id}${state.data._xform_id_string}`,
      submission_time: state.data.body['_submission_time'],
    }),

    upsert('tbl_site', 'site_id', {
      admin_level_3: state.data.body['survey_info/district'],
      site_name: state.data.body['survey_info/village'],
      site_id: studyIDMap[state.data.formType],
    }),

    // upsert('swm_species', 'study_id', {
    // taxonID: '',
    // vernacularName: '',
    // }),

    upsert('tbl_individual', 'individual_id', {
      household_id: state.data.body['survey_info/household_id'],
      individual_id: state.data._id,
    }),

    upsert('tbl_household', 'household_id', {
      household_id: state.data.body['survey_info/household_id'],
      external_id: state.data.body['survey_info/household_id'],
    }),

    //UUID is not clear 
    upsert('tbl_household_char', 'study_id', {
      household_id: state.data.body['survey_info/household_id'],
      num_occupants: state.data.body['group_begin/group_people/nb_people'],
      num_babies: state.data.body['group_begin/group_people/nb_babies'],
      num_children: state.data.body['group_begin/group_people/nb_children'],
      num_young_men: state.data.body['group_begin/group_people/nb_youngmen'],
      num_adult_men: state.data.body['group_begin/group_people/nb_men'],
      num_old_men: state.data.body['group_begin/group_people/nb_oldmen'],
      num_adult_women: state.data.body['group_begin/group_people/nb_women'],
      num_pregnant_women:
        state.data.body['group_begin/group_people/nb_pregnant'],
      num_breastfeeding_women:
        state.data.body['group_begin/group_people/nb_brestfeeding'],
    }),

    //UUID is not clear 
    fn(state => {
      const repeatGroup = state.data.body['group_begin/group_food'];
      return upsertMany('tbl_wildmeat', 'study_id', state => {
        repeatGroup.map(foodItem => {
          const unit =
            foodItem['group_begin/group_food/quantity_technique'] ===
            'known_technique'
              ? 'kilogram'
              : '-8';

          return {
            sample_id: `${state.data._id}${state.data._xform_id_string}`,
            wildmeat_category_1: foodItem['group_begin/group_food/category1'],
            wildmeat_category_2: foodItem['group_begin/group_food/category2'],
            wildmeat_group: foodItem['group_begin/group_food/group'],
            vernacular_name: foodItem['group_begin/group_food/species'],
            unit,
            massin_grams: foodItem['group_begin/group_food/quantity'],
            price: foodItem['group_begin/group_food/Cost'],
            aquisition: foodItem['group_begin/group_food/obtention'],
            acquisition_other:
              foodItem['group_begin/group_food/other_obtention'],
            origin_of_wildmeat:
              foodItem['group_begin/group_food/origin_wildmeat'],
            condition: foodItem['group_begin/group_food/state'],
            consumption_frequency_unit:
              foodItem['group_begin/group_food/frequency'],
          };
        });
      })(state);
    })
  )(state);
});