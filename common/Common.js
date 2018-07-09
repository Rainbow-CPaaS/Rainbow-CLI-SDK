const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

const checkNewVersion = () => {

    const name = pkg.name;
    const version = pkg.version;

    updateNotifier({
        pkg: {
            name: pkg.name,
            version: pkg.version
        },
        updateCheckInterval: 0
    }).notify({
        isGlobal: true
    });
}

module.exports = {
    checkNewVersion: checkNewVersion,
};
