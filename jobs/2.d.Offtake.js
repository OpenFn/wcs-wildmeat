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

upsert('tbl_hunter_monitoring', 'ON CONSTRAINT tbl_hunter_monitoring_pkey', {
  study_id: state => state.studyIDMap[state.formType],
  site_id: state => state.studyIDMap[state.formType],
  hunter_monitoring_id: state.data.body['id_hunter'],
  external_id: state.data.body['id_hunter'],
  trip_hunting_method: state.data.body['trip/type'],
  date_start: state.data.body['trip/trip/hunting_start'],
  trip_end_time: state.data.body['trip/trip/hunting_return'],
  date_end: state.data.body['trip/trip/hunting_return'],
  trip_start_time: state.data.body['trip/trip/hunting_start'],
  duration: state.data.body['trip/duration'],
  hunter_number: state.data.body['trip/nb_people_hunt'],
  indiv_group_hunter: state.data.body['trip/hunt_group'],
  hunting_technique: state.data.body['trip/hunting_technique'],
  number_traps: state.data.body['trip/nb_traps'],
});

upsert('tbl_sample_hunter', 'ON CONSTRAINT tbl_sample_hunter_pkey', {
  sample_id: `${state.data.body._id}${state.data.body._xform_id_string}`,
  study_id: state => state.studyIDMap[state.formType], //AD
  site_id: state => state.studyIDMap[state.formType], //AD
  sample_unit: 'individual',
  hunter_monitoring_id: state.data.body['id_hunter'],
  //hunter_monitoring_id: '1', //AD
  date_start: state.data.body['trip/trip/hunting_start'],
  date_end: state.data.body['trip/trip/hunting_return'],
  number_sample_units: state.data.body['animal_details_count'],
});

fn(state => {
  const animals = state.data.body['animal_details'];
  if (animals) {
    return upsertMany(
      'tbl_wildmeat_hunter',
      'ON CONSTRAINT tbl_wildmeat_hunter_pkey',
      state =>
        animals.map(animal => {
          return {
            sample_id: `${state.data.body._id}${state.data.body._xform_id_string}`,
            wildmeat_id: animal['animal_details/species_id'],
            study_id: state.studyIDMap[state.formType], //AD
            site_id: state.studyIDMap[state.formType], //AD
            wildmeat_category_2: animal['animal_details/category2'],
            wildmeat_group: animal['animal_details/group'],
            vernacular_name: animal['animal_details/species_id'],
            harvest_method: animal['animal_details/hunting_method'],
            use: animal['animal_details/usage'],
            percent_sold: animal['animal_details/pct_sold'],
            condition: animal['animal_details/conservation'],
            price: animal['animal_details/price'],
            amount: 1
          };
        })
    )(state);
  }
  console.log('No animals array. Ignoring upsert...');
  return state;
});
