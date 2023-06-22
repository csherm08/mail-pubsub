const { v1 } = require('@google-cloud/pubsub');
const { sendGrid } = require("./mailer");

const subClient = new v1.SubscriberClient();

module.exports.synchronousPull = async (projectId, subscriptionNameOrId, productKey) => {
  const timeoutDuration = 10*60*1000; // Timeout duration in milliseconds

  // Wrap the entire function in a Promise
  return new Promise(async (resolve, reject) => {
    // Set a timeout for the function
    const timeoutId = setTimeout(() => {
      reject(new Error('Function timed out'));
    }, timeoutDuration);

    try {
      // Your existing code here
      const formattedSubscription =
          subscriptionNameOrId.indexOf('/') >= 0
              ? subscriptionNameOrId
              : subClient.subscriptionPath(projectId, subscriptionNameOrId);

      // The maximum number of messages returned for this request.
      // Pub/Sub may return fewer than the number specified.
      const request = {
        subscription: formattedSubscription,
        maxMessages: 100,
      };
      let i = 0;

      // The subscriber pulls a specified number of messages.
      const [response] = await subClient.pull(request);
      console.log(response.receivedMessages.length);

      // Process the messages.
      const ackIds = [];
      for (const message of response.receivedMessages || []) {
        let val = JSON.parse(message.message.data);
        console.log(++i + " : " + val.to);

        await sendGrid(val.to, val.from, val.subject, val.html, productKey);

        if(message.ackId) {
          ackIds.push(message.ackId)
        }
      }

      if (ackIds.length !== 0) {
        // Acknowledge all of the messages. You could also acknowledge
        // these individually, but this is more efficient.
        const ackRequest = {
          subscription: formattedSubscription,
          ackIds: ackIds,
        };
        // console.log(ackRequest)

        await subClient.acknowledge(ackRequest);
      }
      clearTimeout(timeoutId); // Clear the timeout if the function completes successfully
      resolve(); // Resolve the Promise when the function completes successfully
    } catch (error) {
      clearTimeout(timeoutId); // Clear the timeout if an error occurs
      reject(error); // Reject the Promise with the error
    }
  });
};
