pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    environment {
        MY_IMAGE = 'seiha-react-img'
        DOCKER_REGISTRY = 'sovanseyha'
        CONTAINER_NAME = 'jenkins-container' // Specify the name of your container
    }
    stages {
        stage('Build and Test') {
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
                    }
                }
            }
        }
    }
    post {
        success {
            stage('Push Success Notification') {
                steps {
                    script {
                        withCredentials([string(credentialsId: 'telegramToken', variable: 'TOKEN'),
                                        string(credentialsId: 'telegramChatid', variable: 'CHAT_ID')]) {
                            def consoleOutput = currentBuild.rawBuild.getLog(1000) // Get the last 1000 lines of console output
                            sh """
                                curl -s -X POST https://api.telegram.org/bot\${TOKEN}/sendMessage -d chat_id=\${CHAT_ID} -d parse_mode="HTML" -d text="Jenkins Build Report:
                                <b>Project</b> : jenkins-react
                                <b>Branch</b>: master
                                <b>Build and Test Status</b>: <font color='green'>Success</font>
                                <pre>${consoleOutput}</pre>"
                            """
                        }
                    }
                }
            }
        }
        failure {
            stage('Push Failure Notification') {
                steps {
                    script {
                        withCredentials([string(credentialsId: 'telegramToken', variable: 'TOKEN'),
                                        string(credentialsId: 'telegramChatid', variable: 'CHAT_ID')]) {
                            def consoleOutput = currentBuild.rawBuild.getLog(1000) // Get the last 1000 lines of console output
                            sh """
                                curl -s -X POST https://api.telegram.org/bot\${TOKEN}/sendMessage -d chat_id=\${CHAT_ID} -d parse_mode="HTML" -d text="Jenkins Build Report:
                                <b>Project</b> : jenkins-react
                                <b>Branch</b>: master
                                <b>Build and Test Status</b>: <font color='red'>Failure</font>
                                <pre>${consoleOutput}</pre>"
                            """
                        }
                    }
                }
            }
        }
    }
}
