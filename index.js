const aws = require('aws-sdk');

const dynamo = new aws.DynamoDB();

exports.handler = async (event) => {
    return new Promise(async (resolve, reject) => {
        let response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        };

        const done = (err, res) => {
            if (!err){
                response.body = JSON.stringify(res);
                resolve(response);
            } else {
                response.body = JSON.stringify(err);
                response.statusCode = 400;
                reject(response);
            }
        }

        switch (event.httpMethod) {
            case 'GET':
                const pageName = event.pathParameters.pageName;

                const params = {
                    Key: {
                        "headline": {
                            S: pageName
                        }
                    },
                    TableName: "yoga-pages"
                }
                dynamo.getItem(params, async (err, res) => {
                    const item = res.Item;
                    if (item){
                        const returnObject = {
                            headline: item.headline.S,
                            content: item.content.S
                        }
                        done(null, returnObject);
                    } else {
                        console.log(`No page found with headline ${pageName}`);
                        done({});
                    }
                });
                break;
            default:
                done(new Error(`Unsupported method "${event.httpMethod}"`));
        }
    });
}