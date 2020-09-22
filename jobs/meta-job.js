alterState(state => {
  const mapType = {
    decimal: 'float4',
    integer: 'int4',
    text: 'text',
    select_one: 'varchar',
    calculate: 'varchar',
    date: 'date',
  };

  const types = ['float4', 'int4', 'text', 'varchar', 'varchar', 'date'];

  const { kobo_form } = state;

  var index = -1;
  var index2 = -1;
  var val1 = 'begin_repeat';
  var val2 = 'end_repeat';
  kobo_form.find((item, i) => {
    if (item.type === val1) {
      index = i;
    }
    if (item.type === val2) index2 = i;
  });

  const repeatGroup = kobo_form.splice(index, index2 - index + 1);

  return {
    ...state,
    kobo_columns: [kobo_form, repeatGroup],
  };
});

each(
  '$.tablesToBeCreated[*]',
  alterState(state => {
    const types = ['float4', 'int4', 'text', 'varchar', 'varchar', 'date'];

    const { table_name } = state.data[state.data.length - 1];
    return describeTable(table_name)(state)
      .then(postgresColumn => {
        const columnNames = postgresColumn.table_data.body.rows.map(
          x => x.column_name
        );
        console.log(columnNames);

        // On the 1st 'alterState' we separated the form in different parts (inside kobo_columns).
        // One holding repeatgroups, the other anything but repeatgroups.
        for (var idx = 0; idx < state.kobo_columns.length; idx++) {
          var path = [];
          var prefix = ''; // prefix can be something like "/group_begin/group_people/"
          for (var i = 0; i < state.kobo_columns[idx].length; i++) {
            // We 1st test if we meet those keyword so we can start assigning our prefix.
            if (
              state.kobo_columns[idx][i].type == 'begin_group' ||
              state.kobo_columns[idx][i].type == 'begin_repeat'
            ) {
              prefix += '/' + state.kobo_columns[idx][i].name;
            } else if (
              // if we have a 'end_group' or 'end_repeat',
              //it means we must close a group = removing last element of prefix
              state.kobo_columns[idx][i].type == 'end_group' ||
              state.kobo_columns[idx][i].type == 'end_repeat'
            ) {
              const prefixes = prefix.split('/');
              prefixes.splice(prefixes.length - 1);
              prefix = prefixes.join('/');
            } else {
              // if none of those cases are met, it means we have potentially a column then we must add it to the path.
              if (
                state.kobo_columns[idx][i].name &&
                types.includes(state.kobo_columns[idx][i].type)
              )
                path.push(prefix + '/' + state.kobo_columns[idx][i].name + '/');
            }
          }
          console.log(path);
          const mapPostgresToKobo = {}; // This is the jsonBody that should be given to our upsert

          columnNames.forEach((key, i) => (mapPostgresToKobo[key] = path[i]));
          console.log(mapPostgresToKobo);
        }
        //const expression = `UPSERT(${table_name}, uuid, ${mapPostgresToKobo})`;

        return state;
      })
      .catch(error => {
        console.log('here');
        console.log(error);
      });
  })
);
