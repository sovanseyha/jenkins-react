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
                        sh 'whoami'
                        sh 'npm install'
                        sh "docker build -t ${MY_IMAGE} ."
                        currentBuild.result = 'SUCCESS'
                        sendToTelegram("✅ Build Succeeded for Build #${BUILD_NUMBER}")
                    } catch (Exception e) {
                        handlePipelineFailure(e, "Build", "Failed to build the application")
                    }
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    try {
                        def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeed' : 'Failed'
                        sendToTelegram("🧪 Testing Status: ${status} for Build #${BUILD_NUMBER}")
                    } catch (Exception e) {
                        handlePipelineFailure(e, "Test", "Testing process failed")
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    try {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub_id', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            def existImageID = sh(script: 'docker ps -aq -f name="${MY_IMAGE}"', returnStdout: true).trim()
                            echo "ExistImageID: ${existImageID}"
                            if (existImageID) {
                                echo "${existImageID} is being removed..."
                                sh "docker rm -f ${MY_IMAGE}"
                            } else {
                                echo 'No existing container'
                            }
                            sh "docker run -d -p 3001:80 --name ${MY_IMAGE} -e DOCKER_USERNAME=$DOCKER_USERNAME -e DOCKER_PASSWORD=$DOCKER_PASSWORD ${MY_IMAGE}"
                        }
                        def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeed' : 'Failed'
                        sendToTelegram("🚀 Deployment Status: ${status} for Build #${BUILD_NUMBER}")
                    } catch (Exception e) {
                        handlePipelineFailure(e, "Deployment", "Deployment process failed")
                    }
                }
            }
        }
    }
    post {
        always {
            emailext body: 'Check console output at $BUILD_URL to view the results.',
            subject: "${PROJECT_NAME} - Build #${BUILD_NUMBER} - $BUILD_STATUS",
            to: 'yan.sovanseyha@gmail.com'
        }
    }
}

def handlePipelineFailure(Exception e, String stageName, String errorMessage) {
    currentBuild.result = 'FAILURE'
    currentBuild.description = e.toString()
    def errorLog = sh(script: "cat ${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_NUMBER}/log", returnStdout: true)
    sendToTelegram("❌ ${stageName} Failed for Build #${BUILD_NUMBER}\nError Message:\n${errorMessage}\nConsole Output:\n${errorLog}")
    throw e // Re-throw the exception to stop the pipeline
}

def sendToTelegram(message) {
    script {
        sh """
            curl -s -X POST https://api.telegram.org/bot\${TELEGRAM_BOT_TOKEN}/sendMessage -d chat_id=\${TELEGRAM_CHAT_ID} -d parse_mode="HTML" -d text="${message}"
        """
    }
}
