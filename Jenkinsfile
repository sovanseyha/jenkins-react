pipeline {
    agent any
    tools {
        nodejs 'nodejs' // Make sure 'nodejs' matches your configured Node.js tool name
    }

    environment {
        DOCKER_REGISTRY = 'sovanseyha'
        IMAGE_NAME = 'react-jenkins'
        CONTAINER_NAME = 'react-jenkins-container'
        MY_IMAGE = "${DOCKER_REGISTRY}/${IMAGE_NAME}:${currentBuild.number}"
    }

    stages {
        stage('Build') {
            steps {
                sh 'whoami'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
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
                    def imageTag = "${DOCKER_REGISTRY}/${IMAGE_NAME}:${currentBuild.number}"
                    sh "docker build -t ${imageTag} ."

                    withCredentials([usernamePassword(credentialsId: 'dockerhub_id',
                            passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
                        sh "docker push ${imageTag}"
                    }
                }
            }
        }
        stage('Test2') {
            steps {
                echo "Testing ~~~~~~~~~~~~~~~"
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // Retrieve Docker credentials from Jenkins
                    withCredentials([usernamePassword(credentialsId: 'dockerhub_id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        def existImageID = sh(script: "docker ps -aq -f name=${MY_IMAGE}", returnStdout: true).trim()
                        echo "ExistImageID:${existImageID}"
                        if (existImageID) {
                            echo "${existImageID} is removing ..."
                            sh "docker rm -f ${MY_IMAGE}"
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
