function readPackage(pkg) {
  if (pkg.name === 'wouter' && pkg.version === '3.7.1') {
    pkg.peerDependencies = pkg.peerDependencies || {};
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
