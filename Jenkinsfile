stage('Build') {
    steps {
        script {
            try {
                // Build steps
                currentBuild.result = 'SUCCESS'
                sendToTelegram("✅ Build Succeeded for Build #${BUILD_NUMBER}")
            } catch (Exception e) {
                // Handle build failure
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
                // Test steps
                sendToTelegram("🧪 Testing Status: ${status} for Build #${BUILD_NUMBER}")
            } catch (Exception e) {
                // Handle test failure
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
                // Deploy steps
                sendToTelegram("🚀 Deployment Status: ${status} for Build #${BUILD_NUMBER}")
            } catch (Exception e) {
                // Handle deployment failure
                sendToTelegram("❌ Deployment Failed for Build #${BUILD_NUMBER}\nError Message:\n${e.message}")
                throw e
            }
        }
    }
}
