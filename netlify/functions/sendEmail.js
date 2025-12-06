const sgMail = require("@sendgrid/mail");

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const {
      unitNumber,
      ownerName,
      ownerContact,
      ownerEmail,
      lesseeName,
      lesseeContact,
      lesseeEmail,
      incidentDesc,
      propertyDesc,
      otherInfo,
    } = data;

    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const message = {
      to: process.env.TO_EMAIL || "elandre@conciseloss.co.za",
      from: process.env.FROM_EMAIL || process.env.TO_EMAIL || "no-reply@example.com",
      subject: `New Claim: Unit ${unitNumber} - Storm Damage`,
      text:
        `CONCISE LOSS ADJUSTERS - NEW CLAIM REPORT\n` +
        `----------------------------------------\n` +
        `UNIT DETAILS\n` +
        `Unit Number: ${unitNumber}\n\n` +
        `OWNER DETAILS\n` +
        `Name: ${ownerName || 'N/A'}\n` +
        `Contact: ${ownerContact || 'N/A'}\n` +
        `Email: ${ownerEmail || 'N/A'}\n\n` +
        `LESSEE DETAILS (If Applicable)\n` +
        `Name: ${lesseeName || 'N/A'}\n` +
        `Contact: ${lesseeContact || 'N/A'}\n` +
        `Email: ${lesseeEmail || 'N/A'}\n\n` +
        `INCIDENT REPORT\n` +
        `Description: ${incidentDesc}\n\n` +
        `DAMAGE ASSESSMENT\n` +
        `Damaged Items: ${propertyDesc}\n\n` +
        `OTHER INFORMATION (Urgency / Prevention)\n` +
        `Notes: ${otherInfo || 'None provided'}\n` +
        `----------------------------------------\n` +
        `Submitted via Concise Triage App`,
    };

    await sgMail.send(message);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Unknown error' }),
    };
  }
};
