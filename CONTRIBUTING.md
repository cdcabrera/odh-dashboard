# Contributing

Contributing encompasses repository specific requirements.

## Install
Before developing you'll need to install:
* [NodeJS and NPM](https://nodejs.org/)
* [OpenShift CLI](https://docs.openshift.com/enterprise/3.2/cli_reference/get_started_cli.html#installing-the-cli)
* [s2i](https://github.com/openshift/source-to-image)
* and have access to [Quay.io](https://quay.io/)

## Writing code
### Running locally
Development for both "frontend" and "backend" can be done while running
```
$ npm run dev
```

#### Give your dev env access
To give your dev environment access to the ODH configuration, log in to the OpenShift cluster and set the project to the location of the ODH installation
```shell script
$ oc login https://api.my-openshift-cluster.com:6443 -u kubeadmin -p my-password
```
or log in using the makefile and `.env.local` settings
```.env.local
OC_URL=https://specify.in.env:6443
OC_PROJECT=opendatahub
OC_USER=kubeadmin
OC_PASSWORD=my-password
```

```shell
$ make login
```
or
```
$ npm run make:login
```


## Debugging and Testing
### Basic testing
To run the bare-bones linting checks run
  ```
  $ npm run test
  ```

You can apply lint auto-fixes with 
  ```
  $ npm run test:fix
  ```

## Build
### dotenv files
The current build leverages `dotenv`, or `.env*`, files to apply environment build configuration.

#### Applied dotenv files
dotenv files applied to the root of this project...
- `.env`, basic settings, utilized by both "frontend" and "backend"
- `.env.local`, gitignored settings, utilized by both "frontend" and "backend"
- `.env.development`, utilized by both "frontend" and "backend". Its use can be seen with the NPM script `$ npm run dev`
- `.env.development.local`, utilized by both "frontend" and "backend". Its use can be seen with the NPM script `$ npm run dev`
- `.env.production`, is primarily used by the "frontend", minimally used by the "backend". Its use can be seen with the NPM script `$ npm run start`
- `.env.production.local`, is primarily used by the "frontend", minimally used by the "backend". Its use can be seen with the NPM script `$ npm run start`
- `.env.test`, is primarily used by the "frontend", minimally used by the "backend" during testing
- `.env.test.local`, is primarily used by the "frontend", minimally used by the "backend" during testing

There are build processes in place that leverage the `.env*.local` files, these files are actively applied in our `.gitignore` in order to avoid build conflicts. **They should continue to remain ignored, and not be added to the repository.**

#### Available parameters
The dotenv files have access to default settings grouped by facet; frontend, backend, build

...

## Deploy
Add the dashboard component and the repo to the ODH instance kfdef yaml.
```yaml
apiVersion: kfdef.apps.kubeflow.org/v1
kind: KfDef
spec:
  applications:
    # ... other components ...

    # Add Dashboard Component
    - kustomizeConfig:
        repoRef:
          name: odh-dashboard
          path: install/odh/base
      name: odh-dashboard
  repos:
    # ... other repos ...

    # Add Dashboard Dev Repo 
    - name: odh-dashboard
      uri: 'https://github.com/opendatahub-io/odh-dashboard/tarball/master'

  version: vX.Y.Z
```

### Building
Customize `.env.local` file to image and source information as desired. `npm` and the `s2i` command line tool is required.

```.env.local
IMAGE_REPOSITORY=quay.io/my-org/odh-dashboard:latest
SOURCE_REPOSITORY_URL=git@github.com:my-org/odh-dashboard.git
SOURCE_REPOSITORY_REF=my-branch
```

```shell
$ make build
```
or
```
$ npm run make:build
```

### Pushing the image
Customize `.env.local` file to image information and container builder.

```.env.local
CONTAINER_BUILDER=docker
IMAGE_REPOSITORY=quay.io/my-org/odh-dashboard:latest
```

```shell
$ make push
```
or
```
$ npm run make:push
```

### Deploying your image
Customize `.env.local` file for deployment information.  Required. The OpenShift, `oc`, command line tool is required.

First set the image to deploy to your custom image you've built in previous steps.
```.env.local
IMAGE_REPOSITORY=quay.io/my-org/odh-dashboard:latest
```

Then set your login information to deploy to your cluster.
```.env.local
OC_URL=https://specify.in.env:6443
OC_PROJECT=specify_in_.env

# user and password login
#OC_USER=specify_in_.env
#OC_PASSWORD=specify_in_.env
```
or
```.env.local
OC_URL=https://specify.in.env:6443
OC_PROJECT=specify_in_.env

# token login
OC_TOKEN=specify_in_.env
```

Now execute the deployment scripts.
```shell
$ make deploy
```
or
```
$ npm run make:deploy
```
