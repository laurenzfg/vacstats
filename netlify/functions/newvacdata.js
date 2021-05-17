exports.handler = async function(event, context) {
    console.log("Received New Vac Data Trigger from API");
    return {
        statusCode: 200,
    	body: JSON.stringify({message: "Hello World"})
    };
}
