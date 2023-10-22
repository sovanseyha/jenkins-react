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

                    // Capture a specific error from the console log for the 'Test' stage
                    def testErrorLog = sh(
                        script: 'cat ${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_NUMBER}/log | grep "SpecificTestErrorPattern"',
                        returnStdout: true
                    )

                    if (testErrorLog) {
                        sendToTelegram("❌ Test Failed for Build #${BUILD_NUMBER}\nSpecific Test Error:\n${testErrorLog}")
                    } else {
                        sendToTelegram("🧪 Testing Status: ${status} for Build #${BULD_NUMBER}")
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // Retrieve Docker credentials from Jenkins
                    withCredentials([usernamePasswor(credentialsId: 'dockerhub_id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
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

                    // Capture a specific error from the console log for the 'Deploy' stage
                    def deployErrorLog = sh(
                        script: 'cat ${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_NUMBER}/log | grep "SpecificDeployErrorPattern"',
                        returnStdout: true
                    )

                    if (deployErrorLog) {
                        sendToTelegram("❌ Deployment Failed for Build #${BUILD_NUMBER}\nSpecific Deploy Error:\n${deployErrorLog}")
                    } else {
                        sendToTelegram("🚀 Deployment Status: ${status} for Build #${BUILD_NUMBER}")
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
