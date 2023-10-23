pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    environment {
        MY_IMAGE = 'seiha-react-img'
        DOCKER_REGISTRY = 'sovanseyha'
        CONTAINER_NAME = 'jenkins-container'
        TELEGRAM_BOT_TOKEN = credentials('telegramToken')
        TELEGRAM_CHAT_ID = credentials('telegramChatid')
    }
    stages {
        stage('Build') {
            steps {
                script {
                    def TELEGRAM_MESSAGE = '' // Initialize a local variable for the message

                    try {
                        sh "whoami"
                        sh "npm install"
                        sh "docker build -t ${MY_IMAGE} ."
                        currentBuild.result = 'SUCCESS'
                        // Append to the message for successful stages
                        TELEGRAM_MESSAGE += "✅ Build Succeeded for Build #${BUILD_NUMBER}\n"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        def errorLog = sh(script: 'cat ${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_NUMBER}/log', returnStdout: true)
                        // Send a separate message for the failed stage
                        sendToTelegram("❌ Build Failed for Build #${BUILD_NUMBER}\nError Message:\n${errorLog}")
                        throw e // Re-throw the exception to stop the pipeline
                    }
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    def TELEGRAM_MESSAGE = '' // Initialize a local variable for the message

                    try {
                        def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeed' : 'Failed'
                        // Append to the message for successful stages
                        TELEGRAM_MESSAGE += "🧪 Testing Status: ${status} for Build #${BUILD_NUMBER}\n"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        // Send a separate message for the failed stage
                        sendToTelegram("❌ Testing Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.message}")
                        throw e
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    def TELEGRAM_MESSAGE = '' // Initialize a local variable for the message

                    try {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub_id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            def existImageID = sh(script: 'docker ps -aq -f name="${MY_IMAGE}"', returnStdout: true)
                            echo "ExistImageID:${existImageID}"
                            if (existImageID) {
                                echo '${existImageID} is removing ...'
                                sh 'docker rm -f ${MY_IMAGE}'
                            } else {
                                echo 'No existing container'
                            }
                            sh "docker run -d -p 3001:80 --name ${MY_IMAGE} -e DOCKER_USERNAME=$DOCKER_USERNAME -e DOCKER_PASSWORD=$DOCKER_PASSWORD ${MY_IMAGE}"
                        }
                        def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeed' : 'Failed'
                        // Append to the message for successful stages
                        TELEGRAM_MESSAGE += "🚀 Deployment Status: ${status} for Build #${BUILD_NUMBER}\n"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        // Send a separate message for the failed stage
                        sendToTelegram("❌ Deployment Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.message}")
                        throw e
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                // Send the aggregated message to Telegram
                sendToTelegram(TELEGRAM_MESSAGE)
                emailext body: 'Check console output at $BUILD_URL to view the results.', subject: '${PROJECT_NAME} - Build #${BUILD_NUMBER} - $BUILD_STATUS', to: 'yan.sovanseyha@gmail.com'
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
