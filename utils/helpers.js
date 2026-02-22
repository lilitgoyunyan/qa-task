export function generateRandomDomain() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  const tlds = ['com', 'net', 'org', 'io'];
  const randomTld = tlds[Math.floor(Math.random() * tlds.length)];
  return `test-${timestamp}-${randomNum}.${randomTld}`;
}