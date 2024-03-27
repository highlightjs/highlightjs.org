# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |
version: 2
build:
  os: ubuntu-22.04
  tools:
    python: "3.10"
    # You can also specify other tool versions:
    # nodejs: "16"

# Build documentation in the docs/ directory with Sphinx
sphinx:
   configuration: docs/conf.py

# Dependencies required to build your docs
python:
   install:
   - requirements: docs/requirements.txt
## Reporting a Vulnerability

Use this section to tell people how to report a vulnerability.

Tell them where to go, how often they can expect to get an update on a
reported vulnerability, what to expect if the vulnerability is accepted or
declined, etc.
