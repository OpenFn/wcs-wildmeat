sql(state => {
  return `insert into rural_consumption(
    "start",
    "end",
    "today",
    "deviceid",
    "surveyor",
    "intro_consent",
    "consent_checklist",
    "reason_declined",
    "reason_declined/refused_hurry",
    "reason_declined/refused_confidentiality",
    "reason_declined/refused_smartphone",
    "reason_declined/refused_no_benefit",
    "reason_declined/refused_harassed",
    "reason_declined/refused_trust",
    "reason_declined/resfused_talk",
    "reason_declined/safety_issue",
    "reason_declined/other_reason_decline",
    "other_reason_declined",
    "district",
    "village",
    "household_id",
    "identity",
    "date_constraint_calc",
    "info_recall_date",
    "people_number_explanation",
    "nb_people",
    "nb_babies",
    "nb_children",
    "nb_youngmen",
    "nb_men",
    "nb_oldmen",
    "nb_women",
    "nb_oldwomen",
    "nb_pregnant",
    "nb_brestfeeding",
    "eat_protein_yes_no",
    "additem",
    "notes_final",
    "__version__",
    "_id",
    "_uuid",
    "_submission_time",
    "_validation_status",
    "_index",
  ) values('` +
    state.data.start + `', '` +
    state.data.end + `', '` +
    state.data.today + `', '` +
    state.data.deviceid + `', '` +
    state.data.surveyor
  + `');`;
});