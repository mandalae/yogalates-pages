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
                const pageName = event.queryStringParameters.pageName;

                var params = {
                    TableName: "yogalates-pages"
                };

                docClient.scan(params, (err, data) => {
                    let items = [];
                    if (data.Items){
                        items = data.Items;
                    }
                    console.log(err, items);
                    done(null, items);
                });
                break;
            default:
                done(new Error(`Unsupported method "${event.httpMethod}"`));
        }
    });
}