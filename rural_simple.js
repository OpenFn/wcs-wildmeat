sql(state => {
  const { data } = state;
  return (
    `insert into "proto_tbl_submission" ("` +
    [
      'group_begin/group_people/nb_babies',
      'survey_info/info_recall_date',
      '_attachments',
      'group_begin/group_people/nb_children',
      'notes_final',
      '_validation_status',
      'survey_info/district',
      '_submitted_by',
      'end',
      'group_begin/group_people/nb_oldwomen',
      'group_begin/group_people/nb_pregnant',
      'consent_checklist',
      '_geolocation',
      'survey_info/date_constraint_calc',
      'group_begin/group_people/nb_men',
      'surveyor',
      '_id',
      'meta/instanceID',
      'today',
      '_xform_id_string',
      '_status',
      'group_begin/group_people/nb_oldmen',
      'group_begin/group_people/nb_people',
      '_notes',
      'start',
      '_version__001',
      'deviceid',
      'survey_info/identity',
      '_version_',
      '_bamboo_dataset_id',
      'group_begin/group_people/nb_youngmen',
      'formhub/uuid',
      '_uuid',
      'survey_info/household_id',
      'survey_info/village',
      'group_begin/group_people/nb_women',
      '_submission_time',
      'group_begin/eat_protein_yes_no',
      '__version__',
      '_tags',
      'group_begin/group_people/nb_brestfeeding',
      '__query_params',
      'alt',
      'country',
      'currency',
      'lat',
      'long',
      'site',
      'siteId',
      'siteType',
      'state',
      'studyId',
      'type',
    ].join('", "') +
    `") values ('` +
    [
      data['group_begin/group_people/nb_babies'],
      data['survey_info/info_recall_date'],
      data['_attachments'],
      data['group_begin/group_people/nb_children'],
      data['notes_final'],
      data['_validation_status'],
      data['survey_info/district'],
      data['_submitted_by'],
      data['end'],
      data['group_begin/group_people/nb_oldwomen'],
      data['group_begin/group_people/nb_pregnant'],
      data['consent_checklist'],
      data['_geolocation'],
      data['survey_info/date_constraint_calc'],
      data['group_begin/group_people/nb_men'],
      data['surveyor'],
      data['_id'],
      data['meta/instanceID'],
      data['today'],
      data['_xform_id_string'],
      data['_status'],
      data['group_begin/group_people/nb_oldmen'],
      data['group_begin/group_people/nb_people'],
      data['_notes'],
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
      data['_tags'],
      data['group_begin/group_people/nb_brestfeeding'],
      data['__query_params'],
      data['alt'],
      data['country'],
      data['currency'],
      data['lat'],
      data['long'],
      data['site'],
      data['siteId'],
      data['siteType'],
      data['state'],
      data['studyId'],
      data['type'],
    ]
      .join("', '")
      .replace(/''/g, null) +
    `');`
  );
});

sql(state => {
  const { data } = state;
  return (
    `insert into "proto_tbl_wildmeat" ("` +
    [
      'wildmeatID',
      'siteID',
      'sampleID',
      'unit',
      'amount',
      'massInGrams',
      'price',
      'acquisition',
      'condition',
      'currency',
      'scientificName',
      'studyID',
      'siteCharID_deleted',
    ].join('", "') +
    `") values ('` +
    data['group_begin/group_food']
      .map((item, index) =>
        [
          // TODO: Replace this with real uuid
          `${data._uuid}-wm${index}`,
          data.__query_params.siteId,
          data._uuid,
          item['group_begin/group_food/quantity_technique'] === 'known_quantity'
            ? 'kilogram'
            : 'other',
          item['group_begin/group_food/quantity_technique'] === 'known_quantity'
            ? item['group_begin/group_food/quantity']
            : '-8',
          // TODO: Determine how we handle the '-8's
          parseInt(item['group_begin/group_food/quantity']) * 1000,
          item['group_begin/group_food/Cost'],
          item['group_begin/group_food/obtention'],
          item['group_begin/group_food/state'] === 'other_state'
            ? '-8'
            : item['group_begin/group_food/state'],
          'CDF',
          item['group_begin/group_food/species'],
          data.__query_params.studyId,
          0,
        ].join("', '")
      )
      .join("'), ('")
      .replace(/''/g, null) +
    `') ON CONFLICT DO NOTHING;`
  );
});
