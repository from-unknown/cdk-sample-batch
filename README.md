# SampleBatchデプロイ用CDK

**注意：これは正常に動作していたCDKから必要な情報をマスクしたもののため、動作確認は各自でお願いします。**

構成は  
- CloudWatch （指定の時刻に実行）
- ECS+Fargate

特徴として既存のVPCを設定するため、VPC内に設置されているDBにアクセスできます。  

各環境にデプロイするために `cdk-deploy.sh` を作成しました。  
使い方として `cdk-deploy.sh env_vars/xxx` で `cdk synth` が実行され、 `template.yml` が生成されます（デプロイはされません、CDKが正しいかテストに使用してください）。  
デプロイする時は `cdk-deploy.sh env_vars/xxx deploy` を実行してください。  

新しくデプロイする環境を追加する際は `env_vars` 配下に環境変数を追加してください。  
デプロイ中に使用される変数関連は `cdk.json` にまとまっているので、既に設定されている環境（例：develop）からコピーして環境毎の値をセットしてください。  
オブジェクトにセットした名（例：開発環境の場合 `develop` ）は環境変数の `STAGE` と一致している必要がありますので注意してください。  

以下CDKのREADMEの原文ママ  

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
