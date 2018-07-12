Stages are groups of jobs run in parallel, if any job in a stage fails, next stage is not started.

In travis, each job starts in clean VM. (hint: use cache)
This means that we need to store the artifacts of each job and load the artifacts in the next stage.

Stages:
1) Build components
    - create a job for each group of components. Start by separating out one component from the rest, in the end 
    each component should be built separately
    - only build those that have changes
    - store containers (e.g. push tags: dcatno/${component}:build-${pr} dcatno/${i}:${toEnvironment}_latest)
2) Test components
    - only the ones that have changed
3) Integration test 
    - pull latest from components that have not changed and recent builds from what has changed.
    - on success tag everything as tested
4) Deploy to DockerHub
    (it is also possible to retag using REST api, without pulling https://gitlab.com/gitlab-org/gitlab-ce/issues/17966)
    - pull all with tag based on fingerprint
    - tag all containers with ut1_latest and date
    - git-tag develop branch with moved ut1_latest and date.



how to build development branch without a PR?
- we could run through all steps and shortcut them if they are already done.
- the problem really is that there is no easy way to link commit in develop branch to PR (that was built and tested)

how to clean up from canceled PRs?
- cron job for cleanup containers