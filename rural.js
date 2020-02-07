sql(state => {
  const { data } = state;
  return (
    `insert into "tbl_site" ("` +
    [
      'siteID',
      'studyID',
      'countryCode',
      'adminLevel1',
      'adminLevel3',
      'siteName',
      'siteType',
      'decimalLatitude',
      'decimalLongitude',
      'verbatimElevation',
    ].join('", "') +
    `") values ('` +
    [
      data.__query_params.siteId,
      data.__query_params.studyId,
      data.__query_params.country,
      data.__query_params.state,
      data['survey_info/district'],
      data['survey_info/village'],
      data.__query_params.siteType,
      data.__query_params.lat,
      data.__query_params.long,
      data.__query_params.alt,
    ]
      .join("', '")
      .replace(/''/g, null) +
    `');`
  );
});

sql(state => {
  const { data } = state;
  return (
    `insert into "tbl_household" ("` +
    [
      'siteID',
      'studyID',
      'householdID',
      'description',
      // more columns?
    ].join('", "') +
    `") values ('` +
    [
      data.__query_params.siteId,
      data.__query_params.studyId,
      data._uuid,
      data['survey_info/household_id'],
      // more values?
    ]
      .join("', '")
      .replace(/''/g, null) +
    `');`
  );
});

sql(state => {
  const { data } = state;
  return (
    `insert into "tbl_householdChar" ("` +
    [
      // 'householdCharID',
      // 'householdID',
      'numberOccupants',
      'numberChildren',
      'numberAdultMen',
      'numberAdultWomen',
      'studyID',
    ].join('", "') +
    `") values ('` +
    [
      // data._uuid,
      // data._uuid,
      data['group_begin/group_people/nb_people'],
      parseInt(data['group_begin/group_people/nb_babies']) +
        parseInt(data['group_begin/group_people/nb_children']),
      parseInt(data['group_begin/group_people/nb_youngmen']) +
        parseInt(data['group_begin/group_people/nb_men']) +
        parseInt(data['group_begin/group_people/nb_oldmen']),
      parseInt(data['group_begin/group_people/nb_women']) +
        parseInt(data['group_begin/group_people/nb_oldwomen']) +
        parseInt(data['group_begin/group_people/nb_pregnant']) +
        parseInt(data['group_begin/group_people/nb_brestfeeding']),
      data.__query_params.studyId,
    ]
      .join("', '")
      .replace(/''/g, null) +
    `');`
  );
});

sql(state => {
  const { data } = state;
  return (
    `insert into "tbl_wildmeat" (
      "unit",
      "amount",
      "massin_grams",
      "price",
      "acquisition",
      "condition",
      "currency"
  ) values ('` +
    data['group_begin/group_food']
      .map(i =>
        [
          i['group_begin/group_food/quantity_technique'] === 'known_quantity'
            ? 'kilogram'
            : 'other',
          i['group_begin/group_food/quantity_technique'] === 'known_quantity'
            ? i['group_begin/group_food/quantity']
            : '-8',
          // TODO: Determine how we handle the '-8's
          parseInt(i['group_begin/group_food/quantity']) * 1000,
          i['group_begin/group_food/Cost'],
          i['group_begin/group_food/obtention'],
          i['group_begin/group_food/state'] === 'other_state'
            ? '-8'
            : i['group_begin/group_food/state'],
          'CDF',
        ].join("', '")
      )
      .join("'), ('")
      .replace(/''/g, null) +
    `');`
  );
});

sql(state => {
  const { data } = state;
  return (
    `insert into "tbl_sample" (
      "sample_date_start",
      "sample_date_end",
      "household_id",
      "household_char_id",
      "sample_unit",
      "number_sample_units",
      "sampling_effort_in_days"
  ) values ('` +
    [
      data['survey_info/info_recall_date'],
      data['survey_info/info_recall_date'],
      '', // household_id
      '', // household_char_id
      data['group_begin/group_sample/sample_unit'],
      data['group_begin/group_sample/number_sample_units'],
      data['group_begin/group_sample/sampling_effort_in_days'],
    ]
      .join("', '")
      .replace(/''/g, null) +
    `');`
  );
});
