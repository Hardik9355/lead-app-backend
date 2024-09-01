export const formatJSONResponse = (statusCode, response) => {
    return {
      statusCode,
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(response),
    };
  };
  