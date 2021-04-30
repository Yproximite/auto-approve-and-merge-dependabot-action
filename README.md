# Auto approve and merge Dependabot PR action

GitHub Action for auto-approving and auto-merging Dependabot pull requests.

This action is compatible with [GitHub-native Dependabot](https://docs.github.com/en/code-security/supply-chain-security/upgrading-from-dependabotcom-to-github-native-dependabot) which disabled
auto-merge.

## Usage

```yaml
name: Auto approve

on:
  pull_request

jobs:
  auto-approve:
    runs-on: ubuntu-latest
    steps:
      - uses: ...
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"
          update-type: 'minor'
```
