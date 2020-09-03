//== Job to be used for fetching data from Kobo on repeated, timer basis  ==//
// This can be run on-demand at any time by clicking "run" //

get('https://kf.kobotoolbox.org/api/v2/assets/?format=json', {}, state => {
  // Set a manual cursor if you'd like to only fetch data
  manualCursor = '2020-05-25T14:32:43.325+01:00';
  state.data.forms = state.data.results
    .filter(resource => resource.name.includes('Rural Consumption'))
    .map(form => {
      const url = form.url.split('?').join('data/?');
      return {
        formId: form.uid,
        tag: 'Rural Consumption',
        url,
        query: `&query={"end":{"$gte":"${state.lastEnd || manualCursor}"}}`,
      };
    });
  return state;
});

each(dataPath('forms[*]'), state =>
  get(`${state.data.url}${state.data.query}`, {}, state => {
    state.data.submissions = state.data.results.map(submission => ({
      //Here we append the tags defined above to the Kobo form submission data
      form: lastReferenceValue('tag')(state),
      body: submission,
    }));
    console.log(`Fetched ${state.data.count} submissions.`);
    //Once we fetch the data, we want to post each individual Kobo survey
    //back to the OpenFn inbox to run through the jobs
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
  console.log(state);
  console.log(state.references);
  const lastEnd = state.references
    .filter(item => item.body)
    .map(s => {
      console.log(s);
      return s.body.end;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  return { ...state, lastEnd };
});
