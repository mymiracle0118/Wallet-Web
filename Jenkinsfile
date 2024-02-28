pipeline {
    agent {
        label 'xlarge'
    }

    environment {
        AWS_REGION = 'us-east-1'
        DOCKER_BUILDKIT = '1'
        APP_ID_BETA = 'hcjhpkgbmechpabifbggldplacolbkoh'
        APP_ID_ALPHA = 'chkgjfeacmiiflefonpeeojeknaiappe'
        CLIENT_ID = credentials('wallet-client-id')
        CLIENT_SECRET = credentials('wallet-client-secret')
        REFRESH_TOKEN = credentials('wallet-client-token')
        CODECOV_TOKEN = credentials('wallet-codecov-token')
    }

    options {
        //skipStagesAfterUnstable()
        disableConcurrentBuilds()
        ansiColor('xterm')
    }

    stages {
        stage('Setup parameters') {
            steps {
                script {
                    properties([
                        parameters([
                            booleanParam(
                                defaultValue: false,
                                description: '',
                                name: 'BUILD_ALPHA'
                            ),
                        ])
                    ])
                }
            }
        }

        stage ('Pre-Publish') {
            agent {
                dockerfile true
            }

            stages {
                stage ('Install') {
                    steps {
                        sh 'yarn install --frozen-lockfile'
                    }
                }

                stage ('Tests') {
                    steps {
                        sh 'cd portal-extension && yarn test --ci --runInBand --reporters=default --reporters="jest-junit" --testResultsProcessor="jest-junit" --coverage --colors --silent'
                    }
                }

                //stage ('Build Storybook') {
                //    steps {
                //        sh "test -n \"$WORKSPACE/storybook-static\" && rm -rf \"$WORKSPACE\"/storybook-static/*"
                //        sh 'yarn build:storybook'
                //    }
                //}

                stage ('Build QA/PR Extension') {
                    when {
                        beforeAgent true
                        anyOf {
                            branch 'master'
                            branch 'PR-*'
                            expression { return params.BUILD_ALPHA }
                        }
                    }

                    steps {
                        sh "BUILD_ALPHA=true yarn build-zip"
                        sh 'yarn zip-extension'
                        archiveArtifacts artifacts: 'extension.zip', fingerprint: true
                        s3Upload bucket: 'frontend-wallet-web-extension',
                            file: 'extension.zip',
                            path: "${BRANCH_NAME}/extension.zip"
                    }
                }

                 stage ('Build Release Extension') {
                    when {
                        beforeAgent true
                        buildingTag()
                    }

                    steps {
                        sh "yarn build-zip"
                        sh 'yarn zip-extension'
                        archiveArtifacts artifacts: 'extension.zip', fingerprint: true
                        s3Upload bucket: 'frontend-wallet-web-extension',
                            file: 'extension.zip',
                            path: "${RELEASE_TAG}/extension.zip"
                    }
                }
            }

            post {
                always {
                    sh "/usr/local/bin/codecov -t ${CODECOV_TOKEN} -s ./portal-extension/coverage/"
                    junit testResults: '**/portal-extension/junit.xml', skipPublishingChecks: true
                }
            }
        }

//         stage('e2e') {
//             when {
//                 beforeAgent true
//                 anyOf {
//                     branch 'master'
//                     branch 'PR-*'
//                     expression { return params.BUILD_ALPHA }
//                 }
//             }
//
//             environment {
//                 RUN_ID="${BRANCH_NAME}-${BUILD_NUMBER}"
//                 EXTENSION_PATH="https://frontend-wallet-web-extension.s3.amazonaws.com/${BRANCH_NAME}/extension.zip"
//             }
//
//             steps {
//                 sh  """
//                     export AWS_JSON=\$(TEMP_TOKEN=`curl --silent -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` && curl --silent -H "X-aws-ec2-metadata-token: \$TEMP_TOKEN" –v http://169.254.169.254/latest/meta-data/iam/security-credentials/jenkins-access-role)
//                     export AWS_ACCESS_KEY_ID=\$(echo "\$AWS_JSON" | jq -r '.AccessKeyId')
//                     export AWS_SECRET_ACCESS_KEY=\$(echo "\$AWS_JSON" | jq -r '.SecretAccessKey')
//                     export AWS_SESSION_TOKEN=\$(echo "\$AWS_JSON" | jq -r '.Token')
//                     aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 791130745354.dkr.ecr.us-east-1.amazonaws.com
//                     docker run -v ${WORKSPACE}/allure-results:/tmp/allure-results-${RUN_ID} -e RUN_ID=${RUN_ID} -e EXTENSION_LINK=${EXTENSION_PATH} -e EXTENSION_PATH=${EXTENSION_PATH} -e AWS_ACCESS_KEY_ID=\$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=\$AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN=\$AWS_SESSION_TOKEN -t 791130745354.dkr.ecr.us-east-1.amazonaws.com/serverless-playwright-aws-ui-wallet-dev:playwright-aws005
//                     sudo chown ec2-user:ec2-user allure-results -R
//                 """
//                 allure includeProperties: false, jdk: 'java', results: [[path: 'allure-results']]
//             }
//         }

        stage ('Deploy Alpha') {
           when {
               beforeAgent true
               anyOf {
                   branch 'master'
                   expression { return params.BUILD_ALPHA }
               }
           }

           agent {
               docker {
                   image 'cibuilds/chrome-extension:latest'
               }
           }

           steps {
               s3Download bucket: 'frontend-wallet-web-extension',
                   file: 'extension.zip',
                   path: "${BRANCH_NAME}/extension.zip",
                   force: true

               sh  '''
                   ACCESS_TOKEN=$(curl --silent "https://accounts.google.com/o/oauth2/token" -d "client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&refresh_token=${REFRESH_TOKEN}&grant_type=refresh_token&redirect_uri=urn:ietf:wg:oauth:2.0:oob" | jq -r .access_token)
                   echo $ACCESS_TOKEN
                   curl -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "x-goog-api-version: 2" -X PUT -T extension.zip -v "https://www.googleapis.com/upload/chromewebstore/v1.1/items/${APP_ID_ALPHA}"
                   curl -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "x-goog-api-version: 2" -H "Content-Length: 0" -X POST -v "https://www.googleapis.com/chromewebstore/v1.1/items/${APP_ID_ALPHA}/publish"
               '''
           }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
