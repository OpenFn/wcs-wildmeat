# wcs-wildmeat


## Connection to OpenFn.org
See the [`WCS Docs`](https://openfn.github.io/wcs/wildmeat/) for solution documentation. See the OpenFn `Wildmeat` project for the live integration. 

**N.B. that all commits to the `master` branch will auto-deploy to OpenFn.org and WCS's live integration implementation.**

## Wildmeat Integration with Transition Postgres DB
### (1) Solution Overview
OpenFn has configured an automated data integration solution between Kobo Toolbox and a PostgresSQL database to sync Kobo submissions and enable real-time monitoring of field data collection.

[See here](https://docs.google.com/spreadsheets/d/1qfniuXap7tyjf9sZZN1M1Hn7nzGfvs_twhcxzjRV8QQ/edit#gid=0) for the data element mapping specification.


### (2) Integration Flow
The solution is a one-way Kobo Toolbox-to-PostgresSQL integration that connects the following Kobo form types:
`Urban Consumption`,
`Rural Consumption`,
`Market`,
`Offtake`.

[See here](https://docs.google.com/spreadsheets/d/1qfniuXap7tyjf9sZZN1M1Hn7nzGfvs_twhcxzjRV8QQ/edit#gid=0) for the full list of Kobo forms which were used to design these integrations.

#### Triggers
Trigger Type: Message Filter  
A message filter trigger has been configured for each of the forms above. The corresponding job will run when a form with the matching message filter is recieved in the project inbox. These can be adjusted in the OpenFn project.

#### Data Mappings
The Kobo forms map to the following database tables:  
| DB Table    | External Uuid | Source data |
| ----------- | ------------- | ----------- |
| tbl_site | study_id | hardcoded default (e.g., `1001`) |
| tbl_sample  | ? | ? |
| tbl_study | study_id | hardcoded default (e.g., `2001`) |
| swm_transaction | ? | ? |
| tbl_individual | ? | ? |
| tbl_individual_char | ? | ? |
| tbl_household | ? | ? |
| tbl_household_char | ? | ? |
| tbl_wildmeat | ? | ? |
| tbl_market | ? | ? |
| tbl_wildmeat_market | ? | ? |
| tbl_sample_market | ? | ? |
| tbl_hunter_monitoring | ? | ? |
| tbl_wildmeat_hunter | ? | ? |
| tbl_wildmeat_urban | ? | ? |
| tbl_individual_urban | ? | ? |
| tbl_sample_hunter | ? | ? |
| tbl_sample_urban | ? | ? |


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

