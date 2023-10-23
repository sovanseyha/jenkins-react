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
                    try {
                        sh "whoami"
                        sh "npm install"
                        sh "docker build -t ${MY_IMAGE} ."
                        currentBuild.result = 'SUCCESS'
                        sendToTelegram("✅ Build: Succeeded\nCheck console output at $BUILD_URL to view the results.\n")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        def errorLog = sh(script: 'cat ${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_NUMBER}/log', returnStdout: true)
                        sendToTelegram("❌ Build: Failed\nError Message:\n${errorLog}\nCheck console output at $BUILD_URL for details.\n")
                        throw e
                    }
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    try {
                        def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeeded' : 'Failed'
                        sendToTelegram("🧪 Testing: ${status}\nCheck console output at $BUILD_URL to view the results.\n")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        sendToTelegram("❌ Testing: Failed\nError Message:\n${e.message}\nCheck console output at $BUILD_URL for details.\n")
                        throw e
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    try {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub_id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            def existImageID = sh(script: 'docker ps -aq -f name="${MY_IMAGE}"', returnStdout: true)
                            echo "ExistImageID: ${existImageID}"
                            if (existImageID) {
                                echo 'Removing existing container...\n'
                                sh 'docker rm -f ${MY_IMAGE}'
                            } else {
                                echo 'No existing container\n'
                            }
                            sh "docker -d -p 3001:80 --name ${MY_IMAGE} -e DOCKER_USERNAME=$DOCKER_USERNAME -e DOCKER_PASSWORD=$DOCKER_PASSWORD ${MY_IMAGE}"
                        }
                        def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeeded' : 'Failed'
                        sendToTelegram("🚀 Deployment: ${status}\nCheck console output at $BUILD_URL to view the results.\n")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        sendToTelegram("❌ Deployment: Failed\nError Message:\n${e.message}\nCheck console output at $BUILD_URL for details.\n")
                        throw e
                    }
                }
            }
        }
    }
    post {
        always {
            emailext body: 'Check console output at $BUILD_URL to view the results.', subject: "${JOB_NAME} - Build #${BUILD_NUMBER} - ${BUILD_STATUS}", to: 'yan.sovanseyha@gmail.com'
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
