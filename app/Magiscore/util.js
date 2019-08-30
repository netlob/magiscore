const { URL } = require('url');

function extractQueryParameter(url, parameter) {
	const parsedUrl = new URL(url)

	return parsedUrl.searchParams.get(parameter)
}
module.exports.extractQueryParameter = extractQueryParameter;