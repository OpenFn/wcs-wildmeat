# wcs-wildmeat


## Connection to OpenFn.org
See the [`WCS Docs`](https://openfn.github.io/wcs/wildmeat/) for solution documentation. See the OpenFn `Wildmeat` project for the live integration. 

**N.B. that all commits to the `master` branch will auto-deploy to OpenFn.org and WCS's live integration implementation.**

## Wildmeat Integration with Transition Postgres DB
### (1) Solution Overview
OpenFn has configured an automated data integration solution between Kobo Toolbox and a PostgresSQL database to sync Kobo submissions and enable real-time monitoring of field data collection.

[See here](https://drive.google.com/file/d/1H6x0S-b6BOqVKN41i99c7mVjyk_YACrT/view?usp=sharing) for the data model of the destionation database. 



### (2) Integration Flow
The solution is a one-way Kobo Toolbox-to-PostgresSQL integration that connects the following Kobo form types:
`Urban Consumption`,
`Rural Consumption`,
`Market`,
`Offtake`.

[See here](https://docs.google.com/spreadsheets/d/1qfniuXap7tyjf9sZZN1M1Hn7nzGfvs_twhcxzjRV8QQ/edit#gid=0) for the full list of Kobo forms which were used to design these integrations.

[See here](https://docs.google.com/spreadsheets/d/1qfniuXap7tyjf9sZZN1M1Hn7nzGfvs_twhcxzjRV8QQ/edit#gid=0) for the data element mapping specification for exchange data between Kobo and the database.


#### Triggers
Trigger Type: Message Filter  
A message filter trigger has been configured for each of the forms above. The corresponding job will run when a form with the matching message filter is recieved in the project inbox. These can be adjusted in the OpenFn project.

#### Data Mappings
The Kobo forms map to the following database tables:  
| DB Table    | External Uuid | Source data | Form Type |
| ----------- | ------------- | ----------- | --------- |
| tbl_site | site_id | hardcoded default (e.g., `1001`) | All |
| tbl_sample  | sample_id | _id + _xform_id_string | Rural Consumption |
| tbl_study | study_id | hardcoded default (e.g., `2001`) | All |
| swm_transaction | uuid | _id + _xform_id_string | Rural Consumption |
| tbl_individual | individual_id | _id | Rural Consumption |
| tbl_individual_char | individual_char_id | _id | Rural Consumption |
| tbl_household | household_id | household_id | Rural Consumption |
| tbl_household_char | household_id | household_id | Rural Consumption |
| tbl_wildmeat | vernacular_name | species | Rural Consumption |
| tbl_market | external_id | market (e.g., "djazzi") | Market |
| tbl_wildmeat_market | wildmeat_id | species | Market |
| tbl_sample_market | sample_id | _id + _xform_id_string | Market |
| tbl_hunter_monitoring | hunter_monitoring_id | id_hunter | Offtake |
| tbl_wildmeat_hunter | vernacular_name | species_id | Offtake |
| tbl_sample_hunter | sample_id | _id + _xform_id_string | Offtake |
| tbl_wildmeat_urban | wildmeat_id | wildmeat | Urban Consumption |
| tbl_individual_urban | individual_id | _id | Urban Consumption |
| tbl_sample_urban | sample_id | _id + _xform_id_string| Urban Consumption |


#### External Identifiers
...

### (3) Assumptions & Considerations for Change Management
1. `study_id` & `site_id` are hardcoded values.
2. This integration assumes that the master list of species used across forms has already been added to the PostgresSQL database. The master list can be found [here](https://docs.google.com/spreadsheets/d/1qfniuXap7tyjf9sZZN1M1Hn7nzGfvs_twhcxzjRV8QQ/edit#gid=1500079237).

### (4) Administration & Support
#### Provisioning, Hosting, & Maintenance
This integration is hosted on OpenFn.org with hosted SaaS. The Postgres DB is managed by WCS/EU SWM Wildmeat partners (email: U.Muchlish@cgiar.org).

####  Questions or support needed?
Contact support@openfn.org. 

