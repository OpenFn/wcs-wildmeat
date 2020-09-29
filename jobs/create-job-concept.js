post(
  '/api/login',
  {
    body: {
      session: {
        email: state.configuration.username,
        password: state.configuration.password,
      },
    },
  },
  state => {
    const { jwt } = state.data.body;
    const { baseUrl, project } = state.configuration;

    state.configuration = { baseUrl, project, username: null, password: null };

    return execute(
      get(
        '/api/jobs',
        {
          query: {
            project_id: project,
          },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
        state => {
          console.log(state);
          return state;
        }
      ),
      // alterState(state => {
      //   console.log('no job was found, we create');
      //   return state;
      // }),
      post(
        '/api/jobs',
        {
          body: state => ({
            adaptor: 'postgres',
            adaptor_version: null,
            archived: false,
            autoprocess: false,
            credential_id: null,
            expression: '// Your job goes here.',
            inserted_at: new Date(),
            long_run: false,
            name: 'asses',
            no_console: false,
            test_mode: false,
            path_in_external_repo: null,
            project_id: project,
            trigger_id: 3,
            updated_at: new Date(),
          }),
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
        state => {
          console.log(state);
          return state;
        }
      ),
      post()
    )(state);
  }
);
