//== Job to be used for fetching data from Kobo on repeated, timer basis  ==//
// This can be run on-demand at any time by clicking "run" //

get('https://kf.kobotoolbox.org/api/v2/assets/?format=json', {}, state => {
  console.log(`Previous cursor: ${state.lastEnd}`);
  // Set a manual cursor if you'd like to only fetch data after a certain date
  const manualCursor = '2020-05-25T14:32:43.325+01:00';
  const filter = 'Rural Consumption';
  state.data.forms = state.data.results
    .filter(resource => resource.name.includes(filter))
    .map(form => {
      const url = form.url.split('?').join('data/?');
      return {
        formId: form.uid,
        tag: filter,
        url,
        query: `&query={"end":{"$gte":"${state.lastEnd || manualCursor}"}}`,
      };
    });
  console.log(`Forms to fetch: ${JSON.stringify(state.data.forms, null, 2)}`);
  return { ...state, filter };
});

each(dataPath('forms[*]'), state =>
  get(`${state.data.url}${state.data.query}`, {}, state => {
    state.data.submissions = state.data.results.map(submission => ({
      //Here we append the tags defined above to the Kobo form submission data
      form: state.filter,
      body: submission,
    }));
    console.log(`Fetched ${state.data.count} submissions.`);
    //Once we fetch the data, we want to post each individual Kobo survey
    //back to the OpenFn inbox to run through the jobs
    console.log(state.data.submissions);
    return each(
      dataPath('submissions[*]'),
      post(
        state.configuration.openfnInboxUrl,
        { body: state => state.data },
        state => {
          const delay = 1000;
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
