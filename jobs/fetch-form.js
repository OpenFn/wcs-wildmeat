get('https://kf.kobotoolbox.org/api/v2/assets/?format=json', {}, state => {
  console.log(`Previous cursor: ${state.lastEnd}`);
  // Set a manual cursor if you'd like to only fetch data after a certain date
  const manualCursor = '2020-05-25T14:32:43.325+01:00';
  const filter = 'Rural Consumption';
  state.data.forms = state.data.results
    .filter(resource => resource.name.includes(filter))
    .map(form => {
      const url = form.url.split('?').join('?');
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
  get(`${state.data.url}`, {}, state => {
    console.log(state);
    // From this point in OpenFn, we trigger the create-table job on the current state.
    return state;
  })(state)
);
