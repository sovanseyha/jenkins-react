pipeline {
    agent any
    tools {
        nodejs 'nodejs' 
    }
    stages {
        stage('Build') {
            steps {
                withCredentials([usernamePassword(credentialsId: '86f466ab-0366-4461-8d22-cc40fb1d489b',
                        passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                    script {
                        // Build the Docker image
                        sh 'docker build -t sovanseyha/myweb .'

                        // Log in to Docker Hub using credentials
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"

                        // Push the Docker image to Docker Hub
                        sh 'docker push sovanseyha/myweb'
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                // Build and deploy using Docker Compose
                sh 'docker compose build'
                sh 'docker compose up -d'
            }
        }
    }
}
