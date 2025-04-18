//== Job to be used for fetching data from Kobo on repeated, timer basis  ==//
// This can be run on-demand at any time by clicking "run" // 
// Add a new form to this job to sync it to the DB: Fill the id, name, and type to this list.//
// DO NOT DELETE ANY SURVEY FROM THIS JOB, just comment it if it doesn't need to be synced anymore. //
// Form type can be: Market, Offtake, Urban Consumption, Rural Consumption //

fn(state => {
  //console.log('Date of last sync:', state.lastEnd);
  // Set a manual cursor if you'd like to only fetch data after this date.
  const manualCursor = '2024-07-18T14:32:43.325+01:00';
  
  const cursorDate = state.lastEnd || manualCursor; 
  console.log('Current cursor value:', cursorDate);
  
  state.data = {
    surveys: [
      //** Specify new forms to fetch here **//
      // ------------- CONGO ----------------------
      {
        id: 'a9eJJ2hrRSMCJZ95WMc93j',
        name: 'SWM Conso Urbaine RoC 2020-2021',
        type: 'Urban Consumption'
      },
            {
        id: 'aUrUbD6C9hB3y8XjfQ9CLc',
        name: 'SWM Conso Rurale RoC 2020-2021',
        type: 'Rural Consumption'
      },
             {
         id: 'aDVDagX8TE9NUY7xmvAUpv',
         name: 'SWM Suivi Marché 2020 - Congo Market ',
         type: 'Market'
       },
            {
        id: 'a3hX3ZvVm4BanZDeis9AFj',
        name: 'SWM Prélèvement de chasse RoC',
        type: 'Offtake'
      },
       // ------------- DRC ----------------------
      // {
      //   id: 'aJxTqQSF7VRLYbMGfeTHfd',
      //   name: 'SWM Urban Consumption Survey 2019',
      //   type: 'Urban Consumption'
      // },
      // {
      //   id: 'aUtBrSsVRkZrjkpodB6TW7',
      //   name: 'SWM_Rural_Consumption_Form',
      //   type: 'Rural Consumption'
      // },
      {
        id: 'aem28HL45vkQKyhB22xn8Q',
        name: 'SWM Suivi points de vente protéines animales - DRC Market',
        type: 'Market'
      },
      {
        id: 'aYcthFvuwgvUn89aBoedgT',
        name: 'SWM_Offtake_DRC_202104',
        type: 'Offtake'
      },

    ].map(survey => ({
      formId: survey.id,
      formName: survey.name,
      formType: survey.type,
      url: `https://kf.kobotoolbox.org/api/v2/assets/${survey.id}/data/?format=json`,
      query: `&query={"end":{"$gte":"${cursorDate}"}}`,
    })),
  };

  return state;
});

each(dataPath('surveys[*]'), state => {
  const { url, query, formId, formName, formType } = state.data;
  return get(`${state.data.url}${state.data.query}`, {}, state => {
    state.data.submissions = state.data.results.map(submission => {
      return {
        body: submission,
        formName,
        formType
      };
    });
    console.log(`Fetched ${state.data.count} submissions.`);
    //Once we fetch the data, we want to post each individual Kobo survey
    //back to the OpenFn inbox to run through the jobs
    const count = state.data.count;

    return each(dataPath('submissions[*]'), state => {
      console.log(`Posting ${state.data.i + 1} of ${count}...`);
      return post(state.configuration.openfnInboxUrl, {
        body: state => state.data,
      })(state);
    })(state);
  })(state)
});

fn(state => {
  // TODO: Pluck out the end date of the last submission to use as a cursor.
  const lastEnd = state.references
    .filter(item => item && item.body)
    .map(s => s.body.end)
    .sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1))[0];

  console.log(`Next cursor: ${lastEnd}`);
  return { ...state, lastEnd, data: {}, references: [], response: {} };
});