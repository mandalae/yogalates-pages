const aws = require('aws-sdk');

const dynamo = new aws.DynamoDB();
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
                response.body = JSON.stringify(err);
                response.statusCode = 400;
                reject(response);
            }
        }

        const tableName = 'yogalates-pages';

        switch (event.httpMethod) {
            case 'GET':
                if (event.pathParameters && event.pathParameters.pageName) {
                    const pageName = event.pathParameters.pageName;

                    const params = {
                        Key: {
                            "name": {
                                S: pageName
                            }
                        },
                        TableName: tableName
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
                } else {
                    const params = {
                        TableName: tableName
                    }
                    docClient.scan(params, (err, data) => {
                        let items = [];
                        if (data.Items){
                            items = data.Items;
                        }
                        done(null, items);
                    });
                }
                break;
            case 'POST':
                const pageObject = JSON.parse(event.body);

                const params = {
                    TableName:tableName,
                    Item:{
                        'name': pageObject.name,
                        'headline': pageObject.headline,
                        'content': pageObject.content
                    }
                };
                console.log(params);
                console.log("Creating new page...");
                docClient.put(params, (err, data) => {
                    if (err) {
                        console.log("ERR: ", err);
                        done('Unable to create item. Error JSON: ' + JSON.stringify(err));
                    } else {
                        console.log("PutItem succeeded:", JSON.stringify(data, null, 2));
                        done(null, {success: true});
                    }
                });

                break;
            default:
                done(new Error(`Unsupported method "${event.httpMethod}"`));
        }
    });
}
