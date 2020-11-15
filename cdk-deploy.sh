#!/usr/bin/env bash

env_file=$1
command=$2

if ! [ $# -gt 0 ]; then
    echo "Please specify ENV_FILE"
    echo Usage:
    echo "$(basename $0)" ENV_FILE [deploy]
    echo ex:
    echo "$(basename $0)" ./env_vars/dev [deploy]
    echo ""
    exit 1
fi

if ! [[ -f "${env_file}" ]]; then
    echo file: ${env_file} does not exit
    exit 1
fi

source "${env_file}"

function get_ssm_parameter() {
    local param_name
    param_name=$1

    aws ssm get-parameter \
        --name "${param_name}" \
        --query 'Parameter.Value' \
        --with-decryption \
        --output text
}

function main() {
    cd src || exit
    git submodule update -i
    cd ../ || exit
    yarn install

    if [[ "${command}" == "deploy" ]]; then
      STAGE=${STAGE} \
      AWS_ACCOUNT=${AWS_ACCOUNT} \
      AWS_REGION=${AWS_REGION} \
      SAMPLE_STRING=${SAMPLE_STRING} \
      cdk deploy
    else
      STAGE=${STAGE} \
      AWS_ACCOUNT=${AWS_ACCOUNT} \
      AWS_REGION=${AWS_REGION} \
      SAMPLE_STRING=${SAMPLE_STRING} \
      cdk synth > template.yaml
    fi
}

main
