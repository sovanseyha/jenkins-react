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
                        sh "whoami"
                        sh "npm install"
                        sh "docker build -t ${MY_IMAGE} ."
                        currentBuild.result = 'SUCCESS'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        def errorLog = sh(script: 'cat ${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_NUMBER}/log', returnStdout: true)
                        sendToTelegram("❌ Build Failed for Build #${BUILD_NUMBER}\nError Message:\n${errorLog}")
                        throw e // Re-throw the exception to stop the pipeline
                    }
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    try {
                        def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'Succeed' : 'Failed'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
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
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        currentBuild.description = e.toString()
                        sendToTelegram("❌ Deployment Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.message}")
                        throw e
                    }
                }
            }
        }
        stage('Static Analysis') {
            steps {
                node {
                    withSonarQubeEnv("${SONARSERVER}") {
                        sh 'mvn clean package sonar:sonar'
                        echo 'Static Analysis Completed'
                    }
                }
            }
        }
        stage("Quality Gate") {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    def qg = waitForQualityGate()
                    if (qg.status != 'OK') {
                        error "Pipeline aborted due to quality gate failure: ${qg.status}"
                    }
                }
                echo 'Quality Gate Passed'
            }
        }
    }
    post {
        always {
            emailext body: 'Check console output at $BUILD_URL to view the results.', subject: '${PROJECT_NAME} - Build #${BUILD_NUMBER} - $BUILD_STATUS', to: 'yan.sovanseyha@gmail.com'
            script {
                if (currentBuild.resultIsBetterOrEqualTo('SUCCESS')) {
                    sendToTelegram("✅ Pipeline Succeeded for Build #${BUILD_NUMBER}")
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
