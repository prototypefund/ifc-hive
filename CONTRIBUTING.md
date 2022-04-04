# Contributing

## Commit-Messages

Please use the [.git-commit-template.txt](.git-commit-template.txt) and follow the instructions mentioned
in that file.

Add the following template to your local git configuration for the project like
this:
```bash
cd <project-root>
git config commit.template .gitlab/git-commit-template.txt
```
Now on each commit this template should automatically be presented.


```
# <tag> (<scope>) #<issue>: (If applied, this commit will...) <subject> (Max 72 char)
# feat (login) #13: Implement automated commit messages...............|

# --- BODY ---


# --- FOOTER ---

# Footer Breaking Changes
# BREAKING CHANGE
# close or reference issues,
# closes #12
# see also #13, #23
# reviews by: <name>


# --- COMMIT END ---
# Tag can be
#    feat     (new feature)
#    fix      (bug fix)
#    refactor (refactoring code)
#    style    (formatting, missing semi colons, etc; no code change)
#    doc      (changes to documentation)
#    chore
#    devops
#    test     (adding or refactoring tests; no production code change)
#    version  (version bump/new release; no production code change)
#    hack     (Temporary fix to make things move forward; please avoid it)
#    WIP      (Work In Progress; for intermediate commits to keep patches reasonably sized)
#    defaults (changes default options)

# Note: Multiple tags can be combined, e.g. [fix][jsr292] Fix issue X with methodhandles
# --------------------
# Remember to:
#   * Capitalize the subject line
#   * Use the imperative mood in the subject line
#   * Do not end the subject line with a period
#   * Separate subject from body with a blank line
#   * Use the body to explain what and why vs. how
#   * Mention BREAKING CHANGES if applicable
#   * signify BREAKING CHANGES with exclamation mark, e.g. feat! (api) #132: Change endpoint
```

## Issues and requirements management

- Core requirements are managed in the form of user stories. Keep it as simple
    as possible and provide as much information and context as necessary (e.g.
    acceptance criteria, edge cases, example data, visual sketches etc.)
- We handle all requirements with Gitlab issues.
- Discussions of requirements should take place in the comment section of the
    respective issue.

## Design Documents

Implementations beyond bug fixes and trival changes should be sketched in a
design document. Consider if a design doc is necessary, if you are positiv,
please use the [google design document
template](https://docs.google.com/document/d/1pgMutdDasJb6eN6yK6M95JM8gQ16IKacxxhPXgeL9WY/edit)
for orientation. Design Docs are handled in the wiki section of this Gitlab
project.

## Testing and Code Coverage

We strive for 100% code coverage of the application layer (API) with with
integration tests. Middleware and libraries should also be covered 100% by unit
tests.

## Source Code Management

For the prototyp development we have decided for a mono-repo, i.e. all
components including documentation are part of one single git-repository. With a
growing infrastructure and growing complexiy that may change in the future. For
the time being we want to keep things as simple as possible.

## Contract Driven Design between components

In order to ensure integrity we apply a contract driven design: 

1. The API integration tests serve as the contract between client and API
   implementation. Most if no all requirements of the client should be described
   by a test case. Make sure to cover criical edge-cases as well.
2. Each API Endpoint has a current version


## Definition of Done

- [  ] design doc is written, discussed and approved (if applicable)
- [  ] requirement is implemented
- [  ] Merge request to master branch is successfully completed
- [  ] Feature is deployed to staging instance of the platform
- [  ] Code follows project guidelines, is easy to read and is well documented
- [  ] acceptance criteria are met (if applicable)
- [  ] API end point is fully documented
- [  ] Technical documentation is written
- [  ] Code is covered with Unit-Tests
- [  ] Code is covered with Integration Tests (API-Test, End-to-End Test)
- [  ] All tests pass in CI/CD
- [  ] No linting errors are detected

## Sprints and Sprint Planning

We apply our version of SCRUM with a sprint length of two weeks. Each sprints
starts with a joint spring planning and concludes with a joint sprint
evaluation.

# Linting

Please respect the linting rules. For one and the same language we apply the
same linting rules in all componentes, e.g. Javascript / Typescript have the
same linting rules in front-end and back-end.
