alterState(state => {
    const mapType = {
      decimal: 'float4',
      integer: 'int4',
      text: 'text',
      select_one: 'varchar',
      calculate: 'varchar',
      date: 'date',
    };
  
    const types = [
      'integer',
      'text',
      'decimal',
      'select_one',
      'date',
      'calculate',
    ];
  
    const { survey } = state.data.content;
  
    var index = -1;
    var index2 = -1;
    var val1 = 'begin_repeat';
    var val2 = 'end_repeat';
    survey.find((item, i) => {
      if (item.type === val1) {
        index = i;
      }
      if (item.type === val2) index2 = i;
    });
  
    const repeatGroup = survey.splice(index, index2 - index + 1);
  
    const columns = survey.filter(elt => types.includes(elt.type));
    const repeatGroup_columns = repeatGroup.filter(elt =>
      types.includes(elt.type)
    );
  
    columns.forEach(obj => (obj.type = mapType[obj.type]));
    repeatGroup_columns.forEach(obj => (obj.type = mapType[obj.type]));
  
    columns.push({ table_name: 'tbl_survey' });
    repeatGroup_columns.push({ table_name: 'tbl_survey_char' });
  
    columns.forEach(obj => {
      if (obj.name === 'group') {
        obj.name = 'kobogroup';
      }
    });
    repeatGroup_columns.forEach(obj => {
      if (obj.name === 'group') {
        obj.name = 'kobogroup';
      }
    });
  
    return {
      ...state,
      tablesToBeCreated: [columns, repeatGroup_columns],
    };
  });
  
  each(
    '$.tablesToBeCreated[*]',
    alterState(state => {
      const { table_name } = state.data[state.data.length - 1];
  
      return describeTable(table_name)(state)
        .then(postgresColumn => {
          const { rows } = postgresColumn.table_data.body;
  
          if (postgresColumn.table_data.body.rowCount === 0) {
            console.log('No matching table found in postgres --- Inserting.');
  
            const columns = state.data.filter(x => x.name !== undefined);
            return insertTable(state => columns, table_name)(state);
          } else {
            const columnNames = rows.map(x => x.column_name);
  
            console.log('----------------------');
            //console.log(columnNames);
            const newColumns = state.data.filter(
              x =>
                x.name !== undefined &&
                !columnNames.includes(x.name.toLowerCase())
            );
            //console.log(newColumns);
            if (newColumns.length > 0) {
              console.log('Existing table found in postgres --- Updating.');
  
              return modifyTable(state => newColumns, table_name)(state);
            } else return state;
          }
        })
        .catch(error => {
          console.log(error);
        });
    })
  );
  