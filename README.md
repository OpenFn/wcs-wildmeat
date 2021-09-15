# wcs-wildmeat


## Connection to OpenFn.org
See the [`WCS Docs`](https://openfn.github.io/wcs/wildmeat/) for solution documentation. See the OpenFn `Wildmeat` project for the live integration. 

**N.B. that all commits to the `master` branch will auto-deploy to OpenFn.org and WCS's live integration implementation.**

## Wildmeat Integration with Transition Postgres DB
### (1) Solution Overview
OpenFn has configured an automated data integration solution between Kobo Toolbox and a PostgresSQL database to sync Kobo submissions and enable real-time monitoring of field data collection.


### (2) Integration Flow
The solution is a one-way Kobo Toolbox-to-PostgresSQL integration that connects the following Kobo form types:
`Urban Consumption`,
`Rural Consumption`,
`Market`,
`Offtake`.

#### Triggers
Trigger Type: Message Filter  
A message filter trigger has been configured for each of the forms above. The corresponding job will run when a form with the matching message filter is recieved in the project inbox. These can be adjusted in the OpenFn project.

#### Data Mappings
These forms map to the following database tables:
`tbl_sample`  
`tbl_study`  
`swm_transaction`  
`tbl_site`  
`tbl_individual`  
`tbl_individual_char`  
`tbl_household`  
`tbl_household_char`  
`tbl_wildmeat`  
`tbl_sample_market`  
`tbl_market`  
`tbl_wildmeat_market`  
`tbl_hunter_monitoring`  
`tbl_sample_hunter`  
`tbl_wildmeat_hunter`  
`tbl_wildmeat_urban`  
`tbl_sample_urban`  
`tbl_individual_urban`  




#### External Identifiers
...

### (3) Assumptions & Considerations for Change Management
1. ...

### (4) Administration & Support
#### Provisioning, Hosting, & Maintenance
This integration is hosted on OpenFn.org with hosted SaaS. The Postgres DB is managed by WCS/EU SWM Wildmeat partners (email: U.Muchlish@cgiar.org)

####  Questions or support needed?
Contact support@openfn.org. 

