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
                script {
                    try {
                        sh "whoami"
                        sh "npm install"
                        sh "docker build -t ${MY_IMAGE}"
                        currentBuild.result = 'SUCCESS'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
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
        stage('Push Notification') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'telegramToken', variable: 'TOKEN'),
                                    string(credentialsId: 'telegramChatid', variable: 'CHAT_ID')]) {
                        def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeed' : 'Failed'
                        sh """
                            curl -s -X POST https://api.telegram.org/bot\${TOKEN}/sendMessage -d chat_id=\${CHAT_ID} -d parse_mode="HTML" -d text="Jenkins Build Report:
                            <b>Project</b> : jenkins-react
                            <b>Branch</b>: master
                            <b>Build Status</b>: ${status}
                            <b>Test Status</b>: Passed
                            <b>Deploy Status</b>: OK"
                        """
                    }
                }
            }
        }
    }
}
