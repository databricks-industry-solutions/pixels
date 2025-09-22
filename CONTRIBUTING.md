We happily welcome contributions to this project. We use GitHub Issues to track community reported issues and GitHub Pull Requests for accepting changes pursuant to a CLA.


## Setup for Development

### configure databricks sdk and cli authentication
```bash
~/.databrickscfg:
[DEFAULT]
host             = https://<workspace>.cloud.databricks.com
jobs-api-version = 2.0
cluster_id       = 9999-999999-dcbte59m
token            = dapifdeadbeef.......
```

### setup and activate python environment
```bash
pyenv virtualenv pixels
pyenv activate pixels
```

### get source code
```bash
git clone https://github.com/databricks-industry-solutions/pixels
cd pixels
```

### install dependencies
```bash
make dev
```

### verify
```bash
make test
```

### check style
```bash
make style
```

## Standards
- Document your module requirements in terms of compute (Serverless, Classic, Shared, Dedicated, DBR version, ML Runtime, GPU,...)
- If you include a new library in your notebook or module, please ensure that is documented in the PR with changes to the LICENSE section of the README.md file
- Avoid embedding model weights files directly, install build a notebook or module to download the model weights.
- To demo a new capability, use a sub-folder within `/notebooks/` the folder
- To productionize a capability, build a Spark ML transformer type class under the `dbx` folder.
- We will review your contribution in terms of security, ease of use, performance, scalability and utility.
- Include unit tests with your contribution.
- If there is an important open source data set required to demonstrate a capability, out of box, please let us know, we may be able to put it into our S3 bucket.
- Each contributor will be required to sign a Contributor License Agreement (CLA) to protect yourself and the project.
