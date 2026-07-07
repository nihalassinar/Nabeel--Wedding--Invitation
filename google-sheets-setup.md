# Google Sheets RSVP Integration Guide

This guide describes how to connect the RSVP form on the wedding website to a **Google Sheet** (totally free) so that all submissions are instantly saved to a spreadsheet and dynamically synchronized.

---

## Step 1: Create Your Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a **Blank Spreadsheet**.
2. Name your spreadsheet (e.g., `Nabeel & Nidha Wedding RSVPs`).
3. Set up the column headers in the first row (Row 1):
   - **Column A**: `Guest Name`
   - **Column B**: `Attending`
   - **Column C**: `Family Members`
   - **Column D**: `Total Guests`
   - **Column E**: `Submission Date`

---

## Step 2: Add the Apps Script Webhook
1. In Google Sheets, click on **Extensions** in the top menu and select **Apps Script**.
2. Erase any existing code in the editor and paste the following script:

```javascript
function doPost(e) {
  try {
    // Parse the incoming JSON post request data
    var data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet (default is active sheet)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Append the row containing the guest details
    sheet.appendRow([
      data.name,
      data.attending,
      data.familyCount,
      data.totalGuests,
      data.date
    ]);
    
    // Return success response to the website
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error message if something fails
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click the **Save** icon (floppy disk) at the top of the Apps Script page.

---

## Step 3: Deploy the Script as a Web App
1. Click the blue **Deploy** button in the top right and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure the settings:
   - **Description**: `Wedding RSVP Webhook`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: **`Anyone`** (This is crucial, otherwise the website won't be allowed to post data to it).
4. Click **Deploy**.
5. Google will ask you to authorize access. Click **Authorize access**, select your Google account, click **Advanced**, and click **Go to Untitled project (unsafe)** to grant permissions.
6. Copy the **Web App URL** shown in the final screen. It will look like this:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## Step 4: Connect the Web App URL to the Invitation Website
1. Open the [app.js](file:///C:/Users/Nihal/.gemini/antigravity/scratch/marriage-invitation/app.js) file.
2. In the RSVP form submission event listener (around line 185), add a `fetch` call pointing to your Google Sheets webhook.

Here is the exact code block to insert into [app.js](file:///C:/Users/Nihal/.gemini/antigravity/scratch/marriage-invitation/app.js):

```javascript
// Add this fetch call inside the rsvpForm.addEventListener('submit') handler:
fetch('YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE', {
    method: 'POST',
    mode: 'no-cors', // Avoids CORS browser issues
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newRsvp)
})
.then(() => console.log('Successfully synced to Google Sheets'))
.catch(err => console.error('Google Sheets sync error:', err));
```

Make sure to replace `'YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE'` with the exact URL you copied in Step 3.

---

## Step 5: (Optional) Make Dashboard Load from Google Sheet
If you want the dashboard in [admin.html](file:///C:/Users/Nihal/.gemini/antigravity/scratch/marriage-invitation/admin.html) to display RSVPs fetched directly from your Google Sheet, you can write a `doGet` function in Apps Script to return the spreadsheet rows as JSON, and fetch it from `admin.html`!
Otherwise, the local dashboard uses `localStorage` on the current machine and has a "CSV Export" file download to easily move data.
