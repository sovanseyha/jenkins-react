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
                        withCredentials([usernamePassword(credentialsId: 'dockerhub_id', usernameVariable: 'DOCKER
