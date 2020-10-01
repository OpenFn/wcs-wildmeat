# wcs-consocsci

Wildlife Conservation Society Project

## Connection to OpenFn.org

**N.B. that all commits to the `master` branch will auto-deploy to OpenFn.org and WCS's live integration implementation.**

## Wildmeat Kobo Integration

EU SWM uses Kobo Toolbox to collect data on Rural Consumption across sites (see
the Kobo form template here). OpenFn automates data integration between Kobo
Toolbox and a Postgresql transitional database.

### (1) Data Flows & OpenFn Jobs

The following jobs are configured on OpenFn.org to run automatically.

1. [fetch_kobo_data.js](https://github.com/OpenFn/wcs-consocsci/blob/master/fetch_kobo_data.js):
   On a timer-basis, OpenFn fetches all Kobo survey submissions where form
   `name` contains "Rural Consumption". This job sends the Kobo data to
   OpenFn.org and automatically triggers the next job.
2. [ruralConsumptionToPostgres.js](https://github.com/OpenFn/wcs-consocsci/blob/master/ruralConsumptionToPostgres.js): OpenFn automatically cleans, maps, & loads the Kobo survey data into structured tables in a Postgres Wildmeat database.

### (2) Mappings

[See here](https://docs.google.com/spreadsheets/d/15VRibnaglShF3oNNLMbiyGopTJrYbP02aQ04cz4Qt-k/edit#gid=767749359) for the integration mapping specifications. These jobs leverage [language-postgresql](https://github.com/OpenFn/postgresql) to perform `upsert()` operations in the Postgres database.

### (3) Assumptions

1. The jobs and mapping design are based on [this DRC version](https://docs.google.com/spreadsheets/d/1AN2Qyjx-ua3fE5-Nj7Bg2WSdZdIE6zy4FmVVrMqGZl0/edit?usp=drive_web&ouid=101430720901034004945) of the Rural Consumption Kobo survey.
2. All data cleaning will be done in Kobo Toolbox. Every time Kobo data is
   synced with the DB, it will overwrite the records saved there and use the
   above uuid to upsert existing records.
3. Kobo forms only capture species `code`, not `name`. OpenFn has therefore
   implemented a reference table `swm_species` and uploaded
   a [list of species](https://docs.google.com/spreadsheets/d/1yfBjpb9cuCOvzKF9Iu_XrXLA_BC8cQFCyYxjVgFIuXU/edit) extracted
   from the DRC Kobo form. WCS will keep this `swm_species` table up-to-date to
   ensure successful integration of any species data.
4. The jobs currently use hard-coded values for `study_id` ('1000') and
   `site_id` ('1001') as this information is currently not captured in the Kobo
   forms.
5. See [Wildmeat Map](https://docs.google.com/spreadsheets/d/15VRibnaglShF3oNNLMbiyGopTJrYbP02aQ04cz4Qt-k/edit#gid=767749359) for a list of fields that were intentionally not mapped in these jobs (i.e., `tbl_individual_char`).
6. All Kobo surveys to be fetched by OpenFn will contain "Rural Consumption" in
   the form name. If this criteria should change, job #1 should be updated.

### (4) Open questions

1. Are all Kobo surveys to be integrated hosted on 1 server? Or will OpenFn need
   to access multiple Kobo servers to fetch Rural Consumption data?
2. How will we determine the `study_id` and `site_id` from the Kobo forms going
   forward? Or will we always hardcode these values to map to dummy `tbl_study`
   and `tbl_site` records in the database? (Usman says these ids are determined
   by an internal protocol and no way to determine at the Kobo survey stage. So
   do we therefore continue to use the hardcoded values?)
3. How to determine the survey consumption type (i.e., Hunter or Market)?
   (Question flagged by Usman.)
4. Is there a default `sample_unit` for different surveys?
5. How do you want to test these jobs? What Kobo server should we connect with?
   (Currently testing with OpenFn Kobo account.)