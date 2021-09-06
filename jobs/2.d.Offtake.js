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

    upsert('tbl_hunter_monitoring', 'sample_id', {
      study_id: studyIDMap[state.data.formType],
      site_id: '',
      hunter_monitoring_id: state.data.body['id_hunter'],

      trip_hunting_method: state.data.body['trip/type'],
      date_start: state.data.body['trip/trip/hunting_start'],
      trip_end_time: state.data.body['trip/trip/hunting_start'],
      date_end: state.data.body['trip/nb_people_hunt'],
      trip_start_time: state.data.body['trip/hunting_start'],
      duration: state.data.body['trip/duration'],
      hunter_number: state.data.body['trip/nb_people_hunt'],
      indiv_group_hunter: state.data.body['trip/hunt_group'],
      hunting_technique: state.data.body['trip/hunting_technique'],
      number_traps: state.data.body['trip/nb_traps'],
    }),

    upsert('tbl_sample_hunter', 'sample_id', {
      sample_id: `${state.data._id}${state.data._xform_id_string}`,
      sample_unit: 'individual',
      hunter_monitoring_id: state.data.body['id_hunter'],
      date_start: state.data.body['trip/trip/hunting_start'],
      number_sample_units: state.data.body['animal_details_count'],
    }),

    fn(state => {
      const animals = state.data.body['animal_details'];
      return upsertMany('tbl_wildmeat_hunter', 'study_id', state => {
        animals.map(animal => {
          return {
            sample_id: `${state.data._id}${state.data._xform_id_string}`,

            wildmeat_category_2: animal['animal_details/category2'],
            wildmeat_group: animal['animal_details/group'],
            vernacular_name: animal['animal_details/species_id'],
            harvest_method: animal['animal_details/hunting_method'],
            use: animal['animal_details/usage'],
            percent_sold: animal['animal_details/pct_sold'],
            condition: animal['animal_details/conservation'],
            price: animal['animal_details/price'],
          };
        });
      });
    })
  )(state);
});