pipeline {
    agent any  // Runs on any available Jenkins agent

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/mourrrya/compare-price-backend'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'  // Install Node.js dependencies
            }
        }

        // stage('Run Tests') {
        //     steps {
        //         sh 'npm test'  // Run tests (if you have them)
        //     }
        // }
    }
}
