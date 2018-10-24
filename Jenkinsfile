node {
   stage("build") {
  sh '''
  echo Variables from shell:
  echo ref $ref
  echo before $before
  echo pusher $pusher
  echo url $url
  echo
  echo $body
  echo
  '''
  git([url: $url, branch: $ref])
}
  stage("checkout take 2") {
    git([url: $url, branch: $after])
  }
}
