# Open Data Hub Dashboard

A dashboard for Open Data Hub components.

- Shows what's installed
- Show's what's available for installation
- Links to component UIs
- Links to component documentation

## Requirements
Before developing for ODH, the basic requirements:
* Your system needs to be running [NodeJS version 12+ and NPM](https://nodejs.org/)
* [Yarn 1.22+](https://yarnpkg.com) for dependency and script management.
  
### Additional tooling requirements
* [OpenShift CLI, the "oc" command](https://docs.openshift.com/enterprise/3.2/cli_reference/get_started_cli.html#installing-the-cli)
* [s2i](https://github.com/openshift/source-to-image)
* [Quay.io](https://quay.io/)

## Development
   1. Clone the repository
      ```
      $ git clone https://github.com/opendatahub-io/odh-dashboard.git
      ```

   1. Within the repo context, install project dependencies
      ```
      $ cd odh-dashboard && yarn
      ```

### Serve development content
This is the default context for running a local UI

  ```
  $ yarn start
  ```

For in-depth local run guidance review the [contribution guidelines](./CONTRIBUTING.md#Serving%20Content)


### Testing
Run the tests.

  ```
  $ yarn test
  ```

For in-depth testing guidance review the [contribution guidelines](./CONTRIBUTING.md#Testing)

## Contributing
Contributing encompasses [repository specific requirements](./CONTRIBUTING.md)
