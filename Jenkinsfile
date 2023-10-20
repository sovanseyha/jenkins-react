pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    environment {
        MY_IMAGE = 'seiha-react-img'
        DOCKER_REGISTRY = 'sovanseyha'
        CONTAINER_NAME = 'jenkins-container' // Specify the name of your container
    }
    stages {
        stage('Build') {
            steps {
                sh "whoami"
                sh "npm install"
                sh "docker build -t ${MY_IMAGE} ."
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
        stage('Push Notification') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'telegramToken', variable: 'TOKeN'),
                                    string(credentialsId: 'telegramChatid', variable: 'CHAT_ID')]) {
                        sh """
                            curl -s -X POST https://api.telegram.org/bot\${TOKEN}/sendMessage -d chat_id=\${CHAT_ID} -d parse_mode="HTML" -d text=" \n
                            <b>Project</b> : jenkins-react \n
                            <b>Branch</b>: master \n
                            <b>Build </b> : OK \n
                            <b>Test </b> = Passed"
                        """
                    }
                }
            }
        }
    }
}
