import handler from './api/serp.js';

async function testApiSerp() {
  const req = {
    method: 'POST',
    body: {
      query: 'aesthetic clinic london uk',
      limit: 20,
      excludeDirectories: true,
      region: 'global'
    }
  };

  const res = {
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(data) {
      console.log('Status code:', this.statusCode);
      console.log('Success:', data.success);
      console.log('Total found:', data.totalFound);
      console.log('Leads found:');
      if (data.leads) {
        data.leads.forEach((lead, i) => {
          console.log(`${i + 1}. [${lead.domain}] ${lead.title} -> ${lead.url}`);
        });
      }
      if (data.error) {
        console.error('Error in response:', data.error);
      }
    }
  };

  console.log('Calling api/serp.js handler...');
  await handler(req, res);
}

testApiSerp().catch(e => console.error('Crash:', e));
