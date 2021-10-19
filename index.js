const fetch = require('cross-fetch');
const path = require('path')
const fs = require('fs') 
const { downloadRelease } = require('@terascope/fetch-github-release');

const versionFile = 'XUpdate-version'

const actualPath = path.parse(path.resolve('.'));


const latest_ = (version, latest) => {
    return version == latest;
}

const updater = async (name, repo, options) => {

    const res = await fetch(`https://api.github.com/repos/${name}/${repo}/releases/latest`);
    const data = await res.json();
    const latestVersion = data.tag_name;
    let version;
    if (fs.existsSync(versionFile)) {
        version = fs.readFileSync(versionFile, (e) => {
            console.error(e)
        });
    } else {
        fs.writeFileSync(versionFile, latestVersion);
        version = latestVersion;
    }

    const myVersion = version.toString('utf-8')
    const isLatest = latest_(myVersion, latestVersion);

    if (isLatest) return false;

    const outputdir = actualPath.dir;
    const leaveZipped = false;
    const disableLogging = false;


    function filterRelease(release) {
        return release.prerelease === false;
    }
    function filterAsset(asset) {
        return asset.name.includes(process.platform);
    }
    let a;
    downloadRelease(name,repo,outputdir,filterRelease, filterAsset, leaveZipped, disableLogging)
    .then(function() {
         a = true
      })
      .catch(function(err) {
        console.error(err.message);
      });
      return a
}

exports.updater = updater