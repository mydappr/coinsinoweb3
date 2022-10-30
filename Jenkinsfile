pipeline {
  agent any
  environment {
          treakey = credentials('treakey')
          injkey = credentials('injkey')
          opkey = credentials('opkey')
          apiKey = credentials('apiKey')
          authDomain = credentials('authDomain')
          projectId = credentials('projectId')
          storageBucket = credentials('storageBucket')
          messagingSenderId = credentials('messagingSenderId')
          appId = credentials('appId')
          measurementId = credentials('measurementId')
          jwt_secret = credentials('jwt_secret')
          startLotteryID = credentials('startLotteryID')
          closeLotteryID = credentials('closeLotteryID')
          drawLotteryID = credentials('drawLotteryID')
        }
  stages {
    stage('Build') {
      steps {
        echo 'This is the Build Stage'
        sh 'docker build -t sino .'
        echo 'Docker image built'
      }
    }

    stage('Clean') {
      steps {
        echo 'This is the Cleaning Stage'
        // sh 'docker image prune -a -f'
        // echo 'Removed all unreferenced and dangling images'
      }
    }

    stage('Deploy') {
      when {
        expression {
          currentBuild.result == null || currentBuild.result == 'SUCCESS'
        }
      }
      steps {
        echo 'This is the Deploy Stage'
        sh 'docker stack rm sino'
        sh 'envsubst < compose.yaml.example > compose.yaml'
        sh 'docker stack deploy -c compose.yaml sino'
        echo 'Deployment complete'
      }
    }

  }
}