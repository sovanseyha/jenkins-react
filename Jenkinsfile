pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    environment {
        MY_IMAGE = 'seiha-react-img'
        DOCKER_REGISTRY = 'sovanseyha'
        CONTAINER_NAME = 'jenkins-container' // Specify the name of your container
        // Add your Telegram credentials
        TELEGRAM_BOT_TOKEN = credentials('telegramToken')
        TELEGRAM_CHAT_ID = credentials('telegramChatid')
    }
    stages {
        stage('Build') {
            steps {
                script {
                    try {
                        sh "whoami"
                        sh "npm install"
                        sh "docker build -t ${MY_IMAGE} ."
                        currentBuild.result = 'SUCCESS'
                        sendToTelegram("✅ Build Succeeded for Build #${BUILD_NUMBER}")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        def errorLog = sh(script: 'cat ${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_NUMBER}/log', returnStdout: true)
                        sendToTelegram("❌ Build Failed for Build #${BUILD_NUMBER}\nError Message:\n${errorLog}")
                    }
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeed' : 'Failed'
                    sendToTelegram("🧪 Testing Status: ${status} for Build #${BUILD_NUMBER}")
                }
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
                    def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeed' : 'Failed'
                    sendToTelegram("🚀 Deployment Status: ${status} for Build #${BUILD_NUMBER}")
                }
            }
        }
    }
}

def sendToTelegram(message) {
    script {
        sh """
            curl -s -X POST https://api.telegram.org/bot\${TELEGRAM_BOT_TOKEN}/sendMessage -d chat_id=\${TELEGRAM_CHAT_ID} -d parse_mode="HTML" -d text="${message}"
        """
    }
}
