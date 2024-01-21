const { error } = require("console");
const fs = require("fs");
const Papa = require("papaparse");
const { resolve } = require("path");

const parseCSV = (filePath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) reject(err);
			else {
				Papa.parse(data, {
					header: true,
					complete: (results) => { resolve(results.data) },
					error: (error) => { reject(error); }
				});
			}
		});
	});
};

const merge = (dearData, shopifyData) => {
	let merged = dearData.map(dearItem => {
		const shopifyMatch = shopifyData.find(item => item.ProductCode === dearItem.ProductCode);
		return shopifyMatch ? { ...dearItem, ...shopifyMatch, _merge: 'both' } : { ...dearItem, _merge: 'dear' };
	});

	const shopifyDataUnique = shopifyData.filter(
		shopifyItem => !merged.some(item => item.ProductCode === shopifyItem.ProductCode)
	).map(shopifyItem => ({ ...shopifyItem, _merge: 'shopify' }));

	merged = merged.concat(shopifyDataUnique);

	return merged;
}

const compareInventoryFiles = async (dearPath, shopifyPath) => {
	try {
		let dearData = await parseCSV(dearPath);
		let shopifyData = await parseCSV(shopifyPath);
		shopifyData = shopifyData.map(item => ({
			...item,
			ProductCode: item['Variant SKU']
		}));

		const mergedData = merge(dearData, shopifyData);
		const commonProduct = mergedData.filter(item => item._merge === 'both');
		const uniqueDear = mergedData.filter(item => item._merge === 'dear');
		const uniqueShopify = mergedData.filter(item => item._merge === 'shopify');
		return { commonProduct, uniqueDear, uniqueShopify }
	} catch (error) {
		console.error('Error comparing inventory files:', error);
		throw error;
	}
};

module.exports = {
	compareInventoryFiles,
};
