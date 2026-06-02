const dns = require('dns');
const { Resolver } = require('dns').promises;
const resolver = new Resolver();
resolver.setServers(['8.8.8.8']);

async function testDNS() {
  try {
    console.log('Testing DNS lookup with Google (8.8.8.8)...');
    const addresses = await resolver.resolveSrv('_mongodb._tcp.cluster0.o2f8p4p.mongodb.net');
    console.log('SRV Lookup Success:', addresses);
  } catch (err) {
    console.error('SRV Lookup Failed:', err);
  }
}

testDNS();
