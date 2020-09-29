const aws = require('aws-sdk');

const docClient = new aws.DynamoDB.DocumentClient();

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
                response.body = err.message;
                response.statusCode = 400;
                reject(response);
            }
        }

        switch (event.httpMethod) {
            case 'GET':
                console.log(event);
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
                        resolve(item)
                    } else {
                        console.log(`No page found with headline ${pageName}`);
                        reject({});
                    }
                });
                break;
            default:
                done(new Error(`Unsupported method "${event.httpMethod}"`));
        }
    });
}