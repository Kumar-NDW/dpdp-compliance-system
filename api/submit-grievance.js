// api/submit-grievance.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // For hackathon demo - simulate successful submission
    const grievanceData = req.body;
    
    // Generate case reference
    const year = new Date().getFullYear();
    const randomNum = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    const caseReference = `NG-DPDP-${year}-${randomNum}`;
    
    // Log the submission (you can see this in Vercel function logs)
    console.log('Grievance submitted:', {
      caseReference,
      complainant: grievanceData.complainantName,
      category: grievanceData.category,
      timestamp: new Date().toISOString()
    });
    
    // Simulate Airtable submission (replace with real API call later)
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      // Real Airtable integration
      const airtableResponse = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Grievance%20Register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [{
            fields: {
              'Complainant Name': grievanceData.complainantName,
              'Complainant Email': grievanceData.complainantEmail,
              'Phone Number': grievanceData.complainantPhone || '',
              'Category': grievanceData.category,
              'Priority': grievanceData.priority || 'Medium',
              'Description': grievanceData.description,
              'Date Received': new Date().toISOString(),
              'Status': 'New',
              'Source': 'Web Portal',
              'Case Reference': caseReference
            }
          }]
        })
      });
      
      if (!airtableResponse.ok) {
        console.error('Airtable error:', await airtableResponse.text());
      }
    }
    
    // Simulate delay for demo effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    res.status(200).json({ 
      success: true, 
      caseReference: caseReference,
      message: 'Grievance submitted successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit grievance',
      error: error.message 
    });
  }
}
