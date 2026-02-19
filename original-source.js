javascript:(function(){
    if (window.location.hostname.toLowerCase().indexOf('wellsfargo') === -1) {
        alert('Site is not wells fargo. Go to wellsfargo.com first.');
        return;
    }
    if (!window.oldXHROpen) {
        window.oldXHROpen = window.XMLHttpRequest.prototype.open;
    }
    var interceptor = function(method, url, async) {
        if (url.indexOf('/edocs/documents/statement/list') !== -1) {
            this.addEventListener('load', function() {
                try {
                    var str = this.responseText;
                    var start = str.indexOf('{');
                    var end = str.lastIndexOf('}');
                    if(start === -1 || end === -1) return;
                    str = str.substring(start, end + 1);
                    str = str.replace(/\\"/g, '"');
                    var parsed = JSON.parse(str);
                    var statements = parsed.statementsDisclosuresInfo.statements;
                    
                    var accountName = "Account";
                    try {
                        var activeAccount = parsed.statementsDisclosuresInfo.accountList.find(function(acc) { return acc.selected; });
                        if (activeAccount) {
                            var raw = activeAccount.accountDisplayName.toLowerCase();
                            raw = raw.replace(/\b\w/g, function(l){ return l.toUpperCase(); });
                            accountName = raw.replace(/\s+\.{3}/, '-').replace(/[^a-zA-Z0-9\-\_ ]/g, '');
                        }
                    } catch (err) { console.log(err); }

                    var oldBtn = document.getElementById('wf-dl-btn');
                    if(oldBtn) oldBtn.parentNode.removeChild(oldBtn);
                    
                    var button = document.createElement('button');
                    button.id = 'wf-dl-btn';
                    button.textContent = "Download " + statements.length + " Statements";
                    button.style = "position:fixed; z-index:9999; right: 30px; bottom: 30px; font-size:20px; background-color:green; color: white; border-radius: 5px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); cursor:pointer;";
                    document.body.appendChild(button);

                    var cancelButton = document.createElement('button');
                    cancelButton.textContent = "X";
                    cancelButton.style = "position:fixed; z-index:9999; right: 10px; bottom: 85px; font-size:14px; background-color:red; color: white; border-radius: 50%; width:30px; height:30px; border:none; cursor:pointer;";
                    cancelButton.onclick = function() { document.body.removeChild(cancelButton); document.body.removeChild(button); };
                    document.body.appendChild(cancelButton);

                    button.onclick = function() {
                        button.disabled = true;
                        button.style.backgroundColor = 'gray';
                        button.textContent = "Starting Downloads...";
                        var delay = 0;
                        statements.forEach(function(statement, index) {
                            setTimeout(function() {
                                button.textContent = "Downloading " + (index + 1) + " of " + statements.length + "...";
                                var dataUrl = "https://connect.secure.wellsfargo.com" + statement.url;
                                
                                var datePrefix = "0000-00-00";
                                var dateMatch = statement.documentDisplayName.match(/(\d{2})\/(\d{2})\/(\d{2})/);
                                if (dateMatch) { datePrefix = "20" + dateMatch[3] + "-" + dateMatch[1] + "-" + dateMatch[2]; }
                                
                                var safeSuffix = statement.documentDisplayName.replace(/,/g, "").replace(/[:\/\\?*|"<>\(\)]/g, "").replace(/\s+/g, "_");
                                
                                /* New Order: Account Name then Date */
                                var finalFilename = "WellsFargo_Statement_" + accountName + "_" + datePrefix + "_" + safeSuffix + ".pdf";

                                fetch(dataUrl).then(function(res){ return res.blob(); }).then(function(blob) {
                                    var url = window.URL.createObjectURL(blob);
                                    var a = document.createElement('a');
                                    a.style.display = 'none';
                                    a.href = url;
                                    a.download = finalFilename;
                                    document.body.appendChild(a);
                                    a.click();
                                    setTimeout(function(){ window.URL.revokeObjectURL(url); a.parentNode.removeChild(a); }, 100);
                                }).catch(function(err){ console.error(err); });
                            }, delay);
                            delay += 2000;
                        });
                        setTimeout(function() {
                            if(document.body.contains(button)) document.body.removeChild(button);
                            if(document.body.contains(cancelButton)) document.body.removeChild(cancelButton);
                        }, delay + 2000);
                    };
                } catch (e) { console.error("Error:", e); }
            });
        }
        return window.oldXHROpen.apply(this, arguments);
    };
    if (window.XMLHttpRequest.prototype.open !== interceptor) {
        window.XMLHttpRequest.prototype.open = interceptor;
        alert("Statement Downloader Ready. Please refresh the statement list (switch years) to activate.");
    } else {
        alert('Script already active.');
    }
})();
