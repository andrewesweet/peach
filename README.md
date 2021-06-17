# Peach - A hacky way to authenticate a GitHub workflow run

**Problem**: You have super secret things that you want to tell a GitHub workflow run that you don't want 
to put into  GitHub Secrets.

**~~Solution~~Hack**: Authenticate your run against an instance of a trusted service. The caller provides
the run ID and the credentials provided by GitHub that allow it to upload artifacts, something that can 
only be done using these credentials. The service uploads an artifact, proving the caller knows an intimate 
secrets known only to the executing run, and returns the super secrets things.

## Implementation
A GitHub Action (/action), and a Cloud Run Service (/service).

## Build Instructions
1. [Install gcloud](https://cloud.google.com/sdk/docs/install).
1. Authorise gcloud to access GCP via [gcloud auth login](https://cloud.google.com/sdk/gcloud/reference/auth/login) or 
  [gcloud auth activate-service-account](https://cloud.google.com/sdk/gcloud/reference/auth/activate-service-account).
1. Register gcloud as a [Docker credential helper](https://cloud.google.com/sdk/gcloud/reference/auth/configure-docker).
1. Set the environment variable `GCP_PROJECT_ID` to your GCP project ID.
1. Set `GCP_PROJECT_ID` as the default project in gcloud (`gcloud config set project $GCP_PROJECT_ID`).
1. Enable the Cloud Run API on your project (`gcloud services enable run.googleapis.com`).
1. [Install node and npm](https://nodejs.org/en/download/package-manager/).
1. Run `npm run all` in the `action` and `service` directories.