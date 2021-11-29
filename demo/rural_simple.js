// Example only

sql(state => {
  const { data } = state;
  const params = data.__query_params;
  return (
    `insert into "proto_tbl_submission" ("` +
    [
      'nb_babies',
      'info_recall_date',
      '_attachments',
      'nb_children',
      'notes_final',
      '_validation_status',
      'district',
      '_submitted_by',
      'survey_end',
      'nb_oldwomen',
      'nb_pregnant',
      'consent_checklist',
      '_geolocation',
      'date_constraint_calc',
      'nb_men',
      'surveyor',
      '_id',
      'today',
      '_xform_id_string',
      '_status',
      'nb_oldmen',
      'nb_people',
      '_notes',
      'survey_start',
      '_version__001',
      'deviceid',
      'survey_identity',
      '_version_',
      '_bamboo_dataset_id',
      'nb_youngmen',
      'formhub_uuid',
      'id',
      'household_id',
      'village',
      'nb_women',
      '_submission_time',
      'eat_protein_yes_no',
      '__version__',
      '_tags',
      'nb_brestfeeding',
      'alt',
      'country',
      'currency',
      'lat',
      'long',
      'site',
      'site_id',
      'site_type',
      'state',
      'study_id',
      'survey_type',
    ].join('", "') +
    `") values ('` +
    [
      data['group_begin/group_people/nb_babies'],
      data['survey_info/info_recall_date'],
      JSON.stringify(data['_attachments']),
      data['group_begin/group_people/nb_children'],
      data['notes_final'],
      JSON.stringify(data['_validation_status']),
      data['survey_info/district'],
      data['_submitted_by'],
      data['end'],
      data['group_begin/group_people/nb_oldwomen'],
      data['group_begin/group_people/nb_pregnant'],
      data['consent_checklist'],
      JSON.stringify(data['_geolocation']),
      data['survey_info/date_constraint_calc'],
      data['group_begin/group_people/nb_men'],
      data['surveyor'],
      data['_id'],
      data['today'],
      data['_xform_id_string'],
      data['_status'],
      data['group_begin/group_people/nb_oldmen'],
      data['group_begin/group_people/nb_people'],
      JSON.stringify(data['_notes']),
      data['start'],
      data['_version__001'],
      data['deviceid'],
      data['survey_info/identity'],
      data['_version_'],
      data['_bamboo_dataset_id'],
      data['group_begin/group_people/nb_youngmen'],
      data['formhub/uuid'],
      data['_uuid'],
      data['survey_info/household_id'],
      data['survey_info/village'],
      data['group_begin/group_people/nb_women'],
      data['_submission_time'],
      data['group_begin/eat_protein_yes_no'],
      data['__version__'],
      JSON.stringify(data['_tags']),
      data['group_begin/group_people/nb_brestfeeding'],
      params['alt'],
      params['country'],
      params['currency'],
      params['lat'],
      params['long'],
      params['site'],
      params['siteId'],
      params['siteType'],
      params['state'],
      params['studyId'],
      params['type'],
    ]
      .join("', '")
      .replace(/''/g, null) +
    `') ON CONFLICT DO NOTHING;`
  );
});

sql(state => {
  const { data } = state;
  const params = data.__query_params;
  return (
    `insert into "proto_tbl_wildmeat" ("` +
    [
      'id',
      'food_cost',
      'category1',
      'category2',
      'frequency',
      'food_group',
      'notes',
      'obtention',
      'quantity',
      'quantity_technique',
      'state',
      'species',
      'survey_id',
    ].join('", "') +
    `") values ('` +
    data['group_begin/group_food']
      .map((item, index) =>
        [
          `${data._uuid}-wm${index}`,
          item['group_begin/group_food/Cost'],
          item['group_begin/group_food/category1'],
          item['group_begin/group_food/category2'],
          item['group_begin/group_food/frequency'],
          item['group_begin/group_food/group'],
          item['group_begin/group_food/notes_alim'],
          item['group_begin/group_food/obtention'],
          item['group_begin/group_food/quantity'],
          item['group_begin/group_food/quantity_technique'],
          item['group_begin/group_food/state'] === 'other_state'
            ? '-8'
            : item['group_begin/group_food/state'],
          item['group_begin/group_food/species'],
          data._uuid,
        ].join("', '")
      )
      .join("'), ('")
      .replace(/''/g, null) +
    `') ON CONFLICT DO NOTHING;`
  );
});
