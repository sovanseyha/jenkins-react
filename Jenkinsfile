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
        combinedMessage = '' // Initialize an empty combined message
    }
    stages {
        stage('Build') {
            steps {
                script {
                    try {
                        // Build your code here
                        sh "whoami"
                        sh "npm install"
                        sh "docker build -t ${MY_IMAGE} ."
                        currentBuild.result = 'SUCCESS'
                        def buildMessage = "✅ Build Succeeded for Build #${BUILD_NUMBER}"
                        combinedMessage += "\n${buildMessage}"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        def errorLog = sh(script: 'cat ${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_NUMBER}/log', returnStdout: true)
                        def errorMessage = "❌ Build Failed for Build #${BUILD_NUMBER}\nError Message:\n${errorLog}"
                        combinedMessage += "\n${errorMessage}"
                        sendToTelegram(combinedMessage) // Send the message now
                        throw e // Re-throw the exception to stop the pipeline
                    }
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    try {
                        // Perform testing here
                        def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeed' : 'Failed'
                        def testMessage = "🧪 Testing Status: ${status} for Build #${BUILD_NUMBER}"
                        combinedMessage += "\n${testMessage}"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        def errorMessage = "❌ Testing Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.message}"
                        combinedMessage += "\n${errorMessage}"
                        sendToTelegram(combinedMessage) // Send the message now
                        throw e
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    try {
                        // Deploy your application here
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
                        def deployMessage = "🚀 Deployment Status: ${status} for Build #${BUILD_NUMBER}"
                        combinedMessage += "\n${deployMessage}"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        def errorMessage = "❌ Deployment Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.message}"
                        combinedMessage += "\n${errorMessage}"
                        sendToTelegram(combinedMessage) // Send the message now
                        throw e
                    }
                }
            }
        }
    }
    post {
        always {
            emailext body: "Check console output at $BUILD_URL to view the results.", subject: "${PROJECT_NAME} - Build #${BUILD_NUMBER} - $BUILD_STATUS", to: 'yan.sovanseyha@gmail.com'
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
