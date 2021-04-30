/**
 * Taken from https://github.com/dependabot/dependabot-core/issues/1973#issuecomment-675808510 and adapted.
 */

const semver = require('semver');

/**
 * Determine the update type ("major", "premajor", "minor", "preminor", "patch", "prepatch", or "prerelease")
 */
function parseUpdateType(x) {
  const regex = /^Bumps\s.*\sfrom\s(.*)\sto\s(.*)\./;
  const match = x.match(regex);
  const prevVersion = match[1];
  const newVersion = match[2];

  return semver.diff(prevVersion, newVersion);
}

/**
 * Usage:
 * ```
 * // When allowed update type is "major"
 * isUpdateTypeAllowed('major', 'major') // true
 * isUpdateTypeAllowed('major', 'minor') // true
 * isUpdateTypeAllowed('major', 'patch') // true
 *
 * // When allowed update type is "minor"
 * isUpdateTypeAllowed('minor', 'major') // false
 * isUpdateTypeAllowed('minor', 'minor') // true
 * isUpdateTypeAllowed('minor', 'patch') // true
 *
 * // When allowed update type is "patch"
 * isUpdateTypeAllowed('patch', 'major') // false
 * isUpdateTypeAllowed('patch', 'minor') // false
 * isUpdateTypeAllowed('patch', 'patch') // true
 * ```
 */
function isUpdateTypeAllowed(allowedUpdateType, updateType) {
  const updateTypes = [
    'major', 'premajor',
    'minor', 'preminor',
    'patch', 'prepatch',
    'prerelease',
  ];

  return updateTypes.includes(allowedUpdateType) && updateTypes.includes(updateType) &&
    updateTypes.indexOf(allowedUpdateType) <= updateTypes.indexOf(updateType);
}

module.exports = {
  parseUpdateType,
  isUpdateTypeAllowed
};
