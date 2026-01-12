#!/usr/bin/env groovy

// Repository name
def repoName = 'https://github.com/nickaaronhebert/telegra-affiliate-admin-v2.git'
// Jenkins credential
def repoCred = 'github-api-token'
// Image registry
def registry = '901120114376.dkr.ecr.us-east-2.amazonaws.com'
// Image Details
def imageNamespace = 'telemd';

properties([
    disableConcurrentBuilds(),
])

// Ensure BRANCH_NAME is populated (use GIT_BRANCH if available, otherwise default to 'development')
env.BRANCH_NAME = env.BRANCH_NAME ?: (env.GIT_BRANCH?.tokenize('/')?.last() ?: 'development')

currentBuild.displayName = "#${currentBuild.number} [${env.BRANCH_NAME}]"

if (env.BRANCH_NAME == 'main') {
    ENV_KIND = 'prod'
    AGENT = 'main'
} else if (env.BRANCH_NAME == 'staging') {
      ENV_KIND = 'staging'
      AGENT = 'jenkins-agent'
} else if (env.BRANCH_NAME == 'development') {
    ENV_KIND = 'dev'
    AGENT = 'jenkins-agent'
} else {
    ENV_KIND = 'dev'
    AGENT = 'jenkins-agent'
}

timestamps {
    ansiColor('xterm') {
        node (AGENT) {
            def parentSlackMessage = notifySlack('STARTED')
            notifyDiscord('STARTED Build')
            try {
                stage('Checkout') {
                    step([$class: 'WsCleanup'])
                    checkout([
                        $class                           : 'GitSCM',
                        branches                         : [[name: env.BRANCH_NAME]],
                        doGenerateSubmoduleConfigurations: false,
                        extensions                       : [],
                        submoduleCfg                     : [],
                        userRemoteConfigs                : [[
                            credentialsId: repoCred,
                            url          : repoName
                        ]]
                    ])
                }

                stage('Setup Build Configs') {
                    withAWS(credentials: 'user-aws-rancher', region: 'us-east-2') {
                        sh """
                            aws ssm get-parameter --name /common-telegramd-v2/values.yaml --query "Parameter.Value" \
                            --output text > ./charts/common-values.yaml
                        """
                    }

                    withAWS(credentials: 'user-aws-rancher', region: 'us-east-2') {
                        sh """
                            aws ssm get-parameter --name /${ENV_KIND}/telegra-affiliate-admin-v2/values.yaml --query "Parameter.Value" \
                            --output text > ./charts/affiliate-admin-v2-values.yaml
                        """
                    }

                    sh """
                        YQ_BIN=./yq_temp
                        wget https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -O \$YQ_BIN
                        chmod +x \$YQ_BIN

                        \$YQ_BIN '.env.affiliateAdminV2Service' ./charts/common-values.yaml > ./.env
                        \$YQ_BIN '.env.affiliateAdminV2Service' ./charts/affiliate-admin-v2-values.yaml > ./.env.production

                        rm -f \$YQ_BIN
                    """
                }

                stage('Build image') {
                    withEnv([
                        "REGISTRY=${registry}",
                        "BUILD_NUMBER=${currentBuild.number}",
                        "ENV_KIND=${ENV_KIND}",
                        "IMAGE_NAME=${imageNamespace}/affiliate-admin-v2",
                    ]) {
                        sh '''
                            docker build . \
                            --target production \
                            -t ${REGISTRY}/${ENV_KIND}-${IMAGE_NAME}:${BUILD_NUMBER} \
                            -t ${REGISTRY}/${ENV_KIND}-${IMAGE_NAME}:latest
                        '''.stripIndent()
                    }

                    notifySlack("BUILT the Images", parentSlackMessage)
                }

                // Pushes images to image repositories
                stage('Push images') {
                    pushImages("${imageNamespace}/affiliate-admin-v2", registry, "${ENV_KIND}", env.BUILD_NUMBER)
                    pushImages("${imageNamespace}/affiliate-admin-v2", registry, "${ENV_KIND}", "latest")

                    notifySlack("PUSHED the Images to ECR", parentSlackMessage)
                }

                // Deploys service in Kubernetes cluster
                stage('Deploy') {
                    // frontend
                    environment {
                        "ENV_KIND=${env.ENV_KIND}"
                        "BUILD_NUMBER=${env.BUILD_NUMBER}"
                    }

                    withAWS(credentials: 'user-aws-jenkins', region: 'us-east-2') {
                        sh """
                            aws eks update-kubeconfig --region us-east-2 --name telemdnow-new --kubeconfig /tmp/affiliate-admin-v2
                            helm upgrade --kubeconfig /tmp/affiliate-admin-v2 --install --atomic --wait --timeout 60m0s affiliate-admin-v2 \
                                ./charts/ \
                                -f ./charts/common-values.yaml \
                                -f ./charts/affiliate-admin-v2-values.yaml \
                                -n affiliate-admin-v2-${ENV_KIND} \
                                --create-namespace \
                                --set namespace=affiliate-admin-v2-${ENV_KIND},imageTag=${BUILD_NUMBER}
                        """
                    }

                    sh 'rm ./charts/common-values.yaml'
                    sh 'rm ./charts/affiliate-admin-v2-values.yaml'

                    notifySlack("DEPLOYED", parentSlackMessage)
                }

            } catch (Exception ex) {
                currentBuild.result = 'FAILED'
                throw ex
            } finally {
                echo "DONE"
                notifySlack(currentBuild.result, parentSlackMessage)
                notifyDiscord(currentBuild.result)
            }

        }
    }
}

def notifySlack(String buildStatus, parentSlackMessage = null) {
    buildStatus = buildStatus ?: 'SUCCEEDED' // build status of null means success
    if (ENV_KIND == 'prod') {
        SLACK_CHANNEL = '#jenkins-build-notifications'
    } else {
        SLACK_CHANNEL = '#jenkins-build-notifications'
    }

    def message = "_Job #${env.BUILD_NUMBER}_\nhas *${buildStatus}*\nfor *${env.JOB_NAME}* `${ENV_KIND}` \n\n more details: ${env.BUILD_URL}"
    def color
    if (buildStatus == 'STARTED') {
        color = '#A2D5FD'
    } else if (buildStatus == 'SUCCEEDED') {
        color = 'good'
        parentSlackMessage.addReaction("white_check_mark")
    } else if (buildStatus == 'UNSTABLE') {
        color = 'bad'
        message = message + '\n@channel';
        parentSlackMessage.addReaction("no_entry_sign")
    } else {
        message = message
        color = '#FFF18A'
    }

    if (parentSlackMessage != null && parentSlackMessage.threadId != null) {
        slackSend(channel: parentSlackMessage.threadId, color: color, message: message)
        return parentSlackMessage
    } else {
        return slackSend(channel: SLACK_CHANNEL, color: color, message: message)
    }
}

def notifyDiscord(String buildStatus) {
    buildStatus = buildStatus ?: 'SUCCESS' // build status of null means success
    if (ENV_KIND == 'prod') {
        WEBHOOKURL = "https://discord.com/api/webhooks/1336647506133647360/v03gYHoGdeOogKcBpAU5F4FCoz12LTeE_m9pup7jpNXdg1uXqzjP6qY5CL7F6d8tbOlu"
    } else {
        WEBHOOKURL = "https://discord.com/api/webhooks/1336647506133647360/v03gYHoGdeOogKcBpAU5F4FCoz12LTeE_m9pup7jpNXdg1uXqzjP6qY5CL7F6d8tbOlu"
    }

    def message = "Deployment for ${ENV_KIND} `${env.JOB_NAME}` ${buildStatus}: #${env.BUILD_NUMBER}"
    if (buildStatus == 'STARTED') {
    } else if (buildStatus == 'SUCCESS') {
    } else if (buildStatus == 'UNSTABLE') {
        message = '@telemd-builds '+message;
    } else {
        message = '@telemd-builds '+message;
    }

    // we need not use discord for current builds system.
    // discordSend(description: "$message", footer: "Details: ${env.BUILD_URL}", link: "${env.BUILD_URL}", result: buildStatus, title: "${buildStatus}: ${env.JOB_NAME}", webhookURL: "$WEBHOOKURL")
}

// Pushes images
def pushImages(String service, String registry, String repoPrefix, String tag) {
    docker.withRegistry("https://${registry}", 'ecr:us-east-2:user-aws-rancher') {
        withEnv([
            "SERVICE=${service}",
            "REGISTRY=${registry}",
            "REPOPREFIX=${repoPrefix}",
            "TAG=${tag}",
        ]) {
            sh 'docker push ${REGISTRY}/${REPOPREFIX}-${SERVICE}:${TAG}'
        }
    }
}
