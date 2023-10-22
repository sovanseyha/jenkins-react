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
                    try {
                        // Add your test commands here
                        // For example:
                        sh "npm test"
                        
                        def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeed' : 'Failed'
                        sendToTelegram("🧪 Testing Succeeded for Build #${BUILD_NUMBER}\nStatus: ${status}")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        
                        // Capture a specific error from the console log
                        def errorLog = sh(
                            script: 'cat ${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_NUMBER}/log | grep "SpecificTestErrorPattern"',
                            returnStdout: true
                        )
                        
                        if (errorLog) {
                            sendToTelegram("❌ Test Failed for Build #${BUILD_NUMBER}\nSpecific Test Error:\n${errorLog}")
                        } else {
                            sendToTelegram("❌ Test Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.getMessage()}")
                        }
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    try {
                        // Add your deployment commands here
                        // For example:
                        sh "docker run -d -p 3001:80 --name ${MY_IMAGE} -e DOCKER_USERNAME=$DCKER_USERNAME -e DOCKER_PASSWORD=$DOCKER_PASSWORD ${MY_IMAGE}"
                        
                        def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeed' : 'Failed'
                        sendToTelegram("🚀 Deployment Succeeded for Build #${BUILD_NUMBER}\nStatus: ${status}")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        
                        // Capture a specific error from the console log
                        def errorLog = sh(
                            script: 'cat ${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_NUMBER}/log | grep "SpecificDeployErrorPattern"',
                            returnStdout: true
                        )
                        
                        if (errorLog) {
                            sendToTelegram("❌ Deployment Failed for Build #${BUILD_NUMBER}\nSpecific Deploy Error:\n${errorLog}")
                        } else {
                            sendToTelegram("❌ Deployment Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.getMessage()}")
                        }
                    }
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
