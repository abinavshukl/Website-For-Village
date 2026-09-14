const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

function loadGrievanceScript() {
  const html = `
    <!doctype html>
    <html>
      <body>
        <form id="complaintForm" novalidate>
          <input id="complainantName" />
          <input id="complainantGuardian" />
          <input id="complainantPhone" />
          <input id="voterEpicNo" />
          <input id="referenceNo" />
          <select id="issueCategory">
            <option value="">-- department --</option>
            <option value="energy">ऊर्जा</option>
          </select>
          <input id="jurisdictionDistrict" value="113-हरदोई" />
          <input id="jurisdictionTehsil" value="संडीला" />
          <input id="jurisdictionBlock" value="19-बेंहदर" />
          <input id="jurisdictionGP" value="29-बड़ागांव" />
          <textarea id="issueDescription"></textarea>
          <button id="generateDraftBtn" type="button">Generate</button>
          <button id="resetDraftBtn" type="button">Reset</button>
          <div id="formErrorBox"></div>
          <div id="draftOutputBox" style="display:none;">
            <textarea id="draftOutputText"></textarea>
          </div>
          <input type="radio" name="jurisdictionType" value="default" checked />
          <input type="radio" name="jurisdictionType" value="custom" />
          <input type="checkbox" id="enableTransliteration" />
          <button id="micBtn" type="button"><span id="micText">बोलकर लिखें</span></button>
        </form>
      </body>
    </html>
  `;

  const dom = new JSDOM(html, { url: 'http://localhost/' });
  const { window } = dom;

  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.sessionStorage = window.sessionStorage;
  global.localStorage = window.localStorage;
  global.CONFIG = { ISSUE_CATEGORIES: [{ value: 'energy', label: 'ऊर्जा' }] };
  global.showToast = () => {};
  global.lucide = { createIcons: () => {} };

  const scriptText = fs.readFileSync(path.join(__dirname, '..', 'js', 'grievance.js'), 'utf8');
  window.eval(scriptText);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

  return { window, document: window.document };
}

test('reset button clears the form and hides generated draft', () => {
  const { document } = loadGrievanceScript();

  document.getElementById('complainantName').value = 'राम कुमार';
  document.getElementById('complainantGuardian').value = 'शिव कुमार';
  document.getElementById('complainantPhone').value = '9876543210';
  document.getElementById('issueCategory').value = 'energy';
  document.getElementById('issueDescription').value = 'पानी की पाइपलाइन में लीकेज है और कई दिन से सही नहीं किया गया।';
  document.getElementById('draftOutputBox').style.display = 'block';
  document.getElementById('draftOutputText').value = 'generated draft';

  document.getElementById('resetDraftBtn').click();

  assert.equal(document.getElementById('complainantName').value, '');
  assert.equal(document.getElementById('complainantGuardian').value, '');
  assert.equal(document.getElementById('complainantPhone').value, '');
  assert.equal(document.getElementById('issueCategory').value, '');
  assert.equal(document.getElementById('issueDescription').value, '');
  assert.equal(document.getElementById('draftOutputText').value, '');
  assert.equal(document.getElementById('draftOutputBox').style.display, 'none');
});
