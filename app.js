'use strict'


const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio')


var accountSid = 'accountSid'; // Your Account SID from www.twilio.com/console
var authToken = 'authToken';   // Your Auth Token from www.twilio.com/console
var toNumber = ['to', 'number(s)'] //['14151234567', '14151234567']
var fromNumber = 'fromNumber'      //'14151234567'


var app = express();

app.use(bodyParser.json());

app.post('/', function(request, response){
	const body = request.body
	getAttributes(body)
	response.send(request.body);    // echo the result back
});

//app.listen(3000);
app.listen(3000, function (err) {
	if (err) {
	throw err
	}

console.log('Server started on port 3000')
})

function getAttributes(body) {

	//Sameple payload
	//{ owner: 'Ugesen Pillay',
	//  severity: 'INFO',
	//  policy_url: 'https://alerts.newrelic.com/accounts/792476/policies/0',
	//  current_state: 'test',
	//  policy_name: 'New Relic Alert - Test Policy',
	//  incident_url: 'https://alerts.newrelic.com/accounts/792476/incidents/0',
	//  incident_acknowledge_url: 'https://alerts.newrelic.com/accounts/792476/incidents/0/acknowledge',
	//  targets:
	//   [ { id: '12345',
	//       name: 'Test Target',
	//       link: 'http://localhost/sample/callback/link/12345',
	//       labels: [Object],
	//       product: 'TESTING',
	//       type: 'test' } ],
	//  version: '1.0',
	//  condition_id: 0,
	//  account_id: 792476,
	//  incident_id: 0,
	//  event_type: 'NOTIFICATION',
	//  runbook_url: 'http://localhost/runbook/url',
	//  account_name: 'Yogi Pillay',
	//  details: 'New Relic Alert - Channel Test',
	//  condition_name: 'New Relic Alert - Test Condition',
	//  timestamp: 1492717671578 }


	//define and decide which variables to send via sms
	var owner = body["owner"]
	,	severity = body["severity"]
	,	policyUrl = body["policy_url"]
	,	currentState = body["current_state"]
	,	policyName = body["policy_name"]
	,	incidentUrl = body["incident_url"]
	,	incidentAcknowledgeUrl = body["incident_acknowledge_url"]
	,	accountId = body["account_id"]
	,	runbookUrl = body["runbook_url"]
	,	accountName = body["account_name"]
	,	conditionName = body["condition_name"];

	

	for (var i = 0; i < toNumber.length; i++) {	
	var toPhoneNumber = toNumber[i];
	console.log(`Sending sms to ${toPhoneNumber}`)
	sendSms(severity, incidentUrl, incidentAcknowledgeUrl, accountName, conditionName, toPhoneNumber)
	}
};

function sendSms(severity, incidentUrl, incidentAcknowledgeUrl, accountName, conditionName, toPhoneNumber){



var client = new twilio.RestClient(accountSid, authToken);

	client.messages.create({
	    body: `${severity} alert for ${accountName} - ${conditionName}! More info: ${incidentUrl}. Click to acknowledge: ${incidentAcknowledgeUrl}`,
	    to: toPhoneNumber,  // Text this number
	    from: fromNumber // From a valid Twilio number
	}, function(err, message) {
	    console.log(`Twilio Confirmation sid: ${message.sid}`);
	});

};
