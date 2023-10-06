pipeline {
    agent any
    tools {
        nodejs 'nodejs' 
    }
    stages {
        stage('Build') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub_id',
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
