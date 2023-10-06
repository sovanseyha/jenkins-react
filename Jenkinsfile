pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    environment {
        MY_IMAGE = 'myreact-img'
        DOCKER_HUB_CREDENTIALS_ID = 'dockerhub_id' // Replace with your Docker Hub credentials ID
    }
    stages {
        stage('Build') {
            steps {
                // Retrieve Docker Hub credentials from Jenkins
                withCredentials([usernamePassword(credentialsId: dockerhub_id, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    script {
                        // Build the Docker image
                        sh "docker build -t ${MY_IMAGE} ."

                        // Log in to Docker Hub using credentials
                        sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin"

                        // Push the Docker image to Docker Hub
                        sh "docker push ${MY_IMAGE}"
                    }
                }
            }
        }
        stage('Test') {
            steps {
                echo "Testing .... dg mix teh"
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // Check if a container with the same name exists
                    def existImageID = sh(script: 'docker ps -aq -f name="${MY_IMAGE}"', returnStdout: true)
                    echo "ExistImageID:${existImageID}"
                    if (existImageID) {
                        echo '${existImageID} is removing ...'
                        sh 'docker rm -f ${MY_IMAGE}'
                    } else {
                        echo 'No existing container'
                    }
                }
                // Run the Docker container with port mapping
                sh "docker run -d -p 3001:80 --name ${MY_IMAGE} ${MY_IMAGE}"
            }
        }
    }
}
