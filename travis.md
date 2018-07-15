Stages are groups of jobs run in parallel, if any job in a stage fails, next stage is not started.

In travis, each job starts in clean VM. 
Cache can be used (http://atodorov.org/blog/2017/08/07/faster-travis-ci-tests-with-docker-cache/)
This means that we need to store the artifacts of each job and load the artifacts in the next stage.
In our case, artifacts are docker images.

Stages:
1) Build & test components
    - create a job for each group of components. Start by separating out one component from the rest, in the end 
    each component should be built separately
    - if PR, then only build those that have changes (https://github.com/sagikazarmark/travis-monorepo-demo/blob/master/.travis.yml)
    - only build if content-hash image is not found yet.
    - store containers (e.g. push tags: dcatno/${component}:build-componenthash-${component-hash})
2) Test components (eventually unit tests should be part of each component build, until moved to build, but initally )
    - if PR only the ones that have changed, else all
3) Integration test 
    - pull latest from components that have not changed and recent builds from what has changed.
    - on success tag everything as tested dcatno/${component}:integration-tested-systemhash-${system-hash}
4) Deploy to DockerHub
    (it is also possible to retag using REST api, without pulling https://gitlab.com/gitlab-org/gitlab-ce/issues/17966)
    - pull all with tag based on tested system hash
    - tag all containers with ut1_latest and date
    - git-tag develop branch with moved ut1_latest and date.
    - delete integration-tested images.



how to build development branch without a PR?
- we could run through all steps and shortcut them if they are already done.
- the problem really is that there is no easy way to link commit in develop branch to PR (that was built and tested)

how to clean up from canceled PRs?
- cron job for cleanup containers
component-build-componenthash-XX can be deleted as soon as there is newer.

component-tested-system-content should be deleted as soon as there is respective deploy is done. 
any leftovere integration-tested-systemhash images can be removed when there is no deploy process going on. 

deleting tags is rather complicated:
https://github.com/docker/hub-feedback/issues/496
https://docs.docker.com/registry/spec/api/#deleting-an-image



Tools needed:
 - calculate component hash
 - calculate integration hash (git ls-files| git hash-object --stdin-paths|git hash-object --stdin)
 - check if tag exists in hub (=component is built or system is tested)
 - delete tag from hub
 - check if project has PR commit-range affects component (is there need to build component)

Performance baseline
 currently we use three triggers for travis jobs: pull-request, develop-push and daily cron
 PR total ~17-23 min e.g. https://travis-ci.org/Informasjonsforvaltning/fdk/builds/396760150
 develop total ~30 min e.g. https://travis-ci.org/Informasjonsforvaltning/fdk/builds/396786502
 cron total~50 min e.g. https://travis-ci.org/Informasjonsforvaltning/fdk/builds/398158236
 critical measure is PR+develop,
 
 Breakdown: total 53 min
 - pull request 23 min
  - Build 9 min
  - test java 6 min
  - test registration-react 4,5 min
  - test registration-react 4 min
 - develop 30
  - Build 9 min
  - test java 6 min
  - test registration-react 2,5 min (why faster??)
  - test registration-react 2 min (why faster?)
  - deploy 12 min
  
Implementation plan:

MVP steps, each commit is deployable adds value

1) implement null build (PR-case, diff) case (non-component files are not build) 
 NB! Skip this step was later skipped, since it does not work for other pull request base than "develop" and solution 2 is very quick)
 - condition for build step to run if changes in list of components for build project
 - value:(0) null-build (change outside apps) cuts 2*8,5 minutes from Build stage.
2) [x] skip component rebuild (push develop branch trigger needs it since diff is not available) 
 - push tags of component builds
 - skip build components if already built
 - value: (15 min) add ~4 min to first build, but short-circuit the develop build and deploy job.
3) [x] integration step (no need for rebuild on deploy)
 - pull latest & built tags and push integration-tested tags.
 - skip test && integration if integration tag exists
 - deploy step pulls integration tags (instead of build) and pushes deploy tags
 - value: (10 min) add 4 mins for pushing integration images, but win on skipping test jobs on
4) separate search build job from the rest
 - remove search from maven build 
 - add search job in build stage
 - update filters
 - value (30 min for search)
5) revise search build process
 - test before build
 - drop search test task
 - cache node_modules (takes 70 seconds in search)
 - value(5 min for test, 3 min for node_modules)
 
After these steps, PR and develop of search should be much faster:
 - PR build step only builds search
 - test stage tasks are removed entirely
 - integration   

next steps
 - repeat 4 and 5 for registration-react
 - build java with tests so we can drop the test stage
 - split java builds
 - build frontend in travis instead of container.
 - separate server build from frontend build
 - use remote tagging instead of pull & push - https://stackoverflow.com/questions/37134929/how-to-tag-image-in-docker-registry-v2#
 - build javascript client app outside the container (NB client-side app compilation is not platform dependent!), this avoids costly npm install inside the contaiener.

Limitations discovered so far:
 - Each component will spawn a separate build job for checking if it is needed to be built. 
   It seems efficient to split javascript and java, but having all 12 container builds as separate build processes can be counterproductive
   Each job takes minimum ~30 seconds (boot and git pull). It is limitation of travis that the jobs cannot be initiated by script.
   The solution could be 
   - have a single build step that builds containers selectively.
   - encode the affected applications in the commit message (this is available for travis conditions)
   - use something else than travis
 - Build and test stage artifacts are mixed with final deploy artifacts in docker hub, hard to clean up.
    They should not be available outside the build process. 
    Consider other artifacts than docker images or having seprate docker registry for temporary artifacts