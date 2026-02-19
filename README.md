# Unofficial Wells Fargo Bulk PDF Statement Downloader (2026 Edition)

A modern JavaScript bookmarklet to download all your Wells Fargo bank statements at once with clean, organized filenames.

**WARNING:** The method used to download the script involves running our code in your browser. You should always ensure code you run like this is coming from a trusted source, and that you understand what it is doing. Use at your own risk!

## Why this version?
The original scripts for this task broke when Wells Fargo updated their security headers and moved to the Fetch API. This version fixes:
* **Smart Parsing:** Bypasses "garbage" JSON wrappers and escaped quotes.
* **Force Renaming:** Uses Blob-fetching to ensure your files are named correctly, bypassing browser security that usually defaults filenames to `033125 WellsFargo.pdf` so we can name them properly and not just gibberish.
* **Proper Formatting:** Automatically renames files to:
  `WellsFargo_Statement_Everyday Checking-6271_2025-03-31_Statement_033125_109K_PDF.pdf`

---

## How to Install

# EASY INSTALL (may not always work)
👉** [Click here to go to the Installation Page](https://bristopher.github.io/wellsfargo-bulk-PDF-statement-downloader-2/) and drag the button to your bookmarks bar!"

# Classic Install Method
1. **Show your Bookmarks Bar** (if not visible): 
   * Press `Ctrl + Shift + B` (Windows) or `Cmd + Shift + B` (Mac).
2. **Create the Bookmark**:
   * Right-click your bookmarks bar and select **"Add Page..."**.
   * **Name:** `Wells Fargo Downloader`
   * **URL:** Copy and paste the entire code block below:

```javascript
javascript:(function(){if(window.location.hostname.toLowerCase().indexOf('wellsfargo')===-1){alert('Site is not wells fargo. Go to wellsfargo.com first.');return;}if(!window.oldXHROpen){window.oldXHROpen=window.XMLHttpRequest.prototype.open;}var interceptor=function(method,url,async){if(url.indexOf('/edocs/documents/statement/list')!==-1){this.addEventListener('load',function(){try{var str=this.responseText;var start=str.indexOf('{');var end=str.lastIndexOf('}');if(start===-1||end===-1)return;str=str.substring(start,end+1);str=str.replace(/\\"/g,'"');var parsed=JSON.parse(str);var statements=parsed.statementsDisclosuresInfo.statements;var accountName="Account";try{var activeAccount=parsed.statementsDisclosuresInfo.accountList.find(function(acc){return acc.selected;});if(activeAccount){var raw=activeAccount.accountDisplayName.toLowerCase();raw=raw.replace(/\b\w/g,function(l){return l.toUpperCase();});accountName=raw.replace(/\s+\.{3}/,'-').replace(/[^a-zA-Z0-9\-\_ ]/g,'');}}catch(err){console.log(err);}var oldBtn=document.getElementById('wf-dl-btn');if(oldBtn)oldBtn.parentNode.removeChild(oldBtn);var button=document.createElement('button');button.id='wf-dl-btn';button.textContent="Download "+statements.length+" Statements";button.style="position:fixed;z-index:9999;right:30px;bottom:30px;font-size:20px;background-color:green;color:white;border-radius:5px;padding:20px;box-shadow:0 4px 6px rgba(0,0,0,0.3);cursor:pointer;";document.body.appendChild(button);var cancelButton=document.createElement('button');cancelButton.textContent="X";cancelButton.style="position:fixed;z-index:9999;right:10px;bottom:85px;font-size:14px;background-color:red;color:white;border-radius:50%;width:30px;height:30px;border:none;cursor:pointer;";cancelButton.onclick=function(){document.body.removeChild(cancelButton);document.body.removeChild(button);};document.body.appendChild(cancelButton);button.onclick=function(){button.disabled=true;button.style.backgroundColor='gray';button.textContent="Starting Downloads...";var delay=0;statements.forEach(function(statement,index){setTimeout(function(){button.textContent="Downloading "+(index+1)+" of "+statements.length+"...";var dataUrl="https://connect.secure.wellsfargo.com"+statement.url;var datePrefix="0000-00-00";var dateMatch=statement.documentDisplayName.match(/(\d{2})\/(\d{2})\/(\d{2})/);if(dateMatch){datePrefix="20"+dateMatch[3]+"-"+dateMatch[1]+"-"+dateMatch[2];}var safeSuffix=statement.documentDisplayName.replace(/,/g,"").replace(/[:\/\\?*|"<>\(\)]/g,"").replace(/\s+/g,"_");var finalFilename="WellsFargo_Statement_"+accountName+"_"+datePrefix+"_"+safeSuffix+".pdf";fetch(dataUrl).then(function(res){return res.blob();}).then(function(blob){var url=window.URL.createObjectURL(blob);var a=document.createElement('a');a.style.display='none';a.href=url;a.download=finalFilename;document.body.appendChild(a);a.click();setTimeout(function(){window.URL.revokeObjectURL(url);a.parentNode.removeChild(a);},100);}).catch(function(err){console.error(err);});},delay);delay+=2000;});setTimeout(function(){if(document.body.contains(button))document.body.removeChild(button);if(document.body.contains(cancelButton))document.body.removeChild(cancelButton);},delay+2000);};}catch(e){console.error("Error:",e);}});}return window.oldXHROpen.apply(this,arguments);};if(window.XMLHttpRequest.prototype.open!==interceptor){window.XMLHttpRequest.prototype.open=interceptor;alert("Statement Downloader Ready. Please refresh the statement list (switch years) to activate.");}else{alert('Script already active.');}})();
```

---

## How to Use

1. **Login** to your Wells Fargo account.
2. Navigate to the **"Statements and Documents"** page.
3. **Click the Bookmark** you just created. You should see an alert saying "Statement Downloader Ready."
4. **Trigger the List:** Click the **"Statements and Disclosures"** expand button (or toggle between year tabs like "2024" then back to "Recent").
5. A large **Green Download Button** will appear at the bottom right.
6. Click it and wait! The script downloads one statement every 2 seconds to ensure the browser doesn't hang and the bank doesn't block the requests.

---

## Credits & Inspiration

This project is a modern refactor of several community efforts:
* **Original Inspiration:** [binary1230/wellsfargo-bulk-PDF-statement-downloader](https://github.com/binary1230/wellsfargo-bulk-PDF-statement-downloader) (Original code by @binary1230).
* **Improved Logic:** Support for modern Fetch API, Blob-based forced renaming, and proper-case account formatting by [@benedictchen](https://github.com/benedictchen).
* **Community Contributors:** Thanks to [@trevorfox](https://github.com/trevorfox), [@figadore](https://github.com/figadore), [@burlesona](https://github.com/burlesona), and [@kupietools](https://github.com/kupietools).

*Disclaimer: This script is not affiliated with or endorsed by Wells Fargo. Use at your own risk for personal record-keeping.*

---

### SEO 
To help people find this easier
*   **Description:** "Automatically download and rename all Wells Fargo PDF statements in bulk with a single click."
*   **Topics/Tags:** `wellsfargo`, `javascript`, `bookmarklet`, `automation`, `banking`, `finance-tools`, `bulk-downloader`.
