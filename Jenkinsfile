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
      }
    }

    stage('Test') {
      steps {
        echo 'This is the Testing Stage'
      }
    }

    stage('Deploy') {
      steps {
        echo 'This is the Deploy Stage'
      }
    }

  }
}