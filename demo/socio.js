// Example only
sql(state => {
  const { data } = state;
  return (
    `insert into socio_datafrica(
    "today",
    "Welcome_msg",
    "country",
    "landscape",
    "project_name",
    "funding",
    "project_ID",
    "focal_point",
    "project_objective",
    "starting_date",
    "end_date",
    "project_code",
    "project_type",
    "p_a",
    "administrative_area",
    "territory",
    "benef_category",
    "Total_num_benef",
    "outcome_sustainability",
    "indicator",
    "indicator_result",
    "success_rating",
    "achievements",
    "difficulties",
    "output_failure",
    "outcome_failure",
    "replicate",
    "why",
    "cost",
    "report",
    "why_no_report",
    "report_title",
    "report_authors",
    "succes_recipe",
    "lessons_learned",
    "end",
    "work_site",
    "beneficiaries_category",
    "Total_number_beneficiary",
    "would_you_replicate_it_",
    "fail_reason",
    "Report_available",
    "why_not",
    "_id",
    "_uuid",
    "_submission_time",
    "_validation_status"
  ) values('` +
    [
      data.today,
      data['group_welcome/Welcome_msg'],
      data['group_project/country'],
      data['group_project/landscape'],
      data['group_project/project_name'],
      data['group_project/funding'],
      data['group_project/project_ID'],
      data['group_project/focal_point'],
      data['group_project/project_objective'],
      data['group_project/starting_date'],
      data['group_project/end_date'],
      data['group_project/project_code'],
      data['group_project/project_type'],
      data['group_project/p_a'],
      data['group_project/administrative_area'],
      data['group_project/territory'],
      data['group_project/benef_category'],
      data['group_project/Total_num_benef'],
      data['group_project/outcome_sustainability'],
      data['group_project/indicator'],
      data['group_project/indicator_result'],
      data['group_project/success_rating'],
      data['group_project/achievements'],
      data['group_project/difficulties'],
      data['group_project/output_failure'],
      data['group_project/outcome_failure'],
      data['group_project/replicate'],
      data['group_project/why'],
      data['group_project/cost'],
      data['group_project/report'],
      data['group_project/why_no_report'],
      data['group_project/report_title'],
      data['group_project/report_authors'],
      data['group_project/succes_recipe'],
      data['group_project/lessons_learned'],
      data['group_project/end_date'], // Correct?
      data['group_project/work_site'], // Where is this?
      data['group_project/benef_category'],
      data['group_project/Total_num_benef'],
      data.would_you_replicate_it_, // ??
      data.fail_reason, // ??
      data.Report_available, // ??
      data.why_not, // ??
      data._id,
      data._uuid,
      data._submission_time,
      JSON.stringify(data._validation_status),
      // data._index, // Is this meant to be the primary key (a serial) in the DB?
    ]
      .join("', '")
      .replace(/''/g, null) +
    `');`
  );
});
