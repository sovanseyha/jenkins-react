pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }

    environment {
        DOCKER_REGISTRY = 'sovanseyha'
        IMAGE_NAME = 'react-jenkin'
        CONTAINER_NAME = 'my-container' // Specify the name of your container
    }

    stages {
        stage('Build') {
            steps {
                sh 'whoami'
                sh 'npm install'
                // sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                // sh 'npm run test'
                echo "Test"
                sh "echo IMAGE_NAME is ${env.IMAGE_NAME}" 
            }
        }
        stage('Check for Existing Container') {
            steps {
                script {
                    def containerId = sh(script: "docker ps -a --filter name=${env.CONTAINER_NAME} -q", returnStdout: true).trim()
                    sh "echo containerId is ${containerId}" 
                    sh "whoami"
                    if (containerId) {
                        sh "docker stop ${containerId}"
                        sh "docker rm ${containerId}"
                    } else {
                        sh "echo No existing container to remove"
                    }
                }
            }
        }
        stage('Build Image') {
            steps {
                script {
                    def buildNumber = currentBuild.number
                    def imageTag = "${IMAGE_NAME}:${buildNumber}"
                    sh "docker build -t ${DOCKER_REGISTRY}/${imageTag} ."

                    withCredentials([usernamePassword(credentialsId: 'dockerhub_id',
                            passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
                        sh "docker push ${DOCKER_REGISTRY}/${imageTag}"
                    }
                }
            }
        }
        stage('Test') {
            steps {
                echo "Testing ~~~~~~~~~~~~~~~"
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // Retrieve Docker credentials from Jenkins
                    withCredentials([usernamePassword(credentialsId: 'dockerhub_id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        def existImageID = sh(script: 'docker ps -aq -f name="${MY_IMAGE}"', returnStdout: true)
                        echo "ExistImageID:${existImageID}"
                        if (existImageID) {
                            echo '${existImageID} is removing ...'
                            sh 'docker rm -f ${MY_IMAGE}'
                        } else {
                            echo 'No existing container'
                        }
                        // Use Docker credentials in the 'docker run' command
                        sh "docker run -d -p 3001:80 --name ${MY_IMAGE} -e DOCKER_USERNAME=$DOCKER_USERNAME -e DOCKER_PASSWORD=$DOCKER_PASSWORD ${MY_IMAGE}"
                    }
                }
            }
        }
    }
}