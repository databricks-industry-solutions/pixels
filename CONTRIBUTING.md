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
