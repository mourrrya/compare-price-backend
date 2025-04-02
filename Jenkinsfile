pipeline {
    agent any  // Runs on any available Jenkins agent

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/mourrrya/compare-price-backend'
            }
        }

        stage('Check Node Version') {
            steps {
                sh 'export NVM_DIR="$HOME/.nvm" && source $NVM_DIR/nvm.sh && node -v'
                sh 'export NVM_DIR="$HOME/.nvm" && source $NVM_DIR/nvm.sh && npm -v'
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
