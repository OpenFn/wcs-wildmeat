// Job to be used for fetching data from Kobo on repeated, timer basis
// This can be run on-demand at any time by clicking "run"
console.log('Inspecting initial state...');
console.log(JSON.stringify({ ...state, configuration: 'REDACTED' }, null, 2));

get('https://kf.kobotoolbox.org/api/v2/assets/?format=json', {}, state => {
  console.log(`Previous cursor: ${state.lastEnd}`);
  // Set a manual cursor if you'd like to only fetch data after a certain date
  const manualCursor = '2020-08-01T14:32:43.325+01:00';

  // ===========================================================================
  // Add strings to be case-insensitively searched for across Kobo form names
  // and tag them all as one type of form for handling in OpenFn.
  const filters = ['Rural Consumption'];
  const tag = 'Rural Consumption';
  // ===========================================================================

  state.data.forms = state.data.results
    .filter(resource =>
      filters.some(f => resource.name.toLowerCase().includes(f.toLowerCase()))
    )
    .map(form => {
      console.log(form.name);
      const url = form.url.split('?').join('data/?');
      return {
        formId: form.uid,
        tag,
        url,
        //query: `&query={"end":{"$gte":"${manualCursor}"}}`,
        query: `&query={"end":{"$gte":"${state.lastEnd || manualCursor}"}}`,
      };
    });
  console.log(`Forms to fetch: ${JSON.stringify(state.data.forms, null, 2)}`);
  return { ...state, tag };
});

each(dataPath('forms[*]'), state =>
  get(`${state.data.url}${state.data.query}`, {}, state => {
    state.data.submissions = state.data.results.map(submission => {
      if (!submission['survey_info/household_id']) {
        submission['survey_info/household_id'] =
          submission['survey_info/household'];
      }

      return {
        //Here we append the tags defined above to the Kobo form submission data
        form: state.tag,
        defaultUnit: 'kilograms',
        body: submission,
      };
    });
    console.log(`Fetched ${state.data.count} submissions.`);
    //Once we fetch the data, we want to post each individual Kobo survey
    //back to the OpenFn inbox to run through the jobs
    // console.log(state.data.submissions);

    //TO LIMIT # SUBMISSIONS FETCHED
    state.data.sample = state.data.submissions.slice(0,100);

    return each(
       //dataPath('submissions[*]'),
     dataPath('sample[*]'),
      post(
        state.configuration.openfnInboxUrl,
        { body: state => state.data },
        state => {
          const delay = 200;
          console.log(`Waiting ${delay}ms. ⏱️`);
          function timer() {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve('Done. 👍');
              }, delay);
            });
          }
          async function msg() {
            const msg = await timer();
            console.log(msg);
            return state;
          }

          return msg();
        }
      )
    )(state);
  })(state)
);

alterState(state => {
  // TODO: Pluck out the end date of the last submission to use as a cursor.
  const lastEnd = state.references
    .filter(item => item && item.body)
    .map(s => s.body.end)
    .sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1))[0];
  console.log(`Next cursor: ${lastEnd}`);
  return { ...state, lastEnd, data: {}, references: [] };
});
