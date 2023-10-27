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
        SONARSERVER = 'Sonar-Server'
    }
    stages {
        stage('Build') {
            steps {
                script {
                    try {
                        sh 'whoami'
                        sh 'npm install'
                        sh "docker build -t ${MY_IMAGE} ."
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = "Build step failed: ${e}"
                        sendToTelegram("❌ Build Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.message}")
                        throw e
                    }
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    try {
                        // Your testing steps here
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = "Testing step failed: ${e}"
                        sendToTelegram("❌ Testing Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.message}")
                        throw e
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    try {
                        // Your deployment steps here
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = "Deployment step failed: ${e}"
                        sendToTelegram("❌ Deployment Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.message}")
                        throw e
                    }
                }
            }
        }
        stage('Static Analysis') {
            steps {
                script {
                    try {
                        withSonarQubeEnv("${SONARSERVER}") {
                            sh 'mvn clean package sonar:sonar'
                        }
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = "Static analysis failed: ${e}"
                        sendToTelegram("❌ Static Analysis Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.message}")
                        throw e
                    }
                }
            }
        }
        stage('Quality Gate') {
            steps {
                script {
                    timeout(time: 1, unit: 'HOURS') {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            currentBuild.result = 'FAILURE'
                            currentBuild.description = "Quality gate check failed: ${qg.status}"
                            sendToTelegram("❌ Quality Gate Check Failed for Build #${BUILD_NUMBER}\nError Message:\nQuality gate check failed: ${qg.status}")
                            error "Quality gate check failed: ${qg.status}"
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                try {
                    if (currentBuild.resultIsBetterOrEqualTo('FAILURE')) {
                        // Clean up resources if the build has failed (e.g., Docker containers)
                        sh "docker rm -f ${MY_IMAGE}" // Remove the Docker container if it exists
                    }
                } catch (Exception e) {
                    currentBuild.result = 'FAILURE'
                    currentBuild.description = "Resource cleanup failed: ${e}"
                    sendToTelegram("❌ Resource Cleanup Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.message}")
                }
                emailext body: 'Check console output at $BUILD_URL to view the results.',
                    subject: '${PROJECT_NAME} - Build #${BUILD_NUMBER} - $BUILD_STATUS',
                    to: 'yan.sovanseyha@gmail.com'
            }
        }
    }
    post {
        success {
            script {
                sendToTelegram("✅ Pipeline Succeeded for Build #${BUILD_NUMBER}")
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
