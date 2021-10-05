alterState(state => {
  if (state.data.body.consent_checklist == 'no') {
    console.log("Note: consent_checklist == 'no', skipping to swm_transaction");
    return state;
  }

  return combine(
    upsert('tbl_study', 'study_id', {
      study_id: 1000,
    }),

    upsert('tbl_site', 'ON CONSTRAINT tbl_site_pkey', {
      study_id: 1000,
      site_id: 1001,
      admin_level_3: state.data.body['survey_info/district'],
      site_name: state.data.body['survey_info/village'],
    }),

    upsert('tbl_household', 'ON CONSTRAINT tbl_household_pkey', {
      study_id: 1000,
      site_id: 1001,
      household_id: state.data.body['survey_info/household_id'],
      external_id: state.data.body['survey_info/household_id'],
    }),

    upsert('tbl_household_char', 'ON CONSTRAINT tbl_household_char_pkey', {
      site_id: 1001,
      study_id: 1000,
      household_id: state.data.body['survey_info/household_id'],
      // TODO: decide how to handle household_char_id //Q: remove?
      household_char_id: state.data.body._id,
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

    upsert('tbl_sample', 'ON CONSTRAINT tbl_sample_pkey', {
      study_id: 1000,
      site_id: 1001,
      household_id: state.data.body['survey_info/household_id'],
      // household_char_id: state.data.body['survey_info/household_id'], //Q: remove?
      date_start: state.data.body['survey_info/info_recall_date'],
      sample_id:
        state.data.body._id +
        state.data.body._submission_time +
        state.data.body._xform_id_string,
      sample_unit: state.data.defaultUnit || 'kilograms', //Q: set to default unit?
      number_sample_units: '24',
      sampling_effortin_days: '2',
    }),

    alterState(state => {
      const repeatGroup = state.data.body['group_begin/group_food'];
      if (repeatGroup) {
        console.log('There is an array of wildmeat.');
        return upsertMany(
          'tbl_wildmeat',
          'ON CONSTRAINT tbl_wildmeat_pkey',
          state =>
            repeatGroup.map((foodItem, i) => {
              return {
                kobo_submission_id: state.data.body['meta/instanceID'],
                site_id: 1001,
                study_id: 1000,
                sample_id:
                  state.data.body._id +
                  state.data.body._submission_time +
                  state.data.body._xform_id_string,
                //taxon_id: foodItem['group_begin/group_food/species'], //Q: Remove constraints? OR map to a different column?
                wildmeat_id: state.data.body._id + i,
                vernacular_name: foodItem['group_begin/group_food/species'],
                wildmeat_category_1:
                  foodItem['group_begin/group_food/category1'],
                wildmeat_category_2:
                  foodItem['group_begin/group_food/category2'],
                wildmeat_group: foodItem['group_begin/group_food/group'],
                unit:
                  foodItem['group_begin/group_food/quantity_technique'] ===
                  'known_technique'
                    ? 'kilogram' //Q: set to default unit? Future options: biomass
                    : '-8',
                amount: foodItem['group_begin/group_food/amount'],
                massin_grams:
                  state.data.defaultUnit === 'kilograms'
                    ? parseInt(foodItem['group_begin/group_food/quantity']) *
                      1000
                    : foodItem['group_begin/group_food/quantity'],
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
            })
        )(state);
      }

      console.log('There is no wildmeat array. Skipping insertMany(...)');
      return state;
    }),

    upsert('tbl_individual', 'ON CONSTRAINT tbl_individual_pkey', {
      site_id: 1001,
      study_id: 1000,
      household_id: state.data.body['survey_info/household_id'],
      external_id: state.data.body['survey_info/identity'],
      // TODO: Autonumber comment in postgres, but NOT getting generated. Intent?
      individual_id: state.data.body._id,
    })
  )(state);
});


upsert('swm_transaction', 'ON CONSTRAINT swm_data_pkey', {
  uuid: state.data.body._id + state.data.body._xform_id_string,
  date: state.data.body._submission_time,
  status: 'new',
  submission_time: state.data.body._submission_time,
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
